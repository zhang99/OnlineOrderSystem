/*
* A Loading Plugin for jQuery
*
* Introduction
 @version 2.0
 @date 2013-07-12 
* Copyright (c) 2013-2013 wul  
example $.message(msg:'1213',type:'normal')
*---------------------
* 暂无
*---------------------
*/
(function($, window, document){
	$.message = function( options ){

		/*------------------- attributes -------------------------*/
		
		var _this = this,
		$element = $(document.body);
		// options;
		
		this.settings = $.extend( {}, $.message.defaults, options );	
		
		if(typeof options == "string" ){
			this.settings = $.extend( {}, this.settings, { msg: options } );		
		}

		/*-------------------private function----------------------*/
		this._init = function(){
			// open a message box
			if( $element.data('message') ){				
				if(this.timer){					
					clearTimeout(this.timer);
				}
			 	_this._close();
			 } 

			if(_this.settings.bind && _this.settings.bind.length > 0){
				$(_this.settings.bind[0]).off(_this.settings.bind[1]);
				$(_this.settings.bind[0]).die(_this.settings.bind[1], _this.settings.bind[2]);
			}

			$('<div class="mask" id="mask"></div>').css({'height':  document.documentElement.scrollHeight}).appendTo( $element );
			$('<div class="si-message-box" id="si-message-box"></div>').appendTo( $element);	
			$('<div class="message-title"><h3></h3><b></b></div>').appendTo( $('#si-message-box') );
			$('<div class="message-main"><p><b></b><span></span></p><a href="#" class="si-btn confirm">确定</a><a href="#" class="si-btn cancel" style="display:none;">取消</a><a href="#" class="close" style="display:none;">关闭</a></div>').appendTo($('#si-message-box'));
			$('#si-message-box').find('p b').addClass( this.settings.type );  //加图标
			$('#si-message-box').find('p span').html( this.settings.msg );   //加内容
			$('#si-message-box').css({
				'left' : ($(window).width() - $('#si-message-box').width())/2 + $(document).scrollLeft() + 'px',
				'top' : ($(window).height() - $('#si-message-box').height())/2 + $(document).scrollTop() + 'px'
			})
			$('#si-message-box .message-title h3').html( this.settings.title[this.settings.type] ); //加标题
			$('#si-message-box .message-title b').on("click",function(){
				// close button 
				_this._close();							
			})
			if(this.settings.type === "confirm" || this.settings.type === "confirms"){
				$('.confirm', '#si-message-box').addClass('mr-15');
				$('.cancel', '#si-message-box').css('display','');
			}
			if(this.settings.type === "confirms"){
				$('.cancel', '#si-message-box').addClass('mr-15');
				$('.close', '#si-message-box').css('display','');
				$('.message-main p', '#si-message-box').css('text-align','left');
			}

			if(this.settings.type === "normal"){
				// $('#si-message-box .message-title').css('display','none')
				$('#mask').hide();
				$('.cancel, .confirm', '#si-message-box').css('display','none');
				$('#si-message-box').css({
					'top' : $(window).height() - $('#si-message-box').height() + $(document).scrollTop()-2 +'px',
					'left':'auto',
					'right':0
				})	;	
				this.timer = setTimeout(function(){
					if(this.timer){
						clearTimeout(this.timer);
					}
					$('#si-message-box').fadeOut(2000,function(){
						 _this._close();

					});
				},this.settings.timeout)		
				
			}
			$('.confirm', '#si-message-box').addClass('current');
			$('.confirm', '#si-message-box').on("click",function(){
				// ok button 
				_this._close();
				// confirm type Message
				if(_this.settings.type === "confirm" || _this.settings.type === "confirms") {
				 	_this.settings.fn(true);
				}
			});
			$('.cancel', '#si-message-box').on("click",function(){

				// cancel button 
				_this._close();
				// confirm type Message
				if( _this.settings.type === "confirm" || _this.settings.type === "confirms") { 
					_this.settings.fn(false); 
				}
			});

			$('.close', '#si-message-box').on("click",function(){
				_this._close();
			})
			
			$('.si-message-box').easydrag({handler:'.message-title'});
			$(document.body).on('keydown.message', function messageEventHandler(event){
				var index = $('a:visible', '#si-message-box').index($('a.current', '#si-message-box'));
				switch (event.which){
					case 13 :   //enter
						$('a.current', '#si-message-box').trigger('click');
					break;
					case 37:   //←
						if(index > 0){
							$('a', '#si-message-box').removeClass('current');
							$('a:visible', '#si-message-box').eq(index - 1).addClass('current');
						}
					break;
					case 39:   //→ 
						if(index < $('a:visible', '#si-message-box').length - 1){
							$('a', '#si-message-box').removeClass('current');
							$('a:visible', '#si-message-box').eq(index + 1).addClass('current');
						}
					break;
					case 27:   //Esc
						_this._close();
					break;
					default:
					break;
				}
				event.stopPropagation();
			})

			// reserve the Message data
			$element.data("message", this);

		}
		this._close	= function(){
				// remove the message box
				$('#si-message-box').remove();
				$('#mask').remove();
				$element.off('.message');
				if($element.data('lastFocusElem')){
					$element.data('lastFocusElem').focus();
				}
				if(_this.settings.bind && _this.settings.bind.length > 0){
					$(_this.settings.bind[0]).live(_this.settings.bind[1], _this.settings.bind[2]);
				}
		};

		return this._init();

	}
	$.message.defaults = {
		msg	: '这是一个消息框.',  // Message information
		type : 'info',            // the type of Message  normal,info,error,confirm,succeed,warning,六种类型
		title : {
			'info': '提示',
			'error': '错误',
			'warning': '警告'
		},			  
		fn: new Function(),	      // callback function
		timeout : 3000,               // if 0 , never close unless user close it; else > 0, close it after timeout(ms)
		bind: []
	}
})(jQuery, window, document);