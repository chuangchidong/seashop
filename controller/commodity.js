/**
 * Created by zhangzhidong on 16/4/20.
 */
var Commodity = global.dbHelper.getModel('commodity');

exports.list = function(req,res){

    var model;
    var conditions = {
        category : req.query.category
    }
    var projection = "_id category name price imgSrc";
    var options = {
        limit : req.query.size ? req.query.size:10,
         skip : (req.query.page ? req.query.page:0)*(req.query.size ? req.query.size:10),
         sort : req.query.sort
    }
    var totalPages = 0;
    Commodity.count(conditions,function(error, data){
        totalPages=data;
    });
    Commodity.find(conditions,projection,options,function (error, docs) {
        model = {};
        model.Commoditys = docs;
        model.page  = {
               curPage : Math.floor(options.skip/options.limit),
            totalPages : Math.ceil(totalPages/options.limit)
        };
        console.log("-----"+JSON.stringify(model))
        res.render('./product/productList',model);
    });
}

exports.add = function(req,res){
    var params = {
        category:req.body.category,
        name:req.body.name,
        price:req.body.price,
        imgSrc:req.body.imgUrl
    }

    Commodity.create(params,function(error,doc){
        if (doc) {
            res.send(200);
        } else {
            res.send(400);
        }
    });
}