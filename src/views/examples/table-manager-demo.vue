<template>
    <div class="list-page">
        <!-- 搜索区域 -->
        <el-card class="list-search-card">
            <template #header>
                <div class="list-search-header">
                    <span>搜索条件</span>
                    <el-button class="list-search-expand-btn" text @click="toggleSearchExpand"
                        v-if="hasMoreThanTwoRows">
                        {{ searchExpanded ? '收起' : '展开' }}
                        <el-icon>
                            <component :is="searchExpanded ? ArrowUp : ArrowDown" />
                        </el-icon>
                    </el-button>
                </div>
            </template>

            <div class="list-search-content" :class="{ 'list-search-collapsed': !searchExpanded }">
                <div class="list-search-form-container">
                    <el-form :model="searchForm" class="list-search-form-grid">
                        <el-form-item label="员工编号">
                            <el-input v-model="searchForm.empCode" placeholder="请输入员工编号" clearable />
                        </el-form-item>
                        <el-form-item label="员工姓名">
                            <el-input v-model="searchForm.empName" placeholder="请输入员工姓名" clearable />
                        </el-form-item>
                        <el-form-item label="组织名称">
                            <el-input v-model="searchForm.orgName" placeholder="请输入组织名称" clearable />
                        </el-form-item>
                        <el-form-item label="岗位名称">
                            <el-input v-model="searchForm.postName" placeholder="请输入岗位名称" clearable />
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-select v-model="searchForm.sex" placeholder="请选择性别" clearable>
                                <el-option label="男" :value="true" />
                                <el-option label="女" :value="false" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="searchForm.createTimeRange" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" />
                        </el-form-item>

                        <div class="list-search-actions">
                            <el-button type="primary" :loading="loading" @click="handleSearch">
                                <el-icon>
                                    <Search />
                                </el-icon>
                                查询
                            </el-button>
                            <el-button @click="handleReset">
                                <el-icon>
                                    <Refresh />
                                </el-icon>
                                重置
                            </el-button>
                            <el-button @click="handleRefresh">
                                <el-icon>
                                    <RefreshRight />
                                </el-icon>
                                刷新
                            </el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </el-card>

        <!-- 表格区域 -->
        <el-card class="list-table-card">
            <template #header>
                <div class="list-table-header">
                    <span>用户列表（表格管理器演示）</span>
                    <div class="list-table-header-controls">
                        <el-radio-group v-model="operationMode" @change="handleModeChange">
                            <el-radio-button label="toolbar">工具栏模式</el-radio-button>
                            <el-radio-button label="column">操作列模式</el-radio-button>
                        </el-radio-group>

                        <el-button-group style="margin-left: 10px;">
                            <el-button @click="switchToMultiple" :type="isMultipleSelection ? 'primary' : ''">
                                多选模式
                            </el-button>
                            <el-button @click="switchToSingle" :type="isSingleSelection ? 'primary' : ''">
                                单选模式
                            </el-button>
                        </el-button-group>
                    </div>
                </div>
            </template>

            <div class="list-table-container">
                <!-- 选择提示 -->
                <div v-if="hasSelection" class="list-batch-tip">
                    已选择 {{ selectedRows.length }} 项数据
                    <el-button text type="primary" @click="clearSelection" style="margin-left: 10px;">
                        清空选择
                    </el-button>
                </div>

                <!-- 工具栏模式的操作按钮 -->
                <div v-if="operationMode === 'toolbar'" class="list-table-toolbar">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-button type="success" :disabled="!hasSelection" @click="handleBatchEdit">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        修改
                    </el-button>
                    <el-button type="danger" :disabled="!hasSelection" @click="handleBatchDelete">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                    <el-button type="info" @click="handleExport">
                        <el-icon>
                            <Download />
                        </el-icon>
                        导出数据
                    </el-button>
                </div>

                <!-- 表格主体 -->
                <div class="list-table-wrapper">
                    <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" stripe
                        border height="100%" style="width: 100%">
                        <el-table-column v-if="operationMode === 'toolbar' || isMultipleSelection" type="selection"
                            width="55" />
                        <el-table-column prop="empCode" label="员工编号" width="120" />
                        <el-table-column prop="empName" label="员工姓名" width="120" />
                        <el-table-column prop="orgName" label="组织名称" width="150" />
                        <el-table-column prop="postName" label="岗位名称" width="120" />
                        <el-table-column prop="sex" label="性别" width="80">
                            <template #default="scope">
                                <el-tag :type="getGenderTagType(scope.row.sex)">
                                    {{ getGenderText(scope.row.sex) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phoneNumber" label="电话号码" width="130" />
                        <el-table-column prop="idCard" label="身份证号" width="180" />
                        <el-table-column prop="createTime" label="创建时间" width="180">
                            <template #default="scope">
                                {{ formatDateTime(scope.row.createTime) }}
                            </template>
                        </el-table-column>

                        <!-- 操作列模式 -->
                        <el-table-column v-if="operationMode === 'column'" label="操作" width="240" fixed="right">
                            <template #default="scope">
                                <div class="list-table-actions">
                                    <el-button type="primary" size="small" @click="handleView(scope.row)">
                                        查看
                                    </el-button>
                                    <el-button type="success" size="small" @click="handleEdit(scope.row)">
                                        修改
                                    </el-button>
                                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                                        删除
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <div class="list-pagination">
                    <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                        :page-sizes="pagination.pageSizes" :total="pagination.total"
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </div>
        </el-card>

        <!-- 调试信息面板 -->
        <el-card style="margin-top: 20px;">
            <template #header>
                <span>调试信息</span>
            </template>
            <el-row :gutter="20">
                <el-col :span="8">
                    <h4>表格状态</h4>
                    <p>数据条数: {{ tableData.length }}</p>
                    <p>总条数: {{ pagination.total }}</p>
                    <p>当前页: {{ pagination.currentPage }}</p>
                    <p>每页大小: {{ pagination.pageSize }}</p>
                    <p>加载状态: {{ loading ? '是' : '否' }}</p>
                </el-col>
                <el-col :span="8">
                    <h4>选择状态</h4>
                    <p>选择模式: {{ getSelectionModeText() }}</p>
                    <p>选中数量: {{ selectedRows.length }}</p>
                    <p>选中ID: {{ getSelectedIds('empCode').join(', ') || '无' }}</p>
                </el-col>
                <el-col :span="8">
                    <h4>操作按钮</h4>
                    <el-button @click="testLoadData">测试加载数据</el-button>
                    <el-button @click="testSearch">测试搜索</el-button>
                    <el-button @click="clearAllData">清空数据</el-button>
                    <el-button @click="printTableManager">打印管理器状态</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import {
    Search,
    Refresh,
    RefreshRight,
    Plus,
    Edit,
    Delete,
    Download,
    ArrowUp,
    ArrowDown,
} from '@element-plus/icons-vue';

// 导入API服务
import { queryUsers } from '@/api/user';

// 导入通用工具函数
import {
    createTableManager,
    createPresetTableManager,
    tableHelpers,
    formatDate,
    showMessage,
    showConfirm
} from '@/utils/common';

// 导入列表页面工具函数
import { useListPage, tableUtils } from '@/utils/list-page';

export default {
    name: 'TableManagerDemo',
    components: {
        Search,
        Refresh,
        RefreshRight,
        Plus,
        Edit,
        Delete,
        Download,
        ArrowUp,
        ArrowDown,
    },
    setup() {
        // 定义搜索字段
        const searchFields = [
            'empCode', 'empName', 'orgName', 'postName', 'sex', 'createTimeRange'
        ];

        // 使用列表页面工具
        const {
            searchExpanded,
            hasMoreThanTwoRows,
            toggleSearchExpand,
            operationMode,
            handleModeChange,
            initListPage
        } = useListPage({
            searchFields,
            fieldsPerRow: 3
        });

        // 搜索表单
        const searchForm = reactive({
            empCode: '',
            empName: '',
            orgName: '',
            postName: '',
            sex: null,
            createTimeRange: []
        });

        // 创建表格管理器 - 使用标准列表预设
        const tableManager = createPresetTableManager('standardList', {
            apiFunction: queryUsers,
            loadingKey: 'userTableLoading',
            // 配置数据字段路径
            dataField: 'data.items',
            totalField: 'data.totalCount',
            // 回调函数
            onDataLoad: (data, total) => {
                console.log('数据加载完成:', { count: data.length, total });
            },
            onError: (error) => {
                console.error('数据加载错误:', error);
            },
            onSelectionChange: (selection) => {
                console.log('选择变化:', selection.length);
            }
        });

        // 响应式数据
        const tableData = ref([]);
        const loading = ref(false);
        const selectedRows = ref([]);
        const pagination = reactive({
            currentPage: 1,
            pageSize: 10,
            total: 0,
            pageSizes: [10, 20, 50, 100]
        });

        // 同步表格管理器状态到响应式数据
        const syncState = () => {
            const state = tableManager.getState();
            tableData.value = state.data;
            loading.value = state.loading;
            selectedRows.value = state.selectedRows;

            pagination.currentPage = state.pagination.currentPage;
            pagination.pageSize = state.pagination.pageSize;
            pagination.total = state.pagination.total;
        };

        // 设置同步回调
        tableManager.callbacks.onDataLoad = (data, total) => {
            console.log('数据加载完成:', { count: data.length, total });
            syncState();
        };

        tableManager.callbacks.onSelectionChange = (selection) => {
            console.log('选择变化:', selection.length);
            syncState();
        };

        // 重写加载状态设置
        const originalSetLoading = tableManager.setLoading.bind(tableManager);
        tableManager.setLoading = (loadingState) => {
            originalSetLoading(loadingState);
            loading.value = loadingState;
        };

        // 计算属性
        const hasSelection = () => selectedRows.value.length > 0;
        const isMultipleSelection = () => tableManager.config.selectionMode === 'multiple';
        const isSingleSelection = () => tableManager.config.selectionMode === 'single';

        // 表格工具函数
        const formatDateTime = (dateTime) => {
            return formatDate(dateTime);
        };

        const getGenderText = (sex) => {
            return tableUtils.getGenderText(sex);
        };

        const getGenderTagType = (sex) => {
            return tableUtils.getGenderTagType(sex);
        };

        const getSelectionModeText = () => {
            const mode = tableManager.config.selectionMode;
            const modeMap = {
                'single': '单选',
                'multiple': '多选',
                'none': '不可选'
            };
            return modeMap[mode] || mode;
        };

        // 构建搜索参数
        const buildSearchParams = () => {
            const params = { ...searchForm };

            // 处理日期范围
            if (params.createTimeRange && params.createTimeRange.length === 2) {
                params.startCreateTime = params.createTimeRange[0] + 'T00:00:00';
                params.endCreateTime = params.createTimeRange[1] + 'T23:59:59';
            }
            delete params.createTimeRange;

            return params;
        };

        // 事件处理函数
        const handleSearch = () => {
            const searchParams = buildSearchParams();
            tableManager.search(searchParams);
        };

        const handleReset = () => {
            // 重置搜索表单
            Object.keys(searchForm).forEach(key => {
                if (Array.isArray(searchForm[key])) {
                    searchForm[key] = [];
                } else {
                    searchForm[key] = '';
                }
            });
            searchForm.sex = null;

            // 重置搜索
            tableManager.resetSearch();
        };

        const handleRefresh = () => {
            tableManager.refresh();
        };

        const handleCurrentChange = (page) => {
            tableManager.changePage(page);
        };

        const handleSizeChange = (size) => {
            tableManager.changePageSize(size);
        };

        const handleSelectionChange = (selection) => {
            tableManager.handleSelectionChange(selection);
            syncState();
        };

        const clearSelection = () => {
            tableManager.clearSelection();
            syncState();
        };

        const getSelectedIds = (idField = 'id') => {
            return tableManager.getSelectedIds(idField);
        };

        // 切换选择模式
        const switchToMultiple = () => {
            tableManager.config.selectionMode = 'multiple';
            tableManager.clearSelection();
            syncState();
            showMessage('已切换到多选模式', 'success');
        };

        const switchToSingle = () => {
            tableManager.config.selectionMode = 'single';
            tableManager.clearSelection();
            syncState();
            showMessage('已切换到单选模式', 'success');
        };

        // 操作处理函数
        const handleAdd = () => {
            showMessage('新增功能演示', 'info');
        };

        const handleBatchEdit = () => {
            const selected = getSelectedIds('empCode');
            showMessage(`批量修改: ${selected.join(', ')}`, 'info');
        };

        const handleBatchDelete = async () => {
            const selected = getSelectedIds('empCode');
            const confirmed = await showConfirm(
                `确定要删除选中的 ${selected.length} 项数据吗？`,
                '批量删除确认'
            );

            if (confirmed) {
                showMessage(`批量删除: ${selected.join(', ')}`, 'warning');
                // 这里可以调用实际的删除API
                // await deleteBatchUsers(selected);
                // tableManager.refresh();
            }
        };

        const handleView = (row) => {
            showMessage(`查看用户: ${row.empName}`, 'info');
        };

        const handleEdit = (row) => {
            showMessage(`编辑用户: ${row.empName}`, 'info');
        };

        const handleDelete = async (row) => {
            const confirmed = await showConfirm(
                `确定要删除用户 "${row.empName}" 吗？`,
                '删除确认'
            );

            if (confirmed) {
                showMessage(`删除用户: ${row.empName}`, 'warning');
                // 这里可以调用实际的删除API
                // await deleteUser(row.empCode);
                // tableManager.refresh();
            }
        };

        const handleExport = () => {
            const columns = [
                { prop: 'empCode', label: '员工编号' },
                { prop: 'empName', label: '员工姓名' },
                { prop: 'orgName', label: '组织名称' },
                { prop: 'postName', label: '岗位名称' },
                { prop: 'phoneNumber', label: '电话号码' },
                { prop: 'createTime', label: '创建时间' }
            ];

            tableHelpers.exportTableData(
                tableData.value,
                columns,
                `用户列表_${formatDate(new Date(), 'YYYY-MM-DD')}.csv`
            );
        };

        // 调试函数
        const testLoadData = () => {
            tableManager.loadData({ test: true });
        };

        const testSearch = () => {
            tableManager.search({ empName: '测试' });
        };

        const clearAllData = () => {
            tableManager.state.data = [];
            tableManager.state.total = 0;
            syncState();
            showMessage('数据已清空', 'warning');
        };

        const printTableManager = () => {
            console.log('TableManager 状态:', tableManager.getState());
            console.log('TableManager 配置:', tableManager.config);
        };

        // 生命周期
        onMounted(() => {
            const cleanup = initListPage();

            // 初始加载数据
            setTimeout(() => {
                tableManager.loadData().then(syncState);
            }, 100);

            onUnmounted(() => {
                cleanup();
                tableManager.destroy();
            });
        });

        return {
            // 搜索相关
            searchExpanded,
            hasMoreThanTwoRows,
            toggleSearchExpand,
            searchForm,

            // 表格相关
            operationMode,
            handleModeChange,
            tableData,
            loading,
            selectedRows,
            pagination,

            // 计算属性
            hasSelection,
            isMultipleSelection,
            isSingleSelection,

            // 方法
            handleSearch,
            handleReset,
            handleRefresh,
            handleCurrentChange,
            handleSizeChange,
            handleSelectionChange,
            clearSelection,
            getSelectedIds,
            switchToMultiple,
            switchToSingle,

            // 操作方法
            handleAdd,
            handleBatchEdit,
            handleBatchDelete,
            handleView,
            handleEdit,
            handleDelete,
            handleExport,

            // 工具函数
            formatDateTime,
            getGenderText,
            getGenderTagType,
            getSelectionModeText,

            // 调试函数
            testLoadData,
            testSearch,
            clearAllData,
            printTableManager
        };
    }
};
</script>

<style scoped>
@import '@/assets/styles/list-page.css';

.list-batch-tip {
    background-color: #f0f9ff;
    border: 1px solid #e1f5fe;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 12px;
    color: #0277bd;
    font-size: 14px;
}
</style>