import { defineStore } from "pinia";
import { ref, computed } from "vue";
import request from "../utils/request";

// 定义字典数据的存储
export const useDictionaryStore = defineStore("dictionary", () => {
    // 树数据
    const treeData = ref([]);

    // 当前选中字典类型
    const currentDictType = ref("SYSTEM");

    // 加载状态
    const loading = ref(false);

    // 新增节点的完整数据
    const newNodeData = ref(null);

    // 计算属性：树是否为空
    const isEmpty = computed(() => treeData.value.length === 0);

    // 设置字典类型
    const setDictType = (type) => {
        currentDictType.value = type;
    };

    // 加载字典树数据
    const loadDictionaryTree = async () => {
        loading.value = true;

        try {
            const response = await request.get(
                `/api/Dictionary/tree/${currentDictType.value}`
            );

            if (response.success) {
                treeData.value = response.data;
                return true;
            } else {
                console.error("[Store] 字典树数据加载失败");
                treeData.value = [];
                return false;
            }
        } catch (error) {
            console.error("[Store] 加载数据字典树出错");
            treeData.value = [];
            return false;
        } finally {
            loading.value = false;
        }
    };

    // 设置新节点数据
    const addNewNode = (node, parentId) => {
        if (!node || !node.dictId) return;

        // 只保存新节点数据，不进行添加操作
        newNodeData.value = {
            ...node,
            parentId,
        };
    };

    // 清除新节点数据
    const clearNewNodeData = () => {
        newNodeData.value = null;
    };

    // 查找节点
    const findNodeById = (nodes, id) => {
        if (!nodes || !Array.isArray(nodes)) return null;

        for (const node of nodes) {
            if (node.dictId === id) {
                return node;
            }

            if (node.children && node.children.length) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }

        return null;
    };

    // 暴露状态和方法
    return {
        treeData,
        currentDictType,
        loading,
        isEmpty,
        newNodeData,
        setDictType,
        loadDictionaryTree,
        addNewNode,
        clearNewNodeData,
        findNodeById,
    };
});
