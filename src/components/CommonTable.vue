<template>
    <div class="common-table">
        <!-- 搜索区域 -->
        <el-card v-if="showSearch && searchFields.length > 0" class="search-card">
            <template #header>
                <div class="search-header">
                    <span>{{ searchTitle }}</span>
                    <el-button v-if="searchFields.length > searchCollapseThreshold" class="search-expand-btn" text
                        @click="toggleSearchExpand">
                        {{ searchExpanded ? '收起' : '展开' }}
                        <el-icon>
                            <component :is="searchExpanded ? ArrowUp : ArrowDown" />
                        </el-icon>
                    </el-button>
                </div>
            </template>

            <div class="search-content" :class="{ 'search-collapsed': !searchExpanded }">
                <el-form :model="searchForm" :label-width="searchLabelWidth" class="search-form">
                    <el-row :gutter="20">
                        <!-- 动态渲染搜索字段 -->
                        <template v-for="field in visibleSearchFields" :key="field.prop">
                            <el-col :span="6">
                                <el-form-item :label="field.label" :prop="field.prop">
                                    <!-- 文本输入框 -->
                                    <el-input v-if="field.type === 'input' || !field.type"
                                        v-model="searchForm[field.prop]"
                                        :placeholder="field.placeholder || `请输入${field.label}`"
                                        :clearable="field.clearable !== false" v-bind="field.props || {}" />

                                    <!-- 选择器 -->
                                    <el-select v-else-if="field.type === 'select'" v-model="searchForm[field.prop]"
                                        :placeholder="field.placeholder || `请选择${field.label}`"
                                        :clearable="field.clearable !== false" v-bind="field.props || {}"
                                        style="width: 100%">
                                        <el-option v-for="option in field.options || []" :key="option.value"
                                            :label="option.label" :value="option.value" />
                                    </el-select>

                                    <!-- 日期选择器 -->
                                    <el-date-picker v-else-if="field.type === 'date'" v-model="searchForm[field.prop]"
                                        :type="field.dateType || 'date'"
                                        :placeholder="field.placeholder || `请选择${field.label}`"
                                        :format="field.format || 'YYYY-MM-DD'"
                                        :value-format="field.valueFormat || 'YYYY-MM-DD'" style="width: 100%"
                                        v-bind="field.props || {}" />

                                    <!-- 日期范围选择器 -->
                                    <el-date-picker v-else-if="field.type === 'daterange'"
                                        v-model="searchForm[field.prop]" type="daterange"
                                        :range-separator="field.rangeSeparator || '至'"
                                        :start-placeholder="field.startPlaceholder || '开始日期'"
                                        :end-placeholder="field.endPlaceholder || '结束日期'"
                                        :format="field.format || 'YYYY-MM-DD'"
                                        :value-format="field.valueFormat || 'YYYY-MM-DD'" style="width: 100%"
                                        v-bind="field.props || {}" />

                                    <!-- 数字输入框 -->
                                    <el-input-number v-else-if="field.type === 'number'"
                                        v-model="searchForm[field.prop]"
                                        :placeholder="field.placeholder || `请输入${field.label}`" style="width: 100%"
                                        v-bind="field.props || {}" />

                                    <!-- 自定义插槽 -->
                                    <slot v-else-if="field.type === 'slot'" :name="`search-${field.prop}`"
                                        :field="field" :value="searchForm[field.prop]"
                                        :setValue="(val) => searchForm[field.prop] = val" />
                                </el-form-item>
                            </el-col>
                        </template>

                        <!-- 搜索按钮区域 -->
                        <el-col :span="24">
                            <div class="search-actions">
                                <el-button type="primary" :loading="loading" @click="handleSearch">
                                    <el-icon>
                                        <Search />
                                    </el-icon>
                                    {{ searchButtonText }}
                                </el-button>
                                <el-button @click="handleReset">
                                    <el-icon>
                                        <Refresh />
                                    </el-icon>
                                    {{ resetButtonText }}
                                </el-button>
                                <el-button v-if="showRefreshButton" @click="handleRefresh">
                                    <el-icon>
                                        <RefreshRight />
                                    </el-icon>
                                    {{ refreshButtonText }}
                                </el-button>

                                <!-- 额外的搜索按钮插槽 -->
                                <slot name="search-actions" :search="handleSearch" :reset="handleReset"
                                    :refresh="handleRefresh" />
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-card>

        <!-- 表格区域 -->
        <el-card class="table-card" :style="{ marginTop: showSearch && searchFields.length > 0 ? '20px' : '0' }">
            <!-- 表格头部 -->
            <template #header v-if="showTableHeader">
                <div class="table-header">
                    <span>{{ tableTitle }}</span>
                    <div class="table-header-controls">
                        <!-- 表格头部操作插槽 -->
                        <slot name="table-header" :selectedRows="selectedRows" :refresh="handleRefresh" />
                    </div>
                </div>
            </template>

            <div class="table-container">
                <!-- 工具栏 -->
                <div v-if="showToolbar" class="table-toolbar">
                    <slot name="toolbar" :selectedRows="selectedRows" :hasSelection="hasSelection" />
                </div>

                <!-- 批量选择提示 -->
                <div v-if="hasSelection && showSelectionTip" class="selection-tip">
                    已选择 {{ selectedRows.length }} 项数据
                    <el-button text type="primary" @click="clearSelection" style="margin-left: 10px;">
                        清空选择
                    </el-button>
                </div>

                <!-- 表格主体 -->
                <div class="table-wrapper">
                    <el-table ref="tableRef" :data="tableData" v-loading="loading"
                        @selection-change="handleSelectionChange" @sort-change="handleSortChange"
                        @filter-change="handleFilterChange" @current-change="handleCurrentRowChange"
                        @row-click="handleRowClick" @row-dblclick="handleRowDblclick" v-bind="tableProps">
                        <!-- 选择列 -->
                        <el-table-column v-if="selectionMode === 'multiple'" type="selection"
                            :width="selectionColumnWidth" :selectable="selectableFunction" />

                        <!-- 单选列 -->
                        <el-table-column v-if="selectionMode === 'single'" :width="selectionColumnWidth">
                            <template #default="scope">
                                <el-radio :model-value="currentRow && currentRow[rowKey] === scope.row[rowKey]"
                                    @change="handleSingleSelect(scope.row)"
                                    :disabled="selectableFunction && !selectableFunction(scope.row)">
                                    &nbsp;
                                </el-radio>
                            </template>
                        </el-table-column>

                        <!-- 动态渲染列 -->
                        <template v-for="column in columns" :key="column.prop">
                            <el-table-column :prop="column.prop" :label="column.label" :width="column.width"
                                :min-width="column.minWidth" :fixed="column.fixed" :sortable="column.sortable"
                                :filters="column.filters" :filter-method="column.filterMethod"
                                :show-overflow-tooltip="column.showOverflowTooltip !== false"
                                v-bind="column.props || {}">
                                <template #default="scope">
                                    <!-- 自定义插槽 -->
                                    <slot v-if="column.slot" :name="column.slot" :row="scope.row" :column="column"
                                        :index="scope.$index" :value="scope.row[column.prop]" />

                                    <!-- 格式化函数 -->
                                    <span v-else-if="column.formatter">
                                        {{ column.formatter(scope.row[column.prop], scope.row, column, scope.$index) }}
                                    </span>

                                    <!-- 标签显示 -->
                                    <el-tag v-else-if="column.tag"
                                        :type="getTagType(scope.row[column.prop], column.tag)">
                                        {{ getTagText(scope.row[column.prop], column.tag) }}
                                    </el-tag>

                                    <!-- 链接显示 -->
                                    <el-link v-else-if="column.link" :type="column.link.type || 'primary'"
                                        @click="handleLinkClick(scope.row, column)">
                                        {{ scope.row[column.prop] }}
                                    </el-link>

                                    <!-- 默认显示 -->
                                    <span v-else>{{ scope.row[column.prop] }}</span>
                                </template>

                                <!-- 表头插槽 -->
                                <template #header v-if="column.headerSlot">
                                    <slot :name="column.headerSlot" :column="column" />
                                </template>
                            </el-table-column>
                        </template>

                        <!-- 操作列 -->
                        <el-table-column v-if="showActions" :label="actionsLabel" :width="actionsWidth"
                            :min-width="actionsMinWidth" :fixed="actionsFixed">
                            <template #default="scope">
                                <slot name="actions" :row="scope.row" :index="scope.$index" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <div v-if="showPagination" class="pagination-wrapper">
                    <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                        :page-sizes="pagination.pageSizes" :total="pagination.total" :layout="paginationLayout"
                        :small="paginationSmall" :background="paginationBackground" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" v-bind="paginationProps" />
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Search, Refresh, RefreshRight, ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { createTableManager, formatDate, showMessage } from '@/utils/common';

export default {
    name: 'CommonTable',
    components: {
        Search,
        Refresh,
        RefreshRight,
        ArrowUp,
        ArrowDown,
    },
    props: {
        // API配置
        apiFunction: {
            type: Function,
            required: true,
        },
        apiParams: {
            type: Object,
            default: () => ({}),
        },
        dataField: {
            type: String,
            default: 'data.dataInfo',
        },
        totalField: {
            type: String,
            default: 'data.totalCount',
        },

        // 搜索配置
        searchFields: {
            type: Array,
            default: () => [],
        },
        searchTitle: {
            type: String,
            default: '搜索条件',
        },
        searchInline: {
            type: Boolean,
            default: false,
        },
        searchColsPerRow: {
            type: Number,
            default: 3,
        },
        searchCollapseThreshold: {
            type: Number,
            default: 6,
        },
        searchLabelWidth: {
            type: String,
            default: '80px',
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
        searchButtonText: {
            type: String,
            default: '查询',
        },
        resetButtonText: {
            type: String,
            default: '重置',
        },
        refreshButtonText: {
            type: String,
            default: '刷新',
        },
        showRefreshButton: {
            type: Boolean,
            default: true,
        },

        // 表格配置
        columns: {
            type: Array,
            required: true,
        },
        tableTitle: {
            type: String,
            default: '数据列表',
        },
        showTableHeader: {
            type: Boolean,
            default: true,
        },
        showToolbar: {
            type: Boolean,
            default: false,
        },
        showSelectionTip: {
            type: Boolean,
            default: true,
        },
        tableProps: {
            type: Object,
            default: () => ({
                stripe: true,
                border: true,
                height: '100%',
            }),
        },

        // 选择配置
        selectionMode: {
            type: String,
            default: 'multiple', // 'single', 'multiple', 'none'
            validator: (value) => ['single', 'multiple', 'none'].includes(value),
        },
        selectionColumnWidth: {
            type: [String, Number],
            default: 55,
        },
        selectableFunction: {
            type: Function,
            default: null,
        },
        rowKey: {
            type: String,
            default: 'id',
        },

        // 操作列配置
        showActions: {
            type: Boolean,
            default: false,
        },
        actionsLabel: {
            type: String,
            default: '操作',
        },
        actionsWidth: {
            type: [String, Number],
            default: undefined,
        },
        actionsMinWidth: {
            type: [String, Number],
            default: 120,
        },
        actionsFixed: {
            type: [String, Boolean],
            default: 'right',
        },

        // 分页配置
        showPagination: {
            type: Boolean,
            default: true,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        pageSizes: {
            type: Array,
            default: () => [10, 20, 50, 100],
        },
        paginationLayout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper',
        },
        paginationSmall: {
            type: Boolean,
            default: false,
        },
        paginationBackground: {
            type: Boolean,
            default: true,
        },
        paginationProps: {
            type: Object,
            default: () => ({}),
        },

        // 其他配置
        autoLoad: {
            type: Boolean,
            default: true,
        },
        loadingKey: {
            type: String,
            default: 'commonTable',
        },
        showMessage: {
            type: Boolean,
            default: true,
        },
    },
    emits: [
        'search',
        'reset',
        'refresh',
        'selection-change',
        'current-change',
        'sort-change',
        'filter-change',
        'row-click',
        'row-dblclick',
        'link-click',
        'data-loaded',
        'error',
    ],
    setup(props, { emit, expose }) {
        const tableRef = ref();
        const searchExpanded = ref(true);
        const currentRow = ref(null);

        // 搜索表单
        const searchForm = reactive({});

        // 初始化搜索表单
        const initSearchForm = () => {
            props.searchFields.forEach(field => {
                if (field.defaultValue !== undefined) {
                    searchForm[field.prop] = field.defaultValue;
                } else if (field.type === 'daterange') {
                    searchForm[field.prop] = [];
                } else {
                    searchForm[field.prop] = '';
                }
            });
        };

        // 创建表格管理器
        const tableManager = createTableManager({
            apiFunction: props.apiFunction,
            apiParams: props.apiParams,
            dataField: props.dataField,
            totalField: props.totalField,
            pageSize: props.pageSize,
            pageSizes: props.pageSizes,
            selectionMode: props.selectionMode,
            loadingKey: props.loadingKey,
            autoLoad: false,
            showMessage: props.showMessage,
            onDataLoad: (data, total) => {
                emit('data-loaded', data, total);
                nextTick(() => syncState()); // 使用nextTick确保状态更新
            },
            onError: (error) => {
                emit('error', error);
                nextTick(() => syncState()); // 错误时也要同步状态
            },
            onSelectionChange: (selection) => {
                emit('selection-change', selection);
                nextTick(() => syncState()); // 使用nextTick确保状态更新
            },
        });

        // 响应式状态
        const tableData = ref([]);
        const loading = ref(false);
        const selectedRows = ref([]);
        const pagination = reactive({
            currentPage: 1,
            pageSize: props.pageSize,
            total: 0,
            pageSizes: props.pageSizes,
        });

        // 同步状态
        const syncState = () => {
            const state = tableManager.getState();
            tableData.value = state.data;
            loading.value = state.loading;
            selectedRows.value = state.selectedRows;

            pagination.currentPage = state.pagination.currentPage;
            pagination.pageSize = state.pagination.pageSize;
            pagination.total = state.pagination.total;
        };

        // 计算属性
        const hasSelection = computed(() => selectedRows.value.length > 0);

        const visibleSearchFields = computed(() => {
            if (searchExpanded.value || props.searchFields.length <= props.searchCollapseThreshold) {
                return props.searchFields;
            }
            return props.searchFields.slice(0, props.searchCollapseThreshold);
        });

        // 搜索相关方法
        const toggleSearchExpand = () => {
            searchExpanded.value = !searchExpanded.value;
        };

        const buildSearchParams = () => {
            const params = { ...searchForm };

            // 处理日期范围字段
            props.searchFields.forEach(field => {
                if (field.type === 'daterange' && params[field.prop] && params[field.prop].length === 2) {
                    if (field.startField && field.endField) {
                        params[field.startField] = params[field.prop][0] + (field.timeStart || 'T00:00:00');
                        params[field.endField] = params[field.prop][1] + (field.timeEnd || 'T23:59:59');
                        delete params[field.prop];
                    }
                }

                // 处理空值
                if (params[field.prop] === '' || params[field.prop] === null || params[field.prop] === undefined) {
                    delete params[field.prop];
                }
            });

            return params;
        };

        const handleSearch = () => {
            const searchParams = buildSearchParams();
            emit('search', searchParams);
            tableManager.search(searchParams).then(() => {
                syncState(); // 确保搜索完成后同步状态
            });
        };

        const handleReset = () => {
            // 重置搜索表单
            props.searchFields.forEach(field => {
                if (field.defaultValue !== undefined) {
                    searchForm[field.prop] = field.defaultValue;
                } else if (field.type === 'daterange') {
                    searchForm[field.prop] = [];
                } else {
                    searchForm[field.prop] = '';
                }
            });

            emit('reset');
            tableManager.resetSearch().then(() => {
                syncState(); // 确保重置完成后同步状态
            });
        };

        const handleRefresh = () => {
            emit('refresh');
            tableManager.refresh().then(() => {
                syncState(); // 确保刷新完成后同步状态
            });
        };

        // 分页相关方法
        const handleCurrentChange = (page) => {
            tableManager.changePage(page).then(() => {
                syncState(); // 确保页码变更完成后同步状态
            });
        };

        const handleSizeChange = (size) => {
            tableManager.changePageSize(size).then(() => {
                syncState(); // 确保页面大小变更完成后同步状态
            });
        };

        // 选择相关方法
        const handleSelectionChange = (selection) => {
            tableManager.handleSelectionChange(selection);
        };

        const handleSingleSelect = (row) => {
            currentRow.value = currentRow.value && currentRow.value[props.rowKey] === row[props.rowKey] ? null : row;
            const selection = currentRow.value ? [currentRow.value] : [];
            tableManager.handleSelectionChange(selection);
        };

        const clearSelection = () => {
            currentRow.value = null;
            tableManager.clearSelection();
            if (tableRef.value) {
                tableRef.value.clearSelection();
            }
        };

        // 表格事件处理
        const handleSortChange = (sortInfo) => {
            emit('sort-change', sortInfo);
        };

        const handleFilterChange = (filters) => {
            emit('filter-change', filters);
        };

        const handleCurrentRowChange = (currentRow, oldCurrentRow) => {
            emit('current-change', currentRow, oldCurrentRow);
        };

        const handleRowClick = (row, column, event) => {
            emit('row-click', row, column, event);
        };

        const handleRowDblclick = (row, column, event) => {
            emit('row-dblclick', row, column, event);
        };

        const handleLinkClick = (row, column) => {
            emit('link-click', row, column);
        };

        // 标签相关方法
        const getTagType = (value, tagConfig) => {
            if (typeof tagConfig === 'function') {
                return tagConfig(value);
            }
            if (typeof tagConfig === 'object' && tagConfig.type) {
                if (typeof tagConfig.type === 'function') {
                    return tagConfig.type(value);
                }
                return tagConfig.type;
            }
            return 'info';
        };

        const getTagText = (value, tagConfig) => {
            if (typeof tagConfig === 'function') {
                return value;
            }
            if (typeof tagConfig === 'object' && tagConfig.formatter) {
                return tagConfig.formatter(value);
            }
            return value;
        };

        // 公共方法
        const loadData = (params = {}, resetPage = false) => {
            return tableManager.loadData(params, resetPage).then(() => {
                syncState(); // 确保数据加载完成后同步状态
            });
        };

        const search = (searchParams = {}) => {
            return tableManager.search(searchParams).then(() => {
                syncState(); // 确保搜索完成后同步状态
            });
        };

        const refresh = () => {
            return tableManager.refresh().then(() => {
                syncState(); // 确保刷新完成后同步状态
            });
        };

        const getSelectedRows = () => {
            return tableManager.getSelectedRows();
        };

        const getSelectedIds = (idField = props.rowKey) => {
            return tableManager.getSelectedIds(idField);
        };

        const getTableData = () => {
            return tableManager.getData();
        };

        const getTableRef = () => {
            return tableRef.value;
        };

        // 监听props变化
        watch(() => props.apiFunction, (newApiFunction, oldApiFunction) => {
            // 避免初始化时的重复调用
            if (oldApiFunction && newApiFunction !== oldApiFunction) {
                tableManager.setApiFunction(newApiFunction, props.apiParams);
                tableManager.refresh();
            }
        });

        watch(() => props.apiParams, (newParams, oldParams) => {
            // 避免初始化时的重复调用，只在参数真正变化时才更新
            if (oldParams && JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
                tableManager.config.apiParams = { ...newParams };
                tableManager.refresh();
            }
        }, { deep: true });

        // 生命周期
        onMounted(() => {
            initSearchForm();

            // 手动触发初始数据加载
            if (props.autoLoad) {
                nextTick(() => {
                    tableManager.loadData().then(() => {
                        syncState();
                    });
                });
            } else {
                // 如果不自动加载，至少同步一次状态
                nextTick(() => {
                    syncState();
                });
            }

            // 添加定期状态同步，确保loading状态不会卡住
            const syncInterval = setInterval(() => {
                const currentLoading = tableManager.getLoading();
                if (loading.value !== currentLoading) {
                    console.log('发现loading状态不同步，强制同步:', {
                        component: loading.value,
                        manager: currentLoading
                    });
                    syncState();
                }
            }, 100);

            // 组件卸载时清理定时器
            onUnmounted(() => {
                clearInterval(syncInterval);
                tableManager.destroy();
            });
        });

        onUnmounted(() => {
            tableManager.destroy();
        });

        // 暴露方法给父组件
        expose({
            loadData,
            search,
            refresh,
            clearSelection,
            getSelectedRows,
            getSelectedIds,
            getTableData,
            getTableRef,
            tableManager,
        });

        return {
            tableRef,
            searchForm,
            searchExpanded,
            currentRow,
            tableData,
            loading,
            selectedRows,
            pagination,
            hasSelection,
            visibleSearchFields,

            // 方法
            toggleSearchExpand,
            handleSearch,
            handleReset,
            handleRefresh,
            handleCurrentChange,
            handleSizeChange,
            handleSelectionChange,
            handleSingleSelect,
            clearSelection,
            handleSortChange,
            handleFilterChange,
            handleCurrentRowChange,
            handleRowClick,
            handleRowDblclick,
            handleLinkClick,
            getTagType,
            getTagText,
        };
    },
};
</script>

<style scoped>
.common-table {
    width: 100%;
}

.search-card {
    margin-bottom: 20px;
}

.search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-expand-btn {
    font-size: 14px;
    padding: 4px 8px;
    color: #409eff;
}

.search-content {
    transition: all 0.3s ease;
    overflow: hidden;
}

.search-content.search-collapsed {
    max-height: 120px;
}

.search-form .el-form-item {
    margin-bottom: 20px;
}

.search-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #ebeef5;
}

.table-card {
    min-height: 400px;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table-header-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.table-toolbar {
    margin-bottom: 15px;
    padding: 12px;
    background-color: #f5f7fa;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.selection-tip {
    background-color: #f0f9ff;
    border: 1px solid #e1f5fe;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 12px;
    color: #0277bd;
    font-size: 14px;
}

.table-wrapper {
    flex: 1;
    min-height: 300px;
}

.pagination-wrapper {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
}

/* 响应式样式 */
@media (max-width: 768px) {

    /* 移动端每行只显示1个字段 */
    .search-form .el-col {
        width: 100% !important;
        flex: 0 0 100% !important;
        max-width: 100% !important;
    }

    .search-actions {
        justify-content: flex-start;
        flex-direction: column;
        gap: 8px;
    }

    .search-actions .el-button {
        width: 100%;
        justify-content: center;
    }

    .table-header {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }

    .table-toolbar {
        flex-direction: column;
    }

    .pagination-wrapper {
        justify-content: center;
    }
}

@media (max-width: 1200px) and (min-width: 769px) {

    /* 平板端每行显示2个字段 */
    .search-form .el-col {
        width: 50% !important;
        flex: 0 0 50% !important;
        max-width: 50% !important;
    }
}
</style>