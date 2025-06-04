import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import axios from "axios";
import router from "./router";
import "./style.css";
import { useUserStore } from "./stores/user";
import CommonPlugin from "./plugins/common";
import "./utils/common";

const app = createApp(App);
const pinia = createPinia();

// 全局注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(CommonPlugin);
app.config.globalProperties.$axios = axios;

const userStore = useUserStore();

app.mount("#app");
