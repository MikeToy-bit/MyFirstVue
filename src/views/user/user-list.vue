<template>
    <div class="list-page">
        <!-- 搜索区域 -->
        <el-card class="list-search-card">
            <template #header>
                <div class="list-search-header">
                    <span>查询条件</span>
                    <el-button v-if="hasMoreThanTwoRows" text @click="toggleSearchExpand"
                        class="list-search-expand-btn">
                        <el-icon>
                            <ArrowUp v-if="searchExpanded" />
                            <ArrowDown v-else />
                        </el-icon>
                        {{ searchExpanded ? "收起" : "展开" }}
                    </el-button>
                </div>
            </template>

            <div class="list-search-content" :class="{
                'list-search-collapsed': !searchExpanded && hasMoreThanTwoRows,
            }">
                <template v-if="true">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="员工编号">
                                <el-input v-model="searchForm.empCode" placeholder="请输入员工编号" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="员工姓名">
                                <el-input v-model="searchForm.empName" placeholder="请输入员工姓名" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="组织名称">
                                <el-input v-model="searchForm.orgName" placeholder="请输入组织名称" clearable />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="岗位名称">
                                <el-input v-model="searchForm.postName" placeholder="请输入岗位名称" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="性别">
                                <el-select v-model="searchForm.sex" placeholder="请选择性别" clearable>
                                    <el-option label="男" :value="true" />
                                    <el-option label="女" :value="false" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电话号码">
                                <el-input v-model="searchForm.phoneNumber" placeholder="请输入电话号码" clearable />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="身份证号">
                                <el-input v-model="searchForm.idCard" placeholder="请输入身份证号" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电话号码">
                                <el-input v-model="searchForm.phoneNumber" placeholder="请输入电话号码" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="创建时间">
                                <el-date-picker v-model="searchForm.createTimeRange" type="daterange"
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
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
                        </el-col>
                    </el-row>
                </template>
            </div>
        </el-card>

        <!-- 表格区域 -->
        <el-card class="list-table-card">
            <template #header>
                <div class="list-table-header">
                    <span>用户列表</span>
                    <div class="list-table-header-controls">
                        <el-radio-group v-model="operationMode" @change="handleModeChange">
                            <el-radio-button label="toolbar">工具栏模式</el-radio-button>
                            <el-radio-button label="column">操作列模式</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
            </template>

            <div class="list-table-container">
                <!-- 工具栏模式的操作按钮 -->
                <div v-if="operationMode === 'toolbar'" class="list-table-toolbar">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增
                    </el-button>
                    <el-button type="success" :disabled="!selectedRows.length" @click="handleBatchEdit">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        修改
                    </el-button>
                    <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                    <el-button type="info" :disabled="!selectedRows.length" @click="handleBatchView">
                        <el-icon>
                            <View />
                        </el-icon>
                        查看
                    </el-button>
                    <el-button type="warning" :disabled="!selectedRows.length" @click="handleBatchRestore">
                        <el-icon>
                            <RefreshRight />
                        </el-icon>
                        恢复
                    </el-button>
                </div>

                <!-- 表格主体 -->
                <div class="list-table-wrapper">
                    <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" stripe
                        border height="100%" style="width: 100%">
                        <el-table-column v-if="operationMode === 'toolbar'" type="selection" width="55" />
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
                        <el-table-column v-if="operationMode === 'column'" label="操作" width="300" fixed="right">
                            <template #default="scope">
                                <div class="list-table-actions">
                                    <el-button type="primary" size="small" @click="handleView(scope.row)">
                                        <el-icon>
                                            <View />
                                        </el-icon>
                                        查看详情
                                    </el-button>
                                    <el-button type="success" size="small" @click="handleEdit(scope.row)">
                                        <el-icon>
                                            <Edit />
                                        </el-icon>
                                        编辑
                                    </el-button>
                                    <el-dropdown @command="
                                        (command) =>
                                            handleDropdownCommand(
                                                command,
                                                scope.row
                                            )
                                    ">
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
                        </el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <div class="list-pagination">
                    <el-pagination v-model:current-page="pagination.pageIndex" v-model:page-size="pagination.pageSize"
                        :page-sizes="pagination.pageSizes" :total="pagination.totalCount" :layout="pagination.layout"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import {
    Search,
    Refresh,
    Plus,
    Edit,
    Delete,
    View,
    ArrowDown,
    RefreshRight,
    ArrowUp,
} from "@element-plus/icons-vue";

// 导入API服务
import {
    queryUsers,
    deleteUser,
    batchDeleteUsers,
    restoreUser,
} from "@/api/user";

// 导入通用工具函数
import {
    showMessage,
    showConfirm,
    showLocalLoading,
    hideLocalLoading,
} from "@/utils/common";

// 导入列表页面工具函数
import { useListPage, tableUtils, paginationConfig } from "@/utils/list-page";

export default {
    name: "UserList",
    components: {
        Search,
        Refresh,
        Plus,
        Edit,
        Delete,
        View,
        ArrowDown,
        RefreshRight,
        ArrowUp,
    },
    setup() {
        const loading = ref(false);

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
            initListPage
        } = useListPage({
            searchFields,
            fieldsPerRow: 3
        });

        // 分页配置
        const pagination = reactive(paginationConfig.create());

        // 搜索表单
        const searchForm = reactive({
            empCode: "",
            empName: "",
            orgCode: "",
            orgName: "",
            postCode: "",
            postName: "",
            sex: null,
            phoneNumber: "",
            idCard: "",
            createTimeRange: [],
            startCreateTime: "",
            endCreateTime: "",
        });

        // 表格数据
        const tableData = ref([]);

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

        // 构建查询参数
        const buildQueryParams = () => {
            const params = { ...searchForm };

            // 处理日期范围
            if (params.createTimeRange && params.createTimeRange.length === 2) {
                params.startCreateTime =
                    params.createTimeRange[0] + "T00:00:00";
                params.endCreateTime = params.createTimeRange[1] + "T23:59:59";
            }
            delete params.createTimeRange;

            // 添加分页参数
            params.pageIndex = pagination.pageIndex;
            params.pageSize = pagination.pageSize;

            return params;
        };

        // 加载用户数据
        const loadUserData = async () => {
            try {
                loading.value = true;
                const params = buildQueryParams();
                const response = await queryUsers(params);

                if (response.success) {
                    tableData.value = response.data.items || [];
                    pagination.totalCount = response.data.totalCount || 0;
                    pagination.totalPages = response.data.totalPages || 0;
                } else {
                    showMessage(response.message || "查询失败", "error");
                }
            } catch (error) {
                console.error("查询用户数据失败:", error);
                showMessage("查询失败，请稍后重试", "error");
            } finally {
                loading.value = false;
            }
        };

        // 搜索
        const handleSearch = () => {
            pagination.pageIndex = 1;
            loadUserData();
        };

        // 重置搜索条件
        const handleReset = () => {
            Object.keys(searchForm).forEach((key) => {
                if (Array.isArray(searchForm[key])) {
                    searchForm[key] = [];
                } else if (typeof searchForm[key] === "boolean") {
                    searchForm[key] = null;
                } else {
                    searchForm[key] = "";
                }
            });
            showMessage("搜索条件已重置", "info");
            handleSearch();
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
                    document.querySelector(".list-page"),
                    "delete",
                    "正在删除..."
                );

                const response = await batchDeleteUsers(empCodes);
                hideLocalLoading("delete");

                if (response.success) {
                    showMessage("删除成功", "success");
                    selectedRows.value = [];
                    loadUserData();
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
                    document.querySelector(".list-page"),
                    "restore",
                    "正在恢复..."
                );

                for (const row of selectedRows.value) {
                    await restoreUser(row.empCode);
                }

                hideLocalLoading("restore");
                showMessage("恢复成功", "success");
                selectedRows.value = [];
                loadUserData();
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
                            document.querySelector(".list-page"),
                            "singleDelete",
                            "正在删除..."
                        );
                        const response = await deleteUser(row.empCode);
                        hideLocalLoading("singleDelete");

                        if (response.success) {
                            showMessage("删除成功", "success");
                            loadUserData();
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
                            document.querySelector(".list-page"),
                            "singleRestore",
                            "正在恢复..."
                        );
                        const response = await restoreUser(row.empCode);
                        hideLocalLoading("singleRestore");

                        if (response.success) {
                            showMessage("恢复成功", "success");
                            loadUserData();
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

        // 分页
        const handleSizeChange = (val) => {
            pagination.pageSize = val;
            pagination.pageIndex = 1;
            loadUserData();
        };

        const handleCurrentChange = (val) => {
            pagination.pageIndex = val;
            loadUserData();
        };

        // 组件挂载时初始化
        onMounted(() => {
            loadUserData();

            // 初始化列表页面功能
            const cleanup = initListPage();

            // 组件卸载时清理
            onUnmounted(cleanup);
        });

        return {
            loading,
            operationMode,
            selectedRows,
            searchExpanded,
            hasMoreThanTwoRows,
            pagination,
            searchForm,
            tableData,
            formatDateTime,
            getGenderText,
            getGenderTagType,
            handleSearch,
            handleReset,
            handleModeChange,
            toggleSearchExpand,
            handleSelectionChange,
            handleAdd,
            handleBatchEdit,
            handleBatchDelete,
            handleBatchView,
            handleBatchRestore,
            handleView,
            handleEdit,
            handleDropdownCommand,
            handleSizeChange,
            handleCurrentChange,
        };
    },
};
</script>

<style scoped>
@import '@/assets/styles/list-page.css';
</style>
