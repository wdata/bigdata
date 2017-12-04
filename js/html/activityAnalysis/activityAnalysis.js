var activityname = '';
var activitystatus = '';
var supplierid = '';
var terminaluser = '';
var dateRangetype = '1';
var dateRangestart = $("#stateTime").val();
var dateRangeend = $("#endTime").val();
var pages = '1';
var sizes = 1;
var totals = '';
var statetime = '';
var endtime = '';
document.getElementById("stateTime").value = GetDateStr(-1);
document.getElementById("endTime").value = GetDateStr(-1);

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
        // 获取终端（平台）列表
        $.get(serverURL+"/rest/1.0/commonData/terminalList",function (data) {
            // console.log(data);
            var terminalList = '';
            $.each(data,function (index,items) {
                terminalList += '<option value='+items.key+'>'+items.value+'</option>'
            });
            $("#terminal").html(terminalList);
            // 获取活动状态下拉列表数据
            $.get(serverURL+"/rest/2.0/activityAnalysis/activityStatusList",function (data) {
                // console.log(data);
                var activityList = '';
                $.each(data,function (index,item) {
                    activityList +='<option value='+item.key+'>'+item.value+'</option>';
                });
                $("#activity_state").html(activityList);
                // activitylist();
                commodity();
            })
        },"json");
    },"json");
    // 获取各页面对报表数据的通用说明文字
    $.get(serverURL+"/rest/1.0/commonData/generalDataComments",function (data) {
        // console.log(data);
        $(".hint").html(data);
    });

};
manageHead();
function activityBtn() {
    activityname = $("#activity_name").val();
    // activitylist();
    commodity();
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
    // activitylist();
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
//     // activitylist();
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
    commodity();
});
$("#operator").change(function() {
    supplierid = $("#operator").val();
    // activitylist();
    commodity();
    //	将运营商ID存储到sessionStorage中
    sessionStorage.setItem("operatorId",$(this).val());
});
$("#terminal").change(function() {
    terminaluser = $("#terminal").val();
    // activitylist();
    commodity();
});
$("#activity_state").change(function() {
    activitystatus = $("#activity_state").val();
    // activitylist();
    commodity();
})
//在用户标签检索用户，excel导出
function activityExcel() {
    var dataActivity = urlActivity(execlTrade);
    window.location.href = serverURL + '/rest/2.0/activityAnalysis/activityListExcel?' + dataActivity;
}
//将提供的参数转为字符串拼接
function urlActivity(data) {
    var param = "&activityName=" + data.activityName + "&activityStatus" + data.activityStatus + "&supplierId=" + data.supplierId + "&terminalKey=" + data.terminalKey + "&dateRangeType=" + data.dateRangeType + "&dateRangeStart=" + data.dateRangeStart
        + "&dateRangeEnd=" + data.dateRangeEnd + "&sort=" + data.sort + "&order=" + data.order;

    return param;
};

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
                field: 'activityId',
                title: '活动id',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {field: 'activityName', title: '活动名称', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'pageViewCount', title: '浏览量', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'pageViewUserCount', title: '访客数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'shareClickCount', title: '分享访问次数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'shareClickUserCount', title: '分享访问人数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'avgUserDuration', title: '单次访问时长', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payCount', title: '付款订单数', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payAmount', title: '付款订单金额', order: 'desc', sortable: true, width: 140, align: 'center'},
            {field: 'payRate', title: '付款转化率', order: 'desc', sortable: true, width: 140, align: 'center'},
            {
                field: 'beginDate',
                title: '上线时间',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 160,
                align: 'center'
            },
            {
                field: 'endDate',
                title: '下线时间',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 160,
                align: 'center'
            },
            {
                field: 'status',
                title: '当前状态',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'duration',
                title: '已持续时间',
                hidden: 'true',
                order: 'desc',
                sortable: true,
                width: 140,
                align: 'center'
            },
            {
                field: 'exposeCount',
                title: '下单笔数',
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
    })
}
function commodity() {
    //用于存取excel提交参数暂存
    if(sessionStorage.getItem('storeSupplier_ID')){
        supplierid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        supplierid = $("#operator").val();
    }
    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#dataList').datagrid('options').queryParams;

    //给接口配置参数；
    searchCondition(queryParams);

    $('#dataList').datagrid('options').queryParams = queryParams;
    $('#dataList').datagrid('options').url = serverURL + '/rest/2.0/activityAnalysis/activityList';
    $("#dataList").datagrid('reload');


//     //商品分析excel 参数存储
    execlTrade = new Object();

    execlTrade.activityName = activityname,
    execlTrade.activityStatus = activitystatus,
    execlTrade.supplierId = supplierid;
    execlTrade.terminalKey = terminaluser;
    execlTrade.dateRangeType = dateRangetype;
    execlTrade.dateRangeStart = dateRangestart;
    execlTrade.dateRangeEnd = dateRangeend;
    execlTrade.sort = '';
    execlTrade.order = '';
}
function searchCondition(queryParams){
    //用于存取excel提交参数暂存
    if(sessionStorage.getItem('storeSupplier_ID')){
        supplierid = sessionStorage.getItem('storeSupplier_ID');
        $('#operators_ID').addClass('none');
    }else {
        supplierid = $("#operator").val();
    }
    queryParams.activityName = $("#activity_name").val();
    queryParams.activityStatus = $("#activity_state").val();
    queryParams.supplierId = supplierid;
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






