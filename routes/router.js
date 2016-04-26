/**
 * Created by zhangzhidong on 16/4/19.
 *
 * 自定义请求转发路由
 */
var url = require('url');
var fs = require('fs');
//var api = require('../utils/api');
var controllerFolder = "controller";
var controllers = fs.readdirSync("./" + controllerFolder);
console.log("controllers: " + controllers);

exports.init = function(app) {

    app.get('/', index);
    app.all('/:_controller/:_method', function(req, res, next) {
        var controllerName = req.params._controller;
        // 过滤有效请求，不影响静态资源
        if (controllers.indexOf(controllerName + ".js") >= 0) {
            var controller = require("../" + controllerFolder + "/" + controllerName);
            if (controller[req.params._method]) {
                // 拦截请求
                controller[req.params._method](req, res);
            } else if (controller[controllerIndexFunction]) {
                controller[controllerIndexFunction](req, res);
            } else {
                res.status(404).json();
            }
        } else {
            next();
        }
    });
};
//重定向到首页 必须三个参数
var index = function(req, res, next) {
    res.render('index');
};