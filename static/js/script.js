$(document).ready(function() {

	var $cols = $('colgroup');

    var added_files = [];
    var submitted = false;
    $('#file-upload').fileupload({
        dataType: 'json',
        singleFileUploads: true,
        forceIframeTransport: true,
        url: '/fileupload',
        add: function (e, data) {
            console.log('add', data);
            added_files.push(data);
                    
            $(':button').unbind('click');    
            $(':button').on('click', function(e) {
                e.preventDefault();
                data.formData = $('#file-upload').serializeArray();
                console.log('haroon');
                console.log(data);
                 
                var original_data = data;
                var new_data = {files: [], originalFiles: [], paramName: []};
                jQuery.each(added_files, function(index, file) {
                    new_data['files'] = jQuery.merge(new_data['files'], file.files);
                    new_data['originalFiles'] = jQuery.merge(new_data['originalFiles'], file.originalFiles);
                    new_data['paramName'] = jQuery.merge(new_data['paramName'], file.paramName);
                    });
                
                new_data = jQuery.extend({}, original_data, new_data);
                console.log(new_data);
                new_data.submit();
            });
        },
        submit: function (e, data) {
            console.log('submitted');
        },
        done: function (e, data) {
            console.log('done uploading');
        },
        send: function (e, data) {
            console.log('sending');
        },
        success: function(data1){
			console.log('123', data1);
			$('#filename').text(data1.filename);
			$('#uploaded').text(data1.update).trigger('change');

			var fname = $('#filename').val();
			var obj = {}
			obj['filename'] = ''
			if (fname != '0') {
				obj['filename'] = fname;
			}

			$.ajax('/csv2json', {
			    type: "POST",
		        dataType: 'json',
			    contentType: "application/json; charset=utf-8",
		        data: JSON.stringify(obj),
		        success: function(data){
		            console.log(data.length);
		            var table = $('<table id="hor-minimalist-b"></table>');
		            var thead = $('<thead></thead>');
		            var head = $('<tr></tr>');
		            var colgrp = $('<colgroup></colgroup>');
		            for (var k = 0; k < Object.keys(data[1]).length; k++) {
		            	var head1 = $('<th></th>').attr('scope', 'col').text(Object.keys(data[1])[k]);
		            	thead.append(head);
		 	            head.append(head1);
		 	            table.append(colgrp);
		            }
		            table.append(thead)
				    $.each(data, function() {
				        var row = $('<tr></tr>');
				        $.each(this, function(k , v) {
				            var row1 = $('<td></td>').text(v);
							table.append(row);
		 	                row.append(row1);
				        })
				    })
				    //$("#target_table_id tbody").html(tbl_body);
			        $('#table-display').append(table);
			        $("#hor-minimalist-b").tablesorter();
			        addColumnHover(document.querySelector('table')); 
			    }
			});
		}
    });
});

function addColumnHover(table) {
    var HOVER_CLASS = 'hovered';
    var hovered;

    table.addEventListener('mouseover', function (e) {
        if (e.target.tagName.toLowerCase() == 'td') {
            var index = e.target.cellIndex;

            hovered && hovered.forEach(function (cell) {
                cell.classList.remove(HOVER_CLASS);
            });

            hovered = Array.prototype.map.call(
                table.rows,
                function (row) {
                    var i = index;
                    while (!cell && i >= 0) {
                        var cell = row.cells[i];
                        i -= 1;
                    }
                    return cell;
                }
            );

            hovered.forEach(function (cell) {
                cell.classList.add(HOVER_CLASS);
            });
        }
    }, true);

    table.addEventListener('mouseout', function (e) {
        hovered && hovered.forEach(function (cell) {
            cell.classList.remove(HOVER_CLASS);
        });
        hovered = null;
    }, true);
}

