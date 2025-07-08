/**
 * @file 全局通用工具库插件
 * @description 将通用工具库注册为全局可用的插件
 */

import common from "../utils/common";

export default {
    install: (app) => {
        // 将通用工具库注册到全局属性
        app.config.globalProperties.Cm_Common = common;

        // 将通用工具库挂载到全局window对象，便于在非组件中使用
        window.Cm_Common = common;
    },
};
