import mitt from "mitt";

// 创建一个事件发射器实例
const emitter = mitt();

// 导出事件总线
export default {
    // 发布事件
    emit(event, ...args) {
        emitter.emit(event, ...args);
    },

    // 订阅事件
    on(event, callback) {
        emitter.on(event, callback);
    },

    // 取消订阅
    off(event, callback) {
        emitter.off(event, callback);
    },
};
