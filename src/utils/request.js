import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";
import { useUserStore } from "../stores/user";
import { showGlobalLoading, hideGlobalLoading } from "./common";

// 创建 axios 实例
const request = axios.create({
    baseURL: "",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 存储 token 的键名
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// 获取 token
const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// 设置 token
const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // 同步更新store中的token
    try {
        const userStore = useUserStore();
        userStore.setToken(accessToken);
    } catch (error) {
        console.error("更新store中的token失败", error);
    }
};

// 清除 token
const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// 检查 token 是否即将过期（提前1分钟）
const isTokenExpiring = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000; // 转换为毫秒
        return exp - Date.now() < 60000; // 小于1分钟
    } catch (e) {
        return true;
    }
};

// 检查token是否已过期
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000; // 转换为毫秒
        return Date.now() >= exp;
    } catch (e) {
        return true;
    }
};

// 刷新 token 的请求
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const onRrefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

const refreshToken = async () => {
    if (isRefreshing) {
        return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
                resolve(token);
            });
        });
    }

    isRefreshing = true;
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            throw new Error("没有可用的刷新令牌");
        }

        // 使用原生axios避免循环调用，使用相对路径
        const response = await axios.post(`/api/auth/refresh`, {
            refreshToken,
        });

        if (response.data.statusCode === 200) {
            const { accessToken, refreshToken: newRefreshToken } =
                response.data.data;
            setTokens(accessToken, newRefreshToken);
            onRrefreshed(accessToken);
            return accessToken;
        } else {
            throw new Error(response.data.message || "刷新令牌失败");
        }
    } catch (error) {
        console.error("刷新令牌失败", error);
        clearTokens();
        const userStore = useUserStore();
        userStore.logout();
        ElMessage.error("登录已过期，请重新登录");
        router.push("/");
        throw error;
    } finally {
        isRefreshing = false;
    }
};

// 请求拦截器
request.interceptors.request.use(
    async (config) => {
        // 是否显示loading (可以通过配置控制)
        const showLoading = config.showLoading !== false;

        if (showLoading) {
            // 使用全局loading
            showGlobalLoading();
        }

        // 添加时间戳防止缓存 (GET请求)
        if (config.method === "get") {
            const timestamp = new Date().getTime();
            config.params = {
                ...config.params,
                _t: timestamp,
            };
        }

        // 跳过刷新token请求的token验证
        if (config.url.includes("/auth/refresh")) {
            return config;
        }

        const accessToken = getAccessToken();
        if (accessToken) {
            // 如果token已过期，则直接跳转登录页
            if (isTokenExpired(accessToken)) {
                clearTokens();
                const userStore = useUserStore();
                userStore.logout();
                ElMessage.error("登录已过期，请重新登录");
                router.push("/");
                // 确保loading被关闭
                hideGlobalLoading();
                return Promise.reject(new Error("登录已过期"));
            }

            // 如果token即将过期，尝试刷新
            if (isTokenExpiring(accessToken)) {
                try {
                    const newToken = await refreshToken();
                    config.headers.Authorization = `Bearer ${newToken}`;
                } catch (error) {
                    // 确保loading被关闭
                    hideGlobalLoading();
                    return Promise.reject(error);
                }
            } else {
                // token有效，添加到请求头
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        // 请求错误时关闭loading
        hideGlobalLoading();
        console.error("请求错误:", error);
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 响应成功时关闭loading
        hideGlobalLoading();

        // 检查业务状态码
        if (response.data && response.data.statusCode !== undefined) {
            if (response.data.statusCode === 200) {
                return response;
            } else {
                // 处理业务错误
                const errMsg = response.data.message || "请求失败";
                console.warn("业务状态码错误:", response.data);
                ElMessage.error(errMsg);
                return Promise.reject(new Error(errMsg));
            }
        }
        return response;
    },
    async (error) => {
        // 响应失败时关闭loading
        hideGlobalLoading();

        if (error.response) {
            const { status } = error.response;

            // 处理401未授权错误
            if (status === 401 && !error.config._retry) {
                error.config._retry = true; // 标记该请求已尝试过刷新token

                try {
                    // 尝试刷新token
                    const newToken = await refreshToken();
                    // 使用新token重试请求
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return request(error.config);
                } catch (refreshError) {
                    // 刷新token失败，重定向到登录页
                    return Promise.reject(refreshError);
                }
            }

            // 处理其他错误状态码
            switch (status) {
                case 403:
                    ElMessage.error("没有操作权限");
                    break;
                case 404:
                    ElMessage.error("请求的资源不存在");
                    break;
                case 500:
                    ElMessage.error("服务器内部错误");
                    break;
                default:
                    ElMessage.error(error.response.data?.message || "请求失败");
            }
        } else if (error.request) {
            ElMessage.error("网络错误，服务器未响应");
        } else {
            ElMessage.error("请求配置错误");
        }

        return Promise.reject(error);
    }
);

export default request;
