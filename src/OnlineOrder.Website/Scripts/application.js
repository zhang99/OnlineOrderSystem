/*
 * 2013/5/22
 * author James
 * 应用程序级别的Javascript代码放在此
 */
$(function () {
    //全局ajax事件。
    $(document).ajaxStart(function () {
        $(document.body).waitting(true);
    })
    .ajaxError(function () {
        $.message({ msg: '网络故障，加载失败!', type: 'normal' });
    })
    .ajaxComplete(function () {
        $(document.body).waitting(false);
    });

    $('#adv-search').live('click', function () {
        $('#adv-search-panel').toggle();
        $('#adv-search').toggleClass('adved');
        return false;
    });
    
});


