/** 
* $.fn.sheetForm 
* @extends jquery.1.7.1 
* @fileOverview 单据表单控件
* @extends plugin form 
* @author wangpf 
* @email wangpf@siss.com.cn
* @version 0.1 
* @date 2013-08-01
* Copyright (c) 2013-2013 wangpf 
* @example 
*    $("#formId").sheetForm()
*/ 
(function ($) {

$.fn.sheetForm = function (options) {
    /************** extends ***********/
    // extends proporties and methods from form plugin, variable defined by var is not extended.
    $.extend(true, $.fn.sheetForm, $.fn.form(options));

    var _this = this;   // reference to $.fn.sheetForm 

    /*------------------- attributes -------------------------*/
    // extend defaults 
    $.extend(true, this.defaults, {})

    /*------------------- public function ----------------------*/
    // extends from form

    /*-------------------private function----------------------*/
    // add new method to initEvents
    // initEvents will be executed during initalize(_init)
    $.extend(true, this.initEvents, {
        _sheetFormInit : function(sheetForm){
            /******* 单据表单初始化 *********/
            // 判断页面是否发生改变
            $(':input', sheetForm).live('change', function () {
                $(sheetForm).data('ischange', true);
            })
            // 判断单据是否已审核 
            if($('#Approver_Name').attr('approved')=='true'){
                $('input:not([readonly])', sheetForm).attr('disabled', 'disabled')
                $('.si-btn', sheetForm).click(function () { return false; })
                $('.si-sidebar a', sheetForm).hide();
            }
            // 已审核标示
            $('[approved="true"]', sheetForm).after('<div class="approve-seal"><span>已审核</span></div>');
            // 初始化单据 grid
            _this.sheetGrid = $('.si-edit-grid', sheetForm).editGrid();
            // 初始化单据 sidebar
            $('.si-sidebar .add', sheetForm).live('click', function () {
                _this.sheetGrid.addLine();
            })
            $('.si-sidebar .delete', sheetForm).live('click', function () {
                _this.sheetGrid.delLine();
            })
        },
        _tbarEventInit  : function(sheetForm){
            $('.si-btn:not(".disabled, [id], .query")', '.si-tbar').on('click.tbarEvent',function () {
                _this.doAction($(this).attr("class").split(' ').pop());
            });
            $('.si-btn.query:not(".disabled")', '.si-tbar').on('click',function () {
                _this.sheetGrid.query();
            });
            // 用户覆盖(override)原有的 action method
            var methodObj = {};
            for(var method in _this.methods){
                if(_this.settings[method]){
                    methodObj[method] = _this.settings[method];
                }
            }
            $.extend(true, _this.methods, methodObj);
        },
        _userDefInit : function(sheetForm){
            /******* 用户自定义初始化 *********/
            _this.settings.init && _this.settings.init(sheetForm); 
        }
    });
    this._pageModifyTip = function( target, option, assignUrl){
        if($(target).data('ischange')){
            $.message({ msg: '页面内容有修改,是否保存? 点击确定:保存,点击取消:不保存,或点击关闭不做任何处理...', type: 'confirms', fn: function (bool) {
               if (bool) {
                    _this.doAction('save',{
                        success: function(){
                            window.location.assign( assignUrl);
                        }
                    });
               }else{
                    window.location.assign( assignUrl );
               }
            }
            })
        }else{
            window.location.assign( assignUrl );
        }
    }

    /*------------------- action method ----------------------*/
    // override action method if possible(eg:save,create)
    // add new method approve, del 
    $.extend(true, this.methods, {
        save : function(target, option){
            var defaults = {
                data : {},
                beforeSend : function(){},
                global : false,
                success : function(){},
                complete : function(){
                    $(document.body).waitting(false);
                }
            };
            defaults.data = _this.getFormData(target);
            // 
            var sheetDetails = defaults.data[$('.si-edit-grid',target).attr('controller')];
            var delDetailsIds = [];
            if($('.si-edit-grid [id^=del][id$=Ids]', target).attr('value')){
                var arr = $('.si-edit-grid [id^=del][id$=Ids]', target).attr('value').split(',');
                for(var i = 0, ilen = arr.length; i < ilen; i++){
                    delDetailsIds.push({Id : arr[i]});
                }
            }
            defaults.data[$('.si-edit-grid',target).attr('controller')] = delDetailsIds.concat(sheetDetails);
            defaults.beforeSend = function(){
                // 用户自定义全局 调用前函数
                if(_this.settings.beforeSend && !_this.settings.beforeSend()){
                    return false;
                }
                // 用户扩展保存 调用前函数
                if(option && option.beforeSend && !option.beforeSend()){
                    return false;
                }
                // 单据明细数据校验
                if(sheetDetails && sheetDetails.length == 0){
                    $.message( { msg:"明细数据不能为空，请重新输入！", type:'warning' } )
                    return false;
                }
                $(document.body).waitting({bool : true, msg : '保存中...'});
            };
            defaults.success = function(data){
                if(data.status=='success'){
                    $(target).data('ischange', false); //清空标记
                    if($(target).attr('action').toLowerCase() == 'create'){
                        $('#Id', target).attr('value',data.data.Id);
                        $('#Code', target).attr('value',data.data.Code);
                        $(target).attr('action','Edit');
                        $('.si-tbar .disabled').removeClass('disabled');
                        // $('#barcodesLi', '.si-form').show();
                    }
                    //update明细数据Id
                    var details = data.data[$('.si-edit-grid[field]', target).attr('field')] ;
                    if(details){
                        for(var i = 0, ilen = details.length; i < ilen; i++){
                            for(var j = 0, jlen = $('.si-edit-grid[field] tbody tr', target).length; j < jlen; j++){
                                if( ! $('.si-edit-grid[field] tbody tr:eq('+j+') td[field="Id"]', target).text()  && $('.si-edit-grid[field] tbody tr:eq('+j+') td[field = "LineNum"]', target).text() == details[i]['LineNum']){
                                    $('.si-edit-grid[field] tbody tr:eq('+j+') td[field="Id"]', target).text(details[i].Id);
                                    $('.si-edit-grid[field] tbody tr:eq('+j+') td[field="ParentId"]', target).text(details[i].ParentId);
                                }
                            }
                        }
                        $('[id^=del][id$=Ids]', target).attr('value','');
                    }
                }
                $.message(data.message);   
                // 用户自定义回调函数
                _this.settings.success && _this.settings.success();
                // 扩展保存成功回调函数
                option && option.success && option.success();
            };
            var opts = $.extend(true, defaults ,option );
            /*去除关联字段*/
            _this._delCorrelationFields(opts.data);
            //-------------- validation start -----------
            if(!opts.data){
                return false;
            }
            if( !$(target).validate() ){
                return false;
            }

            //-------------- validation end -----------
            $.ajax({
                type : 'post',
                url : '/{0}/{1}'.format($(target).attr('controller'),$(target).attr('action')),
                data : JSON.stringify(opts.data),
                contentType : 'application/json',
                global : opts.global,
                beforeSend : opts.beforeSend,
                success : opts.success,
                complete : opts.complete
            })
        },
        create : function(target, option ) {
            _this._pageModifyTip( target, option, '/{0}/Create'.format($(target).attr('controller')) )
        },
        cancel : function(target, option ) {
            _this._pageModifyTip( target, option, '/{0}/'.format($(target).attr('controller')) )
        },
        approve : function( target, option ) {
            var defaults = {};
            defaults.success = function(data){
                // ToDo something here
                $.message(data.message);
                if(data.status == 'success'){  
                    $(target).data('ischange', false); //清空标记
                    if(new RegExp("create").test(window.location.pathname.toLowerCase())){
                        $('input:not([readonly])', target).attr('disabled', 'disabled');
                        $('.save,.approve,.query,.del,.scan,.print', '.si-tbar').addClass('disabled').click(function () { return false; })
                        $('.si-btn', target).click(function () { return false; })
                        $('.si-sidebar a', target).hide();
                        $('#Approver_Name').attr('approved',true);
                        $('#Approver_Name').after('<div class="approve-seal"><span>已审核</span></div>');
                    }else{
                        window.location.reload();
                    } 
                }   
            }   
            var opts = $.extend( {} , defaults , option);  
            $.message({ msg:'是否审核，请确认？' , type : 'confirm'  ,fn : function(bool){
                if(bool){   
                    $.ajax({
                        type : 'post'  ,
                        url : '/{0}/Approve'.format($(target).attr('controller')) ,  
                        // global: false, 
                        data : {Id : $('#Id', target).val()},                                
                        success : opts.success 
                    })    
                }
            }})
            return false;
        },
        del : function( target, option ) {
            var defaults = {};
            defaults.success = function(data){
                $(target).data('ischange', false); //清空标记
                $.message(data.message);
                if(data.status == 'success'){   
                    window.location.assign( '/{0}/Create'.format($(target).attr('controller')) );
                }   
            }   
            var opts = $.extend( {} , defaults , option);               
            $.message({ msg:'是否确定要删除单据？' , type : 'confirm'  ,fn : function(bool){
                if(bool){
                    $.ajax({
                        type : 'post'  ,
                        url : '/{0}/Delete'.format($(target).attr('controller')) ,    
                        // global : false,                           
                        data : {Ids : [$('#Id', target).val()]},                                
                        success : opts.success 
                    })      
                }
            }})
            return false;
        }
    })

    return this.each(function(){
        _this._init( this );   
    });

}

})(jQuery);