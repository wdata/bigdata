/**
 * Created by Administrator on 2017/6/6.
 */

var supplierJID;//是否运营商
var supplierJText;//运营商描述
init();
function supplierFun() {

    //如 运营商管理员选着指定的运营商进行查看
    supplierJID = window.parent.parent.storeSupplier_ID;
    supplierJText = window.parent.parent.storeSupplier_Text;

    if (isEmpty_var(supplierJID)) {
        //非运营商管理员，显示各表下拉框 信息并加载
        $('.supplierShow').show();
        $.get(serverURL + "/rest/1.0/commonData/supplierList", {}, function (data) {
            $('#supplierSel').combobox('loadData', data);
        });

    } else {
        //运营商管理员，直接读取 supplierJID supplierJText信息
        $('.supplierShow').hide();
        $('#supplierSel').combobox('clear');

        getuserLabelList();
    }
}

// ----------------自定义标签添加面板----------------
function createCustomLabelPanel() {
    $('#customLabelPanel').window({
        title: "新增自定义标签",
        draggable: false,
        maximizable: false,
        collapsible: false,
        minimizable: false,
        resizable: false,
        modal: true,
        top: 200,
        left: 200
    });

    $('#customLabelPanel').window('close');
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
            var localSearchSupplierId = localStorage.getItem('userTabs_supplier');
            if (!isEmpty_var(localSearchSupplierId)) {
                $('#supplierSel').combobox('select', localSearchSupplierId);
            } else {
                var supplierData = $('#supplierSel').combobox('getData');
                if (supplierData.length > 0) {
                    if(operatorId){
                        $('#supplierSel').combobox('select', operatorId);
                    }else{
                        $('#supplierSel').combobox('select', supplierData[0].key);
                    }
                }
            }

        },
        onChange: function (_this) {
            //	将运营商ID存储到sessionStorage中
            sessionStorage.setItem("operatorId",_this);
            getuserLabelList();
        }
    });

    supplierFun();


    // ----------------设置文本框----------------
    $('#customLabelName').textbox({
        prompt: '自定义标签名称（必填）'
    });

    $('#customLabelDescribe').textbox({
        prompt: '自定义标签描述'
    });


}

//获得二级标签，以及二级标签下的所有三级标签
function getuserLabelList() {

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#supplierSel').combobox('getValue');
    }

    var supplierText;
    if (!isEmpty_var(supplierJText)) {
        supplierText = supplierJText;
    } else {
        supplierText = $('#supplierSel').combobox('getText');
    }

    localStorage.setItem('userTabs_supplier', supplier);
    localStorage.setItem('userTabs_supplierText', supplierText);

    $.post(serverURL + "/rest/1.0/userLabelController/userLabelList", {supplierId: supplier}, function (data) {
        if (!isEmpty_var(data)) {
            $('#labelPanel').empty();
            for (var i = 0; i < data.length; i++) {
                $('#labelPanel').append('<div class="labelPanel"><h4 class="titleConter">' + data[i].secondLabelName + '</h4></div>');


                var customLabelFlag = data[i].customLabel;// 自定义状态为 true, false为系统标签
                if (customLabelFlag) {
                    $('#labelPanel').append('<div style="margin:10px 0px 10px 20px;"><a style="margin: 5px 20px;" href="javascript:addCustomLabel()">新增自定义标签</a><a  href="javascript:delCustomLabel()">移除自定义标签</a></div>');
                }

                $('#labelPanel').append('<table class="labelTable" id="labelTable' + i + '"></table>');

                //二级标签下的所有三级标签
                createLowerLabel(data[i], customLabelFlag, i);
            }

            createCustomLabelPanel();
        }
    }, 'json');
}


//点击标签时保存tabId,以及是否 为自定义标签
function setClickMes(labelId, labelText, isCustomLabel) {

    localStorage.setItem('userTabs_tabId', labelId);
    localStorage.setItem('userTabs_tabText', labelText);
    localStorage.setItem('userTabs_isCustomLabel', isCustomLabel);

    /*
     通过点击进入用户查询页面【新增状态：false]。
     新增状态"false",不显示检索条件面板
     */
    localStorage.setItem('userTabs_isAddState', "false");

    toUserTabsLabelSettingsPage();
}

//打开用户详情列表
function toUserTabsLabelSettingsPage() {
    //打开用户标签添加页面
    location.href = serverURL + "/rest/1.0/userLabelController/userTabs_labelSettings";

}

//循环生成系统列表项(1行5个)

function createLowerLabel(data, customLabelFlag, i) {

    if (!$.isEmptyObject(data)) {
        var dataArray = data.thirdLabelList;
        if (isEmpty_var(dataArray)) {

        } else {
            var rowsIndex = -1;
            for (var j = 0; j < dataArray.length; j++) {

                var showDom = "";

                var labelId = dataArray[j].labelId;//标签ID
                var labelName = dataArray[j].labelName;//标签名
                var labelUserCount = dataArray[j].labelUserCount;//标签用户数


                //1行显示5个标签
                if (j % 5 == 0) {
                    $('#labelTable' + i).append("<tr></tr>");
                    rowsIndex++;
                }
                showDom += '<td class="jsCreateTDStyleOne">';

                if (customLabelFlag) {//为自定义标签时， 增加复选框
                    showDom += "<input style='vertical-align:text-top;' type='checkbox' name='customBox' value='" + labelId + "'> ";
                }

                showDom += labelName
                    + ' ( <a href="javascript:setClickMes(\'' + labelId + '\',\'' + labelName + '\',\'' + customLabelFlag + '\')">' + labelUserCount + '</a> )</td>';


                $(document.getElementById("labelTable" + i).rows[rowsIndex]).append(showDom);

            }

            /*用户选中一个标签时，取消其它标签选择*/
            $('[name=customBox]').on('click', function () {
                $('[name=customBox]').prop('checked', false);

                $(this).prop('checked', true);
            });

        }
    }
}

//关闭自定义标签面板
function closeCustomLabelPanel() {

    $('#customLabelPanel').window('close');
    $('#customLabelName').textbox('reset');
    $('#customLabelDescribe').textbox('reset');
}

//保存自定义标签信息
function saveCustomLabelData() {

    var customLabelName = $('#customLabelName').textbox('getText');//自定义标签名称
    var customLabelDescribe = $('#customLabelDescribe').textbox('getText');//自定义标签描述

    customLabelName = customLabelName.trim();
    if (customLabelName.length < 1) {
        $.messager.alert('提示', '标签名称必填');
        return false;
    }

    var supplier;
    if (!isEmpty_var(supplierJID)) {
        supplier = supplierJID;
    } else {
        supplier = $('#supplierSel').combobox('getValue');
    }

    var parameter = {
        supplierId: supplier,
        labelName: customLabelName,
        description: customLabelDescribe
    };

    $.post(serverURL + "/rest/1.0/userLabelController/addLabel", parameter, function (data) {
        if (!isEmpty_var(data)) {
            $.messager.alert('提示', '标签ID已生成，将跳至用户标签页面', '', function () {

                //新的标签覆盖
                localStorage.setItem('userTabs_isCustomLabel', "true");
                localStorage.setItem('userTabs_tabId', data);//生成的标签ID
                localStorage.setItem('userTabs_tabText', customLabelName);//用户填的标签名称
                /*
                 通过新增自定义标签，成功后进入用户查询页面【新增状态：true]。
                 新增状态"true",显示检索条件面板
                 */
                localStorage.setItem('userTabs_isAddState', "true");

                $('#customLabelPanel').hide();
                toUserTabsLabelSettingsPage();
            });

        } else {
            $.messager.alert('提示', '标签ID生成有误，请重新输入');
        }
    })
}


//移除自定义标签
function delCustomLabel() {
    var checkedVal = $("input[name=customBox]:checked");
    if (checkedVal.length != 1) {
        $.messager.alert('提示', '请选择要移除的自定义标签！');
    } else {

        $.messager.confirm('确认', '移除标签操作将同时移除该标签下的所有用户，您确认要移除标签吗？', function (r) {
            if (r) {
                var supplier;
                if (!isEmpty_var(supplierJID)) {
                    supplier = supplierJID;
                } else {
                    supplier = $('#supplierSel').combobox('getValue');
                }

                var parameter = {
                    supplierId: supplier,
                    labelId: checkedVal.val()
                };

                $.post(serverURL + "/rest/1.0/userLabelController/delLabel", parameter, function (data) {
                    /*data 成功(1) 失败(0)*/
                    if (data == 1) {
                        $.messager.alert('提示', '移除自定义标签成功！');
                        getuserLabelList();
                    } else if (data == 0) {
                        $.messager.alert('提示', '移除自定义标签失败！');
                    }
                }, 'json')
            }
        });
    }
}

function addCustomLabel() {
    /*展示层 并给以 用户 天骄标签名 描述*/

    $('#customLabelName').textbox('reset');
    $('#customLabelDescribe').textbox('reset');
    $('#customLabelPanel').show();

    $('#customLabelPanel').window('open');
}
