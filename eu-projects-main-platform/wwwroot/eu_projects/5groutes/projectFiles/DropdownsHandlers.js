var selectedTests = [];

function GenerateUCDropdown(isReadOnly, selectedItemId) {
	var data;
	data = RetrieveUseCases_JS();
    ChosenCreator(data, 'ucdescriptionchosen', 'ucdesc_id', 'Select Use Case', isReadOnly, null);
}

function GenerateScenarioDropdown(usecase_id, selectedItemId) {
	var data;
	data = RetrieveScenarioPerUseCase_JS(usecase_id);
	ChosenCreator(data, 'scenariodescriptionchosen', 'scenariodesc_id', 'Test Scenario Description', false, selectedItemId);
}

function GenerateKpiTypesDropdown() {
	var types = RetrieveKpiTypes_JS();
    //console.log(types);

    CreateKpiTypesDropdown(types);
}

function GenerateTestScenarioDropdown(scenario_id, selectedItemId) {
	var data;
	data = RetrieveTestScenariosPerScenario_JS(scenario_id);
    CreateTestsDropdown(data, selectedItemId);
}

function RetrieveKpiTypes_JS() {
    var res;
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/RetrieveKPITypes",
        success: function (response) {
            res = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return res;
}

function CreateKpiTypesDropdown(types) {
    var html = '<select id="type_id">';
	for (var i = 0; i < types.length; i++) {
        html += '<option value="' + types[i].KpiTypeId + '">' + types[i].KpiTypeCode + '</option>';
	}

	html += '</select>';
	$('#type_id_selector').empty().append(html);

	//Apply styling now
    $('#type_id').chosen({ search_contains: true });

}

function CreateTestsDropdown(tests, selectedItemId) {
	var html = '<select id="testscenariodesc_id" onchange="Test_Scenario_Onchange()">';
	for (var i = 0; i < tests.length; i++) {
        if (i == 0) html += '<option selected value="">Select an Option</option>';
		html += '<option value="' + tests[i].TestScenarioId + '">' + tests[i].TestScenarioName + '</option>';
    }

	html += '</select>';
	$('#test_scenario_selector').empty().append(html);

    if (selectedItemId != 'undefined' && !isNaN(selectedItemId) && selectedItemId != null) {
		$('#testscenariodesc_id').val(selectedItemId);
    }
    $('#testscenariodesc_id').chosen({ search_contains: true });
}

function CreateEmptyTestDropdown() {
	var html = '<select id="testscenariodesc_id" placeholder="Select a Scenario Test" disabled></select>';
    $('#test_scenario_selector').empty().append(html);
    $('#testscenariodesc_id').chosen({ search_contains: true });
}

function ChosenCreator(data, chosenclass, closenid, title, isReadOnly, selectedItemId) {
	var html = '';
	$('.' + chosenclass).empty();
    html += '<div class="col-md-2 col-sm-12">'
    html += '<label">' + title + '</label>'
	
	html += '</div>'
	if (closenid == 'ucdesc_id') {
		html += '<div class="col-md-6 col-12">'
		html += '<select id="' + closenid + '" onchange = "UC_Description_OnChange()">'
	}
	else if (closenid == 'scenariodesc_id') {
		html += '<div class="col-md-10 col-12">'
		html += '<select id="' + closenid + '" onchange = "Scenario_Description_OnChange()">'
	}
	debugger
	for (var i = 0; i < data.length; i++) {
		if (title == 'Select Use Case') {
			if (i == 0) html += '<option selected value="">Select an Option</option>'
			html += '<option value="' + data[i].UseCaseId + '">' + data[i].UseCaseId + ' - ' + data[i].UseCaseDescription + '</option>';
		}
		if (title == 'Test Scenario Description') {
			if (i == 0) html += '<option selected value="">Select an Option</option>'
			html += '<option value="' + data[i].UseCaseScenarioId + '">' + data[i].UseCaseScenarioId + ' - ' + data[i].UseCaseScenarioDescription + '</option>';
		}
	}
	html += '</select>'
	html += '</div>'
	if (title == 'Select Use Case') {
		html += '<div class="col-md-4 col-12 scnariobuttons main-buttons-with-icons buttons-margin-top">'
		if (!isReadOnly) {
            html += '<button class="editbuttonuc" onclick = "EditUseCase()" type = "button">Edit<i class="marginicon fas fa-edit"></i></button>'
            html += '<button class="savebutton sacecancelbuttonoc" onclick = "SaveUseCase()" type = "button">Save<i class="marginicon fas fa-save"></i></button>'
            html += '<button class="sacecancelbuttonoc" onclick = "CancelEdit()" type = "button">Cancel<i class="marginicon fas fa-window-close"></i></button>'
        }
		
		html += '</div>'
	}

	if (title == 'Test Scenario DesSCENARIO_ShowAddButtonSCENARIO_ShowAddButtoncription' && $('.titlepage')[0].innerText === 'Test Scenarios') {

		//ADD Scenario Details Fields

		//OLD BUTTONS
		html += '</div>'
		html += '<div class="col-md-12 col-12 scnariobuttons main-buttons-with-icons scenariobuttons">'
		html += '<button class="addnewscenariobutton scenariobuttons" onclick = "AddNewScenario()" type = "button">Add new Scenario<i class="marginicon fas fa-plus"></i></button>'
		html += '<button class="editscenariobutton scenariobuttons" onclick = "EditScenario()" type = "button">Edit Scenario<i class="marginicon fas fa-edit"></i></button>'
		html += '<button class="deletescenariobutton scenariobuttons" onclick = "DeleteScenario()" type = "button">Delete Scenario<i class="marginicon fas fa-trash"></i></button>'
		html += '<button class="scenarioduplicate scenariobuttons" onclick = "OverWriteScenario()" type = "button">Duplicate Existing Scenario<i class="marginicon fas fa-clone"></i></button>'
		//html += '<button class="experimentresultsevaluationbutton scenariobuttons" onclick = "ExperimentResultsEvaluation()" type = "button">Experiment Results Evaluation<i class="marginicon fas fa-th"></i></button>'
		//html += '<button class="visualisekpi scenariobuttons" onclick = "VisualiseKPIs()" type = "button">Visualise PIs<i class="marginicon fas fa-chart-pie"></i></button>'
		//html += '<button class="configurekpi scenariobuttons" onclick = "PerformanceIndicators()" type = "button">Configure KPI<i class="marginicon fas fa-table"></i></button>'
		html += '</div>'
		html += '</div>'
	}

    html += '</div>'
	$('.' + chosenclass).append(html);

	if (selectedItemId != 'undefined' && !isNaN(selectedItemId) && selectedItemId != null) {
        $('#' + closenid).val(selectedItemId);
    }

	$('#' + closenid).chosen({ search_contains: true });
	UC_HideEditButton();
	UC_HideSaveCancelButtons()
	SCENARIO_HideAddButton();
	SCENARIO_HideEditButton();
	SCENARIO_HideDeleteButton();
	SCENARIO_HideDuplicateButton()
	HideButton('visualisekpi');
	HideButton('configurekpi');
}

function UC_Description_OnChange() {
	var usecase_id;
	usecase_id = $('#ucdesc_id').val();
	uidc = $('#ucdesc_id').val();
	document.cookie = "uid=" + usecase_id;
	
	HideKPITables();
    //debugger;
	if (usecase_id == 0 || usecase_id == '') {
		
		UC_HideEditButton();
		SCENARIO_HideAddButton();
		SCENARIO_HideEditButton();
		SCENARIO_HideDeleteButton();
		UC_HideSaveCancelButtons();
        SCENARIO_HideExperimentResultsEvaluationButton();
		$('#uc_description_id')[0].readOnly = true;
		$('#uc_responsible_id')[0].readOnly = true;
		$('#uc_contact_id')[0].readOnly = true;
		$('#uc_date_id')[0].readOnly = true;
		$('.experimentresults_dropdown_area').hide();
		$('.experimentresults_data_area').hide();
		UC_ResetUseCaseSection();

        scenario_id = $('#scenariodesc_id').val();
        var testScenario_id = $('#testscenariodesc_id').val();

        if (parseInt(scenario_id) != 0 || isNaN(parseInt(scenario_id))) {
			ResetScenarioSection();
			var html = '<div class="col-sm-2">'
                html += '<label> Test Scenario Description</label>'
                html += '</div>'
                html += '<div class="col-sm-9">'
                html += '<select id="scenariodesc_id" disabled data-placeholder="Please choose a Scenario First">'
                html += '</select>'
                html += '</div>'
			$('.scenariodescriptionchosen').empty().append(html);
            $('#scenariodesc_id').chosen({ search_contains: true });
        }

        if (parseInt(testScenario_id) != 0 || isNaN(parseInt(testScenario_id))) {
            ResetTestSection();
        }
    }
	else {
        GenerateScenarioDropdown(usecase_id, null);
        Fill_UseInfo(usecase_id);

        ResetScenarioSection();

		UC_ShowEditButton();
		UC_HideSaveCancelButtons();

		var compositeKpiTypes = RetrieveCompositeKpiTypes();
		GenerateCompositeKPITypes_JS_Tables(compositeKpiTypes);

        FillThresholdTablesWithData(usecase_id); //Populate Threshold values

		UC_HideThresholdUseCaseConfigButtons(); //Disable Config buttons
		
		SCENARIO_ShowAddButton();
        SCENARIO_HideExperimentResultsEvaluationButton();
		$('#uc_description_id')[0].readOnly = true;
		$('#uc_responsible_id')[0].readOnly = true;
		$('#uc_contact_id')[0].readOnly = true;
		$('#uc_date_id')[0].readOnly = true;
	}
	SCENARIO_HideDuplicateButton();
    $('.secondarybuttons').hide();
    $('.addnewscenariodropdown').addClass('borderradius');
    $('.viewbuttons').hide();
}

function Scenario_Description_OnChange() {
	var scenario_id;
	scenario_id = $('#scenariodesc_id').val();
	var testScenario_id = $('#testscenariodesc_id').val();
	
	document.cookie = "uid=" + scenario_id;
	if (scenario_id == 0) {
		$('.secondarybuttons').hide()
		$('.addnewscenariodropdown').addClass('borderradius')
		SCENARIO_HideEditButton()
		SCENARIO_HideDeleteButton()
		SCENARIO_HideDuplicateButton()
		SCENARIO_HideVisualiseKpiButton()
		SCENARIO_HideConfigureKpiKpiButton()
		SCENARIO_HideExperimentResultsEvaluationButton()
		HideKPITables();
		TSCENARIO_HideStopNetworkServiceButton();
		TSCENARIO_HideStopTestButton();
		$('.viewbuttons').hide()

		if (parseInt(scenario_id) != 0 || isNaN(parseInt(scenario_id))) {
			ResetScenarioSection();
        }

	} else {
		//$('.secondarybuttons').show()
		$('.addnewscenariodropdown').removeClass('borderradius')
		//$('.viewbuttons').show();

        ResetTestSection();
        $('#testDescriptionFieldbloc').empty();

        SCENARIO_ShowEditButton();
        SCENARIO_ShowDeleteButton();
		SCENARIO_ShowDuplicateButton();
        SCENARIO_HideExperimentResultsEvaluationButton();
		UCShowAnalyticTab();
        //SCENARIO_ClearGraphsBlock();
        ClearSelectedTestCache();

        SCENARIO_ShowDetailedScenarioInfo(scenario_id);

  //      var compositeKpiTypes = RetrieveCompositeKpiTypes();
  //      GenerateMeasurement_JS_Tables(compositeKpiTypes);

  //      //FillThresholdTablesWithData(usecase_id); //Populate Threshold values
		//FillScenarioMeasurementTablesWithData(scenario_id);

		GenerateTestScenarioDropdown(scenario_id, null);
		TSCENARIO_ShowTestScenarioButtonBloc();
        TSCENARIO_HideSelectedTestStatus();
		TSCENARIO_HideAddButton();
		TSCENARIO_HideEditButton();
        TSCENARIO_HideDeleteButton();
		TSCENARIO_HideStopTestButton();

		TSCENARIO_HideStopNetworkServiceButton();
		TSCENARIO_HideStopTestButton();
		//var scenario_name = $('#scenariodesc_id').find(":selected").text();
        var scenario_name = $('#raw_test_name').val();

		var compositeKpiTypes = RetrieveCompositeKpiTypes();
		var testScenarios = RetrieveTestScenariosPerScenario_JS(scenario_id);
		var graphValues = [];

		//Set Default value
        var testScenarioValues = [null, null, null, null, null];
        graphValues.push({ values: testScenarioValues, text: null });

        GenerateScenarioAnalyticLegend(testScenarios);
		
		ShowAllScenarioGraphs(scenario_name, compositeKpiTypes, graphValues);
    }


	if (view == 'resultsevaluation') {
		if (scenario_id > 0) {
			//debugger;
			GenerateExperimentResultsDropdown();
			$('.experimentresults_dropdown_area').show();
			$('.experimentresults_data_area').hide();
		}
		else {
			$('.experimentresults_dropdown_area').hide();
			$('.experimentresults_data_area').hide();
		}
	}
}

function Test_Scenario_Onchange() {
	var testScenario_id = $('#testscenariodesc_id').val();
    var test_scenario_name = $('#testscenariodesc_id').find(":selected").text();
	var scenario_id = $('#scenariodesc_id').val();
	var usecase_id = $('#ucdesc_id').val();
	if (testScenario_id == 0) {
        TSCENARIO_HideDeleteButton();
		TSCENARIO_HideEditButton();
		TSCENARIO_HideStopTestButton();
		TSCENARIO_HideAddButton();
		TSCENARIO_HideStopNetworkServiceButton();
        $('#testDescriptionFieldbloc').empty();

		$('.experimentresults_dropdown_area').hide();
		$('.experimentresults_data_area').hide();

		if (parseInt(testScenario_id) != 0 || isNaN(parseInt(testScenario_id))) {
			ResetTestSection();
			GenerateTestScenarioDropdown(scenario_id, null);

        }
    } else {
		
		TSCENARIO_ShowAddButton();
		TSCENARIO_ShowEditButton();
		TSCENARIO_ShowDeleteButton();
		TSCENARIO_HideStopNetworkServiceButton();
		TSCENARIO_HideStopTestButton();
		var compositeKpiTypes = RetrieveCompositeKpiTypes();
		GenerateMeasurement_JS_Tables(compositeKpiTypes);
		
        //FillThresholdTablesWithData(usecase_id); //Populate Threshold values
		FillTestScenarioMeasurementTablesWithData(usecase_id);
		//debugger;
		var testScenarioPercentageValues = RetrieveAllTestMeasurementValuesPerTest(testScenario_id);
		var kpis = [];
        var values = [];

		for (var x in testScenarioPercentageValues) {
			kpis.push(testScenarioPercentageValues[x].KpiSubTypeCode);
            values.push(testScenarioPercentageValues[x].PercentageValue);
        }

		var testScenario = RetrieveTestScenarioDetailsPerId(testScenario_id);

        ShowTestScenarioSpiderGraph(testScenario, kpis, values);

        TSCENARIO_ShowDetailedTestInfo(testScenario_id);
		

		ShowKPITables();

		GenerateTestAttachmentSection(testScenario_id);
		GenerateExperimentResultsDropdown(testScenario_id);

		$('.experimentresults_dropdown_area').show();
		$('.experimentresults_data_area').hide();
    }
}

function GenerateExperimentResultsDropdown(testscenarioid) {
	if (testscenarioid == 'undefined' || testscenarioid == null || testscenarioid == 0)
		testscenarioid = $('#scenariodesc_id').val()
	data = RetrieveExperimentResultsEvaluationPerScenarioID(testscenarioid);
    var html = '';
    $('.experimentresultsevaluationchosen').empty();
    html += '<div class="col-md-2 col-sm-12">'
    html += '<label">Test Results</label>'
    html += '</div>'
    html += '<div class="col-md-6 col-12">'
    html += '<select id="experimentresults_dropdown_id" onchange = "ExperimentResultsDropdownOnChange()">'

    for (var i = 0; i < data.length; i++) {
		if (i == 0) html += '<option selected value="">Select an Option</option>'
        html += '<option value="' + data[i].ExperimentResultsEvaluationId + '">' + data[i].Name + '</option>';
    }
    html += '</select>'
    html += '</div>'
    html += '<div class="col-md-1 col-sm-12">'
    html += '<label">Date</label>'
    html += '</div>'
    html += '<div class="col-md-3 col-sm-12 ExperimentResultsDropdown">'
    html += '<input type="date" id="uc_date_id2" readonly="">';
    html += '</div>'
    //buttons
    html += '</div>'
    html += '<div class="col-md-12 col-12 scnariobuttons main-buttons-with-icons scenariobuttons">'
    html += '<button class="addnewexperimentresultbutton scenariobuttons" onclick = "AddNewExperimentResult()" type = "button">Add new Test Result<i class="marginicon fas fa-plus"></i></button>'
    html += '<button class="deleteexperimentresultbutton scenariobuttons" onclick = "DeleteExperimentResult()" style = "display: none;" type = "button">Delete Test Result<i class="marginicon fas fa-trash"></i></button>'
    //html += '<button class="deleteexperimentresultbutton scenariobuttons" onclick = "DownloadExperimentResult()" style = "display: none;" type = "button">Download Test Result<i class="marginicon fa-solid fa-file-csv"></i></button>'
    html += '</div>'
    html += '</div>'
    $('.experimentresultsevaluationchosen').append(html);
    $('#experimentresults_dropdown_id').chosen({ search_contains: true });
}

function ExperimentResultsDropdownOnChange() {
    var id = $('#experimentresults_dropdown_id').val();
    if (id > 0) {
		FillGrid_ExperimentResultsEvaluation(id);
		//FillGrid_ExperimentResultsEvaluationSecond_CSV_Output(id);
        EXPERIMENT_RESULTS_EVALUATION__ShowDeleteButton()
    }
    else {
        $('#uc_date_id2').val('');
        $('.experimentresults_data_area').hide();
        EXPERIMENT_RESULTS_EVALUATION__HideDeleteButton()
    }
}

function DownloadExperimentResult() {
 //   var timerInterval;
 //   swal({
 //       title: 'Downloading...',
	//	text: 'The download wil start in <b>5</b> seconds.',
	//	icon: 'info',
 //       timer: 5000,
 //       timerProgressBar: true,
 //       onOpen: () => {
	//		var b = swal.getHtmlContainer().querySelector('b');
 //           console.log(b);
 //           timerInterval = setInterval(() => {
 //                   b.textContent = swal.getTimerLeft() / 1000
 //               },
 //               100);
 //       },
 //       willClose: () => {
 //           clearInterval(timerInterval);
 //       }
	//}).then((result) => {

 //   })

	var selectedTestResultId = $("#experimentresults_dropdown_id").val();
    var file;
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/GetTestResultFile",
		data: {
			testResultId: selectedTestResultId
        },
        success: function (response) {
			file = response;
            window.open(file.url, '_blank');
        },
        error: function (error) {

        }
	});

    console.log(file);
}


function ClearSelectedTestCache() {
    selectedTests = [];
    console.log(selectedTests);
}