<template>
    <div>
        <el-row>
            <el-col :span="4">
                <el-card ref="orgCardRef" :style="{ height: orgCardRefHeight }" class="mr-2">
                    <el-input :prefix-icon="Search" v-model="search" placeholder="请输入内容搜索" class="mb-2" />
                    <el-tree ref="orgTreeRef" :data="treeData" :props="defaultProps" lazy :load="loadNode">

                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="20">
                <el-card ref="orgInfoCardRef" :style="{ height: orgInfoCardRefHeight }">

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import request from "@/utils/request";
import { Search } from "@element-plus/icons-vue";

const search = ref("");
const treeData = ref([]);
const defaultProps = ref({
    children: "children",
    label: "label",
    isLeaf: 'leaf'
});
const orgCardRef = ref(null);
const orgInfoCardRef = ref(null);
const orgCardRefHeight = ref("auto");
const orgInfoCardRefHeight = ref("auto");


const queryOrgTree = async (targetOrgMgCode) => {
    const response = await request.get("/api/org?targetOrgMgCode=" + targetOrgMgCode);
    console.log(response);
    if (response.success) {
        treeData.value = response.data;
    }
};


const loadNode = async (node, resolve) => {
    const response = await request.get("/api/org?targetOrgMgCode=" + node.data.id);
    console.log("response2", response);
    if (response.success) {
        resolve(response.data);
    }
};



// 动态计算表格卡片高度
const updateCardTableHeight = () => {
    const windowHeight = window.innerHeight;
    orgCardRefHeight.value = `${windowHeight - 120}px`;
    orgInfoCardRefHeight.value = `${windowHeight - 120}px`;

};

onMounted(() => {
    queryOrgTree("root");

    nextTick(() => {
        updateCardTableHeight();

        window.addEventListener("resize", updateCardTableHeight);
    });
});
</script>

<style scoped></style>