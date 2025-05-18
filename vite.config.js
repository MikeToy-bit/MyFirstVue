import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            // 代理所有以 /api 开头的请求
            "/api": {
                target: "http://localhost:7259", // 开发环境后端地址
                changeOrigin: true,
                // 不重写路径，保留 /api 前缀
                // rewrite: (path) => path.replace(/^\/api/, ""),
                secure: false, // 如果是 https 接口，需要配置为 true
            },
            // 认证相关的请求
            "/T_SYS_Auth": {
                target: "http://localhost:7259", // 开发环境后端地址
                changeOrigin: true,
                secure: false,
            },
        },
        fs: {
            strict: false, // 关闭文件系统的严格模式，不区分大小写
        },
    },
});
