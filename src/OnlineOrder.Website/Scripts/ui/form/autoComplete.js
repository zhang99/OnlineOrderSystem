/** 
* $.fn.autoComplete 
* @extends jquery.1.7.1 
* @fileOverview 日期控件
* @author wangpf 
* @email wangpf@siss.com.cn
* @version 0.1 
* @date 2013-05-24 
* Copyright (c) 2013-2013 wangpf 
* @example 
*    $("input").autoComplete()
*/ 
$.fn.autoComplete = function( options ){

	var _this = this,
	options = $.extend( {}, $.fn.autoComplete.defaults, options );

	_this.init = function( target ){
		if($.data(target, "autoComplete")){
			return;
		}

		$.data(target, "oldValue", $(target).val());
		var panel = _this._createPanel( target );

		/*
		* 频率控制 返回函数连续调用时，action 执行频率限定为 次 / delay
		* @param delay  {number}    延迟时间，单位毫秒
		* @param action {function}  请求关联函数，实际应用需要调用的函数
		* @param tail?  {bool}      是否在尾部用定时器补齐调用
		* @return {function}	返回客户调用函数
		*/
		var throttle = function(delay, action, tail, debounce) {
		    var last_call = 0, last_exec = 0, timer = null, 
		    curr, diff,ctx, args, exec = function() {
		            last_exec = Date.parse (new Date());
		            action.apply(ctx,args);
		        };

		    return function() {
		        ctx = this, args = arguments;
		        curr = Date.parse (new Date()); diff = curr - (debounce?last_call:last_exec) - delay;
		        
		        clearTimeout(timer);
		        if(debounce){
		            if(tail){
		                timer = setTimeout(exec,delay); 
		            }else if(diff>=0){
		                exec();
		            }
		        }else{
		            if(diff>=0){
		                exec();
		            }else if(tail){
		                timer = setTimeout(exec,-diff);
		            }
		        }
		        last_call = curr;
		    }
		}
		/*
		* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 idle，action 才会执行
		* @param idle   {number}    空闲时间，单位毫秒
		* @param action {function}  请求关联函数，实际应用需要调用的函数
		* @param tail?  {bool}      是否在尾部执行
		* @return {function}	返回客户调用函数
		*/
		var debounce = function(idle,action,tail) {
		    return throttle(idle, action, tail, true);
		}

		$(target).on("keyup", debounce(300, function(){
			if($.data(target, "oldValue") != this.value){
				$.data(target, "oldValue" , this.value);
				/* Ajax submit, return Json */
				if($(target).data("ajaxAutoComplete")){
					$(target).data("ajaxAutoComplete").abort();
				}
				$.fn.autoComplete.methods["ajaxSubmit"](target, panel, options);
			}
		}, true));
		$(document.body).off('click.autoComplete').on('click.autoComplete', function(){
			if( panel.css('display')=='block' ){
				$("#{0}Id".format($(target).parents('.field').attr('controller').replace(/ies$/i,'y').replace(/s$/i,''))).val('');
			}
           	$('.auto-complete', document.body).hide();
           	if($(target).data("ajaxAutoComplete")){
				$(target).data("ajaxAutoComplete").abort();
			}
        });
   

        $.data( target, "autoComplete", this );
        
		return panel;
	}

	/** 
	 *  Private Function 
	 */

	_this._createPanel = function( target ){
		var panel = $("<div class=' auto-complete'></div>").appendTo($(target).parent()),
		grid = $('<div class="si-grid" tabindex="0"></div>').prependTo(panel),
		t = $('<table><thead></thead><tbody></tbody></table>').prependTo(grid);	
		return panel;
	}

	this.each(function(){
		/* initialize */
		return _this.init( this );
	});

}

/*
* autoComplete methods
*/
$.fn.autoComplete.methods = {

	ajaxSubmit: function( original, target, options ){
		var _this = this,
		options = $.extend( {}, $.fn.autoComplete.defaults, options );
		var xhr = $.ajax({
			type: options.type,
			dataType: 'json',
			data: {"query": $(original).val()},
			// url: options.url,
			url: "/{0}/Query".format( $(original).parents(".field").attr("controller") ),
			global:false,
			complete: function(){
				$(original).data("ajaxAutoComplete", false);
			},
			success: function(resp){
				if(resp.status == 'error'){
					//---------------
					// do something to handle error here
					//---------------
					return;
				}
				var gridData = resp.data;

				if(gridData){

					$('.auto-complete', document.body).hide();

					_this._setGrid( original, target, gridData );

					_this._keyEventHandler( original, target);
				}

			},
			error: function(err){
				if(err.readyState==0) return false;
				$.message({ msg: "{0} {1}".format(err.status, err.statusText)});
			}
		});
		$(original).data("ajaxAutoComplete", xhr);
	},
	_setGrid: function( original, target, data ){
		var _this = this;
		if($.fn.grid){
			var grid = target.find(".si-grid").grid();
		}

		/* Construction of Grid Table */
		var thead = $('thead', target),
			tbody = $('tbody', target).empty(),
			tr;
		if($('tr', thead).length == 0){
			tr = $('<tr></tr>')
			tr.append('<th field="rownum">序号</th><th field="Id" class="hide"></th><th field="Code">编码</th><th field="Name">名称</th>');
			tr.appendTo(thead); 
		}
		target.show();
		if(data.length==0){
			var tr = $('<tr><td colspan="3">没有任何数据.</td></tr>').appendTo(tbody);
		}
		for(var i = 0, len = data.length; i < len; i ++){
			var tbodyTr = $('<tr></tr>');
			if(i == 0){
				tbodyTr.addClass('selected');
			}
			tbodyTr.append('<td field = "rownum">'+ (i + 1) +'</td>' +
				'<td field="Id" class="hide">' + data[i].Id + '</td>' +
				'<td field="Code">' + data[i].Code + '</td>' +
				'<td field="Name">' + data[i].Name + '</td>'
			)
			tbodyTr.appendTo(tbody);
		}
		$("tbody tr", target[0]).on("click",function(){
			window.setTimeout(function(){
				if(grid){
					var gridData = grid.getData();
					_this._setValueByGridData(original, gridData);
					$.data(original, "oldValue", $(original).val());					
					target.hide();
				}
			},10);
		})
	},
	_setValueByGridData : function( original, gridData ){
		for(var arg in gridData) {
            $(original).siblings("input").andSelf().each(function(){
                if(new RegExp(arg).test(this.id)){
                    this.value = gridData[arg];
                }
            })
        }
        original.focus();
	},
	_keyEventHandler : function( original , target){
		var _this = this;
        $(original).off("keydown").on("keydown", function(e){
        	switch(e.keyCode){
        		case 40: 	// ↓ 向下方向键
        			var selectedTr = $("tbody tr.selected", target);
	           		if(selectedTr.next("tr")[0]){
	           			selectedTr.removeClass("selected");
	           			selectedTr.next("tr").addClass("selected");
	           			target[0].scrollTop += parseInt(selectedTr.height());
	           		}
        			break;
        		case 38: 	// ↑ 向上方向键 
        			var selectedTr = $("tbody tr.selected", target);
	           		if(selectedTr.prev("tr")[0]){
	           			selectedTr.removeClass("selected");
	           			selectedTr.prev("tr").addClass("selected");
	           			target[0].scrollTop -= parseInt(selectedTr.height());
	           		}
        			break;
        		case 13: 	// Enter 回车
        			if(target.is(":visible")){
        				if($("tbody tr.selected", target).length > 0){
        					$("tbody tr.selected", target).trigger("click");
        				}else{
        					$("#{0}Id".format($(target).parents('.field').attr('controller').replace(/ies$/i,'y').replace(/s$/i,''))).val('');
        				}
        				target.hide();
        			}
        			break;
        		default: ;
        	}
        })
    }
}

/*
* autoComplete defaults
*/
$.fn.autoComplete.defaults = {
	type: 'POST',
	url: ''
}
