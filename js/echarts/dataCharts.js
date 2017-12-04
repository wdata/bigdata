//TOP商品销售类
/* 柱状图
 commoditySalesChart = {
 color: ['#3398DB'],
 tooltip : {
 trigger: 'axis',
 axisPointer : {            // 坐标轴指示器，坐标轴触发有效
 type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
 }
 },
 grid: {
 left: '3%',
 right: '4%',
 bottom: '3%',
 containLabel: true
 },
 xAxis : [
 {
 type : 'category',
 data : [],
 axisTick: {
 alignWithLabel: true
 }
 }
 ],
 yAxis : [
 {
 type : 'value'
 }
 ],
 dataZoom: [//区域缩放
 {
 type: 'inside',
 start: 0,//起始位置
 end: 50//结束
 },
 {
 show: false,//是否显示滚动条
 type: 'slider',//滑动条
 y: '95%',//显示位置
 start: 50,//
 end: 100
 }
 ],
 series : [
 {
 name:'销售量(元)',
 type:'bar',
 barWidth: '60%',
 data:[]
 }
 ]
 };
 */

/*饼图  commoditySalesChart = {
 color: [ '#69a1ff','#5ac9dd','#4cc77a','#ffcc69','#ff6a42'],
 tooltip : {
 trigger: 'item',
 formatter: "{a} <br/>{b} : {c} ({d}%)"
 },
 legend: {
 orient: 'vertical',
 left: 'content',
 data: []
 },
 series : [
 {
 name: '',
 type: 'pie',
 radius : '66%',
 center: ['50%', '60%'],
 data:[

 ],
 itemStyle: {
 emphasis: {
 shadowBlur: 10,
 shadowOffsetX: 0,
 shadowColor: 'rgba(0, 0, 0, 0.5)'
 }
 }
 }
 ]
 };*/
commoditySalesChart = {
    grid: {
        left: '1%',
        right: '1%',
        bottom: '3%',
        top: '28%',
        containLabel: true
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        },
    },
    legend: [{
        top: -4,
        left: 10,
        x: "left",
        data: []
        //data: result.legendList
    }],

    calculable: true,
    xAxis: [
        {
            type: "category",
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitArea: {
                show: false
            },
            data: ['商品销售类（销售金额：元）']
        }
    ],
    yAxis: [
        {
            type: "value",
            splitLine: {
                show: true
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitArea: {
                show: true
            }
        }
    ],

    series: []
};


//订单金额趋势
orderAmountChart = {
    color: ['#ffa84b'],
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        x: 'left',
        padding: [10, 20, 0, 20],
        data: ['付款订单金额(元)'],
        selected: {
            '付款订单金额(元)': true,
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
        /*splitLine:{//网格线
         show: true,
         lineStyle:{
         color:['#b1b1b1'],
         type:'dashed'
         }
         },*/
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
                type: 'dashed'
            }
        }
    },

    series: [
        {
            name: '付款订单金额(元)',
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

//用户趋势图表
userTrendChart = {
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
        data: ['新增用户', '活跃用户'],
        selected: {
            '新增用户': true,
            '活跃用户': true
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
            name: '新增用户',
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
            name: '活跃用户',
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

//商品转化概况
/*goodsTransformChart = {
 tooltip: {
 trigger: 'axis',
 trigger: 'item',
 formatter: "{c}",
 axisPointer: {            // 坐标轴指示器，坐标轴触发有效
 type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
 }

 },
 color: ['#69a1ff', '#5ac9dd', '#4cc77a', '#ffcc69', '#ff6a42'],
 calculable: true,
 series: [
 {
 //name:'漏斗图',
 type: 'funnel',
 left: '150',
 top: 60,
 bottom: 60,
 width: '50%',
 min: 0,
 max: 100,
 minSize: '0%',
 maxSize: '100%',
 sort: 'descending',
 gap: 2,
 label: {
 normal: {
 show: true,
 position: 'left',
 textStyle: {
 fontSize: 14,
 color: '#000'
 }
 },
 emphasis: {
 textStyle: {
 fontSize: 14,
 color: '#000'
 }
 }
 },
 labelLine: {
 normal: {
 length: 10,
 lineStyle: {
 width: 1,
 type: 'solid'
 }
 }
 },
 itemStyle: {
 normal: {
 borderColor: '#fff',
 borderWidth: 1
 }
 },
 data: []
 }
 ]
 };*/
//商品转化概况
goodsTransformChart = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    color: ['#69a1ff'],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '0%',
        containLabel: true,

    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['支付商品数', '下单商品数', '点击商品数', '曝光商品数', '上架商品数']
    },
    series: [
        {
            barMaxWidth: 30,//柱最大宽度
            name: '商品数(个)',
            type: 'bar',
            data: []
        }
    ]
};