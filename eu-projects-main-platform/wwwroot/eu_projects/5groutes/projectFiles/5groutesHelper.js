//When a user select a specific pi from tables
function ClickedOnRowSetSelectedID(tablename, id) {

    if (tablename == 'localisation_table_id') {
        localisationselected = id;
    }
    else if (tablename == 'trajectory_table_id') {
        trajectoryselected = id;
    }
    else if (tablename == 'safetytable_table_id') {
        safetyselected = id;
    }
    else if (tablename == 'citsmessage_table_id') {
        ctimessagesafetyselected = id;
    }
    else if (tablename == 'video_table_id') {
        videoselected = id;
    }
    else if (tablename == 'sensor_table_id') {
        sensorselected = id;
    }
    else if (tablename == 'routtingalgorith_table_id') {
        routingalgorithmselected = id;
    }
    else if (tablename == 'gaming_table_id') {
        gamingselected = id;
    }
    else if (tablename == 'dedicatedserver_table_id') {
        dedicatedselected = id;
    }
    else if (tablename == 'smsbearer_table_id') {
        smsselected = id;
    }
    else if (tablename == 'mobility') {
        mobilityselected = id;
    }
    else if (tablename == 'radiocoverage_table_id') {
        radiocoverageselected = id;
    }
    else if (tablename == 'radiocapacity_table_id') {
        radiocapacityselected = id;
    }
    else if (tablename == 'networklatency_table_id') {
        networklatencyselected = id;
    }
    else if (tablename == 'candmprocessing_table_id') {
        couldandmecselected = id;
    }
}

//Get the selected ID based on caterogy
function GetSelectedIdOfCategory(subtype) {
    var kpiid;
    if (subtype == 'Localisation') {
        subtypeid = 1;
        typeid = 1
        $('#type_id').val('Application');
        kpiid = localisationselected;
    }
    else if (subtype == 'Trajectory') {
        subtypeid = 2;
        typeid = 1
        $('#type_id').val('Application');
        kpiid = trajectoryselected;

    }
    else if (subtype == 'Safety') {
        subtypeid = 3;
        typeid = 1
        $('#type_id').val('Application');
        kpiid = safetyselected;
    }
    else if (subtype == 'C-ITs Message') {
        subtypeid = 4;
        typeid = 1
        $('#type_id').val('Application');
        kpiid = ctimessagesafetyselected
    }
    else if (subtype == 'Video') {
        subtypeid = 5;
        typeid = 1
        $('#type_id').val('Application');
        kpiid = videoselected;
    }
    else if (subtype == 'Sensor') {
        subtypeid = 6;
        typeid = 1
        $('#type_id').val('Application');
        kpiid = sensorselected;
    }
    else if (subtype == 'Routing Algorithm') {
        subtypeid = 7;
        typeid = 1
        $('#type_id').val('Application');
        kpiid = routingalgorithmselected;
    }
    else if (subtype == 'Gaming') {
        subtypeid = 8;
        typeid = 1
        $('#type_id').val('Application');
        kpiid = gamingselected;
    }
    else if (subtype == 'Dedicated Bearer Service') {
        subtypeid = 9;
        typeid = 2
        $('#type_id').val('Service');
        kpiid = dedicatedselected;
    }
    else if (subtype == 'SMS Bearer') {
        subtypeid = 10;
        typeid = 2
        $('#type_id').val('Service');
        kpiid = smsselected;
    }
    else if (subtype == 'Mobility') {
        subtypeid = 11;
        typeid = 2
        $('#type_id').val('Service');
        kpiid = mobilityselected;
    }
    else if (subtype == 'Radio Coverage') {
        subtypeid = 12;
        typeid = 3;
        $('#type_id').val('Network');
        kpiid = radiocoverageselected;
    }
    else if (subtype == 'Radio Capacity') {
        subtypeid = 13;
        typeid = 3;
        $('#type_id').val('Network');
        kpiid = radiocapacityselected;
    }
    else if (subtype == 'Network Latency') {
        subtypeid = 14;
        typeid = 3;
        $('#type_id').val('Network');
        kpiid = networklatencyselected;
    }
    else if (subtype == 'Cloud and MEC Processing') {
        subtypeid = 15;
        typeid = 3
        $('#type_id').val('Network');
        kpiid = couldandmecselected;
    }
    selectedkpi = kpiid;
    return kpiid;
}

function UCHideAnalyticTab() {
    $('.analytic-accordion').hide();
}

function UCShowAnalyticTab() {
    $('.analytic-accordion').show();
}

function RetrieveLeaderName() {
    //debugger;
    var username1 = $('.userLogOutTextArea').text();
    let username = $('.userLogOutTextArea').text().split('(')[1].split(')')[0];
    $.ajax({
        type: "POST",
        async: false,
        url: "/_5groutes/RetrieveLeaderName",
        data: {   
            username: username,
        },
        success: function (response) {
            data = JSON.parse(response.result);
            $('.username-left').after('<span class="username-left font-weight-semibold mb-1 mt-2 text-center">Leader: ' + data  + '</span>')
        },
        error: function (error) {

        }
    });
}

function SideBarLightMode() {
    /*SIDEBAR THEME*/
    $('.sidebar-bg-options').css('background-color', '#fff')
    $('.sidebar-bg-options').css('color', '#000')
    $('#theme-settings').css('background-color', '#fff')
    $('.settings-heading').css('background-color', '#fff')
    $('.settings-heading').css('color', '#000')
    $('.nav-item').addClass('border-bottom')
    $('.rounded-circle').addClass('border')
}

function SideBarDarkMode() {
    /*SIDEBAR THEME*/
    $('.sidebar-bg-options').css('background-color', '#24242e')
    $('.sidebar-bg-options').css('color', 'white')
    $('#theme-settings').css('background-color', '#24242e')
    $('.settings-heading').css('background-color', '#24242e')
    $('.settings-heading').css('color', '#fff')
    $('.nav-item').removeClass('border-bottom')
    $('.rounded-circle').removeClass('border')
}

//this function is called when the user changed tab (f.e from Performance Indicator to Visualise PIs) to keep the selected senario focused
function UCAndScenarioFocusedAfterTabChange(ucid, scenarioid) {
    SCENARIO_HideAddButton()
    SCENARIO_ConfigureMenu_HideAllButtons();
    SCENARIO_HideConfigureKpiKpiButton();
    SCENARIO_HideExperimentResultsEvaluationButton();
    if (ucid > 0) {
        GenerateScenarioDropdown(ucid);
        Fill_UseInfo(ucid);
        $('#ucdesc_id').val(ucid);
        $('#ucdesc_id').trigger('chosen:updated')
        UC_ShowEditButton();
        if (view == 'visualize')
            SCENARIO_ShowConfigureKpiKpiButton();
        else if (view == 'tables') {
            SCENARIO_ShowAddButton()
            if (scenarioid > 0) {
                $('.addnewscenariodropdown').removeClass('borderradius')
                $('.secondarybuttons').show()
            }
            else {
                $('.addnewscenariodropdown').addClass('borderradius')
                $('.secondarybuttons').hide()
            }
        }
        else {
            SCENARIO_ShowConfigureKpiKpiButton()
            SCENARIO_ShowVisualiseKpiButton()
            SCENARIO_HideAddButton()
            SCENARIO_HideEditButton()
            SCENARIO_HideDeleteButton()
            SCENARIO_HideDuplicateButton();
            SCENARIO_HideExperimentResultsEvaluationButton()
        }
    }
    if (scenarioid > 0) {
        SCENARIO_ConfigureMenu_HideAllButtons();
        SCENARIO_HideConfigureKpiKpiButton();
        $('#scenariodesc_id').val(scenarioid);
        $('#scenariodesc_id').trigger('chosen:updated')
        FillTablesWithData(scenarioid)
        if (view == 'visualize') {
            VisualizeAllGraphs();
            SCENARIO_ShowConfigureKpiKpiButton();
            SCENARIO_ConfigureMenu_HideAllButtons();
            SCENARIO_ShowExperimentResultsEvaluationButton()
        }
        else if (view == 'resultsevaluation') {
            //debugger;
            GenerateExperimentResultsDropdown(scenarioid);
            $('.experimentresults_dropdown_area').show();
            SCENARIO_ShowConfigureKpiKpiButton()
            SCENARIO_ShowVisualiseKpiButton()
            SCENARIO_HideAddButton()
            SCENARIO_HideEditButton()
            SCENARIO_HideDeleteButton()
            SCENARIO_HideDuplicateButton();
            SCENARIO_HideExperimentResultsEvaluationButton()
        }
        else {
            SCENARIO_ShowExperimentResultsEvaluationButton()
            SCENARIO_HideConfigureKpiKpiButton();
            SCENARIO_ConfigureMenu_ShowAllButtons()
        }
    } else {
        $('.viewbuttons').hide();
    }
}

//UC Scenario Trial
function SCENARIO_ShowDetailedScenarioInfo(scenarioId) {

    var scenario = RetrieveScenarioDetailsPerId(scenarioId);

    var html = '<div class="row">'
    html += '        <div class="col-sm-2" >'
    html += '            <label>Test Scenario ID</label>'
    html += '        </div>'
    html += '        <div class="col-sm-10">'
    html += '           <input type="text" readonly id="scenario_id_value">'
    html += '           <input id="raw_test_name" type="hidden" value="' + scenario.UseCaseScenarioDescription + '">'
    html += '       </div>'
    html += '   </div>';
    html+='     <div class="row">'
    html+='        <div class="col-sm-2" >'
    html+='            <label>Test Scenario Trial Type</label>'
    html+='        </div>'
    html+='        <div class="col-sm-10">'
    html +='           <input type="text" readonly id="scenariotrial_id">'
    html +='       </div>'
    html += '   </div>';


    $('#scenarioTypebloc').empty().append(html);
    $('#scenariotrial_id').val(scenario.UseCaseScenarioTrialType);
    $('#scenario_id_value').val(scenario.UseCaseScenarioId);
}

// UC BUTTONS
function UC_HideEditButton() {
    $('.editbuttonuc').hide();
}

function UC_ShowEditButton() {
    $('.editbuttonuc').show();
}

function UC_HideSaveCancelButtons() {
    HideButton('sacecancelbuttonoc');
}

function UC_ShowSaveCancelButtons() {
    ShowButton('sacecancelbuttonoc');
}

//UC BUTTONS THRESHOLD CONFIG
function UC_ShowThresholdUseCaseConfigButtons() {
    ShowButton('threshold_table_button');
}

function UC_HideThresholdUseCaseConfigButtons() {
    HideButton('threshold_table_button');
}

// SCENARIO BUTTONS
function SCENARIO_ConfigureMenu_HideAllButtons() {
    SCENARIO_HideAddButton()
    SCENARIO_HideEditButton()
    SCENARIO_HideDeleteButton()
    SCENARIO_HideDuplicateButton()
    SCENARIO_HideVisualiseKpiButton()
}

function SCENARIO_ConfigureMenu_ShowAllButtons() {
    SCENARIO_ShowAddButton()
    SCENARIO_ShowEditButton()
    SCENARIO_ShowDeleteButton()
    SCENARIO_ShowDuplicateButton()
    SCENARIO_ShowVisualiseKpiButton()
}

function SCENARIO_ShowAddButton() {
    ShowButton('addnewscenariobutton'); 
}

function SCENARIO_HideAddButton() {
    HideButton('addnewscenariobutton');
}

function SCENARIO_ShowEditButton() {
    ShowButton('editscenariobutton');
}

function SCENARIO_HideEditButton() {
    HideButton('editscenariobutton');
}

function SCENARIO_ShowDeleteButton() {
    ShowButton('deletescenariobutton');
}

function SCENARIO_HideDeleteButton() {
    HideButton('deletescenariobutton');
}

function SCENARIO_ShowDuplicateButton() {
    ShowButton('scenarioduplicate');
}

function SCENARIO_HideDuplicateButton() {
    HideButton('scenarioduplicate');
}

function SCENARIO_ShowVisualiseKpiButton() {
    ShowButton('visualisekpi');
}

function SCENARIO_HideVisualiseKpiButton() {
    HideButton('visualisekpi');
}

function SCENARIO_ShowConfigureKpiKpiButton() {
    ShowButton('configurekpi');
}

function SCENARIO_HideConfigureKpiKpiButton() {
    HideButton('configurekpi');
}

function SCENARIO_ShowExperimentResultsEvaluationButton() {
    ShowButton('experimentresultsevaluationbutton');
}

function SCENARIO_HideExperimentResultsEvaluationButton() {
    HideButton('experimentresultsevaluationbutton');
}

function SCENARIO_ClearGraphsBlock() {
    $('#aggregated_scenario_spider_chart').empty();
    $('#scenario_spider_chart').empty()
}

function EXPERIMENT_RESULTS_EVALUATION__ShowAddButton() {
    ShowButton('addnewexperimentresultbutton');
}

function EXPERIMENT_RESULTS_EVALUATION__HideAddButton() {
    HideButton('addnewexperimentresultbutton');
}

function EXPERIMENT_RESULTS_EVALUATION__ShowDeleteButton() {
    ShowButton('deleteexperimentresultbutton');
}

function EXPERIMENT_RESULTS_EVALUATION__HideDeleteButton() {
    HideButton('deleteexperimentresultbutton');
}

function TSCENARIO_HideTestScenarioButtonBloc() {
    $('.testscnariobuttons').hide();
    $('#testDescriptionFieldbloc').empty();
}

function TSCENARIO_ShowTestScenarioButtonBloc() {
    $('.testscnariobuttons').show();
}

function TSCENARIO_ShowAddButton() {
    $('.addnewtestscenariobutton').show();
}


function TSCENARIO_ShowEditButton() {
    $('.edittestscenariobutton').show();
}

function TSCENARIO_ShowStartNewTestButton() {
    $('.savebutton').show();
}
function TSCENARIO_HideStartNewTestButton() {
    $('.savebutton').hide();
}
function TSCENARIO_ShowDeleteButton() {
    $('.deletetestscenariobutton').show();
}

function TSCENARIO_HideAddButton() {
    $('.addnewtestscenariobutton').hide();
}

function TSCENARIO_HideEditButton() {
    $('.edittestscenariobutton').hide();
}

function TSCENARIO_HideDeleteButton() {
    $('.deletetestscenariobutton').hide();
}

function TSCENARIO_ShowSelectedTestStatus() {
    $('#test_scenario_status').show();
}
function TSCENARIO_HideSelectedTestStatus() {
    $('#test_scenario_status').hide();
}

function TSCENARIO_HideStopTestButton() {
    $('.stoprunningtestscenariobutton').hide();
}

function TSCENARIO_ShowStopTestButton() {
    $('.stoprunningtestscenariobutton').show();
}
function TSCENARIO_HideStopNetworkServiceButton() {
    $('.stopNetworkServicebutton').hide();
}

function TSCENARIO_ShowStopNetworkServiceButton() {
    $('.stopNetworkServicebutton').show();
}

function TSCENARIO_EnableResetTableValues(kpiTypeId) {
    $('#' + kpiTypeId + '_val_tab_btn .' + kpiTypeId + '_table_value_id_reset').removeClass('isDisabled');
}
//Composite Threshold KPI Table
function ShowKPIThresholdTables() {
    /*$('#KPItables').show();*/
}

function HideKPIThresholdTables() {
    /*$('#KPItables').hide();*/
}

//KPI Table

function ShowKPITables() {
    $('#KPItables').show();
    $('.measure_btn_saveOrcancel').hide();
}

function HideKPITables() {
    $('#KPItables').hide();
}

//General button functos
function ShowButton(button_class) {
    $('.' + button_class).show();
}

function HideButton(button_class) {
    $('.' + button_class).hide();
}

// Show Table button
function ShowTableButton(tableid, button_class) {
    $('.' + tableid + '_' + button_class).show();
}

//Hide Table button
function HideTableButton(tableid, button_class) {
    $('.' + tableid + '_' + button_class).hide();
}
//Disable Table button
function DisableTableButton(tableid, button_class) {
    $('.' + tableid + '_' + button_class).addClass('isDisabled')
}

//Undisable Table button
function UndisableTableButton(tableid, button_class) {
    $('.' + tableid + '_' + button_class).removeClass('isDisabled')
}

//Disable Table button -- Edit Delete_1
function DisableTableButtons_EditDelete(tableid) {
    DisableTableButton(tableid, 'edit');
    DisableTableButton(tableid, 'delete');
}

function TSCENARIO_RefreshDropdown(scenarioId) {
    GenerateTestScenarioDropdown(scenarioId, null);
}

function TSCENARIO_SetDropdownValue(testScenarioId) {
    $('#testscenariodesc_id').val(testScenarioId);

}

function ShowSuccessMessage(msg) {
    swal({
        title: "Success!",
        text: msg,
        icon: "success",
        buttons: "Done"
    });
}

function ShowErrorMessage(msg) {
    swal({
        title: "Error!",
        text: msg,
        icon: "warning",
        buttons: "Done",
        dangerMode: true
    });
}

$('#refresh_scenario_graph').on("click", function() {
    RefreshScenarioGraph();
});

function RefreshScenarioGraph() {
    var scenario_id = $('#scenariodesc_id').val();
    var scenario_name = $('#scenariodesc_id').find(":selected").text();

    var compositeKpiTypes = RetrieveCompositeKpiTypes();
    var testScenarios = RetrieveTestScenariosPerScenario_JS(scenario_id);
    var graphValues = [];

    //Set Default value
    var testScenarioValues = [0, 0, 0, 0, 0];
    graphValues.push({ values: testScenarioValues, text: null });

    GenerateScenarioAnalyticLegend(testScenarios);

    ShowAllScenarioGraphs(scenario_name, compositeKpiTypes, graphValues);
}

function ShowLoader() {
    var html = '';
    html += '<div id="5groutesLoader" class="modal">';
    html += '	<div class="modal-content" style=" width: 30% !important;background: transparent;">';
    html += '		<div class="mainbodyborder" style="background: #345687;border-radius: 10px;">'
    html += '			<div class="modalwidth90">'
    html += '				<div class="modalbody_class row" style="align-items: center;padding:0px">'
    html += '				    <div class="col-4">'
    html += '                       <div class="spinner-border m-5 text-light" role="status" style="width: 3.5rem !important;height: 3.5rem!important;animation: spinner-border 1.2s cubic - bezier(0.4, 0, 0.38, 1.2) infinite !important;">'
    html += '                       </div >'
    html += '                   </div >'
    html += '				    <div class="col-5">'
    html += '                       <h4 style="color:white;padding:3%">Loading...</h4>'
    html += '                   </div >'
    html += '               </div>'
    html += '			</div>';
    html += '		</div>';
    html += '	</div>'
    html += '</div>';


    $(".homemodal").append(html);
    $('#5groutesLoader').show();
}


function HideLoader() {
    $('#5groutesLoader').remove();
}

function ResetTestSection() {
    HideKPITables();
    $('#test_scenario_selector').empty()
        .append('<select id="testscenariodesc_id" placeholder="Select a Scenario Test" disabled></select>');
    $("#testscenariodesc_id").chosen({ search_contains: true });

    TSCENARIO_HideDeleteButton();
    TSCENARIO_HideEditButton();
}

function ResetScenarioSection() {
    $('#scenarioTypebloc').empty();
    UCHideAnalyticTab();

    TSCENARIO_HideTestScenarioButtonBloc();
    CreateEmptyTestDropdown();
}

function TSCENARIO_ShowDetailedTestInfo(testScenarioId) {

    var test = RetrieveTestDetailsPerId(testScenarioId);
    
    var html = '        <div class="col-sm-2" >'
    html += '            <label>Test Description</label>'
    html += '        </div>'
    html += '        <div class="col-sm-10">'
    html += '           <input type="text" readonly id="testDescription_id">'
    html += '       </div>'
    
    $('#testDescriptionFieldbloc').empty().append(html);
    $('#testDescription_id').val(test.TestScenarioDescription);
}

function ApplyDarkStyles() {
    $('.container-scroller').addClass('black-bg');
    zingchart.THEME = 'dark';
}

function ApplyLightStyles() {
    $('.container-scroller').removeClass('black-bg');
    zingchart.THEME = 'light';
}

function UC_ResetUseCaseSection() {
    $('#treshold_bloc_title').empty();

    $('#uc_threshold_config_left_block').empty(); //Clean left bloc
    $('#uc_threshold_config_right_block').empty(); //Clean right bloc

    $('#uc_id').val("");
    $('#uc_id_string').val("");
    $('#uc_description_id').val("");
    $('#uc_responsible_id').val("");
    $('#uc_contact_id').val("");
    $('#uc_date_id').val("");

    $('#uc_category').val("");
}