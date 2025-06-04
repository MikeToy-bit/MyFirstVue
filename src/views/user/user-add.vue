<template>
    <div class="user-form">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>{{ pageTitle }}</span>
                    <el-button type="info" icon="Back" @click="handleBack">
                        返回列表
                    </el-button>
                </div>
            </template>

            <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" :disabled="mode === 'view'"
                class="user-form-content">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="员工编号" prop="empCode">
                            <el-input v-model="form.empCode" placeholder="请输入员工编号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="员工姓名" prop="empName">
                            <el-input v-model="form.empName" placeholder="请输入员工姓名" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" v-if="mode === 'add'">
                    <el-col :span="12">
                        <el-form-item label="登录密码" prop="password">
                            <el-input v-model="form.password" type="password" placeholder="请输入登录密码" show-password
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" show-password
                                clearable />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="组织编码" prop="orgCode">
                            <el-input v-model="form.orgCode" placeholder="请输入组织编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织名称" prop="orgName">
                            <el-input v-model="form.orgName" placeholder="请输入组织名称" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="岗位编码" prop="postCode">
                            <el-input v-model="form.postCode" placeholder="请输入岗位编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="岗位名称" prop="postName">
                            <el-input v-model="form.postName" placeholder="请输入岗位名称" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="form.sex">
                                <el-radio :label="true">男</el-radio>
                                <el-radio :label="false">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件类型" prop="idType">
                            <el-select v-model="form.idType" placeholder="请选择证件类型" clearable style="width: 100%">
                                <el-option label="身份证" value="身份证" />
                                <el-option label="护照" value="护照" />
                                <el-option label="军官证" value="军官证" />
                                <el-option label="其他" value="其他" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="证件号码" prop="idCard">
                            <el-input v-model="form.idCard" placeholder="请输入证件号码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker v-model="form.birthday" type="date" placeholder="请选择出生日期"
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="电话号码" prop="phoneNumber">
                            <el-input v-model="form.phoneNumber" placeholder="请输入电话号码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间" v-if="mode !== 'add'">
                            <el-input :value="formatDateTime(form.createTime)" readonly style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item v-if="mode !== 'view'" class="form-buttons">
                    <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
                        {{ mode === "add" ? "新增" : "保存" }}
                    </el-button>
                    <el-button @click="handleReset"> 重置 </el-button>
                    <el-button @click="handleBack"> 取消 </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { Back } from "@element-plus/icons-vue";

// 导入API服务
import { createUser, updateUser, getUserDetail } from "@/api/user";

// 导入通用工具函数
import {
    showMessage,
    formatDate,
    showPageLoading,
    hidePageLoading,
} from "@/utils/common";

export default {
    name: "UserForm",
    components: {
        Back,
    },
    props: {
        // 页面模式：add-新增，edit-修改，view-查看
        mode: {
            type: String,
            default: "add",
            validator: (value) => ["add", "edit", "view"].includes(value),
        },
        // 编辑或查看时的用户编号
        empCode: {
            type: String,
            default: null,
        },
    },
    setup(props) {
        const formRef = ref(null);
        const submitLoading = ref(false);

        const form = reactive({
            empCode: "",
            empName: "",
            password: "",
            confirmPassword: "",
            orgCode: "",
            orgName: "",
            postCode: "",
            postName: "",
            sex: true,
            idType: "身份证",
            idCard: "",
            birthday: "",
            phoneNumber: "",
            createTime: "",
        });

        // 页面标题
        const pageTitle = computed(() => {
            switch (props.mode) {
                case "add":
                    return "新增用户";
                case "edit":
                    return "修改用户";
                case "view":
                    return "查看用户";
                default:
                    return "用户信息";
            }
        });

        // 格式化日期时间
        const formatDateTime = (dateTime) => {
            return formatDate(dateTime, "YYYY-MM-DD HH:mm:ss");
        };

        // 密码验证函数
        const validatePassword = (rule, value, callback) => {
            if (props.mode === "add" && !value) {
                callback(new Error("请输入登录密码"));
            } else if (value && value.length < 6) {
                callback(new Error("密码长度不能小于6位"));
            } else {
                if (form.confirmPassword !== "") {
                    formRef.value?.validateField("confirmPassword");
                }
                callback();
            }
        };

        // 确认密码验证函数
        const validateConfirmPassword = (rule, value, callback) => {
            if (props.mode === "add" && !value) {
                callback(new Error("请再次输入密码"));
            } else if (value && value !== form.password) {
                callback(new Error("两次输入密码不一致"));
            } else {
                callback();
            }
        };

        // 表单验证规则
        const rules = computed(() => {
            // 查看模式不需要验证
            if (props.mode === "view") return {};

            const baseRules = {
                empCode: [
                    {
                        required: true,
                        message: "请输入员工编号",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        message: "员工编号长度不能小于3位",
                        trigger: "blur",
                    },
                ],
                empName: [
                    {
                        required: true,
                        message: "请输入员工姓名",
                        trigger: "blur",
                    },
                    { min: 2, message: "姓名长度不能小于2位", trigger: "blur" },
                ],
                orgCode: [
                    {
                        required: true,
                        message: "请输入组织编码",
                        trigger: "blur",
                    },
                ],
                orgName: [
                    {
                        required: true,
                        message: "请输入组织名称",
                        trigger: "blur",
                    },
                ],
                postCode: [
                    {
                        required: true,
                        message: "请输入岗位编码",
                        trigger: "blur",
                    },
                ],
                postName: [
                    {
                        required: true,
                        message: "请输入岗位名称",
                        trigger: "blur",
                    },
                ],
                sex: [
                    {
                        required: true,
                        message: "请选择性别",
                        trigger: "change",
                    },
                ],
                idType: [
                    {
                        required: true,
                        message: "请选择证件类型",
                        trigger: "change",
                    },
                ],
                idCard: [
                    {
                        required: true,
                        message: "请输入证件号码",
                        trigger: "blur",
                    },
                    {
                        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                        message: "请输入正确的身份证号",
                        trigger: "blur",
                    },
                ],
                phoneNumber: [
                    {
                        required: true,
                        message: "请输入电话号码",
                        trigger: "blur",
                    },
                    {
                        pattern: /^1[3-9]\d{9}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur",
                    },
                ],
            };

            // 新增模式需要密码验证
            if (props.mode === "add") {
                baseRules.password = [
                    { validator: validatePassword, trigger: "blur" },
                ];
                baseRules.confirmPassword = [
                    { validator: validateConfirmPassword, trigger: "blur" },
                ];
            }

            return baseRules;
        });

        // 加载用户数据（编辑或查看模式）
        const loadUserData = async () => {
            if (props.mode !== "add" && props.empCode) {
                try {
                    showPageLoading();
                    const response = await getUserDetail(props.empCode);
                    hidePageLoading();

                    if (response.success && response.data) {
                        Object.assign(form, response.data);
                        // 编辑模式不显示密码字段
                        form.password = "";
                        form.confirmPassword = "";
                    } else {
                        showMessage(
                            response.message || "获取用户信息失败",
                            "error"
                        );
                    }
                } catch (error) {
                    hidePageLoading(false);
                    console.error("加载用户数据失败:", error);
                    showMessage("获取用户信息失败，请稍后重试", "error");
                }
            }
        };

        // 提交表单
        const handleSubmit = async () => {
            if (!formRef.value) return;

            try {
                await formRef.value.validate();
                submitLoading.value = true;

                const submitData = { ...form };
                // 删除确认密码字段，不提交到后端
                delete submitData.confirmPassword;

                let response;
                if (props.mode === "add") {
                    response = await createUser(submitData);
                } else {
                    response = await updateUser(submitData);
                }

                if (response.success) {
                    const action = props.mode === "add" ? "新增" : "修改";
                    showMessage(`${action}用户成功`, "success");

                    // 重置表单或返回列表
                    if (props.mode === "add") {
                        handleReset();
                    } else {
                        handleBack();
                    }
                } else {
                    showMessage(response.message || "操作失败", "error");
                }
            } catch (error) {
                console.error("提交表单失败:", error);
                showMessage("操作失败，请稍后重试", "error");
            } finally {
                submitLoading.value = false;
            }
        };

        // 重置表单
        const handleReset = () => {
            if (formRef.value) {
                formRef.value.resetFields();
            }

            // 重新加载数据（编辑模式）
            if (props.mode === "edit") {
                loadUserData();
            } else {
                // 新增模式重置为默认值
                Object.assign(form, {
                    empCode: "",
                    empName: "",
                    password: "",
                    confirmPassword: "",
                    orgCode: "",
                    orgName: "",
                    postCode: "",
                    postName: "",
                    sex: true,
                    idType: "身份证",
                    idCard: "",
                    birthday: "",
                    phoneNumber: "",
                    createTime: "",
                });
            }
        };

        // 返回列表
        const handleBack = () => {
            // this.$router.go(-1) 或 this.$router.push('/user/list')
            showMessage("返回用户列表", "info");
        };

        // 组件挂载时加载数据
        onMounted(() => {
            loadUserData();
        });

        return {
            formRef,
            submitLoading,
            form,
            pageTitle,
            rules,
            formatDateTime,
            handleSubmit,
            handleReset,
            handleBack,
        };
    },
};
</script>

<style scoped>
.user-form {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-form-content {
    max-width: 1000px;
    margin: 0 auto;
}

.form-buttons {
    text-align: center;
    margin-top: 30px;
}

.form-buttons .el-button {
    margin: 0 10px;
    min-width: 100px;
}

:deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
    padding: 30px;
}

:deep(.el-form-item__label) {
    font-weight: 600;
    color: #303133;
}

:deep(.el-input.is-disabled .el-input__inner) {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #606266;
    cursor: not-allowed;
}

:deep(.el-select.is-disabled .el-input.is-disabled .el-input__inner) {
    background-color: #f5f7fa;
}

:deep(.el-radio.is-disabled .el-radio__input) {
    cursor: not-allowed;
}

:deep(.el-radio.is-disabled .el-radio__label) {
    color: #c0c4cc;
    cursor: not-allowed;
}

:deep(.el-textarea.is-disabled .el-textarea__inner) {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #606266;
    cursor: not-allowed;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .user-form-content {
        max-width: 100%;
    }

    :deep(.el-col-12) {
        width: 100%;
    }

    .card-header {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }
}
</style>
