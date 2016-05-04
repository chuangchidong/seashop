/**
 * 封装图片上传
 */
define(['jquery','plupload','qiniu'], function (require, exports, module) {

	var $ = require('jquery');
	"use strict";
	/*global Qiniu */
	/*global plupload */
	/*global FileProgress */
	/*global hljs */

	function initSettings(){
		return {
	        runtimes: 'html5,flash,html4',
	        browse_button: 'pickfiles',
	        container: 'container',
	        drop_element: 'container',
	        flash_swf_url: 'js/plupload/Moxie.swf',
	        dragdrop: true,
	        chunk_size: '4mb',
	        max_file_size: '100m',
	        uptoken_url: '/user/qiniuToken',//$('#uptoken_url').val(),
	        domain:$('#domain').val(),
	        auto_start: true,
	        unique_names:true,
			save_key: true,
	        init: {
	            'FileUploaded': function(up, file, info) {
	            	console.log(info);
	            },
	            'Error': function(up, err, errTip) {
	            	console.log(up,err,errTip);
	            }
	        }
	    };
	}

    function configUpload(options){
    	var settings = initSettings();
    	$.extend(settings, options);
    	Qiniu.uploader(settings);
    }
    /**图片展示配置**/
    function initPicture($name,width,height,position){
		if( !position ){
			position = 'absolute';
		}
		var $hideImg = $('#hid_'+$name);
		var $oldImageUrl = $hideImg.val();
		if( !width || !height ){ /**如果有传指定的宽高,则用如下配置**/
			width = 235;height=300;
		}
		var $a = $hideImg.siblings('a');
		var $div = $hideImg.siblings('div');
		$a.attr('style','width:'+width+';height:'+height+';background:transparent;display:block;');
		$div.attr('style','width:'+width+';height:'+height+';background:transparent;display:block;');
		var $imgShow = '';
		if($oldImageUrl.indexOf('www.xiaoyaor.com') > 0){
			$imgShow = $oldImageUrl;
		}else{
			$imgShow = $oldImageUrl + '_min';// + '_'+width+'x'+height+'.jpg';
		}
		if($oldImageUrl && $oldImageUrl.trim().length > 0){
			$('#'+$name+' a img').remove();
			var $img = $('<img>',{
        		'style':'position:'+position+';left:0;top:0;',
        		//'width':width,'height':height,
        		'src':$imgShow
        		});
			$('#'+$name+' a').prepend($img);
		};
	}
	/**图片上传配置**/
	function uploadPicture(container,width,height,position,callback){
		if( !position ){
			position = 'absolute';
		}
		if( !width || !height ){ /**如果有传指定的宽高,则用如下配置**/
			width = 235;height=300;
		}
		configUpload({
			browse_button: 'a_'+container,
	        container: container,
	        drop_element: container,
			init: {
	            'FileUploaded': function(up, file, info) {
	            	var $info = $.parseJSON(info);
	            	$('#'+container+' a img').remove();
	            	var $imgUrl = $('#domain').val()+$info.key;
	            	var $img = $('<img>',{
	            		'style':'position:'+position+';left:0;top:0;',
	            		//'width':width,'height':height,
	            		'src':$imgUrl + '_min'// + '_'+width+'x'+height+'.jpg'
	            		});
	            	$('#hid_'+container).val($imgUrl);
	            	$('#'+container+' a').prepend($img);

					if( callback ){ callback($imgUrl); }
	            },
	            'Error': function(up, err, errTip) {
	            	console.log(up,err,errTip);
	            }
	        }
		});
	}

    /**通用图片上传配置**/
	function config($name,width,height,position,callback){
		initPicture($name,width,height,position);
		uploadPicture($name,width,height,position,callback);
	}
	
	return {
		uploader:configUpload,
		config:config
	};
});