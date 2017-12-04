/**
 * Created by Administrator on 2017/2/14.
 */

function showCustomer() {//生成客户群 复选框

    $.get(obj.serverURL + '/rest/1.0/RecommendScene/consumerGroups', {app_id: obj.saveData.sceneApp}, function (data) {
        if (!$.isEmptyObject(data)) {
            var arrVal = data.data;
            var showDom = "";
            var rows = -1;
            for (var i = 0; i < arrVal.length; i++) {

                if (i % 5 == 0) {
                    $('#icustomer').append("<tr></tr>");
                    rows++;
                }

                showDom = '<td style="text-align:left;"><input type="checkbox" name="customerGroup" value="' + arrVal[i].id + '" />' +
                    '<span title="' + arrVal[i].description + '" class="easyui-tooltip">' + arrVal[i].name + '<span></td>';

                $(document.getElementById("icustomer").rows[rows]).append(showDom);

            }
        }
    }, 'json');
}

function rulesChange() {//生成 结果集数据
    var vcalculationRules = $.trim($("#icalculationRules").datebox("getValue"));


    if (vcalculationRules == "one") {
        obj.getZtreeCheckedAll();
        var arrayDataOne = obj.ztreeCheckeData;
        var showDom = "";
        $("#rulesTableOne tr:not(:first)").remove();

        for (var i = 0; i < arrayDataOne.length; i++) {
            showDom += '<tr><td>' + arrayDataOne[i].text + '</td><td><input type="text" name="rulesGroup"  onchange="obj.rulesNumberSum()"/></td></tr>';
        }

        $('#rulesTableOne').append(showDom);
        $('#iresultNumber').textbox('setText', '');
        $('#iresultNumber').textbox('readonly', true);
        $('#rulesTableOne').show();
        $('#rulesTableTwo').hide();
    } else if (vcalculationRules == "two") {
        obj.getZtreeCheckedAll();
        $("#rulesTableTwo tr:not(:first)").remove();
        var arrayDataTwo = obj.ztreeCheckeData;
        var showDom = "";

        for (var i = 0; i < arrayDataTwo.length; i++) {
            showDom += '<tr><td>' + arrayDataTwo[i].text + '</td><td></tr>';
        }

        $('#rulesTableTwo').append(showDom);
        $('#iresultNumber').textbox('setText', '');
        $('#iresultNumber').textbox('readonly', false);
        $('#rulesTableOne').hide();
        $('#rulesTableTwo').show();
    }
}

var obj = {

    serverURL: serverURL_Rscene,
    saveData: {},
    zDataNodes: [],
    ztreeCheckeData: [],
    setFlag: false,
    rulesGroupCount: "",
    userID: "",

    toSsceneListPage: function () {//跳转 列表
        location = "rsceneList.html";
    },
    getZtreeCheckedAll: function () {//获取所有选中节点的值
        var strID = "";
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes = treeObj.getCheckedNodes(true);
        obj.ztreeCheckeData = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].pId != null) {
                obj.ztreeCheckeData.push({id: nodes[i].value, text: nodes[i].name});
            }
        }
        return strID;
    },
    rulesNumberSum: function () {
        // console.log($("input[type=text][name=rulesGroup]").val());
        var vcalculationRules = $.trim($("#icalculationRules").datebox("getValue"));
        var values = $("input[type=text][name=rulesGroup]");
        var sumNumber = 0;
        var vztreeCheckeData = obj.ztreeCheckeData;
        obj.rulesGroupCount = "";
        if (vcalculationRules == "one") {
            // + 拼接结果集ID以及对应的数值
            for (var i = 0; i < values.length; i++) {
                var textVal = values[i].value == "" ? 0 : values[i].value;
                if (!/^[0-9]*$/.test(textVal)) { //不为正整数时提示
                    $.messager.alert('提示', '数据集【' + vztreeCheckeData[i].text + '】请填写正整数');
                    return false;
                }

                var str = vztreeCheckeData[i].id + "[" + textVal + "]";//1[3]+2[5]
                if (i != (values.length - 1)) {
                    str += '+';
                }
                obj.rulesGroupCount += str;
                sumNumber += parseInt(textVal);
            }
            $('#iresultNumber').textbox('setText', sumNumber);
        } else if (vcalculationRules == "two") {
            // && 拼接结果集ID
            for (var j = 0; j < vztreeCheckeData.length; j++) {
                var str = vztreeCheckeData[j].id;
                if (j != (vztreeCheckeData.length - 1)) {
                    str += '&';
                }
                obj.rulesGroupCount += str;
            }
        }

    },
    initZtreeData: function () {
        $.get(obj.serverURL + '/rest/1.0/RecommendScene/resultSets', {app_id: obj.saveData.sceneApp}, function (data) {

            var arr = new Array();
            if (!$.isEmptyObject(data.data)) {//增加父级节点
                //var dataList = data.data;
                var dataList = data.data;
                if (!dataList[0].resultSetList.length > 0) {//无子内容情况下
                    arr.push({id: dataList[0].appId, pId: 0, name: dataList[0].appName, nocheck: true});
                    arr.push({pId: dataList[0].appId, name: "该应用无可选结果集", nocheck: true});

                    $.fn.zTree.init($("#treeDemo"), setting, arr);
                    obj.setFlag = true;
                    return false;

                }

                for (var h = 0; h < dataList.length; h++) {
                    var appId = dataList[h].appId;
                    var appName = dataList[h].appName;

                    arr.push({id: appId, pId: 0, name: appName, title: appName});

                }

                for (var i = 0; i < dataList.length; i++) {//增加子节点
                    var appId = dataList[i].appId;

                    if (!$.isEmptyObject(dataList[i].resultSetList)) {
                        var resultSetList = dataList[i].resultSetList;
                        for (var j = 0; j < resultSetList.length; j++) {
                            var resultId = resultSetList[j].id;
                            var resultName = resultSetList[j].name;
                            var resultDescription = resultSetList[j].description;

                            arr.push({pId: appId, name: resultName, value: resultId, title: resultDescription});
                        }
                    }
                }

                $.fn.zTree.init($("#treeDemo"), setting, arr);
                obj.setFlag = false;
            }
        }, 'json');
    },
    upStep: function (tagType) {//点击上一步操作
        if (tagType == "customer") {
            $('#icustomer').empty();
        } else if (tagType == "dataSet") {
            $("#rulesTableOne tr:not(:first)").remove();
            $('#icalculationRules').combobox('clear');
            $('#iresultNumber').textbox('clear');
            $("#rulesTableTwo tr:not(:first)").remove();

        } else if (tagType == "carousel") {
            $('#icarouselRules').combobox('clear');

        } else if (tagType == "getAPI") {

        }
        //获得当前选中选项卡的索引
        //显示上级菜单
        var tab = $('#panelTags').tabs('getSelected');
        var index = $('#panelTags').tabs('getTabIndex', tab);
        if (index == 0) {//当前只有5个选项卡 索引0-4
            index = index;
        } else {
            $('#panelTags').tabs('disableTab', index);
            index -= 1;
        }
        $("#panelTags").tabs("enableTab", index);//启用选项卡

        $("#panelTags").tabs("select", index);//设置打开索引 对应的tag

    },
    nextStep: function (tagType) {//点击下一步操作
        var flag = true;
        if (tagType == "describe") {
            flag = obj.verifyDescribe();
            if (flag) {
                showCustomer();
            }
        } else if (tagType == "customer") {
            flag = obj.verifyCustomer();
            if (flag) {
                obj.initZtreeData();
                // rulesChange();
            }
        } else if (tagType == "dataSet") {
            flag = obj.verifyDataSet();
        } else if (tagType == "carousel") {
            flag = obj.verifyCarousel();
        } else if (tagType == "getAPI") {
            flag = obj.verifyGetAPI();
        }

        if (flag) {
            //获得当前选中选项卡的索引
            var tab = $('#panelTags').tabs('getSelected');
            var index = $('#panelTags').tabs('getTabIndex', tab);
            if (index == 4) {//当前只有5个选项卡 索引0-4
                index = index;
            } else {
                $('#panelTags').tabs('disableTab', index);
                index += 1;
            }
            $("#panelTags").tabs("enableTab", index);//启用选项卡

            $("#panelTags").tabs("select", index);//设置打开索引 对应的tag
        }

    },
    verifyName: function () {//校验名称是否重复
        var appid = $('#isceneApp').combobox('getValue');

        /*场景名称校验*/
        var sceneName = $.trim($('#isceneName').val());

        if ($.trim(sceneName) != "") {
            var param = {app_id: appid, scene_name: $.trim(sceneName)};
            $.ajax({
                url: obj.serverURL + "/rest/1.0/RecommendScene/scene/nameValid",
                type: "get",
                async: false,
                data: param,
                dataType: "json",
                success: function (result) {
                    if (null != result && !$.isEmptyObject(result)) {
                        if (!result.data) {//不重复为true 取反为 已存在
                            $('#dSceneName').append('<span id="sDSceneName" class="errorRed">场景名称已存在 请更换</span>');
                            return false;
                        } else {
                            $('#sDSceneName').remove();
                            return false;
                        }
                        return true;
                    }
                }
            });
        }

        /*接口名称校验*/
        var sceneMethodName = $.trim($('#isceneMethodName').val());

        if ($.trim(sceneMethodName) != "") {
            var param = {app_id: appid, api_method: $.trim(sceneMethodName)};
            $.ajax({
                url: obj.serverURL + "/rest/1.0/RecommendScene/scene/apiMethodValid",
                type: "get",
                async: false,
                data: param,
                dataType: "json",
                success: function (result) {
                    if (!result.data) {//不重复为true 取反为 已存在
                        $('#dSceneMethodName').append('<span id="sDSceneMethodName" class="errorRed">接口名称已存在 请更换</span>');
                        return false;
                    } else {
                        $('#sDSceneMethodName').remove();
                        return false;
                    }
                    return true;
                }

            });

        }
    },
    verifyDataSet: function () {
        var vztreeCheckeData = obj.ztreeCheckeData;
        var vcalculationRules = $.trim($("#icalculationRules").datebox("getValue"));
        var vresultNumber = $('#iresultNumber').textbox('getText');
        var values = $("input[type=text][name=rulesGroup]");
        var setFlag = obj.setFlag;//优先判断是否有结果集

        if (setFlag) {
            $.messager.alert('提示', '请重新选【生效的终端类型】');
            return false;
        }
        if (vcalculationRules == "") {
            $.messager.alert('提示', '请选择结果集计算规则');
            return false;
        }
        if (vztreeCheckeData == undefined || vztreeCheckeData.length < 1) {
            $.messager.alert('提示', '请选择结果集计算规则');
            return false;
        }

        if (vcalculationRules == "one") {
            // + 拼接结果集ID以及对应的数值
            for (var i = 0; i < values.length; i++) {
                var textVal = values[i].value == "" ? 0 : values[i].value;
                if (!/^[0-9]*$/.test(textVal)) { //不为正整数时提示
                    $.messager.alert('提示', '数据集【' + vztreeCheckeData[i].text + '】请填写正整数');
                    return false;
                }
            }
        }

        if (vresultNumber == "") {
            $.messager.alert('提示', '请计算结果数');
            return false;

        }

        obj.saveData.resultNumber = vresultNumber;
        obj.saveData.calculationRules = vcalculationRules;
        obj.saveData.rulesGroupCount = obj.rulesGroupCount;
        return true;
    },
    verifyCarousel: function () {
        var vcarouselRules = $.trim($("#icarouselRules").datebox("getValue"));

        if (vcarouselRules == "") {
            $.messager.alert('提示', '请选择轮播规则');
            return false;
        }
        obj.saveData.carouselRules = vcarouselRules;

        return true;
    },
    verifyGetAPI: function () {
        $.messager.confirm('确认', '您确认要生成API吗？', function (r) {
            obj.saveData.createAPI = false;
            if (r) {
                obj.saveData.createAPI = true;
                var ajData = {
                    user_id: obj.userID,
                    app_id: obj.saveData.sceneApp,
                    scene_name: obj.saveData.sceneName,
                    api_method: obj.saveData.sceneMethodName,
                    scene_location: obj.saveData.scenePosition,
                    scene_description: obj.saveData.sceneDescribe,
                    consumer_sets: obj.saveData.customerGroup,
                    rule_exp: obj.saveData.rulesGroupCount,
                    result_count: obj.saveData.resultNumber,
                    polling_id: obj.saveData.carouselRules

                };
                $.post(obj.serverURL + "/rest/1.0/RecommendScene/scene", ajData, function (dataJson) {
                    if (dataJson.msg == "success") {
                        if (null != dataJson.data && !$.isEmptyObject(dataJson.data)) {
                            var data = dataJson.data;
                            $('#apiURL').text(data.url);
                            $('#apiMethod').text(data.method);
                            $('#apiMethodName').text(data.apiMethod);
                            $('#apiHeader').text(data.header);
                            $('#paramTable').datagrid('loadData', data.paramList);
                            $('#paramTable').datagrid('reload');
                            $('#apiDescription').text(data.description);
                            $('#apiRequestEg').text(data.requestEg);
                            $('#apiSuccessEg').text(data.successEg);
                            $('#apiFailEg').text(data.failEg);
                            $('#resultCodeTable').datagrid('loadData', data.resultCodeList);
                            $('#resultCodeTable').datagrid('reload');

                            $('#win_api').window('open');//显示API生成窗口
                        }
                    }

                })
                return false;
            }
        });
    },
    verifyCustomer: function () {
        var values = $("input[type=checkbox][name=customerGroup]:checked");
        var vcustomerGroup = "";
        if (values.length < 1) {
            $.messager.alert('提示', '请至少选择一个客户群');
            return false;
        } else {
            for (var i = 0; i < values.length; i++) {
                vcustomerGroup += values[i].value;
                if (i != values.length - 1) {
                    vcustomerGroup += ",";
                }
            }
        }

        obj.saveData.customerGroup = vcustomerGroup;

        return true;

    },
    verifyDescribe: function () {//校验场景描述 表单
        var vsceneApp = $.trim($("#isceneApp").datebox("getValue"));

        var vsceneName = $.trim($("#isceneName").val());
        var vsceneMethodName = $.trim($("#isceneMethodName").val());

        var vscenePosition = $.trim($("#iscenePosition").val());
        var vsceneDescribe = $.trim($("#isceneDescribe").val());

        var isCeneNameError = $('.errorRed').length;

        if (vsceneName == "") {
            $.messager.alert('提示', '请填写场景名称');
            return false;
        }

        if (vsceneMethodName == "") {
            $.messager.alert('提示', '请填写接口名称');
            return false;
        }

        if (isCeneNameError > 0) {
            $.messager.alert('提示', '填写重复，请重填');
            return false;
        }

        if (vscenePosition == "") {
            $.messager.alert('提示', '请填写场景位置');
            return false;
        }
        if (vsceneApp == "") {
            $.messager.alert('提示', '请选择生效的终端类型');
            return false;
        }
        if (vsceneDescribe == "") {
            $.messager.alert('提示', '请填写场景描述');
            return false;
        }
        obj.saveData.sceneApp = vsceneApp;
        obj.saveData.sceneName = vsceneName;
        obj.saveData.sceneMethodName = vsceneMethodName;
        obj.saveData.scenePosition = vscenePosition;
        obj.saveData.sceneDescribe = vsceneDescribe;

        return true;
    },
    toRsceneListPage: function () {//返回到查询列表页
        window.location.href = serverURL + "/rest/1.0/RecommendScene/toRsceneList";
    }
};

$(function () {
    $.get(serverURL + "/rest/1.0/RecommendScene/getSeesionUserId", function (data) {
        if (null != data && !$.isEmptyObject(data)) {
            obj.userID = data.userID;
        }
    });


    $('#isceneName').textbox({
        onChange: obj.verifyName
    });
    $('#isceneMethodName').textbox({
        onChange: obj.verifyName
    });

    $('#win_api').window({
        modal: true,
        minimizable: false,
        collapsible: false,
        title: '生成API',
        draggable: false,
        resizable: false,
        closable: false
    });
    $('#win_api').window('close');

    $('#paramTable').datagrid({
        striped: true,
        singleSelect: true,
        rownumbers: true,
        allowCellWrap: true,
        nowrap: false,
        columns: [[
            {field: 'name', title: '名称', align: 'center'},
            {field: 'required', title: '是否必填', width: 60, align: 'center'},
            {field: 'valueType', title: '值类型', width: 70, align: 'center'},
            {field: 'value', title: '值', width: 130, align: 'center'},
            {field: 'description', title: '描述', width: 250, align: 'center'}
        ]]
    });

    $('#resultCodeTable').datagrid({
        striped: true,
        singleSelect: true,
        rownumbers: true,
        allowCellWrap: true,
        nowrap: false,
        columns: [[
            {field: 'code', title: '状态码', align: 'center'},
            {field: 'msg', title: '描述', width: 430, align: 'center'}
        ]]
    });

    $('#panelTags').tabs({
        border: false,
        fit: false,
        justified: true,
        narrow: true,
        pill: true,
        title: 1,
        disabled: true,
        tabHeight: 50,
        width: 1000

        /*onSelect:function(title){
         alert(title+' is selected');
         return false;
         }*/

    });

    //初始化 默认显示第一个选项卡禁用其他选项卡
    $('#panelTags').tabs('disableTab', 1);
    $('#panelTags').tabs('disableTab', 2);
    $('#panelTags').tabs('disableTab', 3);
    $('#panelTags').tabs('disableTab', 4);


    $('#icalculationRules').combobox({
        editable: false,
        valueField: 'value',
        textField: 'text',
        data: [{value: 'one', text: '+'},
            {value: 'two', text: '&&'}],

        onChange: rulesChange,
        onSelect: function () {
            /*alert(obj.ztreeCheckeData);
             return this.combobox(setText,1);*/
        }
    });

    $.get(obj.serverURL + '/rest/1.0/RecommendScene/apps', function (data) {
        if (!$.isEmptyObject(data)) {
            $('#isceneApp').combobox('loadData', data.data);
        }
    }, 'json');

    $('#isceneApp').combobox({
        editable: false,
        valueField: 'id',
        textField: 'name',
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var data = $('#isceneApp').combobox('getData');
            if (data.length > 0) {
                $('#isceneApp').combobox('select', data[0].id);
            }
        },
        onChange: function () {
            //切换生效终端类型时，需要校验 场景名称，接口名称是否重复
            obj.verifyName();
        }
    });

    $.get(obj.serverURL + '/rest/1.0/RecommendScene/pollingRule', {}, function (data) {
        if (!$.isEmptyObject(data)) {
            $('#icarouselRules').combobox('loadData', data.data);
        }
    }, 'json');
    $('#icarouselRules').combobox({
        editable: false,
        valueField: 'id',
        textField: 'rule',
        onLoadSuccess: function () {
            //加载完成后，设置选中第一项
            var data = $('#isceneApp').combobox('getData');
            if (data.length > 0) {
                $('#isceneApp').combobox('select', data[0].id);
            }
        }
    });

    $('#iresultNumber').textbox({
        readonly: true,
        onChange: obj.rulesNumberSum
    })
});

var setting = {
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        },
        showTitle: true, //是否显示节点title信息提示 默认为true
        key: {
            title: "title" //设置title提示信息对应的属性名称 也就是节点相关的某个属性
        }
    },
    callback: {
        onCheck: rulesChange //设置复选框点击触发 调用函数
    }

};


var code;


function setCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        type = {"Y": "ps", "N": "ps"};
    zTree.setting.check.chkboxType = type;
}
function showCode(str) {
    if (!code) code = $("#code");
    code.empty();
    code.append("<li>" + str + "</li>");
}


