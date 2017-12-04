var operatorid = '';
var terminaluser = '';
var dateRangetype = '1';
var dateRangestart = $("#stateTime").val();
var dateRangeend = $("#endTime").val();
var statetime = '';
var endtime = '';
var pages = '1';
var totals = '';
var datalist = '';
var useroperator = '';
var userterminal = '';
var period = $("#analysisMonthStartTime").val();

//初始化信息时的显示配置信息
var slected={
    '成交用户数': false,
    '首次成交用户数': false,
    '储值用户数': false,
    '首次储值用户数': false,
    '访问用户数': false,
    '新访问用户数': false
};
document.getElementById("stateTime").value = GetDateStr(-1);
document.getElementById("endTime").value = GetDateStr(-1);
//用于存取区县某月新增用户列表excel提交参数暂存
var execlTrade = {};

function manageHead() {
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
        $("#user_operator").html(operatorList);
        // 获取终端（平台）列表
        $.get(serverURL+"/rest/1.0/commonData/terminalList",function (data) {
            // console.log(data);
            var terminalList = '';
            $.each(data,function (index,items) {
                terminalList += '<option value='+items.key+'>'+items.value+'</option>'
            });
            $("#terminal").html(terminalList);
            $("#user_terminal").html(terminalList);
            analysislist(); //图表，概况接口
            userportrayal(); //用户画像
            // tabDetail(); //用户表格
            commodity();
        },"json");
    },"json");
    // 获取各页面对报表数据的通用说明文字
    $.get(serverURL+"/rest/1.0/commonData/generalDataComments",function (data) {
        // console.log(data);
        $(".hint").html(data);
    });

};
manageHead(); //通用接口

//获取某一个时间范围的用户概况数据
function analysislist() {
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        operatorid = $("#operator").val();
    }
    terminaluser = $("#terminal").val();
    $.get(serverURL+"/rest/2.0/userAnalysis/summaryData",{
        supplierId: operatorid,
        terminalKey: terminaluser,
        dateRangeType: dateRangetype,
        dateRangeStart: dateRangestart,
        dateRangeEnd: dateRangeend
    },function (data) {
        // console.log(data)
        // $("#manage_name").find("div").remove();
        // $("#data_list").find("div").remove();
        var groupname = '';
        var grouplist = '';
        var datas = '';
        var page = '';
        var time = '';
        var pages = '';
        var listtime = '';
        var listname = '';
        var y = '';
        var k = '';
        var n = '';
        var f = '';
        var s = '';
        var p = '';
        var w = '';
        var indexdata = [];
        var indexpage = [];
        var indextime = [];
        var indexpages = [];
        var listName = [];
        var listTime = [];
        var indexY = [];
        var indexK = [];
        var indexN = [];
        var indexF = [];
        var indexS = [];
        var indexP = [];
        var indexW = [];
        $.each(data.indexGroupList,function (index,item) {
            groupname += '<div class="userTitle">'+item.groupName+'</div>';
            $.each(item.indexDataList,function (index,items) {
                if(items.val == "null") {
                    grouplist += '<div><p><span class="list_name">'+items.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder">'+items.indexCommments+'</div><h5 style="font-size: 28px">不支持自定义</h5></div>';
                } else {
                    if(items.dod == "null") {
                        grouplist += '<div><p><span class="list_name">'+items.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder">'+items.indexCommments+'</div><h5>'+items.val+'</h5></div>';
                    } else {
                        grouplist += '<div><p><span class="list_name">'+items.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder">'+items.indexCommments+'</div><h5>'+items.val+'</h5><div class="database_cycle" style="display: flex;align-items: center;"><span>日</span><span>'+ uoDownDate(items.dod) +'</span></div><div class="database_cycle"><span>周</span><span>'+ uoDownDate(items.wow) +'</span></div><div class="database_cycle"><span>月</span><span>'+ uoDownDate(items.mom) +'</span></div></div>';
                    }
                }
            })
        });
        $.each(data.indexTrendDataList,function (index,item) {
            listname = item.indexName;
            listName.push(listname);
            if(item.indexKey == "orderUserCount") {
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
            if(item.indexKey == "newPayUserCount") {
                $.each(item.indexDataList,function (index, items) {
                    n = items;
                    indexN.push(n);
                })
            };
            if(item.indexKey == "rechargeUserCount") {
                $.each(item.indexDataList,function (index, items) {
                    f = items;
                    indexF.push(f);
                })
            };
            if(item.indexKey == "newRechargeUserCount") {
                $.each(item.indexDataList,function (index, items) {
                    s = items;
                    indexS.push(s);
                })
            };
            if(item.indexKey == "visitUserCount") {
                $.each(item.indexDataList,function (index, items) {
                    p = items;
                    indexP.push(p);
                })
            };
            if(item.indexKey == "newVisitUserCount") {
                $.each(item.indexDataList,function (index, items) {
                    w = items;
                    indexW.push(w);
                })
            };
        });
        // console.log(listName);
        $.each(data.xAxis,function (index,item) {
            listtime = item;
            listTime.push(listtime);
        });
        analysisList(listName,listTime,indexY,indexK,indexN,indexF,indexS,indexP,indexW,slected);

        $("#manage_name").html(groupname);
        $(".database").html(grouplist);
        //	因为数据是后期添加，如果没有先遮住，在请求数据期间只会显示两条线，非常难看
        $(".dividing-line").removeClass("hidden");
    })
};
// 获取用户画像数据
function userportrayal() {
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        useroperator = sessionStorage.getItem('storeSupplier_ID');
        $('#user_operator').addClass('none');
    }else {
        useroperator = $("#user_operator").val();
    }
    userterminal = $("#user_terminal").val();
    period = $("#analysisMonthStartTime").val();
    $.get(serverURL+"/rest/2.0/userAnalysis/userPortraitData",{
        supplierId: useroperator,
        terminalKey: userterminal,
        month: period
    },function (data) {
        // console.log(data)
        var areaName = [];
        var areaData = [];
        var mapData = [];
        var areacode = '';
        if(data.registUserCount == null&&data.payUserCount == null&&data.rechargeUserCount == null&&data.robotUserCount == null) {
            $(".found").show();
            $("#chart_pie").hide();
        } else {
            $(".found").hide();
            $("#chart_pie").show();
            chartPie(data.registUserCount,data.payUserCount,data.rechargeUserCount,data.robotUserCount);
        }
        if(data.newUserCount == null&&data.oldUserCount == null) {
            $(".found1").show();
            $("#chart_ratio").hide();
        } else {
            $(".found1").hide();
            $("#chart_ratio").show();
            $("#chart_ratio").show();
            chartRatio(parseFloat(data.newUserCount),parseFloat(data.oldUserCount));
        }
        if(data.userAreaList.length == 0) {
            $(".found2").show();
            $(".found3").show();
            $("#chart_map").hide();
            $("#chart_area").hide();
        } else {
            $(".found2").hide();
            $(".found3").hide();
            $("#chart_map").show();
            $("#chart_area").show();
            $.each(data.userAreaList,function (index,item) {
                if(item.userCount == null||item.userCount == NaN) {
                    item.userCount = '0';
                } else {
                    mapData.push({name:item.areaName, value:item.userCount, code:item.areaCode});
                    // areacode = item.areaCode;
                }
                areaName.push(item.areaName);
                areaData.push({value:item.userCount, name:item.areaName});
            });
            chartArea(areaName,areaData);
            if(data.mapUrl == null) {
                $(".found2").show();
                $("#chart_map").hide();
            } else {
                $(".found2").hide();
                $("#chart_map").show();
                chartMap(data.mapUrl,data.mapType,mapData);
            }
        }
    })
};
//在用户标签检索用户，excel导出
function queryExcel() {
    var dataTrade = urlTrade(execlTrade);
    window.location.href = serverURL + '/rest/2.0/userAnalysis/areaMonthNewUserDetailListExcel?' + dataTrade;
};
//将提供的参数转为字符串拼接
function urlTrade(data) {
    var param = "&supplierId=" + data.supplierId + "&terminalKey=" + data.terminalKey + "&month=" + data.month + "&areaCode=" + data.areaCode
        + "&sort=" + data.sort + "&order=" + data.order;

    return param;
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
    analysislist();
    //commodity();
});
$("#operator").change(function() {
    operatorid = $("#operator").val();
    analysislist();
    //commodity();
    //	将运营商ID存储到sessionStorage中
    sessionStorage.setItem("operatorId",$(this).val());
});
$("#terminal").change(function() {
    terminaluser = $("#terminal").val();
    analysislist();
    //commodity();
});
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
    analysislist();
    //commodity();
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
//月份周期点击查询
function monthTime(){
    var clenttimeOld = period;
    period = $("#analysisMonthStartTime").val();
    WdatePicker({isShowClear:true,isShowToday:false,readOnly:true,dateFmt:'yyyy-MM',maxDate:'%y-#{%M-1}'});
    if(clenttimeOld === period) {
        return false;
    };
    // console.log(period)
    userportrayal();
    // tabDetail();
    commodity();
};
$("#user_operator").change(function() {
    useroperator = $("#user_operator").val();
    userportrayal();
    // tabDetail();
    commodity();
    //	将运营商ID存储到sessionStorage中
    sessionStorage.setItem("operatorId",$(this).val());
});
$("#user_terminal").change(function() {
    userterminal = $("#user_terminal").val();
    userportrayal();
    // tabDetail();
    commodity();
});
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
function reminderover(_this) {
    $(_this).parent().next(".reminder").show();
};
function reminderout(_this) {
    $(_this).parent().next(".reminder").hide();
};
function analysisList(data,time,y,k,n,f,s,p,w,slect) {
    var myChart = echarts.init(document.getElementById('analysislist'));
    var option = {
        title: {
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:data,
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
            }
        ],
        series: [
            {
                name:'下单用户数',
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
                name:'成交用户数',
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
                name:'首次成交用户数',
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
                name:'储值用户数',
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
                name:'首次储值用户数',
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
                name:'新访问用户数',
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
                data:w,
                yAxisIndex: 5
            } ,
            {
                name:'访问用户数',
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
                data:p,
                yAxisIndex: 6
            }
        ]
    };
    myChart.setOption(option);
    //监听legend点击事件获取配置信息
    myChart.on("legendselectchanged", function (param) {
        slected=param.selected;
    });
};
function chartPie(regist, pay, recharge, robot) {
    var myChart = echarts.init(document.getElementById('chart_pie'));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            x : 'center',
            y : '90%',
            data:['注册用户','下单用户','储值用户','机器人储值用户']
        },
        series: [
            {
                name:'',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '24',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:regist, name:'注册用户'},
                    {value:pay, name:'下单用户'},
                    {value:recharge, name:'储值用户'},
                    {value:robot, name:'机器人储值用户'}
                ]
            }
        ]
    };
    myChart.setOption(option);
};
function chartRatio(news, old) {
    var myChart = echarts.init(document.getElementById('chart_ratio'));
    var spirit = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAABECAYAAAALKIy7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0Q0QzRFNzM2NjI3MTFFN0FEQkFBNDlCNjNFQzNENkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0Q0QzRFNzQ2NjI3MTFFN0FEQkFBNDlCNjNFQzNENkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3RDRDNEU3MTY2MjcxMUU3QURCQUE0OUI2M0VDM0Q2RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3RDRDNEU3MjY2MjcxMUU3QURCQUE0OUI2M0VDM0Q2RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkwKiQAAAAO4SURBVHja7JlLSFRRGMfvjK80LKOX5qL3mC0iiMAWCVoULbRNBdLDJCHa1CKooLJoURkYtigqo6iVVFAWtGhhBEX0liAptYdliZQRiD10HPt/9U0dLudcz9x77rS5H/yYmfN9c/17Ht/5zpnQy/ISy6Vlg82gFMwCHaAZnAJ9ug+JNDX/fZ/qUsgicA4UCG2zwQpQDarAvUQfGnYhJBfcsAkRrYD9uckQUwdyRojJ4ThfxWSAYs3YYo73TcwkkKkZm8nxvon5BoY0Y4c43jcxX0CPZmwPx/smZhjUaMbWcLyvq+kqqB0hppbjfF/aZLtAJXgIotwW5c+V7E/Y3GZgsgvMeDAVdIJeD8/zJGYMJ7cY6AKjwBQW9DMZYkjAarAcLAD5nNhoooZ4Kb8DD8BNnjf9psWMA9vARh4Su4X4NQvMYTbwTn4G1Ov0ls4E3gKegn0KIU5GpcVh0ALKvIo5Bk64EGE36qlr3FuuxNB/tNUya+fBqkTFrAc7LX/sEpivKyaPh8dPOy1MekcxJ3n1+GkLZVnaLoaK63IrObab85RSzHYreTYa7FCJoZywbIRiyY31ckaWWUXbytIsmZh1iozcDRoSrU0ESwf7wWOJbyJYaxdDr2sUD6N03uhhU83mDF6v8FfZxdCmV6gIbvBQ94gb7EXwXeIrwlDNFcUsVTyEiqX33J1ejFLFALil2GTLRDFFiofcF3ZjL5bOr48U/sVxMWkOR9X4eTnNo5j4P31X4S/EUGVQ0ATFuXjQYUm6NZrIXyXtVCHmk5jpYKwkoB28MizmE2iVtFPJGgnzVYbMWoXcEjIo6IWifR6JiSic7QaONLLs3aGImRl2mLxtkhrXrQ0I718rYmY4ifloaFiGhYMe2RtF3DQS80Pi+ACeGOqZIT5bWUKuuSObSyTmssRxFHw2JCZmmzP0eY9N4O/qjza/szyJl3AOoPu444pzkdthsv/h27wfVnCOuxJpar6eymt/E++u/ZIvmpgzsvKDzlItqqvXPus/W6rH71NJcAC85RJkr2RIY7q97VUMrcQ63scmc5GdYouJ6pasXjNrWKjw8xxWU9SkmJCGL+SQZ5LSM7p5JhaISSDP+DJnki4mKRaICcQEYgIxgZhATCDGgJiwQ2kR96VIivF4e9ikGFU9kiL4Bh1OIAMmxXQp2ung1x0/uINnkhi6x+s1KYauTDsl7Qetf3e79BvkIZufeqtWt9LTPcTRebyYbydKuDeOWH9+1xatkUVXc6/RhfZz3Qn8S4ABAIJ1ww/imaCIAAAAAElFTkSuQmCC';

    var maxData = news+old;

    option = {
        tooltip: {
        },
        xAxis: {
            show: false,
            max: maxData,
            splitLine: {show: false},
            offset: 10,
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            axisLabel: {
                margin: 10
            }
        },
        yAxis: {

            data: [],
            inverse: true,
            axisTick: {show: false},
            axisLine: {show: false},
            axisLabel: {
                margin: 10,
                textStyle: {
                    color: '#999',
                    fontSize: 16
                }
            }
        },
        grid: {
            top: 'center',
            height: 80,
            left: 100,
            right: 100
        },
        series: [{
            name: '新用户',
            type: 'pictorialBar',
            symbol: spirit,
            symbolRepeat: 'fixed',
            symbolMargin: '5%',
            symbolClip: true,
            symbolSize: [35, 68],
            symbolBoundingData: maxData,
            data: [news],
            label: {
                normal: {
                    show: true,
                    formatter: function (params) {
                        return (params.value / maxData * 100).toFixed(1) + ' %';
                    },
                    position: 'outside',
                    offset: [10, 0],
                    textStyle: {
                        color: 'green',
                        fontSize: 18
                    }
                }
            },
            markLine: {
                symbol: 'none',
                label: {
                    normal: {
                        formatter: '新用户: {c}',
                        position: 'start'
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'green',
                        type: 'dotted',
                        opacity: 0.2,
                        width: 2
                    }
                },
                data: [{
                    type: 'max'
                }]
            },
            z: 10
        }, {
            name: '老用户',
            type: 'pictorialBar',
            itemStyle: {
                normal: {
                    opacity: 0.2
                }
            },
            animationDuration: 0,
            symbolRepeat: 'fixed',
            symbolMargin: '5%',
            symbol: spirit,
            symbolSize: [35, 68],
            symbolBoundingData: maxData,
            data: [old],
            z: 5
        }]
    };
    myChart.setOption(option);
};
function chartArea(name, data) {
    if(data == null) {
        return false;
    }
    var myChart = echarts.init(document.getElementById('chart_area'));
    option = {
        title: {
            text: '',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: '{b}:{c}'
        },
        legend: {
            data: []
        },
        grid: {
            top:'2%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            show: false,
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            show: true,
            data: name
        },
        series: [
            {
                name: '',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                barWidth : 30,//柱图宽度
                type: 'bar',
                data: data
            }
        ]
    };
    myChart.setOption(option);
};
function chartMap(hicky, id, data) {
    if(id == null) {
        return false;
    }
    var myChart = echarts.init(document.getElementById('chart_map'));
    myChart.showLoading();
    myChart.on('click', function (params) {
        // userportrayal();
        // console.log(params.data.code);
        // console.log(params)
        // tabDetail(code);
        if(!params.data.code){
            commodity("unknown");
        }else{
            commodity(params.data.code);
        }
    });
    $.get(hicky, function (geoJson) {

        myChart.hideLoading();

        echarts.registerMap(id, geoJson);

        myChart.setOption(option = {
            title: {
                text: '',
                subtext: '',
                sublink: 'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params,ticket,callback) {
                    var $Map = params.value;
                    var res = '';
                    if(isNaN($Map)) {
                        res = '0';
                    } else {
                        res = $Map;
                    }
                    setTimeout(function (){
                        callback(ticket, res);
                    },1000)
                    return ''+params.name+':<br/>'+res+'';
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            visualMap: {
                min: 100,
                max: 10000,
                text:['High','Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#9cd9af','#45b765', '#229342']
                }
            },
            series: [
                {
                    name: '',
                    type: 'map',
                    mapType: id, // 自定义扩展图表类型
                    itemStyle:{
                        normal:{label:{show:false}},
                        emphasis:{label:{show:true}}
                    },
                    data:data
                    // [
                    //     {name: '中西区', value: 20057.34},
                    //     {name: '湾仔', value: 15477.48},
                    //     {name: '东区', value: 31686.1},
                    //     {name: '南区', value: 6992.6},
                    //     {name: '油尖旺', value: 44045.49},
                    //     {name: '深水埗', value: 40689.64},
                    //     {name: '九龙城', value: 37659.78},
                    //     {name: '黄大仙', value: 45180.97},
                    //     {name: '观塘', value: 55204.26},
                    //     {name: '葵青', value: 21900.9},
                    //     {name: '荃湾', value: 4918.26},
                    //     {name: '屯门', value: 5881.84},
                    //     {name: '元朗', value: 4178.01},
                    //     {name: '北区', value: 2227.92},
                    //     {name: '大埔', value: 2180.98},
                    //     {name: '沙田', value: 9172.94},
                    //     {name: '西贡', value: 3368},
                    //     {name: '离岛', value: 806.98}
                    // ]
                }
            ]
        });
    });
}
//  根据页数改变高度
var layerSize = 10;
$(document).on("change",".pagination-page-list",function(){
    layerSize = $(this).val();
    var $layer = $(".layer");
    switch(parseInt($(this).val())){
        case  10:$layer.css("height","450px");
            break;
        case  20:$layer.css("height","810px");
            break;
        case  30:$layer.css("height","1200px");
            break;
        case  40:$layer.css("height","1570px");
            break;
        case  50:$layer.css("height","1940px");
            break;
    }
    init();
});

init();
//  这个是商品类别列表插件初始化，为最开始阶段；
function init() {
    $('#winNorm').window({
        width: 600,
        height: 400,
        top: 100,
        title: " ",
        draggable: false,
        maximizable: false,
        collapsible: false,
        minimizable: false,
        resizable: false,
        modal: true
    });
    $('#winNorm').window('close');

    // ----------------datagrid插件初始设置----------------
    $('#dataList').datagrid({
        method: 'get',
        //fitColumns: true,
        fit: true,
        striped: true,
        singleSelect: true,
        rownumbers: true,
        pagination: true,
        allowCellWrap: true,
        nowrap: false,
        pageSize: layerSize,
        pageList: [10,20,30,40,50],
        //当hidden：true时隐藏列
        columns: [[
            {
                field: 'userId',
                title: '用户ID',
                order: 'desc',
                sortable: true,
                width: 100,
                align: 'center',
                align: 'center',
                formatter: function (val, row) {

                    return "<a class='a_id ' href='#panel_singleUserInformation' onclick=\"messageDetailsByParameter('"
                        + row.userId + "','" + row.userName + "','" + row.name + "','" + row.mobile + "','" + row.sex + "','"
                        + row.age + "','" + row.province + "');return true\"> " + val + " </a>";
                }
            },
            {
                field: 'userName',
                title: '用户名',
                order: 'desc',
                sortable: true,
                width: 150,
                align: 'center',
                align: 'center'
            },
            {field: 'name', title: '姓名', order: 'desc', sortable: true, width: 150, align: 'center', align: 'center'},
            {
                field: 'mobile',
                title: '手机号码',
                order: 'desc',
                sortable: true,
                width: 100,
                align: 'center',
                align: 'center'
            },
            {field: 'sex', title: '性别', order: 'desc', sortable: true, width: 50, align: 'center', align: 'center'},
            {field: 'age', title: '年龄', order: 'desc', sortable: true, width: 50, align: 'center', align: 'center'},
            {
                field: 'province',
                title: '省份',
                order: 'desc',
                sortable: true,
                width: 100,
                align: 'center',
                align: 'center'
            },
            {field: 'registerTime', title: '注册时间', width: 120, order: 'desc', sortable: true, align: 'center'},
            {field: 'rechargeType', title: '储值用户类型', order: 'desc', sortable: true, align: 'center'},
            {field: 'recentPayDate', title: '最新一次消费时间', width: 120, order: 'desc', sortable: true, align: 'center'},
            {field: 'recentVisitDate', title: '最近一次访问时间', width: 120, order: 'desc', sortable: true, align: 'center'},
            {field: 'payAmount', title: '消费金额', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'payCount', title: '消费次数', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'pvCount', title: '访问页面总数', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'activeDays', title: '活跃天数', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'dailyVisitHours', title: '日均访问时长', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'shareCount', title: '分享次数', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'cardBuyCount', title: '购买网销卡次数', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'rechargeAmount', title: '充值金额', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'commentCount', title: '商品评价次数', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'showPicCount', title: '商品晒图次数', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'clickGoodsItems', title: '点击商品数', order: 'desc', sortable: true, width: 120, align: 'center'},
            {field: 'clickGoodsTimes', title: '点击商品次数', order: 'desc', sortable: true, width: 120, align: 'center'},

            {
                field: 'refundCount',
                title: '退货次数',
                order: 'desc',
                sortable: true,
                width: 120,
                align: 'center',
                hidden: 'true'
            },
            {field: 'complainCount', title: '投诉次数', order: 'desc', sortable: true, width: 120, align: 'center'},
        ]],
        onClickRow: function (rowIndex, rowData) {
            // clickRowSetting(rowIndex);
        }
    });
}
function commodity(code) {
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#users_operator').addClass('none');
        useroperator = operatorid;
    }else {
        useroperator = $("#user_operator").val();
    }
    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#dataList').datagrid('options').queryParams;

    if(!code){
        code = '';
    }

    //给接口配置参数；
    searchCondition(queryParams,code);

    $('#dataList').datagrid('options').queryParams = queryParams;
    $('#dataList').datagrid('options').url = serverURL + '/rest/2.0/userAnalysis/areaMonthNewUserDetailList';
    $("#dataList").datagrid('reload');

//     //商品分析excel 参数存储
    execlTrade = new Object();

    execlTrade.supplierId = useroperator;
    execlTrade.terminalKey = userterminal;
    execlTrade.month = period;
    execlTrade.areaCode = code;
    execlTrade.sort = '';
    execlTrade.order = '';
}
function searchCondition(queryParams,code){
     //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#users_operator').addClass('none');
        useroperator = operatorid;
    }else {
        useroperator = $("#user_operator").val();
    }
    queryParams.areaCode = code;
    queryParams.supplierId = useroperator;
    queryParams.terminalKey = $("#terminal").val();
    queryParams.month = period;
    queryParams.page = pages;
    queryParams.rows = 20;
    queryParams.sort =  '';
    queryParams.order = '';
    //排序字段 order by ，默认为pageName
    //可不传  排序规则 asc/desc，默认为AS
}


/*
 封装成构造函数 第一个参数：表格元素；
 * */
var customizeCommodity = new customize($('#dataList'));
customizeCommodity.follow();   // 调用滚动函数


function customize(self){
    this.self = self;   //  所属列表
    this.follow = function(){
        /*  默认100高度距离body顶部
         给自定义按钮弹出框，在滚动时跟随页面，位于页面中心
         window.onscroll  系统的滚动事件
         */
        var varTop = 100;
        window.onscroll = function () {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            varTop = t + 100;
            $('#winNorm').window('move', {
                top: varTop
            });
        };
        $("#trade_list").change(function() {
            dealOperator = $("#trade_list").val();
            // tradelists();
            commodity();
        });
    },
//  自定义按钮点击事件
        this.showGridColum = function(){
//      默认保存预设值
            this.defultColumsStr = (this.defultColumsStr === null || this.defultColumsStr === undefined || this.defultColumsStr === "") ? this.defultColums() : this.defultColumsStr;

            var showDom = "";
            var rows = -1;
            var columnsDataCheck = $("#columnsDataCheck");

            columnsDataCheck.empty();

            var columsArray = $(this.self.datagrid('options').columns[0]);
            //不显示 用户ID
            columsArray.splice(0, 1);

            $.each(columsArray,function(index,val){

                //  制作成一个表格
                if (index % 4 === 0) {
                    columnsDataCheck.append("<tr></tr>");
                    rows++;
                }

                var hiddenFlag = "";//默认显示

                if(!val.hidden){
                    hiddenFlag = "checked='true'";//默认显示
                }

                showDom = '<td style="padding:2px;"><input type="checkbox" style="vertical-align:sub" name="columnsDataGroup" value="' + val.field + '" ' + hiddenFlag + '/>&nbsp;' + val.title + '</td>';
                $(document.getElementById("columnsDataCheck").rows[rows]).append(showDom);
            });
            $('#winNorm').window('open');

        },
//   默认系统 保存指标显示
        this.defultColums = function(){
            var columsArray = (this.self.datagrid('options').columns)[0];
            var flag = "";

            for (var i = 0; i < columsArray.length; i++) {
                if (i == columsArray.length - 1) {
                    flag += columsArray[i].hidden ? "" : "checked";
                } else {
                    flag += columsArray[i].hidden ? "" : "checked";
                    flag += ",";
                }
            }
            return flag;
        },
//  自定义指标默认
        this.columnsCheckedSelectDefult = function() {
            //默认保存预设值
            var groups = $('input[type=checkbox][name=columnsDataGroup]');
            var tempArray = this.defultColumsStr.split(',');

            //ID的下标，跳过
            tempArray.splice(0, 1);

            for (var i = 0; i < groups.length; i++) {
                groups[i].checked = tempArray[i];
            }
        },
//  自定义指标全选。
        this.columnsCheckedSelectTrue = function (){
            $('input[type=checkbox][name=columnsDataGroup]').prop("checked", true);
        },
//  自定义指标取反
        this.columnsCheckedSelectNOT = function() {
            var groups = $('input[type=checkbox][name=columnsDataGroup]');
            for (var i = 0; i < groups.length; i++) {
                groups[i].checked = groups[i].checked ? false : true;
            }
        },
//  返回用户标签页面
        this.touserTabsPage = function() {
            var urlPath = serverURL + "/rest/1.0/userLabelController/userLabelPage";
            location.href = urlPath;
        },
//  关闭窗口
        this.closWinButton = function() {
            $('#winNorm').window('close');
        },
//  确认,显示或隐藏 自定义列
        this.makeGridColum = function() {
            var _this = this.self;
            var values = $("input[type=checkbox][name=columnsDataGroup]");
            if (values.length < 1) {
                alert("请至少选择一个列");
                return false;
            }
            $.each(values,function(index,val){
                if (val.checked) {
                    _this.datagrid('showColumn', val.value);//显示 隐藏列
                } else {
                    _this.datagrid('hideColumn', val.value);// 隐藏列
                }
            });
            $('#winNorm').window('close');
        }

}








