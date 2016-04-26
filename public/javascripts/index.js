/**
 * Created by zhangzhidong on 16/4/20.
 */
define(function(require,exports,module){
    var category = $("li.category.active").attr("value");
    productList(category,function(data){
        $(".pro-list").scrollTop(0);
        $(".pro-listAll").html(data);

        var _curPage = $(".pro-li:last").find(".curPage").val();
        $("#nextPage").val(parseInt(_curPage)+1 );

        var _totalPage = parseInt($(".pro-li:last").find(".totalPage").val());
        if( _totalPage > _curPage+1 ){
            loadPageData(_curPage + 1,category);
        }
    })

    function productList(category,callback,page,size){
        var params = {};
        params.category = category;
        if(!page) page = 0;
        params.page = parseInt(page);
        params.size = size;
        $.get("/commodity/list",params,function(data){
            if(data){
                callback(data);
            }else{
                console.log("err commodity info :"+JSON.stringify(data))
            }
        },'','html',true);
    }

    function loadPageData(curPage,category){
        //$(".pro-listAll").html("");
        productList(category,function(data){
            $(".pro-listAll").append(data)

            var _curPage = parseInt($(".pro-li:last").find(".curPage").val());
            var _totalPage = parseInt($(".pro-li:last").find(".totalPage").val());
            if( _totalPage > _curPage+1 ){
                loadPageData(_curPage + 1,category);
            }
        },curPage)
    }

    window.search = function(){

    }

    window.getProdList = function (_this,category) {
        $(_this).siblings().removeClass("active");
        $(_this).addClass("active");
        productList(category,function(data){
            $(".pro-list").scrollTop(0);
            $(".pro-listAll").html(data);
            /**渲染完毕,更新nextPage**/
            var _curPage = $(".pro-li:last").find(".curPage").val();
            $("#nextPage").val(parseInt(_curPage)+1 );
            var _totalPage = parseInt($(".pro-li:last").find(".totalPage").val());
            if( _totalPage > _curPage+1 ){
                loadPageData(_curPage + 1,category);
            }
        })
    }

    //显示图片
    $(document).on("click","[productImg]",function(){
        var _minImg= $(this).attr("productImg");
        if(_minImg && _minImg.length>4){
            var bigImg = _minImg.substr(0,_minImg.length-4);
            var _coverWhite = $("<div class='coverWhite'><img src = '"+bigImg+"' class='prolist-big-img' /></div>");
            $("body").append(_coverWhite);
            $(".coverWhite").click(function(){
                $(".coverWhite").remove();
            });
        }
    });

})
