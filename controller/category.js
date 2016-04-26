exports.list = function(req, res) {
    var category = global.dbHelper.getModel('category')
    var conditions = {}
    var projection = "_id name "
    var options = {}

    category.find(conditions,projection,options,function (error, docs) {

        console.log("---category-list-"+JSON.stringify(docs))
        res.json(docs);
    });
};
