# 列表页面通用样式和工具使用指南

## 概述

这个文档介绍如何使用通用的列表页面样式和工具函数，让您能够快速创建统一风格的列表页面。

## 文件结构

```
src/
├── assets/styles/
│   └── list-page.css          # 通用列表页面样式
└── utils/
    └── list-page.js           # 通用列表页面工具函数
```

## 样式使用

### 1. 引入样式文件

在您的列表页面组件中引入样式：

```css
<style scoped>
@import '@/assets/styles/list-page.css';

/* 您的自定义样式 */
</style>
```

### 2. HTML 结构和类名

```vue
<template>
    <div class="list-page">
        <!-- 搜索区域 -->
        <el-card class="list-search-card">
            <template #header>
                <div class="list-search-header">
                    <span>查询条件</span>
                    <el-button
                        v-if="hasMoreThanTwoRows"
                        text
                        @click="toggleSearchExpand"
                        class="list-search-expand-btn"
                    >
                        <el-icon>
                            <ArrowUp v-if="searchExpanded" />
                            <ArrowDown v-else />
                        </el-icon>
                        {{ searchExpanded ? "收起" : "展开" }}
                    </el-button>
                </div>
            </template>

            <div
                class="list-search-content"
                :class="{
                    'list-search-collapsed':
                        !searchExpanded && hasMoreThanTwoRows,
                }"
            >
                <div class="list-search-form-container">
                    <div class="list-search-form-grid">
                        <!-- 搜索表单项 -->
                        <el-form-item label="字段1">
                            <el-input v-model="searchForm.field1" />
                        </el-form-item>
                        <!-- 更多搜索字段... -->

                        <!-- 操作按钮列 -->
                        <div class="list-search-actions">
                            <el-button type="primary" @click="handleSearch">
                                <el-icon><Search /></el-icon>
                                查询
                            </el-button>
                            <el-button @click="handleReset">
                                <el-icon><Refresh /></el-icon>
                                重置
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>

        <!-- 表格区域 -->
        <el-card class="list-table-card">
            <template #header>
                <div class="list-table-header">
                    <span>数据列表</span>
                    <div class="list-table-header-controls">
                        <!-- 操作模式切换等控件 -->
                    </div>
                </div>
            </template>

            <div class="list-table-container">
                <!-- 工具栏 -->
                <div
                    v-if="operationMode === 'toolbar'"
                    class="list-table-toolbar"
                >
                    <!-- 工具栏按钮 -->
                </div>

                <!-- 表格 -->
                <div class="list-table-wrapper">
                    <el-table :data="tableData">
                        <!-- 表格列定义 -->
                    </el-table>
                </div>

                <!-- 分页 -->
                <div class="list-pagination">
                    <el-pagination />
                </div>
            </div>
        </el-card>
    </div>
</template>
```

### 3. 核心 CSS 类说明

| 类名                      | 用途                           |
| ------------------------- | ------------------------------ |
| `.list-page`              | 页面容器，必须包裹整个列表页面 |
| `.list-search-card`       | 搜索区域卡片                   |
| `.list-search-header`     | 搜索区域头部                   |
| `.list-search-expand-btn` | 搜索展开/收起按钮              |
| `.list-search-content`    | 搜索内容容器                   |
| `.list-search-collapsed`  | 搜索收起状态                   |
| `.list-search-form-grid`  | 搜索表单网格布局               |
| `.list-search-actions`    | 搜索操作按钮容器               |
| `.list-table-card`        | 表格区域卡片                   |
| `.list-table-header`      | 表格头部                       |
| `.list-table-container`   | 表格容器                       |
| `.list-table-toolbar`     | 表格工具栏                     |
| `.list-table-wrapper`     | 表格包装器                     |
| `.list-pagination`        | 分页容器                       |

## 工具函数使用

### 1. 引入工具函数

```javascript
import { useListPage, tableUtils, paginationConfig } from "@/utils/list-page";
```

### 2. 基础使用

```javascript
export default {
    setup() {
        // 定义搜索字段
        const searchFields = [
            "empCode",
            "empName",
            "orgName",
            "postName",
            "sex",
            "phoneNumber",
            "idCard",
            "createTimeRange",
        ];

        // 使用列表页面工具
        const {
            searchExpanded,
            hasMoreThanTwoRows,
            toggleSearchExpand,
            operationMode,
            selectedRows,
            handleModeChange,
            handleSelectionChange,
            initListPage,
        } = useListPage({
            searchFields,
            fieldsPerRow: 3, // 每行3个搜索字段
            tableHeightOptions: {
                // 自定义表格高度计算选项
                minHeight: 400,
                padding: 100,
            },
        });

        // 分页配置
        const pagination = reactive(
            paginationConfig.create({
                pageSize: 20, // 自定义页面大小
            })
        );

        // 组件挂载时初始化
        onMounted(() => {
            const cleanup = initListPage();

            // 组件卸载时清理
            onUnmounted(cleanup);
        });

        return {
            searchExpanded,
            hasMoreThanTwoRows,
            toggleSearchExpand,
            operationMode,
            selectedRows,
            handleModeChange,
            handleSelectionChange,
            pagination,
        };
    },
};
```

### 3. 表格工具函数

```javascript
// 格式化日期时间
const formatDateTime = (dateTime) => {
    return tableUtils.formatDateTime(dateTime);
};

// 性别显示
const getGenderDisplay = (sex) => {
    return {
        text: tableUtils.getGenderText(sex),
        type: tableUtils.getGenderTagType(sex),
    };
};

// 状态标签类型
const getStatusType = (status) => {
    return tableUtils.getStatusTagType(status);
};
```

## 高级配置

### 1. 自定义搜索行为

```javascript
import { useSearchCollapse, useTableHeight } from "@/utils/list-page";

// 独立使用搜索折叠功能
const {
    searchExpanded,
    hasMoreThanTwoRows,
    checkSearchRows,
    toggleSearchExpand,
} = useSearchCollapse(searchFields, 3);

// 独立使用表格高度功能
const { updateTableHeight, initTableHeight } = useTableHeight({
    searchCardSelector: ".my-search-card",
    tableWrapperSelector: ".my-table-wrapper",
    minHeight: 500,
});
```

### 2. 自定义样式覆盖

```css
<style scoped>
@import '@/assets/styles/list-page.css';

/* 自定义搜索网格列数 */
.list-search-form-grid {
    grid-template-columns: 1fr 1fr auto; /* 改为2列 */
}

/* 自定义表格最小高度 */
.list-table-wrapper {
    min-height: 500px;
}

/* 自定义响应式断点 */
@media (max-width: 1600px) {
    .list-search-form-grid {
        grid-template-columns: 1fr auto;
    }
}
</style>
```

## 响应式特性

样式已内置响应式支持：

-   **> 1400px**: 3 列搜索布局
-   **1200px - 1400px**: 2 列搜索布局
-   **768px - 1200px**: 1 列搜索布局
-   **< 768px**: 移动端优化布局

## 可用的工具类

```css
.list-status-tag         /* 状态标签间距 */
/* 状态标签间距 */
/* 状态标签间距 */
/* 状态标签间距 */
.list-action-btn         /* 操作按钮间距 */
.list-table-actions      /* 表格操作列布局 */
.list-empty-data         /* 空数据状态 */
.list-batch-tip          /* 批量操作提示 */
.list-status-active      /* 激活状态颜色 */
.list-status-inactive    /* 非激活状态颜色 */
.list-status-pending     /* 待处理状态颜色 */
.list-status-default; /* 默认状态颜色 */
```

## 注意事项

1. **必须使用 `.list-page` 作为最外层容器**，这样 Element Plus 的样式覆盖才能正确工作
2. **搜索字段数组要准确**，用于计算是否需要展开/收起功能
3. **表格高度计算依赖正确的 CSS 选择器**，确保元素存在
4. **响应式断点可根据需要调整**，修改对应的媒体查询即可
5. **工具函数支持按需引入**，不必全部使用

## 示例项目

参考 `src/views/user/user-list.vue` 获取完整的实现示例。
