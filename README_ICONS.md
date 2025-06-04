# Element Plus 图标使用指南

## 已完成配置

✅ Element Plus 图标库已全局注册，您可以在任何组件中直接使用所有图标，无需额外导入。

## 使用方式

### 1. 直接使用组件标签（推荐）

```vue
<template>
    <!-- 基础使用 -->
    <el-icon><Edit /></el-icon>

    <!-- 设置大小和颜色 -->
    <el-icon size="20" color="#409EFF"><Search /></el-icon>

    <!-- 在按钮中使用 -->
    <el-button type="primary" :icon="Plus">添加</el-button>

    <!-- 在菜单中使用 -->
    <el-menu-item>
        <el-icon><User /></el-icon>
        <span>用户管理</span>
    </el-menu-item>
</template>
```

### 2. 动态图标（在脚本中使用）

```vue
<script setup>
// 无需导入，直接使用字符串形式
const iconName = ref("Edit");

// 或者使用 shallowRef 提高性能
import { shallowRef } from "vue";
const icon = shallowRef(Edit);
</script>

<template>
    <!-- 动态图标 -->
    <el-icon>
        <component :is="iconName" />
    </el-icon>
</template>
```

### 3. 条件渲染

```vue
<template>
    <el-icon>
        <Check v-if="isSuccess" />
        <Close v-else />
    </el-icon>
</template>
```

## 常用图标分类

### 基础操作

-   `Plus` - 添加
-   `Edit` - 编辑
-   `Delete` - 删除
-   `Search` - 搜索
-   `Refresh` - 刷新
-   `Close` - 关闭
-   `Check` - 确认

### 方向箭头

-   `ArrowLeft` - 左箭头
-   `ArrowRight` - 右箭头
-   `ArrowUp` - 上箭头
-   `ArrowDown` - 下箭头

### 菜单图标

-   `House` - 首页
-   `User` - 用户
-   `Setting` - 设置
-   `Document` - 文档
-   `Folder` - 文件夹
-   `DataLine` - 数据/图表
-   `Tools` - 工具

### 状态图标

-   `Warning` - 警告
-   `Success` - 成功
-   `Info` - 信息
-   `Question` - 疑问
-   `Star` - 星形（空心）
-   `StarFilled` - 星形（实心）

## 图标大小和样式

```vue
<template>
    <!-- 不同大小 -->
    <el-icon size="small"><Edit /></el-icon>
    <el-icon size="default"><Edit /></el-icon>
    <el-icon size="large"><Edit /></el-icon>

    <!-- 自定义大小 -->
    <el-icon :size="24"><Edit /></el-icon>

    <!-- 自定义颜色 -->
    <el-icon color="#409EFF"><Edit /></el-icon>
    <el-icon color="var(--el-color-primary)"><Edit /></el-icon>

    <!-- CSS 类名 -->
    <el-icon class="custom-icon"><Edit /></el-icon>
</template>

<style>
.custom-icon {
    font-size: 20px;
    color: #67c23a;
    cursor: pointer;
    transition: color 0.3s;
}

.custom-icon:hover {
    color: #85ce61;
}
</style>
```

## 在现有组件中的应用

由于已全局注册，您可以在以下场景直接使用：

1. **菜单系统** - 在 `main.vue` 的菜单中
2. **按钮操作** - 在各种操作按钮中
3. **表格操作** - 在表格的操作列中
4. **表单字段** - 在输入框、选择器等组件中
5. **状态指示** - 显示成功、错误、警告等状态

## 性能提示

-   图标组件已经进行了树摇优化，只会打包实际使用的图标
-   对于大量动态图标，建议使用 `shallowRef` 而不是 `ref`
-   避免在循环中频繁切换图标组件

## 完整图标列表

访问 [Element Plus 图标库](https://element-plus.org/zh-CN/component/icon.html) 查看所有可用图标。

所有图标都已全局注册，您可以直接使用组件名称，例如：

-   `<Edit />`
-   `<User />`
-   `<Setting />`
-   等等...

## 示例组件

查看 `src/components/IconDemo.vue` 获取更多使用示例和效果展示。
