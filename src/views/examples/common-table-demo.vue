<template>
    <div class="common-table-demo">
        <h1>CommonTable 组件使用示例</h1>

        <!-- 基础表格示例 -->
        <h2>1. 基础表格</h2>
        <CommonTable ref="basicTableRef" :api-function="queryUsers" :search-fields="basicSearchFields"
            :columns="basicColumns" table-title="用户列表" selection-mode="multiple" :show-actions="true"
            @data-loaded="onDataLoaded" @selection-change="onSelectionChange">
            <!-- 自定义性别列 -->
            <template #gender="{ value }">
                <el-tag :type="value ? 'primary' : 'success'">
                    {{ value ? '男' : '女' }}
                </el-tag>
            </template>

            <!-- 自定义操作列 -->
            <template #actions="{ row }">
                <el-button type="primary" size="small" @click="handleView(row)">
                    查看
                </el-button>
                <el-button type="success" size="small" @click="handleEdit(row)">
                    编辑
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">
                    删除
                </el-button>
            </template>

            <!-- 自定义表格头部操作 -->
            <template #table-header="{ refresh }">
                <el-button type="primary" @click="handleAdd">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    新增用户
                </el-button>
                <el-button @click="refresh">
                    <el-icon>
                        <Refresh />
                    </el-icon>
                    刷新
                </el-button>
            </template>
        </CommonTable>

        <!-- 高级表格示例 -->
        <h2 style="margin-top: 40px;">2. 高级表格（带工具栏和自定义搜索）</h2>
        <CommonTable ref="advancedTableRef" :api-function="queryUsers" :search-fields="advancedSearchFields"
            :columns="advancedColumns" table-title="高级用户管理" selection-mode="multiple" :show-toolbar="true"
            :search-cols-per-row="4" :search-collapse-threshold="8" :table-props="advancedTableProps" @search="onSearch"
            @reset="onReset" @row-click="onRowClick">
            <!-- 自定义搜索字段 -->
            <template #search-status="{ value, setValue }">
                <el-select :model-value="value" placeholder="请选择状态" clearable @change="setValue">
                    <el-option label="启用" value="active" />
                    <el-option label="禁用" value="inactive" />
                    <el-option label="待审核" value="pending" />
                </el-select>
            </template>

            <!-- 自定义状态列 -->
            <template #status="{ value }">
                <el-tag :type="getStatusTagType(value)">
                    {{ getStatusText(value) }}
                </el-tag>
            </template>

            <!-- 自定义创建时间列 -->
            <template #createTime="{ value }">
                <span>{{ formatDateTime(value) }}</span>
            </template>

            <!-- 工具栏 -->
            <template #toolbar="{ selectedRows, hasSelection }">
                <el-button type="primary">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    批量导入
                </el-button>
                <el-button type="success" :disabled="!hasSelection">
                    <el-icon>
                        <Edit />
                    </el-icon>
                    批量修改
                </el-button>
                <el-button type="danger" :disabled="!hasSelection">
                    <el-icon>
                        <Delete />
                    </el-icon>
                    批量删除
                </el-button>
                <el-button type="info">
                    <el-icon>
                        <Download />
                    </el-icon>
                    导出数据
                </el-button>
                <span style="margin-left: 15px; color: #606266;">
                    已选择 {{ selectedRows.length }} 项
                </span>
            </template>
        </CommonTable>

        <!-- 单选表格示例 -->
        <h2 style="margin-top: 40px;">3. 单选表格（选择器模式）</h2>
        <CommonTable ref="selectorTableRef" :api-function="queryUsers" :search-fields="selectorSearchFields"
            :columns="selectorColumns" table-title="选择用户" selection-mode="single" :page-size="5"
            :page-sizes="[5, 10, 20]" :show-actions="false" :show-selection-tip="false"
            :table-props="{ size: 'small', height: '300px' }" @selection-change="onSingleSelectionChange">
            <!-- 简化的状态显示 -->
            <template #status="{ value }">
                <el-tag size="small" :type="value === 'active' ? 'success' : 'info'">
                    {{ value === 'active' ? '在线' : '离线' }}
                </el-tag>
            </template>
        </CommonTable>

        <div style="margin-top: 10px;">
            <strong>选中的用户：</strong>
            {{ selectedUser ? `${selectedUser.empName} (${selectedUser.empCode})` : '未选择' }}
        </div>

        <!-- 无搜索表格示例 -->
        <h2 style="margin-top: 40px;">4. 只读表格（无搜索、无选择）</h2>
        <CommonTable ref="readonlyTableRef" :api-function="queryUsers" :search-fields="[]" :columns="readonlyColumns"
            table-title="数据展示" selection-mode="none" :show-search="false" :show-actions="false"
            :show-refresh-button="false" :table-props="{ size: 'mini' }" />

        <!-- 调试信息 -->
        <el-card style="margin-top: 40px;">
            <template #header>
                <span>调试信息</span>
            </template>
            <el-row :gutter="20">
                <el-col :span="12">
                    <h4>基础表格状态</h4>
                    <p>选中数量: {{ basicSelectionCount }}</p>
                    <p>数据总数: {{ basicDataCount }}</p>
                </el-col>
                <el-col :span="12">
                    <h4>操作按钮</h4>
                    <el-button @click="refreshBasicTable">刷新基础表格</el-button>
                    <el-button @click="clearBasicSelection">清空选择</el-button>
                    <el-button @click="getBasicTableData">获取表格数据</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { Plus, Edit, Delete, Download, Refresh } from '@element-plus/icons-vue';
import CommonTable from '@/components/CommonTable.vue';
import { queryUsers } from '@/api/user';
import { formatDate, showMessage, showConfirm } from '@/utils/common';

export default {
    name: 'CommonTableDemo',
    components: {
        CommonTable,
        Plus,
        Edit,
        Delete,
        Download,
        Refresh,
    },
    setup() {
        // 表格refs
        const basicTableRef = ref();
        const advancedTableRef = ref();
        const selectorTableRef = ref();
        const readonlyTableRef = ref();

        // 状态管理
        const basicSelectedRows = ref([]);
        const selectedUser = ref(null);
        const basicData = ref([]);

        // 计算属性
        const basicSelectionCount = computed(() => basicSelectedRows.value.length);
        const basicDataCount = computed(() => basicData.value.length);

        // 基础表格配置
        const basicSearchFields = [
            {
                prop: 'empCode',
                label: '员工编号',
                type: 'input',
                placeholder: '请输入员工编号',
            },
            {
                prop: 'empName',
                label: '员工姓名',
                type: 'input',
                placeholder: '请输入员工姓名',
            },
            {
                prop: 'orgName',
                label: '组织名称',
                type: 'input',
            },
            {
                prop: 'sex',
                label: '性别',
                type: 'select',
                options: [
                    { label: '男', value: true },
                    { label: '女', value: false },
                ],
            },
        ];

        const basicColumns = [
            { prop: 'empCode', label: '员工编号', width: 120 },
            { prop: 'empName', label: '员工姓名', width: 120 },
            { prop: 'orgName', label: '组织名称', width: 150 },
            { prop: 'sex', label: '性别', width: 80, slot: 'gender' },
            { prop: 'phoneNumber', label: '电话号码', width: 130 },
            { prop: 'idCard', label: '身份证号', width: 180 },
        ];

        // 高级表格配置
        const advancedSearchFields = [
            { prop: 'empCode', label: '员工编号', type: 'input' },
            { prop: 'empName', label: '员工姓名', type: 'input' },
            { prop: 'orgName', label: '组织名称', type: 'input' },
            { prop: 'postName', label: '岗位名称', type: 'input' },
            {
                prop: 'sex', label: '性别', type: 'select', options: [
                    { label: '男', value: true },
                    { label: '女', value: false },
                ]
            },
            { prop: 'status', label: '状态', type: 'slot' },
            { prop: 'phoneNumber', label: '电话号码', type: 'input' },
            {
                prop: 'createTimeRange', label: '创建时间', type: 'daterange',
                startField: 'startCreateTime', endField: 'endCreateTime'
            },
        ];

        const advancedColumns = [
            { prop: 'empCode', label: '员工编号', width: 120, sortable: true },
            { prop: 'empName', label: '员工姓名', width: 120 },
            { prop: 'orgName', label: '组织名称', width: 150 },
            { prop: 'postName', label: '岗位名称', width: 120 },
            { prop: 'sex', label: '性别', width: 80, slot: 'gender' },
            { prop: 'phoneNumber', label: '电话号码', width: 130 },
            { prop: 'status', label: '状态', width: 100, slot: 'status' },
            { prop: 'createTime', label: '创建时间', width: 180, slot: 'createTime' },
        ];

        const advancedTableProps = {
            stripe: true,
            border: true,
            height: '400px',
            'show-header': true,
            'highlight-current-row': true,
        };

        // 选择器表格配置
        const selectorSearchFields = [
            { prop: 'empName', label: '姓名', type: 'input' },
            { prop: 'orgName', label: '部门', type: 'input' },
        ];

        const selectorColumns = [
            { prop: 'empCode', label: '编号', width: 100 },
            { prop: 'empName', label: '姓名', width: 120 },
            { prop: 'orgName', label: '部门', width: 150 },
            { prop: 'status', label: '状态', width: 80, slot: 'status' },
        ];

        // 只读表格配置
        const readonlyColumns = [
            { prop: 'empCode', label: '编号', width: 100 },
            { prop: 'empName', label: '姓名', width: 120 },
            { prop: 'orgName', label: '部门', width: 150 },
            { prop: 'postName', label: '岗位', width: 120 },
            { prop: 'phoneNumber', label: '电话', width: 130 },
        ];

        // 工具函数
        const formatDateTime = (dateTime) => {
            return formatDate(dateTime, 'YYYY-MM-DD HH:mm');
        };

        const getStatusTagType = (status) => {
            const typeMap = {
                'active': 'success',
                'inactive': 'danger',
                'pending': 'warning',
            };
            return typeMap[status] || 'info';
        };

        const getStatusText = (status) => {
            const textMap = {
                'active': '启用',
                'inactive': '禁用',
                'pending': '待审核',
            };
            return textMap[status] || status;
        };

        // 事件处理
        const onDataLoaded = (data, total) => {
            console.log('基础表格数据加载完成:', { count: data.length, total });
            basicData.value = data;
        };

        const onSelectionChange = (selection) => {
            console.log('基础表格选择变化:', selection.length);
            basicSelectedRows.value = selection;
        };

        const onSingleSelectionChange = (selection) => {
            console.log('选择器表格选择变化:', selection.length);
            selectedUser.value = selection.length > 0 ? selection[0] : null;
        };

        const onSearch = (searchParams) => {
            console.log('高级表格搜索:', searchParams);
        };

        const onReset = () => {
            console.log('高级表格重置');
        };

        const onRowClick = (row, column, event) => {
            console.log('行点击:', row.empName);
        };

        // 操作方法
        const handleView = (row) => {
            showMessage(`查看用户: ${row.empName}`, 'info');
        };

        const handleEdit = (row) => {
            showMessage(`编辑用户: ${row.empName}`, 'info');
        };

        const handleDelete = async (row) => {
            try {
                await showConfirm(`确定要删除用户 "${row.empName}" 吗？`);
                showMessage(`删除用户: ${row.empName}`, 'success');
            } catch {
                // 用户取消删除
            }
        };

        const handleAdd = () => {
            showMessage('新增用户功能', 'info');
        };

        // 调试方法
        const refreshBasicTable = () => {
            if (basicTableRef.value) {
                basicTableRef.value.refresh();
            }
        };

        const clearBasicSelection = () => {
            if (basicTableRef.value) {
                basicTableRef.value.clearSelection();
            }
        };

        const getBasicTableData = () => {
            if (basicTableRef.value) {
                const data = basicTableRef.value.getTableData();
                console.log('基础表格数据:', data);
                showMessage(`获取到 ${data.length} 条数据，请查看控制台`, 'info');
            }
        };

        return {
            // refs
            basicTableRef,
            advancedTableRef,
            selectorTableRef,
            readonlyTableRef,

            // 配置
            basicSearchFields,
            basicColumns,
            advancedSearchFields,
            advancedColumns,
            advancedTableProps,
            selectorSearchFields,
            selectorColumns,
            readonlyColumns,

            // 状态
            basicSelectedRows,
            selectedUser,
            basicData,

            // 计算属性
            basicSelectionCount,
            basicDataCount,

            // API
            queryUsers,

            // 工具函数
            formatDateTime,
            getStatusTagType,
            getStatusText,

            // 事件处理
            onDataLoaded,
            onSelectionChange,
            onSingleSelectionChange,
            onSearch,
            onReset,
            onRowClick,

            // 操作方法
            handleView,
            handleEdit,
            handleDelete,
            handleAdd,

            // 调试方法
            refreshBasicTable,
            clearBasicSelection,
            getBasicTableData,
        };
    },
};
</script>

<style scoped>
.common-table-demo {
    padding: 20px;
}

h1 {
    color: #303133;
    margin-bottom: 30px;
}

h2 {
    color: #606266;
    margin: 20px 0;
}
</style>