import { defineStore } from "pinia";
import { ref } from "vue";
import request from "../utils/request";
import router from "../router";
import { ElMessage } from "element-plus";

// 解析 JWT token 中的 payload
const parseJwt = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const useUserStore = defineStore("user", () => {
    // 从localStorage初始化状态
    const token = ref(localStorage.getItem("access_token"));
    const userInfo = ref(null);
    const menuList = ref([]);

    // 初始化用户信息(如果有token)
    const initUserInfo = async () => {
        if (token.value && !userInfo.value) {
            try {
                // 从token解析基本信息
                const claims = parseJwt(token.value);
                if (claims) {
                    userInfo.value = {
                        empCode: claims.EmpCode,
                        empName: claims.EmpName,
                        orgCode: claims.OrgCode,
                        orgName: claims.OrgName,
                        postCode: claims.PostCode,
                        postName: claims.PostName,
                        sex: claims.Sex,
                        birthday: claims.Birthday,
                        phoneNumber: claims.PhoneNumber,
                        roles: claims.roles ? claims.roles.split(",") : [],
                        permissions: claims.permissions || [],
                    };
                }
                // 可选：从服务器获取完整用户信息
                // await getUserInfo();
            } catch (error) {
                console.error("初始化用户信息失败", error);
            }
        }
    };

    // 登录
    const login = async (formData) => {
        try {
            // 使用标准请求，全局loading会自动启用
            const response = await request.post("/api/auth/login", formData);

            console.log("登录响应", response);
            if (response.data.statusCode === 200) {
                const { accessToken, refreshToken } = response.data.data;
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);

                // 设置 token
                token.value = accessToken;

                // 从 accessToken 中解析用户信息
                const claims = parseJwt(accessToken);
                console.log("claims", claims);

                if (claims) {
                    userInfo.value = {
                        empCode: claims.EmpCode,
                        empName: claims.EmpName,
                        orgCode: claims.OrgCode,
                        orgName: claims.OrgName,
                        postCode: claims.PostCode,
                        postName: claims.PostName,
                        sex: claims.Sex,
                        birthday: claims.Birthday,
                        phoneNumber: claims.PhoneNumber,
                        roles: claims.roles ? claims.roles.split(",") : [],
                        permissions: claims.permissions || [],
                    };
                    console.log("用户信息", userInfo.value);
                }
                ElMessage.success("登录成功");
            } else {
                ElMessage.error(response.data.message || "登录失败");
            }
        } catch (error) {
            ElMessage.error(error.message || "登录失败");
        }
    };

    // 获取用户信息
    const getUserInfo = async () => {
        try {
            if (userInfo.value) {
                return userInfo.value;
            }
            // const response = await request.get("/api/user");
            // if (response.data.code === 200) {
            //     userInfo.value = response.data.data;
            //     return userInfo.value;
            // } else {
            //     throw new Error(response.data.message || "获取用户信息失败");
            // }
        } catch (error) {
            throw error;
        }
    };

    // 获取菜单列表

    // menuList.value = [
    //     {
    //         path: "/dashboard",
    //         label: "仪表盘",
    //         children: null,
    //     },
    //     {
    //         path: "/users",
    //         label: "用户管理",
    //         children: [
    //             {
    //                 path: "/users/list",
    //                 label: "用户列表",
    //             },
    //             {
    //                 path: "/users/add",
    //                 label: "添加用户",
    //             },
    //         ],
    //     },
    //     {
    //         path: "/settings",
    //         label: "设置",
    //         children: [
    //             {
    //                 path: "/settings/general",
    //                 label: "常规设置",
    //             },
    //             {
    //                 path: "/settings/security",
    //                 label: "安全设置",
    //             },
    //         ],
    //     },
    // ];

    const getMenuList = async () => {
        try {
            console.log("开始获取菜单数据");
            // 获取菜单数据
            const response = await request
                .get("/api/user/getMenusByToken")
                .catch((err) => {
                    console.error("菜单请求异常:", err);
                    throw err; // 重新抛出以便在外层catch中处理
                });

            console.log("菜单响应:", response);

            // 根据返回的状态码处理数据
            if (
                (response.data && response.data.code === 200) ||
                (response.data && response.data.statusCode === 200)
            ) {
                // 获取菜单数据
                const rawMenuList = response.data.data || [];
                console.log("原始菜单数据:", rawMenuList);

                // 处理菜单数据，转换为应用所需格式
                const processedMenus = rawMenuList.map((menu) => ({
                    id: menu.menuId,
                    path: menu.menuUrl,
                    title: menu.menuName,
                    icon: menu.menuIcon,
                    parentId: menu.parentMenuId,
                    children: menu.children
                        ? menu.children.map((child) => ({
                              id: child.menuId,
                              path: child.menuUrl,
                              title: child.menuName,
                              icon: child.menuIcon,
                              parentId: child.parentMenuId,
                          }))
                        : [],
                }));

                console.log("处理后的菜单数据:", processedMenus);
                menuList.value = processedMenus;
                return processedMenus;
            } else {
                console.warn("菜单响应状态码错误:", response.data);
                // 如果后端返回不符合预期的数据结构，也使用静态菜单
                const staticMenus = getStaticMenus();
                menuList.value = staticMenus;
                return staticMenus;
            }
        } catch (error) {
            console.error("获取菜单列表错误:", error);
            // 返回静态菜单数据作为备用，避免UI崩溃
            const staticMenus = getStaticMenus();
            menuList.value = staticMenus;
            return staticMenus;
        }
    };

    // 提供静态菜单数据作为备用
    const getStaticMenus = () => {
        console.log("使用静态菜单数据");
        return [
            {
                id: "1",
                path: "/dashboard",
                title: "仪表盘",
                icon: null,
                parentId: "",
                children: [],
            },
            {
                id: "2",
                path: "/users",
                title: "用户管理",
                icon: null,
                parentId: "",
                children: [
                    {
                        id: "21",
                        path: "/users/list",
                        title: "用户列表",
                        icon: null,
                        parentId: "2",
                    },
                ],
            },
        ];
    };

    // 设置token (用于token刷新)
    const setToken = (newToken) => {
        token.value = newToken;
        localStorage.setItem("access_token", newToken);
    };

    // 登出
    const logout = () => {
        userInfo.value = null;
        menuList.value = [];
        token.value = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/");
    };

    // 尝试初始化
    initUserInfo();

    return {
        userInfo,
        menuList,
        token,
        login,
        getUserInfo,
        getMenuList,
        setToken,
        logout,
    };
});
