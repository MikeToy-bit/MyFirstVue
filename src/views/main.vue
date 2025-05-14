<template>
    <div class="main-container">
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="logo">
                    <img src="../assets/logo.png" alt="Logo" />
                    <span v-show="!isCollapse">管理系统</span>
                </div>
                <el-menu
                    :default-active="activeMenu"
                    class="el-menu-vertical"
                    :collapse="isCollapse"
                    background-color="#304156"
                    text-color="#bfcbd9"
                    active-text-color="#409EFF"
                    @select="handleMenuSelect"
                >
                    <!-- 动态渲染菜单 -->
                    <template v-for="menu in dynamicMenus" :key="menu.id">
                        <!-- 没有子菜单的情况 -->
                        <el-menu-item
                            v-if="menu.children.length === 0"
                            :index="'/main' + menu.path"
                        >
                            <el-icon
                                ><component :is="getMenuIcon(menu)"
                            /></el-icon>
                            <template #title>{{ menu.title }}</template>
                        </el-menu-item>

                        <!-- 有子菜单的情况 -->
                        <el-sub-menu v-else :index="menu.id">
                            <template #title>
                                <el-icon
                                    ><component :is="getMenuIcon(menu)"
                                /></el-icon>
                                <span>{{ menu.title }}</span>
                            </template>

                            <!-- 子菜单项 -->
                            <el-menu-item
                                v-for="subMenu in menu.children"
                                :key="subMenu.id"
                                :index="'/main' + subMenu.path"
                            >
                                {{ subMenu.title }}
                            </el-menu-item>
                        </el-sub-menu>
                    </template>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="header-left">
                        <el-icon class="collapse-btn" @click="toggleCollapse">
                            <Fold v-if="!isCollapse" />
                            <Expand v-else />
                        </el-icon>
                    </div>
                    <div class="header-right">
                        <el-dropdown>
                            <span class="user-info">
                                <el-avatar :size="32" :src="userAvatar" />
                                <span class="username">{{ username }}</span>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleLogout"
                                        >退出登录</el-dropdown-item
                                    >
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </el-header>
                <el-main>
                    <el-tabs
                        v-model="activeTab"
                        type="card"
                        closable
                        @tab-remove="removeTab"
                        @tab-click="handleTabClick"
                    >
                        <el-tab-pane
                            v-for="item in tabs"
                            :key="item.path"
                            :label="item.title"
                            :name="item.path"
                        >
                            <router-view v-slot="{ Component }">
                                <keep-alive>
                                    <component :is="Component" />
                                </keep-alive>
                            </router-view>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import {
    DataLine,
    User,
    Setting,
    Fold,
    Expand,
    Menu,
    Document,
    HomeFilled,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 路由和状态管理
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 响应式状态
const isCollapse = ref(false);
const activeTab = ref("/main/dashboard");
const tabs = ref([{ title: "仪表盘", path: "/main/dashboard" }]);
const userAvatar = ref(
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
);
const username = ref(userStore.userInfo?.empName || "管理员");
const dynamicMenus = ref([]);
const menuItemsMap = ref(new Map());

// 计算属性
const activeMenu = computed(() => route.path);

// 静态菜单项配置（备用）
const staticMenuItems = [
    // { path: "/main/dashboard", title: "仪表盘" },
    // { path: "/main/users", title: "用户列表" },
    // { path: "/main/user/add", title: "添加用户" },
    // { path: "/main/settings", title: "常规设置" },
    // { path: "/main/security", title: "安全设置" },
];

// 获取菜单图标
const getMenuIcon = (menu) => {
    if (menu.icon) return menu.icon;

    // 根据路径或名称返回默认图标
    if (menu.path.includes("dashboard")) return "DataLine";
    if (menu.path.includes("user")) return "User";
    if (menu.path.includes("setting")) return "Setting";
    return "Document"; // 默认图标
};

// 方法
const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
};

const addTab = (title, path) => {
    if (!tabs.value.some((tab) => tab.path === path)) {
        tabs.value.push({ title, path });
    }
    activeTab.value = path;
};

const removeTab = (targetName) => {
    const currentTabs = tabs.value;
    let activeName = activeTab.value;
    if (activeName === targetName) {
        currentTabs.forEach((tab, index) => {
            if (tab.path === targetName) {
                const nextTab =
                    currentTabs[index + 1] || currentTabs[index - 1];
                if (nextTab) {
                    activeName = nextTab.path;
                }
            }
        });
    }
    activeTab.value = activeName;
    tabs.value = currentTabs.filter((tab) => tab.path !== targetName);

    if (targetName === route.path) {
        router.push(activeName);
    }
};

const handleTabClick = (tab) => {
    const path = tab.props.name;
    router.push(path);
};

// 获取菜单数据并处理
const loadMenuData = async () => {
    try {
        // 从store中获取菜单数据
        console.log("main开始获取菜单数据");
        const menus = await userStore.getMenuList();
        dynamicMenus.value = menus || [];

        // 构建菜单项映射表以便查询
        const menuMap = new Map();
        menus.forEach((menu) => {
            menuMap.set("/main" + menu.path, {
                title: menu.title,
                path: "/main" + menu.path,
            });
            menu.children.forEach((subMenu) => {
                menuMap.set("/main" + subMenu.path, {
                    title: subMenu.title,
                    path: "/main" + subMenu.path,
                });
            });
        });
        menuItemsMap.value = menuMap;

        console.log("菜单加载完成", dynamicMenus.value);
    } catch (error) {
        console.error("加载菜单数据失败", error);
        ElMessage.warning("菜单加载失败，将使用默认菜单");

        // 使用静态菜单作为备用
        staticMenuItems.forEach((item) => {
            menuItemsMap.value.set(item.path, item);
        });
    }
};

const handleMenuSelect = (index) => {
    // 从菜单映射表中获取菜单项信息
    const menuItem =
        menuItemsMap.value.get(index) ||
        staticMenuItems.find((item) => item.path === index);

    if (menuItem) {
        addTab(menuItem.title, index);
        router.push(index);
    } else {
        console.error("未找到菜单项:", index);
    }
};

const handleLogout = () => {
    userStore.logout();
    router.replace("/");
};

// 生命周期钩子
onMounted(async () => {
    // 设置用户名
    if (userStore.userInfo?.empName) {
        username.value = userStore.userInfo.empName;
    }

    // 加载菜单数据
    await loadMenuData();

    // 根据当前路由添加初始标签页
    const currentPath = route.path;
    if (currentPath !== "/main/dashboard") {
        const menuItem =
            menuItemsMap.value.get(currentPath) ||
            staticMenuItems.find((item) => item.path === currentPath);
        if (menuItem) {
            addTab(menuItem.title, currentPath);
        }
    }
});
</script>

<style scoped>
.main-container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.el-container {
    height: 100%;
}

.el-aside {
    background-color: #304156;
    color: #fff;
    height: 100%;
    overflow: hidden;
    transition: width 0.3s;
}

.logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #2b2f3a;
    transition: all 0.3s;
}

.logo img {
    height: 40px;
    margin-right: 10px;
    transition: all 0.3s;
}

.logo span {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
    transition: all 0.3s;
}

.el-menu {
    border-right: none;
    height: calc(100% - 60px);
    overflow-y: auto;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
    transition: all 0.3s;
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
    padding: 0 20px !important;
}

:deep(.el-menu--collapse .el-sub-menu__icon-arrow) {
    display: none;
}

.el-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 60px;
}

.header-left {
    display: flex;
    align-items: center;
}

.collapse-btn {
    font-size: 20px;
    cursor: pointer;
    color: #606266;
}

.header-right {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.username {
    margin-left: 10px;
    color: #606266;
}

.el-main {
    padding: 0;
    background-color: #f0f2f5;
    height: calc(100% - 60px);
    overflow: hidden;
}

:deep(.el-tabs) {
    height: 100%;
}

:deep(.el-tabs__header) {
    margin: 0;
    background-color: #fff;
    padding: 0 20px;
}

:deep(.el-tabs__nav-wrap) {
    padding: 0;
}

:deep(.el-tabs__nav) {
    border: none;
}

:deep(.el-tabs__item) {
    height: 40px;
    line-height: 40px;
    border: none !important;
}

:deep(.el-tabs__item.is-active) {
    background-color: #f0f2f5;
}

:deep(.el-tabs__item:hover) {
    color: #409eff;
}

:deep(.el-tabs__item .is-icon-close) {
    margin-left: 4px;
}

:deep(.el-tabs__content) {
    height: calc(100% - 40px);
    padding: 20px;
    overflow: auto;
}
</style>
