
/*
	js for Brands.Index;
*/
$(function(){
	var grid = $('.si-grid').grid({actionOfWindow : true});
    $('.si-btn', '.si-tbar').die('click').live('click', function () {
        var action = $(this).attr('class').replace('si-btn ', '');  //james
        grid.doAction(action);
    })
    $('tbody a', '.si-grid').live('click',function(){
        $(this).parents('tr').trigger('dblclick');
    })
    $('tbody tr', '.si-grid').die('dblclick').live('dblclick', function(){
        grid.doAction('modify');
    });
})