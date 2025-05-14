<template>
    <div class="dashboard-container">
        <el-row :gutter="20">
            <el-col :span="6" v-for="(card, index) in cards" :key="index">
                <el-card
                    class="dashboard-card"
                    :body-style="{ padding: '20px' }"
                >
                    <div class="card-content">
                        <el-icon class="card-icon" :class="card.type">
                            <component :is="card.icon" />
                        </el-icon>
                        <div class="card-info">
                            <div class="card-title">{{ card.title }}</div>
                            <div class="card-value">{{ card.value }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="chart-row">
            <el-col :span="16">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>访问趋势</span>
                            <el-radio-group v-model="chartType" size="small">
                                <el-radio-button label="week"
                                    >本周</el-radio-button
                                >
                                <el-radio-button label="month"
                                    >本月</el-radio-button
                                >
                                <el-radio-button label="year"
                                    >全年</el-radio-button
                                >
                            </el-radio-group>
                        </div>
                    </template>
                    <div class="chart-container" ref="chartRef"></div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-header">
                            <span>访问来源</span>
                        </div>
                    </template>
                    <div class="chart-container" ref="pieChartRef"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { User, ShoppingCart, Money, DataLine } from "@element-plus/icons-vue";
import * as echarts from "echarts";

// 响应式状态
const chartType = ref("week");
const chartRef = ref(null);
const pieChartRef = ref(null);
let chartInstance = null;
let pieChartInstance = null;

// 数据卡片配置
const cards = [
    {
        title: "总用户数",
        value: "8,846",
        icon: User,
        type: "user",
    },
    {
        title: "总订单数",
        value: "1,234",
        icon: ShoppingCart,
        type: "order",
    },
    {
        title: "总收入",
        value: "¥ 88,888",
        icon: Money,
        type: "money",
    },
    {
        title: "访问量",
        value: "88,888",
        icon: DataLine,
        type: "visit",
    },
];

// 图表配置
const chartOption = {
    tooltip: {
        trigger: "axis",
    },
    grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            name: "访问量",
            type: "line",
            smooth: true,
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            areaStyle: {
                opacity: 0.1,
            },
        },
    ],
};

const pieChartOption = {
    tooltip: {
        trigger: "item",
    },
    legend: {
        orient: "vertical",
        left: "left",
    },
    series: [
        {
            name: "访问来源",
            type: "pie",
            radius: "50%",
            data: [
                { value: 1048, name: "搜索引擎" },
                { value: 735, name: "直接访问" },
                { value: 580, name: "邮件营销" },
                { value: 484, name: "联盟广告" },
                { value: 300, name: "视频广告" },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
    ],
};

// 方法
const initCharts = () => {
    if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        chartInstance.setOption(chartOption);
    }
    if (pieChartRef.value) {
        pieChartInstance = echarts.init(pieChartRef.value);
        pieChartInstance.setOption(pieChartOption);
    }
};

const resizeCharts = () => {
    chartInstance?.resize();
    pieChartInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
    initCharts();
    window.addEventListener("resize", resizeCharts);
});

onUnmounted(() => {
    window.removeEventListener("resize", resizeCharts);
    chartInstance?.dispose();
    pieChartInstance?.dispose();
});
</script>

<style scoped>
.dashboard-container {
    padding: 20px;
}

.dashboard-card {
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-content {
    display: flex;
    align-items: center;
}

.card-icon {
    font-size: 48px;
    margin-right: 20px;
    padding: 12px;
    border-radius: 8px;
}

.card-icon.user {
    color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
}

.card-icon.order {
    color: #67c23a;
    background-color: rgba(103, 194, 58, 0.1);
}

.card-icon.money {
    color: #e6a23c;
    background-color: rgba(230, 162, 60, 0.1);
}

.card-icon.visit {
    color: #f56c6c;
    background-color: rgba(245, 108, 108, 0.1);
}

.card-info {
    flex: 1;
}

.card-title {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
}

.card-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
}

.chart-row {
    margin-top: 20px;
}

.chart-card {
    height: 400px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chart-container {
    height: 320px;
    width: 100%;
}
</style>
