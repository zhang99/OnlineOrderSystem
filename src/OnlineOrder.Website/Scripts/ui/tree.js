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
			listForEdit : false,
			isCheckHide : false
		} ;
		var opts = $.extend({},defaults,options);
		var _this = this;

		this._init = function(elem){
			var $obj = $(elem);
			if($(elem).data('tree')){
				return;
			}
			
			// opened 收缩
			$('li button.opened', $obj).live('click', function(){   
		    	$(this).attr('class', 'open')
		    	$(this).siblings('ul').hide();
			})
			
			$('li button.open', $obj).live('click', function(){ 
				var _this = this;
				if(!$(_this).attr('unajaxable')){
					$.ajax({
						type : 'post',
						url : "/{0}".format($obj.attr('controller')),
						data : {parentId : $(this).parent().attr('id')},
						success : function(data){
							if(data.status == 'success'){
								if(data.data.length > 0){
									_createTree($(_this).parent(), data.data);
									$(_this).attr('class', 'opened');
									$(_this).attr('unajaxable', 'true');
								}
							}
						}
					})
				}else{
					$(_this).attr('class', 'opened')
					$(_this).siblings('ul').show();
				}
			})
			//链接点击发送请求刷新gird
			$('li a', $obj).live('click',function(){ 
				$('li a',$obj).removeClass('current');
				$(this).addClass('current');
				var grid = $('.si-grid:visible[Controller="'+ $obj.attr('relationship') +'"]').grid({listForEdit : opts.listForEdit});
				grid.doAction( 'refresh' , {data : {parentCode: $(this).html().getBracketInner(), isCheckHide : opts.isCheckHide}});

			})

			$(elem).data('tree',this);
		}

		function _createTree(target, nodes){			 //创建树
		    	var $ul = $('ul', target).length > 0 ? $('ul', target) : $('<ul></ul>');
			    for(var i = 0, ilen = nodes.length; i < ilen; i++ ){
			    	var isOpen = nodes[i].hasChild ? 'open' : 'unopen';
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
			for(var i = 0, ilen =$('li a', _this).length; i< ilen; i++ ){
				for(var j = 0, jlen = Ids.length; j < jlen; j++)
                if( $('li', _this).eq(i).attr('id') == Ids[j] ){
                    if( $('li', _this).eq(i).parent().children('li').length == 1){
                        $('li', _this).eq(i).parent().parent().children('button').removeClass().addClass('unopen');
                        $('li', _this).eq(i).parent().remove();
                    }else{
                        $('li', _this).eq(i).remove();
                    }
                }
            }
		}
		return this.each(function(){
			_this._init(this);
		})
	}
})(jQuery)