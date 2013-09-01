/** 
* $.fn.ajaxValidate 
* @extends jquery.1.7.1 
* @fileOverview 异步服务端校验控件
* @author wangpf 
* @email wangpf@siss.com.cn
* @version 0.1 
* @date 2013-06-06
* Copyright (c) 2013-2013 wangpf 
* @example 
*    $("input").ajaxValidate()
* @params options
*    url : required
*  	 type: optional
*    successHandler: optional
*/ 
$.fn.ajaxValidate = function( options ){
	var _this = this;

	this.options = $.extend( {}, $.fn.ajaxValidate.defaults, options );

	_this.init = function( target ){

		var _this = this;

		$.data(target, "oldValue", $(target).val());

		$(target).on("change", function(){
			if($.data(target, "oldValue") == this.value){
				return false;
			}
			var data = {};
			data[$(target).attr("id")] = $(target).val();
			$.ajax({
				type: _this.options.type,
				url: _this.options.url,         /* url is essential */
				global: false,
				data: { validate : data },
				success: function(data){
					if(data.status=='error'){
						$.message(data.message);
						$(_this).focus();
						$(_this).parent(".input-wrapper").addClass("validatebox-invalid");
					}else{
						$(_this).parent(".input-wrapper").removeClass("validatebox-invalid");
					}
				}
			});
		});

		return this;
	}

	this.each(function(){
		/* initialize */
		return _this.init( this );
	});

}

/*
* ajaxValidate defaults
*/
$.fn.ajaxValidate.defaults = {
	type: 'POST',
	url: ''
}