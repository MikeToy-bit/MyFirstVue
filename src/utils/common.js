/**
 * @file 全局通用工具函数库
 * @description 包含日期时间处理、加载状态和通知功能等常用工具方法
 */

import {
    ElLoading,
    ElMessage,
    ElMessageBox,
    ElNotification,
} from "element-plus";
import { nextTick } from "vue";

// ------------ 日期时间处理 ------------

/**
 * 格式化日期时间
 * @param {Date|string|number} date 要格式化的日期
 * @param {string} format 格式字符串，如 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d.getTime())) return ""; // 无效日期返回空字符串

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();
    const second = d.getSeconds();

    const padZero = (num) => String(num).padStart(2, "0");

    return format
        .replace(/YYYY/g, year)
        .replace(/YY/g, String(year).slice(2))
        .replace(/MM/g, padZero(month))
        .replace(/M/g, month)
        .replace(/DD/g, padZero(day))
        .replace(/D/g, day)
        .replace(/HH/g, padZero(hour))
        .replace(/H/g, hour)
        .replace(/hh/g, padZero(hour % 12 || 12))
        .replace(/h/g, hour % 12 || 12)
        .replace(/mm/g, padZero(minute))
        .replace(/m/g, minute)
        .replace(/ss/g, padZero(second))
        .replace(/s/g, second);
};

/**
 * 获取当前时间
 * @param {string} format 格式字符串
 * @returns {string} 当前时间的字符串表示
 */
export const getNow = (format = "YYYY-MM-DD HH:mm:ss") => {
    return formatDate(new Date(), format);
};

/**
 * 获取指定时间段前/后的日期
 * @param {number} value 时间值（正数表示将来，负数表示过去）
 * @param {string} unit 单位：'year'|'month'|'day'|'hour'|'minute'|'second'
 * @param {Date|string|number} baseDate 基准日期，默认为当前时间
 * @param {string} format 格式字符串
 * @returns {string} 计算后的日期字符串
 */
export const getRelativeDate = (
    value,
    unit = "day",
    baseDate,
    format = "YYYY-MM-DD"
) => {
    const date = baseDate ? new Date(baseDate) : new Date();

    switch (unit) {
        case "year":
            date.setFullYear(date.getFullYear() + value);
            break;
        case "month":
            date.setMonth(date.getMonth() + value);
            break;
        case "day":
            date.setDate(date.getDate() + value);
            break;
        case "hour":
            date.setHours(date.getHours() + value);
            break;
        case "minute":
            date.setMinutes(date.getMinutes() + value);
            break;
        case "second":
            date.setSeconds(date.getSeconds() + value);
            break;
        default:
    }

    return formatDate(date, format);
};

/**
 * 计算两个日期之间的差值
 * @param {Date|string|number} date1 日期1
 * @param {Date|string|number} date2 日期2，默认为当前时间
 * @param {string} unit 返回差值的单位：'millisecond'|'second'|'minute'|'hour'|'day'|'month'|'year'
 * @returns {number} 计算出的差值
 */
export const dateDiff = (date1, date2 = new Date(), unit = "day") => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffMs = d2.getTime() - d1.getTime();

    switch (unit) {
        case "millisecond":
            return diffMs;
        case "second":
            return Math.floor(diffMs / 1000);
        case "minute":
            return Math.floor(diffMs / (1000 * 60));
        case "hour":
            return Math.floor(diffMs / (1000 * 60 * 60));
        case "day":
            return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        case "month": {
            const months =
                (d2.getFullYear() - d1.getFullYear()) * 12 +
                (d2.getMonth() - d1.getMonth());
            return months;
        }
        case "year":
            return d2.getFullYear() - d1.getFullYear();
        default:
            console.warn(`不支持的时间单位: ${unit}`);
            return diffMs;
    }
};

/**
 * 格式化时间差，如"3分钟前"、"2小时后"等
 * @param {Date|string|number} date 要比较的日期
 * @param {Date|string|number} baseDate 基准日期，默认为当前时间
 * @returns {string} 格式化后的时间差
 */
export const formatTimeAgo = (date, baseDate = new Date()) => {
    const d1 = new Date(date);
    const d2 = new Date(baseDate);

    const diffMs = d2.getTime() - d1.getTime();
    const isFuture = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);

    const suffix = isFuture ? "后" : "前";

    if (absDiffMs < 1000) {
        return "刚刚";
    }

    if (absDiffMs < 1000 * 60) {
        return `${Math.floor(absDiffMs / 1000)}秒${suffix}`;
    }

    if (absDiffMs < 1000 * 60 * 60) {
        return `${Math.floor(absDiffMs / (1000 * 60))}分钟${suffix}`;
    }

    if (absDiffMs < 1000 * 60 * 60 * 24) {
        return `${Math.floor(absDiffMs / (1000 * 60 * 60))}小时${suffix}`;
    }

    if (absDiffMs < 1000 * 60 * 60 * 24 * 30) {
        return `${Math.floor(absDiffMs / (1000 * 60 * 60 * 24))}天${suffix}`;
    }

    if (absDiffMs < 1000 * 60 * 60 * 24 * 365) {
        return `${Math.floor(
            absDiffMs / (1000 * 60 * 60 * 24 * 30)
        )}个月${suffix}`;
    }

    return `${Math.floor(absDiffMs / (1000 * 60 * 60 * 24 * 365))}年${suffix}`;
};

// =============== LoadingBar 管理 ===============

class LoadingBar {
    constructor() {
        this.isLoading = false;
        this.timer = null;
        this.progress = 0;
        this.element = null;
        this.hideTimer = null; // 添加隐藏定时器
        this.init();
    }

    init() {
        // 创建loading bar元素
        this.element = document.createElement("div");
        this.element.className = "el-loading-bar";
        this.element.innerHTML = `
            <div class="el-loading-bar-inner"></div>
        `;

        // 添加样式
        if (!document.getElementById("loading-bar-style")) {
            const style = document.createElement("style");
            style.id = "loading-bar-style";
            style.textContent = `
                .el-loading-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    z-index: 9999;
                    transition: opacity 0.2s ease;
                    opacity: 0;
                    background: rgba(0, 0, 0, 0.1);
                }
                
                .el-loading-bar.loading {
                    opacity: 1;
                }
                
                .el-loading-bar-inner {
                    height: 100%;
                    background: linear-gradient(90deg, #409EFF, #67C23A);
                    border-radius: 0 3px 3px 0;
                    transition: width 0.2s ease;
                    width: 0%;
                    box-shadow: 0 0 10px rgba(64, 158, 255, 0.6);
                }
                
                .el-loading-bar.error .el-loading-bar-inner {
                    background: linear-gradient(90deg, #F56C6C, #E6A23C);
                }
                
                .el-loading-bar.success .el-loading-bar-inner {
                    background: linear-gradient(90deg, #67C23A, #95D475);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(this.element);
    }

    start() {
        if (this.isLoading) return;

        // 清除任何正在进行的隐藏操作
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }

        this.isLoading = true;
        this.progress = 0;
        this.element.className = "el-loading-bar loading";
        this.element.classList.remove("success", "error");

        // 确保立即显示
        this.element.style.opacity = "1";

        // 立即设置一个小的初始进度，让用户能立即看到loading条
        setTimeout(() => {
            this.setProgress(10);
        }, 10);

        // 模拟进度，速度稍慢一些确保用户能看到
        this.timer = setInterval(() => {
            if (this.progress < 85) {
                // 改为85%，留更多空间给finish()
                this.progress += Math.random() * 8 + 2; // 每次增加2-10%
                this.setProgress(this.progress);
            }
        }, 300); // 增加间隔时间到300ms
    }

    setProgress(progress) {
        if (!this.element) return;
        const inner = this.element.querySelector(".el-loading-bar-inner");
        if (inner) {
            inner.style.width = Math.min(progress, 100) + "%";
        }
    }

    finish() {
        if (!this.isLoading) {
            return;
        }

        this.isLoading = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.setProgress(100);
        this.element.classList.add("success");

        // 延迟隐藏
        this.hideTimer = setTimeout(() => {
            this.element.style.opacity = "0";
            setTimeout(() => {
                this.element.className = "el-loading-bar";
                this.element.classList.remove("success", "error");
                this.progress = 0;
                this.setProgress(0);
                this.hideTimer = null;
            }, 200);
        }, 300);
    }

    error() {
        if (!this.isLoading) return;

        this.isLoading = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.setProgress(100);
        this.element.classList.add("error");

        // 延迟隐藏
        this.hideTimer = setTimeout(() => {
            this.element.style.opacity = "0";
            setTimeout(() => {
                this.element.className = "el-loading-bar";
                this.element.classList.remove("success", "error");
                this.progress = 0;
                this.setProgress(0);
                this.hideTimer = null;
            }, 200);
        }, 300);
    }

    // 强制隐藏（用于紧急情况）
    forceHide() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }

        this.isLoading = false;
        this.element.style.opacity = "0";
        this.element.className = "el-loading-bar";
        this.element.classList.remove("success", "error", "loading");
        this.progress = 0;
        this.setProgress(0);
    }
}

// 创建全局LoadingBar实例
const loadingBar = new LoadingBar();

// =============== Loading 管理器 ===============

class LoadingManager {
    constructor() {
        this.loadingInstances = new Map();
        this.globalLoadingInstance = null;
        this.pageLoadingActive = false; // 跟踪页面级loading状态
    }

    /**
     * 显示页面级加载条（用于登录、路由跳转等）
     */
    showPageLoading() {
        // 如果全局loading正在运行，先关闭它
        if (this.globalLoadingInstance) {
            this.globalLoadingInstance.close();
            this.globalLoadingInstance = null;
        }

        this.pageLoadingActive = true;
        loadingBar.start();
    }

    /**
     * 隐藏页面级加载条
     * @param {boolean} success 是否成功完成
     */
    hidePageLoading(success = true) {
        if (!this.pageLoadingActive) {
            return;
        }

        this.pageLoadingActive = false;
        if (success) {
            loadingBar.finish();
        } else {
            loadingBar.error();
        }
    }

    /**
     * 显示全局遮罩加载（用于重要操作）
     * @param {string} text 加载提示文本
     * @param {object} options 加载配置项
     */
    showGlobalLoading(text = "加载中...", options = {}) {
        // 如果页面级loading正在运行，不显示全局loading（避免冲突）
        if (this.pageLoadingActive) {
            return null;
        }

        if (this.globalLoadingInstance) {
            this.globalLoadingInstance.close();
        }

        this.globalLoadingInstance = ElLoading.service({
            lock: true,
            text,
            background: "rgba(0, 0, 0, 0.7)",
            ...options,
        });

        return this.globalLoadingInstance;
    }

    /**
     * 隐藏全局遮罩加载
     */
    hideGlobalLoading() {
        if (this.globalLoadingInstance) {
            this.globalLoadingInstance.close();
            this.globalLoadingInstance = null;
        }
    }

    /**
     * 显示局部加载（用于表格、表单等）
     * @param {string|Element} target 目标元素或选择器
     * @param {string} key 唯一标识
     * @param {string} text 加载文本
     * @param {object} options 配置选项
     */
    showLocalLoading(
        target,
        key = "default",
        text = "加载中...",
        options = {}
    ) {
        // 关闭已存在的同key实例
        if (this.loadingInstances.has(key)) {
            this.loadingInstances.get(key).close();
            this.loadingInstances.delete(key);
        }

        const instance = ElLoading.service({
            target,
            text,
            background: "rgba(255, 255, 255, 0.8)",
            ...options,
        });

        this.loadingInstances.set(key, instance);
        return instance;
    }

    /**
     * 隐藏局部加载
     * @param {string} key 唯一标识
     */
    hideLocalLoading(key = "default") {
        if (this.loadingInstances.has(key)) {
            this.loadingInstances.get(key).close();
            this.loadingInstances.delete(key);
        }
    }

    /**
     * 隐藏所有加载状态
     */
    hideAllLoading() {
        // 强制隐藏页面级加载条
        this.pageLoadingActive = false;
        loadingBar.forceHide();

        // 隐藏全局加载
        this.hideGlobalLoading();

        // 隐藏所有局部加载
        this.loadingInstances.forEach((instance) => {
            instance.close();
        });
        this.loadingInstances.clear();
    }

    /**
     * 获取当前loading状态
     */
    getLoadingStatus() {
        return {
            pageLoading: this.pageLoadingActive,
            globalLoading: !!this.globalLoadingInstance,
            localLoadingCount: this.loadingInstances.size,
        };
    }
}

// 创建全局管理器实例
const loadingManager = new LoadingManager();

// ------------ Loading管理（新版本） ------------

/**
 * 显示页面级加载条（用于登录、路由跳转等）
 */
export const showPageLoading = () => loadingManager.showPageLoading();

/**
 * 隐藏页面级加载条
 * @param {boolean} success 是否成功完成
 */
export const hidePageLoading = (success = true) =>
    loadingManager.hidePageLoading(success);

/**
 * 显示全局遮罩加载（用于重要操作）
 * @param {string} text 加载提示文本
 * @param {object} options 加载配置项
 * @returns {object} loading实例
 */
export const showGlobalLoading = (text = "加载中...", options = {}) => {
    return loadingManager.showGlobalLoading(text, options);
};

/**
 * 关闭全局加载状态
 */
export const hideGlobalLoading = () => {
    loadingManager.hideGlobalLoading();
};

/**
 * 显示局部加载（用于表格、表单等）
 * @param {string|Element} target 目标元素或选择器
 * @param {string} key 唯一标识
 * @param {string} text 加载文本
 * @param {object} options 配置选项
 */
export const showLocalLoading = (
    target,
    key = "default",
    text = "加载中...",
    options = {}
) => {
    return loadingManager.showLocalLoading(target, key, text, options);
};

/**
 * 隐藏局部加载
 * @param {string} key 唯一标识
 */
export const hideLocalLoading = (key = "default") => {
    loadingManager.hideLocalLoading(key);
};

/**
 * 隐藏所有加载状态
 */
export const hideAllLoading = () => {
    loadingManager.hideAllLoading();
};

// ------------ 兼容旧版本的Loading接口 ------------

/**
 * 显示全屏加载状态 (兼容旧API)
 * @param {string} key 唯一标识，用于关闭对应的loading
 * @param {string} text 加载提示文本
 * @param {object} options ElLoading的配置选项
 * @returns {object} loading实例
 */
export const showLoading = (
    key = "global",
    text = "正在加载中，请稍等...",
    options = {}
) => {
    if (key === "global") {
        return showGlobalLoading(text, options);
    } else {
        return showLocalLoading(document.body, key, text, options);
    }
};

/**
 * 关闭加载状态 (兼容旧API)
 * @param {string} key 唯一标识
 */
export const hideLoading = (key = "global") => {
    if (key === "global") {
        hideGlobalLoading();
    } else {
        hideLocalLoading(key);
    }
};

// ------------ 消息通知 ------------

/**
 * 显示消息提示
 * @param {string} message 消息内容
 * @param {string} type 消息类型：'success'|'warning'|'info'|'error'
 * @param {object} options 配置选项
 */
export const showMessage = (message, type = "info", options = {}) => {
    return ElMessage({
        message,
        type,
        duration: 3000,
        showClose: true,
        ...options,
    });
};

/**
 * 显示通知
 * @param {string} title 标题
 * @param {string} message 消息内容
 * @param {string} type 类型：'success'|'warning'|'info'|'error'
 * @param {object} options 配置选项
 */
export const showNotification = (
    title,
    message,
    type = "info",
    options = {}
) => {
    return ElNotification({
        title,
        message,
        type,
        duration: 4500,
        position: "top-right",
        ...options,
    });
};

/**
 * 显示确认框
 * @param {string} message 消息内容
 * @param {string} title 标题
 * @param {object} options 配置选项
 * @returns {Promise} 确认结果
 */
export const showConfirm = (message, title = "提示", options = {}) => {
    return ElMessageBox.confirm(message, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        ...options,
    });
};

// ------------ 其他工具 ------------

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间(毫秒)
 * @returns {Function} 防抖处理后的函数
 */
export const debounce = (fn, delay = 300) => {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} interval 间隔时间(毫秒)
 * @returns {Function} 节流处理后的函数
 */
export const throttle = (fn, interval = 300) => {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= interval) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
};

/**
 * 是否为空值（null、undefined、空字符串、空数组、空对象）
 * @param {any} value 要检查的值
 * @returns {boolean} 是否为空
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0)
        return true;
    return false;
};

// ------------ 调试和紧急修复工具 ------------

/**
 * 获取当前所有loading状态（调试用）
 */
export const getLoadingStatus = () => {
    return loadingManager.getLoadingStatus();
};

/**
 * 紧急修复loading问题（强制清除所有loading）
 */
export const emergencyFixLoading = () => {
    loadingManager.hideAllLoading();

    // 额外清理可能残留的Element Plus loading
    const loadingElements = document.querySelectorAll(".el-loading-mask");
    loadingElements.forEach((el) => {
        el.remove();
    });
};

// 将紧急修复工具挂载到window对象，方便调试
if (typeof window !== "undefined") {
    window.emergencyFixLoading = emergencyFixLoading;
    window.getLoadingStatus = getLoadingStatus;
}

// 默认导出
export default {
    formatDate,
    getNow,
    getRelativeDate,
    dateDiff,
    formatTimeAgo,
    showPageLoading,
    hidePageLoading,
    showGlobalLoading,
    hideGlobalLoading,
    showLoading,
    hideLoading,
    showLocalLoading,
    hideLocalLoading,
    hideAllLoading,
    showMessage,
    showNotification,
    showConfirm,
    debounce,
    throttle,
    isEmpty,
    getLoadingStatus,
    emergencyFixLoading,
};
