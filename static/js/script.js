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
            $('#upload-button').unbind('click');
            $('#upload-button').on('click', function(e) {
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
            console.log(data1.header);

            $('#user-input').html('');
            var arr1 = [
              {val : 'nominal', text: 'Nominal'},
              {val : 'ordinal', text: 'Ordinal'},
              {val : 'categorical', text: 'Categorical'},
              {val : 'quant', text: 'Quantitative'}
            ];

            var arr2 = [
              {val : '0', text: 'Select an Option'},
              {val : 'financial', text: 'Financial'},
              {val : 'date', text: 'Date'},
              {val : 'currency', text: 'Currency'}
            ];

            var arr3 = [
              {val : '0', text: 'Select an Option'},
              {val : 'hiepar', text: 'Hie-Parent'},
              {val : 'hiechi', text: 'Hei-Child'},
            ];

            var table = $('<table id="input-options-table"></table>');
            var thead = $('<thead></thead>');
            var head = $('<tr></tr>');
            var head1 = $('<th></th>').attr('scope', 'col').text('Columns');
            thead.append(head);
            head.append(head1);
            var head1 = $('<th></th>').attr('scope', 'col').text('Options');
            thead.append(head);
            head.append(head1);
            table.append(thead);
            for (var k = 1; k < data1.header.length+1; k++) {
                var row = $('<tr></tr>');
                var dat = $('<td class="tablecolumn-' + k +'"></td>').text(data1.header[k-1]);
                row.append(dat);

                var dat1 = $('<td class="tablecolumn-' + k +'"></td>');
                var sel1 = $('<select class="type1" id="type1-' + k +'">');
                $(arr1).each(function() {
                    sel1.append($("<option>").attr('value',this.val).text(this.text));
                });
                dat1.append(sel1);
                row.append(dat1);

                var dat2 = $('<td class="tablecolumn-' + k +'"></td>');
                var sel2 = $('<select class="type2" id="type2-' + k +'">');
                $(arr2).each(function() {
                    sel2.append($("<option>").attr('value',this.val).text(this.text));
                });
                dat2.append(sel2);
                row.append(dat2);

                var dat3 = $('<td class="tablecolumn-' + k +'"></td>');
                var sel3 = $('<select class="type3" id="type3-' + k +'">');
                $(arr3).each(function() {
                    sel3.append($("<option>").attr('value',this.val).text(this.text));
                });
                dat3.append(sel3);
                row.append(dat3);

                table.append(row);
            }
            var row = $('<tr></tr>');
            var vis_btn = '<input id="visualize-button" class="btn btn-primary" type="button" value="Visualize" />';
            row.append(vis_btn);
            table.append(row);
            $('#user-input').append(table);

			var fname = $('#filename').val();
			var obj = {}
			obj['filename'] = ''
			if (fname != '0') {
				obj['filename'] = fname;
			}

            $('#wrapperdiv1').css({'display': 'block'});

            $( ".type1" ).change(function() {
                var type = $(this).val();
                var id = $(this).attr('id');
                var column = id.split('-')[1];
                $('#type2-'+column).css({'display': 'none'});
                $('#type3-'+column).css({'display': 'none'});
                if (type == 'quant') {
                    $('#type2-'+column).css({'display': 'block'});
                }
                else if (type == 'categorical') {
                    $('#type3-'+column).css({'display': 'block'});
                }
                else {
                    //alert( $(this).val() );
                }
            });

            $('#visualize-button').on('click', function(e) {

                var user_in = {}

                for (var k = 1; k < data1.header.length+1; k++) {
                    var type1_val = $('#type1-'+k).val();
                    var type2_val = $('#type2-'+k).val();
                    var type3_val = $('#type3-'+k).val();
                    user_in['column-'+k] = ''
                    if (type3_val != '0') {
                        user_in['column-'+k] = type3_val;
                    }
                    else if (type2_val != '0') {
                        user_in['column-'+k] = type2_val;
                    }
                    else {
                        user_in['column-'+k] = type1_val;
                    }
                }

                console.log(user_in);

                $('#wrapperdiv1').css({'display': 'none'});
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
/*                        $('tr').on('click', function() {
                            $(this).toggleClass("select");
                        });*/
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
                                $('tr').hover(function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('tr:nth-child(' + t + ')').addClass('hovered');
                                },
                                function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('tr:nth-child(' + t + ')').removeClass('hovered');
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
                                $('tr').hover(function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('tr:nth-child(' + t + ')').removeClass('hovered');
                                },
                                function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('tr:nth-child(' + t + ')').removeClass('hovered');
                                });
                            }
                        });

                        $('#select-cells').on('click', function() {
                            if($('#select-cells').is(':checked')) {
                                $(function () {
                                        var active = false;
                                        $("#hor-minimalist-b td").mousedown(function(ev) {
                                            active = true;
                                            $(".selected").removeClass("selected");
                                            ev.preventDefault();
                                            $(this).addClass("selected");
                                            $(this).closest('tr').find("td:nth-child(1)").addClass('selected');
                                            table.find('thead th').eq($(this).index()).addClass('selected');
                                        });

                                        $("#hor-minimalist-b td").mousemove(function(ev) {
                                            if (active) {
                                                $(this).addClass("selected");
                                                $(this).closest('tr').find("td:nth-child(1)").addClass('selected');
                                                table.find('thead th').eq($(this).index()).addClass('selected');
                                            }
                                        });
                                        $(document).mouseup(function(ev) {
                                            active = false;
                                        });
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
                                $('.columnhr3').css({'margin-top': '0px'});
                                $('.columnhr3').css({'height': '1.5px'});
                                $('.columnhr3').css({'background-color': 'grey'});
                                var floar_arr = [];
                                for (var z = 1; z <= val_array.length; z++) {
                                    var temp = val_array[z-1];
                                    if (isNaN(parseFloat(temp))) {
                                        temp = '0';
                                    }
                                    floar_arr.push(parseFloat(temp));
                                }
                                var max = Math.max.apply(Math, floar_arr);
                                var min = Math.min.apply(Math, floar_arr);
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
            });
		}
    });
});
