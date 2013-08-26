/*
editGrid
author:wul
date:2013-6-18
*/

(function($){
	$.fn.editGrid = function(options){	

		var defaults={
			toFixed : 4 	// 小数点后有效位数
		};

		var options = $.extend({} , defaults , options);

		var _this =this;
		
		this._init = function (elem) {		
			var $editGrid = $(elem);
			var _this = this;
			if($(elem).data('editGrid')){
				return ;
			}

			var trHtml = $('tbody tr',_this).last();

			$(elem).data('trHtml',trHtml);

			// _this._total();

			// input keydown
			$('tbody :input',$editGrid).die('keydown.editGrid').live('keydown.editGrid',function keyHandler(event){
				var row = parseInt($('tbody tr',$editGrid).length);                  //总行数
				var col = parseInt($('thead tr th',$editGrid).length);               //总列数
				var rowCurrent = parseInt($(this).parent().parent().index());   //当前行  rowCurrent.max <= row;
				var colCurrent =parseInt($(this).parent().index());             //当前列  colCurrent.max <= col;
				var $input = $('tbody :input ', $editGrid);
				var index = $input.index($(this));
				switch (event.which) {
					case 37 :   // ←   当前input前还有input；
						if(index > 0){					
							$input.eq(index-1).focus();
						}
						return false;					
						break;
					case 38 :    // ↑	当前行不为第一行；	
						if( !( this.nodeName == 'SELECT') && rowCurrent > 0){			  //非select取消默认事件。			
								$('tbody tr',$editGrid).eq(rowCurrent-1).children('td').eq(colCurrent).children(':input').focus();
						}	
						event.stopPropagation(); //阻止冒泡				
						break;
					case 39 :    // →   当前input后还有input
						if(index < $input.length -1){
							$input.eq(index+1).focus();
						}
						return false;
						break;
					case 40 :    // ↓       当前不为最后一列；      
						if( !(this.nodeName == 'SELECT') && rowCurrent < row-1 ){   //非select取消默认事件。
								$('tbody tr',$editGrid).eq(rowCurrent+1).children('td').eq(colCurrent).children(':input').focus();
						}	
						event.stopPropagation(); //阻止冒泡				
						break;
					case 13 :   //enter	
						// 输入值不为空且值发生改变
						if( $(this).parent().attr('selectable') === 'true' && $(this).val() 
							&& ( !$(this).parent().siblings('[reliable]').text() || $(this).data('origiValue')!= $(this).val() )){   //加载产品数据 treegrid；
							var editData = _this.getEditData();
							for(var i = 0; i < editData.length; i++){
								if($(this).parent().siblings('[field="LineNum"]').text() == editData[i]['LineNum']){
									continue;
								}
								if($(this).val()== editData[i][$(this).parent().attr('field')]){
									$(document.body).data('lastFocusElem', this);
									$.message({type:'info', msg:'编码重复，请重新选择！', bind:[$('tbody :input',$editGrid), 'keydown', keyHandler]})
									$(this).val("");
									return false;
								}
							}
							_this.searchQuery({
								grid: elem,
								searchText: this,
								bind:[$('tbody :input',$editGrid), 'keydown.editGrid', keyHandler]
							});	
						}
						event.stopPropagation(); //阻止冒泡		
						break;
					default:
						break;
				}  
			})
			//input  focus
			$('tbody tr td :input', $editGrid).die('focus').live('focus',function(){  
				$('tbody tr td :input' , $editGrid).removeClass('focus');
				$(this).addClass('focus').select();
				$('tbody tr' , $editGrid).removeClass('current');
				$(this).parents('tr').addClass('current');
			})
			$('tbody :input',$editGrid).eq(0).trigger('focus');

			$('.si-wind .wind-title span').live('click',function(){
				$(document.body).unbind('keydown');
			})

			//input blur
			$('tbody :input' , $editGrid).die('blur').live('blur',function(){  
				var colCurrent =parseInt($(this).parent().index());    
				var rowCurrent = parseInt($(this).parent().parent().index());
				var $amtTd = $('tbody tr',$editGrid).eq(rowCurrent).children('td[field=Amt]');
				if($(this).parent().attr('field') == 'LargeQty'|| $(this).parent().attr('field') ==  'Qty'){
					if($(this).val() != ''){
						var value = parseFloat($(this).val()).toFixed(defaults.toFixed);
						$('tbody tr',$editGrid).eq(rowCurrent).children('td[field=LargeQty] , td[field=Qty]').children(':input').val(value);
						var validPrice = $(this).parent().parent().children('td[field=ValidPrice]').children(':input').val();
						$amtTd.text(!(value * parseFloat(validPrice))?'0.0000':(value * parseFloat(validPrice.replace(/,/,''))).toFixed(defaults.toFixed));
						_this._total();
					}
				}else if($(this).parent().attr('field') == 'ValidPrice'){
					if($(this).val() != ''){
						value = parseFloat($(this).val().replace(/,/,''));
						if(value != value){
							value = 0;
						}
						var qty = $('tbody tr',$editGrid).eq(rowCurrent).children('td[field=LargeQty]').children(':input').val();
						$amtTd.text((value * qty).toFixed(defaults.toFixed));
						_this._total();
					}
				}
				// blur事件 更新可回车查询域的原始值
				if($(this).parent().attr('selectable')){
					$(this).data('origiValue', $(this).val());
				}
			})

			// tr click
			$('tbody tr', $editGrid).live('click',function(){
				$('tbody tr', $editGrid).removeClass('current');
				$(this).addClass('current');
			})
			
			//可搜索td域
			$('td .search', $editGrid).live('click',function(){
				_this.searchQuery( {
					grid: elem,
					searchText: $(this).siblings('.search-text'),
					searchBtn: this
				});
			})
			// 可回车查询的域 保存原始值
			$('td[selectable] input', $editGrid).each(function(){
				$(this).data('origiValue', $(this).val());
			})

			if($('.table-head', _this).length > 0){
				var headTop = $('.table-head', _this).offset().top;
			}
			$(window).on('scroll', function(){
				if( $editGrid.parents('.si-wind').length == 0 && headTop < $(window).scrollTop()){
	                $('.table-head', $editGrid).css({'position' : 'fixed', 'fixed' : 0, 'z-index' : 2});
	                $editGrid.css('position', 'relative');
	            }else{
	                $('.table-head', $editGrid).css({'position' : 'static', 'top' : 0, 'z-index' : 1})
	            }
			})
			
			_this._innerScroll();
			$editGrid.on('ajaxComplete', function(){
				_this._innerScroll();
			})

			$(elem).data('editGrid' , this)
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
		//获得下一个焦点
		this.focusNext = function(target){
			var $input = $('tbody :text ', _this),
			index = $input.index($(target));
			if(index+1 < $input.length ){
				$input.eq(index+1).focus();
			}
		}
		this.focusPrevTr = function(target){
			var $tr = $('tbody tr ', _this),
			index = $tr.index(target);
			if(index > 0 ){
				$tr.eq(index-1).find('td :text:first').focus();
			}
		}
		//搜索查询
		this.searchQuery = function( options ){
			var target = options.searchText,
			grid = options.grid;
			if($(target).data('onQuery')){
				return;
			}
			if(_this._validate.vendorId()){
				$.message({type:'info',msg:'供应商不能为空！',bind:options.bind||[]});
				return false;
			}
			if(!( $(target).val() || options.searchBtn )){
				_this.focusNext(target);
				return false;
			}
			$(target).blur();	
			$(target).data('onQuery', true);
			$.ajax({
				type : 'put' ,
				url : '/Products/Query?isCheckHide=true' ,
				data : { queryFields : 'Code', query :  $(target).val() } ,
				global : false,
				success : function(data){
					$.window({
						'title':'选择商品',
						hasTree : true,
						fillText: data
					})
					var t = setInterval(function(){
						if($('#si-mask').css('display')=='block'){
							$(target).data('onQuery', false);
							clearInterval(t);
						}
					},50)
					//此处需处理唯一数据情况，待讨论返回数据格式；
					var gridTr = $('.si-wind .si-grid[controller=Products] tbody tr');  //参照老系统，多种类别是应根据下拉框对应的controller去匹配；
					gridTr.removeClass('selected');   
					gridTr.eq(0).addClass('selected');
					var data = $('.si-grid[controller=Products]').grid().getData(true);
					if($(':checkbox', gridTr).length == 1 && !options.searchBtn){  // 仅有一条数据，直接赋值 不弹出窗口
						_this._dataInherits({
							target: target,
							data: data,
							trHtml: $(grid).data('trHtml')
						});
						_this.focusNext(target);
						return false;
					}
					gridTr.die('click.editGrid').live('click.editGrid', function searchQueryClick(){
						data = $('.si-grid[controller=Products]').grid().getData(true);
						_this._dataInherits({
							target: target,
							data: data,
							trHtml: $(grid).data('trHtml'),
							bind:[gridTr, 'click', searchQueryClick]
						});
						gridTr.die('.editGrid', searchQueryClick);
						target = undefined;
						return false;
					})  
					var trindex = 0;  
					$(document.body).off('keydown.searchQuery').on('keydown.searchQuery',function searchQuery(event){  
						var gridTr = $('.si-wind .si-grid[controller=Products] tbody tr');
						if($('.selected', '.si-wind .si-grid[controller=Products]').length == 0){
							trindex = -1;
						}
						//不足10条记录时也最好返回十条记录，不足条按空数据处理,否则开始选择第10条记录，之后变成5条，上下左右则对应不上；
						switch (event.which){
							case 38 :    // ↑	
								if(trindex > 0){
									trindex--;
									gridTr.removeClass('selected');
									gridTr.eq(trindex).addClass('selected');
								}
								return false;
								break;
							case 40 :    // ↓ 										
								if(trindex < gridTr.length-1){
									trindex++;
									gridTr.removeClass('selected');
									gridTr.eq(trindex).addClass('selected');
								}
								return false;
								break;
							case 13 :  //enter		
								var data = $('.si-grid[controller=Products]').grid().getData(true);
								_this._dataInherits({
									target: target,
									data: data,
									trHtml: $(grid).data('trHtml'),
									bind:[document.body, 'keydown', searchQuery]

								});
								break;
							case 27:   // Esc
								$.window('close');
								break;
							default:
								break;
						}									
					})
				}
			})
		}


		/*数据验证*/
		this._validate = {
			productId : function(options){   //options为用户输入文本域的内容；
				// var form = $('.si-form').form();
				var field = decodeURIComponent($('.si-form').serialize()); 
				$.ajax({
					type : 'post' ,
					url : '/{0}/{1}'.format($(_this).attr('controller'),$(_this).attr('action')) ,
					data : {parentId : options , VendorId : field.VendorId , code : $('.title-name span[field=Code]').text()} ,
					success : function(data){
						if(data.status == 'success'){
							return true;
						}else{
							$.message(data.Message);
						}
					}
				})
			} ,
			vendorId : function(){
				var field = decodeURIComponent($('.si-form').serialize()).toJson(); 
				return field.VendorId == '';
			},
			isZero : function(fields){
				var result = '商品\r\r[',
					field = fields || 'LargeQty',
            		hasZero = false;
				$('tbody tr td', _this).each(function(){
					switch ($(this).attr('field')){
						case field:
							if(/^(\s*|0|0{0,1}\.0*)$/.test($(this).children(':text').val()) && $(this).siblings('[field="Code"]').children(':text').val() != ''){
								result += $(this).siblings('[field="Code"]').children(':text').val() + ',';
								hasZero = true;
							}
						break;
					}
				})
	            result = result.substr(0,result.length-1)
	            result +=']\r\n数量为零，请确认是否继续？';
	            return {codes : result, hasZero : hasZero} ;	
			},
			priceWarning : function(fields){
				var result = '商品\r\r[',
					field = fields || 'ValidPrice',
            		hasZero = false;
				$('tbody tr td', _this).each(function(){
					switch ($(this).attr('field')){
						case field:
							if(parseFloat($(this).children(':text').val()) > parseFloat($(this).siblings('[field="SalePrice"]').text())){
								result += $(this).siblings('[field="Code"]').children(':text').val() + ',';
								hasZero = true;
							}
						break;
					}
				})	
	            result = result.substr(0,result.length-1)
	            result +=']\r\n进货价大于售价，请确认是否继续？';
	            return {codes : result, hasZero : hasZero} ;	
			}
		}
/************ wangpf 20130722 start line ****************/
		/*数据的有效继承*/
		this._dataInherits = function(options){
			// $(document.body).unbind('keydown');
			
			var _this = this,
			inheritData = [],  //有效可继承的商品数据；
			arrData = [],     //商品编码
			editProductId = [],  //商品Id
			editData = _this.getEditData() || [];   //已编辑的商品数据；

			if(!options.data){
				return;
			}
			for(var i = 0 , len = options.data.length ; i < len ; i++){
				if(options.data[i].Code == ''){
					$.message({type:'info',msg:'请选择有效记录。'});
					return;
				}else{
					arrData.push(options.data[i].Id);
				}
			}
			for( var i = 0 , len = editData.length ; i < len ; i++ ){
				// 通过 enter 弹出窗口
				if(options.target && editData[i].ProductId == $(options.target).parent().siblings('td[field="ProductId"]').text()){
					continue;
				}
				editProductId.push(editData[i].ProductId)
			}
			var sameVar = arrData.getSameVar(arrData,editProductId);   //重复商品编码；
			if(options.target ){
				if(sameVar.length == 1 && arrData.length == 1){
					$.message({type:'info', msg:'编码重复，请重新选择！', bind:options.bind||[]})
					return;
				}
			}else{
				for( var j = 0 , jlen = sameVar.length ; j < jlen ; j++){
					for(var i = 0 ; i < options.data.length ; i++){
						if( options.data[i].Id == sameVar[j]){
							options.data.splice(i ,1 );
						}
					}
				}
			}
			for( var i = 0 ;i < options.data.length ; i++){
				var inheritJson = {};
				$('tbody td[equalTo]', _this).each(function(){
					inheritJson[$(this).attr('field')] = options.data[i][$(this).attr('equalTo')];
				})
				$('tbody td[issum]', _this).each(function(){
					if(!options.data[i][$(this).attr('field')]){
						options.data[i][$(this).attr('field')] = new Number("0").toFixed(defaults.toFixed)
					}
				})
				inheritJson['ProductId'] = options.data[i].Id;
				inheritJson['ParentId'] = $('#Id').val()?$('#Id').val():0;
				inheritData[i] = $.extend( {} ,options.data[i] , inheritJson);
			}
			// 通过 enter 弹出窗口
			if(options.target){
				if( $(options.target).parents('tr').index() == $('tbody tr',_this).length - 1 ){
					_this.getEmptyCloneOf($('tbody tr',_this).last()).appendTo($('tbody',_this))
				}
				$('td', $(options.target).parents('tr')).each(function(){
					if($(this).attr('field') != 'Id'){
						var inheritValue = inheritData[0][$(this).attr('field')];
						if(/^￥/.test(inheritValue)){
							inheritValue = inheritValue.replace(/^￥/, '');
						}
						if($(this).children(":text").length > 0){
							$(this).children(":text").val( inheritValue );
						}else{
							$(this).html( inheritValue );
						}
					}
				})
				$(options.target).focus();
			}else{
				var trLength = $('tbody tr',_this).length;
				$('tbody tr',_this).each(function(i){
					if(i < trLength-1 && $('td[reliable]', this).length > 0 
							&& !$('td[reliable]', this).text())
						$(this).remove();
				})
				if(inheritData.length > ( $('tbody tr',_this).length - editData.length - 1)){
					for( var i = 0 , ilen = (inheritData.length + editData.length + 1 - $('tbody tr',_this).length) ; i < ilen ; i++){
						_this.getEmptyCloneOf($('tbody tr',_this).last()).appendTo($('tbody',_this))
					}
				}
				for(var i = 0; i < inheritData.length; i++){
					$('tbody tr:eq({0}) td'.format(editData.length+i), _this).each(function(){
						if($(this).attr('field') != 'Id'){
							var inheritValue = inheritData[i][$(this).attr('field')];
							if(/^￥/.test(inheritValue)){
								inheritValue = inheritValue.replace(/^￥/, '');
							}
							if($(this).children(":text").length > 0){
								$(this).children(":text").val( inheritValue );
							}else{
								$(this).html( inheritValue );
							}
						}
					})
				}
				$('tbody tr:eq({0}) :text:first'.format(inheritData.length+editData.length), _this).focus().addClass('focus'); //获得焦点
			}
			_this.refreshRownum();
			$('tbody tr',_this).off('.editGrid');
			$.window('close');
		}

/************ wangpf 20130722 end line ******************/

		/*总计*/
		this._total = function(){
			var $sumTds = $('tfoot td[isSum="true"]', _this);
			for(var i = 0 , ilen = $sumTds.length; i < ilen ; i++){
				var arr = [];
				$('tbody tr td[field={0}]'.format($sumTds.eq(i).attr('field')), _this).each(function(){
					var value = $(this).children().length > 0  ? $(this).children().val()  : $(this).text();
					value && arr.push( value );
				})
				$sumTds.eq(i).text(parseFloat(arr.total()).toFixed(defaults.toFixed));
			}
		}
		
		//若有为真options 则返回{}，否则返回[{}...];
		this.getEditData= function (options){   //已编辑的订单数据
			var editData=[];
			for(var i = 0 , len = $('tbody tr',_this).length; i < len ; i++){
				var json={};
				if(!$('td[field="Code"]', $('tbody tr',_this).eq(i)).children(':text').val()){
					continue;
				}
				if( $('td[reliable]', $('tbody tr',_this).eq(i)).length > 0 
						&& !$('td[reliable]', $('tbody tr',_this).eq(i)).text() ){
					continue;
				}
				for(var j= 0; j < $('thead tr th',_this).length ; j++){
					if($('thead tr th',_this).eq(j).attr('field')){
						if( $('tbody tr',_this).eq(i).find('td').eq(j).children().val()){							
							json [$('thead tr th',_this).eq(j).attr('field')] = $('tbody tr',_this).eq(i).find('td').eq(j).children().val() ;
						}else{
							json [$('thead tr th',_this).eq(j).attr('field')] =  $('tbody tr',_this).eq(i).find('td').eq(j).text();
						}
					}
				}
				editData.push(json);	
			}
			if(options){
				editData = editData[0];
			}
			return editData;
		}

//-- wangpf 20130719 ------------- start line --------------------------//
		/*新增*/
		this.create = function(){
			window.location = 'Create';
		}
//-- wangpf 20130719 ------------- end line ----------------------------//

		/*保存*/
		this.save = function(){
			if(_this._validate.vendorId()){
				$.message({type:'info',msg:'请选择供应商。'})
				return false;
			}
			$.ajax({
				type :'post' ,
				url : '/{0}/Save'.format($(_this).attr('controller')) ,
				data : { editData : _this.getEditData()},
				success : function(data){
					$.message(data.Message);
				}
			})
		}

		/*选择商品*/
		this.query = function(options){
			if(_this._validate.vendorId()){
				$.message({type:'info',msg:'请选择供应商。'})
				return false;
			}
			var defaults = {
				data : { queryFields:'Code', query:''},
				success : function(data){
					// $.window({'title':'选择商品','fillText': data});
				}
			}
			var opts = $.extend({} , defaults , options)
			$.window({
				'title':'选择商品',
				hasTree : true,
				async : true ,
				type : 'put' ,
				url : '/Products/Query' ,
				data : opts.data ,
				success : opts.success
			})
		}

		/*商品确认选择*/
		this.confirm = function(){
			var data = $('.si-grid[controller=Products]').grid().getData(true, {listForEdit : true});
			this._dataInherits({
				data : data,
				trHtml : $(_this).data('trHtml')
			});
		}

		/*取消选择*/
		this.cancel = function(){
			$(document.body).unbind('keydown');
			$.window('close', this);
		}

		/*新增一行*/
		this.addLine = function(){
			this.getEmptyCloneOf($(this).data('trHtml')).appendTo($('tbody',_this))
			$('tbody tr td .focus').trigger('focus');
			_this.refreshRownum();
			return false;
		}
		/*删除一行*/
		this.delLine = function(){
			var delTrs = $('tbody tr.current',_this);
			if($('tbody tr',_this).length == 1){
				$.message({type:'warning', msg:'明细最少有一条记录。'});
				return; 
			}else{
	            if (delTrs.length == 0) {
	                $.message("请选择要删除的数据！");
	                return;
	            }
	            if( $('td[reliable]', delTrs).text() && $('td[field="Id"]', delTrs).text()){
	            	$.message( { type:'confirm', msg:'是否确认删除？', fn: function(retVal){
	            		if(retVal){
				            delLine();
	            		}
	            	}});
	            }else{
	            	delLine();
	            }

			}
			function delLine(){
				var delGridModelIds = 'del{0}Ids'.format($(_this).attr('controller'))
				if($('#'+delGridModelIds, _this).length == 0){
					$('<input type="hidden">').attr('id', delGridModelIds).appendTo(_this);
				}
				var delIds = $('#'+delGridModelIds, _this).val();
				if($('td[field="Id"]', delTrs).text()){
		            if(delIds){
			            $('[id^="del"][id$="Ids"]', _this).val( 
			            	'{0},{1}'.format(delIds, $('td[field="Id"]', delTrs).text()) );
		            }else{
		            	$('[id^="del"][id$="Ids"]', _this).val( 
			            	'{0}'.format( $('td[field="Id"]', delTrs).text()) );
		            }
	            }
				delTrs.index() == $('tbody tr',_this).length-1 ?
					_this.focusPrevTr( delTrs ) : _this.focusNext( $('td :text:last', delTrs) )
	            delTrs.remove();
	            _this.refreshRownum();
			}
		}
		/*更新行号*/
		this.refreshRownum = function(){
			$('tbody tr td[field="LineNum"]', this).each(function(i){
				$(this).text( i+1 );
			})
		}
/******************* wangpf 20130721 start line **********************/
		/*单据列表中除行号外所有字段&&数据*/
		this.getAllData = function(){   
			var gridDetails = [], json = {},
			// 确定grid的关键域（不可为空, 为空则不取该行数据）
            keyField = $('thead tr th[reliable]', this).attr('field');
            
            $('tbody tr', this).each(function(){
                $('td[field][field != "rowNum"]',this).each(function(){
                	if( $(this).attr('field')== keyField  && !$(this).text() ){
                		json = {};
                		return false;
                	}
                    json[$(this).attr('field')] = ($(this).children(":text").val() || $(this).text());
                    if(json['Id'] == ''){
                        json['Id'] = 0;
                    }
                })
                if(keyField){
                	if( json[keyField] ){
		                gridDetails.push(json);
		                json={};
                	}
                }else{
                	 gridDetails.push(json);
	                json={};
                }
            })
            return gridDetails;
		}
		/*清空目标中的数据*/
		this.getEmptyCloneOf = function(target){
			var clone = $(target).clone(true)
			$('td', clone).each(function(){
				if($('input', this).length > 0){
					$(':input', this).each(function () {
			            var t = this.type;
			            if (t == 'text' || t == 'hidden' ) {
			                $(this).attr('value','');
			            } 
			        });
				}else{
					$(this).html('');
				}
			})
	        return clone;
		}

/******************* wangpf 20130721 end line **********************/

		return this.each(function(){
			_this._init(this);

		})			
	}

})(jQuery);