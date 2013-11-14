$(document).ready(function() {
    var val_array = [];

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
                    var row_count = 1
				    $.each(data, function() {
				        var row = $('<tr></tr>');
                        col_count = 1;
				        $.each(this, function(k , v) {
				            var row1 = $('<td class="column' + col_count +' row' + row_count +'"></td>').text(v);
							table.append(row);
		 	                row.append(row1);
                            row1.append('<hr class="columnhr' + col_count +' rowhr' + row_count +'" style="display:none;"/>')
                            if (col_count == 3) {
                                val_array.push(v);
                            }
                            col_count += 1;
				        });
                        row_count += 1
				    });
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
                    $('#bar-display').on('click', function() {
                        if($('#bar-display').is(':checked')) {
                            $('.columnhr3').css({'display': 'block'});
                            $('.columnhr3').css({'padding': '0px'});
                            $('.columnhr3').css({'margin': '0px'});
                            $('.columnhr3').css({'margin-top': '2px'});
                            $('.columnhr3').css({'height': '5px'});
                            $('.columnhr3').css({'background-color': 'grey'});
                            console.log(val_array);
                            var floar_arr = [];
                            for (var z = 1; z <= val_array.length; z++) {
                                var temp = val_array[z-1];
                                if (isNaN(parseFloat(temp))) {
                                    temp = '0';
                                }
                                floar_arr.push(parseFloat(temp));
                            }
                            console.log(floar_arr);
                            var max = Math.max.apply(Math, floar_arr);
                            var min = Math.min.apply(Math, floar_arr);
                            console.log(max);
                            console.log(min);
                            for (var z = 1; z <= floar_arr.length; z++) {
                                var width = floar_arr[z-1];
                                if (max < 10) {
                                    width = width*10;
                                }
                                else if (max < 100) {
                                    width = width;
                                }
                                width = width + '%';
                                $('.rowhr'+z).css({'width': width});
                            }
                        }
                        else {
                            $('.columnhr3').css({'display': 'none'});
                        }
                    }); 
			    }
			});
		}
    });
});
