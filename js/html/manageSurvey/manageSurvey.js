var operatorid = '';
var terminaluser = '';
var dateRangetype = '1';
var dateRangestart = $("#stateTime").val();
var dateRangeend = $("#endTime").val();
var trendIndexkey = '';
var statetime = '';
var endtime = '';

//初始化信息时的显示配置信息
var slected={
	'取消订单数': false,
	'支付金额': false,
	'储值订单': false,
	'储值金额': false,
	'储值用户': false,
	'首次储值用户': false,
	'转化率': false,
	'浏览量': false,
	'访客量': false,
	'订单转化率': false
};
document.getElementById("stateTime").value = GetDateStr(-1);
document.getElementById("endTime").value = GetDateStr(-1);
function manageHead() {
	// 获取各页面对报表数据的通用说明文字
    $.get(serverURL+"/rest/1.0/commonData/generalDataComments",function (data) {
        // console.log(data);
        $(".hint").html(data);
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
        // 获取终端（平台）列表
        $.get(serverURL+"/rest/1.0/commonData/terminalList",function (data) {
            // console.log(data);
            var terminalList = '';
            $.each(data,function (index,items) {
                terminalList += '<option value='+items.key+'>'+items.value+'</option>';
            });
            $("#terminal").html(terminalList);
            managelist(); //图表，概况接口
        },"json");
    },"json");
};
manageHead();
// 获取某一个时间范围的经营概况数据
function managelist() {
	if(sessionStorage.getItem('storeSupplier_ID')){
		operatorid = sessionStorage.getItem('storeSupplier_ID');
		$('#operators_ID').addClass('none');
	}else {
		operatorid = $("#operator").val();
	}
	terminaluser = $("#terminal").val();
	$.get(serverURL+"/rest/2.0/operateSummary/summaryData",{
		supplierId: operatorid,
		terminalKey: terminaluser,
		dateRangeType: dateRangetype,
		dateRangeStart: dateRangestart,
		dateRangeEnd: dateRangeend
		// trendIndexKeys: trendIndexkey
	},function (data) {
		// console.log(data);
		var groupname = '';
		var grouplist = '';
		var indexname = [];
		var indextime = [];
		var indexY = [];
		var indexK = [];
		var indexN = [];
		var indexF = [];
		var indexS = [];
		var indexP = [];
		var indexW = [];
		var indexO = [];
		var indexB = [];
		var indexC = [];
		var indexJ = [];
		var names = '';
		var time = '';
		var y = '';
		var k = '';
		var n = '';
		var f = '';
		var s = '';
		var p = '';
		var w = '';
		var o = '';
		var b = '';
		var c = '';
		var j = '';
		$.each(data.indexGroupList,function (index,items) {
			groupname += '<div class="col-md-4">'+items.groupName+'</div>';
			$.each(items.indexDataList,function (index,item) {
				if(item.val == "null") {
					grouplist += '<div><p><span class="list_name">'+item.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder">'+item.indexCommments+'</div><h5 style="font-size: 28px">不支持自定义</h5></div>';
				} else {
					if(item.dod == "null") {
						grouplist += '<div><p><span class="list_name">'+item.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder">'+item.indexCommments+'</div><h5>'+item.val+'</h5></div>';
					} else {
						grouplist += '<div><p><span class="list_name">'+item.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder">'+item.indexCommments+'</div><h5>'+item.val+'</h5><div class="database_cycle" style="display: flex;align-items: center;"><span>日</span>'+ uoDownDate(item.dod) +'</div><div class="database_cycle"><span>周</span>'+ uoDownDate(item.wow) +'</div><div class="database_cycle"><span>月</span>'+ uoDownDate(item.mom) +'</div></div>';
					}
				}
			})
		});
		$.each(data.xAxis,function (index,item) {
			time = item;
			indextime.push(time);
			// base = item;
			// indexbase.push(base);
		})
		$.each(data.indexTrendDataList,function (index, item) {
			names = item.indexName;
			indexname.push(names);
			if(item.indexKey == "payCount") {
				$.each(item.indexDataList,function (index, items) {
					y = items;
					indexY.push(y);
				})
			};
			if(item.indexKey == "cancelCount") {
				$.each(item.indexDataList,function (index, items) {
					k = items;
					indexK.push(k);
				})
			};
			if(item.indexKey == "payAmount") {
				$.each(item.indexDataList,function (index, items) {
					n = items;
					indexN.push(n);
				})
			};
			if(item.indexKey == "rechargeCount") {
				$.each(item.indexDataList,function (index, items) {
					f = items;
					indexF.push(f);
				})
			};
			if(item.indexKey == "rechargeAmount") {
				$.each(item.indexDataList,function (index, items) {
					s = items;
					indexS.push(s);
				})
			};
			if(item.indexKey == "rechargeUserCount") {
				$.each(item.indexDataList,function (index, items) {
					p = items;
					indexP.push(p);
				})
			};
			if(item.indexKey == "newRechargeUserCount") {
				$.each(item.indexDataList,function (index, items) {
					w = items;
					indexW.push(w);
				})
			};
			if(item.indexKey == "rechargeRate") {
				$.each(item.indexDataList,function (index, items) {
					o = items;
					indexO.push(o);
				})
			};
			if(item.indexKey == "pageViewCount") {
				$.each(item.indexDataList,function (index, items) {
					b = items;
					indexB.push(b);
				})
			};
			if(item.indexKey == "pageViewUserCount") {
				$.each(item.indexDataList,function (index, items) {
					c = items;
					indexC.push(c);
				})
			};
			if(item.indexKey == "orderRate") {
				$.each(item.indexDataList,function (index, items) {
					j = items;
					indexJ.push(j);
				})
			};
		})
		// console.log(indextime)
		echartlist(indexname,indextime,indexY,indexK,indexN,indexF,indexS,indexP,indexW,indexO,indexB,indexC,indexJ,slected);
		$("#manage_name").html(groupname);
		$(".database").html(grouplist);
		//	因为数据是后期添加，如果没有先遮住，在请求数据期间只会显示两条线，非常难看
		$(".dividing-line").removeClass("hidden");
		// console.log($(".database").find("div:nth-chid(8)").find("h5").text())
		// ($(".database").find("div:nth-chid(8)").find("h5").text())*100+'%';
	},"json");
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
	managelist();
}


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
	managelist();
});
$("#operator").change(function() {
	operatorid = $("#operator").val();
	managelist();
    //	将运营商ID存储到sessionStorage中
    sessionStorage.setItem("operatorId",$(this).val());
});
$("#terminal").change(function() {
	terminaluser = $("#terminal").val();
	managelist();
});
function reminderover(_this) {
$(_this).parent().next(".reminder").show();
};
function reminderout(_this) {
    $(_this).parent().next(".reminder").hide();
};
function echartlist(name,time,y,k,n,f,s,p,w,o,b,c,j,slect) {
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
	            name:'有效订单数',
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
	            name:'取消订单数',
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
	            name:'支付金额',
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
	            name:'储值订单',
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
	            name:'储值金额',
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
	            name:'储值用户',
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
	            name:'首次储值用户',
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
	            data:w,
				yAxisIndex: 6
	        },
	        {
	            name:'转化率',
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
	            data:o,
				yAxisIndex: 7
	        },
	        {
	            name:'浏览量',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#2788c8',
						lineStyle:{
							color:'#2788c8'
						}
					}
				},
	            data:b,
				yAxisIndex: 8
	        },
	        {
	            name:'访客量',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#8257a2',
						lineStyle:{
							color:'#8257a2'
						}
					}
				},
	            data:c,
				yAxisIndex: 9
	        },
	        {
	            name:'订单转化率',
	            type:'line',
	            smooth: true,
				itemStyle : {
					normal : {
						color:'#fb75e3',
						lineStyle:{
							color:'#fb75e3'
						}
					}
				},
	            data:j,
				yAxisIndex: 10
	        }
	    ]
    };
	myChart.setOption(option);
	//监听legend点击事件获取配置信息
	myChart.on("legendselectchanged", function (param) {
		slected=param.selected;
	});
}