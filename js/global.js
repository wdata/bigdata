/**
 * 全局变量
 */
var serverURL = "http://" + window.location.host;
var serverURL_Rscene = serverURL;
//  运营商ID
var operatorId = sessionStorage.getItem("operatorId");


//运营商管理员切换时 保存对应ID
var storeSupplier_ID;
//运营商管理员切换时 保存对应Text
var storeSupplier_Text;
//用以记录 用户操作的路径，用于运营商管理员切换时，直接刷新
var storeSupplier_PagePath;

$(document).ready(function () {
    $(document).ajaxError(function (event, jqxhr, settings) {
        if (jqxhr.status == 0) {//包含302情况
            var hrefStr = serverURL + "?t=" + new Date().getTime();
            //console.log(jqxhr.status);

            if (window != top) {
                // console.info("error in 'glibal.js' line 21");
                //top.location.href = hrefStr;
            } else {
                location.href = hrefStr;
            }
        }
    });

});

var overallTime = [];//记入时间
/**
 * 通过年月获得当月的周
 * @param year_Month 年月 2000-01
 * @param toID 加载到目标ID
 * @returns {Array}
 */
function getMonthWeek(year_Month, chanage, index, toID) {
    if (overallTime[index] == null) {//先创建对象 用于后续比较
        overallTime[index] = ({ymStateTime: '', ymEndTime: ''});
    }

    if (chanage != "" && chanage == "state") {
        if (year_Month == "") {
            $('#' + toID).combobox('clear');
        } else if (year_Month == overallTime[index].ymStateTime) {
            return false;
        }
        overallTime[index].ymStateTime = year_Month;//用于判断下次进来 值相同情况下不执行下操作
    } else if (chanage != "" && chanage == "end") {
        if (year_Month == "") {
            $('#' + toID).combobox('clear');
        } else if (year_Month == overallTime[index].ymEndTime) {
            return false;
        }
        overallTime[index].ymEndTime = year_Month;//用于判断下次进来 值相同情况下不执行下操作
    }

    var today = new Date(year_Month);
    var last = new Date(today.getFullYear(), today.getMonth() + 1, 0);//获取当前月最后一天时间
    var y = today.getFullYear();
    var m = today.getMonth() + 1;
    var d = last.getDate();
    var date = new Date(y, parseInt(m) - 1, d), w = date.getDay(), dt = date.getDate();
    var week = Math.ceil((dt + 6 - w) / 7);

    var arr = [];
    for (var i = 1; i <= week; i++) {
        var tempMap = new Object();

        tempMap.id = "-0" + i;
        tempMap.text = "第" + i + "周";


        arr.push(tempMap);
    }
    //设置目标下拉框属性
    $('#' + toID).combobox('loadData', arr);
    if (arr.length > 0) {
        $('#' + toID).combobox('setValue', arr[0].id);
    }
};

/*
 * AddDayCount 0:今天 -1：昨天 1：明天
 * 输出日期格式 yyyy-MM-dd
 * */
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    m = m > 0 && m < 10 ? "0" + m : m;
    var d = dd.getDate();
    d = d > 0 && d < 10 ? "0" + d : d;
    return y + "-" + m + "-" + d;
}
// document.getElementById("stateTime").value = GetDateStr(-1);
// document.getElementById("endTime").value = GetDateStr(-1);
/**
 * URL传值
 *
 * @returns Object
 */
function getRequest() {
    // decodeURI解决中文乱码问题
    var url = decodeURI(location.search); // 获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

/**
 * 时间格式化
 *
 * @param val
 * @returns {String}
 */
function formatDate(strDate, format) {
    return formatTime(new Date(strDate), format);
}

// 格式化日期
function formatTime(date, format) {
    var paddNum = function (num) {
        num += "";
        return num.replace(/^(\d)$/, "0$1");
    }
    // 指定格式字符
    var cfg = {
        yyyy: date.getFullYear(), // 年 : 4位
        MM: paddNum(date.getMonth() + 1), // 月 : 如果1位的时候补0
        dd: paddNum(date.getDate()),// 日 : 如果1位的时候补0
        hh: paddNum(date.getHours()), // 时
        mm: paddNum(date.getMinutes()), // 分
        ss: paddNum(date.getSeconds())// 秒
    }
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function (m) {
        return cfg[m];
    });
}
//日期格式化成2017-01-02格式：
Date.prototype.toDateStr = function() {
    return this.getFullYear()+"-"+((this.getMonth()+ 1)<10?('0'+(this.getMonth()+ 1)):(this.getMonth()+ 1))+"-"+(this.getDate()<10?('0'+this.getDate()):this.getDate());
};
//判断variable是否为 null  undefined  ""
function isEmpty_var(variable) {
    if (variable == null || variable == undefined || variable == "" || variable == "null") {
        return true;
    } else {
        return false;
    }
}

/*将一维数组[a,b]，割接成字符串 "A,B" */
function ArrayTOString(arr) {
    var outStr = "";
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            outStr += arr[i] + ",";
        }
        outStr = outStr.substring(0, outStr.lastIndexOf(','));
    }
    return outStr;
}

// 查询样式切换
$(".query_condition > span").click(function() {
    $(this).addClass("cliStyle").siblings().removeClass("cliStyle");
})

// 方法 增添dayNumber天（整形），date：如果没传就使用今天（日期型）
function addDay(dayNumber, date) {
     date = date ? date : new Date();
     var ms = dayNumber * (1000 * 60 * 60 * 24)
     var newDate = new Date(date.getTime() - ms);
     return newDate;
}
//格式化
Date.prototype.Format = function (fmt) { //author: meizz 
   var o = {
       "M+": this.getMonth()+1, //月份 
       "d+": this.getDate(), //日 
       "h-": this.getHours(), //小时 
       "m-": this.getMinutes(), //分 
       "s-": this.getSeconds(), //秒 
       "q-": Math.floor((this.getMonth() + 3) / 3),
       "S": this.getMilliseconds() //毫秒 
   };
   if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
   for (var k in o)
   if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
   return fmt;
}


//	对上升和下降的数据进行处理处理 <span>'+((item.dod == '--')?'--':((item.dod)*100).toFixed(2)+'%')+'</span>
//   暂时无法判断是否为null，所以先赋值
function uoDownDate(data){
    var span = '<span>--</span>',sum = null;
    if(!(data === '--')){
        //判断正负数和0
        switch(Math.sign(data)){
            case  1:
                sum = (data*100).toFixed(2) + "%";
                span = '<span class="uoDownDate"><img src="../../image/on.png" alt="on"> '+ sum +'</span>';
                break;
            case  0:
                span = '<span class="uoDownDate" style="padding-left:10px"> 持平</span>';
                break;
            case  -1:
                sum = ((data*100).toFixed(2) * (-1)) + "%";
                span = '<span class="uoDownDate"><img src="../../image/under.png" alt="under"> '+ sum +'</span>';
                break;
        }
    }
    return span;
}
function tdCheck(elem){
    if(elem==null){
        return "--"
    }else{
        return elem
    }
}




/********************************************datagrid列的显示和隐藏********************************************/
/*
 var createGridHeaderContextMenu = function (e, field) {
 e.preventDefault();
 var grid = $(this);
 /!* grid本身 *!/
 var headerContextMenu = this.headerContextMenu;
 /!* grid上的列头菜单对象 *!/
 var okCls = 'tree-checkbox1';// 选中
 var emptyCls = 'tree-checkbox0';// 取消
 if (!headerContextMenu) {
 var tmenu = $('<div style="width:100px;"></div>').appendTo('body');
 var fields = grid.datagrid('getColumnFields');
 for (var i = 0; i < fields.length; i++) {
 var fildOption = grid.datagrid('getColumnOption', fields[i]);
 if (!fildOption.hidden) {
 $('<div iconCls="' + okCls + '" field="' + fields[i] + '"/>')
 .html(fildOption.title).appendTo(tmenu);
 } else {
 $('<div iconCls="' + emptyCls + '" field="' + fields[i] + '"/>')
 .html(fildOption.title).appendTo(tmenu);
 }
 }
 headerContextMenu = this.headerContextMenu = tmenu.menu({
 onClick: function (item) {
 var field = $(item.target).attr('field');
 if (item.iconCls == okCls) {
 grid.datagrid('hideColumn', field);
 $(this).menu('setIcon', {
 target: item.target,
 iconCls: emptyCls
 });
 } else {
 grid.datagrid('showColumn', field);
 $(this).menu('setIcon', {
 target: item.target,
 iconCls: okCls
 });
 }
 }
 });
 }
 headerContextMenu.menu('show', {
 left: e.pageX,
 top: e.pageY
 });
 };
 $.fn.datagrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;
 $.fn.treegrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;  */
