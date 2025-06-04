<template>
    <div class="icon-demo">
        <h3>Element Plus 图标使用示例</h3>

        <!-- 方式1: 直接使用组件标签 -->
        <div class="demo-section">
            <h4>1. 直接使用组件标签（推荐）</h4>
            <el-icon size="20" color="#409EFF"><Edit /></el-icon>
            <el-icon size="20" color="#67C23A"><Check /></el-icon>
            <el-icon size="20" color="#E6A23C"><Warning /></el-icon>
            <el-icon size="20" color="#F56C6C"><Close /></el-icon>
            <el-icon size="20" color="#909399"><Search /></el-icon>
        </div>

        <!-- 方式2: 在按钮中使用 -->
        <div class="demo-section">
            <h4>2. 在按钮中使用</h4>
            <el-button type="primary" :icon="Edit">编辑</el-button>
            <el-button type="success" :icon="Check">确认</el-button>
            <el-button type="warning" :icon="Warning">警告</el-button>
            <el-button type="danger" :icon="Delete">删除</el-button>
        </div>

        <!-- 方式3: 在菜单中使用 -->
        <div class="demo-section">
            <h4>3. 常用菜单图标</h4>
            <div class="icon-list">
                <div class="icon-item">
                    <el-icon><House /></el-icon>
                    <span>House</span>
                </div>
                <div class="icon-item">
                    <el-icon><User /></el-icon>
                    <span>User</span>
                </div>
                <div class="icon-item">
                    <el-icon><Setting /></el-icon>
                    <span>Setting</span>
                </div>
                <div class="icon-item">
                    <el-icon><DataLine /></el-icon>
                    <span>DataLine</span>
                </div>
                <div class="icon-item">
                    <el-icon><Document /></el-icon>
                    <span>Document</span>
                </div>
                <div class="icon-item">
                    <el-icon><Folder /></el-icon>
                    <span>Folder</span>
                </div>
                <div class="icon-item">
                    <el-icon><Message /></el-icon>
                    <span>Message</span>
                </div>
                <div class="icon-item">
                    <el-icon><Tools /></el-icon>
                    <span>Tools</span>
                </div>
            </div>
        </div>

        <!-- 方式4: 动态使用 -->
        <div class="demo-section">
            <h4>4. 动态图标切换</h4>
            <el-button @click="toggleIcon">
                <el-icon>
                    <component :is="currentIcon" />
                </el-icon>
                {{ iconNames[currentIconIndex] }}
            </el-button>
        </div>

        <!-- 常用图标列表 -->
        <div class="demo-section">
            <h4>5. 常用图标参考</h4>
            <div class="icon-reference">
                <div class="icon-category">
                    <h5>基础操作</h5>
                    <div class="icon-grid">
                        <div class="icon-item">
                            <el-icon><Plus /></el-icon>
                            <span>Plus</span>
                        </div>
                        <div class="icon-item">
                            <el-icon><Minus /></el-icon>
                            <span>Minus</span>
                        </div>
                        <div class="icon-item">
                            <el-icon><Edit /></el-icon>
                            <span>Edit</span>
                        </div>
                        <div class="icon-item">
                            <el-icon><Delete /></el-icon>
                            <span>Delete</span>
                        </div>
                        <div class="icon-item">
                            <el-icon><Search /></el-icon>
                            <span>Search</span>
                        </div>
                        <div class="icon-item">
                            <el-icon><Refresh /></el-icon>
                            <span>Refresh</span>
                        </div>
                    </div>
                </div>

                <div class="icon-category">
                    <h5>箭头方向</h5>
                    <div class="icon-grid">
                        <div class="icon-item">
                            <el-icon><ArrowLeft /></el-icon>
                            <span>ArrowLeft</span>
                        </div>
                        <div class="icon-item">
                            <el-icon><ArrowRight /></el-icon>
                            <span>ArrowRight</span>
                        </div>
                        <div class="icon-item">
                            <el-icon><ArrowUp /></el-icon>
                            <span>ArrowUp</span>
                        </div>
                        <div class="icon-item">
                            <el-icon><ArrowDown /></el-icon>
                            <span>ArrowDown</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

// 动态图标切换示例
const icons = ["Star", "StarFilled", "Heart", "Like"];
const iconNames = ["空心星", "实心星", "心形", "点赞"];
const currentIconIndex = ref(0);
const currentIcon = ref(icons[0]);

const toggleIcon = () => {
    currentIconIndex.value = (currentIconIndex.value + 1) % icons.length;
    currentIcon.value = icons[currentIconIndex.value];
};
</script>

<style scoped>
.icon-demo {
    padding: 20px;
    max-width: 800px;
}

.demo-section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
}

.demo-section h4 {
    margin-top: 0;
    color: #409eff;
}

.icon-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    min-width: 80px;
    transition: all 0.3s;
}

.icon-item:hover {
    background-color: #f5f7fa;
    border-color: #409eff;
}

.icon-item span {
    margin-top: 5px;
    font-size: 12px;
    color: #666;
}

.icon-reference {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.icon-category h5 {
    margin: 0 0 10px 0;
    color: #67c23a;
}

.icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
}

.el-icon {
    font-size: 20px;
}

.el-button {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>
