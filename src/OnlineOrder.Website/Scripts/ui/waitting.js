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
			options = $.extend({}, defaults, options)
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
			$(_this).css(
				'position','relative'								
			);

			// waitting wrapper
			$('<div class="waitting-wrp"></div>')
				.appendTo(_this)
				.css({
					'width': $(this).outerWidth() ,
					'height': document.documentElement.scrollHeight ,
					'position':'absolute',
					'left':0,
					'top':0,
					'background':'#000',
					'opacity' :　'0.2' ,
					'z-index' : 1000
				});

			// waitting area
			$('<span class="waitting"><b></b><span></span></span>').appendTo(_this);	
			this.$loadingArea = this.children(".waitting"); 
			this.$loadingArea.children('span').html(options.msg); 
			this.$loadingArea.css({
				'position':'absolute',
				'display':'block'
			});
			this.$loadingArea.css({
				'left': ($(_this).outerWidth() - this.$loadingArea.width() )/2 + 'px',
				'top': ($(_this).outerHeight()  - this.$loadingArea.height() )/2 + document.documentElement.scrollTop + 'px' 
			});
			$('.waitting', _this).on('dblclick',function(){
				_this._stop();
			})
		};
		this._stop = function(){
			$('.waitting-wrp, .waitting', _this).remove();
		};
		
		return this.each(function(){
			// create a new waitting instance
			_this._init();
		});
	};
	

		
	
})(jQuery);