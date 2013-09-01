/** 
* $.fn.datebox 
* @extends jquery.1.7.1 
* @fileOverview 日期控件
* @author wangpf 
* @email wangpf@siss.com.cn
* @version 0.1 
* @date 2013-05-24 
* Copyright (c) 2013-2013 wangpf 
* @example 
*    $("#id").datebox()
@version 0.2 
@date 2013-07-12 
@ wul
新增时间戳的显示
{
	showTime : ture (默认显示)
}
*/ 
$.fn.datebox = function(options){

	var _this = this;

	/* Attributes */
	_this.options = $.extend( {}, $.fn.datebox.defaults, options );

	this.each(function(){
		init( this );
	});

	function init(target){
		
		var identify = Math.random();

		$(target).attr("data-vef", identify);

		if(_this.options.combo){
			/* create a combo and hide the target */
			createCombo(target);
			var comboWidth = parseInt($(target).next(".combo").css("width")),
			comboHeight = parseInt($(target).next(".combo").css("height")),
			comboArrow = $(target).next(".combo").find(".combo-arrow"),
			comboArrowWidth = parseInt(comboArrow.css("width"));
			$(target).next(".combo").children(".combo-text").css("width", comboWidth - comboArrowWidth + 2);
			$(target).next(".combo").find("."+_this.options.iconCls).on(_this.options.showEvent, showEventHandler);
			$(target).hide();
		}

		$(target).off(_this.options.showEvent).on(_this.options.showEvent, showEventHandler)

		if($.data(document.body, "datebox")){
			return;
		}

		// create the datebox panel
		var comboPanel = createPanel(target);
		$(comboPanel).wrapInner(
			'<div class="datebox-calendar-inner" >' +
				'<div class="calendar">' + 
					'<div class="calendar-header">' +
						'<div class="calendar-prevmonth"></div>' +
						'<div class="calendar-nextmonth"></div>' +
						'<div class="calendar-prevyear"></div>' +
						'<div class="calendar-nextyear"></div>' +
						'<div class="calendar-title">' +
							'<span>Aprial月2010</span>' +
						'</div>' +
					'</div>' +
					'<div class="calendar-body">' +
						'<div class="calendar-menu">' +
							'<div class="calendar-menu-year-inner">' +
								'<span class="calendar-menu-prev"></span>' +
								'<span><input class="calendar-menu-year" type="text"></input></span>' +
								'<span class="calendar-menu-next"></span>' +
							'</div>' +
							'<div class="calendar-menu-month-inner">' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="calendar-bottom">' +
						'<span id="dpTimeStr">时间:</span>' + 
						'<input value="" maxlength="2" class="t-hour">' +
						'<input  class="t-middle" value=":" readonly="readonly">' +
						'<input value="" maxlength="2" class="t-minute">' +
						'<input  class="t-middle" value=":" readonly="readonly">' +
						'<input value="" maxlength="2" class="t-second">' +
					'</div>' +
				'</div>' +
			'</div>'
		);
		// false == true ? $('.calendar-bottom', target).show() : $('.calendar-bottom', target).hide();
		// _this.options.showTime ? $('.calendar-bottom', target).show() : $('.calendar-bottom', target).hide();
		// $(comboPanel).find(".calendar").css("width", parseInt($(target).css("width")) -2 );
		// $(comboPanel).find('.calendar-title span').hover(
		// 	function(){$(this).addClass('calendar-menu-hover');},
		// 	function(){$(this).removeClass('calendar-menu-hover');}
		// ).click(function(){
		// 	var menu = $(comboPanel).find('.calendar-menu');
		// 	if (menu.is(':visible')){
		// 		menu.hide();
		// 	} else {
		// 		showSelectMenus(comboPanel);
		// 	}
		// });
		
		$('.calendar-prevmonth,.calendar-nextmonth,.calendar-prevyear,.calendar-nextyear', target).hover(
			function(){$(this).addClass('calendar-nav-hover');},
			function(){$(this).removeClass('calendar-nav-hover');}
		);
		$(comboPanel).find('.calendar-nextmonth').click(function(event){
			showMonth(comboPanel, 1);
			event.stopPropagation(); //阻止冒泡		
		});
		$(comboPanel).find('.calendar-prevmonth').click(function(event){
			showMonth(comboPanel, -1);
			event.stopPropagation(); //阻止冒泡		
		});
		$(comboPanel).find('.calendar-nextyear').click(function(event){
			showYear(comboPanel, 1);
			event.stopPropagation(); //阻止冒泡		
		});
		$(comboPanel).find('.calendar-prevyear').click(function(event){
			showYear(comboPanel, -1);
			event.stopPropagation(); //阻止冒泡		
		});
		
		show(comboPanel);
		
		$(document.body).off('click.datebox').on('click.datebox',function(){
			if($('.panel.datebox').length > 0){
				$('.panel.datebox').hide();
			}
		})

		$.data(document.body, "datebox", true);
	}
	
	function createCombo( target ){
		var combobox = $('<span class="combo datebox"><input type="text" class="combo-text"><span><span class="combo-arrow"></span></span><input type="hidden" class="combo-value" ></span>');
		var identify = $(target).attr("data-vef"),
		comboValue = $(target).val(),
		dateValue = "";
		if(comboValue){
			dateValue = comboValue;
		}
		combobox.find(".combo-text").attr("data-vef", identify);
		combobox.find(".combo-text").val(dateValue);
		combobox.find(".combo-value").attr("name", $(target).attr("name"));
		combobox.find(".combo-value").val(comboValue);
		$(target).attr("comboname", $(target).attr("name"));
		$(target).removeAttr("name");
		$(target).after(combobox[0]);
		$(".readonly").find(".combo-text").attr("disabled","disabled").attr("unselectable", "on");
		
		return combobox;
	}
	function createPanel( target ){
		var panel = $("<div class='combo-panel' ></div>"),
			identify = $(target).attr("data-vef");
		panel.addClass("panel-body");
		panel.attr("tabindex", 0);
		if($.browser.msie){
			panel.removeAttr("tabindex");
		}
		panel.css("width", _this.options.width - 2 );
		panel.on("blur",function(){
			var _this = this;
			/* in case of the click event for the combo-item */
			setTimeout(function(){
				$(_this).parent().hide();
			},100);
		});
		panel.appendTo("body");
		var panelWrapper = $("<div class='panel datebox'></div>");
		panelWrapper.attr("data-vef", identify);
		panelWrapper.css("width",  _this.options.width );
		panel.wrap( panelWrapper[0] );

		return panel;
	}
	/**
	 * show the calendar corresponding to the current month.
	 */
	function showMonth(target, delta){
		var opts = _this.options;
		opts.month += delta;
		if (opts.month > 12){
			opts.year++;
			opts.month = 1;
		} else if (opts.month < 1){
			opts.year--;
			opts.month = 12;
		}
		show(target);
		
		var menu = $(target).find('.calendar-menu-month-inner');
		menu.find('td.calendar-selected').removeClass('calendar-selected');
		menu.find('td:eq(' + (opts.month-1) + ')').addClass('calendar-selected');
	}
	
	/**
	 * show the calendar corresponding to the current year.
	 */
	function showYear(target, delta){
		var opts = _this.options;
		opts.year += delta;
		show(target);
		
		var menu = $(target).find('.calendar-menu-year');
		menu.val(opts.year);
		// log(menu)
	}
	
	/**
	 * show the select menu that can change year or month, if the menu is not be created then create it.
	 */
	function showSelectMenus(target){
		var opts = _this.options;
		$(target).find('.calendar-menu').show();
		
		if ($(target).find('.calendar-menu-month-inner').is(':empty')){
			$(target).find('.calendar-menu-month-inner').empty();
			var t = $('<table></table>').appendTo($(target).find('.calendar-menu-month-inner'));
			var idx = 0;
			for(var i=0; i<3; i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
			
			$(target).find('.calendar-menu-prev,.calendar-menu-next').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			);
			$(target).find('.calendar-menu-next').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val()) + 1);
				}
			});
			$(target).find('.calendar-menu-prev').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val() - 1));
				}
			});
			
			$(target).find('.calendar-menu-year').keypress(function(e){
				if (e.keyCode == 13){
					setDate();
				}
			});
			
			$(target).find('.calendar-menu-month').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			).click(function(){
				var menu = $(target).find('.calendar-menu');
				menu.find('.calendar-selected').removeClass('calendar-selected');
				$(this).addClass('calendar-selected');
				setDate();
			});
		}
		
		function setDate(){
			var menu = $(target).find('.calendar-menu');
			var year = menu.find('.calendar-menu-year').val();
			var month = menu.find('.calendar-selected').attr('abbr');
			if (!isNaN(year)){
				opts.year = parseInt(year);
				opts.month = parseInt(month);
				show(target);
			}
			menu.hide();
		}
		
		var body = $(target).find('.calendar-body');
		var sele = $(target).find('.calendar-menu');
		var seleYear = sele.find('.calendar-menu-year-inner');
		var seleMonth = sele.find('.calendar-menu-month-inner');
		
		seleYear.find('input').val(opts.year).focus();
		seleMonth.find('td.calendar-selected').removeClass('calendar-selected');
		seleMonth.find('td:eq('+(opts.month-1)+')').addClass('calendar-selected');
		
		sele._outerWidth(body._outerWidth());
		sele._outerHeight(body._outerHeight());
		seleMonth._outerHeight(sele.height() - seleYear._outerHeight());
	}
	

	/**
	 * get weeks data.
	 */
	function getWeeks(target, year, month){
		var opts = _this.options;
		var dates = [];
		var lastDay = new Date(year, month, 0).getDate();
		for(var i=1; i<=lastDay; i++) dates.push([year,month,i]);
		
		// group date by week
		var weeks = [], week = [];
		var memoDay = 0;
		while(dates.length > 0){
			var date = dates.shift();
			week.push(date);
			var day = new Date(date[0],date[1]-1,date[2]).getDay();
			if (memoDay == day){
				day = 0;
			} else if (day == (opts.firstDay==0 ? 7 : opts.firstDay) - 1){
				weeks.push(week);
				week = [];
			}
			memoDay = day;
		}
		if (week.length){
			weeks.push(week);
		}
		
		var firstWeek = weeks[0];
		if (firstWeek.length < 7){
			while(firstWeek.length < 7){
				var firstDate = firstWeek[0];
				var date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
				firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
		} else {
			var firstDate = firstWeek[0];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
				week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.unshift(week);
		}
		
		var lastWeek = weeks[weeks.length-1];
		while(lastWeek.length < 7){
			var lastDate = lastWeek[lastWeek.length-1];
			var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
			lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
		}
		if (weeks.length < 6){
			var lastDate = lastWeek[lastWeek.length-1];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
				week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.push(week);
		}
		
		return weeks;
	}
	
	/**
	 * show the calendar day.
	 */
	function show(target){
		var opts = _this.options;
		$(target).find('.calendar-title span').html( opts.year + '年' + opts.months[opts.month-1] + '月');
		
		var body = $(target).find('div.calendar-body');
		body.find('>table').remove();
		
		var t = $('<table cellspacing="0" cellpadding="0" border="0"><thead></thead><tbody></tbody></table>').prependTo(body);
		var tr = $('<tr></tr>').appendTo(t.find('thead'));
		for(var i=opts.firstDay; i<opts.weeks.length; i++){
			tr.append('<th>'+opts.weeks[i]+'</th>');
		}
		for(var i=0; i<opts.firstDay; i++){
			tr.append('<th>'+opts.weeks[i]+'</th>');
		}
		
		var weeks = getWeeks(target, opts.year, opts.month);
		for(var i=0; i<weeks.length; i++){
			var week = weeks[i];
			var tr = $('<tr></tr>').appendTo(t.find('tbody'));
			for(var j=0; j<week.length; j++){
				var day = week[j];
				$('<td class="calendar-day calendar-other-month"></td>').attr('abbr',day[0]+','+day[1]+','+day[2]).html(day[2]).appendTo(tr);
			}
		}
		t.find('td[abbr^="'+opts.year+','+opts.month+'"]').removeClass('calendar-other-month');
		
		var now = new Date();
		var today = now.getFullYear()+','+(now.getMonth()+1)+','+now.getDate();
		t.find('td[abbr="'+today+'"]').addClass('calendar-today');
		if (opts.current){
			t.find('.calendar-selected').removeClass('calendar-selected');
			var current = opts.current.getFullYear()+','+(opts.current.getMonth()+1)+','+opts.current.getDate();
			t.find('td[abbr="'+current+'"]').addClass('calendar-selected');
		}
		
		// calulate the saturday and sunday index
		var saIndex = 6 - opts.firstDay;
		var suIndex = saIndex + 1;
		if (saIndex >= 7) saIndex -= 7;
		if (suIndex >= 7) suIndex -= 7;
		t.find('tr').find('td:eq('+saIndex+')').addClass('calendar-saturday');
		t.find('tr').find('td:eq('+suIndex+')').addClass('calendar-sunday');
		
		t.find('td').hover(
			function(){$(this).addClass('calendar-hover');},
			function(){$(this).removeClass('calendar-hover');}
		);
		$('td',t).off('.show').on('click.show',function(event){
			t.find('.calendar-selected').removeClass('calendar-selected');
			$(this).addClass('calendar-selected');
			var parts = $(this).attr('abbr').split(',');
			opts.current = new Date(parts[0], parseInt(parts[1])-1, parts[2]);
			onCalendarSelect.call(target, opts.current, target);
			// event.stopPropagation();
		});
	}
	function showEventHandler (event){
		if($(this).attr("disabled") || $(this).parent().siblings("input").attr("disabled")){
			return ;
		}
		var offsetTop = $(this).offset().top,
		offsetLeft = $(this).offset().left,
		alignHeight = $(this).outerHeight();
		identify = $(this).attr("data-vef");
		if(_this.options.combo){
			offsetTop = $(this).parents(".combo").offset().top,
			offsetLeft = $(this).parents(".combo").offset().left,
			alignHeight = $(this).parents(".combo").outerHeight();
			identify = $(this).parents(".combo").children(".combo-text").attr("data-vef");
		}
		$(".panel.datebox").attr("data-vef", identify);
		$(".panel.datebox").css({
			"top": offsetTop + alignHeight ,
			"left": offsetLeft 
		});
		$(".panel.datebox").toggle();
		event.stopPropagation(); //阻止冒泡		

		if(_this.options.showEvent == "focus"){
			$(this).on("blur", function(){
				$(".panel[data-vef='"+identify+"']").hide();
			})
		}
		$("td").on('mousedown',function(event){  
            $(this).trigger("click");  
            $("td").off('mousedown');
        }); 

        //是否显示时间戳
        _this.options.showTime ? $('.calendar-bottom', '.panel.datebox').show() : $('.calendar-bottom', '.panel.datebox').hide();

        var date = new Date();
		$('.calendar-bottom .t-hour', '.panel.datebox').val(date.getHours());
		$('.calendar-bottom .t-minute', '.panel.datebox').val(date.getMinutes());
		$('.calendar-bottom .t-second', '.panel.datebox').val(date.getSeconds());

		// $(this).off(_this.options.showEvent);
	}
	function getTime(target){
		var result = '';
		$('.calendar-bottom :text' ,target).each(function(){
			result += $(this).val();
		})
		return result;
	}
	function onCalendarSelect (date, target){
		var value = formatter(date, target);
		var identify = $(this).parents(".panel").attr("data-vef");
		var $inputText = $("input[data-vef='"+identify+"']");
		$inputText.val(value);
		$(this).parents(".panel").hide();
		$inputText.focus()
			.trigger('change');

	}
	function formatter(date, target){
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		var result = y+'/'+m+'/'+d;
		if(_this.options.showTime){
			result += " "+getTime(target);
		}
		return result;
	}
	function newDate(str) { 
		str = $.trim(str).split(" ")[0].split('-'); 
		var date = new Date(); 
		date.setFullYear(str[0], str[1] - 1, str[2]); 
		date.setHours(0, 0, 0, 0); 
		return date; 
	} 
}

/**
* datebox default Attributes
* 
*/
$.fn.datebox.defaults = {
	width:180,
	firstDay:0,
	combo:false,   // identify if to overrid a new combo to beautify the original input 
	iconCls:"combo-arrow",
	weeks:['天','一','二','三','四','五','六'],
	months:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
	year:new Date().getFullYear(),
	month:new Date().getMonth()+1,
	current:new Date(),
	showEvent: "click",
	showTime : true
}