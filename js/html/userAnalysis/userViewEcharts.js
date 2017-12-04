/**
 * 所用到的图表 基本配置
 * Created by Administrator on 2017/6/3.
 */
//消费金额趋势
comsumptionChart = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    color: ['#69a1ff', '#39c671'],
    legend: {
        x: 'left',
        padding: [10, 20, 0, 20],
        data: ['所有用户平均Arpu(元)', '该用户月消费金额(元)'],
        selected: {
            '所有用户平均Arpu(元)': true,
            '该用户月消费金额(元)': true
        }
    },
    grid: {
        left: '0',
        right: '3%',
        bottom: '3%',
        top: '18%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,//是否区域选中
        //设置字体倾斜
        axisLabel: {
            interval: 0,
            rotate: 0,//倾斜度 -90 至 90 默认为0
            margin: 10,
            textStyle: {
                //fontWeight:"bolder",
                color: "#000000",
                fontSize: 12
            }
        },
        data: []
    },
    yAxis: {
        splitLine: {//网格线
            show: true,
            lineStyle: {
                color: ['#b1b1b1'],
                type: 'solid'//dashed 虚线
            }
        }
    },
    series: [
        {
            name: '所有用户平均Arpu(元)',
            type: 'line',
            data: [],
            label: {
                normal: {
                    show: true,
                    position: 'top'//值显示
                }
            }
        },
        {
            name: '该用户月消费金额(元)',
            type: 'line',
            data: [],
            label: {
                normal: {
                    show: true,
                    position: 'top'//值显示
                }
            }
        }
    ]
};

//购买次数趋势
buyCountChart = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    color: ['#69a1ff', '#39c671'],
    legend: {
        x: 'left',
        padding: [10, 20, 0, 20],
        data: ['所有用户平均购买次数', '该客户当月购买次数'],
        selected: {
            '所有用户平均购买次数': true,
            '该客户当月购买次数': true
        }
    },
    grid: {
        left: '0',
        right: '3%',
        bottom: '3%',
        top: '18%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,//是否区域选中
        //设置字体倾斜
        axisLabel: {
            interval: 0,
            rotate: 0,//倾斜度 -90 至 90 默认为0
            margin: 10,
            textStyle: {
                //fontWeight:"bolder",
                color: "#000000",
                fontSize: 12
            }
        },
        data: []
    },
    yAxis: {
        splitLine: {//网格线
            show: true,
            lineStyle: {
                color: ['#b1b1b1'],
                type: 'solid'//dashed 虚线
            }
        }
    },
    series: [
        {
            name: '所有用户平均购买次数',
            type: 'line',
            data: [],
            label: {
                normal: {
                    show: true,
                    position: 'top'//值显示
                }
            }
        },
        {
            name: '该客户当月购买次数',
            type: 'line',
            data: [],
            label: {
                normal: {
                    show: true,
                    position: 'top'//值显示
                }
            }
        }
    ]
};