<template>
    <div class="users">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>用户列表</span>
                    <el-button type="primary" @click="handleAdd"
                        >添加用户</el-button
                    >
                </div>
            </template>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="username" label="用户名" width="120" />
                <el-table-column prop="nickname" label="昵称" width="120" />
                <el-table-column prop="role" label="角色" width="100">
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.role === 'admin' ? 'danger' : ''"
                        >
                            {{
                                scope.row.role === "admin"
                                    ? "管理员"
                                    : "普通用户"
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="180"
                />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag
                            :type="
                                scope.row.status === 'active'
                                    ? 'success'
                                    : 'info'
                            "
                        >
                            {{
                                scope.row.status === "active" ? "正常" : "禁用"
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button
                            type="primary"
                            size="small"
                            @click="handleEdit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            type="danger"
                            size="small"
                            @click="handleDelete(scope.row)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
    setup() {
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(100);

        const tableData = reactive([
            {
                id: 1,
                username: "admin",
                nickname: "管理员",
                role: "admin",
                createTime: "2024-03-20 10:00:00",
                status: "active",
            },
            {
                id: 2,
                username: "user1",
                nickname: "用户1",
                role: "user",
                createTime: "2024-03-20 09:30:00",
                status: "active",
            },
            {
                id: 3,
                username: "user2",
                nickname: "用户2",
                role: "user",
                createTime: "2024-03-20 09:00:00",
                status: "inactive",
            },
        ]);

        const handleAdd = () => {
            // 跳转到添加用户页面
        };

        const handleEdit = (row) => {
            // 编辑用户
            ElMessage.success(`编辑用户 ${row.username}`);
        };

        const handleDelete = (row) => {
            ElMessageBox.confirm(
                `确定要删除用户 ${row.username} 吗？`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    ElMessage.success("删除成功");
                })
                .catch(() => {
                    ElMessage.info("已取消删除");
                });
        };

        const handleSizeChange = (val) => {
            pageSize.value = val;
            // 重新加载数据
        };

        const handleCurrentChange = (val) => {
            currentPage.value = val;
            // 重新加载数据
        };

        return {
            currentPage,
            pageSize,
            total,
            tableData,
            handleAdd,
            handleEdit,
            handleDelete,
            handleSizeChange,
            handleCurrentChange,
        };
    },
};
</script>

<style scoped>
.users {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

:deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
    padding: 20px;
}
</style>
