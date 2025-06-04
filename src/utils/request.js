/**
 * @file HTTP请求工具
 * @description 基于axios封装的HTTP请求工具，支持JWT双token认证机制
 */

import axios from "axios";
import router from "../router";
import { useUserStore } from "../stores/user";
import { showMessage, showPageLoading, hidePageLoading } from "./common";

// 创建 axios 实例
const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_API || "",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
});

// 存储 token 的键名
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Token 管理
const TokenManager = {
    // 获取 access token
    getAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    // 获取 refresh token
    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    // 设置 tokens
    setTokens(accessToken, refreshToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }

        // 同步更新store中的token
        try {
            const userStore = useUserStore();
            userStore.setToken(accessToken);
        } catch (error) {
            console.error("更新store中的token失败", error);
        }
    },

    // 清除 tokens
    clearTokens() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        // 清除store中的用户信息
        try {
            const userStore = useUserStore();
            userStore.logout();
        } catch (error) {
            console.error("清除store用户信息失败", error);
        }
    },

    // 检查 token 是否即将过期（提前2分钟）
    isTokenExpiring(token) {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const exp = payload.exp * 1000; // 转换为毫秒
            return exp - Date.now() < 120000; // 小于2分钟
        } catch (e) {
            console.warn("解析token失败:", e);
            return true;
        }
    },

    // 检查token是否已过期
    isTokenExpired(token) {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const exp = payload.exp * 1000; // 转换为毫秒
            return Date.now() >= exp;
        } catch (e) {
            console.warn("解析token失败:", e);
            return true;
        }
    },
};

// 刷新 token 相关变量
let isRefreshing = false;
let refreshSubscribers = [];

// 添加刷新token的订阅者
const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

// 通知所有订阅者token已刷新
const onTokenRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

// 刷新 token
const refreshToken = async () => {
    // 如果正在刷新，返回一个Promise等待刷新完成
    if (isRefreshing) {
        return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
                resolve(token);
            });
        });
    }

    isRefreshing = true;
    try {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error("没有可用的刷新令牌");
        }

        console.log("正在刷新token...");

        // 根据API文档，直接发送refresh token字符串
        // 使用相对路径，Vite代理会处理
        const response = await axios.post("/api/auth/refresh", refreshToken, {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        if (response.data.statusCode === 200) {
            const { accessToken, refreshToken: newRefreshToken } =
                response.data.data;
            TokenManager.setTokens(accessToken, newRefreshToken);
            onTokenRefreshed(accessToken);
            console.log("Token刷新成功");
            return accessToken;
        } else {
            throw new Error(response.data.message || "刷新令牌失败");
        }
    } catch (error) {
        console.error("刷新令牌失败:", error);

        // 刷新失败，清除所有token并跳转登录页
        TokenManager.clearTokens();
        showMessage("登录已过期，请重新登录", "error");

        // 避免在登录页面重复跳转
        if (
            router.currentRoute.value.path !== "/login" &&
            router.currentRoute.value.path !== "/"
        ) {
            router.push("/login");
        }

        throw error;
    } finally {
        isRefreshing = false;
    }
};

// 登出API调用
const logout = async () => {
    try {
        const accessToken = TokenManager.getAccessToken();
        if (accessToken) {
            // 使用相对路径，Vite代理会处理
            await axios.post(
                "/api/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                }
            );
        }
    } catch (error) {
        console.warn("调用登出API失败:", error);
    } finally {
        // 无论API调用是否成功，都清除本地token
        TokenManager.clearTokens();
    }
};

// 处理认证失败的情况
const handleAuthFailure = (message = "认证失败，请重新登录") => {
    TokenManager.clearTokens();
    showMessage(message, "error");

    if (
        router.currentRoute.value.path !== "/login" &&
        router.currentRoute.value.path !== "/"
    ) {
        router.push("/login");
    }
};

// 请求拦截器
request.interceptors.request.use(
    async (config) => {
        // 控制是否显示loading
        const showLoading = config.showLoading !== false;
        if (showLoading) {
            showPageLoading();
        }

        // GET请求添加时间戳防止缓存
        if (config.method === "get") {
            const timestamp = new Date().getTime();
            config.params = {
                ...config.params,
                _t: timestamp,
            };
        }

        // 跳过认证相关的请求
        const skipAuthUrls = ["/auth/login", "/auth/refresh", "/auth/validate"];
        const isAuthUrl = skipAuthUrls.some((url) => config.url.includes(url));

        if (isAuthUrl) {
            return config;
        }

        // 处理需要认证的请求
        const accessToken = TokenManager.getAccessToken();

        if (!accessToken) {
            // 没有token，跳转登录页
            hidePageLoading();
            handleAuthFailure("请先登录");
            return Promise.reject(new Error("未登录"));
        }

        // 检查token是否已过期
        if (TokenManager.isTokenExpired(accessToken)) {
            hidePageLoading();
            handleAuthFailure("登录已过期，请重新登录");
            return Promise.reject(new Error("登录已过期"));
        }

        // 检查token是否即将过期，提前刷新
        if (TokenManager.isTokenExpiring(accessToken)) {
            try {
                const newToken = await refreshToken();
                config.headers.Authorization = `Bearer ${newToken}`;
            } catch (error) {
                hidePageLoading();
                return Promise.reject(error);
            }
        } else {
            // token有效，直接使用
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        hidePageLoading();
        console.error("请求拦截器错误:", error);
        showMessage("请求配置错误", "error");
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        hidePageLoading();

        // 检查业务状态码
        const { data } = response;
        if (data && typeof data.statusCode !== "undefined") {
            if (data.statusCode === 200) {
                return response;
            } else {
                // 处理业务错误
                const errMsg = data.message || "请求失败";
                console.warn("业务状态码错误:", data);
                showMessage(errMsg, "error");
                return Promise.reject(new Error(errMsg));
            }
        }

        return response;
    },
    async (error) => {
        hidePageLoading();

        if (error.response) {
            const { status, data } = error.response;
            let message = "请求失败";

            switch (status) {
                case 401:
                    // 未授权，尝试刷新token
                    if (!error.config._retry) {
                        error.config._retry = true;

                        try {
                            const newToken = await refreshToken();
                            error.config.headers.Authorization = `Bearer ${newToken}`;
                            return request(error.config);
                        } catch (refreshError) {
                            // 刷新失败，已在refreshToken函数中处理
                            return Promise.reject(refreshError);
                        }
                    } else {
                        // 重试后仍然401，认证彻底失败
                        handleAuthFailure("认证失败，请重新登录");
                        message = "认证失败，请重新登录";
                    }
                    break;

                case 403:
                    message = "没有操作权限";
                    break;

                case 404:
                    message = "请求的资源不存在";
                    break;

                case 500:
                    message = "服务器内部错误";
                    break;

                default:
                    message = data?.message || `请求失败 (${status})`;
            }

            if (status !== 401 || error.config._retry) {
                showMessage(message, "error");
            }
        } else if (error.code === "ECONNABORTED") {
            showMessage("请求超时，请稍后重试", "error");
        } else if (error.message === "Network Error") {
            showMessage("网络连接失败，请检查网络", "error");
        } else {
            showMessage(error.message || "网络错误", "error");
        }

        return Promise.reject(error);
    }
);

// 导出token管理器和登出函数，供其他模块使用
export { TokenManager, logout };

export default request;
