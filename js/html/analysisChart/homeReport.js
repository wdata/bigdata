// 		var worldMapContainer = document.getElementById('main');
// 		//用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
// 		var resizeWorldMapContainer = function () {
// 		    worldMapContainer.style.width = window.innerWidth+'px';
// 		    worldMapContainer.style.height = window.innerHeight+'px';
// 		};
// 		//设置容器高宽
// 		resizeWorldMapContainer();

//基于准备好的dom，初始化echarts实例
var supplierJID;//是否运营商

//默认页面加载 显示不同时间。 day :7天前，yesterday：昨日。
var orderAmount = 'day';
var goodsTransform = 'yesterday';
var userTrend = 'day';
var commoditySales = 'yesterday';

function supplierFun() {
    supplierJID = window.parent.storeSupplier_ID;//如 运营商管理员选着指定的运营商进行查看

    if (isEmpty_var(supplierJID)) {
        $.get(serverURL + "/rest/1.0/supplierUser/getSupplierId", function (data) {
            if (null != data && !$.isEmptyObject(data)) {
                supplierJID = data.supplierID;
            }

            if (!isEmpty_var(supplierJID)) {
                $('.supplierShow').hide();
                $('#orderAmountSupplierSel').combobox('clear');
                $('#goodsTransSupplierSel').combobox('clear');
                $('#commoditySalesSupplierSel').combobox('clear');
                $('#userTrendSupplierSel').combobox('clear');

            } else {
                $('.supplierShow').show();
                $.get(serverURL + "/rest/1.0/supplierUser/getSupplierAll", {}, function (data) {
                    $('#orderAmountSupplierSel').combobox('loadData', data);
                    $('#goodsTransSupplierSel').combobox('loadData', data);
                    $('#commoditySalesSupplierSel').combobox('loadData', data);
                    $('#userTrendSupplierSel').combobox('loadData', data);
                }, 'json');
            }
        });
    }
}

init();

function init() {
    // ----------------获取运营商数据----------------

    $('#orderAmountSupplierSel').combobox({
        panelHeight: 100,
        width: 150,
        valueField: 'supplier_value',
        textField: 'supplier_text',
        editable: false,
        onChange: function () {
            getOrderAmountChartData(orderAmount);
        }
    });
    $('#userTrendSupplierSel').combobox({
        panelHeight: 100,
        width: 150,
        valueField: 'supplier_value',
        textField: 'supplier_text',
        editable: false,
        onChange: function () {
            getUserTrendChartData(userTrend);
        }
    });
    $('#goodsTransSupplierSel').combobox({
        panelHeight: 100,
        width: 150,
        valueField: 'supplier_value',
        textField: 'supplier_text',
        editable: false,
        onChange: function () {
            getGoodsTransformChartData(goodsTransform);
        }
    });
    $('#commoditySalesSupplierSel').combobox({
        panelHeight: 100,
        width: 150,
        valueField: 'supplier_value',
        textField: 'supplier_text',
        editable: false,
        onChange: function () {
            getCommoditySalesChartData(commoditySales);
        }
    });


    supplierFun();

    // ----------------获取平台数据---------------
    $.get(serverURL + '/rest/1.0/dimPlatform/getAllPlatform', {}, function (data) {
        $('#commoditySalesPlatform').combobox('loadData', data);
        $('#orderAmountPlatform').combobox('loadData', data);
        $('#userTrendPlatform').combobox('loadData', data);
        $('#goodsTransformPlatform').combobox('loadData', data);

    }, 'json');

    $('#goodsTransformPlatform').combobox({
        valueField: 'platformKey',
        textField: 'platformInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var platformData = $('#goodsTransformPlatform').combobox('getData');
            if (platformData.length > 0) {
                $('#goodsTransformPlatform').combobox('select', platformData[0].platformKey);
            } else {
                $('#goodsTransformPlatform').combobox('clear');
            }
        },
        onChange: function () {
            var platformID = $('#goodsTransformPlatform').combobox('getValue');

            getChannelByParam(platformID, "goodsTransform");

        }
    });

    $('#userTrendPlatform').combobox({
        valueField: 'platformKey',
        textField: 'platformInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var platformData = $('#userTrendPlatform').combobox('getData');
            if (platformData.length > 0) {
                $('#userTrendPlatform').combobox('select', platformData[0].platformKey);
            } else {
                $('#userTrendPlatform').combobox('clear');
            }
        },
        onChange: function () {
            var platformID = $('#userTrendPlatform').combobox('getValue');

            getChannelByParam(platformID, "userTrend");
        }
    });

    $('#commoditySalesPlatform').combobox({
        valueField: 'platformKey',
        textField: 'platformInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var platformData = $('#commoditySalesPlatform').combobox('getData');
            if (platformData.length > 0) {
                $('#commoditySalesPlatform').combobox('select', platformData[0].platformKey);
            } else {
                $('#commoditySalesPlatform').combobox('clear');
            }
        },
        onChange: function () {
            var platformID = $('#commoditySalesPlatform').combobox('getValue');

            getChannelByParam(platformID, "commoditySales");
        }
    });

    $('#orderAmountPlatform').combobox({
        valueField: 'platformKey',
        textField: 'platformInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var platformData = $('#orderAmountPlatform').combobox('getData');
            if (platformData.length > 0) {
                $('#orderAmountPlatform').combobox('select', platformData[0].platformKey);
            } else {
                $('#orderAmountPlatform').combobox('clear');
            }
        },
        onChange: function () {
            var platformID = $('#orderAmountPlatform').combobox('getValue');

            getChannelByParam(platformID, "orderAmount");
        }
    });


    // ----------------获取渠道数据---------------
    //outTarget:commoditySales orderAmount userTrend goodsTransform
    function getChannelByParam(platformKey, outTarget) {
        var param = {
            platformKey: platformKey
        };
        $.get(serverURL + '/rest/1.0/dimChannel/getPlatformChannel', param, function (data) {

            $('#' + outTarget + 'Channel').combobox('loadData', data);

        }, 'json');
    }


    $('#goodsTransformChannel').combobox({
        valueField: 'channelKey',
        textField: 'channelInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var channelData = $('#goodsTransformChannel').combobox('getData');
            var channelValue = $('#goodsTransformChannel').combobox('getValue');
            if (channelData.length > 0) {
                $('#goodsTransformChannel').combobox('select', channelData[0].channelKey);
            } else {
                $('#goodsTransformChannel').combobox('clear');
            }
            if (channelValue == "ALL") {
                getGoodsTransformChartData(goodsTransform);
            }
        },
        onChange: function () {
            var channelData = $('#goodsTransformChannel').combobox('getData');
            if (channelData.length > 0) {
                getGoodsTransformChartData(goodsTransform);
            }
        }
    });

    $('#userTrendChannel').combobox({
        valueField: 'channelKey',
        textField: 'channelInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var channelData = $('#userTrendChannel').combobox('getData');
            var channelValue = $('#userTrendChannel').combobox('getValue');
            if (channelData.length > 0) {
                $('#userTrendChannel').combobox('select', channelData[0].channelKey);
            } else {
                $('#userTrendChannel').combobox('clear');

            }
            if (channelValue == "ALL") {
                getUserTrendChartData(userTrend);
            }
        },
        onChange: function () {
            var channelData = $('#userTrendChannel').combobox('getData');
            if (channelData.length > 0) {
                getUserTrendChartData(userTrend);
            }

        }
    });

    $('#commoditySalesChannel').combobox({
        valueField: 'channelKey',
        textField: 'channelInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var channelData = $('#commoditySalesChannel').combobox('getData');
            var channelValue = $('#commoditySalesChannel').combobox('getValue');
            if (channelData.length > 0) {
                $('#commoditySalesChannel').combobox('select', channelData[0].channelKey);
            } else {
                $('#commoditySalesChannel').combobox('clear');
            }
            if (channelValue == "ALL") {
                getCommoditySalesChartData(commoditySales);
            }
        },
        onChange: function () {
            var channelData = $('#commoditySalesChannel').combobox('getData');
            if (channelData.length > 0) {
                getCommoditySalesChartData(commoditySales);
            }
        }
    });

    $('#orderAmountChannel').combobox({
        valueField: 'channelKey',
        textField: 'channelInterpret',
        editable: false,
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var channelData = $('#orderAmountChannel').combobox('getData');
            var channelValue = $('#orderAmountChannel').combobox('getValue');
            if (channelData.length > 0) {
                $('#orderAmountChannel').combobox('select', channelData[0].channelKey);
            } else {
                $('#orderAmountChannel').combobox('clear');
            }
            if (channelValue == "ALL") {
                getOrderAmountChartData(orderAmount);
            }
        },
        onChange: function () {
            var channelData = $('#orderAmountChannel').combobox('getData');
            if (channelData.length > 0) {
                getOrderAmountChartData(orderAmount);
            }
        }
    });

}

function getGoodsTransformChartData(cycleType) {
    goodsTransform = cycleType;
    if (cycleType == 'yesterday') {

        $($('.goodsTrans')[0]).addClass("btnActivit");
    }

    var platform = $("#goodsTransformPlatform").combobox("getValue");
    var channel = $("#goodsTransformChannel").combobox("getValue");

    //选择ALL时默认"" 查所有
    platform = platform == "ALL" ? "" : platform;
    channel = channel == "ALL" ? "" : channel;

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#goodsTransSupplierSel').combobox('getValue');
    }

    var parameters = {
        searchPlatformKey: platform,
        searchChannelKey: channel,
        searchCycleType: cycleType,
        searchSupplierKey: supplier
    };
    $.ajax({
        type: "post",
        async: true,
        url: serverURL + "/rest/1.0/analysisChart/getGoodsTransformChart",
        data: parameters,
        success: function (result) {
            //获得商品转化概况图表面板
            var myGoodsTransform = echarts.init(document.getElementById('goodsTransformPanel'));
            myGoodsTransform.setOption(goodsTransformChart); //先把可选项注入myChart中
            myGoodsTransform.showLoading({text: '数据获取中', effect: 'whirling'});

            if (!$.isEmptyObject(result)) {
                // $('#time_GoodsTransform').text(result.subTitle);

                // 填入数据
                myGoodsTransform.setOption({

                    series: [{
                        data: result.dataList
                    }]
                });
                myGoodsTransform.hideLoading();
            } else {
                var showStr = showDataDesc(cycleType);

                $('#goodsTransformPanel').html(showStr);
                $('#time_GoodsTransform').text('');
            }
        }
    });
}


function getUserTrendChartData(cycleType) {
    userTrend = cycleType;
    if (cycleType == 'day') {

        $($('.userTrend')[0]).addClass("btnActivit");
    }

    var platform = $("#userTrendPlatform").combobox("getValue");
    var channel = $("#userTrendChannel").combobox("getValue");

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#userTrendSupplierSel').combobox('getValue');
    }


    //选择ALL时默认"" 查所有
    platform = platform == "ALL" ? "" : platform;
    channel = channel == "ALL" ? "" : channel;

    var parameters = {
        searchPlatformKey: platform,
        searchChannelKey: channel,
        searchCycleType: cycleType,
        searchSupplierKey: supplier
    };
    $.ajax({
        type: "post",
        async: true,
        url: serverURL + "/rest/1.0/analysisChart/getUserTrendsChart",
        data: parameters,
        success: function (result) {
            if (!$.isEmptyObject(result)) {
                //$('#time_UserTrend').text(result.subTitle);

                //获得用户趋势类图表面板
                var myUserTrend = echarts.init(document.getElementById('userTrendPanel'));
                myUserTrend.setOption(userTrendChart); //先把可选项注入myChart中
                myUserTrend.showLoading({text: '数据获取中', effect: 'whirling'});

                // 填入数据
                myUserTrend.setOption({

                    xAxis: {
                        data: result.xAxisData
                    },
                    series: [{
                        data: result.newlyAddUsers
                    }, {
                        data: result.activeUsers
                    }]
                });
                myUserTrend.hideLoading();
            } else {
                var showStr = showDataDesc(cycleType)

                $('#userTrendPanel').html(showStr);
                $('#time_UserTrend').text('');
            }
        }
    });
}

//暂无数据时提示
function showDataDesc(cycleType) {

    var str = "";
    if (cycleType == "day") {
        str += "<span class='showDescr'>最近7天暂无数据</span>";
    } else if (cycleType == "yesterday") {
        str += "<span class='showDescr'>昨日暂无数据</span>";
    } else if (cycleType == "week") {
        str += "<span class='showDescr'>最近7周暂无数据</span>";
    } else if (cycleType == "toweek") {
        str += "<span class='showDescr'>本周暂无数据</span>";
    } else if (cycleType == "month") {
        str += "<span class='showDescr'>最近7月暂无数据</span>";
    } else if (cycleType == "tomonth") {
        str += "<span class='showDescr'>本月暂无数据</span>";
    }

    return str;
}

function getOrderAmountChartData(cycleType) {
    orderAmount = cycleType;
    if (cycleType == 'day') {
        $($('.orderAmount')[0]).addClass("btnActivit");
    }

    var platform = $("#orderAmountPlatform").combobox("getValue");
    var channel = $("#orderAmountChannel").combobox("getValue");

    //选择ALL时默认"" 查所有
    platform = platform == "ALL" ? "" : platform;
    channel = channel == "ALL" ? "" : channel;

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#orderAmountSupplierSel').combobox('getValue');
    }

    var parameters = {
        searchPlatformKey: platform,
        searchChannelKey: channel,
        searchCycleType: cycleType,
        searchSupplierKey: supplier
    };
    $.ajax({
        type: "post",
        async: true,
        url: serverURL + "/rest/1.0/analysisChart/getOrderAmountChart",
        data: parameters,
        success: function (result) {
            if (!$.isEmptyObject(result)) {

                //$('#time_OrderAmount').text(result.subTitle);
                //获得订单金额趋势类图表面板
                var myOrderAmount = echarts.init(document.getElementById('orderAmountPanel'));
                myOrderAmount.setOption(orderAmountChart); //先把可选项注入myChart中

                myOrderAmount.showLoading({text: '数据获取中', effect: 'whirling'});
                // 填入数据
                myOrderAmount.setOption({

                    xAxis: {
                        data: result.xAxisData
                    },
                    series: [{
                        data: result.dataList
                    }]
                });
                myOrderAmount.hideLoading();
            } else {
                var showStr = showDataDesc(cycleType);
                $('#orderAmountPanel').html(showStr);
                $('#time_OrderAmount').text('');
            }
        }
    });
}

function getCommoditySalesChartData(cycleType) {
    commoditySales = cycleType;
    if (cycleType == 'yesterday') {

        $($('.commoditySales')[0]).addClass("btnActivit");
    }

    var platform = $("#commoditySalesPlatform").combobox("getValue");
    var channel = $("#commoditySalesChannel").combobox("getValue");

    //选择ALL时默认"" 查所有
    platform = platform == "ALL" ? "" : platform;
    channel = channel == "ALL" ? "" : channel;

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#commoditySalesSupplierSel').combobox('getValue');
    }

    var parameters = {
        searchPlatformKey: platform,
        searchChannelKey: channel,
        searchCycleType: cycleType,
        searchSupplierKey: supplier
    };
    //通过Ajax获取数据
    $.ajax({
        type: "post",
        async: true,
        url: serverURL + "/rest/1.0/analysisChart/getCommoditySales",
        data: parameters,
        dataType: "json", //返回数据形式为json
        success: function (result) {
            xData = result.legend;
            if (!$.isEmptyObject(result)) {
                // $('#time_CommoditySales').text(result.subTitle);
                //获得商品销售类图表面板
                var myCommoditySales = echarts.init(document.getElementById('commoditySalesPanel'));
                //myCommoditySales.setOption(commoditySalesChart); //先把可选项注入myChart中
                myCommoditySales.setOption(commoditySalesChart); //先把可选项注入myChart中
                myCommoditySales.showLoading({text: '数据获取中', effect: 'whirling'});


                myCommoditySales.setOption({
                    legend: [{
                        data: result.legend
                    }],
                    series: result.dataList
                });


                myCommoditySales.hideLoading();
            } else {
                var showStr = showDataDesc(cycleType);
                $('#commoditySalesPanel').html(showStr);
                $('#time_CommoditySales').text('');
            }
        }
    });

    var xData = [];

    /*  //商品销售类点击缩放
     var zoomSize = 6;
     myChart.on('click', function (params) {
     //console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
     myChart.dispatchAction({
     type: 'dataZoom',
     startValue: xData[Math.max(params.dataIndex - zoomSize / 2, 0)],
     endValue: xData[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
     });
     });*/

}

//点击按钮时切换颜色样式
function convertBtnCss(className, index) {
    $('.' + className).removeClass("btnActivit");
    $($('.' + className)[index]).addClass("btnActivit");

}