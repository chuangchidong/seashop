exports.list = function(req, res) {
    var category = global.dbHelper.getModel('category')
    var model = {}
    var conditions = {}
    var projection = "_id name "
    var options = {}

    category.find(conditions,projection,options,function (error, docs) {
        var _ulWidth="100%";

        var _width = 0;
        if(docs && docs.length>0){
            var cat = docs;
            for(var i=0; i<cat.length; i++){
                _width += cat[i].name.length;
            }
            _ulWidth = _width * 0.14 + (docs.length +4)*0.2 +0.15;
        }

        model.categorys = docs;
        model.navWidth = _ulWidth;
        console.log("--index-category--"+JSON.stringify(model))
        res.render('index',model);
    });
};
