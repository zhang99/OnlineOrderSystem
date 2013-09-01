/*
	适用于高级查询filter
	author:wul
	date:2013-8-7
	eg: $(elem).filter();
*/

(function($){
	$.fn.filters = function(options){
		var defaults = {},
			settings = $.extend({}, defaults, options),
			_this = this;
		this._init = function(elem){
			var $obj = $(elem),
				date = new Date(),
			 	day = date.getDate(),
	            weekDay = date.getDay(),
	            month = date.getMonth() + 1,
	            year = date.getFullYear(),
	            $dateBegin = $(':text[id *= "DateBegin"]', $obj),
	            $dateEnd = $(':text[id *= "DateEnd"]', $obj),
	            today = year +'/'+ month +'/'+ day;
	        $obj.slideUp(500, function(){
	        	$obj.siblings('ul').find('.adv').removeClass('adved');
	        });
			if($(elem).data('filter')){
				return;
			}

	        $('.today', $obj).click(function(){  //今天
	            $(':text[id *= "DateBegin"], :text[id *= "DateEnd"]', $obj).attr('value', today);
	        })

	        $('.yesterday', $obj).click(function(){  //昨天
	            var yesterday = getYesterday(day, month, year);
	            $(':text[id *= "DateBegin"], :text[id *= "DateEnd"]', $obj).attr('value', yesterday.year +'/'+ yesterday.month +'/'+ yesterday.day);
	        })

	        $('.thisweek', $obj).click(function(){  //本周
	            var week = getWeek(day, weekDay, month, year);
	            $dateBegin.attr('value', week.year +'/'+ week.month +'/'+ week.day);
	            $dateEnd.attr('value', today);
	        })

	        $('.lastweek', $obj).click(function(){   //上周
	            var week = getWeek(day, weekDay, month, year),  
	                yesterday = getYesterday(week.day, week.month, week.year),
	                yesterWeek = getWeek(yesterday.day, 6, yesterday.month, yesterday.year);
	            $dateBegin.attr('value', yesterWeek.year +'/'+ yesterWeek.month +'/'+ yesterWeek.day);
	            $dateEnd.attr('value', yesterday.year +'/'+ yesterday.month +'/'+ yesterday.day);
	        })

	        $('.thismonth', $obj).click(function(){   //本月
	            $dateBegin.attr('value', year +'/'+ month +'/1');
	            $dateEnd.attr('value', today);
	        })

	        $('.lastmonth', $obj).click(function(){   //上月
	            var yesterday = getYesterday(1, month, year);
	            $dateBegin.attr('value', yesterday.year +'/'+ yesterday.month +'/1');
	            $dateEnd.attr('value', yesterday.year +'/'+ yesterday.month +'/'+ yesterday.day);
	        })

	        $('.thisseason', $obj).click(function(){   //本季
	            $dateBegin.attr('value', year +'/'+ (month%3 == 0 ? (month - 2) : (Math.ceil(month/3) * 3 - 2)) +'/1');
	            $dateEnd.attr('value', today);
	        })

	        $('.lastseason', $obj).click(function(){   //上季
	            var yesterday = getYesterday(1, (month%3 == 0 ? (month - 2) : (Math.ceil(month/3) * 3 - 2)), year);
	            $dateBegin.attr('value', year +'/'+ (yesterday.month%3 == 0 ? (yesterday.month - 2) : (Math.ceil(yesterday.month/3) * 3 - 2)) +'/1');
	            $dateEnd.attr('value', yesterday.year +'/'+ yesterday.month +'/'+ yesterday.day);
	        })

	        $('.thisyear', $obj).click(function(){   //今年
	            $dateBegin.attr('value', year +'/1/1');
	            $dateEnd.attr('value', today);
	        })

	        function getWeek(vDay, vWeek, vMonth, vYear){   //本周
	            var newDay = vDay,
	                newMonth = vMonth,
	                newYear = vYear;
	            if(vDay - vWeek - 1 < 0){
	                if(vMonth == 1){
	                    newYear -= 1;
	                }
	                newDay = [31, 31, (vYear % 4 == 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30][vMonth-1] + vDay - vWeek;
	                newMonth =[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11][vMonth - 1];
	            }else{
	                newDay -= vWeek;
	            }
	            return {
	                day : newDay,
	                month : newMonth,
	                year : newYear
	            }
	        }

	        function getYesterday(vDay, vmonth, vYear){   //昨天
	            var newDay = vDay,
	                newMonth = vmonth,
	                newYear = vYear;
	            if(vDay == 1){
	                if(vmonth == 1){
	                    newYear -=  1;
	                }
	                newDay = [31, 31, (vYear % 4 == 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30][vmonth - 1];
	                newMonth =[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11][vmonth - 1];
	            }else{
	                newDay -=1; 
	            }
	            return {
	                day : newDay,
	                month : newMonth,
	                year : newYear
	            }
	        }

			$(':text[id *= "DateBegin"]', $obj).change(function(){
	            var dateEnd = $(':text[id *= "DateEnd"]', $obj).attr('value');
				$(this).parents('.field').find(':radio').attr('checked', false);
	            if(dateEnd != '' && (Date.parse($(this).attr('value')) - Date.parse(dateEnd))/3600000 >= 24){
	                $.message({msg : '开始日期不能大于结束日期', type : 'warning'});
	                $(this).attr('value', dateEnd);
	            }
	        })

	        $(':text[id *= "DateEnd"]', $obj).change(function(){
	            var dateBegin = $(':text[id *= "DateBegin"]', $obj).attr('value');
	            $(this).parents('.field').find(':radio').attr('checked', false);
	            if(dateBegin != '' && (Date.parse(dateBegin) - Date.parse($(this).attr('value')) )/3600000 >= 24){
	                $.message({msg : '结束日期不能小于开始日期', type : 'warning'});
	                $(this).attr('value', dateBegin);
	            }
	        })

			$(elem).data('filter',this);
		}

		this.validate = function(){
			var result = true;
			$(':input[name]', _this).each(function(){
				if(this.type == 'text'){
					if($(this).attr('name').indexOf('Begin') != -1 && $(this).attr('value') != ''){
						var field = $(this).attr('name').replace('Begin', '')
						if($(':input[name='+ field +'End]', _this).attr('value') == ''){
							$(_this).validateErrors([{id: $(this).parent('.field-inner').siblings('.field-inner').children(':text').attr('id'), msg : '自定义区间范围必须输入两个条件'}])
							result = false;
						}
					}else if($(this).attr('name').indexOf('End') != -1 && $(this).attr('value') != ''){
						if($(':input[name='+$(this).attr('name').replace('End', '') +'Begin]', _this).attr('value') == ''){
							$(_this).validateErrors([{id: $(this).parent('.field-inner').siblings('.field-inner').children(':text').attr('id'), msg : '自定义区间范围必须输入两个条件'}])
							result = false;
						}
					}
				}
			})
			return result;
		}

		/*取消*/
		this.cancel = function(){
			$(_this).slideUp(500, function(){
        		$(_this).siblings('ul').find('.adv').removeClass('adved');
			})
		}

		/*确认*/
		this.confirm = function(grid){
			var fields = [],
				o = {};
			if(! _this.validate()){
				return false;
			}
			$('.general-box :input[name]', _this).each(function(){
				var t = this.type,
					json = {};
				if(t == 'radio' && $(this).attr('checked') == 'checked' && $(this).attr('value') !== ''){
					json.Field = $(this).attr('name');
					json.Operator = $(this).parents('.field').attr('operator');
					json.Value = $(this).attr('value');
					fields.push(json)
				}else if(this.type == 'text' && $(this).attr('value') !== '' ){
					if($(this).attr('name').indexOf('Begin') != -1){
						var field = $(this).attr('name').replace('Begin', '');
						if(!o[field] ){
							o[field] = $(this).attr('value') +',';
						}else{
							var value = o[field];
							o[field] = $(this).attr('value') + value;
						}
					}else if($(this).attr('name').indexOf('End') != -1){
						var field = $(this).attr('name').replace('End', '');
						if(!o[field] ){
							o[field] = ',' + $(this).attr('value');
						}else{
							var value = o[field];
							o[field] = value + $(this).attr('value') ;
						}
					}else{
						json.Field = $(this).attr('name');
						json.Operator = $(this).parents('.field').attr('operator');
						json.Value = $(this).attr('value');
						fields.push(json)
					}
				}
			})
			for(var arr in o){
				if(o[arr] != ''){
					var fieldJson ={};
					fieldJson.Field = arr;
					fieldJson.Value = o[arr]; 
					fieldJson.Operator = 'Between';
					fields.push(fieldJson);
				}
			}
			
			grid.doAction('refresh', { data: { advancedQuery:JSON.stringify(fields)} });
		}

		this.doAction = function(action, grid){
			switch (action){
				case 'confirm' :
					_this.confirm(grid);
					break;
				case 'cancel' :
					_this.cancel();
					break;
				defaults:
					break;
			}
		}

		return this.each(function(){
			_this._init(this);
		})
	}
})(jQuery)