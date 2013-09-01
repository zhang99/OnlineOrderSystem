/*
* A waitting Plugin for jQuery
*
* Introduction
 @version 2.0
 @date 2013-07-12 
* Copyright (c) 2013-2013 wul  
example $('.area').waitting(true)
*---------------------
* 暂无
*---------------------
*/
(function($){
	$.fn.waitting = function( options){
		var defaults = {
				bool : true,
				msg : '加载中...'
			},
			_this = this,
			options;
		if(typeof options == 'object'){
			options = $.extend({}, defaults, options);
		}else{
			options = $.extend({}, defaults, {bool : options});
		}
		this._init = function(){
			// initialize the waitting box
			if(options.bool === false){
				// terminate waitting 
				_this._stop();
			}else{
				// initialize waitting			
				_this._start();	
			}
		};
		this._start = function(){	

			// if waitting instance is existed, return.				
			if($('.waitting-wrp', _this).length > 0){
				_this._stop();
			}
			$(_this).css('position', 'relative');

			// waitting wrapper
			$('<div class="waitting-wrp"></div>').appendTo(_this)
				.css({
					'width': $(this).outerWidth() ,
					'height': document.documentElement.scrollHeight
				});

			// waitting area
			$('<div class="waitting"><b></b><span></span></div>').appendTo(_this);	
			var $loadingArea = $('.waitting', _this); 
			$('span', $loadingArea).html(options.msg); 
			$loadingArea.css({
				'position':'absolute',
				'display':'block'
			});
			$loadingArea.css({
				'left': ($(_this).outerWidth() - $loadingArea.width() )/2 + 'px',
				'top': ($(_this).outerHeight()  - $loadingArea.height() )/2 + $(window).scrollTop() + 'px' 
			});
			$('.waitting', _this).on('dblclick',function(){
				_this._stop();
			})
		};
		this._stop = function(){
			$('.waitting-wrp, .waitting', _this).remove();
			// $(_this).css('position', 'static');
		};
		
		return this.each(function(){
			// create a new waitting instance
			_this._init();
		});
	};
	

		
	
})(jQuery);