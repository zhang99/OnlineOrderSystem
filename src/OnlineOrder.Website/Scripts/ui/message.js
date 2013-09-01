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
			$element = $(document.body),
			settings = $.extend( {}, $.message.defaults, options );	
		
		if(typeof options == "string" ){
			settings = $.extend({}, settings, {msg : options});		
		}

		/*-------------------private function----------------------*/
		function init(){
			// open a message box

			if( $element.data('message') ){		
			 	close();
			} 
			// var gTimer;

			if(settings.bind && settings.bind.length > 0){
				$(settings.bind[0]).off(settings.bind[1]);
				$(settings.bind[0]).die(settings.bind[1], settings.bind[2]);
			}

			$('<div class="mask" id="mask"></div>').css({'height':  document.documentElement.scrollHeight}).appendTo( $element );
			var $messageBox = $('<div class="si-message-box" id="si-message-box"></div>');	
			$('<div class="message-title"><h3></h3><b></b></div>').appendTo($messageBox);
			$('<div class="message-main"><p class="user-message"><b></b><span></span></p><p><em></em>秒后自动关闭</p><a href="#" class="si-btn confirm current">确定</a><a href="#" class="si-btn cancel" style="display:none;">取消</a><a href="#" class="si-btn close" style="display:none;">关闭</a></div>').appendTo($messageBox);
			$messageBox.appendTo($element);
			$('p.user-message b', $messageBox).addClass( settings.type );  //加图标
			$('p.user-message span', $messageBox).html( settings.msg );   //加内容
			$('p em', $messageBox).html(settings.timeout/1000);
			
			$messageBox.css({
				'left' : ($(window).width() - $messageBox.width())/2 + $(document).scrollLeft() + 'px',
				'top' : ($(window).height() - $messageBox.height())/2 + $(document).scrollTop() + 'px'
			})
			$('.message-title h3', $messageBox).html( settings.title[settings.type] ); //加标题
			$('.message-title b, .close', $messageBox).on("click", function(){
				// close button 
				close();							
			})
			
			if(settings.type === "confirm" || settings.type === "confirms"){
				$('.confirm', $messageBox).addClass('mr-15');
				$('.cancel', $messageBox).css('display','');
			}
			if(settings.type === "confirms"){
				$('.cancel', $messageBox).addClass('mr-15');
				$('.close', $messageBox).css('display','');
				$('.message-main p', $messageBox).css('text-align','left');
			}

			if(settings.type === "normal"){
				// $('#si-message-box .message-title').css('display','none')
				$('#mask').hide();
				$('.cancel, .confirm', $messageBox).css('display','none');
				$('#si-message-box').css({
					'top' : $(window).height() - $messageBox.height() + $(document).scrollTop()-2 +'px',
					'left':'auto',
					'right':0
				})	;	
			}
			$('.confirm, .cancel', $messageBox).on("click",function(){
				// ok button 
				close();
				// confirm type Message
				if(settings.type === "confirm" || settings.type === "confirms") {
					var bool = $(this).attr('class').indexOf('confirm') == -1 ? false : true;
				 	settings.fn(bool);
				}
			});
			
			$messageBox.easydrag({handler:'.message-title'});

			$(document.body).on('keydown.message', function messageEventHandler(event){
				var index = $('a:visible', $messageBox).index($('a.current', $messageBox));
				switch (event.which){
					case 13 :   //enter
						$('a.current', $messageBox).trigger('click');
					break;
					case 37:   //←
						if(index > 0){
							$('a', $messageBox).removeClass('current');
							$('a:visible', $messageBox).eq(index - 1).addClass('current');
						}
					break;
					case 39:   //→ 
						if(index < $('a:visible', $messageBox).length - 1){
							$('a', $messageBox).removeClass('current');
							$('a:visible', $messageBox).eq(index + 1).addClass('current');
						}
					break;
					case 27:   //Esc
						close();
					break;
					// default:
					// break;
				}
				event.stopPropagation();
			})

			var gTimer = setInterval(function(){
				var t = parseInt($('p em', $messageBox).html());
				if(t == 1){
					close();	
				}
				$('p em', $messageBox).html(t - 1);
			}, 1000)
			
			$element.data("gTimer", gTimer);
			// reserve the Message data
			$element.data("message", this);

		}
		function close(){
			// remove the message box
			if($element.data("gTimer") ){
				clearInterval($element.data("gTimer"));
				$element.removeData("gTimer");
			}
			$('#si-message-box').remove();
			$('#mask').remove();
			$element.off('.message');
			if($element.data('lastFocusElem')){
				$element.data('lastFocusElem').focus();
			}
			if(settings.bind && settings.bind.length > 0){
				$(settings.bind[0]).live(settings.bind[1], settings.bind[2]);
			}

		};

		return init();

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