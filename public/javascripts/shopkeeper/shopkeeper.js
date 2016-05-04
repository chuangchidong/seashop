/**
 * Created by zhangzhidong on 16/4/21.
 */


define(function(require, exports, module){
    var _validate = require("framework");

    loadCategory();
    loadRemoteDomain();

    function loadRemoteDomain(){
        $.get("/user/qiniuDomain",{},function(data){
            if(data){
                $('#domain').val(data.domain);
                upload.config("avatar",".6rem",".6rem");
            }
        });
    }

    function loadCategory(){
        var _menu = $('#category').parent();
        var _div = _menu.find("div[class=select-b]");
        $.post("/category/list",{},function(data){
            var _span = "";
            if(data && data.error!=0){
                $.each(data,function(index,data){
                    _span += "<span code='"+data._id+"' class='cur'>"+data.name+" </span> " ;
                });
                $(_div).html(_span);

                bindCategoryClick();
            }
        });
    }

    function bindCategoryClick(){
        $('#category').parent().find("div[class=select-b]").find("span").on('click',function(){
            var _this = $(this);
            var code = _this.attr("code");
            var itemContent = _this.text();
            $('#category').val(itemContent);
            $("#category").attr("menu",code);

            /**隐藏下拉列表**/
            _this.parent().css('display','none');
        });
    }

    $("#category").on("click",function(){
        var _menu = $(this);
        var _div = _menu.next("div");
        if($(_div).css("display")=='none'){
            $(_div).css("display","");
        }else{
            $(_div).css("display","none");
        }
    })

    $(document).on("click",".submit",function(){

        var param ={};
        param.category = $("#category").attr("menu");
        param.brand = $("#brand").val();
        param.name = $("#name").val();
        param.imgUrl = $("#hid_avatar").val();
        param.standard = $("#standard").val();
        param.remark = $("#remark").val();
        param.price = $("#price").val();

        if( !param.category || param.category == 0 ){
            myalert('请选择商品分类');
            return;
        }
        if( !param.name || param.name == 0 ){
            myalert('请输入商品名称');
            return;
        }

        //if( !param.imgUrl || param.imgUrl == 0 ){
        //    myalert('请选择商品图片');
        //    return;
        //}

        if( param.price && !/[0-9]{1,5}([.][0-9]{0,5})*/.test(param.price) ){
            myalert('商品价格格式错误');
            return;
        }
        if( param.price ){
            param.price = parseFloat(param.price) * 100;
        }

        $.post("/commodity/add",param,function(data){
            console.log("---result data--------"+JSON.stringify(data))
            if(data && data.success){
                myalert("提交成功");
                //location.href= "/index/wechat";
                //location.replace(getUrl("/index/wechat"));
            }else{
                myalert("提交失败");
            }

        });
    })

})