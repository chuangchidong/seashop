define(function(require, exports, module) {
	
	/**
	 * jquery方法封装
	 */
	(function($) {
		$.isTouch = "ontouchstart" in document.documentElement;
		/**
		 * 扩展异步请求
		 */
		var _showLoading = function(loading,dataType) {
			var _load = showCoverLayer(loading,dataType);
			_load.html("<div class='loading'><div class='icon'></div><div class='logo'></div></div>");
			
		};
		var _post = $.post;
		$.post = function(url, data, success,loading, dataType, showLoading, fail) {
			if (showLoading) {
				_showLoading(loading,dataType);
			}
			return _post(url, data, function(data, textStatus, jqXHR) {
				success(data, textStatus, jqXHR);
			}, dataType).fail(function(error) {
				var responseText = error.responseText;
				try {
					var _jsonData = JSON.parse(responseText);
					if (fail) {
						fail(_jsonData);
					} else {
						alert(_jsonData.errorMessage);
					}
				} catch(e) {
//					alert(responseText);
				}
			}).always(function() {
				hideCoverLayer();
			});
		};
		var _get = $.get;
		$.get = function(url, data, success, dataType, showLoading) {
			if (showLoading) {
				_showLoading();
			}
			return _get(url, data, function(data, textStatus, jqXHR) {
				success(data, textStatus, jqXHR);
			}, dataType).fail(function(error) {
				var responseText = error.responseText;
				try {
					var _jsonData = JSON.parse(responseText);
					alert(_jsonData.errorMessage);
				} catch(e) {
//					alert(responseText);
				}
			}).always(function() {
				hideCoverLayer();
			});
		};
	})(jQuery);
	
	/**
	 * 时间对象的格式化;
	 */
	Date.prototype.format = function(format) {
		/*
		 * eg:format="YYYY-MM-dd hh:mm:ss";
		 */
		var o = {
			"M+" : this.getMonth() + 1, // month
			"d+" : this.getDate(), // day
			"h+" : this.getHours(), // hour
			"m+" : this.getMinutes(), // minute
			"s+" : this.getSeconds(), // second
			"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
			"S" : this.getMilliseconds()
		// millisecond
		};

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		}

		for ( var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
						: ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};
	/**
	 * 字符串转时间 必须存在分隔符
	 */
	String.prototype.parseDate = function(format) {
		var _o = {
			y : new RegExp("y+", "g"),
			M : new RegExp("M+", "g"),
			d : new RegExp("d+", "g"),
			h : new RegExp("h+", "g"),
			m : new RegExp("m+", "g"),
			s : new RegExp("s+", "g"),
			S : new RegExp("S+", "g")
		};
		var _f = format.split(/[yMdhmsS]/g);
		var _s = "";
		for ( var i in _f) {
			if (_f[i]) {
				_s += "\\" + _f[i];
			}
		}
		var re = new RegExp("[" + _s + "]", "g");
		_f = format.split(re);
		var _t = this.split(re);

		var _d = new Date(0);
		_d.setHours(0);

		for ( var i in _f) {
			if (_o.y.test(_f[i])) {
				_d.setFullYear(Number(_t[i]));
			} else if (_o.M.test(_f[i])) {
				_d.setMonth(Number(_t[i]) - 1);
			} else if (_o.d.test(_f[i])) {
				_d.setDate(Number(_t[i]));
			} else if (_o.h.test(_f[i])) {
				_d.setHours(Number(_t[i]));
			} else if (_o.m.test(_f[i])) {
				_d.setMinutes(Number(_t[i]));
			} else if (_o.s.test(_f[i])) {
				_d.setSeconds(Number(_t[i]));
			} else if (_o.S.test(_f[i])) {
				_d.setMilliseconds(Number(_t[i]));
			}
		}
		return _d;
	};

	/**
	 * 字符串替换所有
	 */
	String.prototype.replaceAll = function(text, repText) {
		return this.replace(new RegExp(text, "gm"), repText);
	};
	
	/**
	 * 判断obj是否是type类型
	 */
	window.isType = function(obj, type) {
		return toString.call(obj).indexOf("[object " + type) == 0;
	}
	
	/**
	 * 获取完整的url
	 */
	window.getUrl = function(url) {
		return "http://" + location.host + url;
	}
	
	/**
	 * 判断是否是微信环境
	 * @returns {Boolean}
	 */
	window.isWeixin = function() {
		return typeof(WeixinJSBridge) != "undefined";
	}
	
	/**
	 * 获取完整的url
	 */
	window.getShortUrl = function(url, callback) {
		$.post(APP_BASE_PATH + "/static/shortUrl?" + new Date().getMilliseconds(), {
			url : url
		}, callback, "json");
	}
	
	var _welcome = $("<div class=\"welcome\"><div class=\"loading\"></div></div>");
	window.welcomeExist = function() {
		return $(".welcome").length;
	}
	window.showWelcome = function() {
		if (!welcomeExist()) {
			$("body").append(_welcome);
		}
		_initLoading();
		function _initLoading() {
			if (welcomeExist()) {
				var _windowWidth = $(window).width();
				var _scale = $(window).height() / 1008;
				var _loading = _welcome.find(".loading");
				_loading.css("left", _windowWidth / 2 - 272 * _scale);
				_loading.animate({
					left: _windowWidth / 2 + 272 * _scale
				}, {
					duration: 2000,
					complete: _initLoading
				});
			}
		}
	}
	window.hideWelcome = function() {
		if (welcomeExist()) {
			_welcome.find(".loading").stop();
			// 加载完毕后，删除welcome
			_welcome.animate({
				opacity: 0
			}, {
				duration: 2300,
				complete: function() {
					_welcome.remove();
				}
			});
		}
	}
	
	window.noTouch = function(e) {
		e.preventDefault();
	}
	
	var _coverLayer = $("<div class=\"coverLayer\"></div>");
	var _load = $("<div class='load'></div>");
	_coverLayer.bind("touchmove", noTouch);
	window.coverLayerExist = function() {
		return $(".load").length;
	}
	window.showCoverLayer = function(loading,dataType) {
		if (!coverLayerExist()) {
			_load.html("");
			_load.removeClass("load2");
			_load.removeClass("load1");
			if(loading==1){
				_load.addClass("load1");
				$("body").append(_load);
			}else if(loading==2){
				_load.addClass("load2");
				$("body").append(_load);
			}else{
				if($("body:has('#loading')").length>0){
					_load.addClass("load1");
					$("#loading").append(_load);
				}else{
					if(dataType=="json"){
						_load.addClass("load1 coverBack");
						$("body").append(_load);
					}else{
						_load.addClass("load1");
						$("body").append(_load);
					}
				}
			}
		}
		return _load;
	}
	window.hideCoverLayer = function() {
		if (coverLayerExist()) {
			_load.remove();
		}
	}
	
	var _hintDiv = $("<div class=\"hint\"></div>");
	_hintDiv.bind("touchmove", noTouch);
	window.myalert = function(msg, callback) {
		_hintDiv.html(msg);
		if (!_hintDiv.parent().is("body")) {
			_hintDiv.appendTo("body");
			setTimeout(function() {
				_hintDiv.remove();
				if (typeof (callback) == "function") {
					callback();
				}
			}, 2000);
		}
	}
	var _confirmDiv = $("<div class=\"confirm\"></div>");
	window.confirm = function(msg, callback, nextBtn, cancelBtn) {
		_confirmDiv.html("");
		_confirmDiv.append(msg);
		var _closeConfirm = function() {
			hideCoverLayer();
			_confirmDiv.remove();
		}
		var _nextBtn = nextBtn || "确认";
		var _cancelBtn = cancelBtn || "取消";
		var _yes = $("<a class=\"confirm-al\" ></a>");
		_yes.html(_nextBtn);
		
		_yes.click(function() {
			_closeConfirm();
			if (typeof (callback) == "function") {
				callback();
			}
		});
		var _no = $("<a class=\"confirm-ar\">取消</a>");
		_no.html(_cancelBtn);
		_no.click(_closeConfirm);
		$("<div class=\"confirm-adiv\"></div>").append(_yes).append(_no).appendTo(_confirmDiv);
		if (!_confirmDiv.parent().is("body")) {
//			showCoverLayer();
			_confirmDiv.appendTo("body");
			_coverLayer.one("click", _closeConfirm);
		}
	}
	window.historyBack = function(){
		window.history.back();
	}
	
	// init
	
});