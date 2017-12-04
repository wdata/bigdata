var supplierJID;//是否运营商
var operatorid = '';
var terminaluser = '';
var dateRangetype = '1';
var dateRangestart = $("#stateTime").val();
var dateRangeend = $("#endTime").val();
var classifyid = '';
var pages = '1';
var pagination = '1';
var sizes = 1;
var totals = '';
var totals1 = '';

//初始化信息时的显示配置信息
var slected={
    '被访问商品数': false,
    '商品访客数(商品UV)': false,
    '商品浏览量(商品PV)': false,
    '付款商品次数': false,
    '商品详情页转化率': false
};
document.getElementById("stateTime").value = GetDateStr(-1);
document.getElementById("endTime").value = GetDateStr(-1);
//用于存取商品分析excel提交参数暂存
var execlTrade = {};
//用于存取品味分析excel提交参数暂存
var execlCategory = {};

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
            terminaluser = $("#terminal").val();
            goodslist();
            commodity();
            category();
        },"json");
    },"json");
    // 获取各页面对报表数据的通用说明文字
    $.get(serverURL+"/rest/1.0/commonData/generalDataComments",function (data) {
        // console.log(data);
        $(".hint").html(data);
    });

};
manageHead();
function goodslist() {
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        operatorid = $("#operator").val();
    }
    terminaluser = $("#terminal").val();
    $.get(serverURL+"/rest/2.0/goodsAnalysis/summaryData",{
        supplierId: operatorid,
        terminalKey: terminaluser,
        dateRangeType: dateRangetype,
        dateRangeStart: dateRangestart,
        dateRangeEnd: dateRangeend
    },function (data) {
        // console.log(data)
        var groupname = '';
        var grouplist = '';
        var tradelist = '';
        $.each(data.indexGroupList,function (index,items) {
            groupname += '<div class="col-md-4">'+items.groupName+'</div>';
            $.each(items.indexDataList,function (index,item) {
                if(item.val == "null") {
                    grouplist += '<div><p style="width: 170px"><span class="list_name">'+item.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder" style="left: 185px">'+item.indexCommments+'</div><h5 style="font-size: 28px">不支持自定义</h5></div>';
                } else {
                    if(item.dod == "null") {
                        grouplist += '<div><p style="width: 170px"><span class="list_name">'+item.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder" style="left: 185px">'+item.indexCommments+'</div><h5>'+item.val+'</h5></div>';
                    } else {
                        grouplist += '<div><p><span class="list_name">'+item.indexName+'</span><span class="detail" onmouseover="reminderover(this)" onmouseout="reminderout(this)"></span></p><div class="reminder">'+item.indexCommments+'</div><h5>'+item.val+'</h5><div class="database_cycle" style="display: flex;align-items: center;"><span>日</span><span>'+ uoDownDate(item.dod) +'</span></div><div class="database_cycle"><span>周</span><span>'+ uoDownDate(item.wow) +'</span></div><div class="database_cycle"><span>月</span><span>'+ uoDownDate(item.mom) +'</span></div></div>';
                    }
                }
            });
        });
        $.each(data.goodsClassifyList,function (index,item) {
            tradelist +='<option value='+item.key+'>'+item.value+'</option>';
        });
        $("#trade_list").html(tradelist);
        $("#manage_name").html(groupname);
        $(".database").html(grouplist);
        //	因为数据是后期添加，如果没有先遮住，在请求数据期间只会显示两条线，非常难看
        $(".dividing-line").removeClass("hidden");


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
            if(item.indexKey == "shelfCount") {
                $.each(item.indexDataList,function (index, items) {
                    y = items;
                    indexY.push(y);
                })
            };
            if(item.indexKey == "clickGoodsItemCount") {
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
            if(item.indexKey == "goodsPayCount") {
                $.each(item.indexDataList,function (index, items) {
                    s = items;
                    indexS.push(s);
                })
            };
            if(item.indexKey == "payRate") {
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
        // console.log(indexname)
        chartList(indexname,indextime,indexY,indexK,indexN,indexF,indexS,indexP,slected);
    });
};
function reminderover(_this) {
$(_this).parent().next(".reminder").show();
};
function reminderout(_this) {
    $(_this).parent().next(".reminder").hide();
};
//在用户标签检索用户，excel导出
function tradeExcel() {
    var dataTrade = urlTrade(execlTrade);
    window.location.href = serverURL + '/rest/2.0/goodsAnalysis/goodsListExcel?' + dataTrade;
}
function categoryExcel() {
    var dataCategory = urlCategory(execlCategory);
    window.location.href = serverURL + '/rest/2.0/goodsAnalysis/classifyListExcel?' + dataCategory;
}
//将提供的参数转为字符串拼接
function urlTrade(data) {
    var param = "&classifyId=" + data.classifyId+"&supplierId=" + data.supplierId + "&terminalKey=" + data.terminalKey + "&dateRangeType=" + data.dateRangeType + "&dateRangeStart=" + data.dateRangeStart
        + "&dateRangeEnd=" + data.dateRangeEnd + "&sort=" + data.sort + "&order=" + data.order;

    return param;
};
function urlCategory(data) {
    var params = "&supplierId=" + data.supplierId + "&terminalKey=" + data.terminalKey + "&dateRangeType=" + data.dateRangeType + "&dateRangeStart=" + data.dateRangeStart
        + "&dateRangeEnd=" + data.dateRangeEnd + "&sort=" + data.sort + "&order=" + data.order;

    return params;
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
    goodslist();
    commodity();
    category();
});
$("#operator").change(function() {
    operatorid = $("#operator").val();

    $("#trade_list").val("");// 选择运营商后，将分类的值清空；以此解决选择运营商后，接口带分类ID问题

    goodslist();
    commodity();
    category();
    //	将运营商ID存储到sessionStorage中
    sessionStorage.setItem("operatorId",$(this).val());
});
$("#terminal").change(function() {
    terminaluser = $("#terminal").val();
    goodslist();
    commodity();
    category();
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
    goodslist();
    commodity();
    category();
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

//图表数据
function chartList(names,times,y,k,n,f,s,p,slect) {
    var myChart = echarts.init(document.getElementById('userTrendPanel'));
    var option = {
        title: {
            // text: '多个y轴的例子'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:names,
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
            data: times
        },
        yAxis: [
            {
                type: 'value',
                show: false
            }, {
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
                name:'在架商品数',
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
                name:'被访问商品数',
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
                name:'商品访客数(商品UV)',
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
                name:'商品浏览量(商品PV)',
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
                name:'付款商品次数',
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
                name:'商品详情页转化率',
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
}

//  根据页数改变高度
var layerSizeOne = 10;
$(document).on("change",".layerOne .pagination-page-list",function(){
    layerSizeOne = $(this).val();
    var $layer = $(".layerOne");
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
var layerSizeTwo = 10;
$(document).on("change",".layerTwo .pagination-page-list",function(){
    layerSizeTwo = $(this).val();
    var $layer = $(".layerTwo");
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
        pageSize: layerSizeOne,
        pageList: [10,20,30,40,50],
        //当hidden：true时隐藏列
        columns: [[
            {
                field: 'goodsId',
                title: '商品Id',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                height:40,
                align: 'center'
            },
            {field: 'goodsName', title: '商品', order: 'desc', sortable: true, width: 300,  align: 'center'},
            {field: 'clickUserCount', title: '详情页访客数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payOrderCount', title: '有效订单数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payGoodsCount', title: '销售数量', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payGoodsAmount', title: '销售金额', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'avgUserPrice', title: '客单价', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payRate', title: '单品转化率', order: 'desc', sortable: true, width: 140, align: 'center'},
            {
                field: 'exposeCount',
                title: '曝光次数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'exposeUserCount',
                title: '曝光人数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'clickCount',
                title: '点击次数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'orderCount',
                title: '下单次数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'orderUserCount',
                title: '下单人数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },

            {
                field: 'payUserCount',
                title: '付款人数',
                hidden: 'true',
                order: 'desc', sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'refundOrderCount',
                title: '退货次数',
                hidden: 'true',
                order: 'desc', sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'refundUserCount',
                title: '退货人数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'orderRate',
                title: '下单转化率',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            }
        ]],
        onClickRow: function (rowIndex, rowData) {
            // clickRowSetting(rowIndex);
        }
    });

    $('#categoryList').datagrid({
        method: 'get',
        //fitColumns: true,
        fit: true,
        striped: true,
        singleSelect: true,
        rownumbers: true,
        pagination: true,
        allowCellWrap: true,
        nowrap: false,
        pageSize: layerSizeTwo,
        pageList: [10,20,30,40,50],
        //当hidden：true时隐藏列
        columns: [[
            {
                field: 'classifyId',
                title: '分类id',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {field: 'classifyName', title: '商品分类', width: 140, order: 'desc', sortable: true, align: 'center'},
            {field: 'payGoodsItemCount', title: '销售商品数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payGoodsCount', title: '销售数量', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payGoodsItemRate', title: '销售量占比', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payGoodsAmount', title: '销售金额', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'avgUserPrice', title: '客单价', order: 'desc', sortable: true, width: 140, align: 'center'},
            {
                field: 'exposeCount',
                title: '曝光次数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'exposeUserCount',
                title: '曝光人数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'clickCount',
                title: '点击次数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'clickUserCount',
                title: '点击人数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'orderCount',
                title: '下单次数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },

            {
                field: 'orderUserCount',
                title: '下单人数',
                hidden: 'true',
                order: 'desc', sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'payOrderCount',
                title: '付款次数',
                hidden: 'true',
                order: 'desc', sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'payUserCount',
                title: '付款人数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'refundOrderCount',
                title: '退货次数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'refundUserCount',
                title: '退货人数',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'orderRate',
                title: '下单转化率',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'payRate',
                title: '付款转化率',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
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
    }
    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#dataList').datagrid('options').queryParams;

    //给接口配置参数；
    searchCondition(queryParams);

    $('#dataList').datagrid('options').queryParams = queryParams;
    $('#dataList').datagrid('options').url = serverURL + '/rest/2.0/goodsAnalysis/goodsList';
    $("#dataList").datagrid('reload');


//     //商品分析excel 参数存储
    execlTrade = new Object();

    execlTrade.classifyId = classifyid;
    execlTrade.supplierId = operatorid;
    execlTrade.terminalKey = terminaluser;
    execlTrade.dateRangeType = dateRangetype;
    execlTrade.dateRangeStart = dateRangestart;
    execlTrade.dateRangeEnd = dateRangeend;
    execlTrade.sort = '';
    execlTrade.order = '';
}
function category() {
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        operatorid = $("#operator").val();
    }
    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#categoryList').datagrid('options').queryParams;

    //给接口配置参数；
    searchCategory(queryParams);

    $('#categoryList').datagrid('options').queryParams = queryParams;
    $('#categoryList').datagrid('options').url = serverURL + '/rest/2.0/goodsAnalysis/classifyList';
    $("#categoryList").datagrid('reload');

//     //品味分析excel 参数存储
    execlCategory = new Object();

    execlCategory.supplierId = operatorid;
    execlCategory.terminalKey = terminaluser;
    execlCategory.dateRangeType = dateRangetype;
    execlCategory.dateRangeStart = dateRangestart;
    execlCategory.dateRangeEnd = dateRangeend;
    execlCategory.sort = '';
    execlCategory.order = '';
}
function searchCondition(queryParams){
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        operatorid = $("#operator").val();
    }
    queryParams.classifyId = $("#trade_list").val();
    queryParams.supplierId = operatorid;
    queryParams.terminalKey = $("#terminal").val();
    queryParams.dateRangeType = dateRangetype;
    queryParams.dateRangeStart = dateRangestart;
    queryParams.dateRangeEnd = dateRangeend;
    queryParams.page = pages;
    queryParams.rows = 20;
    queryParams.sort =  '';
    queryParams.order = '';
    //排序字段 order by ，默认为pageName
    //可不传  排序规则 asc/desc，默认为AS
}
function searchCategory(queryParams){
    //切换运营商
    if(sessionStorage.getItem('storeSupplier_ID')){
        operatorid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        operatorid = $("#operator").val();
    }
    queryParams.supplierId = operatorid;
    queryParams.terminalKey = $("#terminal").val();
    queryParams.dateRangeType = dateRangetype;
    queryParams.dateRangeStart = dateRangestart;
    queryParams.dateRangeEnd = dateRangeend;
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
var customizeCategory = new customize($('#categoryList'));
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

        if(this.self.is('#dataList')){
            $(".customizeCommodity").show().siblings(".customizeCategory").hide();
        }else if(this.self.is('#categoryList')){
            $(".customizeCategory").show().siblings(".customizeCommodity").hide();
        }

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
