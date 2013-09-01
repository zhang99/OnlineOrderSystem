$.fn.validate = function( options ){

    var validator = $.data(this[0], 'validator');
    // check if a validator for this form was already created
    if ( !validator ) {
        validator = new $.validator( this[0], options );
        $.data(this[0], 'validator', validator);
    }

    if ( validator.form() ) {
        return true;
    } else {
        validator.focusInvalid();
        return false;
    }

}
$.fn.validateDelegate = function(delegate, type, handler) {
    return this.on(type, function(event) {
        var target = $(event.target);
        if (target.is(delegate)) {
            return handler.apply(target, arguments);
        }
    });
}
$.fn.validateErrors = function( jsonArr ){
    var validator = $.data(this[0], 'validator');
    // check if a validator for this form was already created
    if ( !validator ) {
        validator = new $.validator( this[0] );
        $.data(this[0], 'validator', validator);
    }
    for(var i = 0; i < jsonArr.length; i++){
        var json = jsonArr[i];
        validator.addTip( $("#{0},[name={0}]".format(json.id))[0], json.msg );
    }

}

// constructor for validator
$.validator = function( form , options ) {
    this.settings = $.extend( true, {}, $.validator.defaults, options );
    this.currentForm = form;
    this.init();
};
$.validator.format = function(source, params) {
    if ( arguments.length == 1 )
        return function() {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.validator.format.apply( this, args );
        };
    if ( arguments.length > 2 && params.constructor != Array  ) {
        params = $.makeArray(arguments).slice(1);
    }
    if ( params.constructor != Array ) {
        params = [ params ];
    }
    $.each(params, function(i, n) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
}

$.validator.prototype = {
    init: function(){
        this.reset();

        function delegate(event) {
            var validator = $.data(this[0].form, "validator"),
                eventType = "on" + event.type.replace(/^validate/, "");
            validator && validator.settings[eventType] && validator.settings[eventType].call(validator, this[0], event);
        }
        $(this.currentForm)
               .validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, " +
                    "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                    "[type='email'], [type='datetime'], [type='date'], [type='datebox'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], " +
                    "[type='range'], [type='color'] ",
                    "focusin focusout keyup change", delegate)
            .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate)
            .validateDelegate("input[{0}-number]".format(this.settings.attrPrefix), "keypress", delegate);
        
        if (this.settings.invalidHandler)
            $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
    },
    form: function() {
        this.checkForm();
        if (!this.valid()){
            $(this.currentForm).triggerHandler("invalid-form", [this]);
        }
        this.showErrors();
        return this.valid();
    },
    checkForm: function() {
        this.reset();
        for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
            this.check( elements[i] );
        }
        return this.valid();
    },
    reset: function() {
        this.errorList = [];
        this.errorMap = {};
        this.toShow = $([]);
        this.toHide = $([]);
        this.currentElements = $([]);
    },
    elements: function() {
        var rulesCache = {};
        // select all valid inputs inside the form 
        return $(this.currentForm)
            .find(this.settings.validateElement)
            .not( this.settings.ignore )
            .filter(function() {
                if ( this.name in rulesCache )
                    return false;

                rulesCache[this.name] = true;
                return true;
            });
    },
    check: function( element ) {
        var element = this.validationTargetFor( element ),
        rules = this.getRules( element );
        for (var method in rules ) {
            var rule = { method: method, parameters: rules[method] };
            try {
                var result = $.validator.methods[method].call( this, element.value.replace(/\r/g, ""), element, rule.parameters );
                if( !result ) {
                    this.formatAndAdd( element, rule );
                    return false;
                }
            } catch(e) {
                this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
                     + ", check the '" + rule.method + "' method", e);
                throw e;
            }
        }

        return true;
    },
    element: function( element ) {
        this.reset();
        this.currentElements = $(element);
        var result = this.check( element );
        this.showErrors();
        return result;
    },
    showError: function( element, message , result) {
        if(result){
            this.settings.highlight && this.settings.unhighlight.call( this, this.settings.wrapper ? element.parentNode
                    : element, this.settings.errorClass, this.settings.validClass );
                this.settings.errorShowable && this.removeTip.call( this, element );
        }else{
            this.settings.highlight && this.settings.highlight.call( this, this.settings.wrapper ? element.parentNode 
                    : element, this.settings.errorClass, this.settings.validClass );
            this.settings.errorShowable && this.addTip.call( this, element, message );
        }  
    },
    showErrors: function() {
        for ( var i = 0; this.errorList[i]; i++ ) {
            var error = this.errorList[i];
            this.settings.highlight && this.settings.highlight.call( this, this.settings.wrapper ? error.element.parentNode 
                    : $(error.element), this.settings.errorClass, this.settings.validClass );
            this.settings.errorShowable && this.addTip.call( this, error.element, error.message );
        }
        if (this.settings.unhighlight) {
            for ( var i = 0, elements = this.validElements(); elements[i]; i++ ) {
                this.settings.unhighlight.call( this, this.settings.wrapper ? elements[i].parentNode
                    : elements[i], this.settings.errorClass, this.settings.validClass );
                this.settings.errorShowable && this.removeTip.call( this, elements[i] );
            }
        }
    },
    validElements: function() {
        return this.currentElements.not(this.invalidElements());
    },
    invalidElements: function() {
        return $(this.errorList).map(function() {
            return this.element;
        });
    },
    addTip : function (target, msg) {
        var $target = $(target),
        tip = $([]);
        if ($target.next("div").hasClass("validatebox-tip")) {
            tip = $target.next(".validatebox-tip").children(".tip-content").html(msg).andSelf();
        }else{
            tip = $("<div class=\"validatebox-tip\">"+"<span class=\"tip-content\">"+msg+"</span>"+"<span class=\"tip-pointer\">"+"</span>"+"</div>").insertAfter($target);
        }
        tip.show();
        $target.focus(function(){
            $('.validatebox-tip', this.currentForm).hide();
            tip.show();
        })
        .blur(function(){
            tip.hide();
        })

    },
    removeTip : function (target) {
        var $target = $(target);
        if ($target.next("div").hasClass("validatebox-tip")) {
            $target.next("div").remove();
        }
    },
    idOrName: function(element) {
        return (this.checkable(element) ? element.name : element.id || element.name);
    },
    validationTargetFor: function(element) {
        // if radio/checkbox, validate first element in group instead
        if (this.checkable(element)) {
            element = this.findByName( element.name ).not(this.settings.ignore)[0];
        }
        return element;
    },
    checkable: function( element ) {
        return /radio|checkbox/i.test(element.type);
    },
    findByName: function( name ) {
        // select by name and filter by form for performance over form.find("[name=...]")
        var form = this.currentForm;
        return $(document.getElementsByName(name)).map(function(index, element) {
            return element.form == form && element.name == name && element  || null;
        });
    },
    getRules: function( element ){
        var rules = $.extend( {}, this.attributeRules(element) );
        return rules;
    },
    attributeRules: function( element ) {
        var rules = {};
        var $element = $(element);

        for (var method in $.validator.methods) {
            var value;
            // If .prop exists (jQuery >= 1.6), use it to get true/false for required
            if (method === 'range' || method === 'length') {
                value = [];
                value[0] = $element.attr(this.settings.attrPrefix + "-" + method + "-min");
                value[1] = $element.attr(this.settings.attrPrefix + "-" + method + "-max");
                if( !(value[0] && value[1]) ){
                    value = undefined;
                }
            }else if (method === 'minlength') {
                value = $element.attr(this.settings.attrPrefix + "-length-min");
            }else if (method === 'maxlength') {
                value = $element.attr(this.settings.attrPrefix + "-length-max");
            }else {
                value = $element.attr(this.settings.attrPrefix + "-" + method);
            }
            if (value) {
                rules[method] = value;
            } else if ($element.attr("type") === method) {
                rules[method] = true;
            }
        }
        return rules;
    },
    getLength: function(value, element) {
        switch( element.nodeName.toLowerCase() ) {
        case 'select':
            return $("option:selected", element).length;
        case 'input':
            if( this.checkable( element) )
                return this.findByName(element.name).filter(':checked').length;
        }
        return value.length;
    },
    valid: function() {
        return this.size() == 0;
    },
    size: function() {
        return this.errorList.length;
    },
    focusInvalid: function() {
        if( this.settings.focusInvalid ) {
            try {
                var focusTarget = $( this.errorList.length && this.errorList[0].element || [])
                        .filter(":visible");
                focusTarget.focus().trigger("focusin");
                // display the related tab-nav 
                // $(".form-tab-box .tab-box-item").each(function(i){
                //     if(focusTarget.parents(".tab-box-item").is(this)){
                //         $(this).addClass("current");
                //         $(this).siblings().removeClass("current");
                //         $(".form-tab-nav ul li").eq(i).addClass("current");
                //         $(".form-tab-nav ul li").eq(i).siblings().removeClass("current");
                //         return;
                //     }
                // });
            } catch(e) {
                // ignore IE throwing errors when focusing hidden elements
            }
        }
    },
    metaMessage: function( element, rule ) {
        return $(element).attr(this.settings.attrPrefix + "-" + rule.method);
    },
    defaultMessage: function( element, rule ) {
        return  $.validator.defaults.messages[rule.method] || 
            "<strong>Warning: No message defined for method: " + rule.method + "</strong>";
            // this.metaMessage( element, rule ) ||
    },
    formatAndAdd: function( element, rule ) {
        var message = this.defaultMessage( element, rule ),
            theregex = /\$?\{(\d+)\}/g;
        if ( typeof message == "function" ) {
            message = message.call(this, rule.parameters);
        } else if (theregex.test(message)) {
            message = $.validator.format(message.replace(theregex, '{$1}'), rule.parameters);
        } 
        this.errorList.push({
            message: message,
            element: element
        });
        this.errorMap[this.idOrName(element)] = message;
    },
    newDate: function(str) { 
        str = str.split(/\s/); 
        if(!str){
            return null;
        }
        var day = str[0].split(/\/|-/),time;
        if(!str[1]){
            time = [0,0,0];
        }else{
            time = str[1].split(":");
        }
        var date = new Date(); 
        date.setUTCFullYear(day[0], day[1] - 1, day[2]); 
        date.setUTCHours(time[0]-8, time[1], time[2]);  //北京时间，所以要-8
        return date; 
    } 

}

$.validator.methods = {
    required: function (matches, element, param) {
        switch( element.nodeName.toLowerCase() ) {
        case 'select':
            // could be an array for select-multiple or a string, both are fine this way
            var val = $(element).val();
            return val && val.length > 0;
        case 'input':
            if ( this.checkable(element) )
                return this.getLength(matches, element) > 0;
        default:
            return $.trim(matches).length > 0;
        }
    },
    number : function (matches) {
        // return /^-?\d+(\.\d{0,4})?$/i.test(matches);
        return /^-?(?:\d*|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(matches);
    },
    digits : function (matches) {
        return /^\d*$/.test(matches);
    },
    email : function (matches) {
        return /(^(((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)?$)/i.test(matches);
    },
    url : function (matches) {
        return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(matches);
    },
    date : function (matches) {
        return  !matches || !/Invalid|NaN/.test(this.newDate(matches));
    },
    dateISO : function (matches) {
        return  !matches || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(matches);
    },
    minlength : function (matches, element, param) {
        var param = eval(param);
        return $.trim(matches).length >= param;
    },
    maxlength : function (matches, element, param) {
        var param = eval(param);
        return $.trim(matches).length <= param;
    },
    length : function (matches, element, param) {
        var len = $.trim(matches).length,
        params = eval(param);
        return len >= eval(params[0]) && len <= eval(params[1]);
    },
    range : function (matches, element, param) {
        var matches = eval(matches),
        params = eval(param);
        return !matches || matches >= eval(params[0]) && matches <= eval(param[1]);
    },
    creditcard : function(matches) {
        return /^(\d{14}|\d{17})(\d|[xX])$/.test(matches);
    },
    // file accepted options
    accept: function (matches, element, param) {
        param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
        return matches.match(new RegExp(".(" + param + ")$", "i"));
    }
}

$.validator.defaults = {
    rules: {},
    errorClass: "validatebox-invalid",
    validClass: "",
    wrapper: ".field-inner",
    focusInvalid: true,
    validateElement: "input, select, textarea",
    ignore: ":submit, :reset, :image, [disabled], :hidden",
    attrPrefix: "data-val",
    errorShowable: true,
    messages: {
        required: "该输入域不可为空.",
        remote: "验证失败,请重新输入.",
        email: "请输入有效的邮箱地址.",
        url: "请输入有效的URL.",
        date: "请输入有效的日期.",
        dateISO: "请输入有效的日期(ISO).",
        number: "请输入有效的数字.",
        digits: "请输入整数.",
        creditcard: "请输入有效的身份证号.",
        equalTo: "请再次输入相同值.",
        accept: "请输入有效的扩展名.",
        maxlength: $.validator.format("字段长度不能超过 {0}."),
        minlength: $.validator.format("字段长度不能少于 {0}."),
        length: $.validator.format("字段最小长度为 {0}, 最大长度为 {1}."),
        range: $.validator.format("输入值必须介于 {0} 和 {1} 之间.")
    },
    onfocusin: function(element, event) {
    },
    onfocusout: function(element, event) {
    },
    onkeyup: function(element, event) {
        // this.element(element);
    },
    onchange: function(element, event) {
        var _this = this;
        window.setTimeout(function(){
            _this.element(element);
        },250)
    },
    onkeypress: function(element, event) {
    },
    onclick: function(element, event) {
    },
    highlight: function(element, errorClass, validClass) {
        if (element.type === 'radio') {
            this.findByName(element.name).addClass(errorClass).removeClass(validClass);
        } else {
            $(element).addClass(errorClass).removeClass(validClass);
        }
    },
    unhighlight: function(element, errorClass, validClass) {
        if (element.type === 'radio') {
            this.findByName(element.name).removeClass(errorClass).addClass(validClass);
        } else {
            $(element).removeClass(errorClass).addClass(validClass);
        }
    }   
}