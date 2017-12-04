/**
 * Created by Administrator on 2017/6/7.
 */

//用于存取excel提交参数暂存
var execlParameter = {};

init();
customFlagByCustomLabel();
panelItemByLabelAddState();


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

    // ----------------设置easyui 表单控件----------------
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
    $('#dailyVisitHoursMin').textbox({
        width: 100
    });
    $('#dailyVisitHoursMax').textbox({
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
        fit: false,
        striped: true,
        singleSelect: true,
        rownumbers: true,
        pagination: true,
        allowCellWrap: true,
        nowrap: false,
        pageSize: 10,
        pageList: [10, 20],
        columns: [[
            {
                field: 'operateCheck', title: '选择', width: 40, align: 'center',
                formatter: function (value, row, index) {
                    return '<input type="checkbox" name="dataListCheck" value="' + row.userId + '" />';
                }
            },
            {field: 'userId', title: '用户id', order: 'desc', sortable: true, align: 'center'},
            {field: 'userName', title: '用户名', width: 120, order: 'desc', sortable: true, align: 'center'},
            {field: 'name', title: '用户姓名', width: 120, order: 'desc', sortable: true, align: 'center'},
            {field: 'mobile', title: '手机号', order: 'desc', sortable: true, align: 'center'},
            {field: 'sex', title: '性别', width: 60, order: 'desc', sortable: true, align: 'center', hidden: 'true'},
            {field: 'age', title: '年龄', width: 60, order: 'desc', sortable: true, align: 'center', hidden: 'true'},
            {
                field: 'province',
                title: '省份',
                width: 120,
                order: 'desc',
                sortable: true,
                align: 'center',
                hidden: 'true'
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
            {
                field: 'isLabelUser', title: '加入当前标签的状态', order: 'desc', sortable: true, width: 130, align: 'center',
                formatter: function (value, row, index) {
                    //已添加(1) 未添加(0)
                    var outString;
                    if (value == 0) {
                        outString = "<span id='isLabelUserText" + row.userId + "' >未添加</span>";
                    } else if (value == 1) {
                        outString = "<span id='isLabelUserText" + row.userId + "' >已添加</span>";
                    }
                    return outString;
                }
            },
            {
                field: 'operate', title: '操作', width: 100, align: 'center',
                formatter: function (value, row, index) {
                    var state = row.isLabelUser;
                    if (isCustomLabel == "true") {//自定义状态，可操作
                        var btn;
                        if (state == 0) {
                            btn = "<span id='operate" + row.userId + "'  ><a class='a_id' href='#' onclick='editAddByUserId(" + row.userId + ");return false;'>添加</a>";
                        } else if (state == 1) {
                            btn = "<span id='operate" + row.userId + "'  ><a class='a_id' href='#' onclick='editDelByUserId(" + row.userId + ");return false;'>移除</a>";
                        }
                    }
                    return btn;
                }
            }
        ]], onClickRow: function (index, row) {
            clickRowSetting(index);
        }
    });

    /*列表当中行时，设置A链接样式*/
    function clickRowSetting(index) {
        $('.a_id').removeClass("datagridAStyle");
        $('.a_id:eq(' + index + ')').addClass("datagridAStyle");
    }

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

    initLoadGrid();

    //commodity();
    initTitle();

    clickSwitchMethod();
}

//标签非自定义情况下，显示隐藏 页面容器
function customFlagByCustomLabel() {
    if (isCustomLabel != "true") {
        $('.customFlag').hide();
    } else {
        $('.customFlag').show();
    }
}

//通过状态切换 显示。
function changeExcelButOne(flag) {
    if (flag == "noSearch") {
        $('#excelButOne').html("<a href='javascript:getLabelUserExcel()'>Excel导出标签用户</a>");
    } else if (flag == "search") {
        $('#excelButOne').html("<a href='javascript:queryUserExcel()'>Excel导出检索结果</a>");
    }

}

//标签自定义新增情况下，显示隐藏 页面容器
function panelItemByLabelAddState() {
    if (isAddStateLabel == "true") {
        $('#panelItem').show();
        $('#linkButOne').html("<a href='#' onclick='changePanelDisplay(" + true + ");return false;'>隐藏检索面板</a>");

    } else if (isAddStateLabel == "false") {
        $('#panelItem').hide();
        $('#linkButOne').html("<a href='#' onclick='changePanelDisplay(" + false + ");return false;'>展开检索面板</a>");

    }
}

//flag 为true:隐藏,false:展开
function changePanelDisplay(flag) {
    if (flag == true) {
        $('#panelItem').hide();
        $('#linkButOne').html("<a href='#' onclick='changePanelDisplay(" + false + ");return false;'>展开检索面板</a>");
    } else if (flag == false) {
        $('#panelItem').show();
    }
}

function initTitle() {
    $('.datagrid-header-row > [field="userId"]').attr('title', '用户id');
    $('.datagrid-header-row > [field="userName"]').attr('title', '用户名');
    $('.datagrid-header-row > [field="name"]').attr('title', '用户姓名');
    $('.datagrid-header-row > [field="mobile"]').attr('title', '手机号');
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

var searchSupplierId;//运营商ID
var searchSupplierText;//运营商中文名称
var searchLabelId;//点击传来的标签ID
var searchLabelText;//点击传来标签中文名称

var isCustomLabel;//点击传来的标签 是否为 自定义
var isAddStateLabel;//点击传来的标签 是否为 新增状态
var isFlageLabelUserState;//判断当前是标签当前用户（isNo），或是检索后用户（isYes）

//初始化加载  获取标签用户列表
function initLoadGrid() {

    changeExcelButOne("noSearch");

    searchSupplierId = localStorage.getItem('userTabs_supplier');
    searchSupplierText = localStorage.getItem('userTabs_supplierText');
    searchLabelId = localStorage.getItem('userTabs_tabId');
    searchLabelText = localStorage.getItem('userTabs_tabText');

    isCustomLabel = localStorage.getItem('userTabs_isCustomLabel');
    isAddStateLabel = localStorage.getItem('userTabs_isAddState');

    isFlageLabelUserState = "isNo";


    $('#supplierText').text(searchSupplierText);
    $('#defultLabelText').text(searchLabelText);

    // excel 参数提供
    execlParameter = new Object();
    execlParameter.supplierId = searchSupplierId;
    execlParameter.labelId = searchLabelId;

    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#dataList').datagrid('options').queryParams;

    queryParams.supplierId = searchSupplierId;
    queryParams.labelId = searchLabelId;

    $('#dataList').datagrid('options').queryParams = queryParams;
    $('#dataList').datagrid('options').url = serverURL + '/rest/1.0/userLabelController/labelUserList';
    $("#dataList").datagrid('reload');

}

//按钮 汇集检索条件 查询
function reloadgrid() {
    isFlageLabelUserState = "isYes";
    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#dataList').datagrid('options').queryParams;

    changeExcelButOne("search");

    var flagBool = getQueryParams(queryParams);
    if (flagBool) {
        $('#dataList').datagrid('options').queryParams = queryParams;
        $('#dataList').datagrid('options').url = serverURL + '/rest/1.0/userLabelController/queryUserList';
        $("#dataList").datagrid('reload');
    }
}

function getQueryParams(queryParams) {
    var platformKey, registerDateStart, registerDateEnd, recentPayDateStart, recentPayDateEnd,
        recentVisitDateStart, recentVisitDateEnd, payAmountMin, payAmountMax, payCountMin, payCountMax,
        refundCountMin, refundCountMax, pvCountMin, pvCountMax, rechargeType, timeType, month;

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

    var clickGoodsTimesMin, clickGoodsTimesMax, activeDaysMin, activeDaysMax, dailyVisitHoursMin, dailyVisitHoursMax,
        shareCountMin, shareCountMax, cardBuyCountMin, cardBuyCountMax, rechargeAmountMin, rechargeAmountMax,
        commentCountMin, commentCountMax, showPicCountMin, showPicCountMax, clickGoodsItemsMin, clickGoodsItemsMax;

    var queryLabelUser = $('[name=queryLabelUser]:radio:checked').val();

    clickGoodsTimesMin = $('#clickGoodsTimesMin').textbox('getText');
    clickGoodsTimesMax = $('#clickGoodsTimesMax').textbox('getText');
    activeDaysMin = $('#activeDaysMin').textbox('getText');
    activeDaysMax = $('#activeDaysMax').textbox('getText');
    dailyVisitHoursMin = $('#dailyVisitHoursMin').textbox('getText');
    dailyVisitHoursMax = $('#dailyVisitHoursMax').textbox('getText');
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


    platformKey = $("#platform").combobox("getValue");
    //选择ALL时默认"" 查所有
    platformKey = platformKey == "ALL" ? "" : platformKey;

    //excel 参数存储
    execlParameter = new Object();

    execlParameter.labelId = searchLabelId;
    execlParameter.supplierId = searchSupplierId;
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
    execlParameter.queryLabelUser = queryLabelUser;
    execlParameter.timeType = timeType;
    execlParameter.month = month;
    execlParameter.activeDaysMin = activeDaysMin;
    execlParameter.activeDaysMax = activeDaysMax;
    execlParameter.dailyVisitHoursMin = dailyVisitHoursMin;
    execlParameter.dailyVisitHoursMax = dailyVisitHoursMax;
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
    queryParams.labelId = searchLabelId;
    queryParams.supplierId = searchSupplierId;
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
    queryParams.queryLabelUser = queryLabelUser;
    queryParams.timeType = timeType;
    queryParams.month = month;
    queryParams.activeDaysMin = activeDaysMin;
    queryParams.activeDaysMax = activeDaysMax;
    queryParams.dailyVisitHoursMin = dailyVisitHoursMin;
    queryParams.dailyVisitHoursMax = dailyVisitHoursMax;
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
//页面全选按钮
function checkedSelectTrue() {
    $('input[type=checkbox][name=dataListCheck]').prop("checked", true);
}
//页面取消按钮
function checkedSelectFalse() {
    $('input[type=checkbox][name=dataListCheck]').prop("checked", false);
}
//用户从标签中添加
function editAddByUserId(userId) {
    $.messager.confirm('确认', '您确认要添加吗？', function (r) {
        if (r) {
            var dataPar = {
                supplierId: searchSupplierId,
                labelId: searchLabelId,
                userIds: userId
            };
            $.post(serverURL + "/rest/1.0/userLabelController/addUserToLabel", dataPar,
                function (data) {
                    if (data == "1") {//成功
                        if (isFlageLabelUserState == "isNo") {
                            initLoadGrid();
                        } else if (isFlageLabelUserState == "isYes") {
                            $('#isLabelUserText' + userId).html("已添加");
                            $('#operate' + userId).html("<a class='a_id datagridAStyle' href='#' onclick='editDelByUserId(" + userId + ");return false;'>移除</a>");
                        }
                    }
                },
                'json');
        }
    });

}
//用户从标签中移除
function editDelByUserId(userId) {
    $.messager.confirm('确认', '您确认要移除吗？', function (r) {
        if (r) {
            var dataPar = {
                supplierId: searchSupplierId,
                labelId: searchLabelId,
                userIds: userId
            };
            $.post(serverURL + "/rest/1.0/userLabelController/delUserFromLabel", dataPar,
                function (data) {
                    if (data == "1") {
                        if (isFlageLabelUserState == "isNo") {
                            initLoadGrid();
                        } else if (isFlageLabelUserState == "isYes") {
                            $('#isLabelUserText' + userId).html("未添加");
                            $('#operate' + userId).html("<a href='#' class='a_id datagridAStyle' onclick='editAddByUserId(" + userId + ");return false;'>添加</a>");
                        }
                    }
                },
                'json');
        }
    });

}
//批量添加通过 userID "1,2,3,4.."格式
function batchAddByID() {
    var str = checkedForArrayValStr($("[name=dataListCheck]:checked"));
    if (isEmpty_var(str)) {
        $.messager.alert('提示', '至少选择1个，才能执行批量操作！');
    } else {
        $.messager.confirm('确认', '您确认要添加吗？', function (r) {
            if (r) {
                var dataPar = {
                    supplierId: searchSupplierId,
                    labelId: searchLabelId,
                    userIds: str
                };
                $.post(serverURL + "/rest/1.0/userLabelController/addUserToLabel", dataPar,
                    function (data) {
                        if (!isEmpty_var(data)) {
                            if (isFlageLabelUserState == "isNo") {
                                initLoadGrid();
                            } else if (isFlageLabelUserState == "isYes") {
                                var tempArray = data.split(',');
                                var userIdArray = str.split(',');
                                for (var i = 0; i < tempArray.length; i++) {
                                    if (tempArray[i] == "1") {
                                        $('#operate' + userIdArray[i]).html("<a href='#' class='a_id' onclick='editDelByUserId(" + userIdArray[i] + ");return false;'>移除</a>");
                                        $('#isLabelUserText' + userIdArray[i]).html("已添加")
                                    }
                                }

                                /*
                                 * 获得列表选中的行
                                 * 用于修改选中行中a标签样式
                                 * */
                                var dataListObject = $('#dataList').datagrid('getSelected');
                                if (!isEmpty_var(dataListObject)) {
                                    var selectUserId = dataListObject.userId;
                                    $('#operate' + selectUserId + ' a').addClass('datagridAStyle');
                                }
                            }

                        }

                    },
                    'json');
            }
        });
    }
}

//批量移除通过 userID "1,2,3,4.."格式
function batchDelByID() {
    var str = checkedForArrayValStr($("[name=dataListCheck]:checked"));
    if (isEmpty_var(str)) {
        $.messager.alert('提示', '至少选择1个，才能执行批量操作！');
    } else {
        $.messager.confirm('确认', '您确认要移除吗？', function (r) {
            if (r) {
                var dataPar = {
                    supplierId: searchSupplierId,
                    labelId: searchLabelId,
                    userIds: str
                };
                $.post(serverURL + "/rest/1.0/userLabelController/delUserFromLabel", dataPar,
                    function (data) {
                        if (!isEmpty_var(data)) {
                            if (isFlageLabelUserState == "isNo") {
                                initLoadGrid();
                            } else if (isFlageLabelUserState == "isYes") {
                                var tempArray = data.split(',');
                                var userIdArray = str.split(',');
                                for (var i = 0; i < tempArray.length; i++) {
                                    if (tempArray[i] == "1") {
                                        $('#operate' + userIdArray[i]).html("<a href='#' class='a_id' onclick='editAddByUserId(" + userIdArray[i] + ");return false;'>添加</a>");
                                        $('#isLabelUserText' + userIdArray[i]).html("未添加")
                                    }
                                }
                                /*
                                 * 获得列表选中的行
                                 * 用于修改选中行中a标签样式
                                 * */
                                var dataListObject = $('#dataList').datagrid('getSelected');
                                if (!isEmpty_var(dataListObject)) {
                                    var selectUserId = dataListObject.userId;
                                    $('#operate' + selectUserId + ' a').addClass('datagridAStyle');
                                }
                            }
                        }
                    },
                    'json');
            }
        });
    }
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
    //不显示 选择 操作列
    columsArray.splice(0, 1);
    columsArray.splice(26, 1);

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

    // 选择 操作列 跳过
    tempArray.splice(0, 1);
    tempArray.splice(26, 1);

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

//将提供的参数转为字符串拼接
function urlSetData(data, flag) {
    /*获得当前列表排序字段 以及 排序规则*/
    var dataListOptions = $("#dataList").datagrid("options");

    /*用户不点击排序时，默认设置排序字段*/
    var sortName = isEmpty_var(dataListOptions.sortName) ? "userId" : dataListOptions.sortName;
    var sortOrder = isEmpty_var(dataListOptions.sortOrder) ? "ASC" : dataListOptions.sortOrder;

    var param = "";
    if (flag == "noSearch") {
        param = "supplierId=" + data.supplierId + "&labelId=" + data.labelId + "&sort=" + sortName + "&order=" + sortOrder;
    } else if (flag == "search") {
        param = "labelId=" + data.labelId + "&supplierId=" + data.supplierId + "&platformKey=" + data.platformKey + "&registerDateStart=" + data.registerDateStart
            + "&registerDateEnd=" + data.registerDateEnd + "&recentPayDateStart=" + data.recentPayDateStart + "&recentPayDateEnd=" + data.recentPayDateEnd
            + "&recentVisitDateStart=" + data.recentVisitDateStart + "&recentVisitDateEnd=" + data.recentVisitDateEnd + "&payAmountMin=" + data.payAmountMin
            + "&payAmountMax=" + data.payAmountMax + "&payCountMin=" + data.payCountMin + "&payCountMax=" + data.payCountMax + "&refundCountMin=" + data.refundCountMin
            + "&refundCountMax=" + data.refundCountMax + "&pvCountMin=" + data.pvCountMin + "&pvCountMax=" + data.pvCountMax + "&rechargeType=" + data.rechargeType
            + "&queryLabelUser=" + data.queryLabelUser
            + "&dailyVisitHoursMin=" + data.dailyVisitHoursMin + "&dailyVisitHoursMax=" + data.dailyVisitHoursMax + "&activeDaysMin=" + data.activeDaysMin + "&activeDaysMax=" + data.activeDaysMax
            + "&shareCountMin=" + data.shareCountMin + "&shareCountMax=" + data.shareCountMax + "&cardBuyCountMin=" + data.cardBuyCountMin + "&cardBuyCountMax=" + data.cardBuyCountMax
            + "&rechargeAmountMin=" + data.rechargeAmountMin + "&rechargeAmountMax=" + data.rechargeAmountMax + "&commentCountMin=" + data.commentCountMin + "&commentCountMax=" + data.commentCountMax
            + "&showPicCountMin=" + data.showPicCountMin + "&showPicCountMax=" + data.showPicCountMax + "&clickGoodsTimesMin=" + data.clickGoodsTimesMin + "&clickGoodsTimesMax=" + data.clickGoodsTimesMax
            + "&clickGoodsItemsMin=" + data.clickGoodsItemsMin + "&clickGoodsItemsMax=" + data.clickGoodsItemsMax + "&timeType=" + data.timeType + "&month=" + data.month

            + "&sort=" + sortName + "&order=" + sortOrder;
    }

    return param;
}

//excel导出标签用户，可按字段排序
function getLabelUserExcel() {
    var dataParameter = urlSetData(execlParameter, "noSearch");
    window.location.href = serverURL + '/rest/1.0/userLabelController/labelUserExcel?' + dataParameter;

}

//在用户标签检索用户，excel导出
function queryUserExcel() {
    var dataParameter = urlSetData(execlParameter, "search");
    window.location.href = serverURL + '/rest/1.0/userLabelController/queryUserExcel?' + dataParameter;
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