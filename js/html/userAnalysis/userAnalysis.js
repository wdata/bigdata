/**
 * Created by Administrator on 2017/6/28.
 */
var supplierJID;//是否运营商

/*veidoosArray    前面已选维度，多个维度使用逗号分隔
 *groupKeysArray  前面已选维度所选中的分组key，多个维度的分组key使用逗号分隔，分组key数量需与维度数量一致
 *nextVeidoo 下一个要分组的维度
 * 已选中的指标 */
var veidoosArray = [], groupKeysArray = [], nextVeidoo = "", tempSelectArray = [];
/*
 * isInitState用于判断是否初始加载完成，是：true 否：false
 * FixedIndexKey记入当前已选的固定维度Key。
 *     用于场景当改变非最后一个饼图的分布值时，下一个饼图按已选择维度重新加载分布
 * flagLong 当前指标选择对应下标*/
var isInitState = false, FixedIndexKey = [], flagLong = 0;

init();

function supplierFun() {
    //如 运营商管理员选着指定的运营商进行查看 嵌几层iframe 追加几个parent
    supplierJID = window.parent.parent.storeSupplier_ID;
//testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
    if (isEmpty_var(supplierJID)) {
        //非运营商管理员，显示各表下拉框 信息并加载
        $('.supplierShow').show();
        $.get(serverURL + "/rest/1.0/commonData/supplierList", {}, function (data) {
            $('#supplierSel').combobox('loadData', data);


            getIndexData();
        });
    } else {
        //运营商管理员，直接读取 supplierJID supplierJText信息
        $('.supplierShow').hide();
        $('#supplierSel').combobox('clear');

        getIndexData();
    }

}

function init() {

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
            var $indexOne = $('#indexOne').combobox('getValue');

            //	将运营商ID存储到sessionStorage中
            sessionStorage.setItem("operatorId",_this);

            if (isInitState && !isEmpty_var($indexOne)) {
                showItemOne();
            }
        }
    });

    supplierFun();


    $('#indexOne').combobox({
        width: 120,
        valueField: 'key',
        textField: 'value',
        editable: false,
        onLoadSuccess: function () {
            flagLong = 0;
            var indexOne = $('#indexOne');
            if (!isEmpty_var(FixedIndexKey) && FixedIndexKey.length > 0) {
                indexOne.combobox('select', FixedIndexKey[0]);
            } else if (indexOne.combobox('getData').length > 0) {
                indexOne.combobox('select', indexOne.combobox('getData')[0].key);
            } else {
                indexOne.combobox('clear');
            }
        },
        onChange: function () {

            showItemOne();
        }
    });

    $('#indexTwo').combobox({
        width: 120,
        valueField: 'key',
        textField: 'value',
        editable: false,
        onLoadSuccess: function () {
            flagLong = 1;
            var indexTwo = $('#indexTwo');
            if (!isEmpty_var(FixedIndexKey) && FixedIndexKey.length > 1) {
                indexTwo.combobox('select', FixedIndexKey[1]);
                submitByPara();
            } else if (indexTwo.combobox('getData').length > 0) {
                indexTwo.combobox('select', indexTwo.combobox('getData')[0].key);
                submitByPara();
            } else {
                indexTwo.combobox('clear');
            }
        },
        onChange: function () {

            var $value = $('#indexTwo').combobox('getValue');
            nextVeidoo = $value;

            flagLong = 1;
            if (FixedIndexKey[1] != $value) {
                submitByPara();
            }

            /*隐藏级联效果*/
            $('#itemThree').hide();
            $('#itemFour').hide();

            FixedIndexKey[1] = $value;
        }

    });

    $('#indexThree').combobox({
        width: 120,
        valueField: 'key',
        textField: 'value',
        editable: false,
        onLoadSuccess: function () {
            flagLong = 2;
            var indexThree = $('#indexThree');
            if (!isEmpty_var(FixedIndexKey) && FixedIndexKey.length > 2) {
                indexThree.combobox('select', FixedIndexKey[2]);
                submitByPara();
            } else if (indexThree.combobox('getData').length > 0) {
                indexThree.combobox('select', indexThree.combobox('getData')[0].key);
                submitByPara();
            } else {
                indexThree.combobox('clear');
            }
        },
        onChange: function () {

            var $value = $('#indexThree').combobox('getValue');
            nextVeidoo = $value;

            flagLong = 2;
            if (FixedIndexKey[2] != $value) {
                submitByPara();
            }
            FixedIndexKey[2] = $value;

            /*隐藏级联效果*/
            $('#itemFour').hide();

        }
    });

    $('#indexFour').combobox({
        width: 120,
        valueField: 'key',
        textField: 'value',
        editable: false,
        onLoadSuccess: function () {
            flagLong = 3;
            var indexFour = $('#indexFour');
            if (!isEmpty_var(FixedIndexKey) && FixedIndexKey.length > 3) {
                indexFour.combobox('select', FixedIndexKey[3]);
                submitByPara();
            } else if (indexFour.combobox('getData').length > 0) {
                indexFour.combobox('select', indexFour.combobox('getData')[0].key);
                submitByPara();
            } else {
                indexFour.combobox('clear');
            }
        },
        onChange: function () {

            var $value = $('#indexFour').combobox('getValue');
            nextVeidoo = $value;

            flagLong = 3;
            if (FixedIndexKey[3] != $value) {
                submitByPara();
            }
            FixedIndexKey[3] = $value;

        }
    });

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

            } else if (timeDecValue == "0") {
                //1清除，2隐藏
                $('#timeDec_spanOne').hide();
                $('#timeDec_inputOne').val('');

                if (isInitState) {
                    showItemOne();
                }
            }
        }
    });

    //第一次加载完后，可以在 运营商，等检索条件 切换时 更新图表
    isInitState = true;
}
/*
 * tempTimeVal:存储第一次年月，如果重复 则不再执行刷新操作
 * timeChange 选择年月时显示指标1，隐藏其他指标
 * */
var tempTimeVal = "";
function timeChange(val) {
    if (val && tempTimeVal != val) {
        showItemOne();
    }
    tempTimeVal = val;
}

//默认显示指标1，隐藏其他指标
function showItemOne() {
    var $value = $('#indexOne').combobox('getValue');
    nextVeidoo = $value;
    FixedIndexKey = [];
    tempSelectArray = [];
    veidoosArray = [];
    groupKeysArray = [];

    flagLong = 0;

    if (FixedIndexKey[0] != $value) {
        submitByPara();
    }

    FixedIndexKey[0] = $value;

    /*隐藏级联效果*/
    $('#itemTwo').hide();
    $('#itemThree').hide();
    $('#itemFour').hide();
}

var indexData;
/*获得指标选项*/
function getIndexData() {
    $.get(serverURL + "/rest/1.0/userAnalysis/groupVeidoo", {}, function (data) {
        indexData = data;
        //indexData.unshift({key: '', value: '全部'});//追加第一项

        $('#indexOne').combobox('loadData', indexData);
    });
};


//提交并查询数据
function submitByPara() {

    var outPiePanelID = "", nextIndexID = "", spliceLength = 1;
    if (flagLong == 0) {
        outPiePanelID = "One";
        nextIndexID = "Two";
        spliceLength = 4;

        $('#itemOne').show();

        $('#itemTwo').hide();
        $('#itemThree').hide();
        $('#itemFour').hide();
    } else if (flagLong == 1) {
        outPiePanelID = "Two";
        nextIndexID = "Three";
        spliceLength = 3;

        $('#itemTwo').show();

        $('#itemThree').hide();
        $('#itemFour').hide();
    } else if (flagLong == 2) {
        outPiePanelID = "Three";
        nextIndexID = "Four";
        spliceLength = 2;

        $('#itemThree').show();

        $('#itemFour').hide();
    } else if (flagLong == 3) {
        outPiePanelID = "Four";
        spliceLength = 1;

        $('#itemFour').show();
    } else {
        return false;
    }
    //先下标清空，主要是基于当前下标清空后续数据，再保存
    tempSelectArray.splice(flagLong, spliceLength);
    groupKeysArray.splice(flagLong, spliceLength);
    veidoosArray.splice(flagLong, spliceLength);

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#supplierSel').combobox('getValue');
    }

    var timeType, month;
    //判断时间选择 做不同赋值操作
    timeType = $('#timeDec').combobox('getValue');
    if (timeType == "1") {
        //历史自然月获得对应的年月控件值
        month = $('#timeDec_inputOne').val();
    } else {
        month = "";
    }

    var veidoosArrayStr = ArrayTOString(veidoosArray);
    var groupKeysArrayStr = ArrayTOString(groupKeysArray);

    var submitPara = {
        supplierId: supplier,
        timeType: timeType,
        month: month,
        veidoos: veidoosArrayStr,
        groupKeys: groupKeysArrayStr,
        nextVeidoo: nextVeidoo
    };


    $.post(serverURL + "/rest/1.0/userAnalysis/userDistribution", submitPara, function (data) {


        createEchart(outPiePanelID, flagLong, data, nextIndexID, spliceLength);
    });
}
/*
 * outIndex:用于存储当前 (指标Key,分组Key) 索引标记
 * dataList: 待转换数据
 * nextIndexID:下一个指标下拉框节点
 * spliceLength:待重置数组数据，过滤长度
 * spliceLength:带清除的长度
 * */
function createEchart(outPiePanelID, flagLong, dataList, nextIndexID, spliceLength) {
    if (!document.getElementById("piePanel" + outPiePanelID)) return false;


    $('#piePanelShowLoading' + outPiePanelID).empty();
    var outIDDiv = document.getElementById("piePanel" + outPiePanelID);
    $(outIDDiv).show();

    var piePanel = echarts.init(outIDDiv);
    piePanel.setOption(pieOption); //先把可选项注入myChart中
    piePanel.showLoading({
        text: '数据获取中',
        color: '#c23531',
        textColor: '#000',
        maskColor: '#F1F6F7'
    });

    if (!$.isEmptyObject(dataList)) {

        var data_legend = new Array();//副标题
        var data_series = new Array();//数据 key-val

        for (var i = 0; i < dataList.length; i++) {
            var tempObje = new Object();
            tempObje.value = dataList[i].groupPercent;
            tempObje.groupKey = dataList[i].groupKey;
            tempObje.name = dataList[i].groupName;

            data_series.push(tempObje);
            data_legend.push(dataList[i].groupName);

        }


        // 填入数据
        piePanel.setOption({
            legend: {
                data: data_legend
            },
            series: [{
                data: data_series
            }]
        });


        /*先清除单击事件，再绑定*/
        piePanel.off('click');

        piePanel.on('click', function (params) {

            //先下标清空，主要是基于当前下标清空后续数据，再保存
            tempSelectArray.splice(flagLong, spliceLength);
            groupKeysArray.splice(flagLong, spliceLength);
            veidoosArray.splice(flagLong, spliceLength);

            var groupKey = params.data.groupKey;


            //保存当前饼图点击的分组Key
            groupKeysArray[flagLong] = groupKey;
            var tempIndex = $('#index' + outPiePanelID).combobox('getValue');
            veidoosArray[flagLong] = tempIndex;
            tempSelectArray[flagLong] = tempIndex;

            var tempNextVeidoo = $('#index' + nextIndexID).combobox('getValue');
            nextVeidoo = tempNextVeidoo == "" ? nextVeidoo : tempNextVeidoo;

            var tempIndexData = new Array();
            if (!isEmpty_var(nextIndexID)) {
                for (var i = 0; i < indexData.length; i++) {
                    tempIndexData.push(indexData[i]);
                }

                for (var k = 0; k < tempSelectArray.length; k++) {
                    for (var j = 0; j < tempIndexData.length; j++) {
                        if (tempIndexData[j].key == tempSelectArray[k]) {
                            tempIndexData.splice(j, 1);
                            break;
                        }
                    }
                }

                //console.log(tempIndexData);

            }

            if (flagLong >= 0 && flagLong < 4) {
                FixedIndexKey[flagLong + 1] = checkIsAreTempIndexDataByIndexKey(nextVeidoo, tempIndexData);
            }

            $('#index' + nextIndexID).combobox('loadData', tempIndexData);
        });

        piePanel.hideLoading();

    } else {
        $(outIDDiv).hide();
        $('#piePanelShowLoading' + outPiePanelID).text("暂无数据");
    }
}
/*
 * 判断之前选择的维度Key是否在新的tempIndexData中。
 * 如果在返回本身，不在则返回tempIndexData第一个Key
 * nextVeidoo: 下个已选的
 * tempIndexData：去除其他指标已选维度，剩下不重复其他指标的维度*/
function checkIsAreTempIndexDataByIndexKey(nextVeidoo, tempIndexData) {
    if (isEmpty_var(tempIndexData) || tempIndexData.length < 1) return "";
    for (var i = 0; i < tempIndexData.length; i++) {
        if (tempIndexData[i].key == nextVeidoo) {
            return nextVeidoo;
        }
    }
    return tempIndexData[0].key;
}

/*echart*/
pieOption = {
    tooltip: {
        trigger: 'item',
        formatter: "名称：{b}<br/>&nbsp;&nbsp;&nbsp;数值：{c} <br/>&nbsp;&nbsp;&nbsp;百分比：{d}%"
    },
    legend: {
        left: 10,
        top: 200,
        x: "left",
        y: 'bottom'
        /* data: ['直达', '营销广告', '搜索引擎']*/
    },
    /*toolbox: {
     show : true,
     feature : {
     // mark : {show: true},  //辅助线
     dataView : {show: true, readOnly: false},//数据视图
     restore : {show: true}, //还原
     saveAsImage : {show: true}  //保存图像
     }
     },*/
    calculable: true,
    series: [
        {
            name: '数据来源',
            type: 'pie',
            selectedMode: 'single',
            radius: '55%',
            center: ['45%', '20%'],
            label: {
                normal: {
                    show: true,
                    position: 'outside',
                    formatter: "{c}"
                }
            },
            labelLine: {
                normal: {
                    show: true,
                    length: 1
                }
            },
            data: [
                /*
                 {value: 1548, name: '搜索引擎'}*/
            ]
        }
    ]
};
