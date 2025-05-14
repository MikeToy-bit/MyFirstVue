import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import axios from "axios";
import router from "./router";
import "./style.css";
import { useUserStore } from "./stores/user";
import CommonPlugin from "./plugins/common";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(CommonPlugin);
app.config.globalProperties.$axios = axios;

const userStore = useUserStore();

app.mount("#app");
