//检测浏览器窗口大小改变 来改变页面layout大小
$(function () {

    $(window).resize(function () {

        $('#cc').layout('resize');
    });

    $(".top_avbar > li").hover(function () {
        $(this).addClass("north_toggle").siblings().removeClass("north_toggle");
    }, function () {
        $(this).removeClass("north_toggle");
    });
    $(".left_avbar > li").hover(function () {
        $(this).addClass("homeWest_toggle").siblings().removeClass("homeWest_toggle");
    }, function () {
        $(this).removeClass("homeWest_toggle");
    });
});


function secureExit() {
    $.messager.confirm('提示', '确定是否退出当前用户？', function (r) {
        if (r) {
            localStorage.clear();//清空所有localStorage
            sessionStorage.clear();//清空所有sessionStorage

            window.location.href = serverURL + "/logout";
            /*$.ajax({
             type : "POST", //post提交方式默认是get
             url : serverURL + "/logout",
             error : function(request) { // 提交出错
             console.log(111);
             },
             success : function(data) {
             if(data=='1'){
             window.location.href = serverURL + '/rest/1.0/user/home';//首页，因为是未登录状态，会跳转到认证中心
             }
             }
             });*/
        }
    });
    /*if(confirm("确定是否退出当前用户？")){
     //退出当前3个iframe，显示登陆页面 _blank 在新窗口中打开链接  _parent 在父窗体中打开链接。无效果
     window.parent.location.href ="${pageContext.request.contextPath}/rest/1.0/quitUser/loginOut";

     }*/
}
//点击导航栏 切换 加载子菜单
function addLmenuORRcontent(menuid, index) {

    //设置样式
    $("ul.top_avbar > li").removeClass("north_toggle");
    $("ul.top_avbar > li:eq('" + index + "')").addClass("north_toggle");

    //加载 子菜单和右边内容

    $.ajax({
        url: serverURL + "/rest/1.0/menuInfo/findAllChildMenuInfo",
        type: "post",
        dataType: "json",
        data: {menuid: menuid},
        success: function (data) {
            //左侧菜单
            var menuLi = "";
            $.each(data, function (index, value) {
                var lmenuname = value.menuname;
                var lurl = value.url;
                if (index != 0) {
                    menuLi += "<li onclick=\"toRcontentByURL('" + lurl + "','" + index + "');\" class='homeWest_init'><a href=''>" + lmenuname + "</a></li>";
                }
            });

            $(".left_avbar").empty();
            $(".left_avbar").append(menuLi);
            $("ul.left_avbar > li:eq(0)").addClass("homeWest_toggle");

            $(".left_avbar > li").hover(function () {
                $(this).addClass("homeWest_Hovertoggle").siblings().removeClass("homeWest_Hovertoggle");
            }, function () {
                $(this).removeClass("homeWest_Hovertoggle");
            });

            window.parent._rightPanel.location.href = serverURL + "/rest/1.0/menuInfo/findMenuInfohomepage?menuid=" + menuid;

        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

//点击子菜单 加载右边内容
function toRcontentByURL(url, index) {
    //var index = index - 1;
    $("ul.left_avbar > li").removeClass("homeWest_toggle");
    $("ul.left_avbar > li:eq('" + index + "')").addClass("homeWest_toggle");

    storeSupplier_PagePath = url;//记录这次点击 页面
    window.parent._rightPanel.location.href = storeSupplier_PagePath;

}


//首页初始化加载导航栏 左侧二级菜单 右侧内容
function initMenu() {
    $.ajax({
        url: serverURL + "/rest/1.0/menuInfo/findAllMenuInfo",
        type: "post",
        dataType: "json",
        success: function (data) {
            //  data = null;
            if (null != data && !$.isEmptyObject(data)) {
                //一级菜单导航栏
                var navLi = "";
                $.each(data, function (index, value) {
                    var menuid = value.menuid;//主ID
                    var menuname = value.menuname;//名称
                    navLi += "<li onclick=\"addLmenuORRcontent('" + menuid + "','" + index + "');\" style=\"background-image:url('" + value.menuimage + "');\">" + menuname + "</li>"

                    //默认加载占位第0主菜单对应 子菜单 内容页
                    if (index == 0) {
                        $.ajax({
                            url: serverURL + "/rest/1.0/menuInfo/findAllChildMenuInfo",
                            type: "post",
                            dataType: "json",
                            data: {menuid: menuid},
                            success: function (data) {
                                //左侧菜单
                                var menuLi = "";
                                $.each(data, function (index, value) {
                                    var lmenuname = value.menuname;
                                    var lurl = value.url;
                                    if (index >= 0) {
                                        menuLi += "<li onclick=\"toRcontentByURL('" + lurl + "','" + index + "');\" class='homeWest_init'>" + lmenuname + "</li>" +
                                            "";
                                    }
                                    if(index===0){
                                        toRcontentByURL(lurl,'1');
                                    }
                                });

                                $(".left_avbar").empty();
                                $(".left_avbar").append(menuLi);
                                $("ul.left_avbar > li:eq(0)").addClass("homeWest_toggle");

                                $(".left_avbar > li").hover(function () {
                                    $(this).addClass("homeWest_Hovertoggle").siblings().removeClass("homeWest_Hovertoggle");
                                }, function () {
                                    $(this).removeClass("homeWest_Hovertoggle");
                                });

                                //记录首页链接
                                // storeSupplier_PagePath = serverURL + "/rest/1.0/menuInfo/findMenuInfohomepage?menuid=" + menuid;
                                // window.parent._rightPanel.location.href = storeSupplier_PagePath;

                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                console.log(XMLHttpRequest, textStatus, errorThrown);
                            }
                        });
                    }
                });

                $(".top_avbar").empty();
                $(".top_avbar").append(navLi);
                $("ul.top_avbar > li:eq(0)").addClass("north_toggle");

                $(".top_avbar > li").hover(function () {
                    $(this).addClass("north_Hovertoggle").siblings().removeClass("north_Hovertoggle");
                }, function () {
                    $(this).removeClass("north_Hovertoggle");
                });
            } else {//如果为null时 则调至无权限提示菜单
                window.location.href = serverURL + "/unauthorized.html";
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    $('.supplierAdminUse').hide();

    //判断当前用户是否是运营商管理员
    $.ajax({
        url: serverURL + "/rest/1.0/supplierUser/getSupplierList",
        type: "post",
        dataType: "json",
        success: function (data) {
            if (null != data && !$.isEmptyObject(data)) {
                if (data.success) {

                    //判断是否是运营商管理员
                    //是： 则显示，对应可操作区域，并查询对应该运营商管理员所能看见的管辖运营商
                    //不是： 隐藏操作区域，清空下拉框 所管辖运营商信息(包括清空已保存切换运营商店铺ID的缓存)
                    if (null != data.outList && !$.isEmptyObject(data.outList)) {
                        $('.supplierAdminUse').show();

                        var selectList = data.outList;
                        var str="";
                        //storeSupplier_value  storeSupplier_text
                        for(var i = 0;i<selectList.length;i++){
                            str += "<option value="+ selectList[i].storeSupplier_value +">"+ selectList[i].storeSupplier_text +"</option>";

                            if(i==0){
                                /*
                                    设置 第一个运营商 为默认值
                                    方便在不切换运营商之前，查询的所使用的 基于默认值 查询或者显示
                                */
                                storeSupplier_ID = selectList[i].storeSupplier_value;
                                storeSupplier_Text = selectList[i].storeSupplier_text;
                                sessionStorage.setItem('storeSupplier_ID',storeSupplier_ID);
                                sessionStorage.setItem('storeSupplier_Text',storeSupplier_Text);
                            }
                        }

                        $('#storeSupplier').append(str);
                    } else {
                        $('.supplierAdminUse').hide();
                        $('#storeSupplier').empty();
                        storeSupplier_ID = "";
                        storeSupplier_PagePath = "";
                    }
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    $.ajax({//显示用户角色 昵称信息
        url: serverURL + "/rest/1.0/user/ajax/roleAndNickName",
        type: "post",
        dataType: "json",
        success: function (data) {
            $('#lblUserName').text(data.nickName);
            /*$('#spRoleName').text("["+data.roleName+"]");
             $('#lblIp').text(data.ip);*/
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}


//切换运营商
//2个问题 1 是否需要隐藏各表中的 运营商下拉宽。 2 是否已切换的运营商ID为全局变量， 直接作用于各个列表查询使用
function switchSupplier(selValue) {

    storeSupplier_ID = selValue.value;
    storeSupplier_Text = selValue.options[selValue.selectedIndex].text;//获得选中对应的值
    sessionStorage.setItem('storeSupplier_ID',storeSupplier_ID);
    sessionStorage.setItem('storeSupplier_Text',storeSupplier_Text);
    window.parent._rightPanel.location.href = storeSupplier_PagePath;
}

/*(function($) {
 $(function() {

 //加载一级菜单
 var url = "MODELFindLgoinFirstMenu.action";
 $.ajax( {
 type : "post",
 url : url,
 contentType : "text/html",
 error : function(event,request, settings) {
 $.messager.alert("提示消息", "请求失败!", "info");
 },
 success : function(data) {

 $("#topmenu").empty();
 $("#topmenu").append("&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"javascript:addTab('首页','welcome.htm')\" >首&nbsp;&nbsp;页</a>");
 if(data.length>0){
 //循环加载第一级别菜单
 for ( var i = 0; i < data.length; i++) {
 $("#topmenu").append("<a icode='"+data[i].id+"'>"+data[i].text+"</a>");
 }
 //自动加载第一个一级菜单下面的二级菜单

 $("#topmenu > a").get(1).click();
 }
 }
 });

 //切换一级菜单 加载二级和三级菜单
 $("#topmenu > a").live('click',function(){

 //设置样式
 $("#topmenu > a").removeClass("active");
 $(this).addClass("active");
 //加载 二级菜单和三级菜单
 var menu1icode = $(this).attr("icode");
 if(!JUDGE.isNull(menu1icode)){

 $('#tt1').tree({
 url:"MODELFindLgoinSecondMenu.action?maindatauuid="+menu1icode,
 onClick: function(node) {
 if(node.attributes){
 addTab(node.text,node.attributes.href);
 }
 }
 });

 }
 });
 });
 })(window.jQuery);

 function view(url){

 $('#iframe').attr('src',url);
 }


 *添加选项卡方法

 function addTab(title,url){

 //先判断是否存在标题为title的选项卡
 var tab=$('#tt').tabs('exists',title);
 if(tab){
 //若存在则直接打开
 $('#tt').tabs('select',title);
 }else{
 //否则创建
 $('#tt').tabs('add',{
 title:title,
 content:"<iframe width='100%' height='100%'  id='iframe' frameborder='0' scrolling='auto'  src='"+url+"'></iframe>",
 closable:true
 });
 }
 }


 *根据title 选中Accordion对应的面板

 function selectAccordion(title){

 $('#accordionPanel').accordion('select',title);
 }


 *刷新时间

 function showTime(){
 var date=new Date();
 $('#timeInfo').html();
 $('#timeInfo').html('&nbsp;&nbsp;&nbsp;&nbsp;'+date.toLocaleString()+"&nbsp;&nbsp;");
 }
 setInterval(showTime,1000);


 */