
/*
	js for Vendors.Index;
*/
$(function(){
	var grid = $('.si-grid').grid();
    $('.create ' , '.si-tbar').on('click', function () {   //新增
        grid.doAction('create',{
            success : function(data){
                $.window({'fillText':data});
            }
        })
        return false;
    });
    
    function  modify(){   //修改
        grid.doAction('modify' ,{
            success : function(data){
                $.window({'fillText':data});
            }
        }) ;
        return false;
    }
    $('tbody a', '.si-grid').live('click',function(){
        $(this).parents('tr').trigger('dblclick');
    })
    $('.modify ', '.si-tbar').click(modify);
    $('tbody tr', '.si-grid').die('dblclick').live('dblclick',modify);
})