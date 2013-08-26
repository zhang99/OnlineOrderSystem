/*
 * 2013/5/14
 * author James
 */

//==============================================================================
/*
	顶级全局函数，一般仅此一个
*/
//==============================================================================
function log() {
    if ($.si.debug && window.console && window.console.log) {
        window.console.log('->', arguments);
    }
}


//==============================================================================
/*
 * 命名空间，
 * 用于存放全局的对象、属性和缓存的数据
 */
//==============================================================================
(function ($) {
    /**
     * 全局命名空间，
     * 用于存放全局函数、对象和数据
     */
    $.si = $.si || {
        debug: true
    };
})(jQuery);


//==============================================================================
/*
 * 扩展函数，
 */
//==============================================================================
/*
 //格式化字符串
*/
String.prototype.format=function(arg){   
    var result=this;
    if(arguments.length > 0){
        if(arguments.length == 1 && typeof arg == Object){
            for(var key in arg){
                if( arg[key] != undefined ){
                    var reg = new RegExp("({"+key+"})","g");
                    result = result.replace(reg , arg[key]);
                }
            }
        }else{
            for(var i = 0; i< arguments.length; i++){
                if( arguments[i] != undefined ){
                    var reg = new RegExp("({["+ i +"]})",'g')
                    result = result.replace(reg , arguments[i]);
                }
            }
        }
    }
    return result;        
}
/**
* 序列化字符串 转 Json
* 序列化字符串格式 eg：“a=1&b=2&c=3”
*/
String.prototype.toJson = function() {
    var array = this.split("&"),
        json = {};
    if(array.length > 1){
        for(var i = 0 ; i < array.length; i++){
            var name = array[i].split("=")[0];
            var value = array[i].split("=")[1];
            json[name] = value;
        }
    }
    return json;
}
/*
*  取得字符串中[]之间的内容
*/
String.prototype.getBracketInner = function(){
    var arr = this.split(''), m, n;
    for( var i = 0 , len =arr.length ; i<len ; i++){
        if(arr[i] == '['){
            m = i;
        }else if(arr[i] == ']'){
            n = i;
        }
    }
    if(!n){
        return '';
    }
    return arr.join().replace(/,/g , '').substring(m+1 ,n)
}
/*
  函数说明：两个数组的相同值；
  参数说明：需比较的两个数组；
  返回说明：由重复项组成的数组；
*/
Array.prototype.getSameVar = function(arr1,arr2){
    var arr = [] ;
    if( arr1 instanceof Array && arr2 instanceof Array){
        for(var i = 0 , ilen = arr1.length ; i < ilen ; i++){
            for(var j = 0 , jlen = arr2.length ; j < jlen ; j++){
                if(arr1[i] === arr2[j]){
                    arr.push(arr1[i]);
                }
            }
        }
    }
    return arr;
}
/*
    数值数组的和
    Array for Number；
*/
Array.prototype.total = function(){
    var arr = this, 
        result = 0;
    for( var i = 0 , ilen = arr.length ; i < ilen ; i++ ){
        if(typeof arr[i] == 'number'){
            result += arr[i];
        }else if(typeof arr[i] == 'string'){
            result += parseFloat(arr[i]);
        }
    }
    return result;
}

/*
  函数说明：数组对象去除重复项；
  参数说明：需去除重复项的数组对象；
  返回说明：无重复项的数组对象；
    
*/
Array.prototype.unequal = function(value){
    var temp = {}, len = this.length;
    if(len == 0){
        return;
    }
    for(var i = 0; i < len; i++){
        if(typeof temp[this[i][value]] == 'undefined'){
            temp[this[i][value]] = this[i];
        }
    }
    this.length = 0;
    len = 0;

    for(var i in temp){
        this[len++] = temp[i];
    }
    return this;
}