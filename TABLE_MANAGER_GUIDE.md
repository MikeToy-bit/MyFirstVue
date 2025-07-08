# 表格管理器使用指南

这是一个强大的表格管理系统，封装在 `common.js` 中，提供了完整的表格数据管理、分页、搜索、选择等功能。

## 目录

-   [核心功能](#核心功能)
-   [快速开始](#快速开始)
-   [详细配置](#详细配置)
-   [API 参考](#api参考)
-   [使用示例](#使用示例)
-   [预设配置](#预设配置)
-   [最佳实践](#最佳实践)

## 核心功能

✅ **API 集成**: 自动调用 API 获取数据  
✅ **分页管理**: 完整的分页功能支持  
✅ **搜索过滤**: 动态搜索参数管理  
✅ **选择模式**: 支持单选、多选、无选择  
✅ **加载状态**: 统一的加载状态管理  
✅ **错误处理**: 完善的错误处理机制  
✅ **事件回调**: 丰富的生命周期回调  
✅ **数据导出**: 内置 CSV 导出功能  
✅ **响应式**: Vue 3 组合式 API 支持

## 快速开始

### 1. 基础使用

```javascript
import { createTableManager } from "@/utils/common";
import { queryUsers } from "@/api/user";

// 创建表格管理器
const tableManager = createTableManager({
    apiFunction: queryUsers,
    pageSize: 10,
    selectionMode: "multiple",
});

// 加载数据
tableManager.loadData();
```

### 2. 使用预设配置

```javascript
import { createPresetTableManager } from "@/utils/common";

// 使用标准列表预设
const tableManager = createPresetTableManager("standardList", {
    apiFunction: queryUsers,
    loadingKey: "userTable",
});
```

### 3. Vue 3 组合式 API 使用

```javascript
import { useTableManager } from "@/utils/common";

export default {
    setup() {
        const {
            tableData,
            loading,
            pagination,
            selectedRows,
            handleCurrentChange,
            handleSizeChange,
            handleSelectionChange,
            search,
            refresh,
        } = useTableManager({
            apiFunction: queryUsers,
            pageSize: 10,
            selectionMode: "multiple",
        });

        return {
            tableData,
            loading,
            pagination,
            selectedRows,
            handleCurrentChange,
            handleSizeChange,
            handleSelectionChange,
            search,
            refresh,
        };
    },
};
```

## 详细配置

### 完整配置选项

```javascript
const config = {
    // API相关配置
    apiFunction: queryUsers, // API函数
    apiParams: { status: "active" }, // API默认参数

    // 数据字段配置
    dataField: "data.items", // 数据字段路径
    totalField: "data.totalCount", // 总数字段路径

    // 分页配置
    pageIndex: 1, // 初始页码
    pageSize: 10, // 每页大小
    pageSizes: [10, 20, 50, 100], // 可选每页大小

    // 选择模式配置
    selectionMode: "multiple", // 'single', 'multiple', 'none'

    // 加载配置
    loadingKey: "tableLoading", // 加载状态键
    autoLoad: true, // 是否自动加载
    showMessage: true, // 是否显示消息

    // 事件回调
    onDataLoad: (data, total) => {}, // 数据加载完成回调
    onError: (error) => {}, // 错误处理回调
    onSelectionChange: (selection) => {}, // 选择变化回调
    beforeLoad: (params) => {}, // 加载前回调
    afterLoad: (data, total) => {}, // 加载后回调
};
```

## API 参考

### TableManager 类方法

#### 数据操作

-   `loadData(params, resetPage)` - 加载数据
-   `search(searchParams)` - 搜索数据
-   `refresh()` - 刷新数据
-   `resetSearch()` - 重置搜索

#### 分页操作

-   `changePage(page)` - 切换页码
-   `changePageSize(size)` - 切换每页大小

#### 选择操作

-   `handleSelectionChange(selection)` - 处理选择变化
-   `getSelectedRows()` - 获取选中行
-   `getSelectedIds(idField)` - 获取选中 ID
-   `clearSelection()` - 清空选择

#### 状态获取

-   `getData()` - 获取表格数据
-   `getPagination()` - 获取分页信息
-   `getLoading()` - 获取加载状态
-   `getState()` - 获取完整状态

#### 配置管理

-   `setApiFunction(apiFunction, defaultParams)` - 设置 API 函数
-   `destroy()` - 销毁管理器

### 工具函数

#### tableHelpers

-   `formatTableData(data, formatters)` - 格式化表格数据
-   `generateColumns(columns)` - 生成表格列配置
-   `exportTableData(data, columns, filename)` - 导出表格数据

## 使用示例

### 1. 完整的 Vue 组件示例

```vue
<template>
    <div>
        <!-- 搜索表单 -->
        <el-form :model="searchForm" inline>
            <el-form-item label="名称">
                <el-input v-model="searchForm.name" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table
            :data="tableData"
            v-loading="loading"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="createTime" label="创建时间" />
        </el-table>

        <!-- 分页 -->
        <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { createTableManager } from "@/utils/common";
import { queryData } from "@/api/data";

export default {
    setup() {
        const searchForm = reactive({ name: "" });

        // 创建表格管理器
        const tableManager = createTableManager({
            apiFunction: queryData,
            pageSize: 10,
            selectionMode: "multiple",
            onDataLoad: syncState,
            onSelectionChange: syncState,
        });

        // 响应式状态
        const tableData = ref([]);
        const loading = ref(false);
        const pagination = reactive({
            currentPage: 1,
            pageSize: 10,
            total: 0,
            pageSizes: [10, 20, 50],
        });

        // 同步状态
        const syncState = () => {
            const state = tableManager.getState();
            tableData.value = state.data;
            loading.value = state.loading;
            Object.assign(pagination, state.pagination);
        };

        // 事件处理
        const handleSearch = () => {
            tableManager.search(searchForm);
        };

        const handleReset = () => {
            Object.keys(searchForm).forEach((key) => {
                searchForm[key] = "";
            });
            tableManager.resetSearch();
        };

        const handleCurrentChange = (page) => {
            tableManager.changePage(page);
        };

        const handleSizeChange = (size) => {
            tableManager.changePageSize(size);
        };

        const handleSelectionChange = (selection) => {
            tableManager.handleSelectionChange(selection);
        };

        onMounted(() => {
            tableManager.loadData().then(syncState);
        });

        return {
            searchForm,
            tableData,
            loading,
            pagination,
            handleSearch,
            handleReset,
            handleCurrentChange,
            handleSizeChange,
            handleSelectionChange,
        };
    },
};
</script>
```

### 2. 数据格式化示例

```javascript
import { tableHelpers } from "@/utils/common";

// 格式化表格数据
const formatters = {
    status: (value) => (value ? "启用" : "禁用"),
    createTime: (value) => new Date(value).toLocaleString(),
    amount: (value) => `¥${value.toFixed(2)}`,
};

const formattedData = tableHelpers.formatTableData(rawData, formatters);
```

### 3. 批量操作示例

```javascript
// 获取选中的数据
const selectedRows = tableManager.getSelectedRows();
const selectedIds = tableManager.getSelectedIds("id");

// 批量删除
const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
        showMessage("请先选择要删除的数据", "warning");
        return;
    }

    const confirmed = await showConfirm(
        `确定要删除选中的 ${selectedIds.length} 项数据吗？`
    );

    if (confirmed) {
        await batchDeleteAPI(selectedIds);
        tableManager.refresh(); // 刷新数据
        tableManager.clearSelection(); // 清空选择
    }
};
```

### 4. 导出数据示例

```javascript
import { tableHelpers } from "@/utils/common";

const handleExport = () => {
    const columns = [
        { prop: "name", label: "名称" },
        { prop: "status", label: "状态" },
        { prop: "createTime", label: "创建时间" },
    ];

    tableHelpers.exportTableData(tableData.value, columns, "数据列表.csv");
};
```

## 预设配置

系统提供了 4 种预设配置：

### 1. standardList - 标准列表

```javascript
{
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    selectionMode: 'multiple',
    showMessage: true,
    autoLoad: true
}
```

### 2. selector - 选择器

```javascript
{
    pageSize: 5,
    pageSizes: [5, 10, 20],
    selectionMode: 'single',
    showMessage: false,
    autoLoad: true
}
```

### 3. bigData - 大数据表格

```javascript
{
    pageSize: 50,
    pageSizes: [50, 100, 200, 500],
    selectionMode: 'multiple',
    showMessage: true,
    autoLoad: false
}
```

### 4. readonly - 只读表格

```javascript
{
    pageSize: 20,
    pageSizes: [20, 50, 100],
    selectionMode: 'none',
    showMessage: true,
    autoLoad: true
}
```

## 最佳实践

### 1. 错误处理

```javascript
const tableManager = createTableManager({
    apiFunction: queryData,
    onError: (error) => {
        console.error("表格数据加载失败:", error);
        // 可以在这里添加自定义错误处理逻辑
    },
});
```

### 2. 性能优化

```javascript
// 大数据量时，关闭自动加载
const tableManager = createTableManager({
    apiFunction: queryData,
    autoLoad: false, // 手动控制加载时机
    pageSize: 50, // 增大每页大小
});

// 在适当的时机手动加载
onMounted(() => {
    nextTick(() => {
        tableManager.loadData();
    });
});
```

### 3. 搜索防抖

```javascript
import { debounce } from "@/utils/common";

// 创建防抖搜索函数
const debouncedSearch = debounce((params) => {
    tableManager.search(params);
}, 500);

// 在输入变化时调用
watch(
    searchForm,
    (newVal) => {
        debouncedSearch(newVal);
    },
    { deep: true }
);
```

### 4. 内存管理

```javascript
onUnmounted(() => {
    // 组件卸载时销毁表格管理器
    tableManager.destroy();
});
```

### 5. 多表格管理

```javascript
// 为不同的表格创建不同的管理器
const userTableManager = createTableManager({
    apiFunction: queryUsers,
    loadingKey: "userTable",
});

const orderTableManager = createTableManager({
    apiFunction: queryOrders,
    loadingKey: "orderTable",
});
```

## 调试技巧

### 1. 启用调试日志

表格管理器内置了详细的控制台日志，可以帮助您调试：

```javascript
// 查看管理器状态
console.log("表格状态:", tableManager.getState());

// 查看配置信息
console.log("表格配置:", tableManager.config);
```

### 2. 监听状态变化

```javascript
const tableManager = createTableManager({
    apiFunction: queryData,
    onDataLoad: (data, total) => {
        console.log("数据加载:", { data, total });
    },
    onSelectionChange: (selection) => {
        console.log("选择变化:", selection);
    },
});
```

这个表格管理系统为您提供了一个强大、灵活且易于使用的表格数据管理解决方案。通过合理的配置和使用，可以大大简化表格相关的开发工作。
