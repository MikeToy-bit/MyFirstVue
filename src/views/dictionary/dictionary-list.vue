<template>
    <div class="dictionary-container">
        <div class="header-actions">
            <el-input
                v-model="searchKeyword"
                placeholder="请输入关键词搜索"
                class="search-input"
                clearable
                @clear="filterNode"
                @input="filterNode"
            >
                <template #prefix>
                    <el-icon><Search /></el-icon>
                </template>
            </el-input>

            <el-select
                v-model="dictType"
                placeholder="字典类型"
                @change="loadDictionaryTree"
            >
                <el-option label="系统字典" value="SYSTEM" />
                <el-option label="业务字典" value="BUSINESS" />
            </el-select>

            <el-button type="primary" @click="handleAddRoot"
                >新增根节点</el-button
            >
            <el-button @click="expandAll">展开全部</el-button>
            <el-button @click="collapseAll">折叠全部</el-button>
            <el-button @click="refreshTree" type="success">刷新数据</el-button>
        </div>

        <el-card class="dictionary-tree-card">
            <div v-loading="loading" class="tree-container">
                <el-empty v-if="isEmpty" description="暂无数据" />

                <el-tree
                    v-else
                    ref="treeRef"
                    :data="treeData"
                    node-key="dictId"
                    :props="defaultProps"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    :filter-node-method="filterTreeNode"
                    @node-expand="handleNodeExpand"
                    @node-collapse="handleNodeExpand"
                    :current-node-key="currentNodeKey"
                >
                    <template #default="{ node, data }">
                        <div
                            class="custom-tree-node"
                            @mouseenter="hoveredNode = node"
                            @mouseleave="hoveredNode = null"
                        >
                            <div class="node-content">
                                <el-icon
                                    class="node-icon"
                                    :class="{
                                        'folder-icon': hasChildren(data),
                                        'file-icon': !hasChildren(data),
                                    }"
                                >
                                    <Folder v-if="hasChildren(data)" />
                                    <Document v-else />
                                </el-icon>
                                <span
                                    class="label"
                                    :class="{ disabled: data.status === 0 }"
                                >
                                    {{ node.label }}
                                </span>
                                <span class="code" :title="data.dictCode">
                                    ({{ data.dictCode }})
                                </span>
                            </div>

                            <div
                                class="node-actions"
                                v-show="hoveredNode === node"
                            >
                                <el-tooltip
                                    content="新增子节点"
                                    placement="top"
                                >
                                    <el-icon @click.stop="handleAdd(node, data)"
                                        ><Plus
                                    /></el-icon>
                                </el-tooltip>
                                <el-tooltip content="编辑" placement="top">
                                    <el-icon
                                        @click.stop="handleEdit(node, data)"
                                        ><Edit
                                    /></el-icon>
                                </el-tooltip>
                                <el-tooltip content="删除" placement="top">
                                    <el-icon
                                        @click.stop="handleDelete(node, data)"
                                        ><Delete
                                    /></el-icon>
                                </el-tooltip>
                                <el-tooltip content="查看" placement="top">
                                    <el-icon
                                        @click.stop="handleView(node, data)"
                                        ><View
                                    /></el-icon>
                                </el-tooltip>
                                <el-tooltip content="上移" placement="top">
                                    <el-icon
                                        @click.stop="handleMoveUp(node, data)"
                                        :class="{ disabled: !canMoveUp(node) }"
                                    >
                                        <ArrowUp />
                                    </el-icon>
                                </el-tooltip>
                                <el-tooltip content="下移" placement="top">
                                    <el-icon
                                        @click.stop="handleMoveDown(node, data)"
                                        :class="{
                                            disabled: !canMoveDown(node),
                                        }"
                                    >
                                        <ArrowDown />
                                    </el-icon>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
                </el-tree>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "../../utils/request";
import common from "../../utils/common";
import { useDictionaryStore } from "../../stores/dictionary";
import {
    Search,
    View,
    Plus,
    Edit,
    Delete,
    ArrowUp,
    ArrowDown,
    Folder,
    Document,
} from "@element-plus/icons-vue";

// 路由
const router = useRouter();
const route = useRoute();

// 使用字典store
const dictionaryStore = useDictionaryStore();

// 树形控件相关
const treeRef = ref(null);
const hoveredNode = ref(null);
const searchKeyword = ref("");
const currentNodeKey = ref(""); // 当前选中节点的key

// 从store获取数据和状态
const treeData = computed(() => dictionaryStore.treeData);
const loading = computed(() => dictionaryStore.loading);
const isEmpty = computed(() => dictionaryStore.isEmpty);
const dictType = computed({
    get: () => dictionaryStore.currentDictType,
    set: (value) => {
        dictionaryStore.setDictType(value);
        loadDictionaryTree();
    },
});

// 树形配置项
const defaultProps = {
    children: "children",
    label: "dictName",
};

// 加载数据字典树
const loadDictionaryTree = async () => {
    console.log("调用store加载字典树数据");
    return await dictionaryStore.loadDictionaryTree();
};

// 展开全部节点
const expandAll = () => {
    if (treeRef.value && treeData.value.length > 0) {
        treeData.value.forEach((node) => {
            treeRef.value.store.nodesMap[node.dictId].expand(true);
        });
    }
};

// 折叠全部节点
const collapseAll = () => {
    if (treeRef.value && treeData.value.length > 0) {
        treeData.value.forEach((node) => {
            treeRef.value.store.nodesMap[node.dictId].collapse();
        });
    }
};

// 过滤树节点
const filterTreeNode = (value, data) => {
    if (!value) return true;
    const searchValue = value.toLowerCase();
    return (
        data.dictName.toLowerCase().includes(searchValue) ||
        data.dictCode.toLowerCase().includes(searchValue) ||
        (data.dictDesc && data.dictDesc.toLowerCase().includes(searchValue))
    );
};

// 执行过滤
const filterNode = () => {
    treeRef.value?.filter(searchKeyword.value);
};

// 节点展开/折叠事件处理
const handleNodeExpand = () => {
    // 空函数，保留事件监听但不需要额外处理
};

// 检查节点是否可以上移
const canMoveUp = (node) => {
    if (!node.parent) return false;
    const siblings = node.parent.childNodes;
    const index = siblings.findIndex((n) => n === node);
    return index > 0;
};

// 检查节点是否可以下移
const canMoveDown = (node) => {
    if (!node.parent) return false;
    const siblings = node.parent.childNodes;
    const index = siblings.findIndex((n) => n === node);
    return index < siblings.length - 1;
};

// 处理新增根节点
const handleAddRoot = () => {
    router.push({
        path: "/main/dictionary-add",
        query: {
            parentId: null,
            dictType: dictType.value,
            dictLevel: 1,
        },
    });
};

// 处理添加子节点
const handleAdd = (node, data) => {
    router.push({
        path: "/main/dictionary-add",
        query: {
            parentId: data.dictId,
            parentCode: data.dictCode,
            parentName: data.dictName,
            dictType: data.dictType,
            dictLevel: data.dictLevel + 1,
        },
    });
};

// 处理编辑节点
const handleEdit = (node, data) => {
    router.push({
        path: "/main/dictionary-edit",
        query: {
            dictId: data.dictId,
            parentId: data.parentId,
        },
    });
};

// 处理查看节点
const handleView = (node, data) => {
    router.push({
        path: "/main/dictionary-view",
        query: { dictId: data.dictId },
    });
};

// 处理删除节点
const handleDelete = async (node, data) => {
    try {
        // 确认删除
        await common.showConfirm(
            `确定要删除字典 "${data.dictName}" 及其所有子节点吗？此操作不可恢复！`,
            "删除确认"
        );

        // 执行删除
        loading.value = true;
        const response = await request.delete(`/api/Dictionary/${data.dictId}`);

        if (response.data && response.data.success) {
            common.showMessage("删除成功", "success");

            // 从树中移除节点
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex((d) => d.dictId === data.dictId);
            children.splice(index, 1);
        } else {
            common.showMessage(response.data.message || "删除失败", "error");
        }
    } catch (error) {
        if (error !== "cancel") {
            console.error("删除失败", error);
            common.showMessage(
                "删除失败: " + (error.message || "未知错误"),
                "error"
            );
        }
    } finally {
        loading.value = false;
    }
};

// 处理节点上移
const handleMoveUp = async (node, data) => {
    if (!canMoveUp(node)) return;

    try {
        loading.value = true;
        const siblings = node.parent.childNodes;
        const index = siblings.findIndex((n) => n === node);
        const targetNode = siblings[index - 1];

        // 调用接口进行排序调整
        await request.post("/api/Dictionary/move", {
            dictId: data.dictId,
            targetOrder: targetNode.data.dictOrder,
            direction: "up",
        });

        // 前端更新节点顺序
        const parent = node.parent;
        const children = parent.data.children || parent.data;

        // 交换节点位置
        [children[index], children[index - 1]] = [
            children[index - 1],
            children[index],
        ];

        // 更新排序值
        const tempOrder = data.dictOrder;
        data.dictOrder = targetNode.data.dictOrder;
        targetNode.data.dictOrder = tempOrder;

        common.showMessage("上移成功", "success");
    } catch (error) {
        console.error("上移失败", error);
        common.showMessage(
            "上移失败: " + (error.message || "未知错误"),
            "error"
        );
    } finally {
        loading.value = false;
    }
};

// 处理节点下移
const handleMoveDown = async (node, data) => {
    if (!canMoveDown(node)) return;

    try {
        loading.value = true;
        const siblings = node.parent.childNodes;
        const index = siblings.findIndex((n) => n === node);
        const targetNode = siblings[index + 1];

        // 调用接口进行排序调整
        await request.post("/api/Dictionary/move", {
            dictId: data.dictId,
            targetOrder: targetNode.data.dictOrder,
            direction: "down",
        });

        // 前端更新节点顺序
        const parent = node.parent;
        const children = parent.data.children || parent.data;

        // 交换节点位置
        [children[index], children[index + 1]] = [
            children[index + 1],
            children[index],
        ];

        // 更新排序值
        const tempOrder = data.dictOrder;
        data.dictOrder = targetNode.data.dictOrder;
        targetNode.data.dictOrder = tempOrder;

        common.showMessage("下移成功", "success");
    } catch (error) {
        console.error("下移失败", error);
        common.showMessage(
            "下移失败: " + (error.message || "未知错误"),
            "error"
        );
    } finally {
        loading.value = false;
    }
};

// 检查节点是否有子节点
const hasChildren = (data) => {
    return data.children && data.children.length > 0;
};

// 当组件挂载时
onMounted(async () => {
    console.log("字典列表页面挂载");

    // 加载树数据
    await loadDictionaryTree();
});

// 手动刷新树数据
const refreshTree = async () => {
    await loadDictionaryTree();
};

// 处理新增节点
const handleNewNode = (nodeData) => {
    if (nodeData && nodeData.dictId) {
        // 获取父节点ID
        const parentId = nodeData.parentId;

        // 如果有父节点，先处理父节点
        if (parentId) {
            // 找到父节点
            const parent = dictionaryStore.findNodeById(
                dictionaryStore.treeData,
                parentId
            );

            if (parent) {
                // 确保父节点有children数组
                if (!parent.children) {
                    parent.children = [];
                }

                // 检查新节点是否已存在
                const existNode = parent.children.find(
                    (item) => item.dictId === nodeData.dictId
                );
                if (!existNode) {
                    // 添加到父节点的children中
                    parent.children.push(nodeData);
                }

                // 定位到新节点
                setTimeout(() => {
                    locateNode(nodeData.dictId);
                }, 200);
            }
        } else {
            // 根节点的处理
            const existNode = dictionaryStore.treeData.find(
                (item) => item.dictId === nodeData.dictId
            );
            if (!existNode) {
                // 添加到根节点列表
                dictionaryStore.treeData.push(nodeData);
            }

            // 定位到新节点
            setTimeout(() => {
                locateNode(nodeData.dictId);
            }, 200);
        }

        // 清除新节点数据
        dictionaryStore.clearNewNodeData();
    }
};

// 添加watch监听新节点变化
watch(
    () => dictionaryStore.newNodeData,
    (newVal) => {
        if (newVal) {
            //检测到新增节点，处理新增节点
            handleNewNode(newVal);
        }
    }
);

// 定位到指定节点
const locateNode = (nodeId) => {
    if (!nodeId || !treeRef.value) return;

    // 设置当前选中节点
    currentNodeKey.value = nodeId;
    treeRef.value.setCurrentKey(nodeId);

    // 确保所有父节点都展开
    const node = treeRef.value.getNode(nodeId);
    if (node && node.parent && node.parent.key !== undefined) {
        // 展开所有父节点
        let currentNode = node.parent;
        while (currentNode && currentNode.key !== undefined) {
            currentNode.expanded = true;
            currentNode = currentNode.parent;
        }
    }

    // 等待DOM更新后滚动到节点位置并高亮
    setTimeout(() => {
        const element = document.querySelector(
            `.el-tree-node[data-key="${nodeId}"]`
        );
        if (element) {
            // 滚动到元素位置
            element.scrollIntoView({ behavior: "smooth", block: "center" });

            // 添加高亮效果
            element.classList.add("node-highlight");

            // 3秒后移除高亮
            setTimeout(() => {
                element.classList.remove("node-highlight");
            }, 3000);
        }
    }, 100);
};
</script>

<style scoped>
.dictionary-container {
    padding: 20px;
}

.header-actions {
    display: flex;
    margin-bottom: 20px;
    gap: 15px;
    align-items: center;
}

.search-input {
    width: 300px;
}

.dictionary-tree-card {
    min-height: 500px;
}

.tree-container {
    min-height: 450px;
}

/* 删除之前的deep选择器，使用更直接的方式 */
/* 可以在这里添加基本的树节点样式 */
:deep(.el-tree-node__content) {
    padding: 2px 0;
    height: auto !important;
    min-height: 32px;
}

.custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 10px;
    transition: background-color 0.2s ease;
    border-radius: 4px;
}

.custom-tree-node:hover {
    background-color: #f5f7fa;
}

.node-content {
    display: flex;
    flex: 1;
    gap: 8px;
    overflow: hidden;
}

.label {
    font-weight: 500;
}

.disabled {
    color: #c0c4cc;
}

.code {
    color: #909399;
    font-size: 0.9em;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.node-actions {
    display: flex;
    gap: 8px;
    background-color: rgba(245, 247, 250, 0.8); /* 轻微透明背景 */
    padding: 2px 5px;
    border-radius: 4px;
}

.node-actions .el-icon {
    font-size: 16px;
    cursor: pointer;
    color: #606266;
    padding: 2px;
    border-radius: 3px;
    transition: all 0.2s ease;
}

.node-actions .el-icon:hover {
    color: #409eff;
    background-color: #ecf5ff;
    transform: scale(1.1);
}

.node-actions .el-icon.disabled {
    cursor: not-allowed;
    color: #c0c4cc;
}

.node-actions .el-icon.disabled:hover {
    color: #c0c4cc;
}

.node-icon {
    margin-right: 5px;
    font-size: 16px;
}

.folder-icon {
    color: #e6a23c;
}

.file-icon {
    color: #409eff;
}

/* 节点高亮动画 */
:deep(.node-highlight) {
    animation: highlight-pulse 3s ease-in-out;
}

@keyframes highlight-pulse {
    0% {
        background-color: rgba(64, 158, 255, 0.1);
    }
    25% {
        background-color: rgba(64, 158, 255, 0.3);
    }
    50% {
        background-color: rgba(64, 158, 255, 0.1);
    }
    75% {
        background-color: rgba(64, 158, 255, 0.3);
    }
    100% {
        background-color: transparent;
    }
}
</style>
