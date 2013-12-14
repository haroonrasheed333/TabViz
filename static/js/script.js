$(document).ready(function() {
    var val_array = [];
    var flag = 0;
    var colunm_names = {};

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

    // Use html2canvas plugin to save export the html table as an image.
    // http://stackoverflow.com/questions/16429214/html2canvas-saving-as-a-jpeg-without-opening-in-browser
    function download(img) {
        var D = document,
            A = arguments,
            a = D.createElement("a");

        a.href = img;

        if ('download' in a) {
            a.setAttribute("download", "image.jpg");
            a.innerHTML = "downloading...";
            D.body.appendChild(a);
            setTimeout(function() {
                var e = D.createEvent("MouseEvents");
                e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
                D.body.removeChild(a);
            }, 66);
            return true;
        }
    }

    function screenGrabber() {
        html2canvas([document.getElementById('table-display')], {
            logging: true,
            useCORS: true,
            onrendered: function (canvas) {
                img = canvas.toDataURL("image/jpg");
                download(img);
            }
        });
    }


    var added_files = [];
    var submitted = false;

    // jQuery file upload plugin. Modified the code to upload the file to a python flask server
    // https://github.com/blueimp/jQuery-File-Upload
    $('#file-upload').fileupload({
        dataType: 'json',
        singleFileUploads: true,
        forceIframeTransport: true,
        url: '/fileupload',
        add: function (e, data) {
            added_files.push(data);
            $('#upload-button').unbind('click');
            $('#upload-button').on('click', function(e) {
                e.preventDefault();
                data.formData = $('#file-upload').serializeArray();
                var original_data = data;
                var new_data = {files: [], originalFiles: [], paramName: []};
                jQuery.each(added_files, function(index, file) {
                    new_data['files'] = jQuery.merge(new_data['files'], file.files);
                    new_data['originalFiles'] = jQuery.merge(new_data['originalFiles'], file.originalFiles);
                    new_data['paramName'] = jQuery.merge(new_data['paramName'], file.paramName);
                    });
                new_data = jQuery.extend({}, original_data, new_data);
                new_data.submit();
            });
        },
        submit: function (e, data) {
        },
        done: function (e, data) {
        },
        send: function (e, data) {
        },
        success: function(data1){
			$('#filename').text(data1.filename);
			$('#uploaded').text(data1.update).trigger('change');

            $('#user-input').html('');
            var arr1 = [
              {val : '0', text: 'Select an Option'},
              {val : 'rowheader', text: 'Row Header'},
              {val : 'nominal', text: 'Nominal'},
              {val : 'quant', text: 'Quantitative'},
              {val : 'date', text: 'Date'},
            ];

            var arr2 = [
              {val : '0', text: 'Select an Option'},
              {val : 'number', text: 'Measure'},
              {val : 'currency', text: 'Currency'}
            ];

            var arr3 = [
              {val : '0', text: 'Select an Option'},
              {val : 'hiepar', text: 'Hierarchy Parent'},
              {val : 'hiechi', text: 'Hierarchy Child'},
            ];

            // Dynamically create the user input table to get the table metadata from the user.
            var table = $('<table id="input-options-table"></table>');
            var thead = $('<thead></thead>');
            var title = $('<tr></tr>');
            var title_th = $('<th></th>');
            var title_box = $("<label for='table-title'>Table Title</label><input id='table-title' type='text' value=''/>")
            var subtitle_box = $("<label for='table-subtitle'>Table Subtitle</label><input id='table-subtitle' type='text' value=''/>")

            thead.append(title);
            title.append(title_th);
            title_th.append(title_box);
            thead.append(title);
            title.append(title_th);
            title_th.append(subtitle_box);

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

                var dat1 = $('<td class="type1td tablecolumn-' + k +'" id="type1td-' + k +'"></td>');
                var sel1 = $('<select class="type1" id="type1-' + k +'">');
                $(arr1).each(function() {
                    sel1.append($("<option>").attr('value',this.val).text(this.text));
                });
                dat1.append(sel1);
                row.append(dat1);

                var dat2 = $('<td class="type2td tablecolumn-' + k +'" id="type2td-' + k +'"></td>');
                var sel2 = $('<select class="type2" id="type2-' + k +'">');
                $(arr2).each(function() {
                    sel2.append($("<option>").attr('value',this.val).text(this.text));
                });
                dat2.append(sel2);
                row.append(dat2);

                var dat3 = $('<td class="type3td tablecolumn-' + k +'" id="type3td-' + k +'"></td>');
                var sel3 = $('<select class="type3" id="type3-' + k +'">');
                $(arr3).each(function() {
                    sel3.append($("<option>").attr('value',this.val).text(this.text));
                });
                dat3.append(sel3);
                row.append(dat3);

                var dat4 = $('<td class="units" id="units-' + k +'" width="30px" class="tablecolumn-' + k +'"></td>');
                var units = $("<input id='units-col-" + k +"' type='text' placeholder='Units' value=''/>")
                dat4.append(units);
                row.append(dat4);

                var dat5 = $('<td class="denom" id="denom-' + k +'" width="30px" class="tablecolumn-' + k +'"></td>');
                var denom = $("<input id='denom-col-" + k +"' type='text' placeholder='Denomination' value=''/>")
                dat5.append(denom);
                row.append(dat5);

                var dat6 = $('<td class="datefor" id="datefor-' + k +'" width="30px" class="tablecolumn-' + k +'"></td>');
                var datefor = $("<input id='datefor-col-" + k +"' type='text' placeholder='Date Format' value=''/>")
                dat6.append(datefor);
                row.append(dat6);

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

            // Dynamically create input options.
            $( ".type1" ).change(function() {
                var type = $(this).val();
                var id = $(this).attr('id');
                var column = id.split('-')[1];
                $('#type2td-'+column).css({'display': 'none'});
                $('#type3td-'+column).css({'display': 'none'});
                $('#datefor-'+column).css({'display': 'none'});
                if (type == 'quant') {
                    $('#type2td-'+column).css({'display': 'block'});
                }
                else if (type == 'rowheader') {
                    $('#type3td-'+column).css({'display': 'block'});
                }
                else if (type == 'date') {
                    $('#datefor-'+column).css({'display': 'block'});
                }
                else {
                    //alert( $(this).val() );
                }
            });

            $( ".type2" ).change(function() {
                var type = $(this).val();
                var id = $(this).attr('id');
                var column = id.split('-')[1];
                $('#units-'+column).css({'display': 'none'});
                $('#denom-'+column).css({'display': 'none'});
                if (type == 'number') {
                    $('#units-'+column).css({'display': 'block'});
                }
                else if (type == 'currency') {
                    $('#denom-'+column).css({'display': 'block'});
                }
                else {
                    //alert( $(this).val() );
                }
            });


            // Visualize the table.
            $('#visualize-button').on('click', function(e) {

                // Store the user input in a dict object.
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

                var number_columns = [];
                var hieparents = [];
                var hiechilds = [];
                var date_columns = [];
                for (var ui in user_in) {
                    if (user_in[ui] == 'number' || user_in[ui] == 'currency') {
                        number_columns.push(ui);
                    }
                    if (user_in[ui] == 'date') {
                        date_columns.push(ui);
                    }
                    if (user_in[ui] == 'hiepar') {
                        hieparents.push(ui);
                    }
                    if (user_in[ui] == 'hiechi') {
                        hiechilds.push(ui);
                    }
                }


                for (var i = 1; i < data1.header.length+1; i++) {
                    colunm_names['column-'+i] = data1.header[i-1]
                }

                var arr_bar = [];

                for (var nc = 0; nc < number_columns.length; nc++) {
                    var temp_opj = {};
                    temp_opj['val'] = number_columns[nc];
                    temp_opj['text'] = colunm_names[number_columns[nc]];
                    arr_bar.push(temp_opj);
                }


                // Create controls for user interaction
                $(arr_bar).each(function() {
                    $("#bar-display").append ("<input class='show-bar' id='" + this.val + "' type='checkbox' value='" + this.text + "' /><label for='" + this.val + "'>" + this.text + "</label>" );
                });

                if (arr_bar.length > 0) {
                    $('#bar-display').css({'display': 'block'});
                    $('#compress-checkbox').css({'display': 'block'});
                    $('#summary-checkbox').css({'display': 'block'});
                }

                $('#other-interactions').css({'display': 'block'});
                $('#export-image').css({'display': 'block'});


                $('#wrapperdiv1').css({'display': 'none'});

                // Convert the uploaded cvs file into JSON in the flask server.
                // Make an ajax call to flask server to convert the csv file to JSON and get the JSON file.
    			$.ajax('/csv2json', {
    			    type: "POST",
    		        dataType: 'json',
    			    contentType: "application/json; charset=utf-8",
    		        data: JSON.stringify(obj),
    		        success: function(data) {

                        $('#table-display').html('');

                        var table_title = $('#table-title').val();
                        var table_subtitle = $('#table-subtitle').val();

                        var num_columns = Object.keys(data[1]).length;
                        var table = $('<table id="table-visualize" class="sort-decoration tablesorter" cellspacing="0"></table>');
                        var thead = $('<thead></thead>');
                        thead.append($('<tr><th class="table-title-th" colspan="' + num_columns + '"><h4>' + table_title + '</h4></th></tr>'));
                        thead.append($('<tr><th class="table-title-th" colspan="' + num_columns + '"><h5>' + table_subtitle + '</h5></th></tr>'));
    		            var head = $('<tr></tr>');
                        var col_count = 1;
    		            for (var k = 1; k < Object.keys(data[1]).length + 1; k++) {
    		            	var head1 = $('<th class="header column' + col_count +'"></th>').attr('scope', 'col');
    		            	var head_div = $('<div></div>');

                            var value = Object.keys(data[1])[k-1];
                            var unit_val = $('#units-col-' + k).val();
                            var denom_val = $('#denom-col-' + k).val();
                            var date_val = $('#datefor-col-' + k).val();

                            // For numeric fields display the units in the header.
                            if (unit_val != '') {
                                value = Object.keys(data[1])[k-1] + ' (' + unit_val + ')';
                            }

                            if (denom_val != '') {
                                value = Object.keys(data[1])[k-1] + ' (' + denom_val + ')';
                            }

                            if (date_val != '') {
                                value = Object.keys(data[1])[k-1] + ' (' + date_val + ')';
                            }

                            var span1 = $('<span></span>').text(value);
                            var span2 = $('<span class="sortArrow">&nbsp;</span>');
                            thead.append(head);
    		 	            head.append(head1);
                            head1.append(head_div);
                            head_div.append(span1);
                            head_div.append(span2);
                            col_count += 1
    		            }

    		            table.append(thead)
                        var row_count = 1
                        var number_values = {};
                        var date_values = {};
    				    $.each(data, function() {
    				        var row = $('<tr></tr>');
                            col_count = 1;
    				        $.each(this, function(k , v) {
                                var column_number = 'column-' + col_count;
    				            var row1 = $('<td></td>');
                                if (v == 'NA') {
                                    v = '';
                                }
                                var data_span;
                                if (user_in[column_number] == 'number' || user_in[column_number] == 'currency') {
                                    data_span = $('<span class="column-' + col_count +' row-' + row_count +'"></span>').text(parseFloat(v.replace(/[^-0-9\.]+/g,"")));
                                }
                                else {
                                    data_span = $('<span class="column-' + col_count +' row-' + row_count +'"></span>').text(v);
                                }
    							table.append(row);
    		 	                row.append(row1);
                                row1.append(data_span);
                                row1.append('<hr class="cell columnhr-' + col_count +' rowhr-' + row_count +'" style="display:block;"/>')

                                if (user_in[column_number] == 'number' || user_in[column_number] == 'currency') {
                                    if (typeof(number_values[column_number]) === 'undefined') {
                                        number_values[column_number] = [];
                                    }
                                    number_values[column_number].push(v);
                                }

                                if (user_in[column_number] == 'date') {
                                    if (typeof(date_values[column_number]) === 'undefined') {
                                        date_values[column_number] = [];
                                    }
                                    date_values[column_number].push(v);
                                }
                                col_count += 1;
    				        });
                            row_count += 1
    				    });

    			        $('#table-display').append(table);

                        // jQuery tablesorter plugin - http://tablesorter.com/docs/
    			        $(".tablesorter").tablesorter();

                        $('#legend').css({'display': 'block'});
                        $('.datefor').css({'text-align': 'right'});

                        // Formating columns with data values
                        for (var i = 0; i < date_columns.length; i++) {
                            $('.'+date_columns[i]).css({'text-align': 'right'});
                            $('.'+date_columns[i]).css({'float': 'right'});
                        }

                        // Formating numeric columns
                        for (var i = 0; i < number_columns.length; i++) {
                            //console.log(number_columns[i]);
                            $('.'+number_columns[i]).css({'float': 'right'});
                            $('.'+number_columns[i]).css({'text-align': 'right'});

                            var column = number_columns[i].split('-')[1];
                            var floar_arr = [];
                            var values = number_values[number_columns[i]];
                            for (var z = 1; z <= values.length; z++) {
                                var temp = values[z-1];
                                // Regexp to extract numbers from string
                                var number = temp.replace(/[^-0-9\.]+/g,"");
                                if (isNaN(parseFloat(number))) {
                                    number = '0';
                                }
                                floar_arr.push(parseFloat(number));
                            }

                            var arr = floar_arr.filter(function(n){return n});
                            var max = Math.max.apply(Math, arr);
                            var min = Math.min.apply(Math, arr);


                            for (var z = 1; z <= floar_arr.length; z++) {
                                var val = floar_arr[z-1];
                                if (val == max) {
                                    $('.column-' + column +'.row-'+z).css({'background-color': '#ADDFFF'});
                                    $('.column-' + column +'.row-'+z).css({'font-weight': 'bold'});
                                }
                                if (val == min) {
                                    $('.column-' + column +'.row-'+z).css({'background-color': '#E18B6B'});
                                    $('.column-' + column +'.row-'+z).css({'font-weight': 'bold'});
                                }
                            }
                        }

                        for (var i = 0; i < hieparents.length; i++) {
                            $('.' + hieparents[i]).css({'font-weight': 'bold'});
                        }

                        for (var i = 0; i < hiechilds.length; i++) {
                            $('.' + hiechilds[i]).css({'font-weight': 'bold'});
                        }

                        // Highlight row and column when a cell is hovered.
                        $('#hover').on('click', function() {
                            if($('#hover').is(':checked')) {
                                $('#table-visualize td').hover(function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('#table-visualize td:nth-child(' + t + ')').addClass('hovered');
                                    $('#table-visualize th:nth-child(' + t + ')').addClass('hovered');
                                },
                                function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('#table-visualize td:nth-child(' + t + ')').removeClass('hovered');
                                    $('#table-visualize th:nth-child(' + t + ')').removeClass('hovered');
                                });
                                $('#table-visualize tbody tr').hover(function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('#table-visualize tbody tr:nth-child(' + t + ')').addClass('hovered');
                                },
                                function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('#table-visualize tbody tr:nth-child(' + t + ')').removeClass('hovered');
                                });
                            }
                            else {
                                $('#table-visualize td').hover(function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('#table-visualize td:nth-child(' + t + ')').removeClass('hovered');
                                    $('#table-visualize th:nth-child(' + t + ')').removeClass('hovered');
                                },
                                function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('#table-visualize td:nth-child(' + t + ')').removeClass('hovered');
                                    $('#table-visualize th:nth-child(' + t + ')').removeClass('hovered');
                                });
                                $('#table-visualize tbody tr').hover(function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('#table-visualize tbody tr:nth-child(' + t + ')').removeClass('hovered');
                                },
                                function() {
                                    var t = parseInt($(this).index()) + 1;
                                    $('#table-visualize tbody tr:nth-child(' + t + ')').removeClass('hovered');
                                });
                            }
                        });

                        // Select multiple cells
                        $('#select-cells').on('click', function() {
                            var active = false;
                            if($('#select-cells').is(':checked')) {
                                $("#table-visualize td").mousedown(function(ev) {
                                    active = true;
                                    $(".selected").removeClass("selected");
                                    ev.preventDefault();
                                    $(this).addClass("selected");

                                });

                                $("#table-visualize td").mousemove(function(ev) {
                                    if (active) {
                                        if($('#select-cells').is(':checked')) {
                                            $(this).addClass("selected");
                                        }
                                    }
                                });

                                $("#table-visualize td").mouseup(function(ev) {
                                    active = false;
                                });
                            }
                            else {
                                $(".selected").removeClass("selected");
                                $("#table-visualize td").mousedown(function(ev) {
                                    $(".selected").removeClass("selected");
                                    ev.preventDefault();
                                });

                                $("#table-visualize td").mousemove(function(ev) {
                                    if (active) {
                                        $(this).removeClass("selected");
                                    }
                                });

                                $("#table-visualize td").mouseup(function(ev) {
                                    active = false;
                                });
                            }
                        });

                        // Summarize columns
                        $('#summarize-columns').on('click', function() {
                            if($('#summarize-columns').is(':checked')) {

                                $("#table-visualize").append($("#table-visualize tr:last").clone())
                                newRow = $("#table-visualize tr:last");
                                for (var i = 0; i < col_count ; i++) {
                                    newRow.find('td:nth-child(' + i + ')').html('');
                                }
                                newRow.find('td:nth-child(1)').text("Total") ;
                                newRow.find('td:nth-child(1)').css({'color': 'black'});
                                newRow.find('td:nth-child(1)').css({'font-weight': 'bold'});
                                for (var i = 0; i < number_columns.length; i++) {
                                    var column = number_columns[i].split('-')[1];
                                    var floar_arr = [];
                                    var values = number_values[number_columns[i]];
                                    for (var z = 1; z <= values.length; z++) {
                                        var temp = values[z-1];
                                        var number = temp.replace(/[^0-9\.]+/g,"");
                                        if (isNaN(parseFloat(number))) {
                                            number = '0';
                                        }
                                        floar_arr.push(parseFloat(number));
                                    }

                                    var arr = floar_arr.filter(function(n){return n});
                                    var total = arr.reduce(function(a, b) {
                                        return a + b;
                                    });

                                    newRow.find('td:nth-child(' + column + ')').text(total.toFixed(2));
                                    newRow.find('td:nth-child(' + column + ')').css({'text-align': 'right'});
                                    newRow.find('td:nth-child(' + column + ')').css({'float': 'none'});
                                    newRow.find('td:nth-child(' + column + ')').css({'font-weight': 'bold'});
                                    newRow.find('td:nth-child(' + column + ')').css({'color': 'black'});
                                    newRow.css({'color': 'black'});
                                    newRow.css({'border-top': '2px solid #666'});
                                }
                            }
                            else {
                                $("#table-visualize tr:last").remove();
                            }
                        });

                        // Summarize rows.
                        $('#summarize-rows').on('click', function() {
                            if($('#summarize-rows').is(':checked')) {

                                $('#table-visualize thead tr:last').find('th:last-child').after('<th style="text-align:right" class="header column">Total</th>');

                                $('#table-visualize > tbody  > tr ').each(function(){
                                    var total = 0;
                                    var temp = 0;
                                    $(this).children().each(function(){
                                        temp = parseFloat($(this).text());
                                        if (!isNaN(temp)) {
                                            total = total + temp;
                                        }
                                        });
                                    $(this).find('td:last-child').after('<td>'+ total.toFixed(2) +'</td>');
                                    $(this).find('td:last-child').css({'text-align': 'right'});
                                    $(this).find('td:last-child').addClass('totcol');
                                    $(this).find('td:last-child').css({'font-weight': 'bold'});
                                    $(this).find('td:last-child').css({'color': 'black'});
                                });

                            }
                            else {
                                $('#table-visualize thead tr:last').find('th:last-child').remove();
                                 $('#table-visualize > tbody  > tr ').each(function(){
                                    $(this).find('td:last-child').remove();
                                });
                            }
                        });


                        // Table Lens.
                        // Create a bar chart inline for numeric columns
                        $('.show-bar').on('click', function() {
                            var this_id = $(this).attr('id');
                            var column = this_id.split('-')[1];
                            if($('#'+this_id).is(':checked')) {
                                $('.columnhr-'+column).css({'display': 'block'});
                                $('.columnhr-'+column).css({'padding': '0px'});
                                $('.columnhr-'+column).css({'margin': '0px'});
                                $('.columnhr-'+column).css({'padding-top': '2px'});
                                $('.columnhr-'+column).css({'height': '1.5px'});
                                $('.columnhr-'+column).css({'background-color': 'grey'});
                                $('.columnhr-'+column).css({'float': 'right'});
                                $('.columnhr-'+column).css({'width': '100%'});
                                $('.column-'+column).css({'width': '100%'});
                                var floar_arr = [];
                                var values = number_values[this_id];
                                for (var z = 1; z <= values.length; z++) {
                                    var temp = values[z-1];
                                    var number = temp.replace(/[^0-9\.]+/g,"");
                                    if (isNaN(parseFloat(number))) {
                                        number = '0';
                                    }
                                    floar_arr.push(parseFloat(number));
                                }
                                var max = Math.max.apply(Math, floar_arr);
                                var min = Math.min.apply(Math, floar_arr);
                                for (var z = 1; z <= floar_arr.length; z++) {
                                    var width = floar_arr[z-1];
                                    width = (width / max) * 100;
                                    width = width + '%';
                                    $('.columnhr-' + column +'.rowhr-'+z).css({'width': width});
                                }
                            }
                            else {
                                $('.columnhr-'+column).css({'display': 'none'});
                            }
                        });

                        // Compress rows to hide the data values and display only the bar chart.
                        $('.compress-rows').on('click', function() {
                            if($('#compress-rows').is(':checked')) {
                                for (var z = 1; z <= floar_arr.length; z++) {
                                    $('.row-'+z).css({'display': 'none'});
                                }
                                $('#table-visualize td').css({'height': '3px'});
                                $('#table-visualize td').css({'padding': '0px 8px'});
                            }
                            else
                            {
                                for (var z = 1; z <= floar_arr.length; z++) {
                                    $('.row-'+z).css({'display': 'block'});
                                }
                                $('#table-visualize td').css({'height': '25px'});
                                $('#table-visualize td').css({'padding': '6px 8px'});
                            }
                        });

                        $('.cell').on('click', function() {
                            var rowhr = $(this).attr('class').split(' ')[2];
                            var toggle_row =  '.row-' + rowhr.split('-')[1];
                            if (flag == 0) {
                                $(toggle_row).css({'display': 'block'});
                                $(toggle_row).css({'background-color': '#dddddd'});
                                flag = 1;
                            }
                            else {
                                $(toggle_row).css({'background-color': 'white'});
                                $(toggle_row).css({'display': 'none'});
                                flag = 0;
                            }
                        });

                        // Export image. Use html2canvas to grab the image and save it locally.
                        $('#export-image').on('click', function() {
                            screenGrabber();
                        });
    			    }
    			});
            });
		}
    });
});
