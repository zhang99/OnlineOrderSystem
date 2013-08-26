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
		$(target).on("keyup", function(){
			if($.data(target, "oldValue") != this.value){
				$.data(target, "oldValue" , this.value);
				/* Ajax submit, return Json */
				$.fn.autoComplete.methods["ajaxSubmit"](target, panel, options);
			}
		});
		$(document.body).on('click',function(){
			if( panel.css('display')=='block' ){
				$("#{0}Id".format($(target).parents('.field').attr('controller').replace(/ies$/i,'y').replace(/s$/i,''))).val('');
			}
           	panel.hide();
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

		$.ajax({
			type: options.type,
			dataType: 'json',
			data: {"query": $(original).val()},
			// url: options.url,
			url: "/{0}/Query?isCheckHide=false".format( $(original).parents(".field").attr("controller") ),
			global:false,
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
				$.message({ msg: "{0} {1}".format(err.status, err.statusText)});
			}
		});
	},
	_setGrid: function( original, target, data ){
		var _this = this;
		if($.fn.grid){
			var grid = target.find(".si-grid").grid();
		}

		/* Construction of Grid Table */
		var thead = target.find('thead').empty(),
		tbody = target.find('tbody').empty(),
		tr = $('<tr></tr>').appendTo(thead);
		tr.append('<th field="rownum">序号</th>')
		  .append('<th field="Id" class="hide"></th>')
		  .append('<th field="Code">编码</th>')
		  .append('<th field="Name">名称</th>')
		target.show();
		if(data.length==0){
			var tr = $('<tr><td colspan="3">没有任何数据.</td></tr>').appendTo(tbody);
		}
		for(var i = 0, len = data.length; i < len; i ++){
			var tr = $('<tr></tr>').appendTo(tbody);
			if(i==0){
				tr.addClass("selected")
			}
			$('<td field="rownum"></td>').appendTo(tr).html(i+1);
			$('<td field="Id" class="hide">').appendTo(tr).html(data[i].Id);
			$('<td field="Code"></td>').appendTo(tr).html(data[i].Code);
			$('<td field="Name"></td>').appendTo(tr).html(data[i].Name);
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
        $(original).off(".keyEventHandler").on("keypress.keyEventHandler", function(e){
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
