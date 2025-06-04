/**
 * 通用列表页面工具函数
 * 提供列表页面常用的功能方法
 */

import { ref, onMounted, onUnmounted } from "vue";

/**
 * 创建搜索展开收缩功能
 * @param {Array} searchFields - 搜索字段数组
 * @param {number} fieldsPerRow - 每行显示的字段数量，默认3
 * @returns {Object} 返回相关的响应式数据和方法
 */
export function useSearchCollapse(searchFields = [], fieldsPerRow = 3) {
    const searchExpanded = ref(false);
    const hasMoreThanTwoRows = ref(false);

    // 检测搜索条件是否超过两行
    const checkSearchRows = () => {
        const totalFields = searchFields.length;
        const totalRows = Math.ceil(totalFields / fieldsPerRow);

        hasMoreThanTwoRows.value = totalRows > 2;

        // 如果超过两行，默认收缩
        if (hasMoreThanTwoRows.value) {
            searchExpanded.value = false;
        } else {
            searchExpanded.value = true;
        }
    };

    // 搜索展开/收缩切换
    const toggleSearchExpand = (updateTableHeightFn) => {
        searchExpanded.value = !searchExpanded.value;

        // 如果提供了表格高度更新函数，延迟执行
        if (updateTableHeightFn && typeof updateTableHeightFn === "function") {
            setTimeout(() => {
                updateTableHeightFn();
            }, 300);
        }
    };

    return {
        searchExpanded,
        hasMoreThanTwoRows,
        checkSearchRows,
        toggleSearchExpand,
    };
}

/**
 * 创建表格高度自适应功能
 * @param {Object} options - 配置选项
 * @returns {Object} 返回表格高度管理相关方法
 */
export function useTableHeight(options = {}) {
    const {
        searchCardSelector = ".list-search-card",
        tableCardSelector = ".list-table-card",
        tableWrapperSelector = ".list-table-wrapper",
        cardHeaderHeight = 60,
        paginationHeight = 60,
        padding = 80,
        minHeight = 300,
    } = options;

    // 动态计算表格高度
    const updateTableHeight = (operationMode = "column") => {
        const searchCard = document.querySelector(searchCardSelector);
        const tableCard = document.querySelector(tableCardSelector);
        const tableWrapper = document.querySelector(tableWrapperSelector);

        if (searchCard && tableCard && tableWrapper) {
            const viewportHeight = window.innerHeight;
            const searchCardHeight = searchCard.offsetHeight;
            const toolbarHeight = operationMode === "toolbar" ? 60 : 0;

            const availableHeight =
                viewportHeight -
                searchCardHeight -
                cardHeaderHeight -
                toolbarHeight -
                paginationHeight -
                padding;
            const finalHeight = Math.max(availableHeight, minHeight);

            tableWrapper.style.height = finalHeight + "px";

            // 触发表格重新计算
            const tableEl = tableWrapper.querySelector(".el-table");
            if (tableEl) {
                tableEl.dispatchEvent(new Event("resize"));
            }
        }
    };

    // 初始化高度计算和事件监听
    const initTableHeight = (operationMode) => {
        // 初始化表格高度
        setTimeout(() => {
            updateTableHeight(operationMode);
        }, 100);

        // 监听窗口大小变化
        const resizeHandler = () => updateTableHeight(operationMode);
        window.addEventListener("resize", resizeHandler);

        // 返回清理函数
        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    };

    return {
        updateTableHeight,
        initTableHeight,
    };
}

/**
 * 创建列表页面通用功能
 * @param {Object} config - 配置对象
 * @returns {Object} 返回列表页面相关的响应式数据和方法
 */
export function useListPage(config = {}) {
    const {
        searchFields = [],
        fieldsPerRow = 3,
        tableHeightOptions = {},
    } = config;

    // 搜索功能
    const searchState = useSearchCollapse(searchFields, fieldsPerRow);

    // 表格高度功能
    const tableHeightState = useTableHeight(tableHeightOptions);

    // 操作模式
    const operationMode = ref("column");

    // 选中的行
    const selectedRows = ref([]);

    // 处理操作模式切换
    const handleModeChange = (mode) => {
        operationMode.value = mode;
        selectedRows.value = [];

        // 更新表格高度
        setTimeout(() => {
            tableHeightState.updateTableHeight(mode);
        }, 100);
    };

    // 处理选择行变化
    const handleSelectionChange = (selection) => {
        selectedRows.value = selection;
    };

    // 重写搜索切换方法，集成表格高度更新
    const toggleSearchExpand = () => {
        searchState.toggleSearchExpand(() => {
            tableHeightState.updateTableHeight(operationMode.value);
        });
    };

    // 初始化
    const initListPage = () => {
        searchState.checkSearchRows();

        const cleanup = tableHeightState.initTableHeight(operationMode.value);

        // 返回清理函数
        return cleanup;
    };

    return {
        // 搜索相关
        searchExpanded: searchState.searchExpanded,
        hasMoreThanTwoRows: searchState.hasMoreThanTwoRows,
        toggleSearchExpand,

        // 表格相关
        operationMode,
        selectedRows,
        updateTableHeight: tableHeightState.updateTableHeight,
        handleModeChange,
        handleSelectionChange,

        // 初始化
        initListPage,
    };
}

/**
 * 表格操作相关工具函数
 */
export const tableUtils = {
    // 格式化日期时间
    formatDateTime: (dateTime, format = "YYYY-MM-DD HH:mm:ss") => {
        if (!dateTime) return "--";
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return "--";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        const second = String(date.getSeconds()).padStart(2, "0");

        return format
            .replace("YYYY", year)
            .replace("MM", month)
            .replace("DD", day)
            .replace("HH", hour)
            .replace("mm", minute)
            .replace("ss", second);
    },

    // 获取状态标签类型
    getStatusTagType: (status) => {
        const statusMap = {
            active: "success",
            inactive: "danger",
            pending: "warning",
            default: "info",
        };
        return statusMap[status] || "info";
    },

    // 获取性别显示文本
    getGenderText: (gender) => {
        if (typeof gender === "boolean") {
            return gender ? "男" : "女";
        }
        return gender === "male" || gender === "1" || gender === 1
            ? "男"
            : "女";
    },

    // 获取性别标签类型
    getGenderTagType: (gender) => {
        if (typeof gender === "boolean") {
            return gender ? "primary" : "success";
        }
        return gender === "male" || gender === "1" || gender === 1
            ? "primary"
            : "success";
    },
};

/**
 * 分页配置工具
 */
export const paginationConfig = {
    // 默认分页配置
    default: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        pageSizes: [10, 20, 50, 100],
        layout: "total, sizes, prev, pager, next, jumper",
    },

    // 创建分页配置
    create: (overrides = {}) => {
        return { ...paginationConfig.default, ...overrides };
    },
};
