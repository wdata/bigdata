var operatorid = '';
var terminaluser = '';
var visitPages = document.getElementById("visitpage");
var visitTime = document.getElementById("visittime");
var dateRangetype = '1';
var dateRangestart = $("#stateTime").val();
var dateRangeend = $("#endTime").val();
var statetime = '';
var endtime = '';
var pages = '1';
var sizes = 1;
var totals = '';
var datalist = '';

//初始化信息时的显示配置信息
var slected={
    '浏览量': false,
    '商品访客数': false,
    '商品浏览量': false,
    '商品曝光次数': false,
    '分享访问人数': false,
    '分享访问次数': false
};
document.getElementById("stateTime").value = GetDateStr(-1);
document.getElementById("endTime").value = GetDateStr(-1);
//用于存取excel提交参数暂存
var execlParameter = {};
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
        // 获取终端（平台）列表
        $.get(serverURL+"/rest/1.0/commonData/terminalList",function (data) {
            // console.log(data);
            var terminalList = '';
            $.each(data,function (index,items) {
                terminalList += '<option value='+items.key+'>'+items.value+'</option>'
            });
            $("#terminal").html(terminalList);
            analysislist(); //图表，概况接口
            // tabDetail(); //页面详情接口
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
//获取某一个时间范围的流量分析数据
function analysislist() {
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        operatorid = $("#operator").val();
    }
    terminaluser = $("#terminal").val();
    $.get(serverURL+"/rest/2.0/flowAnalysis/summaryData",{
        supplierId: operatorid,
        terminalKey: terminaluser,
        dateRangeType: dateRangetype,
        dateRangeStart: dateRangestart,
        dateRangeEnd: dateRangeend
    },function (data) {
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
            groupname += '<div class="col-md-4">'+item.groupName+'</div>';
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
            if(item.indexKey == "pageViewUserCount") {
                $.each(item.indexDataList,function (index, items) {
                    y = items;
                    indexY.push(y);
                })
            };
            if(item.indexKey == "pageViewCount") {
                $.each(item.indexDataList,function (index, items) {
                    k = items;
                    indexK.push(k);
                })
            };
            if(item.indexKey == "clickGoodsUserCount") {
                $.each(item.indexDataList,function (index, items) {
                    n = items;
                    indexN.push(n);
                })
            };
            if(item.indexKey == "clickGoodsCount") {
                $.each(item.indexDataList,function (index, items) {
                    f = items;
                    indexF.push(f);
                })
            };
            if(item.indexKey == "showGoodsCount") {
                $.each(item.indexDataList,function (index, items) {
                    s = items;
                    indexS.push(s);
                })
            };
            if(item.indexKey == "shareClickUserCount") {
                $.each(item.indexDataList,function (index, items) {
                    p = items;
                    indexP.push(p);
                })
            };
            if(item.indexKey == "shareClickCount") {
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
        echartlist(listName,listTime,indexY,indexK,indexN,indexF,indexS,indexP,indexW,slected);
        // $.each(data.avgVisitTrendDataList,function (index,item) {
        //     indexname = item.indexName;
        // });
        // 人均访问页面
        $.each(data.avgVisitTrendDataList[0].indexDataList,function (index, item) {
            datas = item;
            indexdata.push(datas);
        });
        // 人均访问时长
        $.each(data.avgVisitTrendDataList[1].indexDataList,function (index, item) {
            pages = item;
            indexpages.push(pages);
        });
        visitPage(visitPages,listTime,'人均访问页面',indexdata,"");
        visitPage(visittime,listTime,'人均访问时长',indexpages,' 分钟');

        $("#manage_name").html(groupname);
        $("#data_list").html(grouplist);
        $(".dividing-line").removeClass("hidden");
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
    analysislist();
    commodity();
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
}
// $(".query_condition > span").click(function() {
//     dateRangetype = $(this).find("input").val();
//     $("#list").find('tr').remove();
//     analysislist();
//     // tabDetail();
//     commodity();
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
    analysislist();
    commodity();
});
$("#operator").change(function() {
    operatorid = $("#operator").val();
    analysislist();
    // tabDetail();
    commodity();
    //	将运营商ID存储到sessionStorage中
    sessionStorage.setItem("operatorId",$(this).val());
});
$("#terminal").change(function() {
    terminaluser = $("#terminal").val();
    analysislist();
    // tabDetail();
    commodity();
});
function reminderover(_this) {
$(_this).parent().next(".reminder").show();
};
function reminderout(_this) {
    $(_this).parent().next(".reminder").hide();
};
//在用户标签检索用户，excel导出
function queryExcel() {
    var dataParameter = urlSetData(execlParameter);
    window.location.href = serverURL + '/rest/2.0/flowAnalysis/pageDetailExcel?' + dataParameter;
}
//将提供的参数转为字符串拼接
function urlSetData(data) {
    /*获得当前列表排序字段 以及 排序规则*/
    // var dataListOptions = $("#dataList").datagrid("options");

    /*用户不点击排序时，默认设置排序字段*/
    // var sortName = isEmpty_var(dataListOptions.sortName) ? "userId" : dataListOptions.sortName;
    // var sortOrder = isEmpty_var(dataListOptions.sortOrder) ? "ASC" : dataListOptions.sortOrder;

    var param = "&supplierId=" + data.supplierId + "&terminalKey=" + data.terminalKey + "&dateRangeType=" + data.dateRangeType + "&dateRangeStart=" + data.dateRangeStart
        + "&dateRangeEnd=" + data.dateRangeEnd + "&sort=" + data.sort + "&order=" + data.order;

    return param;
}
function echartlist(data,time,y,k,n,f,s,p,w,slect) {
    var myChart = echarts.init(document.getElementById('analysislist'));
    var option = {
        title: {
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:data,
            selected: slect,
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
                name:'访客数',
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
                name:'浏览量',
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
                name:'商品访客数',
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
                name:'商品浏览量',
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
                name:'商品曝光次数',
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
                name:'分享访问人数',
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
                name:'分享访问次数',
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
            }
        ]
    };
    myChart.setOption(option);
    //监听legend点击事件获取配置信息
    myChart.on("legendselectchanged", function (param) {
        slected=param.selected;
    });
};
function closWinButton() {//关闭窗口
    $('#winNorm').window('close');
}

function makeGridColum() {
    var values = $("input[type=checkbox][name=columnsDataGroup]");
    var valLength = values.length;
    if (valLength < 1) {
        alert("请至少选择一个列");
        return false;
    }
    for (var i = 0; i < values.length; i++) {
        if (values[i].checked) {
            $('#dataList').datagrid('showColumn', values[i].value);//显示 隐藏列
        } else {
            $('#dataList').datagrid('hideColumn', values[i].value);// 隐藏列
        }
    }

    $('#winNorm').window('close');
};

function visitPage(id,data,serie_name,serie_data,unit) {
	var myChart = echarts.init(id);
	var option = {
	    title: {
	    },
	    legend: {
	    },
	    tooltip : {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross',
	            label: {
	            	precision: 2,
	                backgroundColor: '#ccc'
	            }
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
	            boundaryGap : false,
	            data : data
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
                axisLabel: {
                    formatter: function (val) {
                        return val + unit;
                    }
                }
	        }
	    ],
	    series : [
	        {
	            name:serie_name,
	            type:'line',
	            stack: '总量',
	            smooth: true,
	            itemStyle:{
	            	normal:{
	            		lineStyle:{
	            			color: '#3d94e4',
	            			width: 3
	            		}
	            	}
	            },
	            areaStyle: {normal: {
	                shadowColor: 'rgba(0, 0, 0, 0.5)',
	                shadowBlur: 10,
	                color: '#d6eefb'
	            }},
	            data:serie_data
	        }
	    ]
	};
	myChart.setOption(option);
}
// };

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
                field: 'pageId',
                title: '页面id',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {field: 'pageName', title: '页面名称', order: 'desc', sortable: true,width: 200, align: 'center'},
            {field: 'pageType', title: '页面类型', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'pageViewCount', title: '浏览量', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'pageViewUserCount', title: '访客数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'shareClickCount', title: '分享访问次数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'shareClickUserCount', title: '分享访问人数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'avgDuration', title: '单次访问时长', order: 'desc', sortable: true, width: 140, align: 'center'}
            //如果要增加隐藏数据，则使用下面的例子依次添加
        //     {
        //         field: 'exposeCount',
        //         title: '曝光次数',
        //         hidden: 'true',
        //         order: 'desc',
        //         sortable: true,
        //         width: 140,
        //         align: 'center'
        //     }
        ]],
        onClickRow: function (rowIndex, rowData) {
            // clickRowSetting(rowIndex);
        }
    });
}
function commodity() {
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        operatorid = $("#operator").val();
    };
    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#dataList').datagrid('options').queryParams;

    //给接口配置参数；
    searchCondition(queryParams);

    $('#dataList').datagrid('options').queryParams = queryParams;
    $('#dataList').datagrid('options').url = serverURL + '/rest/2.0/flowAnalysis/pageDetail';
    $("#dataList").datagrid('reload');


//     //excel 参数存储
    execlParameter = new Object();

    execlParameter.supplierId = operatorid;
    execlParameter.terminalKey = terminaluser;
    execlParameter.dateRangeType = dateRangetype;
    execlParameter.dateRangeStart = dateRangestart;
    execlParameter.dateRangeEnd = dateRangeend;
    execlParameter.sort = '';
    execlParameter.order = '';
}
function searchCondition(queryParams){
    queryParams.supplierId = operatorid;
    queryParams.terminalKey = $("#terminal").val();
    queryParams.dateRangeType = dateRangetype;
    queryParams.dateRangeStart = dateRangestart;
    queryParams.dateRangeEnd = dateRangeend;
    queryParams.page = pages;
    queryParams.rows = 20;
    queryParams.sort =  '';
    queryParams.order = '';
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



