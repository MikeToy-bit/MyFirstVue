# 用户管理模块

这是一个完整的 Vue 3 用户管理模块，包含列表页面和维护页面，已集成真实 API 接口和通用工具函数。

## 文件结构

```
src/
├── views/user/
│   ├── user-list.vue      # 用户列表页面
│   ├── user-add.vue       # 用户维护页面（新增/修改/查看）
│   └── README.md          # 说明文档
├── api/
│   └── user.js            # 用户管理API服务
└── utils/
    ├── common.js          # 通用工具函数（已有）
    └── request.js         # HTTP请求工具
```

## 功能特性

### 用户列表页面 (user-list.vue)

#### 查询条件区域

-   **员工编号**: 文本输入框，支持模糊搜索
-   **员工姓名**: 文本输入框，支持模糊搜索
-   **组织名称**: 文本输入框，支持模糊搜索
-   **岗位名称**: 文本输入框，支持模糊搜索
-   **性别**: 下拉选择框 (男/女)
-   **电话号码**: 文本输入框，支持模糊搜索
-   **身份证号**: 文本输入框，支持模糊搜索
-   **创建时间**: 日期范围选择器
-   **操作按钮**: 查询、重置

#### 操作模式切换

支持两种操作模式：

1. **工具栏模式**:

    - 表格上方显示操作按钮
    - 支持多选和批量操作
    - 包含：新增、修改、删除、查看、恢复按钮

2. **操作列模式**:
    - 表格右侧固定操作列
    - 单行操作，无需选择
    - 包含：查看详情、编辑、更多操作下拉菜单

#### 数据表格

-   **员工编号**: 显示员工编号
-   **员工姓名**: 显示员工姓名
-   **组织名称**: 显示所属组织
-   **岗位名称**: 显示岗位信息
-   **性别**: 标签显示 (男/女)
-   **电话号码**: 显示联系电话
-   **身份证号**: 显示身份证号码
-   **创建时间**: 格式化显示创建时间

#### 分页功能

-   支持每页显示数量选择 (10/20/50/100)
-   页码跳转
-   总数显示

### 用户维护页面 (user-add.vue)

#### 页面模式

支持三种操作模式：

1. **新增模式** (`mode="add"`)

    - 所有字段可编辑
    - 包含密码设置
    - 表单验证
    - 提交后重置表单

2. **修改模式** (`mode="edit"`)

    - 所有字段可编辑（除密码）
    - 预加载现有数据
    - 表单验证
    - 提交后返回列表

3. **查看模式** (`mode="view"`)
    - 所有字段只读
    - 显示创建时间
    - 无验证要求
    - 只显示返回按钮

#### 表单字段

-   **基本信息**: 员工编号、员工姓名
-   **密码信息**: 登录密码、确认密码（仅新增模式）
-   **组织信息**: 组织编码、组织名称
-   **岗位信息**: 岗位编码、岗位名称
-   **个人信息**: 性别、证件类型、证件号码、出生日期
-   **联系信息**: 电话号码
-   **系统信息**: 创建时间（非新增模式）

#### 表单验证

-   必填字段验证
-   格式验证（身份证、手机号）
-   密码确认验证（新增模式）
-   实时验证反馈

## API 集成

### API 服务 (src/api/user.js)

根据 API 文档实现了以下接口：

-   `getUserList()` - 获取用户简单列表
-   `queryUsers(params)` - 分页查询用户
-   `getUserDetail(empCode)` - 获取用户详情
-   `createUser(userData)` - 创建用户
-   `updateUser(userData)` - 更新用户
-   `deleteUser(empCode)` - 删除用户
-   `batchDeleteUsers(empCodes)` - 批量删除
-   `restoreUser(empCode)` - 恢复用户

### 请求工具 (src/utils/request.js)

-   基于 axios 封装
-   自动添加认证 token
-   统一错误处理
-   请求/响应日志

## 通用工具集成

### 使用 common.js 工具函数

```javascript
import {
    showMessage, // 显示消息提示
    showConfirm, // 显示确认对话框
    showGlobalLoading, // 显示全局加载
    hideGlobalLoading, // 隐藏全局加载
    formatDate, // 格式化日期
} from "@/utils/common";

// 使用示例
showMessage("操作成功", "success");
showConfirm("确定要删除吗？").then(() => {
    // 确认操作
});
```

### 消息类型

-   `success` - 成功消息（绿色）
-   `warning` - 警告消息（橙色）
-   `error` - 错误消息（红色）
-   `info` - 信息消息（蓝色）

## 使用方法

### 1. 环境配置

```javascript
// .env 文件
VUE_APP_BASE_API=http://localhost:8080/api
```

### 2. 路由配置

```javascript
// router/index.js
const routes = [
    {
        path: "/user",
        children: [
            {
                path: "list",
                name: "UserList",
                component: () => import("@/views/user/user-list.vue"),
            },
            {
                path: "add",
                name: "UserAdd",
                component: () => import("@/views/user/user-add.vue"),
                props: { mode: "add" },
            },
            {
                path: "edit/:empCode",
                name: "UserEdit",
                component: () => import("@/views/user/user-add.vue"),
                props: (route) => ({
                    mode: "edit",
                    empCode: route.params.empCode,
                }),
            },
            {
                path: "view/:empCode",
                name: "UserView",
                component: () => import("@/views/user/user-add.vue"),
                props: (route) => ({
                    mode: "view",
                    empCode: route.params.empCode,
                }),
            },
        ],
    },
];
```

### 3. 页面跳转示例

```javascript
// 新增用户
this.$router.push("/user/add");

// 编辑用户
this.$router.push(`/user/edit/${empCode}`);

// 查看用户
this.$router.push(`/user/view/${empCode}`);
```

## 技术特性

### API 响应格式

根据 API 文档，标准响应格式为：

```javascript
{
    "statusCode": 200,
    "message": "操作成功",
    "data": { /* 响应数据 */ },
    "success": true
}
```

### 错误处理

-   统一的错误提示
-   网络错误重试机制
-   认证失效自动处理
-   业务错误友好提示

### 响应式设计

-   支持 PC 和移动端
-   自适应布局
-   表单字段在小屏设备上自动堆叠

### 用户体验

-   全局加载状态
-   操作反馈消息
-   表单验证提示
-   确认对话框
-   数据加载状态

### 性能优化

-   分页查询减少数据量
-   请求防抖处理
-   组件按需加载
-   日期格式化缓存

## 依赖要求

-   Vue 3.x
-   Element Plus
-   Vue Router
-   Axios

## 部署说明

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve
```

### 生产环境

```bash
# 构建生产版本
npm run build

# 配置环境变量
VUE_APP_BASE_API=https://your-api-domain.com/api
```

## 扩展建议

1. **权限控制**:

    - 根据用户角色显示不同操作按钮
    - 接口级权限验证

2. **数据导出**:

    - Excel 导出功能
    - PDF 报表生成

3. **高级搜索**:

    - 保存搜索条件
    - 搜索历史记录

4. **批量操作**:

    - 批量导入用户数据
    - 批量状态更新

5. **实时更新**:

    - WebSocket 实时数据推送
    - 自动刷新机制

6. **缓存优化**:
    - 搜索结果缓存
    - 用户信息本地缓存

## 常见问题

### Q: 如何修改 API 基础路径？

A: 在环境变量文件中修改 `VUE_APP_BASE_API` 的值。

### Q: 如何自定义错误处理？

A: 在 `src/utils/request.js` 中修改响应拦截器。

### Q: 如何添加新的搜索字段？

A: 在 `searchForm` 中添加字段，并在模板中添加对应的表单项。

### Q: 如何修改表格列？

A: 在 `user-list.vue` 的表格配置中添加或修改 `el-table-column`。
