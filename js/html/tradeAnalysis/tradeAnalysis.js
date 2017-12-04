var operatorid = '';
var terminaluser = '';
var dateRangetype = '1';
var dateRangestart = $("#stateTime").val();
var dateRangeend = $("#endTime").val();
var periodPer = 1;
var clienttime = $("#analysisMonthStartTime").val();
var dealOperator = '';
var dealTerminal = '';
var statetime = '';
var endtime = '';

//切换运营商
if(sessionStorage.getItem('storeSupplier_ID')){
    operatorid = sessionStorage.getItem('storeSupplier_ID');
    $('#operators_ID').addClass('none');
    $('#deals_operator').addClass('none');
}else {
    operatorid = $("#operator").val();
    dealOperator = $("#deal_operator").val();
}
//初始化信息时的显示配置信息
var slected={
	'付款人数': false,
	'付款订单数': false,
	'下单转化率': false,
	'付款转化率': false,
	'储值转化率': false
};
document.getElementById("stateTime").value = GetDateStr(-1);
document.getElementById("endTime").value = GetDateStr(-1);
// 获取某个月新老客户付款数据构成
function today(){
    var today=new Date();
    var h=today.getFullYear();
    var m=today.getMonth();
    // var d=today.getDate();
    m= m<10?"0"+m:m;   //  这里判断月份是否<10,如果是在月份前面加'0'
    //d= d<0?"10"+d:d;        //  这里判断日期是否<10,如果是在日期前面加'0'
    return h+"-"+m;
}
document.getElementById("analysisMonthStartTime").value = today();//获取文本id并且传入当前日期

function manageHead() {
	// 获取各页面对报表数据的通用说明文字
	$.get(serverURL+"/rest/1.0/commonData/generalDataComments",function (datas) {
	    // console.log(datas);
	    $(".hint").html(datas);
	});
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
        $("#deal_operator").html(operatorList);
        // 获取终端（平台）列表
        $.get(serverURL+"/rest/1.0/commonData/terminalList",function (data) {
            // console.log(data);
            var terminalList = '';
            $.each(data,function (index,items) {
                terminalList += '<option value='+items.key+'>'+items.value+'</option>'
            });
            $("#terminal").html(terminalList);
            $("#deal_terminal").html(terminalList);
            tradeList(); //图表，概况接口
            clientList(); //页面详情接口
        },"json");
    },"json");
};
manageHead();//查询公共接口
//转化百分比
Number.prototype.toPercent = function(){
	return (Math.round(this * 10000)/100).toFixed(2) + '%';
}
// 获取某一个时间范围的流量概况数据
function tradeList() {
	//切换运营商
	if(sessionStorage.getItem('storeSupplier_ID')){
	    operatorid = sessionStorage.getItem('storeSupplier_ID');
	    $('#operators_ID').addClass('none');
	}else {
	    operatorid = $("#operator").val();
	}
	terminaluser = $("#terminal").val();
	$.get(serverURL+"/rest/2.0/tradeAnalysis/summaryData",{
		supplierId: operatorid,
		terminalKey: terminaluser,
		dateRangeType: dateRangetype,
		dateRangeStart: dateRangestart,
		dateRangeEnd: dateRangeend
	},function (data) {
		var tradebase = '';
		var self = $("#profile");
		$.each(data.indexGroupList,function(index,val){
			if(index <= 3){
                var trandebaseA = '';
                $.each(val.indexDataList,function(x,y){
                    trandebaseA += '<div class="trandebase-A"> <p class="tradebase_name">'+ y.indexName +'</p> <h6 class="tradebase_num">'+ tdCheck(y.val) +'</h6> <div class="gradient gradient1"> <span>较前一天</span> '+ uoDownDate(y.dod) +' </div> </div>';
                });
                tradebase += '<div class="tradebase"> '+ trandebaseA +'</div>';
			}else{
                $(".order_name").text(val.indexDataList[0].indexName+":");
                $(".pay_name").text(val.indexDataList[1].indexName+":");
                $(".shop_name").text(val.indexDataList[2].indexName+":");
                $(".order_conversion").text(tdCheck(val.indexDataList[0].val));
                $(".pay_conversion").text(tdCheck(val.indexDataList[1].val));
                $(".shop_conversion").text(tdCheck(val.indexDataList[2].val));
			}
		});
        self.empty();
        self.append(tradebase);



		var name = '';
		var time = '';
		var y = '';
		var k = '';
		var n = '';
		var f = '';
		var s = '';
		var p = '';
		var indexname = [];
		var indextime = [];
		var indexY = [];
		var indexK = [];
		var indexN = [];
		var indexF = [];
		var indexS = [];
		var indexP = [];
		$.each(data.indexTrendDataList,function (index,item) {
			names = item.indexName;
			indexname.push(names);
			if(item.indexKey == "payAmount") {
				$.each(item.indexDataList,function (index, items) {
					y = items;
					indexY.push(y);
				})
			};
			if(item.indexKey == "payUserCount") {
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
			if(item.indexKey == "orderRate") {
				$.each(item.indexDataList,function (index, items) {
					f = items;
					indexF.push(f);
				})
			};
			if(item.indexKey == "payRate") {
				$.each(item.indexDataList,function (index, items) {
					s = items;
					indexS.push(s);
				})
			};
			if(item.indexKey == "rechargeRate") {
				$.each(item.indexDataList,function (index, items) {
					p = items;
					indexP.push(p);
				})
			};
		});
		$.each(data.xAxis,function (index,item) {
			time = item;
			indextime.push(time);
		})
		chartList(indexname,indextime,indexY,indexK,indexN,indexF,indexS,indexP,slected);
	});
};
function clientList() {
	//切换运营商
	if(sessionStorage.getItem('storeSupplier_ID')){
	    operatorid = sessionStorage.getItem('storeSupplier_ID');
	    $('#deals_operator').addClass('none');
	    dealOperator = operatorid;
	}else {
	    dealOperator = $("#deal_operator").val();
	}
	dealTerminal = $("#deal_terminal").val();
	clienttime = $("#analysisMonthStartTime").val();
	$.get(serverURL+"/rest/2.0/tradeAnalysis/tradeConsumer",{
		supplierId: dealOperator,
		terminalKey: dealTerminal,
		month: clienttime
	},function (data) {
		// console.log(data);
		$(".new_money").text(data.newPayAmount);
		$(".new_sum").text(data.newPayAmountRate == '--'?'--':(((data.newPayAmountRate)*100).toFixed(2)+'%'));
		$(".new_num").text(data.newPayUserCount);
		$(".new_people").text(data.newPayUserCountRate == '--'?'--':(((data.newPayUserCountRate)*100).toFixed(2)+'%'));

		$(".old_money").text(data.oldPayAmount);
		$(".old_sum").text(data.oldPayAmountRate == '--'?'--':(((data.oldPayAmountRate)*100).toFixed(2)+'%'));
		$(".old_num").text(data.oldPayUserCount);
		$(".old_people").text(data.oldPayUserCountRate == '--'?'--':(((data.oldPayUserCountRate)*100).toFixed(2)+'%'));
	})
};
//备注：近n天，是由当前时间的 -1天 开始算起
var yesterday = new Date((new Date()-24*3600*1000)).toDateStr();

function timeIsChange(){
	statetime = $("#stateTime").val();
	endtime = $("#endTime").val();
	if( !statetime || !endtime ){
		return false;
	}
	dateRangestart = statetime;
	dateRangeend = endtime;
	dateRangetype = '0';

	var date = (new Date(endtime)-new Date(statetime))/1000/3600/24;//天数差
	if(endtime == yesterday && statetime == endtime){
		$('.query .query_condition span').removeClass('cliStyle');
		$('.query .query_condition .span1').addClass('cliStyle');
	}else if(endtime == yesterday && date===6){
		$('.query .query_condition span').removeClass('cliStyle');
		$('.query .query_condition .span7').addClass('cliStyle');
	}else if(endtime == yesterday && date===29){
		$('.query .query_condition span').removeClass('cliStyle');
		$('.query .query_condition .span30').addClass('cliStyle');
	}else {
		$('.query .query_condition span').removeClass('cliStyle');
	}
	tradeList();
};
function stateTimeInit(){//初始化开始时间
	var stateTimeMax = ($('#endTime').val()=='')?yesterday:'#F{$dp.$D(\'endTime\')}';
	WdatePicker({onpicked:function(){timeIsChange();},skin:'whyGreen',minDate:'%y-#{%M-2}-%d',maxDate:stateTimeMax});
};
function endTimeInit(){//初始化结束时间
	var day = new Date();
	var M_2 = new Date(day.setMonth(day.getMonth()-2)).toDateStr();//前两个月
	var endTimeMin = ($('#stateTime').val()=='')?M_2:'#F{$dp.$D(\'stateTime\')}';
	WdatePicker({onpicked:function(){timeIsChange();},skin:'whyGreen',minDate:endTimeMin,maxDate:'%y-%M-#{%d-1}'});
};
//月份周期点击查询
function monthTime(){
	var clenttimeOld = clienttime;
	clienttime = $("#analysisMonthStartTime").val();
	WdatePicker({isShowClear:true,isShowToday:false,readOnly:true,dateFmt:'yyyy-MM',maxDate:'%y-#{%M-1}'});
	if(clenttimeOld === clienttime) {
		return false;
	};
	// console.log(clienttime)
	clientList();
};
// $(".query_condition > span").click(function() {
// 	dateRangetype = $(this).find("input").val();
// 	tradeList();
// });
$(".query_condition > span").click(function() {
    dateRangetype = $(this).find("input").val();
    statetime = $("#stateTime").val();
    endtime = yesterday;
    if( !statetime || !endtime ){
        return false;
    }
    if(dateRangetype == '1') {
        dateRangestart = yesterday;
    } else if(dateRangetype == '2') {
        dateRangestart = addDay(7).Format("yyyy-MM-dd");
    } else if(dateRangetype == '3') {
        dateRangestart = addDay(30).Format("yyyy-MM-dd");
    };
    $("#stateTime").val(dateRangestart);
    $("#endTime").val(endtime);
    dateRangestart = $("#stateTime").val();
    dateRangeend = endtime;
    dateRangetype = dateRangetype;
    tradeList();
});
$("#operator").change(function() {
	operatorid = $("#operator").val();
	tradeList();
    //	将运营商ID存储到sessionStorage中
    sessionStorage.setItem("operatorId",$(this).val());
});
$("#terminal").change(function() {
	terminaluser = $("#terminal").val();
	tradeList();
    //	将运营商ID存储到sessionStorage中
    sessionStorage.setItem("operatorId",$(this).val());
});
// $("#analysisMonthStartTime").bind("blur",function() {
// 	console.log("aaa")
// 	clienttime = $("#analysisMonthStartTime").val();
// 	clientList();
// });
$("#deal_operator").change(function() {
	dealOperator = $("#deal_operator").val();
	clientList();
});
$("#deal_terminal").change(function() {
	dealTerminal = $("#deal_terminal").val();
	clientList();
})
//图表数据
function chartList(names,times,y,k,n,f,s,p,slect) {
	var myChart = echarts.init(document.getElementById('tradeAnalysis'));
	var option = {
	    title: {
	        // text: '多个y轴的例子'
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:names,
	        selected:slect
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
	        data: times
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
	            name:'付款金额',
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
	            name:'付款人数',
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
	            name:'付款订单数',
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
	            name:'下单转化率',
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
	            name:'付款转化率',
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
	            name:'储值转化率',
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
	       	}
	    ]
	};
	myChart.setOption(option);
	//监听legend点击事件获取配置信息
	myChart.on("legendselectchanged", function (param) {
		slected=param.selected;
	});
};