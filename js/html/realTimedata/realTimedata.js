var supplierid = '';
var interTime = '';

var timeSetime = null;

//	修改当日实时销售数据，显示当天日期;
var timeDate = new Date();
$(".hint .time").text(timeDate.getFullYear() + "-" + (timeDate.getMonth() + 1) + "-" + timeDate.getDate());

//初始化信息时的显示配置信息
var slected={
	'当日访客数': false,
	'当日有效订单数': false,
	'当日取消订单数': false,
	'当日储值订单数': false,
	'当日储值金额(元)': false,
	'当日优惠订单数': false,
	'当日商家GMV(元)': false
};
function realFirst() {
	// 获取运营商下拉列表数据
    $.get(serverURL+"/rest/1.0/commonData/supplierList",function (data) {
        // console.log(data);
        var operatorList = '';
        $.each(data,function (index,items) {
        	if(operatorId === items.key){
                operatorList += '<option selected="selected" value='+items.key+'>'+items.value+'</option>';
			}else{
                operatorList += '<option value='+items.key+'>'+items.value+'</option>';
			}
        });
        $("#operator").html(operatorList);
        timeDatalist();
        timing(300000);
    },"json");

};
realFirst();
function timing(num) {
	setInterval ("timeDatalist()", num);
};
$("#times").change(function () {
	interTime = $("#times").val();
	// if(interTime == "5") {
	// 	timing(300000)
	// } else if(interTime == "30") {
	// 	timing(1800000)
	// } else if(interTime == "60") {
	// 	timing(3600000)
	// }
	timeDatalist();
});
$("#operator").change(function() {
	supplierid = $("#operator").val();
	timeDatalist();
	//	将运营商ID存储到sessionStorage中
	sessionStorage.setItem("operatorId",$(this).val());
});
function timeDatalist() {
	if(sessionStorage.getItem('storeSupplier_ID')){
		supplierid = sessionStorage.getItem('storeSupplier_ID');
		$('#operators_ID').addClass('none');
	}else {
		supplierid = $("#operator").val();
	}

	interTime = $("#times").val();
	$.get(serverURL+"/rest/2.0/realtimeData",{
		supplierId: supplierid,
		intervalMinutes: interTime
	},function (data) {
		if(data == null) return false;
		var managename = '';
		var indexname = [];
		var indextime = [];
		var indexY = [];
		var indexK = [];
		var indexN = [];
		var indexF = [];
		var indexS = [];
		var indexP = [];
		var indexM = [];
		var indexT = [];
		var time = '';
		var y = '';
		var k = '';
		var n = '';
		var f = '';
		var s = '';
		var p = '';
		var m = '';
		var t = '';
		$.each(data.indexDataList,function (index, item) {
			managename += '<div><p><span class="list_name">'+item.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder">'+item.indexCommments+'</div><h5>'+item.val+'</h5></div>';
		});
		$(".database").html(managename);
		$.each(data.xAxis,function (index,item) {
			time = item;
			indextime.push(time);
		})
		$.each(data.indexTrendDataList,function (index, item) {
			indexname.push(item.indexName);
			if(item.indexKey == "visitCount") {
				$.each(item.indexDataList,function (index, items) {
					y = items;
					indexY.push(y);
				})
			};
			if(item.indexKey == "visitorCount") {
				$.each(item.indexDataList,function (index, items) {
					k = items;
					indexK.push(k);
				})
			};
			if(item.indexKey == "payCount") {
				$.each(item.indexDataList,function (index, items) {
					n = items;
					indexN.push(n);
				})
			};
			if(item.indexKey == "cancelCount") {
				$.each(item.indexDataList,function (index, items) {
					f = items;
					indexF.push(f);
				})
			};
			if(item.indexKey == "rechargeCount") {
				$.each(item.indexDataList,function (index, items) {
					s = items;
					indexS.push(s);
				})
			};
			if(item.indexKey == "rechargeAmount") {
				$.each(item.indexDataList,function (index, items) {
					p = items;
					indexP.push(p);
				})
			};
			if(item.indexKey == "couponCount") {
				$.each(item.indexDataList,function (index, items) {
					m = items;
					indexM.push(m);
				})
			};
			if(item.indexKey == "payAmount") {
				$.each(item.indexDataList,function (index, items) {
					t = items;
					indexT.push(t);
				})
			};
		});
		echartlist(indexname,indextime,indexY,indexK,indexN,indexF,indexS,indexP,indexM,indexT,slected)

		if(timeSetime){
			clearTimeout(timeSetime);
		}
        timeSetime = setTimeout(function(){
        	// console.log(new Date());
            interTime = $("#times").val();
            timeDatalist();
		},((data.secsNextUpdate + 1)*1000));
	})
};
function reminderover(_this) {
$(_this).parent().next(".reminder").show();
};
function reminderout(_this) {
    $(_this).parent().next(".reminder").hide();
};
function echartlist(name,time,y,k,n,f,s,p,m,t,slect) {
	var myChart = echarts.init(document.getElementById('userTrendPanel'));
	var option = {
        title: {
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:name,
            selected:slect,
            inactiveColor:"#999"
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
            data: time
        },
        yAxis: [
			{
				type: 'value',
				show: false
			},
			{
				type: 'value',
				show: false
			},
			{
				type: 'value',
				show: false
			},
			{
				type: 'value',
				show: false
			},
			{
				type: 'value',
				show: false
			},
			{
				type: 'value',
				show: false
			},
			{
				type: 'value',
				show: false
			},
			{
				type: 'value',
				show: false
			}
		],
        series: [
	        {
	            name:'当日浏览量',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						show:true,
						color:'#f27983',
						lineStyle:{
							color:'#f27983'
						}
					}
				},
	            data:y,
				yAxisIndex: 0
	        },
	        {
	            name:'当日访客数',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						show:true,
						color:'#ac5e4b',
						lineStyle:{
							color:'#ac5e4b'
						}
					}
				},
	            data:k,
				yAxisIndex: 1
	        },
	        {
	            name:'当日有效订单数',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#ef2d2d',
						lineStyle:{
							color:'#ef2d2d'
						}
					}
				},
	            data:n,
				yAxisIndex: 2
	        },
	        {
	            name:'当日取消订单数',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#f8aa21',
						lineStyle:{
							color:'#f8aa21'
						}
					}
				},
	            data:f,
				yAxisIndex: 3
	        },
	        {
	            name:'当日储值订单数',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#b29a34',
						lineStyle:{
							color:'#b29a34'
						}
					}
				},
	            data:s,
				yAxisIndex: 4
	        },
	        {
	            name:'当日储值金额(元)',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#5a9272',
						lineStyle:{
							color:'#5a9272'
						}
					}
				},
	            data:p,
				yAxisIndex: 5
			},
	        {
	            name:'当日优惠订单数',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#28bb2c',
						lineStyle:{
							color:'#28bb2c'
						}
					}
				},
	            data:m,
				yAxisIndex: 6
			},
	        {
	            name:'当日商家GMV(元)',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#24bfb2',
						lineStyle:{
							color:'#24bfb2'
						}
					}
				},
	            data:t,
				yAxisIndex: 7
	        }
	    ]
    };
	myChart.setOption(option);
	//监听legend点击事件获取配置信息
	myChart.on("legendselectchanged", function (param) {
		slected=param.selected;
	});
};