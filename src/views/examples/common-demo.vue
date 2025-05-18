<template>
    <div class="demo-container">
        <h1>通用工具库与组件示例</h1>
        <el-tabs type="border-card">
            <!-- 工具库示例标签页 -->
            <el-tab-pane label="工具库示例">
                <el-card class="demo-section">
                    <template #header>
                        <h3>日期时间工具</h3>
                    </template>
                    <el-button @click="showDate">显示当前时间</el-button>
                    <el-button @click="showDateFormat"
                        >不同格式的日期</el-button
                    >
                    <el-button @click="showRelativeDate">相对日期</el-button>
                    <el-button @click="showDateDiff">日期差值</el-button>
                    <el-button @click="showTimeAgo">多久之前/之后</el-button>
                </el-card>

                <el-card class="demo-section">
                    <template #header>
                        <h3>Loading效果</h3>
                    </template>
                    <el-button @click="showGlobalLoading"
                        >全局Loading</el-button
                    >
                    <el-button @click="showCustomLoading"
                        >自定义Loading</el-button
                    >
                </el-card>

                <el-card class="demo-section">
                    <template #header>
                        <h3>消息通知</h3>
                    </template>
                    <div class="button-group">
                        <el-button type="success" @click="showSuccessMessage"
                            >成功消息</el-button
                        >
                        <el-button type="warning" @click="showWarningMessage"
                            >警告消息</el-button
                        >
                        <el-button type="info" @click="showInfoMessage"
                            >信息消息</el-button
                        >
                        <el-button type="danger" @click="showErrorMessage"
                            >错误消息</el-button
                        >
                    </div>
                    <div class="button-group">
                        <el-button type="success" @click="showSuccessNotify"
                            >成功通知</el-button
                        >
                        <el-button type="warning" @click="showWarningNotify"
                            >警告通知</el-button
                        >
                        <el-button type="info" @click="showInfoNotify"
                            >信息通知</el-button
                        >
                        <el-button type="danger" @click="showErrorNotify"
                            >错误通知</el-button
                        >
                    </div>
                    <el-button @click="showConfirmDialog">确认对话框</el-button>
                </el-card>

                <el-card class="demo-section">
                    <template #header>
                        <h3>AJAX请求示例</h3>
                    </template>
                    <el-button @click="makeNormalRequest"
                        >普通请求 (有Loading)</el-button
                    >
                    <el-button @click="makeNoLoadingRequest"
                        >无Loading请求</el-button
                    >
                    <el-button @click="makeErrorRequest">错误请求</el-button>
                </el-card>

                <el-card class="demo-section">
                    <template #header>
                        <h3>工具函数示例</h3>
                    </template>
                    <el-button @click="testDebounce">防抖函数</el-button>
                    <el-button @click="testThrottle">节流函数</el-button>
                    <el-button @click="checkEmpty">检查空值</el-button>
                </el-card>
            </el-tab-pane>

            <!-- 表单组件标签页 -->
            <el-tab-pane label="表单组件">
                <el-card class="demo-section">
                    <template #header>
                        <h3>基础表单</h3>
                    </template>
                    <el-form
                        :model="form"
                        label-width="120px"
                        :rules="formRules"
                        ref="formRef"
                    >
                        <el-form-item label="用户名" prop="username">
                            <el-input
                                v-model="form.username"
                                placeholder="请输入用户名"
                            />
                        </el-form-item>

                        <el-form-item label="密码" prop="password">
                            <el-input
                                v-model="form.password"
                                type="password"
                                placeholder="请输入密码"
                                show-password
                            />
                        </el-form-item>

                        <el-form-item label="性别" prop="gender">
                            <el-radio-group v-model="form.gender">
                                <el-radio label="male">男</el-radio>
                                <el-radio label="female">女</el-radio>
                                <el-radio label="other">其他</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="年龄" prop="age">
                            <el-input-number
                                v-model="form.age"
                                :min="0"
                                :max="120"
                            />
                        </el-form-item>

                        <el-form-item label="出生日期" prop="birthdate">
                            <el-date-picker
                                v-model="form.birthdate"
                                type="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                            />
                        </el-form-item>

                        <el-form-item label="职业" prop="occupation">
                            <el-select
                                v-model="form.occupation"
                                placeholder="请选择职业"
                            >
                                <el-option
                                    v-for="item in occupationOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="兴趣爱好" prop="hobbies">
                            <el-checkbox-group v-model="form.hobbies">
                                <el-checkbox label="读书">读书</el-checkbox>
                                <el-checkbox label="运动">运动</el-checkbox>
                                <el-checkbox label="音乐">音乐</el-checkbox>
                                <el-checkbox label="电影">电影</el-checkbox>
                                <el-checkbox label="旅行">旅行</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item label="技能评级" prop="skillLevel">
                            <el-slider
                                v-model="form.skillLevel"
                                :step="10"
                                show-stops
                                :marks="sliderMarks"
                            />
                        </el-form-item>

                        <el-form-item label="个人简介" prop="description">
                            <el-input
                                v-model="form.description"
                                type="textarea"
                                rows="4"
                                placeholder="请输入个人简介"
                            />
                        </el-form-item>

                        <el-form-item label="接收通知" prop="notifications">
                            <el-switch v-model="form.notifications" />
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="submitForm"
                                >提交</el-button
                            >
                            <el-button @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-tab-pane>

            <!-- 表格组件标签页 -->
            <el-tab-pane label="表格组件">
                <el-card class="demo-section">
                    <template #header>
                        <div class="table-header">
                            <h3>用户列表</h3>
                            <div class="table-actions">
                                <el-input
                                    v-model="tableSearch"
                                    placeholder="搜索..."
                                    style="width: 200px"
                                    clearable
                                />
                                <el-button type="primary" @click="addUserRow"
                                    >添加用户</el-button
                                >
                            </div>
                        </div>
                    </template>

                    <el-table
                        :data="filteredTableData"
                        border
                        stripe
                        style="width: 100%"
                    >
                        <el-table-column type="selection" width="55" />
                        <el-table-column type="index" label="#" width="60" />
                        <el-table-column
                            prop="username"
                            label="用户名"
                            sortable
                        />
                        <el-table-column prop="gender" label="性别">
                            <template #default="scope">
                                <el-tag
                                    :type="
                                        scope.row.gender === 'male'
                                            ? 'primary'
                                            : scope.row.gender === 'female'
                                            ? 'success'
                                            : 'info'
                                    "
                                >
                                    {{
                                        scope.row.gender === "male"
                                            ? "男"
                                            : scope.row.gender === "female"
                                            ? "女"
                                            : "其他"
                                    }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="age" label="年龄" sortable />
                        <el-table-column prop="occupation" label="职业" />
                        <el-table-column prop="status" label="状态">
                            <template #default="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    :active-value="true"
                                    :inactive-value="false"
                                    @change="changeUserStatus(scope.row)"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template #default="scope">
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="
                                        editUserRow(scope.row, scope.$index)
                                    "
                                    >编辑</el-button
                                >
                                <el-button
                                    type="danger"
                                    size="small"
                                    @click="deleteUserRow(scope.$index)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagination-container">
                        <el-pagination
                            v-model:currentPage="currentPage"
                            v-model:page-size="pageSize"
                            :page-sizes="[5, 10, 20, 50]"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.length"
                        />
                    </div>
                </el-card>
            </el-tab-pane>

            <!-- 上传组件标签页 -->
            <el-tab-pane label="上传组件">
                <el-card class="demo-section">
                    <template #header>
                        <h3>图片上传</h3>
                    </template>

                    <!-- 头像上传 -->
                    <div class="upload-section">
                        <h4>头像上传</h4>
                        <el-upload
                            class="avatar-uploader"
                            action="#"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleAvatarChange"
                        >
                            <img
                                v-if="avatarUrl"
                                :src="avatarUrl"
                                class="avatar"
                            />
                            <el-icon v-else class="avatar-uploader-icon"
                                ><Plus
                            /></el-icon>
                        </el-upload>
                        <div class="upload-tip">
                            点击上传头像（预览模式，不会实际上传）
                        </div>
                    </div>

                    <!-- 多图片上传 -->
                    <div class="upload-section">
                        <h4>多图片上传</h4>
                        <el-upload
                            action="#"
                            list-type="picture-card"
                            :auto-upload="false"
                            :on-preview="handlePictureCardPreview"
                            :on-change="handleMultiImagesChange"
                            :on-remove="handleRemove"
                        >
                            <el-icon><Plus /></el-icon>
                        </el-upload>
                        <el-dialog v-model="dialogVisible">
                            <img
                                w-full
                                :src="dialogImageUrl"
                                alt="Preview Image"
                            />
                        </el-dialog>
                        <div class="upload-tip">
                            点击上传多张图片（预览模式，不会实际上传）
                        </div>
                    </div>

                    <!-- 文件上传 -->
                    <div class="upload-section">
                        <h4>文件上传</h4>
                        <el-upload
                            class="file-uploader"
                            action="#"
                            :auto-upload="false"
                            :on-change="handleFileChange"
                            multiple
                        >
                            <el-button type="primary">选择文件</el-button>
                            <template #tip>
                                <div class="upload-tip">
                                    预览模式，不会实际上传
                                </div>
                            </template>
                        </el-upload>
                    </div>

                    <!-- 拖拽上传 -->
                    <div class="upload-section">
                        <h4>拖拽上传</h4>
                        <el-upload
                            class="upload-drag"
                            drag
                            action="#"
                            multiple
                            :auto-upload="false"
                            :on-change="handleDragFileChange"
                        >
                            <el-icon class="el-icon--upload"
                                ><Upload
                            /></el-icon>
                            <div class="el-upload__text">
                                拖拽文件到此处或 <em>点击上传</em>
                            </div>
                            <template #tip>
                                <div class="upload-tip">
                                    预览模式，不会实际上传
                                </div>
                            </template>
                        </el-upload>
                    </div>
                </el-card>
            </el-tab-pane>

            <!-- 其他常用组件标签页 -->
            <el-tab-pane label="其他常用组件">
                <el-card class="demo-section">
                    <template #header>
                        <h3>按钮组件</h3>
                    </template>

                    <div class="component-demo-section">
                        <h4>基础按钮</h4>
                        <div class="button-group">
                            <el-button>默认按钮</el-button>
                            <el-button type="primary">主要按钮</el-button>
                            <el-button type="success">成功按钮</el-button>
                            <el-button type="info">信息按钮</el-button>
                            <el-button type="warning">警告按钮</el-button>
                            <el-button type="danger">危险按钮</el-button>
                        </div>
                    </div>

                    <div class="component-demo-section">
                        <h4>朴素按钮</h4>
                        <div class="button-group">
                            <el-button plain>朴素按钮</el-button>
                            <el-button type="primary" plain>主要按钮</el-button>
                            <el-button type="success" plain>成功按钮</el-button>
                            <el-button type="info" plain>信息按钮</el-button>
                            <el-button type="warning" plain>警告按钮</el-button>
                            <el-button type="danger" plain>危险按钮</el-button>
                        </div>
                    </div>

                    <div class="component-demo-section">
                        <h4>圆角按钮</h4>
                        <div class="button-group">
                            <el-button round>圆角按钮</el-button>
                            <el-button type="primary" round>主要按钮</el-button>
                            <el-button type="success" round>成功按钮</el-button>
                            <el-button type="info" round>信息按钮</el-button>
                            <el-button type="warning" round>警告按钮</el-button>
                            <el-button type="danger" round>危险按钮</el-button>
                        </div>
                    </div>

                    <div class="component-demo-section">
                        <h4>按钮尺寸</h4>
                        <div class="button-group">
                            <el-button size="large" type="primary"
                                >大按钮</el-button
                            >
                            <el-button type="primary">默认按钮</el-button>
                            <el-button size="small" type="primary"
                                >小按钮</el-button
                            >
                        </div>
                    </div>

                    <div class="component-demo-section">
                        <h4>图标按钮</h4>
                        <div class="button-group">
                            <el-button type="primary" :icon="Search"
                                >搜索</el-button
                            >
                            <el-button type="info" :icon="Edit">编辑</el-button>
                            <el-button type="success" :icon="Check"
                                >确认</el-button
                            >
                            <el-button type="warning" :icon="Star"
                                >收藏</el-button
                            >
                            <el-button type="danger" :icon="Delete"
                                >删除</el-button
                            >
                        </div>
                    </div>
                </el-card>

                <el-card class="demo-section">
                    <template #header>
                        <h3>弹窗组件</h3>
                    </template>

                    <div class="component-demo-section">
                        <h4>Dialog对话框</h4>
                        <el-button
                            type="primary"
                            @click="dialogFormVisible = true"
                            >打开对话框</el-button
                        >

                        <el-dialog
                            v-model="dialogFormVisible"
                            title="用户信息"
                            width="500px"
                        >
                            <el-form :model="dialogForm" label-width="100px">
                                <el-form-item label="用户名">
                                    <el-input
                                        v-model="dialogForm.username"
                                        autocomplete="off"
                                    />
                                </el-form-item>
                                <el-form-item label="联系方式">
                                    <el-input
                                        v-model="dialogForm.contact"
                                        autocomplete="off"
                                    />
                                </el-form-item>
                                <el-form-item label="居住地址">
                                    <el-input
                                        v-model="dialogForm.address"
                                        type="textarea"
                                    />
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button
                                        @click="dialogFormVisible = false"
                                        >取消</el-button
                                    >
                                    <el-button
                                        type="primary"
                                        @click="dialogFormVisible = false"
                                        >确认</el-button
                                    >
                                </span>
                            </template>
                        </el-dialog>
                    </div>

                    <div class="component-demo-section">
                        <h4>Drawer抽屉</h4>
                        <el-button type="primary" @click="drawerVisible = true"
                            >打开抽屉</el-button
                        >

                        <el-drawer
                            v-model="drawerVisible"
                            title="我是抽屉标题"
                            :with-header="true"
                        >
                            <div style="padding: 20px">
                                <p>这是一个抽屉示例内容。</p>
                                <p>抽屉可以从屏幕边缘滑出，呈现更多内容。</p>
                            </div>
                        </el-drawer>
                    </div>
                </el-card>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import request from "../../utils/request";
// 直接导入common.js，在组件中使用
import common from "../../utils/common";
import {
    Plus,
    Upload,
    Search,
    Edit,
    Check,
    Star,
    Delete,
} from "@element-plus/icons-vue";

// 获取组件实例，用于访问全局属性
const { proxy } = getCurrentInstance();

// ------------ 日期时间演示 ------------
const showDate = () => {
    const now = common.getNow();
    common.showMessage(`当前时间: ${now}`);
};

const showDateFormat = () => {
    const date = new Date();
    const format1 = common.formatDate(date, "YYYY-MM-DD");
    const format2 = common.formatDate(date, "YYYY年MM月DD日");
    const format3 = common.formatDate(date, "HH:mm:ss");
    const format4 = common.formatDate(date, "MM/DD/YY hh:mm a");

    common.showNotification(
        "日期格式化示例",
        `标准格式: ${format1}<br>
        中文格式: ${format2}<br>
        时间格式: ${format3}<br>
        美式格式: ${format4}`,
        "info",
        { dangerouslyUseHTMLString: true }
    );
};

const showRelativeDate = () => {
    const yesterday = common.getRelativeDate(-1, "day");
    const tomorrow = common.getRelativeDate(1, "day");
    const nextMonth = common.getRelativeDate(1, "month");
    const lastYear = common.getRelativeDate(-1, "year");

    common.showNotification(
        "相对日期示例",
        `昨天: ${yesterday}<br>
        明天: ${tomorrow}<br>
        下个月: ${nextMonth}<br>
        去年: ${lastYear}`,
        "info",
        { dangerouslyUseHTMLString: true }
    );
};

const showDateDiff = () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date();

    const diffDays = common.dateDiff(date1, date2, "day");
    const diffMonths = common.dateDiff(date1, date2, "month");
    const diffYears = common.dateDiff(date1, date2, "year");

    common.showNotification(
        "日期差值示例",
        `与2023-01-01相差:<br>
        ${diffDays}天<br>
        ${diffMonths}个月<br>
        ${diffYears}年`,
        "info",
        { dangerouslyUseHTMLString: true }
    );
};

const showTimeAgo = () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    common.showNotification(
        "时间前后示例",
        `5分钟前: ${common.formatTimeAgo(fiveMinutesAgo)}<br>
        3小时后: ${common.formatTimeAgo(threeHoursLater)}<br>
        2天前: ${common.formatTimeAgo(twoDaysAgo)}`,
        "info",
        { dangerouslyUseHTMLString: true }
    );
};

// ------------ Loading演示 ------------
const showGlobalLoading = () => {
    common.showLoading("demo", "全局Loading测试...");
    setTimeout(() => {
        common.hideLoading("demo");
        common.showMessage("Loading已关闭", "success");
    }, 2000);
};

const showCustomLoading = () => {
    const loading = common.showLoading("custom", "自定义Loading...", {
        background: "rgba(0, 0, 0, 0.8)",
        spinner: "el-icon-loading",
    });

    setTimeout(() => {
        loading.close();
        common.showMessage("自定义Loading已关闭", "success");
    }, 2000);
};

// ------------ 消息通知演示 ------------
const showSuccessMessage = () => common.showMessage("操作成功！", "success");
const showWarningMessage = () => common.showMessage("请注意！", "warning");
const showInfoMessage = () => common.showMessage("提示信息", "info");
const showErrorMessage = () => common.showMessage("发生错误！", "error");

const showSuccessNotify = () =>
    common.showNotification("成功", "操作已完成", "success");
const showWarningNotify = () =>
    common.showNotification("警告", "请注意以下事项", "warning");
const showInfoNotify = () =>
    common.showNotification("信息", "这是一条提示信息", "info");
const showErrorNotify = () =>
    common.showNotification("错误", "操作失败", "error");

const showConfirmDialog = () => {
    common
        .showConfirm("确定要执行此操作吗？", "确认操作")
        .then(() => {
            common.showMessage("您确认了操作", "success");
        })
        .catch(() => {
            common.showMessage("您取消了操作", "info");
        });
};

// ------------ AJAX请求示例 ------------
const makeNormalRequest = async () => {
    try {
        // 请求会自动显示loading
        const res = await request.get("/api/user/getMenusByToken");
        common.showMessage("请求成功", "success");
        console.log("请求结果:", res);
    } catch (error) {
        // 错误处理在请求拦截器中已经完成
        console.error("请求失败:", error);
    }
};

const makeNoLoadingRequest = async () => {
    try {
        // 禁用loading
        const res = await request.get("/api/user/getMenusByToken", {
            showLoading: false,
        });
        common.showMessage("无loading请求成功", "success");
        console.log("无loading请求结果:", res);
    } catch (error) {
        console.error("请求失败:", error);
    }
};

const makeErrorRequest = async () => {
    try {
        // 故意请求一个不存在的接口
        await request.get("/api/non-existent-endpoint");
    } catch (error) {
        // 错误处理在请求拦截器中已经完成
        console.error("预期的错误:", error);
    }
};

// ------------ 工具函数演示 ------------
const testDebounce = common.debounce(() => {
    common.showMessage(
        "防抖函数触发了！只会在停止点击300ms后执行一次",
        "success"
    );
}, 300);

const throttle = common.throttle(() => {
    common.showMessage(
        "节流函数触发了！无论点击多快，每300ms最多执行一次",
        "warning"
    );
}, 300);

const testThrottle = () => throttle();

const checkEmpty = () => {
    const testCases = [
        { value: null, name: "null" },
        { value: undefined, name: "undefined" },
        { value: "", name: "空字符串" },
        { value: " ", name: "空格字符串" },
        { value: [], name: "空数组" },
        { value: {}, name: "空对象" },
        { value: 0, name: "数字0" },
        { value: false, name: "false" },
        { value: "hello", name: "非空字符串" },
    ];

    const results = testCases
        .map(
            (item) =>
                `${item.name}: ${
                    common.isEmpty(item.value) ? "为空" : "不为空"
                }`
        )
        .join("<br>");

    common.showNotification("空值检查结果", results, "info", {
        dangerouslyUseHTMLString: true,
        duration: 6000,
    });
};

// ------------ 表单相关 ------------
// 表单数据
const formRef = ref(null);
const form = reactive({
    username: "",
    password: "",
    gender: "male",
    age: 25,
    birthdate: "",
    occupation: "",
    hobbies: [],
    skillLevel: 50,
    description: "",
    notifications: true,
});

// 表单验证规则
const formRules = {
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 20, message: "长度在3-20个字符之间", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, message: "密码长度不能小于6个字符", trigger: "blur" },
    ],
    gender: [{ required: true, message: "请选择性别", trigger: "change" }],
    birthdate: [
        { required: true, message: "请选择出生日期", trigger: "change" },
    ],
    occupation: [{ required: true, message: "请选择职业", trigger: "change" }],
};

// 职业选项
const occupationOptions = [
    { value: "developer", label: "开发者" },
    { value: "designer", label: "设计师" },
    { value: "manager", label: "管理者" },
    { value: "student", label: "学生" },
    { value: "teacher", label: "教师" },
    { value: "other", label: "其他" },
];

// Slider标记
const sliderMarks = {
    0: "初学者",
    50: "中级",
    100: "专家",
};

// 提交表单
const submitForm = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();
        common.showLoading("formSubmit", "正在提交...");

        // 模拟API请求延迟
        setTimeout(() => {
            common.hideLoading("formSubmit");
            common.showMessage("表单提交成功", "success");
            console.log("表单数据:", form);
        }, 1000);
    } catch (error) {
        common.showMessage("表单验证失败，请检查输入", "error");
    }
};

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
};

// ------------ 表格相关 ------------
// 表格数据
const tableData = ref([
    {
        id: 1,
        username: "张三",
        gender: "male",
        age: 28,
        occupation: "开发者",
        status: true,
    },
    {
        id: 2,
        username: "李四",
        gender: "female",
        age: 32,
        occupation: "设计师",
        status: true,
    },
    {
        id: 3,
        username: "王五",
        gender: "male",
        age: 45,
        occupation: "管理者",
        status: false,
    },
    {
        id: 4,
        username: "赵六",
        gender: "other",
        age: 24,
        occupation: "学生",
        status: true,
    },
    {
        id: 5,
        username: "钱七",
        gender: "female",
        age: 36,
        occupation: "教师",
        status: true,
    },
]);

// 表格搜索
const tableSearch = ref("");
const filteredTableData = computed(() => {
    if (!tableSearch.value) return tableData.value;

    return tableData.value.filter((data) => {
        return Object.keys(data).some((key) => {
            if (typeof data[key] === "string") {
                return data[key]
                    .toLowerCase()
                    .includes(tableSearch.value.toLowerCase());
            }
            if (typeof data[key] === "number") {
                return data[key].toString().includes(tableSearch.value);
            }
            return false;
        });
    });
});

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 表格操作
const addUserRow = () => {
    const newUser = {
        id: tableData.value.length + 1,
        username: `新用户${tableData.value.length + 1}`,
        gender: "male",
        age: 20,
        occupation: "其他",
        status: true,
    };

    tableData.value.push(newUser);
    common.showMessage("添加成功", "success");
};

const editUserRow = (row, index) => {
    common.showNotification("编辑用户", `您正在编辑: ${row.username}`, "info");
    console.log("编辑行:", row, index);
};

const deleteUserRow = (index) => {
    common
        .showConfirm("确定要删除该用户吗？", "删除确认")
        .then(() => {
            tableData.value.splice(index, 1);
            common.showMessage("删除成功", "success");
        })
        .catch(() => {});
};

const changeUserStatus = (row) => {
    const statusText = row.status ? "启用" : "禁用";
    common.showMessage(`已${statusText}用户: ${row.username}`, "success");
};

// ------------ 上传相关 ------------
// 头像上传
const avatarUrl = ref("");
const handleAvatarChange = (file) => {
    avatarUrl.value = URL.createObjectURL(file.raw);
    common.showMessage("头像已更新（预览模式）", "success");
};

// 多图片上传
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url || URL.createObjectURL(file.raw);
    dialogVisible.value = true;
};

const handleMultiImagesChange = (file) => {
    console.log("图片变更:", file);
    common.showMessage("图片已添加（预览模式）", "success");
};

const handleRemove = (file) => {
    console.log("删除文件:", file);
    common.showMessage("图片已移除", "info");
};

// 文件上传
const handleFileChange = (file) => {
    console.log("文件变更:", file);
    common.showMessage(`文件已选择: ${file.name}（预览模式）`, "success");
};

// 拖拽上传
const handleDragFileChange = (file) => {
    console.log("拖拽文件变更:", file);
    common.showMessage(`文件已拖拽上传: ${file.name}（预览模式）`, "success");
};

// ------------ 弹窗相关 ------------
// Dialog对话框
const dialogFormVisible = ref(false);
const dialogForm = reactive({
    username: "",
    contact: "",
    address: "",
});

// Drawer抽屉
const drawerVisible = ref(false);
</script>

<style scoped>
.demo-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.demo-section {
    margin-bottom: 20px;
}

h1 {
    margin-bottom: 20px;
    color: #409eff;
    text-align: center;
}

h3 {
    margin: 0;
}

h4 {
    margin-top: 15px;
    margin-bottom: 10px;
    color: #606266;
}

.button-group {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.el-button {
    margin: 5px;
}

.el-card :deep(.el-card__header) {
    padding: 10px 20px;
    background-color: #f5f7fa;
}

/* 表格样式 */
.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.table-actions {
    display: flex;
    gap: 10px;
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

/* 上传组件样式 */
.upload-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.upload-section:last-child {
    border-bottom: none;
}

.upload-tip {
    color: #909399;
    font-size: 14px;
    margin-top: 8px;
}

.avatar-uploader {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    text-align: center;
}

.avatar-uploader:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
}

.component-demo-section {
    margin-bottom: 25px;
}

.component-demo-section:last-child {
    margin-bottom: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .demo-container {
        padding: 10px;
    }

    .table-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .table-actions {
        margin-top: 10px;
        width: 100%;
    }
}
</style>
