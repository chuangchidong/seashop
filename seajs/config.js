seajs.config({
    'alias':{
        //jquery
        'jquery':'/javascripts/jquery-2.1.1.min.js',
        //utils
        //"framework": "/javascripts/utils/framework.js",
        //"common": "/javascripts/utils/common.js",
        "bootstrap": "/javascripts/bootstrap.min.js",

        //qiniu
        "plupload" : "/qiniu/plupload.full.min.js",
        "qiniu"    : "/qiniu/qiniu.js",
        "upload"   : "/qiniu/upload.js",

        "index" : "/javascripts/index.js",
        //commodity
        "commodity":"/javascripts/commodity/commodity.js",

        //shopkeeper
        "shopkeeper" : "javascripts/shopkeeper/shopkeeper.js"
    },
    preload: [
        "jquery",
        "plupload",
        "upload"
    ]
});
