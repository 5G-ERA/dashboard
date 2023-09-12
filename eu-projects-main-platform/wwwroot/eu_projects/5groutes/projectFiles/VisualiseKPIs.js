function RetrieveKPI_JS_Graphs(scenario_id) {
	var kips = []
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			kips = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return kips;
}

function RetrieveCompositeKpiTypes() {

	var compositeKpiTypes = []
	var projectid = parseInt($('#project_id').val())
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveCompositeKPIsPerProject",
        data: { projectId: projectid },
        success: function (response) {
			compositeKpiTypes = JSON.parse(response.result);
        },
        error: function (error) {

        }
	});
    return compositeKpiTypes;
}

function GenerateCompositeKPITypes_JS_Tables(compositeKpiTypes) {
	var count = 0;

	$('#treshold_bloc_title').empty().append('<p>UC Status PI Thresholds</p>');

	$('#uc_threshold_config_left_block').empty(); //Clean left bloc
	$('#uc_threshold_config_right_block').empty(); //Clean right bloc

	for (var kpiType in compositeKpiTypes) {

		var kpiTypeName = compositeKpiTypes[kpiType].KpiSubTypeCode;
		var kpiTypeId = compositeKpiTypes[kpiType].KpiSubTypeID;

		var html = '<div class="tablemain">'
        html+= '		<div class="row">'
		html += '			<div class="col-4">'
		html += '				<div class="headtabletitle">'+ kpiTypeName +'</div>'
		html += '			</div>'
		html += '			<div class="col-8 main-buttons-with-icons" style="text-align:right">'
		//html += '<input class="fa fa-input btn btn-primary  localisation_table_id_graph" type="button" value="Graph &#xf200" onclick="LocalizationGraph()">*@
		//html += '<input class="fa fa-input btn btn-primary localisation_table_id_table tableviewbutton tableviewbutton" type="button" value="Table &#xf0ce" onclick="LocalizationTableView()">*@
		//html += '<input class="fa fa-input btn btn-primary  localisation_table_id_add" type="button" value="Add &#xf067" onclick="AddKpiHandler(' + kpiTypeName +')">'
		//html += '<input class="fa fa-input btn btn-primary  localisation_table_id_edit isDisabled" type="button" value="Edit &#xf044" onclick="EditKpiHandler(' + kpiTypeName +')">'
		//html += '<input class="fa fa-input btn btn-primary  localisation_table_id_delete isDisabled" type="button" value="Delete &#xf2ed" onclick="DeleteKPIHandler(' + kpiTypeName +')">'
		//html += '<button class="localisation_table_id_graph" onclick="LocalizationGraph()" type="button">Graph<i class="marginicon fas fa-chart-pie"></i></button>
		//html += '<button class="localisation_table_id_table tableviewbutton" onclick="LocalizationTableView()" type="button">Table<i class="marginicon fas fa-table"></i></button>
		html += '			<button class="' + kpiTypeName + '_table_id_add threshold_table_button" onclick="AddKpiHandler(' + kpiTypeId +',\'' + kpiTypeName +'\')" type="button">Add<i class="marginicon fas fa-plus"></i></button>'
		html += '			<button class="' + kpiTypeName + '_table_id_edit threshold_table_button isDisabled" onclick="EditKpiHandler(' + kpiTypeId + ',\'' + kpiTypeName +'\')" type="button">Edit<i class="marginicon fas fa-edit"></i></button>'
		html += '			<button class="' + kpiTypeName + '_table_id_delete threshold_table_button isDisabled" onclick="DeleteKPIHandler(\'' + kpiTypeName +'\')" type="button">Delete<i class="marginicon fas fa-trash"></i></button>'

		html += '		</div>'
		html += '	</div>'


		html += '	<div class="row">'
		html += '		<div class="col-sm-12 ">'
		html += '			<hr style="width:100%;text-align:center;margin-left:0">'
		html += '		</div>'
		html += '	</div>'

		html += '	<div class="col-sm-12 table_class">'
		html += '		<div class="' + kpiTypeName +'_kpi_threshold_tab">'
		html += '		</div>'
		html += '	</div>'
		html += '</div>'
		html += '<div class="paddingtop25px"></div >'

		if (count % 2 == 1) {
            $('#uc_threshold_config_right_block').append(html);
        } else {
            $('#uc_threshold_config_left_block').append(html);
        }
        count++;
    }
}


function GenerateMeasurement_JS_Tables(compositeKpiTypes) {
	var count = 0;

	$('#uc_measurement_right_block').empty();
	$('#uc_measurement_left_block').empty();

	var scenario_name = $('#scenariodesc_id').find(":selected").text();

	for (var kpiType in compositeKpiTypes) {

		var kpiTypeName = compositeKpiTypes[kpiType].KpiSubTypeCode;
		var kpiTypeId = compositeKpiTypes[kpiType].KpiSubTypeID;

		var html = '<div class="tablemain">'
		html += '		<div class="row">'
		html += '			<div class="col-4">'
		html += '				<div class="headtabletitle">' + kpiTypeName + '<b id="' + kpiTypeId + '_Percentage_value" style="margin-left: 5px"></b></div>'
		html += '			</div>'
		html += '			<div id="' + kpiTypeId+'_val_tab_btn" class="col-8 main-buttons-with-icons" style="text-align:right">'
		//html += '<input class="fa fa-input btn btn-primary  localisation_table_id_graph" type="button" value="Graph &#xf200" onclick="LocalizationGraph()">*@
		//html += '<input class="fa fa-input btn btn-primary localisation_table_id_table tableviewbutton tableviewbutton" type="button" value="Table &#xf0ce" onclick="LocalizationTableView()">*@
		//html += '<input class="fa fa-input btn btn-primary  localisation_table_id_add" type="button" value="Add &#xf067" onclick="AddKpiHandler(' + kpiTypeName +')">'
		//html += '<input class="fa fa-input btn btn-primary  localisation_table_id_edit isDisabled" type="button" value="Edit &#xf044" onclick="EditKpiHandler(' + kpiTypeName +')">'
		//html += '<input class="fa fa-input btn btn-primary  localisation_table_id_delete isDisabled" type="button" value="Delete &#xf2ed" onclick="DeleteKPIHandler(' + kpiTypeName +')">'
		//html += '<button class="localisation_table_id_graph" onclick="LocalizationGraph()" type="button">Graph<i class="marginicon fas fa-chart-pie"></i></button>
		//html += '<button class="localisation_table_id_table tableviewbutton" onclick="LocalizationTableView()" type="button">Table<i class="marginicon fas fa-table"></i></button>
		//html += '			<button class="' + kpiTypeName + '_table_id_add threshold_table_button" onclick="AddKpiHandler(\'' + kpiTypeName + '\')" type="button">Add<i class="marginicon fas fa-plus"></i></button>'
		//html += '			<button class="' + kpiTypeId + '_table_value_id_graph threshold_table_button measure_btn_graph" onclick="DisplayCompositeKpiGraph(' + kpiTypeId + ')" type="button">Graph<i class="marginicon fa-solid fa-chart-area"></i></button>'
		html += '			<button class="' + kpiTypeId + '_table_value_id_edit threshold_table_button measure_btn_edit" onclick="EditKpiMeasurementValues(' + kpiTypeId + ')" type="button">Edit<i class="marginicon fas fa-pencil"></i></button>'
		html += '			<button class="' + kpiTypeId + '_table_value_id_cancel threshold_table_button measure_btn_saveOrcancel" onclick="DiscardKpiMeasurementValues(' + kpiTypeId + ')" type="button">Cancel<i class="marginicon fas fa-cancel"></i></button>'
		html += '			<button class="' + kpiTypeId + '_table_value_id_save threshold_table_button measure_btn_saveOrcancel" onclick="SaveKpiMeasurementValues(' +kpiTypeId +')" type="button">Save<i class="marginicon fas fa-save"></i></button>'
		html += '			<button class="' + kpiTypeId + '_table_value_id_reset threshold_table_button isDisabled" onclick="ResetKpiMeasurementValues(' + kpiTypeId + ')" type="button">Reset<i class="marginicon fas fa-arrow-rotate-right"></i></button>'

		html += '		</div>'
		html += '	</div>'


		html += '	<div class="row">'
		html += '		<div class="col-sm-12 ">'
		html += '			<hr style="width:100%;text-align:center;margin-left:0">'
		html += '		</div>'
		html += '	</div>'

		html += '	<div class="col-sm-12 table_class">'
		html += '		<div class="' + kpiTypeId + '_kpi_measurement_values_tab">'
		html += '		</div>'
		html += '	</div>'
		html += '</div>'
		html += '<div class="paddingtop25px"></div >'

		if (count % 2 == 1) {
			$('#uc_measurement_right_block').append(html);
		} else {
			$('#uc_measurement_left_block').append(html);
		}
		count++;
	}

	$('#uc_measurement_right_block').append('<div class="col-12" id="test_spider_chart"></div>') //Adding Spider chart bloc
	
}

function VisualizeApplicationGraphs() {
	//debugger;
	if ($($('#headingOne').find('.accordion-button')).attr('aria-expanded') == "true") {
		LocalizationGraph();
		TrajectoryGraph();
		SafetyGraph();
		CITsMessageGraph();
		VideoGraph();
		SensorGraph();
		RoutingAlorithmGraph();
		GamingGraph();
	}
}

function VisualizeServiceGraphs() {
	if ($($('#headingTwo').find('.accordion-button')).attr('aria-expanded') == "true") {
		DedicatedBearerServiceGraph();
		MobilityGraph();
		SMSBearerGraph();
	}
}

function VisualizeNetworkGraphs() {
	if ($($('#headingThree').find('.accordion-button')).attr('aria-expanded') == "true") {
		RadioCoverageGraph();
		RadioCapacityGraph();
		NetworkLatencyGraph();
		CloudandMECProcessingGraph();
	}
}

function VisualizeAllGraphs() {
	VisualizeApplicationGraphs()
	VisualizeServiceGraphs()
	VisualizeNetworkGraphs()
	$('.localisation_table_id_table').show();
	$('.trajectory_table_id_table').show();
	$('.safety_table_id_table').show();
	$('.citsmessage_table_id_table').show();
	$('.video_table_id_table').show();
	$('.sensor_table_id_table').show();
	$('.routtingalgorith_table_id_table').show();
	$('.gaming_table_id_table').show();
	$('.dedicatedserver_table_id_table').show();
	$('.smsbearer_table_id_table').show();
	$('.mobility_table').show();
	$('.radiocoverage_table_id_table').show();
	$('.radiocapacity_table_id_table').show();
	$('.networklatency_table_id_table').show();
	$('.candmprocessing_table_id_table').show();
}

function TrajectoryTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('#trajectory_table_id').empty();
			GenerateTable("trajectory_table_id", "trajectorytable", data, 'Trajectory');
			$('#KPItables').show();
		},
		error: function (error) {

		}
	});
	$('.trajectory_table_id_table').hide();
	$('.trajectory_table_id_add').show();
	$('.trajectory_table_id_edit').show();
	$('.trajectory_table_id_delete').show();
}

function LocalizationTableView() {
	var scenario_id = $('#scenariodesc_id').val();
	let data;
	$.ajax({

		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('#localisation_table_id').empty();
			GenerateTable("localisation_table_id", "localisationtable", data, 'Localisation');
			$('#KPItables').show();

		},
		error: function (error) {

		}
	});
	$('.localisation_table_id_table').hide();
	$('.localisation_table_id_add').show();
	$('.localisation_table_id_edit').show();
	$('.localisation_table_id_delete').show();
}


function LocalizationGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;
	console.log(kpis);
	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Localisation') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}


	//debugger;
	html = '<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.localisationtable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainer", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues
		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues

		}]
	});
	chart.render();
	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.localisation_table_id_add').hide();
	$('.localisation_table_id_edit').hide();
	$('.localisation_table_id_delete').hide();
	$('.localisation_table_id_table').show();
	$('.localisation_table_id_graph').hide();
}




function TrajectoryGraph() {
	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;
	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {
		if (kpis[i].KPISubType == 'Trajectory') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}
	html = '<div id="chartContainerTrajectory" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.trajectorytable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainerTrajectory", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,
		axisX: {
			title: "KPI"
		},
		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.trajectory_table_id_add').hide();
	$('.trajectory_table_id_edit').hide();
	$('.trajectory_table_id_delete').hide();
	$('.trajectory_table_id_table').show();
	$('.trajectory_table_id_graph').hide();

}


function SafetyTableView() {
	var scenario_id = $('#scenariodesc_id').val();
	let data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('#safety_table_id').empty();
			GenerateTable("safetytable_table_id", "safetytable", data, 'Safety');
			$('#KPItables').show();


		},
		error: function (error) {

		}
	});
	$('.safetytable_table_id_table').hide();
	$('.safetytable_table_id_add').show();
	$('.safetytable_table_id_edit').show();
	$('.safetytable_table_id_delete').show();
}


function SafetyGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Safety') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainerSafety" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.safetytable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainerSafety", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.safetytable_table_id_add').hide();
	$('.safetytable_table_id_edit').hide();
	$('.safetytable_table_id_delete').hide();
	$('.safetytable_table_id_table').show();
	$('.safetytable_table_id_graph').hide();

}


function CITsMessageTableView() {
	var scenario_id = $('#scenariodesc_id').val();
	let data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('#safety_table_id').empty();
			GenerateTable("citsmessage_table_id", "citsmessagetable", data, 'C-ITs message');

			$('#KPItables').show();


		},
		error: function (error) {

		}
	});
	$('.citsmessage_table_id_table').hide();
	$('.citsmessage_table_id_add').show();
	$('.citsmessage_table_id_edit').show();
	$('.citsmessage_table_id_delete').show();
}

function CITsMessageGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'C-ITs message') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainerCITMessage" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.citsmessagetable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainerCITMessage", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.citsmessage_table_id_add').hide();
	$('.citsmessage_table_id_edit').hide();
	$('.citsmessage_table_id_delete').hide();
	$('.citsmessage_table_id_table').show();
	$('.citsmessage_table_id_graph').hide();

}

function VideoTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('#video_table_id').empty();
			GenerateTable("video_table_id", "videotable", data, 'Video');
			$('#KPItables').show();

		},
		error: function (error) {

		}
	});
	$('.video_table_id_table').hide();
	$('.video_table_id_add').show();
	$('.video_table_id_edit').show();
	$('.video_table_id_delete').show();
}

function VideoGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Video') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainerVIDEO" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.videotable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainerVIDEO", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.video_table_id_add').hide();
	$('.video_table_id_edit').hide();
	$('.video_table_id_delete').hide();
	$('.video_table_id_table').show();
	$('.video_table_id_graph').hide();

}

function SensorGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Sensor') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainerSensor" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.sensortable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainerSensor", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.sensor_table_id_add').hide();
	$('.sensor_table_id_edit').hide();
	$('.sensor_table_id_delete').hide();
	$('.sensor_table_id_table').show();
	$('.sensor_table_id_graph').hide();

}

function SensorTableView() {
	var scenario_id = $('#scenariodesc_id').val();
	let data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.sensortable').empty();
			GenerateTable("sensor_table_id", "sensortable", data, 'Sensor');

			$('#KPItables').show();


		},
		error: function (error) {

		}
	});
	$('.sensor_table_id_table').hide();
	$('.sensor_table_id_add').show();
	$('.sensor_table_id_edit').show();
	$('.sensor_table_id_delete').show();
}

function RoutingAlorithmGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Routing Algorithm') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainerra" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.routtingalgorithtable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainerra", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.routtingalgorith_table_id_add').hide();
	$('.routtingalgorith_table_id_edit').hide();
	$('.routtingalgorith_table_id_delete').hide();
	$('.routtingalgorith_table_id_table').show();
	$('.routtingalgorith_table_id_graph').hide();


}

function RoutingAlorithmTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.routtingalgorithtable').empty();
			GenerateTable("routtingalgorith_table_id", "routtingalgorithtable", data, 'Routing Algorithm');
			$('#KPItables').show();
		},
		error: function (error) {

		}
	});
	$('.routtingalgorith_table_id_table').hide();
	$('.routtingalgorith_table_id_add').show();
	$('.routtingalgorith_table_id_edit').show();
	$('.routtingalgorith_table_id_delete').show();
}

function GamingGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Gaming') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainergaming" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.gamingtable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainergaming", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.gaming_table_id_add').hide();
	$('.gaming_table_id_edit').hide();
	$('.gaming_table_id_delete').hide();
	$('.gaming_table_id_table').show();
	$('.gaming_table_id_graph').hide();


}

function GamingTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.gamingtable').empty();
			GenerateTable("gaming_table_id", "gamingtable", data, 'Gaming');
			$('#KPItables').show();
		},
		error: function (error) {

		}
	});
	$('.video_table_id_table').hide();
	$('.video_table_id_add').show();
	$('.video_table_id_edit').show();
	$('.video_table_id_delete').show();
}

function DedicatedBearerServiceGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Dedicated Bearer service') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainerdservice" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.dedicatedservertable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainerdservice", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.dedicatedserver_table_id_add').hide();
	$('.dedicatedserver_table_id_edit').hide();
	$('.dedicatedserver_table_id_delete').hide();
	$('.dedicatedserver_table_id_table').show();
	$('.dedicatedserver_table_id_graph').hide();


}

function DedicatedBearerServiceTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.dedicatedservertable').empty();
			GenerateTable("dedicatedserver_table_id", "dedicatedservertable", data, 'Dedicated Bearer service');
			$('#KPItables').show();
		},
		error: function (error) {

		}
	});
	$('.dedicatedserver_table_id_table').hide();
	$('.dedicatedserver_table_id_add').show();
	$('.dedicatedserver_table_id_edit').show();
	$('.dedicatedserver_table_id_delete').show();
}

function SMSBearerGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'SMS Bearer') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainersmsb" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.smsbearertable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainersmsb", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.smsbearer_table_id_add').hide();
	$('.smsbearer_table_id_edit').hide();
	$('.smsbearer_table_id_delete').hide();
	$('.smsbearer_table_id_table').show();
	$('.smsbearer_table_id_graph').hide();

}

function SMSBearerTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.smsbearertable').empty();
			GenerateTable("smsbearer_table_id", "smsbearertable", data, 'SMS Bearer');
			$('#KPItables').show();


		},
		error: function (error) {

		}
	});
	$('.smsbearer_table_id_table').hide();
	$('.smsbearer_table_id_add').show();
	$('.smsbearer_table_id_edit').show();
	$('.smsbearer_table_id_delete').show();
}

function MobilityGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Mobility') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainersmobility" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.mobilitytable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainersmobility", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.mobility_add').hide();
	$('.mobility_edit').hide();
	$('.mobility_delete').hide();
	$('.mobility_table').show();
	$('.mobility_graph').hide();

}

function MobilityTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.mobilitytable').empty();
			GenerateTable("mobility", "mobilitytable", data, 'Mobility');
			$('#KPItables').show();
		},
		error: function (error) {

		}
	});
	$('.mobility_table').hide();
	$('.mobility_add').show();
	$('.mobility_edit').show();
	$('.mobility_delete').show();
}

function RadioCoverageGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Radio Coverage') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainersradiocoverage" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.radiocoveragetable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainersradiocoverage", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.radiocoverage_table_id_add').hide();
	$('.radiocoverage_table_id_edit').hide();
	$('.radiocoverage_table_id_delete').hide();
	$('.radiocoverage_table_id_table').show();
	$('.radiocoverage_table_id_graph').hide();

}

function RadioCoverageTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.radiocoveragetable').empty();
			GenerateTable("radiocoverage_table_id", "radiocoveragetable", data, 'Radio Coverage');
			$('#KPItables').show();


		},
		error: function (error) {

		}
	});
	$('.radiocoverage_table_id_table').hide();
	$('.radiocoverage_table_id_add').show();
	$('.radiocoverage_table_id_edit').show();
	$('.radiocoverage_table_id_delete').show();
}

function RadioCapacityGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Radio Capacity') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainersradiocapacity" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.radiocapacitytable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainersradiocapacity", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.radiocapacity_table_id_add').hide();
	$('.radiocapacity_table_id_edit').hide();
	$('.radiocapacity_table_id_delete').hide();
	$('.radiocapacity_table_id_table').show();
	$('.radiocapacity_table_id_graph').hide();

}

function RadioCapacityTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.radiocapacitytable').empty();
			GenerateTable("radiocapacity_table_id", "radiocapacitytable", data, 'Radio Capacity');
			$('#KPItables').show();
		},
		error: function (error) {

		}
	});
	$('.radiocapacity_table_id_table').hide();
	$('.radiocapacity_table_id_add').show();
	$('.radiocapacity_table_id_edit').show();
	$('.radiocapacity_table_id_delete').show();
}

function NetworkLatencyGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Network Latency') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainersNetworkLatency" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.networklatencytable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainersNetworkLatency", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues



		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.networklatency_table_id_add').hide();
	$('.networklatency_table_id_edit').hide();
	$('.networklatency_table_id_delete').hide();
	$('.networklatency_table_id_table').show();
	$('.networklatency_table_id_graph').hide();

}

function NetworkLatencyTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.networklatencytable').empty();
			GenerateTable("networklatency_table_id", "networklatencytable", data, 'Network Latency');

			$('#KPItables').show();


		},
		error: function (error) {

		}
	});
	$('.networklatency_table_id_table').hide();
	$('.networklatency_table_id_add').show();
	$('.networklatency_table_id_edit').show();
	$('.networklatency_table_id_delete').show();
}

function CloudandMECProcessingGraph() {

	var scenarioid = $('#scenariodesc_id').val()
	var kpis = RetrieveKPI_JS_Graphs(scenarioid);
	var html;

	var _greenValues = [];
	var _redValues = [];
	for (var i = 0; i < kpis.length; i++) {

		if (kpis[i].KPISubType == 'Cloud and MEC Processing') {
			if (!(isNaN(kpis[i].HighValue) && isNaN(kpis[i].LowValue))) {				
				//debugger;
				_greenValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].HighValue) });
				_redValues.push({ label: kpis[i].ShortDescription, y: parseInt(kpis[i].LowValue) });
			}
		}
	}



	html = '<div id="chartContainerscandmprocessingtable" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
	$('.candmprocessingtable').empty().append(html);
	var chart = new CanvasJS.Chart("chartContainerscandmprocessingtable", {
		theme: _graphTheme,
		exportEnabled: true,
		animationEnabled: true,

		axisX: {
			title: "KPI"
		},

		axisY1: {
			title: "Values",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#008000"
		},
		axisY2: {
			title: "Values",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "column",
			name: "Green <",
			showInLegend: true,
			yValueFormatString: "#,##0.#",
			lineColor: "#000000",
			color: '#47753f',
			dataPoints: _greenValues


		},
		{
			type: "column",
			name: "Red >",
			color: '#69122d',
			//axisYType: "secondary",
			showInLegend: true,
			yValueFormatString: "#,##0.# ",
			dataPoints: _redValues
		}]
	});



	chart.render();

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	$('.candmprocessing_table_id_add').hide();
	$('.candmprocessing_table_id_edit').hide();
	$('.candmprocessing_table_id_delete').hide();
	$('.candmprocessing_table_id_table').show();
	$('.candmprocessing_table_id_graph').hide();

}

function CloudandMECProcessingTableView() {
	let data;
	var scenario_id = $('#scenariodesc_id').val();
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
			$('.candmprocessingtable').empty();
			GenerateTable("candmprocessing_table_id", "candmprocessingtable", data, 'Cloud and MEC Processing');

			$('#KPItables').show();


		},
		error: function (error) {

		}
	});
	$('.candmprocessing_table_id_table').hide();
	$('.candmprocessing_table_id_add').show();
	$('.candmprocessing_table_id_edit').show();
	$('.candmprocessing_table_id_delete').show();
}