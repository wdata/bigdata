/**
 * 当前页js
 * Created by Administrator on 2017/6/3.
 */

//值为空(null)时显示为空字符
function formatNullChangeEmpty(value, JQID) {
    $('#' + JQID).text(null == value || value == "null" ? "" : value);
}

//值为空(null)时显示为暂无数据，有则显示 value+"天"
function formatNullChangeNotAvailable(value, JQID, unitString) {
    $('#' + JQID).text(null == value || value == "null" ? "暂无数据" : value + unitString);
}

var supplierJID;//是否运营商

//用于存取excel提交参数暂存
var execlParameter = {};

init();

function supplierFun() {

    //如 运营商管理员选着指定的运营商进行查看 嵌几层iframe 追加几个parent
    supplierJID = window.parent.parent.storeSupplier_ID;
    // console.log(supplierJID)
    if (isEmpty_var(supplierJID)) {
        //非运营商管理员，显示各表下拉框 信息并加载
        $('.supplierShow').show();
        $.get(serverURL + "/rest/1.0/commonData/supplierList", {}, function (data) {
            $('#supplierSel').combobox('loadData', data);

            reloadgrid();
        });
    } else {
        //运营商管理员，直接读取 supplierJID supplierJText信息
        $('.supplierShow').hide();
        $('#supplierSel').combobox('clear');


        reloadgrid();
    }
}

//调至锚点，并加载 详情
function messageDetailsByParameter(id, userName, name, mobile, sex, age, province) {

    /*用户基本信息*/

    formatNullChangeEmpty(id, "basicInformation_id");
    formatNullChangeEmpty(userName, "basicInformation_userName");
    formatNullChangeEmpty(name, "basicInformation_name");
    formatNullChangeEmpty(mobile, "basicInformation_mobile");
    formatNullChangeEmpty(sex, "basicInformation_sex");
    formatNullChangeEmpty(age, "basicInformation_age");
    formatNullChangeEmpty(province, "basicInformation_province");

    //显示信息详情 区域
    $('#panel_singleUserInformation').show();

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#supplierSel').combobox('getValue');
    }

    $.post("/rest/1.0/userViewController/userDetail", {userId: id, supplierId: supplier}, function (data) {
        if (data) {

            /*用户基本信息*/
            //headImgUrl 用户头像url
            $('#headPortrait').attr('src', data.headImgUrl);

            /*价值信息*/
            //消费趋势类图表面板
            if (!$.isEmptyObject(data.comsumption)) {

                var myComsumptionTrend = echarts.init(document.getElementById('comsumptionPanel'));
                myComsumptionTrend.setOption(comsumptionChart); //先把可选项注入myChart中
                myComsumptionTrend.showLoading({text: '数据获取中', effect: 'whirling'});

                // 填入数据
                myComsumptionTrend.setOption({

                    xAxis: {
                        data: data.comsumption.veidoo
                    },
                    series: [{
                        data: data.comsumption.valueList[0].valueList /*指标1-所有用户平均Arpu*/
                    }, {
                        data: data.comsumption.valueList[1].valueList /*指标2-该用户月消费金额*/
                    }]
                });
                myComsumptionTrend.hideLoading();
            }

            //购买趋势类图表面板
            if (!$.isEmptyObject(data.buyCount)) {

                var myBuyCountTrend = echarts.init(document.getElementById('buyCountPanel'));
                myBuyCountTrend.setOption(buyCountChart); //先把可选项注入myChart中
                myBuyCountTrend.showLoading({text: '数据获取中', effect: 'whirling'});

                // 填入数据
                myBuyCountTrend.setOption({

                    xAxis: {
                        data: data.buyCount.veidoo
                    },
                    series: [{
                        data: data.buyCount.valueList[0].valueList /*指标1-所有用户平均购买次数*/
                    }, {
                        data: data.buyCount.valueList[1].valueList /*指标2-该客户当月购买次数*/
                    }]
                });
                myBuyCountTrend.hideLoading();
            }

            /*偏好信息*/
            formatNullChangeNotAvailable(data.favClassify, "preferenceInformation_favClassify", "");//最喜爱的商品类别
            formatNullChangeNotAvailable(data.favOrderPriceRange, "preferenceInformation_favOrderPriceRange", "");//最喜爱的订单价格段
            formatNullChangeNotAvailable(data.favGoodsPriceRange, "preferenceInformation_favGoodsPriceRange", "");//最喜爱的单品价格段
            formatNullChangeNotAvailable(data.favTimeRange, "preferenceInformation_favTimeRange", "");//最喜爱的时间段

            /*活跃信息*/
            formatNullChangeNotAvailable(data.recentBuyPastDays, "activitInformation_recentBuyPastDays", "天");//最近一次购买距今天数
            formatNullChangeNotAvailable(data.recentVisitPastDays, "activitInformation_recentVisitPastDays", "天");//最近一次访问距今天数
            formatNullChangeNotAvailable(data.monthActiveDays, "activitInformation_monthActiveDays", "天");//月活跃天数
            formatNullChangeNotAvailable(data.monthVisitCount, "activitInformation_monthVisitCount", "次");//月访问次数
            formatNullChangeNotAvailable(data.registerPastTime, "activitInformation_registerPastTime", "天");//注册时长


        }
    }, 'json')
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
function init() {
    //获得储值用户类型列表
    $.get(serverURL + '/rest/1.0/userLabelController/rechargeType', {}, function (data) {
        if (!isEmpty_var(data)) {
            var str = "";
            for (var i = 0; i < data.length; i++) {
                var keyID = data[i].key;
                var textValue = data[i].value;
                str += '<input class="rechargeTypeCheckbox" style="margin-left: 10px;" type="checkbox" name="rechargeType" value="' + keyID + '" />' + textValue;
            }
            //头部追加
            $('#rechargeTypeSpan').prepend(str);
        }
    }, 'json');

    //选择时间维度
    $('#timeDec').combobox({
        valueField: 'key',
        textField: 'value',
        editable: false,
        data: [
            {key: '0', value: '最近三十天'},
            {key: '1', value: '历史自然月'}],
        onLoadSuccess: function () {
            $('#timeDec').combobox('select', '0');
        },
        onChange: function () {
            var timeDecValue = $('#timeDec').combobox('getValue');
            if (timeDecValue == "1") {
                //显示历史自然月对应的年月控件
                $('#timeDec_spanOne').show();
            } else {
                //1清除，2隐藏
                $('#timeDec_spanOne').hide();
                $('#timeDec_inputOne').val('');

            }
        }
    });
    // ----------------获取平台数据----------------
    $.get(serverURL + '/rest/1.0/dimPlatform/getAllPlatform', {}, function (data) {

        $('#platform').combobox('loadData', data);
    }, 'json');

    $('#platform').combobox({
        valueField: 'platformKey',
        textField: 'platformInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var platformData = $('#platform').combobox('getData');
            if (platformData.length > 0) {
                $('#platform').combobox('select', platformData[0].platformKey);
            } else {
                $('#platform').combobox('clear');
            }
        }
    });

    // ----------------获取运营商数据----------------
    $('#supplierSel').combobox({
        panelHeight: 100,
        width: 150,
        valueField: 'key',
        textField: 'value',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var supplierData = $('#supplierSel').combobox('getData');
            if (supplierData.length > 0) {
                if(operatorId){
                    $('#supplierSel').combobox('select', operatorId);
                }else{
                    $('#supplierSel').combobox('select', supplierData[0].key);
                }
            }
        },
        onChange: function (_this) {
            //	将运营商ID存储到sessionStorage中
            sessionStorage.setItem("operatorId",_this);
        }
    });


    // ----------------初始设置----------------
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

    $('#userId').textbox({
        width: 100
    });

    $('#userName').textbox({
        width: 100
    });

    $('#name').textbox({
        width: 100
    });

    $('#mobile').textbox({
        width: 100
    });

    $('#payAmountMin').textbox({
        width: 100
    });
    $('#payAmountMax').textbox({
        width: 100
    });

    $('#payCountMin').textbox({
        width: 100
    });
    $('#payCountMax').textbox({
        width: 100
    });
    $('#activeDaysMin').textbox({
        width: 100
    });
    $('#activeDaysMax').textbox({
        width: 100
    });
    $('#dailyVisitMinutesMin').textbox({
        width: 100
    });
    $('#dailyVisitMinutesMax').textbox({
        width: 100
    });
    $('#shareCountMin').textbox({
        width: 100
    });
    $('#shareCountMax').textbox({
        width: 100
    });
    $('#cardBuyCountMin').textbox({
        width: 100
    });
    $('#cardBuyCountMax').textbox({
        width: 100
    });
    $('#rechargeAmountMin').textbox({
        width: 100
    });
    $('#rechargeAmountMax').textbox({
        width: 100
    });
    $('#commentCountMin').textbox({
        width: 100
    });
    $('#commentCountMax').textbox({
        width: 100
    });
    $('#showPicCountMin').textbox({
        width: 100
    });
    $('#showPicCountMax').textbox({
        width: 100
    });
    $('#clickGoodsItemsMin').textbox({
        width: 100
    });
    $('#clickGoodsItemsMax').textbox({
        width: 100
    });
    $('#clickGoodsTimesMin').textbox({
        width: 100
    });
    $('#clickGoodsTimesMax').textbox({
        width: 100
    });

    $('#refundCountMin').textbox({
        width: 100
    });

    $('#refundCountMax').textbox({
        width: 100
    });

    $('#pvCountMin').textbox({
        width: 100
    });

    $('#pvCountMax').textbox({
        width: 100
    });


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
        onClickRow: function (index, row) {
            clickRowSetting(index);
        }
    });

    /*列表当中行时，设置A链接样式*/
    function clickRowSetting(index) {
        $('.a_id').removeClass("datagridAStyle");
        $('.a_id:eq(' + index + ')').addClass("datagridAStyle");
    }

    /*
     * 因活动supplierID Ajax异步获取，所以先js初始化 datagrid 组件。
     * 再ajax回调函数中，执行 查询列表函数。
     * */
    supplierFun();

    initTitle();
    clickSwitchMethod();
}

function initTitle() {
    $('.datagrid-header-row > [field="userId"]').attr('title', '用户ID');
    $('.datagrid-header-row > [field="userName"]').attr('title', '用户名');
    $('.datagrid-header-row > [field="name"]').attr('title', '姓名');
    $('.datagrid-header-row > [field="mobile"]').attr('title', '手机号码');
    $('.datagrid-header-row > [field="sex"]').attr('title', '性别');
    $('.datagrid-header-row > [field="age"]').attr('title', '年龄');
    $('.datagrid-header-row > [field="province"]').attr('title', '省份');
    $('.datagrid-header-row > [field="registerTime"]').attr('title', '注册时间');
    $('.datagrid-header-row > [field="rechargeType"]').attr('title', '储值用户类型');
    $('.datagrid-header-row > [field="recentPayDate"]').attr('title', '最新一次消费时间');

    $('.datagrid-header-row > [field="recentVisitDate"]').attr('title', '最近一次访问时间');
    $('.datagrid-header-row > [field="payAmount"]').attr('title', '消费金额');
    $('.datagrid-header-row > [field="payCount"]').attr('title', '消费次数');
    $('.datagrid-header-row > [field="refundCount"]').attr('title', '退货次数(上个月)');
    $('.datagrid-header-row > [field="isLabelUser"]').attr('title', '是否已加入当前标签的状态');

    $('.datagrid-header-row > [field="pvCount"]').attr('title', '访问页面总数');
    $('.datagrid-header-row > [field="activeDays"]').attr('title', '活跃天数');
    $('.datagrid-header-row > [field="dailyVisitHours"]').attr('title', '日均访问时长');
    $('.datagrid-header-row > [field="shareCount"]').attr('title', '分享次数');
    $('.datagrid-header-row > [field="cardBuyCount"]').attr('title', '购买网销卡次数');
    $('.datagrid-header-row > [field="rechargeAmount"]').attr('title', '充值金额');
    $('.datagrid-header-row > [field="commentCount"]').attr('title', '商品评价次数');
    $('.datagrid-header-row > [field="showPicCount"]').attr('title', '商品晒图次数');
    $('.datagrid-header-row > [field="clickGoodsItems"]').attr('title', '点击商品数');
    $('.datagrid-header-row > [field="clickGoodsTimes"]').attr('title', '点击商品次数');
    $('.datagrid-header-row > [field="complainCount"]').attr('title', '投诉次数');
}


function reloadgrid() {
    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#dataList').datagrid('options').queryParams;

    getQueryParams(queryParams);

    $('#dataList').datagrid('options').queryParams = queryParams;
    $('#dataList').datagrid('options').url = serverURL + '/rest/1.0/userViewController/userList';
    $("#dataList").datagrid('reload');
}

function getQueryParams(queryParams) {
    var userId, userName, name, mobile;
    userId = $('#userId').textbox("getText");
    userName = $('#userName').textbox("getText");
    name = $('#name').textbox("getText");
    mobile = $('#mobile').textbox("getText");

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#supplierSel').combobox('getValue');
    }

    queryParams.supplierId = supplier;

    queryParams.userId = userId;
    queryParams.userName = userName;
    queryParams.name = name;
    queryParams.mobile = mobile;

    var platformKey, registerDateStart, registerDateEnd, recentPayDateStart, recentPayDateEnd,
        recentVisitDateStart, recentVisitDateEnd, payAmountMin, payAmountMax, payCountMin, payCountMax,
        refundCountMin, refundCountMax, pvCountMin, pvCountMax, rechargeType, timeType, month,
        clickGoodsTimesMin, clickGoodsTimesMax, activeDaysMin, activeDaysMax, dailyVisitMinutesMin, dailyVisitMinutesMax,
        shareCountMin, shareCountMax, cardBuyCountMin, cardBuyCountMax, rechargeAmountMin, rechargeAmountMax,
        commentCountMin, commentCountMax, showPicCountMin, showPicCountMax, clickGoodsItemsMin, clickGoodsItemsMax;

    platformKey = $("#platform").combobox("getValue");
    //选择ALL时默认"" 查所有
    platformKey = platformKey == "ALL" ? "" : platformKey;

    registerDateStart = $('#registerDateStart').val();
    registerDateEnd = $('#registerDateEnd').val();
    recentPayDateStart = $('#recentPayDateStart').val();
    recentPayDateEnd = $('#recentPayDateEnd').val();
    recentVisitDateStart = $('#recentVisitDateStart').val();
    recentVisitDateEnd = $('#recentVisitDateEnd').val();

    payAmountMin = $('#payAmountMin').textbox('getText');
    payAmountMax = $('#payAmountMax').textbox('getText');
    payCountMin = $('#payCountMin').textbox('getText');
    payCountMax = $('#payCountMax').textbox('getText');

    refundCountMin = $('#refundCountMin').textbox('getText');
    refundCountMax = $('#refundCountMax').textbox('getText');
    pvCountMin = $('#pvCountMin').textbox('getText');
    pvCountMax = $('#pvCountMax').textbox('getText');

    //判断时间选择 做不同赋值操作
    timeType = $('#timeDec').combobox('getValue');
    if (timeType == "1") {
        //历史自然月获得对应的年月控件值
        month = $('#timeDec_inputOne').val();
    } else {
        month = "";
    }

    clickGoodsTimesMin = $('#clickGoodsTimesMin').textbox('getText');
    clickGoodsTimesMax = $('#clickGoodsTimesMax').textbox('getText');
    activeDaysMin = $('#activeDaysMin').textbox('getText');
    activeDaysMax = $('#activeDaysMax').textbox('getText');
    dailyVisitMinutesMin = $('#dailyVisitMinutesMin').textbox('getText');
    dailyVisitMinutesMax = $('#dailyVisitMinutesMax').textbox('getText');
    shareCountMin = $('#shareCountMin').textbox('getText');
    shareCountMax = $('#shareCountMax').textbox('getText');
    cardBuyCountMin = $('#cardBuyCountMin').textbox('getText');
    cardBuyCountMax = $('#cardBuyCountMax').textbox('getText');
    rechargeAmountMin = $('#rechargeAmountMin').textbox('getText');
    rechargeAmountMax = $('#rechargeAmountMax').textbox('getText');
    commentCountMin = $('#commentCountMin').textbox('getText');
    commentCountMax = $('#commentCountMax').textbox('getText');
    showPicCountMin = $('#showPicCountMin').textbox('getText');
    showPicCountMax = $('#showPicCountMax').textbox('getText');
    clickGoodsItemsMin = $('#clickGoodsItemsMin').textbox('getText');
    clickGoodsItemsMax = $('#clickGoodsItemsMax').textbox('getText');


    rechargeType = checkedForArrayValStr($("[name=rechargeType]:checked"));


    //excel 参数存储
    execlParameter = new Object();

    execlParameter.userId = userId;
    execlParameter.userName = userName;
    execlParameter.name = name;
    execlParameter.mobile = mobile;

    execlParameter.supplierId = supplier;
    execlParameter.platformKey = platformKey;
    execlParameter.registerDateStart = registerDateStart;
    execlParameter.registerDateEnd = registerDateEnd;
    execlParameter.recentPayDateStart = recentPayDateStart;
    execlParameter.recentPayDateEnd = recentPayDateEnd;
    execlParameter.recentVisitDateStart = recentVisitDateStart;
    execlParameter.recentVisitDateEnd = recentVisitDateEnd;
    execlParameter.payAmountMin = payAmountMin;
    execlParameter.payAmountMax = payAmountMax;
    execlParameter.payCountMin = payCountMin;
    execlParameter.payCountMax = payCountMax;
    execlParameter.refundCountMin = refundCountMin;
    execlParameter.refundCountMax = refundCountMax;
    execlParameter.pvCountMin = pvCountMin;
    execlParameter.pvCountMax = pvCountMax;
    execlParameter.rechargeType = rechargeType;
    execlParameter.timeType = timeType;
    execlParameter.month = month;
    execlParameter.activeDaysMin = activeDaysMin;
    execlParameter.activeDaysMax = activeDaysMax;
    execlParameter.dailyVisitMinutesMin = dailyVisitMinutesMin;
    execlParameter.dailyVisitMinutesMax = dailyVisitMinutesMax;
    execlParameter.shareCountMin = shareCountMin;
    execlParameter.shareCountMax = shareCountMax;
    execlParameter.cardBuyCountMin = cardBuyCountMin;
    execlParameter.cardBuyCountMax = cardBuyCountMax;
    execlParameter.rechargeAmountMin = rechargeAmountMin;
    execlParameter.rechargeAmountMax = rechargeAmountMax;
    execlParameter.commentCountMin = commentCountMin;
    execlParameter.commentCountMax = commentCountMax;
    execlParameter.showPicCountMin = showPicCountMin;
    execlParameter.showPicCountMax = showPicCountMax;
    execlParameter.clickGoodsItemsMin = clickGoodsItemsMin;
    execlParameter.clickGoodsItemsMax = clickGoodsItemsMax;
    execlParameter.clickGoodsTimesMin = clickGoodsTimesMin;
    execlParameter.clickGoodsTimesMax = clickGoodsTimesMax;

    //列表检索条件
    queryParams.platformKey = platformKey;
    queryParams.registerDateStart = registerDateStart;
    queryParams.registerDateEnd = registerDateEnd;
    queryParams.recentPayDateStart = recentPayDateStart;
    queryParams.recentPayDateEnd = recentPayDateEnd;
    queryParams.recentVisitDateStart = recentVisitDateStart;
    queryParams.recentVisitDateEnd = recentVisitDateEnd;
    queryParams.payAmountMin = payAmountMin;
    queryParams.payAmountMax = payAmountMax;
    queryParams.payCountMin = payCountMin;
    queryParams.payCountMax = payCountMax;
    queryParams.refundCountMin = refundCountMin;
    queryParams.refundCountMax = refundCountMax;
    queryParams.pvCountMin = pvCountMin;
    queryParams.pvCountMax = pvCountMax;
    queryParams.rechargeType = rechargeType;
    queryParams.timeType = timeType;
    queryParams.month = month;
    queryParams.activeDaysMin = activeDaysMin;
    queryParams.activeDaysMax = activeDaysMax;
    queryParams.dailyVisitMinutesMin = dailyVisitMinutesMin;
    queryParams.dailyVisitMinutesMax = dailyVisitMinutesMax;
    queryParams.shareCountMin = shareCountMin;
    queryParams.shareCountMax = shareCountMax;
    queryParams.cardBuyCountMin = cardBuyCountMin;
    queryParams.cardBuyCountMax = cardBuyCountMax;
    queryParams.rechargeAmountMin = rechargeAmountMin;
    queryParams.rechargeAmountMax = rechargeAmountMax;
    queryParams.commentCountMin = commentCountMin;
    queryParams.commentCountMax = commentCountMax;
    queryParams.showPicCountMin = showPicCountMin;
    queryParams.showPicCountMax = showPicCountMax;
    queryParams.clickGoodsItemsMin = clickGoodsItemsMin;
    queryParams.clickGoodsItemsMax = clickGoodsItemsMax;
    queryParams.clickGoodsTimesMin = clickGoodsTimesMin;
    queryParams.clickGoodsTimesMax = clickGoodsTimesMax;

    return queryParams;

}

var varTop = 100;//默认100高度距离body顶部
window.onscroll = function () {
    var t = document.documentElement.scrollTop || document.body.scrollTop;

    varTop = t + 100;

    setWinNormAttri();
};


//设置winNorm面板
function setWinNormAttri() {
    $('#winNorm').window('move', {
        top: varTop
    });
}

function showGridColum() {
    setWinNormAttri();

    var showDom = "";
    var rows = -1;

    $("#columnsDataCheck").empty();
    var columsArray = $($('#dataList').datagrid('options').columns[0]);
    //不显示 用户ID
    columsArray.splice(0, 1);

    var noneFields = $('.datagrid-header-row > td:hidden');	//获得页面上 隐藏的列

    for (var i = 0; i < columsArray.length; i++) {

        var hiddenFlag = "checked='checked'";//默认显示
        if (i % 4 == 0) {
            $('#columnsDataCheck').append("<tr></tr>");
            rows++;
        }

        for (var j = 0; j < noneFields.length; j++) {
            if (columsArray[i].field == $.trim($(noneFields[j]).attr('field'))) {
                hiddenFlag = "";
                break;
            }
        }
        showDom = '<td style="padding:2px;"><input type="checkbox" style="vertical-align:sub" name="columnsDataGroup" value="' + columsArray[i].field + '" ' + hiddenFlag + '/>&nbsp;' + columsArray[i].title + '</td>';

        $(document.getElementById("columnsDataCheck").rows[rows]).append(showDom);

    }

    $('#winNorm').window('open');
}

//默认保存预设值
var defultColumsStr = (defultColumsStr == null || defultColumsStr == undefined || defultColumsStr == "") ? defultColums() : defultColumsStr;
////默认系统 保存指标显示
function defultColums() {
    var columsArray = ($('#dataList').datagrid('options').columns)[0];
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
}
//自定义指标默认
function columnsCheckedSelectDefult() {
    var groups = $('input[type=checkbox][name=columnsDataGroup]');
    var tempArray = defultColumsStr.split(',');

    //ID的下标，跳过
    tempArray.splice(0, 1);

    for (var i = 0; i < groups.length; i++) {
        groups[i].checked = tempArray[i];
    }
}

//自定义指标全选。
function columnsCheckedSelectTrue() {
    $('input[type=checkbox][name=columnsDataGroup]').prop("checked", true);
}

//自定义指标取反
function columnsCheckedSelectNOT() {
    var groups = $('input[type=checkbox][name=columnsDataGroup]');
    for (var i = 0; i < groups.length; i++) {
        groups[i].checked = groups[i].checked ? false : true;
    }
}

//返回用户标签页面
function touserTabsPage() {
    var urlPath = serverURL + "/rest/1.0/userLabelController/userLabelPage";
    location.href = urlPath;
}

//关闭窗口
function closWinButton() {
    $('#winNorm').window('close');
}

//确认,显示或隐藏 自定义列
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

}

//在用户标签检索用户，excel导出
function queryExcel() {
    var dataParameter = urlSetData(execlParameter);
    window.location.href = serverURL + '/rest/1.0/userViewController/userListExcel?' + dataParameter;
}

//将提供的参数转为字符串拼接
function urlSetData(data) {
    /*获得当前列表排序字段 以及 排序规则*/
    var dataListOptions = $("#dataList").datagrid("options");

    /*用户不点击排序时，默认设置排序字段*/
    var sortName = isEmpty_var(dataListOptions.sortName) ? "userId" : dataListOptions.sortName;
    var sortOrder = isEmpty_var(dataListOptions.sortOrder) ? "ASC" : dataListOptions.sortOrder;

    var param = "&supplierId=" + data.supplierId + "&platformKey=" + data.platformKey + "&userId=" + data.userId + "&userName=" + data.userName
        + "&name=" + data.name + "&mobile=" + data.mobile + "&registerDateStart=" + data.registerDateStart + "&registerDateEnd=" + data.registerDateEnd
        + "&recentPayDateStart=" + data.recentPayDateStart + "&recentPayDateEnd=" + data.recentPayDateEnd + "&recentVisitDateStart=" + data.recentVisitDateStart + "&recentVisitDateEnd=" + data.recentVisitDateEnd
        + "&timeType=" + data.timeType + "&month=" + data.month + "&payAmountMin=" + data.payAmountMin + "&payAmountMax=" + data.payAmountMax
        + "&payCountMin=" + data.payCountMin + "&payCountMax=" + data.payCountMax + "&activeDaysMin=" + data.activeDaysMin + "&activeDaysMax=" + data.activeDaysMax
        + "&dailyVisitMinutesMin=" + data.dailyVisitMinutesMin + "&dailyVisitMinutesMax=" + data.dailyVisitMinutesMax + "&refundCountMin=" + data.refundCountMin + "&refundCountMax=" + data.refundCountMax
        + "&shareCountMin=" + data.shareCountMin + "&shareCountMax=" + data.shareCountMax + "&cardBuyCountMin=" + data.cardBuyCountMin + "&cardBuyCountMax=" + data.cardBuyCountMax
        + "&rechargeAmountMin=" + data.rechargeAmountMin + "&rechargeAmountMax=" + data.rechargeAmountMax + "&commentCountMin=" + data.commentCountMin + "&commentCountMax=" + data.commentCountMax
        + "&showPicCountMin=" + data.showPicCountMin + "&showPicCountMax=" + data.showPicCountMax + "&clickGoodsItemsMin=" + data.clickGoodsItemsMin + "&clickGoodsItemsMax=" + data.clickGoodsItemsMax
        + "&clickGoodsTimesMin=" + data.clickGoodsTimesMin + "&clickGoodsTimesMax=" + data.clickGoodsTimesMax + "&pvCountMin=" + data.pvCountMin + "&pvCountMax=" + data.pvCountMax

        + "&rechargeType=" + data.rechargeType + "&sort=" + sortName + "&order=" + sortOrder;

    return param;
}

//flag 为true:隐藏,false:展开
function changePanelDisplay(flag) {
    if (flag == true) {
        $('#panelItem').hide();
        $('#linkButOne').html("<a href='#' onclick='changePanelDisplay(" + false + ");return false;'>展开检索面板</a>");
    } else if (flag == false) {
        $('#panelItem').show();
        $('#linkButOne').html("<a href='#' onclick='changePanelDisplay(" + true + ");return false;'>隐藏检索面板</a>");
    }
}


//复选框循环 数组，获得选中的，并拼接成字符串形式
function checkedForArrayValStr(checkArray) {
    var outStr = "";
    if (!isEmpty_var(checkArray)) {
        for (var i = 0; i < checkArray.length; i++) {
            outStr += checkArray[i].value + ",";
        }
        outStr = outStr.substr(0, outStr.lastIndexOf(','));
    } else {
        outStr = "";
    }
    return outStr;
}


//面板子项展开 隐藏
function clickSwitchMethod() {
    var $clickSwitch = $('.clickSwitch');
    for (var i = 0; i < $clickSwitch.length; i++) {
        $clickSwitch[i].onclick = function () {
            var flag = this.getAttribute('flag');
            var outTarget = this.getAttribute('outTarget');
            /*
             * flag:"true" 展开目标子项 "false" 对应隐藏
             * outTarget：被执行目标ID
             * */
            if (flag == "true") {
                $('#' + outTarget).show();
                this.setAttribute('flag', 'false');
                this.innerText = "隐藏";
            } else if (flag == "false") {
                $('#' + outTarget).hide();
                this.setAttribute('flag', 'true');
                this.innerText = "展开";
            }
            return false
        }
    }
}