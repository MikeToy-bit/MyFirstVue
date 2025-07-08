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

/**
 * 获取 token
 */
export const getToken = () => {
    return localStorage.getItem("access_token");
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
    getToken,
};

// =============== 表格管理系统 ===============

/**
 * 表格管理器类
 * 统一管理表格的数据获取、分页、加载状态等功能
 */
class TableManager {
    constructor(config = {}) {
        this.config = {
            // API相关配置
            apiFunction: config.apiFunction || null, // API函数
            apiParams: config.apiParams || {}, // API默认参数

            // 分页配置
            pageIndex: config.pageIndex || 1,
            pageSize: config.pageSize || 10,
            pageSizes: config.pageSizes || [10, 20, 50, 100],

            // 选择模式配置
            selectionMode: config.selectionMode || "single", // 'single', 'multiple', 'none'

            // 数据处理配置
            dataField: config.dataField || "data.dataInfo", // 数据字段路径
            totalField: config.totalField || "data.totalCount", // 总数字段路径

            // 加载配置
            loadingKey: config.loadingKey || "tableLoading",
            autoLoad: config.autoLoad !== false, // 是否自动加载

            // 其他配置
            showMessage: config.showMessage !== false, // 是否显示消息
            ...config,
        };

        // 状态管理
        this.state = {
            loading: false,
            data: [],
            total: 0,
            currentPage: this.config.pageIndex,
            pageSize: this.config.pageSize,
            selectedRows: [],
            searchParams: {},
        };

        // 事件回调
        this.callbacks = {
            onDataLoad: config.onDataLoad || null,
            onError: config.onError || null,
            onSelectionChange: config.onSelectionChange || null,
            beforeLoad: config.beforeLoad || null,
            afterLoad: config.afterLoad || null,
        };

        // 自动加载
        if (this.config.autoLoad && this.config.apiFunction) {
            this.loadData();
        }
    }

    /**
     * 设置API函数
     * @param {Function} apiFunction API函数
     * @param {Object} defaultParams 默认参数
     */
    setApiFunction(apiFunction, defaultParams = {}) {
        this.config.apiFunction = apiFunction;
        this.config.apiParams = { ...this.config.apiParams, ...defaultParams };
        return this;
    }

    /**
     * 获取嵌套对象的值
     * @param {Object} obj 对象
     * @param {string} path 路径，如 'data.items'
     * @param {*} defaultVal 默认值
     */
    getNestedValue(obj, path, defaultVal = null) {
        if (!path) return obj;
        return path.split(".").reduce((current, key) => {
            return current && current[key] !== undefined
                ? current[key]
                : defaultVal;
        }, obj);
    }

    /**
     * 构建查询参数
     * @param {Object} extraParams 额外参数
     */
    buildQueryParams(extraParams = {}) {
        return {
            ...this.config.apiParams,
            ...this.state.searchParams,
            pageIndex: this.state.currentPage,
            pageSize: this.state.pageSize,
            ...extraParams,
        };
    }

    /**
     * 加载数据
     * @param {Object} params 查询参数
     * @param {boolean} resetPage 是否重置页码
     */
    async loadData(params = {}, resetPage = false) {
        if (!this.config.apiFunction) {
            console.warn("TableManager: API函数未设置");
            return;
        }

        try {
            // 重置页码
            if (resetPage) {
                this.state.currentPage = 1;
            }

            // 执行前置回调
            if (this.callbacks.beforeLoad) {
                const result = await this.callbacks.beforeLoad(params);
                if (result === false) return; // 如果返回false，取消加载
            }

            // 显示加载状态
            this.setLoading(true);

            // 构建查询参数
            const queryParams = this.buildQueryParams(params);

            console.log("TableManager: 开始加载数据", queryParams);

            // 调用API
            const apiResponse = await this.config.apiFunction(queryParams);

            let response = null;
            if (apiResponse && apiResponse.data) {
                response = apiResponse.data;
            } else if (apiResponse) {
                // 兼容直接返回响应数据的情况
                response = apiResponse;
            }

            console.log("TableManager: API响应", response);

            if (response && response.success) {
                // 提取数据
                const data = this.getNestedValue(
                    response,
                    this.config.dataField,
                    []
                );
                const total = this.getNestedValue(
                    response,
                    this.config.totalField,
                    0
                );

                // 更新状态
                this.state.data = Array.isArray(data) ? data : [];
                this.state.total = typeof total === "number" ? total : 0;

                console.log("TableManager: 数据加载成功", {
                    count: this.state.data.length,
                    total: this.state.total,
                });

                // 执行数据加载回调
                if (this.callbacks.onDataLoad) {
                    this.callbacks.onDataLoad(
                        this.state.data,
                        this.state.total
                    );
                }

                // 执行后置回调
                if (this.callbacks.afterLoad) {
                    this.callbacks.afterLoad(this.state.data, this.state.total);
                }
            } else {
                const errorMsg = response?.message || "数据加载失败";
                console.error("TableManager: API响应错误", errorMsg);

                if (this.config.showMessage) {
                    showMessage(errorMsg, "error");
                }

                if (this.callbacks.onError) {
                    this.callbacks.onError(new Error(errorMsg));
                }
            }
        } catch (error) {
            console.error("TableManager: 数据加载异常", error);

            if (this.config.showMessage) {
                showMessage("数据加载失败，请稍后重试", "error");
            }

            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 设置加载状态
     * @param {boolean} loading 加载状态
     */
    setLoading(loading) {
        this.state.loading = loading;

        // 移除全屏loading，只管理状态，UI层面的loading由组件自己控制
        // 例如：CommonTable组件使用el-table的v-loading指令
        console.log("TableManager loading状态变更:", loading);
    }

    /**
     * 搜索数据
     * @param {Object} searchParams 搜索参数
     */
    search(searchParams = {}) {
        this.state.searchParams = { ...searchParams };
        return this.loadData({}, true); // 重置页码
    }

    /**
     * 重置搜索
     */
    resetSearch() {
        this.state.searchParams = {};
        this.state.currentPage = 1;
        return this.loadData();
    }

    /**
     * 刷新数据（保持当前页码和搜索条件）
     */
    refresh() {
        return this.loadData();
    }

    /**
     * 改变页码
     * @param {number} page 页码
     */
    changePage(page) {
        this.state.currentPage = page;
        return this.loadData();
    }

    /**
     * 改变每页大小
     * @param {number} size 每页大小
     */
    changePageSize(size) {
        this.state.pageSize = size;
        this.state.currentPage = 1; // 重置到第一页
        return this.loadData();
    }

    /**
     * 处理选择变化
     * @param {Array} selection 选中的行
     */
    handleSelectionChange(selection) {
        this.state.selectedRows = selection || [];

        console.log("TableManager: 选择变化", {
            mode: this.config.selectionMode,
            count: this.state.selectedRows.length,
        });

        // 单选模式限制
        if (
            this.config.selectionMode === "single" &&
            this.state.selectedRows.length > 1
        ) {
            this.state.selectedRows = [
                this.state.selectedRows[this.state.selectedRows.length - 1],
            ];
        }

        if (this.callbacks.onSelectionChange) {
            this.callbacks.onSelectionChange(this.state.selectedRows);
        }
    }

    /**
     * 获取选中的行
     */
    getSelectedRows() {
        return this.state.selectedRows;
    }

    /**
     * 获取选中行的ID（假设每行有id字段）
     * @param {string} idField ID字段名，默认为'id'
     */
    getSelectedIds(idField = "id") {
        return this.state.selectedRows.map((row) => row[idField]);
    }

    /**
     * 清空选择
     */
    clearSelection() {
        this.state.selectedRows = [];
        if (this.callbacks.onSelectionChange) {
            this.callbacks.onSelectionChange([]);
        }
    }

    /**
     * 获取表格数据
     */
    getData() {
        return this.state.data;
    }

    /**
     * 获取分页信息
     */
    getPagination() {
        return {
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            total: this.state.total,
            pageSizes: this.config.pageSizes,
        };
    }

    /**
     * 获取加载状态
     */
    getLoading() {
        return this.state.loading;
    }

    /**
     * 获取完整状态
     */
    getState() {
        return {
            ...this.state,
            pagination: this.getPagination(),
        };
    }

    /**
     * 销毁表格管理器
     */
    destroy() {
        this.setLoading(false);
        this.clearSelection();
        this.state = {
            loading: false,
            data: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            selectedRows: [],
            searchParams: {},
        };
    }
}

/**
 * 创建表格管理器
 * @param {Object} config 配置选项
 * @returns {TableManager} 表格管理器实例
 */
export const createTableManager = (config = {}) => {
    return new TableManager(config);
};

/**
 * Vue 3 组合式API的表格管理Hook
 * @param {Object} config 配置选项
 * @returns {Object} 表格管理相关的响应式数据和方法
 */
export const useTableManager = (config = {}) => {
    const tableManager = new TableManager(config);

    // 导入Vue的响应式API
    const { ref, reactive, computed } = require("vue");

    // 响应式状态
    const tableData = ref([]);
    const loading = ref(false);
    const selectedRows = ref([]);
    const pagination = reactive({
        currentPage: config.pageIndex || 1,
        pageSize: config.pageSize || 10,
        total: 0,
        pageSizes: config.pageSizes || [10, 20, 50, 100],
    });

    // 更新响应式状态
    const updateReactiveState = () => {
        const state = tableManager.getState();
        tableData.value = state.data;
        loading.value = state.loading;
        selectedRows.value = state.selectedRows;

        pagination.currentPage = state.pagination.currentPage;
        pagination.pageSize = state.pagination.pageSize;
        pagination.total = state.pagination.total;
    };

    // 设置回调来同步状态
    tableManager.callbacks.onDataLoad = () => updateReactiveState();
    tableManager.callbacks.onSelectionChange = () => updateReactiveState();

    // 重写方法以同步状态
    const originalSetLoading = tableManager.setLoading.bind(tableManager);
    tableManager.setLoading = (loadingState) => {
        originalSetLoading(loadingState);
        loading.value = loadingState;
    };

    // 计算属性
    const hasSelection = computed(() => selectedRows.value.length > 0);
    const isMultipleSelection = computed(
        () => config.selectionMode === "multiple"
    );
    const isSingleSelection = computed(() => config.selectionMode === "single");

    // 方法
    const loadData = (params, resetPage) => {
        return tableManager
            .loadData(params, resetPage)
            .then(updateReactiveState);
    };

    const search = (searchParams) => {
        return tableManager.search(searchParams).then(updateReactiveState);
    };

    const refresh = () => {
        return tableManager.refresh().then(updateReactiveState);
    };

    const resetSearch = () => {
        return tableManager.resetSearch().then(updateReactiveState);
    };

    const handleCurrentChange = (page) => {
        return tableManager.changePage(page).then(updateReactiveState);
    };

    const handleSizeChange = (size) => {
        return tableManager.changePageSize(size).then(updateReactiveState);
    };

    const handleSelectionChange = (selection) => {
        tableManager.handleSelectionChange(selection);
        updateReactiveState();
    };

    return {
        // 响应式数据
        tableData,
        loading,
        selectedRows,
        pagination,

        // 计算属性
        hasSelection,
        isMultipleSelection,
        isSingleSelection,

        // 方法
        loadData,
        search,
        refresh,
        resetSearch,
        handleCurrentChange,
        handleSizeChange,
        handleSelectionChange,

        // 获取方法
        getSelectedRows: () => tableManager.getSelectedRows(),
        getSelectedIds: (idField) => tableManager.getSelectedIds(idField),
        clearSelection: () => {
            tableManager.clearSelection();
            updateReactiveState();
        },

        // 原始管理器
        tableManager,
    };
};

/**
 * 表格配置预设
 */
export const tablePresets = {
    // 标准列表表格
    standardList: {
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        selectionMode: "multiple",
        showMessage: true,
        autoLoad: true,
    },

    // 选择器表格
    selector: {
        pageSize: 5,
        pageSizes: [5, 10, 20],
        selectionMode: "single",
        showMessage: false,
        autoLoad: true,
    },

    // 大数据表格
    bigData: {
        pageSize: 50,
        pageSizes: [50, 100, 200, 500],
        selectionMode: "multiple",
        showMessage: true,
        autoLoad: false,
    },

    // 只读表格
    readonly: {
        pageSize: 20,
        pageSizes: [20, 50, 100],
        selectionMode: "none",
        showMessage: true,
        autoLoad: true,
    },
};

/**
 * 创建预设表格管理器
 * @param {string} presetName 预设名称
 * @param {Object} customConfig 自定义配置
 * @returns {TableManager} 表格管理器实例
 */
export const createPresetTableManager = (presetName, customConfig = {}) => {
    const preset = tablePresets[presetName];
    if (!preset) {
        console.warn(`未找到预设配置: ${presetName}`);
        return createTableManager(customConfig);
    }

    return createTableManager({
        ...preset,
        ...customConfig,
    });
};

/**
 * 表格工具函数
 */
export const tableHelpers = {
    /**
     * 格式化表格数据
     * @param {Array} data 原始数据
     * @param {Object} formatters 格式化器映射
     */
    formatTableData: (data, formatters = {}) => {
        if (!Array.isArray(data)) return [];

        return data.map((row) => {
            const formattedRow = { ...row };

            Object.keys(formatters).forEach((key) => {
                if (row[key] !== undefined) {
                    const formatter = formatters[key];
                    if (typeof formatter === "function") {
                        formattedRow[key] = formatter(row[key], row);
                    }
                }
            });

            return formattedRow;
        });
    },

    /**
     * 生成表格列配置
     * @param {Array} columns 列配置数组
     */
    generateColumns: (columns = []) => {
        return columns.map((col) => ({
            prop: col.prop || col.key,
            label: col.label || col.title,
            width: col.width,
            minWidth: col.minWidth || 100,
            fixed: col.fixed,
            sortable: col.sortable || false,
            formatter: col.formatter,
            ...col,
        }));
    },

    /**
     * 导出表格数据
     * @param {Array} data 表格数据
     * @param {Array} columns 列配置
     * @param {string} filename 文件名
     */
    exportTableData: (data, columns, filename = "table-data.csv") => {
        if (!Array.isArray(data) || data.length === 0) {
            showMessage("没有数据可导出", "warning");
            return;
        }

        // 生成CSV内容
        const headers = columns.map((col) => col.label || col.prop).join(",");
        const rows = data.map((row) =>
            columns
                .map((col) => {
                    const value = row[col.prop] || "";
                    return `"${String(value).replace(/"/g, '""')}"`;
                })
                .join(",")
        );

        const csvContent = [headers, ...rows].join("\n");

        // 创建下载链接
        const blob = new Blob(["\ufeff" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();

        showMessage("导出成功", "success");
    },
};

// 导出默认表格管理器实例（用于简单场景）
export const defaultTableManager = createTableManager();
