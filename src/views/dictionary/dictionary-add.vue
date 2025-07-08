<template>
    <div class="dictionary-form-container">
        <el-page-header @back="goBack" :title="isChild ? '新增子节点' : '新增根节点'" />

        <el-card class="dictionary-form-card">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" v-loading="loading">
                <!-- 上级字典信息 -->
                <el-form-item v-if="isChild" label="上级节点" class="parent-info">
                    <div class="parent-info-content">
                        <div class="parent-item">
                            <span class="label">名称:</span>
                            <span class="value">{{ parentName }}</span>
                        </div>
                        <div class="parent-item">
                            <span class="label">编码:</span>
                            <span class="value">{{ parentCode }}</span>
                        </div>
                    </div>
                </el-form-item>

                <!-- 字典类型 -->
                <el-form-item label="字典类型" prop="dictType">
                    <el-select v-model="formData.dictType" placeholder="请选择字典类型" :disabled="!!parentId">
                        <el-option label="系统字典" value="SYSTEM" />
                        <el-option label="业务字典" value="BUSINESS" />
                    </el-select>
                </el-form-item>

                <!-- 字典名称 -->
                <el-form-item label="字典名称" prop="dictName">
                    <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
                </el-form-item>

                <!-- 字典编码 -->
                <el-form-item label="字典编码" prop="dictCode">
                    <el-input v-model="formData.dictCode" placeholder="请输入字典编码" :maxlength="50" />
                </el-form-item>

                <!-- 字典值 -->
                <el-form-item label="字典值" prop="dictValue">
                    <el-input v-model="formData.dictValue" placeholder="请输入字典值" />
                    <div class="form-item-tip">
                        该字段可选，用于存储实际业务值
                    </div>
                </el-form-item>

                <!-- 排序 -->
                <el-form-item label="排序" prop="dictOrder">
                    <el-input-number v-model="formData.dictOrder" :min="0" :max="9999" placeholder="请输入排序值" />
                    <div class="form-item-tip">数值越小排序越靠前</div>
                </el-form-item>

                <!-- 状态 -->
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 描述 -->
                <el-form-item label="描述" prop="dictDesc">
                    <el-input type="textarea" v-model="formData.dictDesc" placeholder="请输入描述" :maxlength="200" :rows="4"
                        show-word-limit />
                </el-form-item>

                <!-- 按钮组 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm">保存</el-button>
                    <el-button @click="resetForm">重置</el-button>
                    <el-button @click="goBack">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "../../utils/request";
import common from "../../utils/common";
import { useDictionaryStore } from "../../stores/dictionary";

// 路由
const router = useRouter();
const route = useRoute();

// 状态
const formRef = ref(null);
const loading = ref(false);

// 使用字典store
const dictionaryStore = useDictionaryStore();

// 从路由参数获取上级节点信息
const parentId = route.query.parentId || null;
const parentCode = route.query.parentCode || "";
const parentName = route.query.parentName || "";
const dictType = route.query.dictType || "SYSTEM";
const dictLevel = parseInt(route.query.dictLevel || "1");

// 是否为子节点
const isChild = computed(() => !!parentId);

// 表单数据
const formData = reactive({
    dictName: "",
    dictCode: "",
    dictValue: "",
    dictOrder: 0,
    dictType: dictType,
    dictLevel: dictLevel,
    parentId: parentId,
    status: 1,
    dictDesc: "",
});

// 验证规则
const rules = {
    dictName: [
        { required: true, message: "请输入字典名称", trigger: "blur" },
        { max: 50, message: "字典名称不能超过50个字符", trigger: "blur" },
    ],
    dictCode: [
        { required: true, message: "请输入字典编码", trigger: "blur" },
        { max: 50, message: "字典编码不能超过50个字符", trigger: "blur" },
        {
            pattern: /^[A-Z0-9_]+$/,
            message: "字典编码只能包含大写字母、数字和下划线",
            trigger: "blur",
        },
    ],
    dictType: [
        { required: true, message: "请选择字典类型", trigger: "change" },
    ],
    dictOrder: [{ required: true, message: "请输入排序值", trigger: "blur" }],
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

// 返回列表页
const goBack = () => {
    router.push("/main/dictionary-list");
};

// 提交表单
const submitForm = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();
        loading.value = true;

        const response = await request.post("/api/Dictionary", formData);

        if (response.success) {
            common.showMessage("添加成功", "success");

            // 获取新增节点的信息
            const newNode = response.data;

            // 确保数据有效
            if (newNode && newNode.dictId) {
                // 设置字典类型
                dictionaryStore.setDictType(formData.dictType);

                // 添加新节点数据到Store中并添加到树中
                dictionaryStore.addNewNode(newNode, formData.parentId);
            }

            // 跳转回列表页面
            router.push("/main/dictionary-list");
        } else {
            common.showMessage(response.message || "添加失败", "error");
        }
    } catch (error) {
        console.error("表单提交失败", error);
        common.showMessage("表单验证失败，请检查输入", "error");
    } finally {
        loading.value = false;
    }
};

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
};

// 生命周期钩子
onMounted(() => {
    // 可以在这里加载一些初始化数据
});
</script>

<style scoped>
.dictionary-form-container {
    padding: 10px;
    color: black;
}

.dictionary-form-card {
    margin-top: 20px;
}

.parent-info-content {
    display: flex;
    gap: 20px;
}

.parent-item {
    display: flex;
    align-items: center;
}

.parent-item .label {
    color: #606266;
    margin-right: 5px;
}

.parent-item .value {
    font-weight: 500;
}

.form-item-tip {
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
    margin-top: 5px;
}
</style>
