/*
 * 2013/5/2
 * author : wul
 * 适用于grid列表。
*/
(function($){
	$.fn.grid=function(options){	
		var defaults={
			title : '',
			tlbar : '.si-tbar',
			listForEdit : false,     //翻页列表多选是否记录；
			isCheckHide : false      //checkbox是否隐藏；
		},  
			settings= $.extend({}, defaults , options),
			_this = this;
		// log(_this)

		/*-------------------private function----------------------*/

		this._init = function(elem){
			var $grid = $(elem);		
			if($(elem).data('grid')){
				return ;
			}
			$(':checkbox', $grid).attr('checked', false);    //首次进入全部未选中
			$('.search-text:not("[name]")', settings.tlbar).val('');    //页面刷新是清空查询输入框内的值。
			$('tbody tr :checkbox', $grid).live('click',function(event){	  //多选
				if($(this).attr('checked') == 'checked'){										
					$(this).parent().parent().addClass('selected');
					$(this).attr("checked",true);
					if($(this).attr('isMemory')){
						$(this).attr('isMemory', 'true');
					}
				}else{								
					$(this).parent().parent().removeClass('selected');				
					$(this).attr("checked",false);
					if($(this).attr('isMemory')){
						$(this).attr('isMemory', 'false');
					}						
				}
				event.stopPropagation();   //阻止冒泡
			})
			
			$('thead tr th :checkbox', $grid).live('click', function(){		//全选	
				if($(this).attr('checked') == 'checked'){				
					$('tbody tr ',$grid).addClass('selected');	
					$('tbody tr td :checkbox',$grid).attr('checked',true)
						.each(function(){
							if($(this).attr('isMemory')){
								$(this).attr('isMemory', 'true');
							}
						})
				}else{					
					$('tbody tr',$grid).removeClass('selected');
					$('tbody tr td :checkbox',$grid).attr('checked',false)	
						.each(function(){
							if($(this).attr('isMemory')){
								$(this).attr('isMemory', 'false');
							}
						})				
				}
			})

			$('tbody tr td', $grid).live('click',function(){
				if($(this).children(':checkbox').length == 1){
					if($(this).children(':checkbox').attr('checked') == 'checked'){
						$(this).parent().removeClass('selected');
						$(this).children(':checkbox').attr("checked",false);
						if($(this).children(':checkbox').attr('isMemory')){
							$(this).children(':checkbox').attr('isMemory', 'false');
						}	
					}else{
						$(this).parent().addClass('selected');				
						$(this).children(':checkbox').attr("checked",true);
						if($(this).children(':checkbox').attr('isMemory')){
							$(this).children(':checkbox').attr('isMemory', 'true');
						}
					}
				}else{    
					$('tbody tr' , $grid).removeClass('selected');   //单选
					$(':checkbox', $grid).attr("checked",false)
						.each(function(){
							if($(this).attr('isMemory')){
								$(this).attr('isMemory', 'false');
							}
						})	
					$(this).parent().addClass('selected');				
					$(this).parent().find(':checkbox').attr("checked",true);
					if($(this).parent().find(':checkbox').attr('isMemory')){
						$(this).parent().find(':checkbox').attr('isMemory', 'true');
					}
				}
			})

			$('thead th', $grid).live('click', function(){				 //排序点击					
				// log($('th[field="Code"]').attr('class')===undefined)
				if($(this).attr('sortable') == 'true'){		
					var className =  $(this).attr('class'),
						field = $(this).attr('field'),
						sortDir = (className === undefined    || className == 'grid-sort-asc') ? 'Descending' : 'Ascending';
					_this.refresh($grid, {SortOptions : {Column : field , Direction: sortDir}});
				}
			})
			$('.page-first, .page-prev, .page-next, .page-last', $grid).live('click', function(){   //分页点击					
				if($(this).attr('class').indexOf('page-disabled') == -1){
					_this.refresh($grid, $(this).attr('class'));
				}else{
					return false;
				}	
			})
			if($('.si-page span :text',_this)[0]){ 
				$('.si-page span :text', $grid).live('keydown', function(event){   //分页按enter键时
					switch (event.which)
					{
					case 13 :		
						_this.refresh($grid, {pageIndex : parseInt($('.si-page span :text',_this).val().match(/\d+/g))});
						break;
					}
				})
			}
			$('.search-text', settings.tlbar).bind('keydown',function(event){   //查询按enter键时
				switch (event.which)
				{
				case 13 :		
					_this.refresh($grid, { query : $(this).val() });
					break;
				}
			})

			if($('.table-head', $grid).length > 0){
				var headTop = $('.table-head', $grid).offset().top;
			}
			$(window).on('scroll', function(){
				if( $grid.parents('.si-wind').length == 0 && headTop < $(window).scrollTop()){
	                $('.table-head', $grid).css({'position' : 'fixed', 'top' : 0, 'z-index' : 2});
	                $grid.css('position', 'relative');
	            }else{
	                $('.table-head', $grid).css({'position' : 'static', 'top' : 0, 'z-index' : 1})
	                $grid.css('position', 'static');
	            }
			})
			
			$grid.on('ajaxComplete', function(){
				_this._innerScroll();
			})
			_this._innerScroll();

			$(elem).data('grid',this);
		}

		// grid-inner左右滚动；
		this._innerScroll = function(){   
			var _this = this;
			$('.grid-inner', _this).on('scroll', function(){
				if($('.table-head', _this).css('position') == 'fixed'){
					if($(this).scrollLeft() > 0){
						$('.table-head', _this).css({'position' : 'fixed', 'left' : 11-$(this).scrollLeft()});
						$(_this).css('position', 'relative');
					}else{
						$('.table-head', _this).css({'left' : '11px'})
					}
				}
			})
		}

		this._getCurrentData = function(opt){      //  current data
			var _this = this;
			var defs ={	
				Ids	: [] ,						
				pageIndex : 1 ,
				SortOptions: {
					Column : '' ,
					Direction  : ''
				},
				query : ''	,
				queryFields : ''			
			};
			defs.Ids = _this.getData(true,'Id');
			if($('.si-page span :text',_this)[0]){        //判断分页是否存在
				defs.pageIndex = parseInt($('.si-page span :text',_this).val().match(/\d+/g));   //当前页				
			}else{
				defs.pageIndex = 1;				
			}
			$('th[queryable=true][field !=""]',_this).each(function(){
				defs.queryFields +=$(this).attr('field')+",";
			})
			defs.queryFields = defs.queryFields.substr(0,defs.queryFields.length-1);
			defs.SortOptions.Column = $('th[class^="grid-sort-"]',_this).attr('field');   //field
			var className = $('th[class^="grid-sort-"]',_this).attr('class');
			defs.SortOptions.Direction = $('th[class^="grid-sort-"]',_this).length > 0 ? (className == 'grid-sort-asc' ? 'Ascending' : 'Descending') : '' ;    //sortable
			if(! defs.SortOptions.Column || ! defs.SortOptions.Direction){
				defs.SortOptions ='';
			}
			defs.query = $('.search-text:not("[Name]")', settings.tlbar).val();   //搜索值
			var opt = $.extend({} , defs , opt );			
			return opt;
		}

		this._memoryCurrentData = function(){   //存错选中的数据；
			var _this = this;
			var pageData = _this.getData(true) ? _this.getData(true) : [],  //选中的数据
			removeIds = _this._removeMemoryData();
			if($(_this).data('memoryData')){
				var memoryData = $(_this).data('memoryData');   //存储的数据
				memoryData = memoryData.concat(pageData).unequal('Id');
				for(var i = 0, ilen = removeIds.length; i < ilen; i++){
					for(var j = 0; j < memoryData.length; j++){
						if(removeIds[i] == memoryData[j].Id){
							memoryData.splice(j, 1);
						}
					}
				}
				$(_this).data('memoryData', memoryData);
			}else{
				$(_this).data('memoryData', pageData);
			}
			return $(_this).data('memoryData');
			
		}

		this._removeMemoryData = function(){
			var _this = this;
			var removeIds = [];
			$(':checkbox[isMemory="false"]', _this).each(function(){
				removeIds.push($(this).attr('value'));
			})
			return removeIds;
		}
		
		/*-------------------publish function----------------------*/

		this.del = function(elem, options){  //删除		
			var _this = this;
			var ajaxData = _this._getCurrentData();
			var defaults = {
				success : function(){} 
			};
			defaults.success = function(data){
				// log(data,data.state,data.status)
				if(data.status == 'success'){	
					_this.refresh(elem);
				}	
				$.message(data.message);
			}	
			var opts = $.extend( {} , defaults , options);
			if( ! ajaxData.Ids ){   //未选中时；				
				$.message({msg:'请选择删除记录！!' , type : 'info' });
			}else{     //选中时				
				$.message({ msg:'你确定要删除记录？' , type : 'confirm'  ,fn : function(bool){
					if(bool){
						$.ajax({
							type : 'post'  ,
							url : '/{0}/Delete'.format($(elem).attr('controller')) ,								
							data : {Ids : ajaxData.Ids},								
							success : opts.success 
						})		
					}
				}})
			}
			return false;
		}

		this.refresh = function(elem, options){   //刷新	
			var _this = this;
			var ajaxData =  _this._getCurrentData();
			var defaults = {
				global : true , 
				target : null ,
				beforeSend : function(){} ,
				complete :function(){}
			};
			var opts = $.extend( {} , defaults , options);
			if( ! opts.global){
				defaults.beforeSend = function(){
					$(opts.target).waitting(true);
				};
				defaults.complete = function(){
					$(opts.target).waitting(false);
				};
			}
			if (typeof options == 'object'  && typeof options.data == 'object'){
				var _data = $.extend( {} , _data , options.data) ;
				$(this).data('_data', _data);
			}
			ajaxData = $.extend( {}, ajaxData , $(this).data('_data') ) ;
			delete(ajaxData.Ids);
			if(typeof(options) == 'string' ){
				switch (options)
				{
				case 'page-first':		
					ajaxData.pageIndex = 1;								
					break;
				case 'page-prev' :	
					ajaxData.pageIndex--;
					break;
				case 'page-next' :
					ajaxData.pageIndex++;														
					break;
				case 'page-last' :
					ajaxData.pageIndex = -1;
					break;
				}		
			}else if (typeof options == 'object' && !options.data  && !options.target ){
				 ajaxData = $.extend( {} , ajaxData , options ) ;
			}	
			var memoryData;
			if(settings.listForEdit){
				memoryData = _this._memoryCurrentData();  //存储选中的数据
			}
			if(settings.isCheckHide){
				ajaxData.isCheckHide = settings.isCheckHide;
			}
			ajaxData.SortOptions = typeof(ajaxData.SortOptions) == 'object' ? JSON.stringify(ajaxData.SortOptions) : '';
			//log(memoryData)
			// log('/{0}/{1}'.format($(_this).attr('controller'),$(_this).attr('action')).replace('/Index',''),$(_this))	
			$.ajax({
				type : 'get' ,
				url : '/{0}/{1}'.format($(elem).attr('controller'),$(elem).attr('action')).replace('/Index',''),	
				global : opts.global ,
				// contentType : 'application/json',
				beforeSend : defaults.beforeSend ,		
				data :  ajaxData,
				success: function (data) {		
					if(typeof (data) == Object){
						$.message(data.message);
					}else{
						$(_this).html(data); //替换
						var isMemory;
						if(typeof settings.isCheckHide == 'boolean' && typeof ajaxData.isCheckHide == 'string'){
							isMemory = settings.listForEdit && ! settings.isCheckHide && ajaxData.isCheckHide.toLowerCase() === 'false';
						}else if(typeof settings.isCheckHide == 'boolean' && typeof ajaxData.isCheckHide == 'boolean'){
							isMemory = settings.listForEdit && ! settings.isCheckHide && ! ajaxData.isCheckHide;
						}else{
							isMemory = settings.listForEdit && settings.isCheckHide.toLowerCase() === 'false' && ajaxData.isCheckHide.toLowerCase() === 'false';
						}
						if(isMemory){
							var pageData = _this.getAllData();   //返回页面的数据
							if(pageData && memoryData){
								for(var i = 0, ilen = pageData.length; i < ilen; i++){
									for(var j = 0, jlen = memoryData.length; j < jlen; j++){
										if(pageData[i].Id == memoryData[j].Id){
											$(':checkbox[value ='+ pageData[i].Id +']', _this).attr({'checked' : 'checked', 'isMemory' : 'true'})
												.parents('tr').addClass('selected')
										}
									}
								}
							}

						}
					}	
				},
				complete : defaults.complete 
			})
			return false;	
		}

		this.modify = function(elem, options){  //修改
			var _this = this,
				data = _this.getData(),
				defaults = {
					type : 'get',
					url : '/{0}/Edit'.format($(elem).attr('controller')),
					data : {},
					global : true,
					success : function(){},
					complete : function(){}
				},
				opts = $.extend({}, defaults, options);
			if( ! data ){
				$.message({msg:'请选择要修改的记录!' , type : 'info' });
			}else if(data.Id){	
				opts.data = {Id : data.Id};
				if(typeof options =='object' ){
					$.ajax({
						type : opts.type ,
						url : opts.url ,
						data : opts.data,
						global : opts.global,
						success : opts.success,
						complete : opts.complete
					})
				}else{
					window.location.assign('/{0}/Edit/{1}'.format($(elem).attr('controller') , data.Id))
				}
			}
			return false;
		}

		this.create =  function(elem, options) {   //新增	
			var _this = this,
				defaults = {
					type : 'get',
					url : '/{0}/Create'.format($(elem).attr('controller')),
					data : {},
					global : true,
					success : function(){},
					complete : function(){}
				},
				opts = $.extend({}, defaults, options);
			if(typeof options =='object'){
				$.ajax({
					type : opts.type ,
					url : opts.url ,
					data : opts.data,
					global : opts.global,
					success : opts.success,
					complete : opts.complete
				})
			}else{
				window.location.assign('/{0}/Create'.format($(elem).attr('controller')));
			}
			return false;
		}

		/*确认选择*/
		this.confirm = function(target){
			var _this = this;
			var value = this.getData();
            for (var arg in value) {
                $("input", $(target).parents('.field')).each(function () {
                    if (new RegExp(arg).test(this.id)) {
                        this.value = value[arg];
                    }
                })
            }    
            $.window('close');   
		}

		/*取消选择*/
		this.cancel = function(){
			$(document.body).unbind('keydown');
			$.window('close');
		}

		/*增加一行*/
		this.addLine = function(options){
			var trHtml = _this.getEmptyCloneOf($('tbody tr', _this).last()),
			retFlag = true;
			if($('tbody tr:first td').length == 1){
				trHtml = _this.getEmptyCloneOf($('thead tr', _this)),
				$('tbody tr:first').remove();
			}
			for(var option in options){
				if ($("#"+option).val() == "") {
                    $.message("请输入{0}！".format(options[option]));
                    retFlag = false;
               	}else{
               		$('td[field={0}]'.format(option), _this).each(function () {
                       if($("#"+option).val() == $(this).text()) {
                           	$.message("{0}已存在，请重新输入！".format(options[option]));
                           	retFlag = false;
                       }
                   	})
               	}
               	if(retFlag){
               		trHtml.children('td[field={0}]'.format(option)).text($("#"+option).val())
               	}else{
               		return false;
               	}
			}
			$('tbody', _this).append(trHtml);
			_this.refreshRownum();
			$("#"+option).val('');	//清空指定域
			$("#"+option).focus();
		}
		/*删除一行*/
		this.delLine = function(){
			var delModelIds = 'del{0}Ids'.format($(_this).attr('field')),
			delBarcodeIds = $('#'+delModelIds, _this).val() ? new Array($('#'+delModelIds, _this).val()):[];
			if($('#'+delModelIds, _this).length == 0){
				$('<input type="hidden">').attr('id', delModelIds).prependTo(_this);
			}
			var delTrs = $("tbody tr.selected", _this);
			if (delTrs.length == 0) {
			   $.message("请选择要删除的数据！");
			   return;
			}
			$('td[field="Id"] :checkbox', delTrs).each(function () {
			   this.value && delBarcodeIds.push(this.value);
			})
			$('#'+delModelIds, _this).val(delBarcodeIds);
			delTrs.remove();
			_this.refreshRownum();
			if ($("table tbody", _this).html() == "") {
               $("table tbody", _this).html("<tr><td colspan='{0}'>没有任何数据.</td></tr>".format($("thead td:not('.hide')", _this).length));
           	}
		}
		/*更新行号*/
		this.refreshRownum = function(){
			$('tbody tr td[field="rowNum"]', this).each(function(i){
				$(this).text( i+1 );
			})
		}
		/*获得克隆对象并清空内容*/
		this.getEmptyCloneOf = function(target){
			var clone = $(target).clone(true).removeClass('selected');
			if($('th',clone).length > 0){
				clone.html(clone.html().replace(/<th/gi,'<td'))
			}
			$('td', clone).each(function(){
				if($('input', this).length > 0){
					$(':input', this).each(function () {
			            var t = this.type;
			            if(t == 'text' || t == 'hidden') {
			                $(this).attr('value','');
			            }
			            if(t == 'checkbox'){
			            	$(this).attr('checked', false);
			            	$(this).attr('value','');
			            }
			        });
				}else{
					$(this).html('');
				}
			})
	        return clone;
		}

		// this.setting = function(){
		// 	// log('setting',$(_this).controller)
		// 	$.ajax({
		// 		type : 'get' ,
		// 		url : '/{0}/Setting'.format($(_this).attr('controller') ) ,
		// 		data : {} ,
		// 		success : function(data){
		// 			$.window( {title : options.title+'设置' , fillText : data })
		// 		}
		// 	})
		// 	return false;
		// }

		// []  getData(true)  	[{id:1,code:xxx},{id:12,code:xxx}]
		// {}  getData() 		{id:1,code:xxx}
		// undefiend
		// getData(true, id)
		this.getData = function( options){  //选中行数据
			var _this = this,
				data=[],
				json={};
			for(var i = 0; i < arguments.length ; i++){
				if(typeof arguments[i] == 'boolean'){
					var bool = arguments[i];
				}else if(typeof arguments[i] == 'string'){
					var fields = arguments[i];
				}else if(typeof arguments[i] == 'object'){
					var listForEdit = arguments[i].listForEdit;
				}
			}
			$('tbody tr.selected',_this).each(function(){
				$('td',this).each(function(){
					json[$(this).attr('field')] = ($(this).attr('field') == 'Id' && $(':checkbox',this).length > 0) ? $(':checkbox',this).attr('value') : $(this).text();
				})
				data.push(json);
				json={};
			})
			if(fields != undefined){
				for(var i =0; i< data.length; i++){
					data[i] = data[i][fields];
				}
			}
			if(data.length == 0){ 
				data = undefined ;
			}else if(!bool){
				data = data[0];
			}
			if(bool && listForEdit && ! settings.isCheckHide){    //单据列表时返回存储的数据。
				data = _this._memoryCurrentData();  
			}
			// console.log(data)
			return  data   ;  // 选中行的全部数据；
		}

		this.getAllData = function(){   //单据列表中除行号外所有字段&&数据
			var _this = this;
			var data = [], json = {};
			$('tbody tr', _this).each(function(){
				$('td[field][field != "rowNum"]',this).each(function(){
					json[$(this).attr('field')] = ($(this).attr('field') == 'Id' && $(':checkbox',this).length > 0) ? $(':checkbox',this).attr('value') : $(this).text();
					if(json['Id'] == ''){
						json['Id'] = 0;
					}
				})
				data.push(json);
				json={};
			})
			return data;
		}


		// ajax事件可选参数列表  
		// type : '' ,
		// url : '' ,
		// data : {} ,
		// target : '',
		// global : true ,
		// success : function(){} ,
		// complete : function(){}
		//doAction('refresh',{url: ''})
		this.doAction = function(options){     //根据class判断添加事件
			var _this = this;
				target = _this;
			for(var i = 0;i<arguments.length;i++){
				if(typeof arguments[i] == 'string'){
					var action = arguments[i];
				}else{
					var ajaxOpts = arguments[i];
				}
			}
			switch (action){
				case 'create':
				_this.create(target, ajaxOpts);
				break;
				case 'delete':
				_this.del(target, ajaxOpts);
				break;
				case 'refresh':
				_this.refresh(target, ajaxOpts);
				break;
				case 'query':
				_this.refresh(target, ajaxOpts);
				break;
				case 'modify' :
				_this.modify(target, ajaxOpts);
				break;
				case 'setting' :
				_this.setting(target);
				break;
			}
		}
		
		return this.each(function(){
			_this._init(this);		
			
		})
	}
})(jQuery);