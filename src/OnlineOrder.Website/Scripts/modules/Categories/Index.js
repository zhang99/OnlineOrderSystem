
/*
	js for Categories.Index;
*/
jQuery(document).ready(function ($) {
    var grid = $('.si-grid').grid(),
        tree = $('#tree').tree({title : '@ViewBag.ModelName'});
    $('.left').css('height',$('.main').height()+'px');

    $('.create ', '.si-tbar').die('click').live('click', function () {   //新增
        log('1234')
        grid.doAction('create',{
            success : function(data){
                $.window({'fillText':data});
                $('#Parent_Code').val( $.trim($('li a.current','#tree').html()).replace('所有类别', '[所有类别]').getBracketInner() );
                $('#ParentId').val($('li a.current','#tree').parent().attr('id'));
            }
        })
    });
    $('.delete', '.si-tbar').die('click').live('click',function(){   //删除
        grid.doAction('delete', {
            success : function(data){
                if(data.status == 'success'){
                    tree.deleteNode(grid.getData(true,'Id'));
                    grid.doAction('refresh');
                }
                $.message(data.message)
            }
        });
    })
    function  modify(){   //修改
        grid.doAction('modify' ,{
            success : function(data){
                $.window({'fillText':data});
            }
        }) ;
        return false;
    }
    $('.query, .refresh', '.si-tbar').live('click', function () {
        var action = $(this).attr('class').replace('si-btn ', '');  //james
        grid.doAction(action);
    })
    $('tbody a', '.si-grid').live('click',function(){
        $(this).parents('tr').trigger('dblclick');
    })
    $('.modify ' , '.si-tbar').die('click').live('click', modify);
    $('tbody tr','.si-grid').die('dblclick').live('dblclick',modify);
});