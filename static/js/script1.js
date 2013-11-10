// when the dom is ready...
$(function() {

    var $cols = $('colgroup');

    $('td').on('mouseover', function(){
        var i = $(this).prevAll('td').length;
        $(this).parent().addClass('hover')
        $($cols[i]).addClass('hover');
    
    }).on('mouseout', function(){
        var i = $(this).prevAll('td').length;
        $(this).parent().removeClass('hover');
        $($cols[i]).removeClass('hover');
    })
});