/*
grid-tree
author:wul
date:2013-6-6
*/

(function($){
	$.fn.tree = function(options){
		var defaults = {
				name : '',
				title : '' ,
				memoryCheck : false,   	//翻页时选中记录是否记录，默认不记录
				hideCheckbox : false	//列表中checkbox是否隐藏，默认显示
			},
			opts = $.extend({},defaults,options),
			_this = this;

		this._init = function(elem){
			var $obj = $(elem);
			if($(elem).data('tree')){
				return;
			}
			
			// opened 收缩
			$obj.delegate('li button.opened', 'click', function(){   
		    	$(this).attr('class', 'open')
		    		.siblings('ul').hide();
			})
			
			$obj.delegate('li button.open', 'click', function(){ 
				var _this = this;
				if(! $(_this).attr('unajaxable')){
					$.ajax({
						type : 'post',
						url : "/{0}".format($obj.attr('controller')),
						data : {parentId : $(this).parent().attr('id')},
						success : function(data){
							if(data.status == 'success' && data.data.length > 0){
								_createTree($(_this).parent(), data.data);
								$(_this).attr('class', 'opened');
								$(_this).attr('unajaxable', 'true');
							}
						}
					})
				}else{
					$(_this).attr('class', 'opened')
						.siblings('ul').show();
				}
			})
			//链接点击发送请求刷新gird
			$obj.delegate('li a', 'click',function(){ 
				if($(this).attr('class') && $(this).attr('class').indexOf('current') != -1){
					return false;
				}else{
					$('li a', $obj).removeClass('current');
					$(this).addClass('current');
					var grid = $('.si-grid:visible[Controller="'+ $obj.attr('relationship') +'"]').grid({memoryCheck : opts.memoryCheck});
					grid.doAction( 'refresh' , {data : {parentCode: $(this).html().getBracketInner(), hideCheckbox : opts.hideCheckbox, type : $(elem).attr('controller')}});
				}

			})

			$(elem).data('tree',this);
		}

		function _createTree(target, nodes){			 //创建树
	    	var $ul = $('ul', target).length > 0 ? $('ul', target) : $('<ul></ul>'),
	    		isOpen;
		    for(var i = 0, ilen = nodes.length; i < ilen; i++ ){
		    	isOpen = nodes[i].hasChild ? 'open' : 'unopen';
		    	$('<li id ="' + nodes[i].Id + '"><button class="' + isOpen + '"></button>' + '<a>' + '[' + nodes[i].Code + ']' + nodes[i].Name + '</a></li>').appendTo($ul)
		    }
		    $ul.css('display','block');
			$(target).append($ul);
		}

		this.getCode = function(){   // 选中节点Code 
			var parentCode = $.trim($('li a.current',_this).html()).getBracketInner();		      
		    if(parentCode == opts.name){
		    	parentCode = '';
		    }
		    return parentCode ;
		}	

		this.createNode = function(options){   //新增节点
			if($('li .current',_this).siblings('button').attr('unajaxable') ){
				if ( !$('li .current',_this).siblings('ul').length) {
					$('<ul><li id ="'+options.data.Id+'"><button class="unopen"></button>' + '<a>' + '[' + options.data.Code + ']' + options.data.Name + '</a></li></ul>').appendTo($('li .current',_this).parent());
					$('li .current',_this).siblings('button').addClass('open').removeClass('unopen');
				} else {
					$('<li id ="'+options.data.Id+'"><button class="unopen"></button>' + '<a>' + '[' + options.data.Code + ']' + options.data.Name + '</a></li>').appendTo($('li .current',_this).parent().children('ul'));
				};
			}else{
				$('li .current',_this).siblings('button').attr('class', 'open');
			}
		}	

		this.modifyNode = function(options){   //修改节点
			for(var i = 0, len = $('li',_this).length; i < len ; i++){
				if($('li', _this).eq(i).attr('id') == options.Id){
					$('li a',_this).eq(i).html('['+options.Code+']'+options.Name);
				}
			}	
		}	

		this.deleteNode = function(Ids){    //删除节点
			$('li', _this).each(function(){
				for(var i = 0, ilen = Ids.length; i < ilen; i++){
					if($(this).attr('id') == Ids[i]){
						if($(this).siblings().length == 0){
							$(this).parent().siblings('button').removeClass().addClass('unopen');
							$(this).parent().remove();
						}else{
							$(this).remove();
						}
					}
				}
			})
		}

		this.createTree = function(controller, name){
			var _this = this;
			$.ajax({
				type : 'post',
				url : "/{0}".format(controller),
				data : {parentId : '', pageSize :(Math.pow(2,31)-1)},
				success : function(data){
					if(data.status == 'success'){
						$(_this).attr('controller', controller);
						$('> li > a', _this).html('所有' + name);
						$('> li > ul', _this).remove();
						if(data.data.length > 0){
							_createTree($('li', _this), data.data);
						}
					}
				}
			})
		}

		return this.each(function(){
			_this._init(this);
		})
	}
})(jQuery)