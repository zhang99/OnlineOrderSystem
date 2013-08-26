/** 
* $.fn.Form 
* @extends jquery.1.7.1 
* @fileOverview 表单控件
* @depends window、message、autoComplete
* @author wangpf 
* @email wangpf@siss.com.cn
* @version 0.1 
* @date 2013-05-24 
* Copyright (c) 2013-2013 wangpf 
* @example 
*    $("#formId").form()
*/ 
(function ($) {

$.fn.form = function (options) {
    var _this = this;

    /*------------------- attributes -------------------------*/
    this.defaults = {
        wrapper: '.field-inner',
        queryFields: 'Code,Name',
        calender :{
            ev : 'focus' ,   // 触发事件
            showTime : false   //显示时间 
        }
    }

    /*-------------------public function----------------------*/
    this.doAction = function( method, options ){
        return this.methods[method] && this.methods[method]( this.currentForm, options)
    }
    this.getFormData = function(target){   
        var fields = {},
        barcodes = [],
        delModelBarcodeIds = 'del{0}Ids'.format($('.si-grid[id]', target).attr('field'));
        $(':input[name][name != "Barcodes"][name != "Barcode"][name != "PicFileName"]', target).each(function() {
            fields[$(this).attr('name')] = $(this).attr('value');
        })

        if($('.si-grid[id] tbody :checkbox', target).length > 0 || $('#'+delModelBarcodeIds, target).attr('value')){
            var delBarcodeIds = [];
            if($('#'+delModelBarcodeIds, target).attr('value')){
                var arr = $('#'+delModelBarcodeIds, target).attr('value').split(',');
                for(var i = 0, ilen = arr.length; i < ilen; i++){
                    delBarcodeIds.push({Id : arr[i]});
                }
            }
            if($('.si-grid[id] tbody :checkbox', target).length > 0){
                barcodes = $('.si-grid[id]', target).grid().getAllData();
                for (var i = 0, ilen = barcodes.length; i< ilen; i++){

                    //加入关联controller Id ；eg：ProductId；
                    barcodes[i][$(target).attr('controller').substr(0,$(target).attr('controller').length-1).replace(/ies$/,'y') + 'Id'] = fields['Id'];
                }
            }
            fields[$('.si-grid[id]', target).attr('field')] = delBarcodeIds.concat(barcodes);
            delBarcodeIds = [];
        }
        //eg ProductBarcodes,由当前grid上field确定
        ! $('.upload-text', target).attr('value') && delete(fields['PicFileName']) ;

        // 明细数据 grid
        $('.si-edit-grid[field]', target).each(function(){
            var gridDetails = $(this).editGrid().getAllData();
            if(gridDetails.length == 0){
                $.message( { msg:"明细数据不能为空，请重新输入！", type:'warning' } )
                fields = null;
                return false;
            }
            var delDetailsIds = [];
            if($('[id^=del][id$=Ids]', target).attr('value')){
                var arr = $('[id^=del][id$=Ids]', target).attr('value').split(',');
                for(var i = 0, ilen = arr.length; i < ilen; i++){
                    delDetailsIds.push({Id : arr[i]});
                }
            }
            // 由当前grid 上 field 确定保存的明细数据 模型名
            fields[$(this).attr('field')] = delDetailsIds.concat(gridDetails);

        })
        return fields;
    }
    this.clean = function (target) {
        $(':input', target).each(function () {
            var t = this.type;
            if (t == 'text' || t == 'hidden' || t == 'password') {
                this.value = '';
            } else if (t == 'file') {
                var file = $(this);
                this.value = '';
                file.parents(".upload").siblings(".upload-img").empty()
                    .append("<img />");
                file.parents(".upload").siblings(".upload-img").children("img").attr("src", "/Images/form/no_image.jpg")
                    .on("click", function () {
                    $(this).siblings("a").trigger("click");
                });
            } else if (t == 'checkbox' || t == 'radio') {
                this.checked = false;
            }else if(t == 'textarea'){
                $(this).val('');
            }
        });
        $('.combobox', target).each(function () {
            $('.combo-text' , this).val($('.panel .combo-item' ,this).first().text());
            $('.combo-value' , this).val($('.panel .combo-item' ,this).first().attr('value'));
            $('.panel .combobox-item' , this).removeClass("combobox-item-selected")
                .first().addClass("combobox-item-selected");
        });
        $('.tab-box-item .si-grid', target).each(function(){
            $('tbody',this).empty();
            $('tbody',this).append('<tr><td colspan="3">没有任何数据.</td></tr>');
        })
    }

    /*-------------------private function----------------------*/
    this._init = function( elem ){

        _this.settings = $.extend({}, _this.defaults, options);

        _this.currentForm = elem;

        // return if already initialized.
        if ($(elem).data("form")) {
            return;
        }

        /****** 页签 *******/
        // 页签切换事件
        $(".form-tab-nav li", _this.currentForm).on('click',function() {
            $(this).siblings().removeClass("current");
            $(this).addClass("current")
            $(".form-tab-box .tab-box-item", _this.currentForm).hide();
            $(".form-tab-box .tab-box-item[tab={0}]".format( $(this).attr("targ") ), _this.currentForm).show();
        });
        var events = this.initEvents;  // 定义局部变量，防止在初始化的时候改变initEvents
        for(var initMethod in events){
            events[initMethod](elem);
        }
        // 用户自定义初始化函数
        _this.settings.init && _this.settings.init(elem);
        // grid initialize among form 
        $('.si-grid', _this.currentForm ).grid();

        $.data( elem, "form", this);

    }
    // 各初始化事件函数
    this.initEvents = {  
        _initSearchWidget : function( elem ){
            var searchField = $( ".field[controller]", elem );

            // 自动完成搜索功能
            $(".search-text", searchField).live('focus', function() {
                $(this).autoComplete();
            })

            // 弹出搜索窗口查询
            $(".search", searchField).live('click', function(){
                var hasTree = false;
                if($(this).parents(".field").attr("controller") == 'Products'){
                    hasTree = true;
                }
                _this._popWindow({
                    url   :  "/{0}/Query?isCheckHide=true".format( $(this).parents(".field").attr("controller") ),
                    query :  $(this).siblings(".search-text").val(),
                    hasTree : hasTree
                });
            });
        },
        _initComboWidget : function( elem ){
            $('.combobox .combo-arrow , .combobox .combo-text', elem ).on('click',function(event){    //点击显示与隐藏
                $('.combobox .panel', elem).not($(this).siblings('.panel')).hide();
                if($(this).siblings('.panel').css('display') == 'none'){
                    $('.panel, .auto-complete', elem).hide();
                    $(this).siblings('.panel').show();
                    $(this).siblings('.combo-text').focus();
                    event.stopPropagation();
                }else{
                    $(this).siblings('.panel').hide();
                    // $(this).siblings('.combo-text').blur();
                }
            })
            $('.panel .combobox-item' , elem ).on('click',function(){    //点击取值
                var $combo = $(this).parents('.panel').parent();
                $('.combo-value' , $combo).attr('value',$(this).attr('value'));
                $('.combo-text' , $combo).val($(this).text());
                $(this).parents('.panel').hide();
                $(this).parents('.panel').siblings('.combo-text').focus();
            })
            $('.panel .combobox-item' , elem ).on('mouseover',function(){    //移入选中
                $('.panel .combobox-item' , elem).removeClass('combobox-item-selected');
                $(this).addClass('combobox-item-selected');
            })
            $('.combobox .combo-text', elem ).on('keydown',function(event){   //键盘操作
                var $comboItem = $(this).siblings().find('.combobox-item'),
                    $comboValue = $(this).siblings('.combo-value'),
                    $curComboItem = $(this).siblings().find('.combobox-item-selected'),
                    index = $comboItem.index($curComboItem);
                switch (event.which){
                    case 40 :    // ↓   
                        if(index < ($comboItem.length - 1)){
                            $comboItem.removeClass('combobox-item-selected')
                                .eq(index+1).addClass('combobox-item-selected');
                            $comboValue.attr('value' , $comboItem.eq(index+1).attr('value'));
                            $(this).val($comboItem.eq(index+1).text());
                        }
                    break;
                    case 38 :    // ↑
                        if(index > 0){
                            $comboItem.removeClass('combobox-item-selected')
                                .eq(index-1).addClass('combobox-item-selected');
                            $comboValue.attr('value' , $comboItem.eq(index-1).attr('value'));
                            $(this).val($comboItem.eq(index-1).text());
                        }
                    break;
                    case 13 :    // enter
                        $(this).siblings('.panel').hide();
                    break;
                    default :
                    return false;
                }
            })

            $(document.body).on('click',function(){
                $('.combobox .panel', elem).hide(); 
            })
        },
        _initCalenderWidget : function( elem ){
            $('.datebox :text, [type="datebox"]', elem).live( _this.settings.calender.ev ,function(){
                var $this = $(this);
                $this.datebox({showTime : _this.settings.calender.showTime});
            });
        },
        _initUpload : function( elem ){
            $(".upload-box :file", elem).live("change", function () {
                $(this).siblings(".upload-text").val($(this).val().split('\\')[$(this).val().split('\\').length - 1]);
                _this._previewImage(this);
            });
        },
        _keyEventHandler : function(elem){
            window.setTimeout(function(){
                $(":input:visible", elem).not(".readonly, :disabled, textarea").each(function(i){
                    var _this = this;
                    $(this).live("keypress.eventHandler", function eventHandler(e){
                        if($('#si-message-box').css('display')=='block'){
                            return false;
                        }
                        var index = $(":input:visible", elem).not(".readonly, :disabled, textarea").index(this);
                        if (e.keyCode == 13) { // Enter
                            index  += 1;
                            if(!$(":input", elem).not(":hidden, .readonly, :disabled")[index]){
                                index = 0;
                            }
                            $(":input", elem).not(":hidden, .readonly, :disabled")[index].focus();
                        }
                    })
                })
            }, 10)
        }
    }
    // 各私有函数
    this._popWindow = function( options ){
        var opts = $.extend( {}, this.settings, options );
        $.window({
            title   :   opts.title,
            hasTree :   opts.hasTree,
            url     :   opts.url,
            async   :   true,
            type    :   'PUT',
            dataType:   'html',
            data    :   {   
                            queryFields : opts.queryFields,
                            query : opts.query
                        },
            success :   opts.success
        })
    }
    this._previewImage = function( file ){
        var div = $(file).parents(".upload").siblings(".upload-img"),
            maxWidth = parseInt(div.css("width")),
            maxHeight = parseInt(div.css("height")),
            img = div.children("img");
        if (typeof FileReader !== 'undefined') {
            var reader = new FileReader();
            reader.onload = function (evt) { img.attr("src", evt.target.result); }
            reader.readAsDataURL(file.files[0]);
        } else {
            var sFilter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="',
                src = file.value;
            if ($('.upload-img-header').length == 0) {
                var imgHeader = $("<div class='upload-img-header'></div>");
                imgHeader.on("click", function () {
                    $(this).parent().siblings(".upload").find("a").trigger("click");
                })
                div.empty();
                div.append(imgHeader);
            }
            var rect = _this._clacImgZoomParam(maxWidth, maxHeight, $(".upload-img-header").offsetWidth, $(".upload-img-header").offsetHeight);
            $(".upload-img-header").css({
                "position": "relative",
                "width": rect.width,
                "height": rect.height,
                "filter": sFilter + src + '")'
            });
        }
    }
    this._clacImgZoomParam = function (maxWidth, maxHeight, width, height) {
        /*
        * clacImgZoomParam - 等比率放大/缩小图片，避免图片失真
        * maxWidth:  目标最大宽度
        * maxHeight: 目标最大高度
        * width:     原始宽度
        * height:    原始高度
        */
        var param = { top: 0, left: 0, width: width, height: height };
        if (width > maxWidth || height > maxHeight) {
            rateWidth = width / maxWidth;
            rateHeight = height / maxHeight;

            if (rateWidth > rateHeight) {
                param.width = maxWidth;
                param.height = Math.round(height / rateWidth);
            } else {
                param.width = Math.round(width / rateHeight);
                param.height = maxHeight;
            }
        }

        param.left = Math.round((maxWidth - param.width) / 2);
        param.top = Math.round((maxHeight - param.height) / 2);
        return param;
    }
    this._delCorrelationFields = function(field){
        for(var i in field){
            if(i.indexOf('.') != -1){
                delete(field[i]);
            }
        }
        return field;
    }
    
    /*------------------- action method ----------------------*/
    this.methods = {
        save: function ( target, option) {
            var act,url,
            defaults = {
                data : {},
                beforeSend: function(){},
                success : function(){},
                complete : function(){},
                createAfterSave : false
            },
            formdata = _this.getFormData(target);
            defaults.data = $.extend(true, formdata, _this.settings.data);
            defaults.beforeSend = function(){
                // 用户自定义ajax调用前函数
                return _this.settings.beforeSend && _this.settings.beforeSend();
            };
            defaults.complete = function(){
                // 用户自定义ajax调用前函数
                return _this.settings.complete && _this.settings.complete();
            };
            defaults.success = function(data){
                if(typeof data == 'string'){
                    // 由于ie下提示下载，图片上传时错误返回json字符串；
                    if(/^{\d*\w\:|\,*}$/.test(data)){  
                        eval("data=" + data);
                    }
                }
                if(data.status=='success'){
                    if($(target).attr('action').toLowerCase() == 'create'){
                        if(opts.createAfterSave){
                            _this.clean(target);
                        }else{
                            $('#Id', target).attr('value',data.data.Id);
                            $(target).attr('action', 'Edit');
                        }
                    }else if($(target).attr('action').toLowerCase() == 'edit') {
                        if(opts.createAfterSave){
                            window.location.href="/{0}/Create".format($(target).attr('controller')); 
                            // return;
                       }else{
                            //update附加码Id
                            var barcodes = data.data[$('.si-grid[id]', target).attr('field')] ;
                            if(barcodes){
                                for(var i = 0, ilen = barcodes.length; i < ilen; i++){
                                    for(var j = 0, jlen = $('.si-grid[id] tbody tr', target).length; j < jlen; j++){
                                        if( ! $('.si-grid[id] tbody tr:eq('+j+') td :checkbox', target).attr('value')  && $('.si-grid[id] tbody tr:eq('+j+') td[field = "Barcode"]', target).text() == barcodes[i]['Barcode']){
                                            $('.si-grid[id] tbody tr:eq('+j+') td :checkbox', target).attr('value',  barcodes[i].Id);
                                        }
                                    }
                                }
                                $('#del{0}Ids'.format($('.si-grid[id]', target).attr('field')), target).attr('value','');
                            }
                       }
                    }
                }
                $.message(data.message);   
                // 用户自定义回调函数
                _this.settings.success && _this.settings.success();
            };
            opts = $.extend(true, defaults, option);
            act = opts.createAfterSave ? 'SaveAndCreate' : 'Save' ;
            act = "?act=" + act;
            url = '/{0}/{1}{2}'.format($(target).attr('controller'),$(target).attr('action'),act);

            /*去除关联字段*/
            _this._delCorrelationFields(opts.data);
            //-------------- validation -----------
            if( !$(target).validate() ){
                return false;
            }
            if(!opts.data){
                return false;
            }
            //-------------- validation -----------
            
            if($('.upload-box :file',target).val()){
                opts.data[$('.si-grid[id]', target).attr('field')] = JSON.stringify(opts.data[$('.si-grid[id]', target).attr('field')]);
                $.ajaxFileUpload({
                    url: url,
                    secureuri: false,
                    fileElementId: 'PicFileName',
                    data: opts.data,
                    // contentType : 'application/json',
                    dataType : 'text',
                    processData: false,
                    success: opts.success
                });
                // input:file 的onchange事件一次后失效失效，需重新生成一次（IE的安全性问题）
                $('.upload-box :file', target).after('<input type="file" name="PicFileName" id="PicFileName" >');    
                $('.upload-box :file:first', target).remove();
                
            }else{
                $.ajax({
                    type : 'post',
                    url : url,
                    data : JSON.stringify(opts.data),
                    contentType : 'application/json',
                    beforeSend : opts.beforeSend,
                    success : opts.success,
                    complete : opts.complete
                })
            }
        },
        saveIcreate: function ( target) {
            this.save(target, {createAfterSave : true});
        },
        create: function(target){
            window.location.assign( '/{0}/Create'.format($(target).attr('controller')) );
        },
        cancel: function ( target ) {
            window.location.assign('/{0}'.format($(target).attr("controller")));
        }
    }
    

    return this.each(function(){
        _this._init( this );      
    });
}

})(jQuery);