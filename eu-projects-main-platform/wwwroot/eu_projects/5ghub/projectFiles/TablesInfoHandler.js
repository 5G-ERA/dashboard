var localisationselected, trajectoryselected, safetyselected, ctimessagesafetyselected, videoselected, sensorselected, routingalgorithmselected, gamingselected, dedicatedselected, smsselected, mobilityselected, radiocoverageselected, radiocapacityselected, networklatencyselected, couldandmecselected
var table;

function PI_GenerateAllTables(response) {
	console.log(response);
	GenerateTable("localisation_table_id", "localisationtable", response, 'Localisation');
	GenerateTable("trajectory_table_id", "trajectorytable", response, 'Trajectory');
	GenerateTable("safetytable_table_id", "safetytable", response, 'Safety');
	GenerateTable("citsmessage_table_id", "citsmessagetable", response, 'C-ITs message');
	GenerateTable("video_table_id", "videotable", response, 'Video');
	GenerateTable("sensor_table_id", "sensortable", response, 'Sensor');
	GenerateTable("routtingalgorith_table_id", "routtingalgorithtable", response, 'Routing Algorithm');
	GenerateTable("gaming_table_id", "gamingtable", response, 'Gaming');
	GenerateTable("dedicatedserver_table_id", "dedicatedservertable", response, 'Dedicated Bearer service');
	GenerateTable("smsbearer_table_id", "smsbearertable", response, 'SMS Bearer');
	GenerateTable("mobility", "mobilitytable", response, 'Mobility');
	GenerateTable("radiocoverage_table_id", "radiocoveragetable", response, 'Radio Coverage');
	GenerateTable("radiocapacity_table_id", "radiocapacitytable", response, 'Radio Capacity');
	GenerateTable("networklatency_table_id", "networklatencytable", response, 'Network Latency');
	GenerateTable("candmprocessing_table_id", "candmprocessingtable", response, 'Cloud and MEC Processing');
}

function GenerateTable(tableid, tableclass, data, subtype) {
	//debugger
	var ShortDescription;
	var HighValue;
	var Unit;
	var LowOperator;
	var HighOperator;
	var LowValue;
	if (typeof (data) != 'undefined' && data != []) {
		var count = 0;
		var html = '';
		html += '<table id="' + tableid + '" class="display" style="width:100%">';
		html += '<thead>';
		html += '<tr>';
		html += '<tr>';
		html += '<th style="display:none">ID</th>';
		html += '<th>Performance Indicators</th>';
		html += '<th>Green</th>';
		html += '<th>Red</th>';
		html += '</tr>';
		html += '</thead>';
		html += '<tbody>';
		html += '<tr>';
		if (data != 'undefined' && data != null && data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].KPISubType == subtype) {
					ShortDescription = data[i].ShortDescription || "";
					HighValue = data[i].HighValue || "";
					Unit = data[i].Unit || "";
					LowOperator = data[i].LowOperator || "";
					LowValue = data[i].LowValue || "";
					HighOperator = data[i].HighOperator || "";
					count++;
					html += '<td style="display:none" class ="piid">' + data[i].PIId  + '</td >';
					html += '<td>' + ShortDescription + '</td >';
					html += '<td>' + HighOperator + ' ' + HighValue + ' ' + Unit + '</td >';
					html += '<td>' + LowOperator + ' ' + LowValue + ' ' + Unit + '</td >';
					html += '</tr>';
				}
			}
		}
		html += '</tbody>';
		html += '</table>';
		if (count > 0) {
			$('.' + tableid + '_graph').removeClass('isDisabled')
			$('.' + tableclass).empty().append(html);
			$(document).ready(function () {
				var table = $('#' + tableid).DataTable({
					searching: false,
					paging: false,
					info: false,
				});
				var id;
				$('#' + tableid + ' tbody').on('click', 'tr', function () {
					if ($(this).hasClass('selected')) {
						$(this).removeClass('selected');
						id = -1;
						$('.' + tableid + '_edit').addClass('isDisabled')
						$('.' + tableid + '_delete').addClass('isDisabled')
						SelectedItem(tableid, id);
					}
					else {
						table.$('tr.selected').removeClass('selected');
						$(this).addClass('selected');
						id = $('#' + tableid + ' .selected .piid').text()
						$('.' + tableid + '_edit').removeClass('isDisabled')
						$('.' + tableid + '_delete').removeClass('isDisabled')
						SelectedItem(tableid, id);
					}
				});
			});
		} else {
			$('.' + tableclass).empty();
			$('.' + tableid + '_graph').addClass('isDisabled')
		}
	}
	ShowTableButton(tableid, 'graph');
	ShowTableButton(tableid, 'add');
	ShowTableButton(tableid, 'edit');
	ShowTableButton(tableid, 'delete');
	HideTableButton(tableid, 'table');
	DisableTableButtons_EditDelete(tableid);
}
//generateEgtnNodeDatatableMoni();

function FillGrid_ExperimentResultsEvaluation(id) {
	console.log('welcome');
    $('.experimentresults_data_area').hide();
    data = RetrieveSingleExperimentResultsEvaluation(id);
    debugger;
    var date = DateConversion(data.EntryDate)
    var filename = data.ExcelFileName;

    $('#uc_date_id2').val(date);
    var datatable = [];
    datatable = JSON.parse(data.Data.replace(/\\/g, ""));
    var html = '';
    html += '<table id="SingleExperimentResultsEvaluation123" class="display" style="width:100%">';
    html += '<thead>';
    html += '<tr>';
    for (var i = 0; i < Object.keys(datatable[0]).length; i++)
        html += '<th>' + (Object.keys(datatable[0]))[i] + '</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    for (var i = 0; i < datatable.length; i++) {
        html += '<tr>';
        for (var j = 0; j < Object.keys(datatable[0]).length; j++)
            html += '<td>' + datatable[i][Object.keys(datatable[0])[j]] + '</td >';
        html += '</tr>';
    }
	html += '</tbody>';
	html += '<tfoot>'
	html +=	'< tr >'
	for (var i = 0; i < Object.keys(datatable[0]).length; i++)
		html += '<th>' + (Object.keys(datatable[0]))[i] + '</th>';
	html += '</tr>';
    html += '</tfoot >'
    html += '</table>';
    $('.experimentresultsevaluation_table1').empty().append(html);
	alert('test==--' + html);
    $(document).ready(function () {
        table = $('#SingleExperimentResultsEvaluation').DataTable();
    });
    setTimeout(function () {
        datatable_addexcelname_area(filename)
        $('.experimentresults_data_area').show();

    }, 250);
    //$('.experimentresultsevaluation_table').show();
}


