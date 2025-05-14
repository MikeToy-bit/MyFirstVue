<template>
    <div class="settings">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>常规设置</span>
                </div>
            </template>
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-form-item label="系统名称" prop="systemName">
                    <el-input
                        v-model="form.systemName"
                        placeholder="请输入系统名称"
                    />
                </el-form-item>
                <el-form-item label="系统Logo" prop="logo">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                    >
                        <img v-if="form.logo" :src="form.logo" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="系统描述" prop="description">
                    <el-input
                        v-model="form.description"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入系统描述"
                    />
                </el-form-item>
                <el-form-item label="备案信息" prop="icp">
                    <el-input v-model="form.icp" placeholder="请输入备案信息" />
                </el-form-item>
                <el-form-item label="版权信息" prop="copyright">
                    <el-input
                        v-model="form.copyright"
                        placeholder="请输入版权信息"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit"
                        >保存</el-button
                    >
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

export default {
    components: {
        Plus,
    },
    setup() {
        const formRef = ref(null);
        const form = reactive({
            systemName: "管理系统",
            logo: "",
            description: "这是一个管理系统",
            icp: "ICP备XXXXXXXX号",
            copyright: "© 2024 管理系统",
        });

        const rules = {
            systemName: [
                { required: true, message: "请输入系统名称", trigger: "blur" },
            ],
            description: [
                { required: true, message: "请输入系统描述", trigger: "blur" },
            ],
        };

        const beforeUpload = (file) => {
            // 模拟上传
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                form.logo = reader.result;
            };
            return false;
        };

        const handleSubmit = async () => {
            if (!formRef.value) return;

            try {
                await formRef.value.validate();
                // 模拟提交
                ElMessage.success("保存成功");
            } catch (error) {
                console.error("表单验证失败:", error);
            }
        };

        const handleReset = () => {
            if (formRef.value) {
                formRef.value.resetFields();
            }
        };

        return {
            formRef,
            form,
            rules,
            beforeUpload,
            handleSubmit,
            handleReset,
        };
    },
};
</script>

<style scoped>
.settings {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
}

.avatar-uploader:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    line-height: 178px;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

:deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
    padding: 20px;
}

:deep(.el-form) {
    max-width: 600px;
    margin: 0 auto;
}
</style>
