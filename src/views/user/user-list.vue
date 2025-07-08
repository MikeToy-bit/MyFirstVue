<template>
    <el-card shadow="always" ref="filterCardRef">
        <el-form :model="filterForm">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="工号：">
                        <el-input v-model="filterForm.empCode" clearable placeholder="请输入工号" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="用户名：">
                        <el-input v-model="filterForm.empName" clearable placeholder="请输入用户名" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="组织：">
                        <el-select v-model="filterForm.orgName" placeholder="请选择组织" clearable>
                            <el-option label="研发部" value="研发部" />
                            <el-option label="销售部" value="销售部" />
                            <el-option label="财务部" value="财务部" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label-position="right">
                        <el-button type="primary" @click="queryUsers" :icon="Search">
                            查询
                        </el-button>
                        <el-button @click="resetForm" :icon="Refresh">
                            重置
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top: 10px;" :style="{ height: cardTableHeight }" ref="tableCardRef">
        <div class="bt-toolbar">
            <el-button type="primary" @click="addUser" :icon="Plus">
                新增
            </el-button>
            <el-button type="primary" @click="addUser" :icon="Edit">
                修改
            </el-button>
            <el-button type="primary" @click="addUser" :icon="Delete">
                删除
            </el-button>
            <el-button type="primary" @click="addUser" :icon="View">
                查看
            </el-button>
            <el-button type="primary" @click="addUser" :icon="ArrowUp">
                导入
            </el-button>
            <el-button type="primary" @click="addUser" :icon="ArrowDown">
                导出
            </el-button>
        </div>

        <el-table :data="tableData" border :style="{ height: tableHeight }" width="100%">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="empCode" label="工号" align="center" width="250" />
            <el-table-column prop="empName" label="姓名" align="center" width="250" />
            <el-table-column prop="orgName" label="机构" width="580" />
            <el-table-column prop="PostName" label="岗位" align="center" width="200" />
            <el-table-column prop="sex" label="性别" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.sex ? 'primary' : 'success'">
                        {{ row.sex ? "男" : "女" }}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <el-pagination background layout="prev, pager, next" :total="filterForm.total"
                :page-size="filterForm.pageSize" :current-page="filterForm.pageIndex"
                @current-change="handleCurrentChange" />
        </template>
    </el-card>
    <!-- 新增用户 -->
    <el-dialog v-model="dialogVisible" title="新增用户" width="70%">
        <el-card>
            <el-form :model="dataForm" :rules="rules" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="工号：" prop="empCode">
                            <el-input v-model="dataForm.empCode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户名：" prop="empName">
                            <el-input v-model="dataForm.empName" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="组织：" prop="orgName">
                            <el-select v-model="dataForm.orgName" placeholder="请选择组织" clearable>
                                <el-option label="研发部" value="研发部" />
                                <el-option label="销售部" value="销售部" />
                                <el-option label="财务部" value="财务部" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别：" prop="sex">
                            <el-radio-group v-model="dataForm.sex">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="岗位：" prop="postName">
                            <el-input v-model="dataForm.postName" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <template #footer>
            <el-button type="primary" @click="addUser">
                保存
            </el-button>
            <el-button @click="dialogVisible = false">
                取消
            </el-button>
        </template>
    </el-dialog>

</template>

<script setup>
import request from "@/utils/request";
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";
import {
    Plus,
    Edit,
    Delete,
    View,
    ArrowDown,
    RefreshRight,
    Search,
    Refresh,
    ArrowUp
} from "@element-plus/icons-vue";

const tableData = ref([]);
const loading = ref(true);

// 搜索表单
const filterForm = reactive({
    empCode: '',
    empName: '',
    orgName: '',
    pageIndex: 1,
    pageSize: 10,
    total: 0,
});

// 引用
const filterCardRef = ref(null);
const tableCardRef = ref(null);
const cardTableHeight = ref('auto');
const tableHeight = ref('auto');

const handleCurrentChange = (page) => {
    filterForm.pageIndex = page;
    queryUsers();
};

const queryUsers = async () => {
    try {
        loading.value = true;

        // 构建查询参数
        const queryParams = {
            pageIndex: filterForm.pageIndex,
            pageSize: filterForm.pageSize,
            ...filterForm
        };

        // 过滤空值
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
                delete queryParams[key];
            }
        });

        const response = await request.post("/api/user/query", queryParams);
        if (response.success) {
            filterForm.total = response.data.totalCount;
            tableData.value = response.data.dataInfo || [];
        }

        console.log("response", response);
        console.log("tableData", tableData.value);
    } catch (error) {
        console.error("查询用户失败:", error);
    } finally {
        loading.value = false;
    }
};

// 动态计算表格卡片高度
const updateCardTableHeight = () => {
    if (filterCardRef.value) {
        const windowHeight = window.innerHeight;
        const filterCardHeight = filterCardRef.value.$el.offsetHeight;
        const padding = 140; // 预留空间（顶部导航、底部间距等）

        cardTableHeight.value = `${windowHeight - filterCardHeight - padding}px`;
        tableHeight.value = `${windowHeight - filterCardHeight - padding - 140}px`;
    }
};

const resetForm = () => {
    filterForm.empCode = '';
    filterForm.empName = '';
    filterForm.orgName = '';
    filterForm.pageIndex = 1; // 重置到第一页
    queryUsers();
};

const dialogVisible = ref(false);

//编辑页面
const dataForm = reactive({
    empName: '',
    empCode: '',
    sex: 1,
    orgName: '',
    postName: '',
});

const rules = {
    empName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    empCode: [{ required: true, message: '请输入工号', trigger: 'blur' }],
    orgName: [{ required: true, message: '请选择组织', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    postName: [{ required: true, message: '请输入岗位', trigger: 'blur' }],
};

const addUser = () => {
    dialogVisible.value = true;
};


onMounted(() => {
    queryUsers();

    // 等待DOM渲染完成后计算高度
    nextTick(() => {
        updateCardTableHeight();

        // 监听窗口大小变化
        window.addEventListener('resize', updateCardTableHeight);

        // 使用ResizeObserver监听筛选卡片高度变化
        if (filterCardRef.value) {
            const resizeObserver = new ResizeObserver(() => {
                updateCardTableHeight();
            });
            resizeObserver.observe(filterCardRef.value.$el);

            // 组件卸载时清理观察器
            onUnmounted(() => {
                resizeObserver.disconnect();
                window.removeEventListener('resize', updateCardTableHeight);
            });
        }
    });
});
</script>

<style scoped></style>