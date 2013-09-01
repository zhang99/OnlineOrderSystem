
/*
	js for Categories.Index;
*/
jQuery(document).ready(function ($) {
    var grid = $('.si-grid').grid({actionOfWindow : true}),
        tree = $('#tree').tree({title : ''});
    $('.left').css('height',$('.main').height()+'px');

    $('.create ', '.si-tbar').die('click').live('click', function () {   //新增
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
    $('.query, .refresh, .modify ', '.si-tbar').die('click').live('click', function () {
        var action = $(this).attr('class').replace('si-btn ', '');  //james
        grid.doAction(action);
    })
    $('tbody a', '.si-grid').live('click',function(){
        $(this).parents('tr').trigger('dblclick');
    })
    $('tbody tr','.si-grid').die('dblclick').live('dblclick', function(){
        grid.doAction('modify');
    });
});