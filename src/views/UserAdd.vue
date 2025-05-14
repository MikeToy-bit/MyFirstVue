<template>
    <div class="user-add">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>添加用户</span>
                </div>
            </template>
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="100px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input
                        v-model="form.username"
                        placeholder="请输入用户名"
                    />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="form.password"
                        type="password"
                        placeholder="请输入密码"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input
                        v-model="form.confirmPassword"
                        type="password"
                        placeholder="请再次输入密码"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input
                        v-model="form.nickname"
                        placeholder="请输入昵称"
                    />
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="form.role" placeholder="请选择角色">
                        <el-option label="管理员" value="admin" />
                        <el-option label="普通用户" value="user" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit"
                        >提交</el-button
                    >
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

export default {
    setup() {
        const formRef = ref(null);
        const form = reactive({
            username: "",
            password: "",
            confirmPassword: "",
            nickname: "",
            role: "",
        });

        const validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (form.confirmPassword !== "") {
                    formRef.value?.validateField("confirmPassword");
                }
                callback();
            }
        };

        const validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== form.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };

        const rules = {
            username: [
                { required: true, message: "请输入用户名", trigger: "blur" },
                { min: 3, message: "用户名长度不能小于3位", trigger: "blur" },
            ],
            password: [
                { required: true, validator: validatePass, trigger: "blur" },
                { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
            ],
            confirmPassword: [
                { required: true, validator: validatePass2, trigger: "blur" },
            ],
            nickname: [
                { required: true, message: "请输入昵称", trigger: "blur" },
            ],
            role: [
                { required: true, message: "请选择角色", trigger: "change" },
            ],
        };

        const handleSubmit = async () => {
            if (!formRef.value) return;

            try {
                await formRef.value.validate();
                // 模拟提交
                ElMessage.success("添加用户成功");
                // 重置表单
                handleReset();
            } catch (error) {
                console.error("表单验证失败:", error);
            }
        };

        const handleReset = () => {
            if (formRef.value) {
                formRef.value.resetFields();
            }
        };

        return {
            formRef,
            form,
            rules,
            handleSubmit,
            handleReset,
        };
    },
};
</script>

<style scoped>
.user-add {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

:deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
    padding: 20px;
}

:deep(.el-form) {
    max-width: 500px;
    margin: 0 auto;
}
</style>
