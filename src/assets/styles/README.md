# 全局样式表使用指南

## 概述

`global.css` 是一个全局样式表，包含了常用的工具类、组件样式覆盖和布局样式，可以在所有 Vue 组件中直接使用。

## 功能特性

### 1. CSS Reset & Base Styles

-   全局样式重置
-   基础字体和背景设置
-   统一的盒模型

### 2. 布局工具类

#### Flexbox 布局

```html
<div class="flex-center">居中对齐</div>
<div class="flex-between">两端对齐</div>
<div class="flex-start">左对齐</div>
<div class="flex-end">右对齐</div>
<div class="flex-column">垂直布局</div>
<div class="flex-1">占满剩余空间</div>
```

#### 尺寸工具

```html
<div class="full-height">100vh高度</div>
<div class="full-width">100%宽度</div>
```

### 3. 间距工具类

#### 外边距 (margin)

```html
<div class="m-0">无外边距</div>
<div class="m-1">4px外边距</div>
<div class="m-2">8px外边距</div>
<div class="m-3">12px外边距</div>
<div class="m-4">16px外边距</div>
<div class="m-5">20px外边距</div>

<!-- 方向性外边距 -->
<div class="mt-3">顶部12px外边距</div>
<div class="mb-3">底部12px外边距</div>
<div class="ml-3">左侧12px外边距</div>
<div class="mr-3">右侧12px外边距</div>
```

#### 内边距 (padding)

```html
<div class="p-0">无内边距</div>
<div class="p-1">4px内边距</div>
<div class="p-2">8px内边距</div>
<div class="p-3">12px内边距</div>
<div class="p-4">16px内边距</div>
<div class="p-5">20px内边距</div>

<!-- 方向性内边距 -->
<div class="pt-3">顶部12px内边距</div>
<div class="pb-3">底部12px内边距</div>
<div class="pl-3">左侧12px内边距</div>
<div class="pr-3">右侧12px内边距</div>
```

### 4. 文本工具类

#### 文本对齐

```html
<div class="text-left">左对齐</div>
<div class="text-center">居中对齐</div>
<div class="text-right">右对齐</div>
<div class="text-justify">两端对齐</div>
```

#### 文本样式

```html
<div class="text-nowrap">不换行</div>
<div class="text-break">强制换行</div>
<div class="text-uppercase">大写</div>
<div class="text-lowercase">小写</div>
<div class="text-capitalize">首字母大写</div>
```

#### 字体大小和粗细

```html
<div class="font-size-12">12px字体</div>
<div class="font-size-14">14px字体</div>
<div class="font-size-16">16px字体</div>
<div class="font-size-18">18px字体</div>
<div class="font-size-20">20px字体</div>
<div class="font-size-24">24px字体</div>

<div class="font-weight-light">细体</div>
<div class="font-weight-normal">正常</div>
<div class="font-weight-bold">粗体</div>
```

### 5. 颜色工具类

#### 文本颜色

```html
<div class="text-primary">主色调文本</div>
<div class="text-success">成功色文本</div>
<div class="text-info">信息色文本</div>
<div class="text-warning">警告色文本</div>
<div class="text-danger">危险色文本</div>
<div class="text-gray">灰色文本</div>
```

#### 背景颜色

```html
<div class="bg-primary">主色调背景</div>
<div class="bg-success">成功色背景</div>
<div class="bg-info">信息色背景</div>
<div class="bg-warning">警告色背景</div>
<div class="bg-danger">危险色背景</div>
<div class="bg-light">浅色背景</div>
```

### 6. 边框和圆角

#### 边框

```html
<div class="border">全边框</div>
<div class="border-top">顶部边框</div>
<div class="border-right">右侧边框</div>
<div class="border-bottom">底部边框</div>
<div class="border-left">左侧边框</div>
<div class="border-none">无边框</div>
```

#### 圆角

```html
<div class="rounded">4px圆角</div>
<div class="rounded-lg">8px圆角</div>
<div class="rounded-xl">12px圆角</div>
<div class="rounded-full">圆形</div>
```

### 7. 阴影效果

```html
<div class="shadow-sm">小阴影</div>
<div class="shadow">默认阴影</div>
<div class="shadow-md">中等阴影</div>
<div class="shadow-lg">大阴影</div>
<div class="shadow-xl">超大阴影</div>
<div class="shadow-none">无阴影</div>
```

### 8. 显示控制

```html
<div class="d-none">隐藏</div>
<div class="d-block">块级显示</div>
<div class="d-inline">内联显示</div>
<div class="d-inline-block">内联块显示</div>
<div class="d-flex">弹性显示</div>
```

### 9. 定位工具

```html
<div class="position-relative">相对定位</div>
<div class="position-absolute">绝对定位</div>
<div class="position-fixed">固定定位</div>
<div class="position-sticky">粘性定位</div>
```

## 自定义组件样式

### 页面容器

```html
<div class="page-container">
    <!-- 页面内容 -->
</div>
```

### 搜索卡片

```html
<el-card class="search-card">
    <!-- 搜索表单 -->
</el-card>
```

### 表格卡片

```html
<el-card class="table-card">
    <!-- 表格内容 -->
</el-card>
```

### 工具栏

```html
<div class="toolbar">
    <div class="toolbar-left">
        <!-- 左侧按钮 -->
    </div>
    <div class="toolbar-right">
        <!-- 右侧按钮 -->
    </div>
</div>
```

### 表格操作列

```html
<div class="table-actions">
    <el-button>编辑</el-button>
    <el-button>删除</el-button>
</div>
```

### 状态标签

```html
<el-tag class="status-tag">状态</el-tag>
```

### 加载状态

```html
<div class="loading-container">
    <el-loading />
</div>
```

### 空状态

```html
<div class="empty-state">
    <div class="empty-icon">📝</div>
    <div class="empty-text">暂无数据</div>
</div>
```

## 动画效果

### 淡入淡出

```html
<transition name="fade">
    <div v-if="show">内容</div>
</transition>
```

### 滑动效果

```html
<transition name="slide">
    <div v-if="show">内容</div>
</transition>
```

## 响应式设计

样式表包含了移动端适配，在小屏幕设备上会自动调整：

-   页面容器内边距减少
-   工具栏变为垂直布局
-   表格操作列变为垂直排列
-   表单列间距调整

## 使用示例

### 典型的列表页面布局

```html
<template>
    <div class="page-container">
        <!-- 搜索区域 -->
        <el-card class="search-card">
            <el-form class="flex-between">
                <div class="flex-start">
                    <el-input class="mr-2" placeholder="搜索..." />
                    <el-button type="primary">搜索</el-button>
                </div>
                <el-button>重置</el-button>
            </el-form>
        </el-card>

        <!-- 表格区域 -->
        <el-card class="table-card">
            <!-- 工具栏 -->
            <div class="toolbar">
                <div class="toolbar-left">
                    <el-button type="primary">新增</el-button>
                    <el-button type="danger">批量删除</el-button>
                </div>
                <div class="toolbar-right">
                    <el-button>导出</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <el-table :data="tableData">
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        <el-tag class="status-tag">{{ row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <div class="table-actions">
                            <el-button size="small">编辑</el-button>
                            <el-button size="small" type="danger"
                                >删除</el-button
                            >
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
```

## 自定义扩展

如果需要添加更多工具类，可以在 `global.css` 文件末尾添加：

```css
/* 自定义工具类 */
.my-custom-class {
    /* 自定义样式 */
}
```

## 注意事项

1. 全局样式会影响所有组件，请谨慎修改
2. 工具类命名遵循简洁明了的原则
3. 颜色值与 Element Plus 保持一致
4. 响应式断点设置为 768px
5. 所有样式都支持现代浏览器

## 浏览器兼容性

-   Chrome 60+
-   Firefox 55+
-   Safari 12+
-   Edge 79+

不支持 IE 浏览器。
