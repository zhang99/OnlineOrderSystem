/*
 * 2013/5/2
 * author : wul
 * 适用于grid列表。
*/
(function($){
	$.fn.grid=function(options){	
		var defaults={
				title : '',
				tlbar : '.si-tbar',      //关联的工具栏
				memoryCheck : false,     //翻页时选中记录是否记录，默认不记录
				hideCheckbox : false,      //列表中checkbox是否隐藏，默认显示
				actionOfWindow : false		//tlbar操作是否为弹窗显示，默认为调整页面
			},  
			settings= $.extend({}, defaults , options),
			_this = this;

		/*-------------------private function----------------------*/

		this._init = function(elem){
			var $grid = $(elem);		
			if($(elem).data('grid')){
				return ;
			}
			$(':checkbox', $grid).attr('checked', false);    //首次进入全部未选中
			$('.search-text:not("[name]")', settings.tlbar).val('');    //页面刷新是清空查询输入框内的值。
			$grid.delegate('tbody tr :checkbox', 'click', function(event){	  //多选
				if($(this).attr('checked') == 'checked'){										
					$(this).parents('tr').addClass('selected');
					$(this).attr('isMemory') && $(this).attr('isMemory', 'true');
				}else{								
					$(this).parents('tr').removeClass('selected');
					$(this).attr('isMemory') && $(this).attr('isMemory', 'false');			
				}
				event.stopPropagation();   //阻止冒泡
			})
			
			$grid.delegate('thead  :checkbox', 'click', function(){		//全选	
				if($(this).attr('checked') == 'checked'){				
					$('tbody tr ',	$grid).addClass('selected');	
					$('tbody tr td :checkbox',	$grid).attr('checked',true)
						.each(function(){
							$(this).attr('isMemory') && $(this).attr('isMemory', 'true');
						});
				}else{					
					$('tbody tr',	$grid).removeClass('selected');
					$('tbody tr td :checkbox',	$grid).attr('checked',false)	
						.each(function(){
							$(this).attr('isMemory') && $(this).attr('isMemory', 'false');	
						})				
				}
			})

			$grid.delegate('tbody tr td', 'click',function(){        //单选
				if($('>:checkbox', this).length == 1){
					var $checkbox = $('>:checkbox', this);
					if($checkbox.attr('checked') == 'checked'){
						$(this).parent().removeClass('selected');
						$checkbox.attr("checked",false);
						$checkbox.attr('isMemory') && $checkbox.attr('isMemory', 'false');
					}else{
						$(this).parent().addClass('selected');				
						$checkbox.attr("checked",true);
						$checkbox.attr('isMemory') && $checkbox.attr('isMemory', 'true');
					}
				}else{  
					var $tr = $(this).parent();  
					$('tbody tr' , $grid).removeClass('selected');   
					$(':checkbox', $grid).attr("checked", false)
						.each(function(){
							$(this).attr('isMemory') && $(this).attr('isMemory', 'false');
						});	
					$tr.addClass('selected');				
					$(':checkbox', $tr).attr("checked",	true);
					$(':checkbox', $tr).attr('isMemory') && $(':checkbox', $tr).attr('isMemory', 'true');
				}
			})

			$grid.delegate('thead th', 'click', function(){				 //排序点击					
				if($(this).attr('sortable') == 'true'){		
					var className =  $(this).attr('class'),
						sortDir = (className === undefined || className == 'grid-sort-asc') ? 'Descending' : 'Ascending';
					_this.refresh($grid, {SortOptions : {Column : $(this).attr('field'), Direction: sortDir}});
				}
			})
			$grid.delegate('.page-first, .page-prev, .page-next, .page-last', 'click', function(){   //分页点击					
				$(this).attr('class').indexOf('page-disabled') == -1 && _this.refresh($grid, $(this).attr('class'));
				return false;
			})
			if($('.si-page span :text', $grid).length > 0){ 
				$grid.delegate('.si-page span :text', 'keydown', function(event){   //分页按enter键时
					switch (event.which)
					{
					case 13 :		
						_this.refresh($grid, {pageIndex : parseInt($(this).val().match(/\d+/g))});
						break;
					}
				})
			}
			$('.search-text', settings.tlbar).bind('keydown', function(event){   //查询按enter键时
				switch (event.which)
				{
				case 13 :		
					_this.refresh($grid, { query : $(this).val() });
					break;
				}
			})

			if($('.table-head', $grid).length > 0){
				var headTop = $('.table-head', $grid).offset().top,
					advDisplay = $('.adv-search').css('display'),
					gridPosition = $grid.css('position'),
					arrWidth = [],
					firstEnter = true;
				$('th', $grid).each(function(i){
					arrWidth[i] = $(this).width();
				})
			}

			$(window).on('scroll', function(){
				if(advDisplay != $('.adv-search').css('display') && $('.table-head', $grid).length > 0){
					headTop = $('.table-head', $grid).offset().top;
					advDisplay = $('.adv-search').css('display');

				}
				if(firstEnter){   //ie下错位
					if(gridPosition != $grid.css('position') && /MSIE/g.test(navigator.userAgent)){
						$('.table-head th', $grid).each(function(i){
							$(this).width(arrWidth[i] + 1);
						})
						firstEnter = false;
					}
				}
				if( $grid.parents('.si-wind').length == 0 &&  headTop < $(window).scrollTop()){
	                $('.table-head', $grid).css({'position' : 'fixed', 'top' : 0, 'z-index' : 2});
	                $grid.css('position', 'relative');
	            }else{
	                $('.table-head', $grid).css({'position' : 'static', 'top' : 0, 'z-index' : 1})
	                $grid.css('position', 'static');
	            }
			})
			
			$grid.on('ajaxComplete', function(){
				_this._innerScroll();
				if($('.table-head', $grid).length > 0){
	                firstEnter = true;
	            }
			})

			_this._innerScroll();

			$(elem).data('grid',this);
		}

		// grid-inner左右滚动；
		this._innerScroll = function(){   
			var _this = this,
				initLeft;
			if($('.left').length > 0){
				initLeft = 223;
			}else{
				initLeft = 11;
			}
			$('.grid-inner', _this).on('scroll', function(){
				if($('.table-head', _this).css('position') == 'fixed'){
					if($(this).scrollLeft() > 0){
						$('.table-head', _this).css({'position' : 'fixed', 'left' : initLeft - $(this).scrollLeft()});
						$(_this).css('position', 'relative');
					}else{
						$('.table-head', _this).css({'left' : initLeft})
					}
				}
			})
		}

		/* return ajax data*/
		this._getCurrentData = function(opt){      //  current data
			var _this = this,
				ajaxData,
				defs ={	
					Ids	: [] ,						
					pageIndex : 1 ,
					SortOptions: {
							Column : '' ,
							Direction  : ''
						},
					query : ''	,
					queryFields : ''			
				};
			defs.Ids = _this.getData(true, 'Id');
			if($('.si-page span :text', _this).length > 0){        //判断分页是否存在
				defs.pageIndex = parseInt($('.si-page span :text', _this).val().match(/\d+/g));   //当前页				
			}else{
				defs.pageIndex = 1;				
			}
			$('th[queryable = "true"][field != ""]', _this).each(function(){
				defs.queryFields += defs.queryFields.length == 0 ? $(this).attr('field') : ',' + $(this).attr('field');
			})
			defs.SortOptions.Column = $('th[class^="grid-sort-"]', _this).attr('field');   
			defs.SortOptions.Direction = $('th[class^="grid-sort-"]',_this).length > 0 ? ($('th[class^="grid-sort-"]',_this).attr('class') == 'grid-sort-asc' ? 'Ascending' : 'Descending') : '' ;    //sortable
			if(! defs.SortOptions.Column || ! defs.SortOptions.Direction){
				defs.SortOptions ='';
			}
			defs.query = $('.search-text:not("[Name]")', settings.tlbar).val();   //搜索值
			ajaxData = $.extend({}, defs, opt);

			return ajaxData;
		}

		/*存储选中的数据*/
		this._memoryCurrentData = function(){   //存错选中的数据；
			var _this = this,
			 	pageData = _this.getData(true) ? _this.getData(true) : [],     //选中的数据
				removeIds = _this._removeMemoryData();    //取消选中的数据Id
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

		/*取消选中的数据*/
		this._removeMemoryData = function(){
			var _this = this,
				removeIds = [];
			$(':checkbox[isMemory="false"]', _this).each(function(){
				removeIds.push($(this).attr('value'));
			})
			return removeIds;
		}
		
		/*-------------------publish function----------------------*/

		this.del = function(elem, options){  //删除		
			var _this = this,
				ajaxData = _this._getCurrentData(),
				opts,
				defaults = {
					success : function(){} 
				};
			defaults.success = function(data){
				// log(data,data.state,data.status)
				if(data.status == 'success'){	
					_this.refresh(elem);
				}	
				$.message(data.message);
			}	
			opts = $.extend( {} , defaults , options);
			if( ! ajaxData.Ids ){   //未选中时；				
				$.message({msg:'请选择删除记录！!', type : 'info' });
			}else{     //选中时				
				$.message({ msg:'你确定要删除记录？', type : 'confirm' , fn : function(bool){
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
			var _this = this,
				ajaxData =  _this._getCurrentData(),
				defaults = {
					global : true , 
					target : null ,
					beforeSend : function(){} ,
					complete :function(){}
				},
				memoryData, //已存储的数据
				isMemory,  	//是否需要存储；
				pageData,   //返回页面的数据
				dateTime = new Date().getTime(),   //引入时间戳，避免ie下的缓存
				opts = $.extend( {} , defaults , options);
			if( ! opts.global){
				opts.beforeSend = function(){
					$(opts.target).waitting(true);
				};
				opts.complete = function(){
					$(opts.target).waitting(false);
				};
			}
			if (typeof options == 'object'  && typeof options.data == 'object'){
				var _data = $.extend( {} , _data , options.data) ;
				$(this).data('_data', _data);
			}
			$(this).data('_data') && (ajaxData = $.extend({}, ajaxData, $(this).data('_data')));
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
				 ajaxData = $.extend( {}, ajaxData, options ) ;
			}	
			if(settings.memoryCheck){
				memoryData = _this._memoryCurrentData();  //存储选中的数据
			}
			if(settings.hideCheckbox){
				ajaxData.hideCheckbox = settings.hideCheckbox;
			}
			ajaxData.SortOptions = typeof(ajaxData.SortOptions) == 'object' ? JSON.stringify(ajaxData.SortOptions) : '';
			$.ajax({
				type : 'get',
				url : '/{0}/{1}?{2}'.format($(elem).attr('controller'), $(elem).attr('action'), dateTime).replace('/Index',''),	
				global : opts.global,
				beforeSend : opts.beforeSend ,		
				data :  ajaxData,
				success: function (data) {		
					if(typeof (data) == Object){
						$.message(data.message);
					}else{
						$(_this).html(data); //替换

						if(typeof settings.hideCheckbox == 'boolean' && typeof ajaxData.hideCheckbox == 'string'){
							isMemory = settings.memoryCheck && ! settings.hideCheckbox && ajaxData.hideCheckbox.toLowerCase() === 'false';
						}else if(typeof settings.hideCheckbox == 'boolean' && typeof ajaxData.hideCheckbox == 'boolean'){
							isMemory = settings.memoryCheck && ! settings.hideCheckbox && ! ajaxData.hideCheckbox;
						}else{
							isMemory = settings.memoryCheck && settings.hideCheckbox.toLowerCase() === 'false' && ajaxData.hideCheckbox.toLowerCase() === 'false';
						}
						if(isMemory){
							pageData = _this.getAllData();   //返回页面的数据
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
				complete : opts.complete 
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
					success : function(data){
						$.window({'fillText':data});
					},
					complete : function(){}
				},
				opts = $.extend({}, defaults, options);
			if( ! data ){
				$.message({msg : '请选择要修改的记录!', type : 'info'});
			}else if(data.Id){	
				opts.data = {Id : data.Id};
				if(typeof options =='object' || settings.actionOfWindow){
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
					success : function(data){
						if(typeof data == 'object'){
							$.message(data.message)
						}else{
							$.window({'fillText' : data});
						}
					},
					complete : function(){}
				},
				opts = $.extend({}, defaults, options);
			if(typeof options =='object' || settings.actionOfWindow){
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
			var _this = this,
				value = this.getData();
            $.window('close', _this, value);   
            $(target).trigger('change');
            $(target).focus();
		}

		/*取消选择*/
		this.cancel = function(target){
			$(document.body).unbind('keydown');
			$.window('close', _this, false);
		}

		/*增加一行*/
		this.addLine = function(options){
			var trHtml = _this.getEmptyCloneOf($('thead tr', _this)),
				retFlag = true;
			for(var option in options){
				if ($("#"+option).val() == "") {
                    $.message("请输入{0}！".format(options[option]));
                    retFlag = false;
                    return false;
               	}else{
               		$('td[field={0}]'.format(option), _this).each(function () {
                       if($("#"+option).val() == $(this).text()) {
                           	$.message("{0}已存在，请重新输入！".format(options[option]));
                           	retFlag = false;
                           	return false;
                       }
                   	})
               	}
               	if(retFlag){
               		trHtml.children('td[field={0}]'.format(option)).text($("#"+option).val())
               	}else{
               		return false;
               	}
				$("#"+option).val('');	//清空指定域
				$("#"+option).focus();
			}
			if($('tbody tr:first td', _this).length == 1){
				$('tbody tr:first', _this).remove();
			}
			$('tbody', _this).append(trHtml);
			_this.refreshRownum();
		}
		/*删除一行*/
		this.delLine = function(){
			var delModelIds = 'del{0}Ids'.format($(_this).attr('field')),
				delTrs,
				delBarcodeIds = $('#'+delModelIds, _this).val() ? new Array($('#'+delModelIds, _this).val()):[];
			if($('#'+delModelIds, _this).length == 0){
				$('<input type="hidden">').attr('id', delModelIds).prependTo(_this);
			}
			delTrs = $("tbody tr.selected", _this);
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

		//四种输出形式
		// []  getData(true)  	[{id:1,code:xxx},{id:12,code:xxx}]
		// {}  getData() 		{id:1,code:xxx}
		// undefiend
		// getData(true, id)    ['1', '124', '23']
		this.getData = function( options){  //选中行数据
			var _this = this,
				data=[],
				json={};
			for(var i = 0, ilen = arguments.length; i < ilen; i++){
				if(typeof arguments[i] == 'boolean'){
					var bool = arguments[i];
				}else if(typeof arguments[i] == 'string'){
					var fields = arguments[i];
				}else if(typeof arguments[i] == 'object'){
					var memoryCheck = arguments[i].memoryCheck;
				}
			}
			$('tbody tr.selected', _this).each(function(){
				$('td[field]', this).each(function(){
					json[$(this).attr('field')] = ($(this).attr('field') == 'Id' && $(':checkbox',this).length > 0) ? $(':checkbox',this).attr('value') : $(this).text();
				})
				data.push(json);
				json={};
			})
			if(fields != undefined){
				for(var i = 0, ilen = data.length; i < ilen; i++){
					data[i] = data[i][fields];
				}
			}
			if(data.length == 0){ 
				data = undefined ;
			}else if(!bool){
				data = data[0];
			}
			if(bool && memoryCheck && ! settings.hideCheckbox){    //单据列表时返回存储的数据。
				data = _this._memoryCurrentData();  
			}
			// console.log(data)
			return  data   ;  // 选中行的全部数据；
		}

		this.getAllData = function(){   //单据列表中除行号外所有字段&&数据
			var _this = this,
				data = [], 
				json = {};
			$('tbody tr', _this).each(function(){
				$('td[field][field != "rowNum"]', this).each(function(){
					json[$(this).attr('field')] = ($(this).attr('field') == 'Id' && $(':checkbox',this).length > 0) ? $(':checkbox',this).attr('value') : $(this).text();
					json['Id'] == '' && (json['Id'] = 0);
				})
				data.push(json);
				json={};
			})
			return data;
		}


		// ajax事件可选参数列表  
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