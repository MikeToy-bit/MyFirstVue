# CommonTable 组件使用指南

`CommonTable` 是一个功能强大的可复用 Vue 表格组件，基于 Element Plus 的 Table 组件和我们的表格管理器系统构建，提供了完整的表格功能支持。

## 目录

-   [功能特性](#功能特性)
-   [基础用法](#基础用法)
-   [配置选项](#配置选项)
-   [插槽系统](#插槽系统)
-   [事件系统](#事件系统)
-   [高级用法](#高级用法)
-   [最佳实践](#最佳实践)

## 功能特性

✅ **API 集成** - 自动数据获取和分页  
✅ **搜索系统** - 多种搜索字段类型支持  
✅ **动态列配置** - 灵活的列显示和格式化  
✅ **选择模式** - 单选、多选、无选择  
✅ **插槽系统** - 高度可定制的内容  
✅ **事件系统** - 完整的事件监听  
✅ **响应式设计** - 移动端友好  
✅ **Element Plus 兼容** - 完整支持所有 Table 属性

## 基础用法

### 1. 最简单的表格

```vue
<template>
    <CommonTable :api-function="queryUsers" :columns="columns" />
</template>

<script>
import CommonTable from "@/components/CommonTable.vue";
import { queryUsers } from "@/api/user";

export default {
    components: { CommonTable },
    setup() {
        const columns = [
            { prop: "name", label: "姓名", width: 120 },
            { prop: "email", label: "邮箱", width: 200 },
            { prop: "createTime", label: "创建时间", width: 180 },
        ];

        return { queryUsers, columns };
    },
};
</script>
```

### 2. 带搜索的表格

```vue
<template>
    <CommonTable
        :api-function="queryUsers"
        :search-fields="searchFields"
        :columns="columns"
    />
</template>

<script>
export default {
    setup() {
        const searchFields = [
            { prop: "name", label: "姓名", type: "input" },
            {
                prop: "status",
                label: "状态",
                type: "select",
                options: [
                    { label: "启用", value: "active" },
                    { label: "禁用", value: "inactive" },
                ],
            },
            {
                prop: "createTimeRange",
                label: "创建时间",
                type: "daterange",
                startField: "startTime",
                endField: "endTime",
            },
        ];

        const columns = [
            { prop: "name", label: "姓名", width: 120 },
            { prop: "status", label: "状态", width: 100 },
            { prop: "createTime", label: "创建时间", width: 180 },
        ];

        return { searchFields, columns };
    },
};
</script>
```

## 配置选项

### API 配置

| 属性          | 类型       | 默认值              | 说明               |
| ------------- | ---------- | ------------------- | ------------------ |
| `apiFunction` | `Function` | -                   | **必需**，API 函数 |
| `apiParams`   | `Object`   | `{}`                | API 默认参数       |
| `dataField`   | `String`   | `'data.items'`      | 数据字段路径       |
| `totalField`  | `String`   | `'data.totalCount'` | 总数字段路径       |

### 搜索配置

| 属性                      | 类型      | 默认值       | 说明           |
| ------------------------- | --------- | ------------ | -------------- |
| `searchFields`            | `Array`   | `[]`         | 搜索字段配置   |
| `searchTitle`             | `String`  | `'搜索条件'` | 搜索区域标题   |
| `searchInline`            | `Boolean` | `false`      | 是否内联布局   |
| `searchColsPerRow`        | `Number`  | `3`          | 每行显示字段数 |
| `searchCollapseThreshold` | `Number`  | `6`          | 折叠阈值       |
| `showSearch`              | `Boolean` | `true`       | 是否显示搜索   |

### 表格配置

| 属性              | 类型      | 默认值                         | 说明                    |
| ----------------- | --------- | ------------------------------ | ----------------------- |
| `columns`         | `Array`   | -                              | **必需**，列配置        |
| `tableTitle`      | `String`  | `'数据列表'`                   | 表格标题                |
| `showTableHeader` | `Boolean` | `true`                         | 是否显示表格头部        |
| `tableProps`      | `Object`  | `{stripe: true, border: true}` | Element Plus Table 属性 |

### 选择配置

| 属性                   | 类型            | 默认值       | 说明                           |
| ---------------------- | --------------- | ------------ | ------------------------------ |
| `selectionMode`        | `String`        | `'multiple'` | 选择模式：single/multiple/none |
| `selectionColumnWidth` | `Number/String` | `55`         | 选择列宽度                     |
| `rowKey`               | `String`        | `'id'`       | 行唯一标识字段                 |

### 分页配置

| 属性               | 类型      | 默认值                                      | 说明         |
| ------------------ | --------- | ------------------------------------------- | ------------ |
| `showPagination`   | `Boolean` | `true`                                      | 是否显示分页 |
| `pageSize`         | `Number`  | `10`                                        | 每页大小     |
| `pageSizes`        | `Array`   | `[10, 20, 50, 100]`                         | 可选页面大小 |
| `paginationLayout` | `String`  | `'total, sizes, prev, pager, next, jumper'` | 分页布局     |

## 插槽系统

### 搜索插槽

#### `search-{fieldName}`

自定义搜索字段

```vue
<template #search-status="{ value, setValue }">
    <el-select :model-value="value" @change="setValue">
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="inactive" />
    </el-select>
</template>
```

#### `search-actions`

自定义搜索按钮区域

```vue
<template #search-actions="{ search, reset, refresh }">
    <el-button type="primary" @click="search">查询</el-button>
    <el-button @click="reset">重置</el-button>
    <el-button type="info" @click="exportData">导出</el-button>
</template>
```

### 表格插槽

#### `table-header`

自定义表格头部

```vue
<template #table-header="{ selectedRows, refresh }">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-button @click="refresh">刷新</el-button>
</template>
```

#### `toolbar`

工具栏区域

```vue
<template #toolbar="{ selectedRows, hasSelection }">
    <el-button type="danger" :disabled="!hasSelection">批量删除</el-button>
    <el-button type="info">导出数据</el-button>
</template>
```

#### 列插槽

自定义列内容

```vue
<template #status="{ value, row }">
    <el-tag :type="value === 'active' ? 'success' : 'danger'">
        {{ value === "active" ? "启用" : "禁用" }}
    </el-tag>
</template>
```

#### `actions`

操作列

```vue
<template #actions="{ row, index }">
    <el-button type="primary" size="small" @click="handleEdit(row)">
        编辑
    </el-button>
    <el-button type="danger" size="small" @click="handleDelete(row)">
        删除
    </el-button>
</template>
```

## 事件系统

### 数据事件

-   `data-loaded(data, total)` - 数据加载完成
-   `error(error)` - 数据加载错误

### 搜索事件

-   `search(searchParams)` - 执行搜索
-   `reset()` - 重置搜索
-   `refresh()` - 刷新数据

### 选择事件

-   `selection-change(selectedRows)` - 选择变化
-   `current-change(currentRow, oldCurrentRow)` - 当前行变化

### 表格事件

-   `sort-change(sortInfo)` - 排序变化
-   `filter-change(filters)` - 过滤变化
-   `row-click(row, column, event)` - 行点击
-   `row-dblclick(row, column, event)` - 行双击
-   `link-click(row, column)` - 链接点击

## 高级用法

### 1. 搜索字段类型

#### 输入框

```javascript
{ prop: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' }
```

#### 选择器

```javascript
{
    prop: 'status',
    label: '状态',
    type: 'select',
    options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
    ]
}
```

#### 日期选择器

```javascript
{ prop: 'createTime', label: '创建时间', type: 'date' }
```

#### 日期范围选择器

```javascript
{
    prop: 'createTimeRange',
    label: '创建时间',
    type: 'daterange',
    startField: 'startTime',
    endField: 'endTime'
}
```

#### 数字输入框

```javascript
{ prop: 'age', label: '年龄', type: 'number', min: 0, max: 150 }
```

#### 自定义插槽

```javascript
{ prop: 'status', label: '状态', type: 'slot' }
```

### 2. 列配置类型

#### 基础列

```javascript
{ prop: 'name', label: '姓名', width: 120 }
```

#### 格式化列

```javascript
{
    prop: 'createTime',
    label: '创建时间',
    formatter: (value) => new Date(value).toLocaleString()
}
```

#### 标签列

```javascript
{
    prop: 'status',
    label: '状态',
    tag: {
        type: (value) => value === 'active' ? 'success' : 'danger',
        formatter: (value) => value === 'active' ? '启用' : '禁用'
    }
}
```

#### 链接列

```javascript
{
    prop: 'name',
    label: '姓名',
    link: { type: 'primary' }
}
```

#### 插槽列

```javascript
{ prop: 'status', label: '状态', slot: 'status' }
```

### 3. 组件方法调用

```vue
<template>
    <CommonTable ref="tableRef" />
</template>

<script>
export default {
    setup() {
        const tableRef = ref();

        const refreshTable = () => {
            tableRef.value.refresh();
        };

        const getSelectedRows = () => {
            return tableRef.value.getSelectedRows();
        };

        const clearSelection = () => {
            tableRef.value.clearSelection();
        };

        return {
            tableRef,
            refreshTable,
            getSelectedRows,
            clearSelection,
        };
    },
};
</script>
```

### 4. 完整示例

```vue
<template>
    <CommonTable
        ref="tableRef"
        :api-function="queryUsers"
        :search-fields="searchFields"
        :columns="columns"
        table-title="用户管理"
        selection-mode="multiple"
        :show-actions="true"
        :show-toolbar="true"
        :table-props="tableProps"
        @data-loaded="onDataLoaded"
        @selection-change="onSelectionChange"
        @search="onSearch"
    >
        <!-- 自定义搜索字段 -->
        <template #search-status="{ value, setValue }">
            <el-select :model-value="value" @change="setValue">
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
            </el-select>
        </template>

        <!-- 自定义列 -->
        <template #status="{ value }">
            <el-tag :type="value === 'active' ? 'success' : 'danger'">
                {{ value === "active" ? "启用" : "禁用" }}
            </el-tag>
        </template>

        <!-- 操作列 -->
        <template #actions="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
                编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
                删除
            </el-button>
        </template>

        <!-- 工具栏 -->
        <template #toolbar="{ selectedRows, hasSelection }">
            <el-button type="primary">新增</el-button>
            <el-button type="danger" :disabled="!hasSelection">
                批量删除 ({{ selectedRows.length }})
            </el-button>
        </template>
    </CommonTable>
</template>

<script>
import { ref } from "vue";
import CommonTable from "@/components/CommonTable.vue";
import { queryUsers } from "@/api/user";

export default {
    components: { CommonTable },
    setup() {
        const tableRef = ref();

        const searchFields = [
            { prop: "name", label: "姓名", type: "input" },
            { prop: "email", label: "邮箱", type: "input" },
            { prop: "status", label: "状态", type: "slot" },
            {
                prop: "createTimeRange",
                label: "创建时间",
                type: "daterange",
                startField: "startTime",
                endField: "endTime",
            },
        ];

        const columns = [
            { prop: "name", label: "姓名", width: 120 },
            { prop: "email", label: "邮箱", width: 200 },
            { prop: "status", label: "状态", width: 100, slot: "status" },
            {
                prop: "createTime",
                label: "创建时间",
                width: 180,
                formatter: (value) => new Date(value).toLocaleString(),
            },
        ];

        const tableProps = {
            stripe: true,
            border: true,
            height: "500px",
            "highlight-current-row": true,
        };

        const onDataLoaded = (data, total) => {
            console.log("数据加载完成:", { count: data.length, total });
        };

        const onSelectionChange = (selectedRows) => {
            console.log("选择变化:", selectedRows.length);
        };

        const onSearch = (searchParams) => {
            console.log("搜索参数:", searchParams);
        };

        const handleEdit = (row) => {
            console.log("编辑用户:", row);
        };

        const handleDelete = (row) => {
            console.log("删除用户:", row);
        };

        return {
            tableRef,
            queryUsers,
            searchFields,
            columns,
            tableProps,
            onDataLoaded,
            onSelectionChange,
            onSearch,
            handleEdit,
            handleDelete,
        };
    },
};
</script>
```

## 最佳实践

### 1. 性能优化

```javascript
// 对于大数据量，使用虚拟滚动
const tableProps = {
    height: "500px",
    "show-overflow-tooltip": true,
};

// 延迟加载非关键列
const columns = [
    { prop: "name", label: "姓名", width: 120 },
    { prop: "email", label: "邮箱", width: 200 },
    { prop: "details", label: "详情", slot: "details", lazy: true },
];
```

### 2. 错误处理

```javascript
const onError = (error) => {
    console.error("表格数据加载失败:", error);
    ElMessage.error("数据加载失败，请稍后重试");
};
```

### 3. 搜索优化

```javascript
// 使用防抖搜索
import { debounce } from "@/utils/common";

const debouncedSearch = debounce((searchParams) => {
    // 执行搜索
}, 500);
```

### 4. 响应式设计

```javascript
// 移动端适配
const isMobile = computed(() => window.innerWidth < 768);

const tableProps = computed(() => ({
    size: isMobile.value ? "small" : "default",
    "show-overflow-tooltip": isMobile.value,
}));
```

### 5. 类型安全

```typescript
// TypeScript 支持
interface SearchField {
    prop: string;
    label: string;
    type: "input" | "select" | "date" | "daterange" | "number" | "slot";
    options?: Array<{ label: string; value: any }>;
    placeholder?: string;
}

interface Column {
    prop: string;
    label: string;
    width?: number | string;
    formatter?: (value: any, row: any) => string;
    slot?: string;
}
```

这个 `CommonTable` 组件为您提供了一个功能完整、高度可配置的表格解决方案，可以大大减少重复的表格代码编写工作。

## 搜索区域配置

搜索区域采用 Element Plus 的 24 格栅格系统布局，每个搜索字段占 6 格，一行最多显示 4 个字段。

### 基础配置

```javascript
const searchFields = [
    {
        prop: "name", // 字段属性名
        label: "姓名", // 字段标签
        type: "input", // 字段类型
        placeholder: "请输入姓名", // 占位符
        clearable: true, // 是否可清空
        props: {}, // 额外的Element Plus组件属性
    },
];
```

### 响应式布局

-   **桌面端（≥1200px）**：每行显示 4 个字段（每个字段占 6 格）
-   **平板端（769px-1199px）**：每行显示 2 个字段（每个字段占 12 格）
-   **移动端（≤768px）**：每行显示 1 个字段（每个字段占 24 格）
