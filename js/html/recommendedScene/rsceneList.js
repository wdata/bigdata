/**
 * Created by Administrator on 2017/2/9.
 */
var serURL = serverURL_Rscene;

$(function () {
    $.get(serURL + '/rest/1.0/RecommendScene/apps', function (data) {
        if (!$.isEmptyObject(data)) {
            data.data.unshift({id: "", name: "全部"});//追加第一项全部
            $('#iapplication').combobox('loadData', data.data);
        }
    }, 'json');

    //初始应用下拉框值
    $('#iapplication').combobox({
        valueField: 'id',
        textField: 'name',
        width: 150

    });


    $('#dataList').datagrid({
        method: 'get',
        //fitColumns: true,
        striped: true,
        singleSelect: true,
        rownumbers: true,
        pagination: true,
        allowCellWrap: true,
        nowrap: false,
        pageSize: 10,
        pageList: [10, 20],
        columns: [[
            {field: 'id', title: '场景ID', width: 60, align: 'center', order: 'desc', sortable: true},
            {field: 'name', title: '场景名称', width: 130, align: 'center', order: 'desc', sortable: true},
            {field: 'apiMethod', title: '接口名称', width: 130, align: 'center', order: 'desc', sortable: true},
            {field: 'app', title: '应用', width: 200, align: 'center', order: 'desc', sortable: true},
            {field: 'location', title: '位置', width: 100, align: 'center', order: 'desc', sortable: true},
            {field: 'description', title: '描述', width: 250, align: 'center', order: 'desc', sortable: true},
            {field: 'creator', title: '创建人', width: 80, align: 'center', order: 'desc', sortable: true},
            {field: 'createDateStr', title: '创建时间', width: 150, align: 'center', order: 'desc', sortable: true},
            {field: 'modifier', title: '修改人', width: 80, align: 'center', order: 'desc', sortable: true},
            {field: 'modifyDateStr', title: '修改时间', width: 150, align: 'center', order: 'desc', sortable: true}
            /*,{field:'operate',title:'操作',width:100,align:'center',formatter:formatOper}*/
        ]]
    });


    function formatOper(val, row, index) {
        // row就是这一行的Json数据，包括你已经显示在Datagrid上的内容，和没显示的内容
        /*var btn = "<a href='#' onclick='editData("+row.data1+")'>查看</a>&nbsp;&nbsp;&nbsp;";
         btn += "<a href='#' onclick='deleteData("+row.data1+")'>删除</a>";*/

        // var btn = "<a href='#' onclick='lookData("+row.id+")'>查看</a>"
        var btn = "<a href='#' onclick='lookData()'>查看</a>"
        return btn;
    }

    $('#win').window('close');
    reloadgrid();
    inintTitle();
});

function inintTitle() {
    $('.datagrid-header-row > [field="id"]').attr('title', '场景ID');
    $('.datagrid-header-row > [field="name"]').attr('title', '场景名称');
    $('.datagrid-header-row > [field="app"]').attr('title', '应用');
    $('.datagrid-header-row > [field="location"]').attr('title', '位置');
    $('.datagrid-header-row > [field="description"]').attr('title', '描述');
    $('.datagrid-header-row > [field="creator"]').attr('title', '创建人');
    $('.datagrid-header-row > [field="createDateStr"]').attr('title', '创建时间');
    $('.datagrid-header-row > [field="modifier"]').attr('title', '修改人');
    $('.datagrid-header-row > [field="modifyDateStr"]').attr('title', '修改时间');
}

function reloadgrid() {
    // 增加查询参数，重新加载表格，查询参数直接添加在queryParams中
    var queryParams = $('#dataList').datagrid('options').queryParams;

    var flagBool = getQueryParams(queryParams);
    if (flagBool) {
        $('#dataList').datagrid('options').queryParams = queryParams;
        $('#dataList').datagrid('options').url = serURL + "/rest/1.0/RecommendScene/scenes",
            $("#dataList").datagrid('reload');
    }
}

function getQueryParams(queryParams) {
    var isceneMethodName = $("#isceneMethodName").textbox("getText");
    var isceneName = $("#isceneName").textbox("getText");
    var iapplication = $("#iapplication").combobox("getValue");
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();

    if (startTime != "" && endTime != "" && startTime > endTime) { //判断起始时间应小于结束时间，其中值为空不判断
        $.messager.alert("警告", "起始时间应小于结束时间");
        return false;
    }

    queryParams.date_start = startTime;
    queryParams.date_end = endTime;
    queryParams.scene_name = isceneName;
    queryParams.app_id = iapplication;
    queryParams.api_method = isceneMethodName;

    return queryParams;
}

/* 跳转到新增页 */
function toAddPanel() {
    // location="rsceneAdd.html";
    location = serverURL + "/rest/1.0/RecommendScene/toRsceneAdd";
}
/* 查看 */
function lookData() {
    /*$('#win').window('open');
     location = serverURL+"/rest/1.0/agent/toEdit?id="+id;*/
}
/* 删除 */
function deleteData(id) {
    location = serverURL + "/rest/1.0/agent/toEdit?id=" + id;
}
/* 修改 */
function editData(id) {
    location = serverURL + "/rest/1.0/agent/toEdit?id=" + id;
}
