function GenerateUCDropdown() {
	var data;
	data = RetrieveUseCases_JS();
	ChosenCreator(data, 'ucdescriptionchosen', 'ucdesc_id', 'UC Description')
}

function GenerateScenarioDropdown(usecase_id) {
	var data;
	data = RetrieveScenarioPerUseCase_JS(usecase_id);
	ChosenCreator(data, 'scenariodescriptionchosen', 'scenariodesc_id', 'Scenario Description');
}

function ChosenCreator(datasources, chosenclass, closenid, title) {
    var email = $('#user_email').val();
    var projectId = $('#project_id').val();
    var data = datasources;

    //if (closenid === 'ucdesc_id') {

    //    data = RetrieveAllUmmResourcePerUser(projectId, email);
    //    console.log(data);
    //}

	var html = '';
	$('.' + chosenclass).empty();
	html += '<div class="col-md-2 col-sm-12">';
    if (closenid === 'ucdesc_id') {
        html += '<label id="data_source_type">' + title + '</label>';
    } else {
        html += '<label>' + title + '</label>';
    }
    html += '</div>'
	if (closenid == 'ucdesc_id') {
		html += '<div class="col-md-6 col-12">'
		html += '<select id="' + closenid + '" data-placeholder="Select an Option" onchange = "UC_Description_OnChange()">';
        html += '<option value=""></option>'
		html += '<optgroup label="Use Cases">'
    }
	else if (closenid == 'scenariodesc_id') {
		html += '<div class="col-md-10 col-12">'
		html += '<select id="' + closenid + '" onchange = "Scenario_Description_OnChange()">'
	}
	for (var i = 0; i < data.length; i++) {
		if (title == 'UC Description') {
			//if (i == 0) html += '<option selected value="">Select an Option</option>'
            //var isValid = UserHasAccesToResource(data[i].UseCaseCode);
            //debugger;
            //if (isValid) {
            //    html += '<option class="uc" value="' + data[i].UseCaseId + '">' + data[i].UseCaseDescription + '</option>';
            //}

            html += '<option class="uc" value="' + data[i].UseCaseId + '">' + data[i].UseCaseDescription + '</option>';
			
		}
		if (title == 'Scenario Description') {
			if (i == 0) html += '<option selected value="">Select an Option</option>'
			html += '<option value="' + data[i].UseCaseScenarioId + '">' + data[i].UseCaseScenarioDescription + '</option>';
		}
	}

	if (closenid == 'ucdesc_id') {

        var netApps = RetrieveNetApps();

		html += '/<optgroup>'
		html += '<optgroup label="NetApps">';
        for (var j = 0; j < netApps.length; j++) {
			html += '<option class="netapp" value="' + netApps[j].NetAppId + '">' + netApps[j].NetAppName+ '</option>';
        }
        html += '/<optgroup>';
    }
    html += '</select>'
	html += '</div>'
	if (title == 'UC Description') {
		html += '<div class="col-md-4 col-12 scnariobuttons main-buttons-with-icons buttons-margin-top">'
		html += '<button class="editbuttonuc" onclick = "EditUseCase()" type = "button">Edit<i class="marginicon fas fa-edit"></i></button>'
		html += '<button class="savebutton sacecancelbuttonoc" onclick = "SaveUseCase()" type = "button">Save<i class="marginicon fas fa-save"></i></button>'
		html += '<button class="sacecancelbuttonoc" onclick = "CancelEdit()" type = "button">Cancel<i class="marginicon fas fa-window-close"></i></button>'
		html += '</div>'
	}
	if (title == 'Scenario Description') {
		//OLD BUTTONS
		html += '</div>'
		//html += '<div class="col-md-12 col-12 scnariobuttons main-buttons-with-icons scenariobuttons">'
		//html += '<button class="addnewscenariobutton scenariobuttons" onclick = "AddNewScenario()" type = "button">Add new Scenario<i class="marginicon fas fa-plus"></i></button>'
		//html += '<button class="editscenariobutton scenariobuttons" onclick = "EditScenario()" type = "button">Edit Scenario<i class="marginicon fas fa-edit"></i></button>'
		//html += '<button class="deletescenariobutton scenariobuttons" onclick = "DeleteScenario()" type = "button">Delete Scenario<i class="marginicon fas fa-trash"></i></button>'
		//html += '<button class="scenarioduplicate scenariobuttons" onclick = "OverWriteScenario()" type = "button">Duplicate Existing Scenario<i class="marginicon fas fa-clone"></i></button>'
		////html += '<button class="experimentresultsevaluationbutton scenariobuttons" onclick = "ExperimentResultsEvaluation()" type = "button">Experiment Results Evaluation<i class="marginicon fas fa-th"></i></button>'
		//html += '<button class="visualisekpi scenariobuttons" onclick = "VisualiseKPIs()" type = "button">Visualise PIs<i class="marginicon fas fa-chart-pie"></i></button>'
		//html += '<button class="configurekpi scenariobuttons" onclick = "PerformanceIndicators()" type = "button">Configure KPI<i class="marginicon fas fa-table"></i></button>'
		//html += '</div>'
		html += '</div>'
    }

    if (title === 'UC Test') {
        html += '</div>'
        html += '<div class="col-md-12 col-12 scnariobuttons main-buttons-with-icons scenariobuttons">';
        html += '<div class="row">';
        html += '<button class="col-5 btn btn-danger offset-5" id="refresh_kpi_graphs">Refresh</button>';
        html += '</div>';
        html += '</div>'
        html += '</div>'
    }
	html += '</div>'
	$('.' + chosenclass).append(html);
	$('#' + closenid).chosen({ search_contains: true });
	UC_HideEditButton();
	UC_HideSaveCancelButtons()
	//SCENARIO_HideAddButton();
	//SCENARIO_HideEditButton();
	//SCENARIO_HideDeleteButton();
	//SCENARIO_HideDuplicateButton()
	HideButton('visualisekpi');
	HideButton('configurekpi');
}

function UC_Description_OnChange() {
	
	if ($('#ucdesc_id option:selected')[0].className === 'uc') {

        var usecase_id;
        usecase_id = $('#ucdesc_id').val();
        uidc = $('#ucdesc_id').val();
        document.cookie = "uid=" + usecase_id;

        GenerateUC_TestDropdown(usecase_id);
        GenerateScenarioDropdown(usecase_id);
		Fill_UseInfo(usecase_id);
		HideKPITables();

        if ($('#uc_id').val() == 0) {
            //UC_HideEditButton();
            SCENARIO_HideAddButton();
            SCENARIO_HideEditButton();
            SCENARIO_HideDeleteButton();
            //UC_HideSaveCancelButtons();
            $('#uc_description_id')[0].readOnly = true;
            $('#uc_responsible_id')[0].readOnly = true;
            $('#uc_contact_id')[0].readOnly = true;
            $('#uc_date_id')[0].readOnly = true;
            $('.experimentresults_dropdown_area').hide();
            $('.experimentresults_data_area').hide();
        }
        else {
            //UC_ShowEditButton();
            //UC_HideSaveCancelButtons();
            //SCENARIO_ShowAddButton();
            $('#uc_description_id')[0].readOnly = true;
            $('#uc_responsible_id')[0].readOnly = true;
            $('#uc_contact_id')[0].readOnly = true;
			$('#uc_date_id')[0].readOnly = true;

            //GenerateUC_TestDropdown(usecase_id);
            $('#uc_experiment_monitoring_block').show();
            $('.stopexperiment').hide();

            if (!userGroups.map(g => g.name).includes('Experiment Runners')) {
                $('#experiment_button_block').remove();
            }
        }
	}
	else if ($('#ucdesc_id option:selected')[0].className === 'netapp') {

		var netappId = $('#ucdesc_id').val();
		Fill_NetAppInfos(netappId);

        GenerateNetApp_ExecutionDropdown(netappId);
        $('#uc_experiment_monitoring_block').hide();
    }

    $('.generalinfoclass').show();
    $("#experimentdesc_id").chosen({ search_contains: true });

 //   SCENARIO_HideExperimentResultsEvaluationButton();
	//SCENARIO_HideDuplicateButton();
	//$('.secondarybuttons').hide()
	//$('.addnewscenariodropdown').addClass('borderradius')
	//$('.viewbuttons').hide()
}

function Scenario_Description_OnChange() {
	var scenario_id;
	scenario_id = $('#scenariodesc_id').val();
	scenarioid = $('#scenariodesc_id').val();
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
		$('.viewbuttons').hide()

	} else {
		$('.secondarybuttons').show()
		$('.addnewscenariodropdown').removeClass('borderradius')
		$('.viewbuttons').show()
		SCENARIO_ShowEditButton()
		SCENARIO_ShowDeleteButton()
		SCENARIO_ShowDuplicateButton();
		//SCENARIO_ShowVisualiseKpiButton()
		//SCENARIO_ShowConfigureKpiKpiButton()
        //SCENARIO_GenerateCompositeKPITables();
        //ShowKPITables();
        //HideCompositeKpiTableButtons();
        //if ($('#ucdesc_id option:selected')[0].className === 'netapp') {
        //    var executionId = scenario_id;
        //    GenerateTemporaryKpiGraphs('netapp', executionId);
        //} else {
        //    var testid = scenario_id
        //    GenerateTemporaryKpiGraphs('uc', testid);
        //}
        

        //if (view == 'visualize') {
        //	VisualizeAllGraphs();
        //	SCENARIO_HideVisualiseKpiButton()
        //	SCENARIO_HideAddButton()
        //	SCENARIO_HideEditButton()
        //	SCENARIO_HideDeleteButton()
        //	SCENARIO_HideDuplicateButton();
        //	SCENARIO_ShowExperimentResultsEvaluationButton()
        //} else if (view == 'tables') {
        //	FillTablesWithData(scenario_id);
        //	SCENARIO_HideConfigureKpiKpiButton()
        //	SCENARIO_ShowAddButton()
        //	SCENARIO_ShowEditButton()
        //	SCENARIO_ShowDeleteButton()
        //	SCENARIO_ShowExperimentResultsEvaluationButton()
        //}
        //else if (view == 'resultsevaluation') {
        //	SCENARIO_HideAddButton()
        //	SCENARIO_HideEditButton()
        //	SCENARIO_HideDeleteButton()
        //	SCENARIO_HideDuplicateButton();
        //	SCENARIO_HideExperimentResultsEvaluationButton()
        //	SCENARIO_ShowConfigureKpiKpiButton()
        //	SCENARIO_ShowVisualiseKpiButton()
        //}
    }
	//if (view == 'resultsevaluation') {
	//	if (scenario_id > 0) {
	//		GenerateExperimentResultsDropdown();
	//		$('.experimentresults_dropdown_area').show();
	//		$('.experimentresults_data_area').hide();
	//	}
	//	else {
	//		$('.experimentresults_dropdown_area').hide();
	//		$('.experimentresults_data_area').hide();
	//	}
	//}


}

function Experiment_Description_OnChange() {
    var experiment_id;
    //var scenario_id = $('#scenariodesc_id').val();
    experiment_id = $('#experimentdesc_id').val();
    document.cookie = "uid=" + experiment_id;

    if (experiment_id == 0) {
        //$('.secondarybuttons').hide()
        //$('.addnewscenariodropdown').addClass('borderradius')
        //SCENARIO_HideEditButton()
        //SCENARIO_HideDeleteButton()
        //SCENARIO_HideDuplicateButton()
        //SCENARIO_HideVisualiseKpiButton()
        //SCENARIO_HideConfigureKpiKpiButton()
        //SCENARIO_HideExperimentResultsEvaluationButton()
        HideKPITables();
        $('.viewbuttons').hide()

    } else {
        $('.secondarybuttons').show()
        $('.addnewscenariodropdown').removeClass('borderradius')
        //$('.viewbuttons').show()
        //SCENARIO_ShowEditButton()
        //SCENARIO_ShowDeleteButton()
        //SCENARIO_ShowDuplicateButton();
        //SCENARIO_ShowVisualiseKpiButton()
        //SCENARIO_ShowConfigureKpiKpiButton()
        SCENARIO_GenerateCompositeKPITables();
        ShowKPITables();
        HideCompositeKpiTableButtons();
        
        if ($('#ucdesc_id option:selected')[0].className === 'netapp') {
            var executionId = experiment_id;
            GenerateTemporaryKpiGraphs('netapp', executionId);
        } else {
            var testid = experiment_id
            GenerateTemporaryKpiGraphs('uc', testid);
        }
    }
}

function GenerateExperimentResultsDropdown(scenarioid) {
    if (scenarioid == 'undefined' || scenarioid == null || scenarioid == 0)
        scenarioid = $('#scenariodesc_id').val()
    data = RetrieveExperimentResultsEvaluationPerScenarioID(scenarioid);
    var html = '';
    $('.experimentresultsevaluationchosen').empty();
    html += '<div class="col-md-2 col-sm-12">'
    html += '<label">Experiment Results</label>'
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
    html += '<button class="addnewexperimentresultbutton scenariobuttons" onclick = "AddNewExperimentResult()" type = "button">Add new Experiment Result<i class="marginicon fas fa-plus"></i></button>'
    html += '<button class="deleteexperimentresultbutton scenariobuttons" onclick = "DeleteExperimentResult()" style = "display: none;" type = "button">Delete Experiment Result<i class="marginicon fas fa-trash"></i></button>'
    html += '</div>'
    html += '</div>'
    $('.experimentresultsevaluationchosen').append(html);
    $('#experimentresults_dropdown_id').chosen({ search_contains: true });
}

function ExperimentResultsDropdownOnChange() {
    var id = $('#experimentresults_dropdown_id').val();
    if (id > 0) {
        FillGrid_ExperimentResultsEvaluation(id);
        EXPERIMENT_RESULTS_EVALUATION__ShowDeleteButton()
    }
    else {
        $('#uc_date_id2').val('');
        $('.experimentresults_data_area').hide();
        EXPERIMENT_RESULTS_EVALUATION__HideDeleteButton()
    }
}

function RetrieveAllUmmResourcePerUser(projectId, email) {
    var data = []
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveAllUmmResourcesPerOwner",
        data: {
            email: email,
            projectId: projectId
        },
        success: function (response) {
            data = response;
        },
        error: function (error) {

        }
    });
    return data;
}

function UserHasAccesToResource(code) {
    var result = GetResourceByCode(code);
    var resourceDetails;
    var hasAccess;
    if (result.code === "200" || result.code === 'OK') {
        resourceDetails = JSON.parse(result.content);

        var r = GetResourceById(resourceDetails.resId);
        
        if (r.code === "200" || r.code === 'OK') {
            hasAccess = true;
        } else {
            hasAccess = false;
        }

    } else {
        hasAccess = false;
    }
    
    return hasAccess;
}

function GetResourceByCode(code) {
    var data;
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/GetResourceDetailsPerName",
        data: {
            resourceName: code
        },
        success: function (response) {
            data = response;
        },
        error: function (error) {

        }
    });
    
    return data;
}

function GetResourceById(resId) {
    var data;
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/GetResourcePerId",
        data: {
            resId: resId
        },
        success: function (response) {
            data = response;
        },
        error: function (error) {

        }
    });

    return data;
}

function RetrieveUserGroupDetails() {
    var data;
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveUserGroupDetails",
        beforeSend: function() {
            ShowOverlayLoader("Loading...");
        },
        success: function (response) {
            data = response;
        },
        complete: function(response) {
            if (response.responseJSON.code !== 'OK') {
                HideOverlayLoader();
                ShowErrorMessage("Ooops! Something went wrong! Please refresh the page");
                window.location.reload();
            } else {
                HideOverlayLoader();
            }
        },
        error: function (error) {

        }
    });
    return data;
}