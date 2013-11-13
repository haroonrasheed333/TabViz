$(document).ready(function() {

    $('#open').css({"display":"none"});
    $('#close').css({"display":"block"});

    $('#close').on('click', function() {
        $('#wrapperdiv').removeClass('wrapper');
        $('#wrapperdiv').addClass('wrapperhover');
        $('#open').css({"display":"block"});
        $('#close').css({"display":"none"});
    });

    $('#open').on('click', function() {
        $('#wrapperdiv').removeClass('wrapperhover');
        $('#wrapperdiv').addClass('wrapper');
        $('#close').css({"display":"block"});
        $('#open').css({"display":"none"});
    });


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
                    $('#table-display').html('');
		            var table = $('<table id="hor-minimalist-b"></table>');
		            var thead = $('<thead></thead>');
		            var head = $('<tr></tr>');
		            var colgrp = $('<colgroup></colgroup>');
                    var col_count = 1;
		            for (var k = 0; k < Object.keys(data[1]).length; k++) {
		            	var head1 = $('<th class="column' + col_count +'"></th>').attr('scope', 'col').text(Object.keys(data[1])[k]);
		            	thead.append(head);
		 	            head.append(head1);
		 	            table.append(colgrp);
                        col_count += 1
		            }
		            table.append(thead)
				    $.each(data, function() {
				        var row = $('<tr></tr>');
                        col_count = 1;
				        $.each(this, function(k , v) {
				            var row1 = $('<td class="column' + col_count +'"></td>').text(v);
							table.append(row);
		 	                row.append(row1);
                            col_count += 1;
				        })
				    })
				    //$("#target_table_id tbody").html(tbl_body);
			        $('#table-display').append(table);
                    $('tr').on('click', function() {
                        $(this).toggleClass("select");
                    });
			        $("#hor-minimalist-b").tablesorter();

                    $('#hover').on('click', function() {
                        if($('#hover').is(':checked')) {
                            $('td').hover(function() {
                                var t = parseInt($(this).index()) + 1;
                                $('td:nth-child(' + t + ')').addClass('hovered');
                            },
                            function() {
                                var t = parseInt($(this).index()) + 1;
                                $('td:nth-child(' + t + ')').removeClass('hovered');
                            });
                        }
                        else {
                            $('td').hover(function() {
                                var t = parseInt($(this).index()) + 1;
                                $('td:nth-child(' + t + ')').removeClass('hovered');
                            },
                            function() {
                                var t = parseInt($(this).index()) + 1;
                                $('td:nth-child(' + t + ')').removeClass('hovered');
                            });
                        }
                    }); 
                    $('#column-display').on('click', function() {
                        if($('#column-display').is(':checked')) {
                            $('.column4').css({'display': 'none'});
                        }
                        else {
                            $('.column4').css({'display': 'block'});
                        }
                    }); 
			    }
			});
		}
    });
});
