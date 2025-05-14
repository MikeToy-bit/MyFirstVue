<template>
    <div class="security">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>安全设置</span>
                </div>
            </template>
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input
                        v-model="form.oldPassword"
                        type="password"
                        placeholder="请输入旧密码"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input
                        v-model="form.newPassword"
                        type="password"
                        placeholder="请输入新密码"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input
                        v-model="form.confirmPassword"
                        type="password"
                        placeholder="请再次输入新密码"
                        show-password
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit"
                        >保存</el-button
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
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        const validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入新密码"));
            } else {
                if (form.confirmPassword !== "") {
                    formRef.value?.validateField("confirmPassword");
                }
                callback();
            }
        };

        const validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入新密码"));
            } else if (value !== form.newPassword) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };

        const rules = {
            oldPassword: [
                { required: true, message: "请输入旧密码", trigger: "blur" },
            ],
            newPassword: [
                { required: true, validator: validatePass, trigger: "blur" },
                { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
            ],
            confirmPassword: [
                { required: true, validator: validatePass2, trigger: "blur" },
            ],
        };

        const handleSubmit = async () => {
            if (!formRef.value) return;

            try {
                await formRef.value.validate();
                // 模拟提交
                ElMessage.success("密码修改成功");
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
.security {
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
