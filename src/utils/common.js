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
            console.warn(`不支持的时间单位: ${unit}`);
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

// ------------ Loading管理 ------------

// 保存loading实例的Map
const loadingInstances = new Map();

/**
 * 显示全屏加载状态
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
    // 如果已存在相同key的loading实例，先关闭
    if (loadingInstances.has(key)) {
        loadingInstances.get(key).close();
    }

    const defaultOptions = {
        lock: true,
        text,
        background: "rgba(0, 0, 0, 0.7)",
    };

    const instance = ElLoading.service({
        ...defaultOptions,
        ...options,
    });

    loadingInstances.set(key, instance);
    return instance;
};

/**
 * 关闭加载状态
 * @param {string} key 要关闭的loading的唯一标识
 */
export const hideLoading = (key = "global") => {
    if (loadingInstances.has(key)) {
        loadingInstances.get(key).close();
        loadingInstances.delete(key);
    }
};

/**
 * 关闭所有加载状态
 */
export const hideAllLoading = () => {
    loadingInstances.forEach((instance) => {
        instance.close();
    });
    loadingInstances.clear();
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

// 默认导出
export default {
    formatDate,
    getNow,
    getRelativeDate,
    dateDiff,
    formatTimeAgo,
    showLoading,
    hideLoading,
    hideAllLoading,
    showMessage,
    showNotification,
    showConfirm,
    debounce,
    throttle,
    isEmpty,
};
