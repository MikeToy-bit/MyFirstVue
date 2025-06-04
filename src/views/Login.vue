<template>
    <div class="login-container">
        <div class="login-box">
            <div class="left-content">
                <h1>欢迎回来</h1>
                <p>请登录您的账号以继续</p>
            </div>
            <div class="right-content">
                <el-card class="login-card">
                    <template #header>
                        <h2>用户登录</h2>
                    </template>
                    <el-form
                        ref="loginFormRef"
                        :model="loginForm"
                        :rules="rules"
                        @keyup.enter="handleLogin"
                    >
                        <el-form-item prop="username">
                            <el-input
                                v-model="loginForm.username"
                                placeholder="请输入用户名"
                                :prefix-icon="User"
                                clearable
                            />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                v-model="loginForm.password"
                                type="password"
                                placeholder="请输入密码"
                                :prefix-icon="Lock"
                                show-password
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                :loading="loading"
                                @click="handleLogin"
                                class="login-button"
                            >
                                登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { showPageLoading, hidePageLoading } from "../utils/common";

// 路由和状态管理
const router = useRouter();
const userStore = useUserStore();

// 响应式状态
const loginFormRef = ref(null);
const loading = ref(false);
const loginForm = reactive({
    username: "",
    password: "",
});

// 表单验证规则
const rules = {
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, message: "用户名长度不能小于3个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 3, message: "密码长度不能小于3个字符", trigger: "blur" },
    ],
};

// 方法
const handleLogin = async () => {
    if (!loginFormRef.value) return;

    try {
        await loginFormRef.value.validate();
        // 只使用按钮loading，不使用页面级loading（避免冲突）
        loading.value = true;

        const formData = {
            EmpCode: loginForm.username,
            PassWord: loginForm.password,
        };
        await userStore.login(formData);

        if (userStore.token) {
            console.log("登录成功，准备跳转到:", "main/dashboard");
            // 跳转时使用页面级loading，由路由守卫统一处理
            router.push("/main/dashboard");
        } else {
            ElMessage.error("登录失败，未获取到有效的令牌");
        }
    } catch (error) {
        console.error("登录错误", error);
        ElMessage.error(error.message || "登录失败，请检查用户名和密码");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-box {
    width: 80%;
    max-width: 1000px;
    height: 80%;
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.left-content {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
    max-width: 400px;
}

.left-content h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    font-weight: bold;
}

.left-content p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.right-content {
    flex: 1;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
}

.login-card {
    width: 100%;
    max-width: 400px;
    border: none;
    box-shadow: none;
}

.login-card :deep(.el-card__header) {
    border-bottom: none;
    padding: 30px 0 20px;
}

.login-card h2 {
    margin: 25px 0 0 0;
    font-size: 1.8rem;
    color: #333;
    text-align: center;
}

:deep(.el-input__wrapper) {
    height: 48px;
    padding: 0 15px;
    font-size: 16px;
    box-shadow: 0 0 0 1px #dcdfe6;
}

:deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #409eff;
}

:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #409eff;
}

:deep(.el-input__inner) {
    height: 48px;
    line-height: 48px;
}

:deep(.el-input__prefix-inner) {
    margin-right: 8px;
}

:deep(.el-input__prefix) {
    color: #909399;
}

.login-button {
    width: 100%;
    height: 48px;
    font-size: 16px;
    margin-top: 20px;
}

@media (max-width: 768px) {
    .login-box {
        flex-direction: column;
        height: auto;
        margin: 20px;
    }

    .left-content {
        padding: 20px;
        text-align: center;
    }

    .left-content h1 {
        font-size: 2rem;
    }

    .right-content {
        padding: 20px;
    }
}
</style>
