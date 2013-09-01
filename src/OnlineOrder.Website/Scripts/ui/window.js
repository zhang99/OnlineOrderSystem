/** 
* $.window 
* @extends jquery.1.7.1 
* @fileOverview 创建弹出窗口
* @author wangpf 
* @email wangpf@siss.com.cn
* @version 0.1 
* @date 2013-05-23 
* Copyright (c) 2013-2013 wangpf 
* @example 
*    $.window({title:'', fillText:''}) 
* @params
	title: [text for wind-title],
	fillText: [text/html for wind-body]
    async: if true, then ajax-load and attribute[fillText] is non-usable, 
    type: [ajax type], 
    url: [ajax url], 
    data: [ajax data],
    dataType: [ajax dataType],
    complete: [func: if ajax is completed, then executed]
*/ 

(function($, document){

$.window = function(options){
	if( arguments[0] == 'close' ){
		close(arguments[1], arguments[2]);
		return;
	}

	/*------------------- attributes -------------------------*/
	settings = $.extend( {}, $.window.defaults, options );	

	/*-------------------private function----------------------*/
	function init (){
		if($(document.body).data('onPopwind')){
			return;
		}

		// create a window box 
		create();

		function create(){
			$(document.body).data('onPopwind', true);

			// mask for window box
			if($('#si-mask').length == 0){
				$('<div id="si-mask"></div>').appendTo('body');
			}else{
				$('#si-mask').css("z-index", parseInt($('#si-mask').css("z-index")) + 1);
			}
			
			var $windowbox = $('<div class="si-wind"></div>').appendTo('body').hide();
			var $windowTitle = $('<div class="wind-title"><h3></h3><span></span></div>').appendTo($windowbox);
			$("h3", $windowTitle).html( settings.title );
			var $windowBody = $('<div class="wind-main onload clearfix"></div>').appendTo($windowbox)

			// drag and drop
			$('.si-wind').easydrag({handler:'.wind-title'});

			/* if exists ajax to load */
			if(settings.async == true){
				ajaxLoad( $windowBody );
			}else{
				fill( $windowBody , settings.fillText );
			}
			$windowbox.css({
				'top' : ($(window).height() - $windowbox.height())/2 + $(window).scrollTop(),
				'z-index' : parseInt($windowbox.css("z-index")) + $('.si-wind').length -1
			})
			
			// click to close the window
			$('.wind-title span', $windowbox).click(function(){
				close( this );

			});
		}
		function fill( target, html ){
			var $target = $(target),
			$windowbox = $target.parents(".si-wind");
			$target.removeClass("onload");
			$target.html(html);
			if($(".wind-title h3", $windowbox).html()==""){
				$(".wind-title h3", $windowbox).html( $target.children("h3").html() );
				$target.children("h3").remove();
			}
			if( settings.query || /Query/i.test(settings.url) ){
				$windowbox.addClass('wind-list');
			}
			if(settings.hasTree){
				$windowbox.addClass('wind-tree-list');
			}

			$windowbox.show();
			setTimeout(function(){
				$(document.body).data('onPopwind', false);
			},500)

			$(document.body).off('.wind').on("keydown.wind", function(event){
				switch(event.which){
					case 27: // Esc
						$.window('close', $('.si-wind:last'));
						break;
					default:
						break;
				}
			});
		}
		function ajaxLoad( target ){
			var $target = $(target);
			$.ajax({
				type: settings.type,
				url: settings.url,
				global: false,
				data: settings.data,
				// dataType: settings.dataType,
				complete: settings.complete,
				success:  function (data) {
					if(typeof data == 'object'){
						$('#si-mask').remove();
						$.message(data.message);
						return false;
					}
		            fill(target, data);
		            if(settings.success){
		            	settings.success(data);
		            }
		        },
				error:  settings.errorHandler
			});
		}
	}
	function close (target, data){
		if(data){
			if(settings.callback && settings.callback(data)===false){
				return false;
			}
		}
		if(!target){
			$('.si-wind').remove();
			$('#si-mask').remove();
			return false;
		}
		if($(target).hasClass('si-wind')){
			$(target).remove();
		}else{
			$(target).parents('.si-wind').remove();
		}
		$('#si-mask').css("z-index", parseInt($('#si-mask').css("z-index"))-1);
		if($('.si-wind:visible').length == 0){
			$('#si-mask').remove();
		}
	}

	return init();
}

$.window.defaults = {
	async: false,
	type: "POST",
    url: "",
    dataType: "",
    successHandler: function(){},
    errorHandler: function (err) {
        $.message({ msg: "{0} {1}".format(err.status, err.statusText) });
		$('#si-mask').hide();

    },
	title: "",
	fillText: "",
	hasTree : false
}

})(jQuery, document)