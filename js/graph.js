
function echartlist(name,time,serie,y) {
	var myChart = echarts.init(document.getElementById('userTrendPanel'));
	option = {
	    title: {
	        // text: '多个y轴的例子'
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data: name //['邮件营销','联盟广告','视频广告','广告']
	        // selected: {  
         //        '联盟广告': false,  
         //        '视频广告': false,  
         //        '广告': false 
         //    }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: time //['周一','周二','周三','周四','周五','周六','周日']
	    },
	    yAxis: [
		    {
		        type: 'value',
		        show: false
		    },{
		        type: 'value',
		        show: false
		    },{
		        type: 'value',
		        show: false
		    },{
		        type: 'value',
		        show: false
		    }
	    ],
	    series: [
	        {
	            name:'有效订单数',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
	            yAxisIndex: 0
	        },
	        {
	            name:'取消订单数',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[220, 182, 191, 234, 290, 330, 310],
	            yAxisIndex: 1
	        },
	        {
	            name:'支付金额',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[1150, 2232, 3201, 3154, 1190, 3330, 2410],
	            yAxisIndex: 2
	        },
	        {
	            name:'储值订单',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[59, 49, 59, 59, 59, 49, 49],
	            yAxisIndex: 3
	        },
	        {
	            name:'储值金额',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[59, 49, 59, 59, 59, 49, 49],
	            yAxisIndex: 4
	        },
	        {
	            name:'储值用户',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[59, 49, 59, 59, 59, 49, 49],
	            yAxisIndex: 5
	        },
	        {
	            name:'首次储值用户',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[59, 49, 59, 59, 59, 49, 49],
	            yAxisIndex: 6
	        },
	        {
	            name:'转化率',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[59, 49, 59, 59, 59, 49, 49],
	            yAxisIndex: 7
	        },
	        {
	            name:'浏览量',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[59, 49, 59, 59, 59, 49, 49],
	            yAxisIndex: 8
	        },
	        {
	            name:'访客量',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[59, 49, 59, 59, 59, 49, 49],
	            yAxisIndex: 9
	        },
	        {
	            name:'订单转化率',
	            type:'line',
	            smooth: true,
	            stack: '总量',
	            data:[59, 49, 59, 59, 59, 49, 49],
	            yAxisIndex: 10
	        }
	    ]
	};

	myChart.setOption(option);
};
echartlist();