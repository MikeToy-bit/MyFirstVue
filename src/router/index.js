import { createRouter, createWebHistory } from "vue-router";
import login from "../views/login.vue";
import Main from "../views/main.vue";
import Dashboard from "../views/dashboard.vue";
import Users from "../views/user/user-list.vue";
import UserAdd from "../views/user/user-add.vue";
import Settings from "../views/settings.vue";
import Security from "../views/security.vue";
import CommonDemo from "../views/examples/common-demo.vue";
import DictionaryList from "../views/dictionary/dictionary-list.vue";
import DictionaryAdd from "../views/dictionary/dictionary-add.vue";
import { useUserStore } from "../stores/user";
import { ElMessage } from "element-plus";

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

const routes = [
    {
        path: "/",
        name: "login",
        component: login,
        meta: { requiresAuth: false },
    },
    {
        path: "/main",
        name: "main",
        component: Main,
        meta: { requiresAuth: true },
        children: [
            {
                path: "dashboard",
                name: "dashboard",
                component: Dashboard,
            },
            {
                path: "user-list",
                name: "user-list",
                component: Users,
            },
            {
                path: "user-add",
                name: "user-add",
                component: UserAdd,
            },
            {
                path: "settings",
                name: "settings",
                component: Settings,
            },
            {
                path: "security",
                name: "security",
                component: Security,
            },
            {
                path: "common-demo",
                name: "common-demo",
                component: CommonDemo,
            },
            {
                path: "dictionary-list",
                name: "dictionary-list",
                component: DictionaryList,
            },
            {
                path: "dictionary-add",
                name: "dictionary-add",
                component: DictionaryAdd,
            },
            {
                path: "dictionary-edit",
                name: "dictionary-edit",
                component: () =>
                    import("../views/dictionary/dictionary-add.vue"),
                props: (route) => ({
                    isEdit: true,
                    dictId: route.query.dictId,
                }),
            },
            {
                path: "dictionary-view",
                name: "dictionary-view",
                component: () =>
                    import("../views/dictionary/dictionary-add.vue"),
                props: (route) => ({
                    isView: true,
                    dictId: route.query.dictId,
                }),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // 获取store中的token或从localStorage获取
    const userStore = useUserStore();
    let token = userStore.token;

    // 如果store中没有token但localStorage中有，则更新store
    if (!token) {
        token = localStorage.getItem("access_token");
        if (token) {
            userStore.setToken(token);
        }
    }

    // 需要验证权限的路由
    if (to.meta.requiresAuth) {
        // 没有token，跳转到登录页
        if (!token) {
            ElMessage.warning("请先登录");
            next("/");
            return;
        }

        // token已过期，跳转到登录页
        if (isTokenExpired(token)) {
            ElMessage.error("登录已过期，请重新登录");
            userStore.logout();
            next("/");
            return;
        }

        // token有效，尝试获取用户信息和菜单
        try {
            // 如果没有用户信息，则获取
            if (!userStore.userInfo) {
                try {
                    await userStore.getUserInfo();
                } catch (error) {
                    console.error("获取用户信息失败", error);
                    // 即使获取失败，也不阻止导航，因为token解析已经提供了基本信息
                }
            }

            // 如果没有菜单数据，则获取
            // if (!userStore.menuList.length) {
            //     try {
            //         console.log("index开始获取菜单数据");
            //         await userStore.getMenuList();
            //     } catch (error) {
            //         console.error("获取菜单失败", error);
            //         // 即使获取失败，也不阻止导航
            //     }
            // }

            // 允许访问受保护路由
            next();
        } catch (error) {
            console.error("用户信息初始化失败", error);
            userStore.logout();
            next("/");
        }
    } else {
        // 对于不需要认证的路由（如登录页）
        if (token && to.path === "/") {
            // 已登录用户访问登录页，重定向到首页
            next("/main/dashboard");
        } else {
            // 正常访问不需要认证的页面
            next();
        }
    }
});

export default router;
