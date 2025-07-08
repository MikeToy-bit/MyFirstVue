<template>
    <div class="user-list-page">
        <CommonTable ref="userTableRef" :api-function="queryUsers" :search-fields="searchFields" :columns="tableColumns"
            table-title="用户列表" :selection-mode="operationMode === 'toolbar' ? 'multiple' : 'none'"
            :show-actions="operationMode === 'column'" :show-toolbar="operationMode === 'toolbar'"
            :show-table-header="true" :table-props="tableProps" @data-loaded="onDataLoaded"
            @selection-change="onSelectionChange" @search="onSearch" @reset="onReset">
            <!-- 表格头部操作 -->
            <template #table-header>
                <div class="table-header-controls">
                    <el-radio-group v-model="operationMode" @change="handleModeChange">
                        <el-radio-button label="toolbar">工具栏模式</el-radio-button>
                        <el-radio-button label="column">操作列模式</el-radio-button>
                    </el-radio-group>
                </div>
            </template>

            <!-- 工具栏 -->
            <template #toolbar="{ selectedRows, hasSelection }">
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
                <el-button type="info" :disabled="!hasSelection" @click="handleBatchView">
                    <el-icon>
                        <View />
                    </el-icon>
                    查看
                </el-button>
                <el-button type="warning" :disabled="!hasSelection" @click="handleBatchRestore">
                    <el-icon>
                        <RefreshRight />
                    </el-icon>
                    恢复
                </el-button>
                <span v-if="hasSelection" style="margin-left: 15px; color: #606266;">
                    已选择 {{ selectedRows.length }} 项
                </span>
            </template>

            <!-- 自定义性别列 -->
            <template #sex="{ value }">
                <el-tag :type="getGenderTagType(value)">
                    {{ getGenderText(value) }}
                </el-tag>
            </template>

            <!-- 自定义创建时间列 -->
            <template #createTime="{ value }">
                {{ formatDateTime(value) }}
            </template>

            <!-- 操作列 -->
            <template #actions="{ row }">
                <div class="table-actions">
                    <el-button type="primary" size="small" @click="handleView(row)">
                        <el-icon>
                            <View />
                        </el-icon>
                        查看详情
                    </el-button>
                    <el-button type="success" size="small" @click="handleEdit(row)">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        编辑
                    </el-button>
                    <el-dropdown @command="(command) => handleDropdownCommand(command, row)">
                        <el-button type="info" size="small">
                            更多
                            <el-icon class="el-icon--right">
                                <ArrowDown />
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="delete">删除</el-dropdown-item>
                                <el-dropdown-item command="restore">恢复</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </template>
        </CommonTable>
    </div>
</template>

<script>
import request from "@/utils/request";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import {
    Plus,
    Edit,
    Delete,
    View,
    ArrowDown,
    RefreshRight,
} from "@element-plus/icons-vue";

// 导入CommonTable组件
import CommonTable from "@/components/CommonTable.vue";

// 导入API服务
// import {
//     queryUsers,
//     deleteUser,
//     batchDeleteUsers,
//     restoreUser,
// } from "@/api/user";

// 导入通用工具函数
import {
    showMessage,
    showConfirm,
    showLocalLoading,
    hideLocalLoading,
} from "@/utils/common";

// 导入列表页面工具函数
import { useListPage, tableUtils } from "@/utils/list-page";

const queryUsers = (queryParams) => {
    return request({
        url: "/api/user/query",
        method: "post",
        data: queryParams,
    });
};




export default {
    name: "UserList",
    components: {
        CommonTable,
        Plus,
        Edit,
        Delete,
        View,
        ArrowDown,
        RefreshRight,
    },
    setup() {
        // 表格引用
        const userTableRef = ref();

        // 操作模式
        const operationMode = ref("toolbar");

        // 当前选中的行
        const selectedRows = ref([]);

        // 搜索字段配置
        const searchFields = [
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
                placeholder: '请输入组织名称',
            },
            {
                prop: 'postName',
                label: '岗位名称',
                type: 'input',
                placeholder: '请输入岗位名称',
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
            {
                prop: 'phoneNumber',
                label: '电话号码',
                type: 'input',
                placeholder: '请输入电话号码',
            },
            {
                prop: 'idCard',
                label: '身份证号',
                type: 'input',
                placeholder: '请输入身份证号',
            },
            {
                prop: 'createTimeRange',
                label: '创建时间',
                type: 'daterange',
                startField: 'startCreateTime',
                endField: 'endCreateTime',
                timeStart: 'T00:00:00',
                timeEnd: 'T23:59:59',
            },
        ];

        // 表格列配置
        const tableColumns = [
            { prop: 'empCode', label: '员工编号', width: 120 },
            { prop: 'empName', label: '员工姓名', width: 120 },
            { prop: 'orgName', label: '组织名称', width: 150 },
            { prop: 'postName', label: '岗位名称', width: 120 },
            { prop: 'sex', label: '性别', width: 80, slot: 'sex' },
            { prop: 'phoneNumber', label: '电话号码', width: 130 },
            { prop: 'idCard', label: '身份证号', width: 180 },
            { prop: 'createTime', label: '创建时间', width: 180, slot: 'createTime' },
        ];

        // 表格属性配置
        const tableProps = {
            stripe: true,
            border: true,
            height: '100%',
            'highlight-current-row': true,
        };

        // 使用表格工具函数
        const formatDateTime = (dateTime) => {
            return tableUtils.formatDateTime(dateTime);
        };

        const getGenderText = (sex) => {
            return tableUtils.getGenderText(sex);
        };

        const getGenderTagType = (sex) => {
            return tableUtils.getGenderTagType(sex);
        };

        // 模式切换处理
        const handleModeChange = (mode) => {
            operationMode.value = mode;
            // 清空选择
            if (userTableRef.value) {
                userTableRef.value.clearSelection();
            }
            selectedRows.value = [];
        };

        // 事件处理
        const onDataLoaded = (data, total) => {
            console.log('用户数据加载完成:', { count: data.length, total });
        };

        const onSelectionChange = (selection) => {
            selectedRows.value = selection;
            console.log('选择变化:', selection.length);
        };

        const onSearch = (searchParams) => {
            console.log('搜索参数:', searchParams);
        };

        const onReset = () => {
            console.log('重置搜索条件');
        };

        // 新增
        const handleAdd = () => {
            showMessage("跳转到新增页面", "success");
        };

        // 批量编辑
        const handleBatchEdit = () => {
            if (selectedRows.value.length === 1) {
                handleEdit(selectedRows.value[0]);
            } else {
                showMessage("请选择一条记录进行编辑", "warning");
            }
        };

        // 批量删除
        const handleBatchDelete = async () => {
            if (!selectedRows.value.length) {
                showMessage("请选择要删除的记录", "warning");
                return;
            }

            try {
                await showConfirm(
                    `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
                    "删除确认"
                );

                const empCodes = selectedRows.value.map((row) => row.empCode);
                showLocalLoading(
                    document.querySelector(".user-list-page"),
                    "delete",
                    "正在删除..."
                );

                const response = await batchDeleteUsers(empCodes);
                hideLocalLoading("delete");

                if (response.success) {
                    showMessage("删除成功", "success");
                    // 清空选择并刷新数据
                    userTableRef.value.clearSelection();
                    userTableRef.value.refresh();
                } else {
                    showMessage(response.message || "删除失败", "error");
                }
            } catch (error) {
                hideLocalLoading("delete");
                if (error !== "cancel") {
                    console.error("批量删除失败:", error);
                    showMessage("删除失败，请稍后重试", "error");
                }
            }
        };

        // 批量查看
        const handleBatchView = () => {
            if (selectedRows.value.length === 1) {
                handleView(selectedRows.value[0]);
            } else {
                showMessage("请选择一条记录进行查看", "warning");
            }
        };

        // 批量恢复
        const handleBatchRestore = async () => {
            if (!selectedRows.value.length) {
                showMessage("请选择要恢复的记录", "warning");
                return;
            }

            try {
                await showConfirm(
                    `确定要恢复选中的 ${selectedRows.value.length} 条记录吗？`,
                    "恢复确认"
                );

                showLocalLoading(
                    document.querySelector(".user-list-page"),
                    "restore",
                    "正在恢复..."
                );

                for (const row of selectedRows.value) {
                    await restoreUser(row.empCode);
                }

                hideLocalLoading("restore");
                showMessage("恢复成功", "success");
                // 清空选择并刷新数据
                userTableRef.value.clearSelection();
                userTableRef.value.refresh();
            } catch (error) {
                hideLocalLoading("restore");
                if (error !== "cancel") {
                    console.error("批量恢复失败:", error);
                    showMessage("恢复失败，请稍后重试", "error");
                }
            }
        };

        // 单行操作
        const handleView = (row) => {
            showMessage(`查看用户详情: ${row.empName}`, "success");
        };

        const handleEdit = (row) => {
            showMessage(`编辑用户: ${row.empName}`, "success");
        };

        // 下拉菜单命令
        const handleDropdownCommand = async (command, row) => {
            switch (command) {
                case "delete":
                    try {
                        await showConfirm(
                            `确定要删除用户 ${row.empName} 吗？`,
                            "删除确认"
                        );

                        showLocalLoading(
                            document.querySelector(".user-list-page"),
                            "singleDelete",
                            "正在删除..."
                        );
                        const response = await deleteUser(row.empCode);
                        hideLocalLoading("singleDelete");

                        if (response.success) {
                            showMessage("删除成功", "success");
                            userTableRef.value.refresh();
                        } else {
                            showMessage(
                                response.message || "删除失败",
                                "error"
                            );
                        }
                    } catch (error) {
                        hideLocalLoading("singleDelete");
                        if (error !== "cancel") {
                            console.error("删除用户失败:", error);
                            showMessage("删除失败，请稍后重试", "error");
                        }
                    }
                    break;

                case "restore":
                    try {
                        await showConfirm(
                            `确定要恢复用户 ${row.empName} 吗？`,
                            "恢复确认"
                        );

                        showLocalLoading(
                            document.querySelector(".user-list-page"),
                            "singleRestore",
                            "正在恢复..."
                        );
                        const response = await restoreUser(row.empCode);
                        hideLocalLoading("singleRestore");

                        if (response.success) {
                            showMessage("恢复成功", "success");
                            userTableRef.value.refresh();
                        } else {
                            showMessage(
                                response.message || "恢复失败",
                                "error"
                            );
                        }
                    } catch (error) {
                        hideLocalLoading("singleRestore");
                        if (error !== "cancel") {
                            console.error("恢复用户失败:", error);
                            showMessage("恢复失败，请稍后重试", "error");
                        }
                    }
                    break;
            }
        };

        return {
            // refs
            userTableRef,

            // 状态
            operationMode,
            selectedRows,

            // 配置
            searchFields,
            tableColumns,
            tableProps,

            // API
            queryUsers,

            // 工具函数
            formatDateTime,
            getGenderText,
            getGenderTagType,

            // 事件处理
            handleModeChange,
            onDataLoaded,
            onSelectionChange,
            onSearch,
            onReset,

            // 操作方法
            handleAdd,
            handleBatchEdit,
            handleBatchDelete,
            handleBatchView,
            handleBatchRestore,
            handleView,
            handleEdit,
            handleDropdownCommand,
        };
    },
};
</script>

<style scoped>
.user-list-page {
    padding: 20px;
}

.table-header-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.table-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.table-actions .el-button {
    padding: 5px 8px;
}
</style>
