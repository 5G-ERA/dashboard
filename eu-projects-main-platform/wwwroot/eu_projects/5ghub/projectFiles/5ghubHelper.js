function RetrieveLeaderName() {
    let username = $('.userLogOutUserArea').text().split('(')[1].split(')')[0];
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

function ScenarioFocused(ucid, scenarioid) {
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
        SCENARIO_ShowAddButton();
        SCENARIO_ShowEditButton();
        SCENARIO_ShowDeleteButton();
        SCENARIO_ShowDuplicateButton();
        ShowKPITables();
        SCENARIO_GenerateCompositeKPITables();
        HideCompositeKpiTableButtons();
    } else {
        $('.viewbuttons').hide();
    }
}


function ShowFooterHeader() {
    $('header').show();
    $('footer').show();
    if (document.cookie.includes("Username") == true) {
        var username = document.cookie.split('Username=')[1].split(';')[0]
        $('.logoutusername').html('Log Out (' + username + ')<i class=\"fas fa-user\"></i>')
    }
}

function HideFooterHeader() {
    $('header').hide();
    $('footer').hide();
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

//KPI Table

function ShowKPITables() {
    $('#KPItables').show();
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

function HideCompositeKpiTableButtons() {
    $('.tab-edit-button').hide();
    $('.tab-delete-button').hide();
    $('.tab-add-button').hide();
}

function ShowCompositeKpiTableButtons() {
    $('.tab-edit-button').show();
    $('.tab-delete-button').show();
    $('.tab-add-button').show();
}


//When a user select a specific pi from tables
function SelectedItem(tablename, id) {

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

function SubTypeString_To_SubTypeId(subtype) {
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

/*---------------------------------------------------------------------------*/

function SCENARIO_GenerateCompositeKPITables()
{
    var groupedKpis = RetrieveCompositeKpiTypes();

    CreateAccordionHtml(groupedKpis);
}

function RetrieveCompositeKpiTypes() {

    var compositeKpiTypes = []
    var projectid = parseInt($('#project_id').val())
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveCompositeKPIsPerProject",
        data: { projectId: projectid },
        success: function (response) {
            compositeKpiTypes = response
        },
        error: function (error) {

        }
    });
    return compositeKpiTypes;
}

function CreateAccordionHtml(groupedKpis) {
    var html = '';
    $('#KPItables').empty();

    for (var i in groupedKpis) {
        html += ' <div class="accordion-item">'
        html += '<h2 class="accordion-header" id="headingFor_' + i+'" >'
        html += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#collapseFor_' + i + '" aria-controls="collapseFor_' + i +'">'
        html += groupedKpis[i].kpiCode;
        html += ' </button>'
        html += '</h2>'
        html += '<div id="collapseFor_' + i + '" class="accordion-collapse collapse" aria-labelledby="headingFor_' + i +'">'
        html += '<div class="accordion-body">'
        html += '<div class="row">'
        html += '<div id="compositeKpi_' + i + '_LeftBlock" class="col-md-12 col-lg-6"></div>'
        html += '<div id="compositeKpi_' + i + '_RightBlock" class="col-md-12 col-lg-6"></div>'
        html += '</div>'
        html += '</div>'
        html += ' </div>'
        html += '</div>'
    }

    $('#KPItables').append(html);

    for (var x in groupedKpis) {

        for (var j in groupedKpis[x].subTypes) {

            var kpi = groupedKpis[x].subTypes[j];

            var htmlLeftBlock = '';
            var htmlRightBlock = '';

            if (j % 2 == 0) {

                htmlLeftBlock += '<div class="tablemain">'
                htmlLeftBlock += '<div class="row">'
                htmlLeftBlock += '<div class="col-4">'
                htmlLeftBlock += '<div class="headtabletitle">' + kpi.kpiSubTypeCode+'</div>'
                htmlLeftBlock += ' </div>'
                htmlLeftBlock += '<div class="col-8 main-buttons-with-icons" style="text-align:right">'
                htmlLeftBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_graph tab-button" onclick="DisplayKPIGraph(' + kpi.kpiSubTypeID + ')" type="button">Graph<i class="marginicon fas fa-chart-pie"></i></button>'
                htmlLeftBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_table isDisabled tableviewbutton tab-button" onclick="ShowKpiTableView(' + kpi.kpiSubTypeID + ')" type="button">Table<i class="marginicon fas fa-table"></i></button>'
                //htmlLeftBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_add tab-button tab-add-button" onclick="addkpi(' + kpi.kpiSubTypeID + ',\'' + kpi.kpiSubTypeCode + '\', \'' + groupedKpis[x].kpiCode + '\')" type="button">Add<i class="marginicon fas fa-plus"></i></button>'
                htmlLeftBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_edit isDisabled tab-button tab-edit-button" onclick="editkpi(' + kpi.kpiSubTypeID + ',\'' + kpi.kpiSubTypeCode + '\',\'' + groupedKpis[x].kpiCode + '\')" type="button">Edit<i class="marginicon fas fa-edit"></i></button>'
                htmlLeftBlock += '<button class="' + kpi.kpiSubTypeID +'_table_id_delete isDisabled tab-button tab-delete-button" onclick="deletekpi(' + kpi.kpiSubTypeID +')" type="button">Delete<i class="marginicon fas fa-trash"></i></button>'

                htmlLeftBlock += '</div>'
                htmlLeftBlock += '</div>'


                htmlLeftBlock += '<div class="row">'
                htmlLeftBlock += '<div class="col-sm-12">'
                htmlLeftBlock += '<hr style="width:100%;text-align:center;margin-left:0">'
                htmlLeftBlock += '</div>'
                htmlLeftBlock += '</div>'

                htmlLeftBlock += '<div class="col-sm-12 table_class">'
                htmlLeftBlock += '<div class="' + kpi.kpiSubTypeID +'table">'
                htmlLeftBlock += '</div>'
                htmlLeftBlock += '</div>'
                htmlLeftBlock += '</div>'

                $('#compositeKpi_' + x + '_LeftBlock').append(htmlLeftBlock);
            } else {
                htmlRightBlock += '<div class="tablemain">'
                htmlRightBlock += '<div class="row">'
                htmlRightBlock += '<div class="col-4">'
                htmlRightBlock += '<div class="headtabletitle">' + kpi.kpiSubTypeCode + '</div>'
                htmlRightBlock += ' </div>'
                htmlRightBlock += '<div class="col-8 main-buttons-with-icons" style="text-align:right">'
                htmlRightBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_graph tab-button" onclick="DisplayKPIGraph(' + kpi.kpiSubTypeID + ')" type="button">Graph<i class="marginicon fas fa-chart-pie"></i></button>'
                htmlRightBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_table tableviewbutton tab-button isDisabled" onclick="ShowKpiTableView(' + kpi.kpiSubTypeID + ')" type="button">Table<i class="marginicon fas fa-table"></i></button>'
                //htmlRightBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_add tab-button tab-edit-button" onclick="addkpi(' + kpi.kpiSubTypeID + ',\"' + kpi.kpiSubTypeCode + '\',\'' + groupedKpis[x].kpiCode + '\')" type="button">Add<i class="marginicon fas fa-plus"></i></button>'
                htmlRightBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_edit isDisabled tab-button tab-edit-button" onclick="editkpi(' + kpi.kpiSubTypeID + ',\'' + kpi.kpiSubTypeCode + '\',\'' + groupedKpis[x].kpiCode + '\')" type="button">Edit<i class="marginicon fas fa-edit"></i></button>'
                htmlRightBlock += '<button class="' + kpi.kpiSubTypeID + '_table_id_delete isDisabled tab-button tab-delete-button" onclick="deletekpi(' + kpi.kpiSubTypeID + ')" type="button">Delete<i class="marginicon fas fa-trash"></i></button>'

                htmlRightBlock += '</div>'
                htmlRightBlock += '</div>'


                htmlRightBlock += '<div class="row">'
                htmlRightBlock += '<div class="col-sm-12">'
                htmlRightBlock += '<hr style="width:100%;text-align:center;margin-left:0">'
                htmlRightBlock += '</div>'
                htmlRightBlock += '</div>'

                htmlRightBlock += '<div class="col-sm-12 table_class">'
                htmlRightBlock += '<div class="' + kpi.kpiSubTypeID + 'table">'
                htmlRightBlock += '</div>'
                htmlRightBlock += '</div>'
                htmlRightBlock += '</div>'

                $('#compositeKpi_' + x + '_RightBlock').append(htmlRightBlock);
                
            }

            //$('.' + kpi.kpiSubTypeID + '_table_id_graph').click();
        }
        
    }
    
}

function GenerateUC_TestDropdown(usecase_id) {
    var html = GetNetappOrUC_HtmlBlock('uc', usecase_id);
    $('#scenario_block').empty().append(html);
    $('#scenariodesc_id').chosen({ search_contains: true });
}

function GenerateNetApp_ExecutionDropdown(netapp_id) {
    var html = GetNetappOrUC_HtmlBlock('netapp', netapp_id);
    $('#scenario_block').empty().append(html);
    $('#scenariodesc_id').chosen({ search_contains: true });
}

function GetNetappOrUC_HtmlBlock(type, value) {
    var html = '';
    if (type === 'uc') {
        html += '<div class="scenarioarea">';

        html += '<div class="row experimentdescriptionchosen" >';
        html += '<div class="col-sm-2">';
        html += '<label>Experiment</label>';
        html += '</div>';
        html += '<div class="col-sm-8">';
        
        html += '<select id="experimentdesc_id" onchange="Experiment_Description_OnChange()" data-placeholder="Please select a Test Experiment ID">';
        html += '<option></option>';

        var tests = RetrieveUcTestsPerUsecaseId(value);
        for (var i = 0; i < tests.length; i++) {
            if (tests[i].IsScheduled && CompareDate(tests[i].ScheduleStartDate)) {
                html += '<option disabled value="' + tests[i].ExperimentID + '">' + tests[i].ExperimentID + '</option>';
            } else {
                html += '<option value="' + tests[i].ExperimentID + '">' + tests[i].ExperimentID + '</option>';
            }
        }

        html += '</select>';
        html += '</div>';
        html += '<div class="col-sm-2 scnariobuttons main-buttons-with-icons scenariobuttons" style="margin-left: 0px;margin-right: 0px;margin-top: -5px;">';
        html += '<button class="visualisehistory scenariobuttons btn-secondary" onclick = "VisualiseExperimentHistory()" type = "button">History<i class="marginicon fa-solid fa-clock-rotate-left"></i></button>'
        html += '</div >';

        html += '</div >';

        html += '<div class="row">';
        html += '<div class="col-sm-12">';
        html += '<hr style="width:100%;text-align:center;margin-left:0">';
        html += '</div>';
        html += '</div>';

        html += '<div class="generalinfoclass">';
        html += '<div class="row" id="temporary_graphs"></div>';
        html += '<div class="accordion" id="KPItables">';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    } else {
        html += '<div class="scenarioarea">';

        html += '<div class="row experimentdescriptionchosen" >';
        html += '<div class="col-sm-2">';
        html += '<label>NetApp Execution</label>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        //html += '<select id="scenariodesc_id" onchange="Scenario_Description_OnChange()" data-placeholder="Please select a NetApp Execution">';
        html += '<select id="experimentdesc_id" onchange="Experiment_Description_OnChange()" data-placeholder="Please select a NetApp Execution">';
        html += '<option></option>';

        var executionIds = RetrieveNetAppExecutionPerNetAppId(value);
        for (var i = 0; i < executionIds.length; i++) {
            html += '<option value="' + executionIds[i] + '">' + executionIds[i] +'</option>';
        }
        html += '</select>';
        html += '</div>';
        html += '</div >';

        html += '<div class="row">';
        html += '<div class="col-sm-12">';
        html += '<hr style="width:100%;text-align:center;margin-left:0">';
        html += '</div>';
        html += '</div>';

        html += '<div class="generalinfoclass">';
        html += '<div class="row" id="temporary_graphs"></div>';
        html += '<div class="accordion" id="KPItables">';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }
    return html;
}

function CompareDate(endDate) {

    var firstDate = new Date(endDate);
    var secondDate = new Date();

    if (firstDate >= secondDate) {
        //alert("First Date is greater than Second Date.");
        return true;
    } else {
        //alert("Second Date is greater than the First Date.");
        return false;
    }
}

function GenerateTemporaryKpiGraphs(type, value) {
    var data = [];

    var graphs = [
        { id: 'line_chart', name: 'Time Series', icon: '<i class="fa-solid fa-chart-line"></i>' },
        { id: 'bar_chart', name: 'Bar Chart', icon: '<i class="fa-solid fa-chart-simple"></i>'},
        { id: 'pie_chart', name: 'Pie Chart (Average)', icon: '<i class="fa-solid fa-chart-pie"></i>' }
    ];

    if (type === 'netapp') {
        data = RetrieveKpiValuesPerExectionId(value);
    } else {
        data = RetrieveKpiValuePerTestId(value);
    }
    var htmlBlock = '';

    htmlBlock += '<div class="col-md-12 col-12 main-buttons-with-icons scenariobuttons">';

    htmlBlock += '<div class="row" style="margin-bottom:10px">'
    htmlBlock += '<div class="col-10"></div>'

    htmlBlock += '<div class="col-2">'
    htmlBlock += '<select id="graph_type_selector" onchange="OnGraphType_Change()" style="margin-botton:5px">'
    
    for (var j = 0; j < graphs.length; j++) {
        htmlBlock += '<option value="' + graphs[j].id + '">'+ graphs[j].name + '</option>';
    }

    htmlBlock += '</select>'

    htmlBlock += '</div>'
    htmlBlock += '</div>'
    htmlBlock += '</div>'
    for (var i = 0; i < data.length; i++) {
        htmlBlock += '<div class="tablemain col-5" style="margin-left:5%">'
        htmlBlock += '<div class="row">'
        htmlBlock += '<div class="col-4">'
        htmlBlock += '<div class="headtabletitle">' + data[i].kpi + '</div>'
        htmlBlock += ' </div>'
        htmlBlock += '</div>'


        htmlBlock += '<div class="row">'
        htmlBlock += '<div class="col-sm-12">'
        htmlBlock += '<hr style="width:100%;text-align:center;margin-left:0">'
        htmlBlock += '</div>'
        htmlBlock += '</div>'

        htmlBlock += '<div class="col-sm-12 table_class">'
        htmlBlock += '<div class="'+i+'table">'
        htmlBlock += '</div>'
        htmlBlock += '</div>'
        htmlBlock += '</div>'
    }

    $('#temporary_graphs').empty().append(htmlBlock);

    $('#graph_type_selector').chosen({ search_contains: true, width: "15% !important" });

    DisplayTemporaryKPIGraph_TimeSeries(type, data);
}

function DisplayTemporaryKPIGraph_TimeSeries(type, datasource) {
    var data = [];
    if (type === 'netapp') {
        //var value = $('#experimentdesc_id').val();
        //data = RetrieveKpiValuesPerExectionId(value);
        data = datasource;

        for (var i = 0; i < datasource.length; i++) {
            var html =
                '<div id="chartContainerForKpiType_'+i+'" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
            $('.' + i + 'table').empty().append(html);

            data[i].values.forEach(v => {
                v.values.forEach(elt => {
                    elt.x = new Date(elt.x);
                });
            });

            var chart = new CanvasJS.Chart("chartContainerForKpiType_"+i,
                {
                    theme: _graphTheme,
                    exportEnabled: true,
                    animationEnabled: true,
                    axisX: {
                        title: "Time",
                        valueFormatString: "DD-MM-YY hh:mm tt",
                        labelAngle: -30,
                        labelFontSize: 10,
                        crosshair: {
                            enabled: true,
                            snapToDataPoint: true
                        }
                    },
                    axisY: {
                        title: data[i].kpi + ' (' + data[i].unit + ')',
                        includeZero: true,
                        crosshair: {
                            enabled: true
                        }
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        verticalAlign: "bottom",
                        horizontalAlign: "left",
                        dockInsidePlotArea: true,
                        itemclick: toggleDataSeries
                    },
                    data: GetGraphDataValues(data[i])
                });
            chart.render();
            
        }

    } else {
        //var value = $('#experimentdesc_id').val();
        //data = RetrieveKpiValuePerTestId(value);

        data = datasource;

        for (var i = 0; i < data.length; i++) {
            var html =
                '<div id="chartContainerForKpiType_' + i + '" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
            $('.' + i + 'table').empty().append(html);

            data[i].values.forEach(v => {
                v.values.forEach(elt => {
                    elt.x = new Date(elt.x);
                });
            });

            var chart = new CanvasJS.Chart("chartContainerForKpiType_" + i,
                {
                    theme: _graphTheme,
                    exportEnabled: true,
                    animationEnabled: true,
                    axisX: {
                        title: "Time",
                        valueFormatString: "DD-MM-YY hh:mm tt",
                        labelAngle: -30,
                        labelFontSize: 10,
                        crosshair: {
                            enabled: true,
                            snapToDataPoint: true
                        }
                    },
                    axisY: {
                        title: data[i].kpi + ' (' + data[i].unit + ')',
                        includeZero: true,
                        crosshair: {
                            enabled: true
                        }
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        verticalAlign: "bottom",
                        horizontalAlign: "left",
                        dockInsidePlotArea: true,
                        itemclick: toggleDataSeries
                    },
                    data: GetGraphDataValues(data[i])
                });
            chart.render();

        }
    }
}

function GetGraphDataValues(v) {
    var data = [];

    for (var i = 0; i < v.values.length; i++) {
        data.push({
            type: "line",
            showInLegend: true,
            name: v.values[i].graphName,
            markerType: "square",
            xValueFormatString: "DD MMM, YYYY",
            //color: "#F08080",
            dataPoints: ExtractDifferentGraph(v.values[i].values)
        });
    }
    return data;
}

function ExtractDifferentGraph(values) {
    var data = [];

    for (var i = 0; i < values.length; i++) {
        data.push({
            x: values[i].x,
            y: values[i].y
        });
    }
    
    return data;
}

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}

function VisualiseExperimentHistory() {

    var usecaseId = $('#ucdesc_id').val();
    var res = RetrieveAllTestDataSentByDataCollector(usecaseId);

    var data = [];
    for (var i = 0; i < res.length; i++) {
        data.push({
            'Experiment ID': res[i].experimentID,
            'Date Started': res[i].startedAt,
            'Date Ended': res[i].endedAt,
            'Data': '<i class="fa-regular fa-file-code"></i> File'
        });
    }

    var title = "users_table";

    var html = GetModalHtmlBlock(usecaseId);
    

    $(".homemodal").append(html);
    $(".modal").show();

    var table = DisplayTable(title, data, false, true);

    $('#users_table tbody').on('click', 'tr', function () {


        if ($(this).hasClass('selected')) {

            $(this).removeClass('selected');
            $('#view_experiment_btn').addClass('isDisabled');
            $('#download_csv_experiment_btn').addClass('isDisabled');
            $('#download_json_experiment_btn').addClass('isDisabled');
            $('#experiment_record_id').val(-1);

        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#view_experiment_btn').removeClass('isDisabled');
            $('#download_csv_experiment_btn').removeClass('isDisabled');
            $('#download_json_experiment_btn').removeClass('isDisabled');
            //var userId = parseFloat(this.firstElementChild.className);

            $('#experiment_record_id').val(table.row(this).data()['Experiment ID']);

            //$('#selected_user_id').val(userId);
        }
    });
}

function getTableButtons(title, advancedSearch = true) {
    let btns = [
        {
            extend: 'colvis',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-eye"></i>',
            className: 'table-icon-btn'
        },
        {
            extend: 'copy',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-copy"></i>',
            className: 'table-icon-btn'
        },
        {
            extend: 'pdf',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-file-pdf"></i>',
            className: 'table-icon-btn'
        },
        {
            extend: 'csv',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-file-csv"></i>',
            className: 'table-icon-btn'
        },
        {
            extend: 'excel',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-file-excel"></i>',
            className: 'table-icon-btn'
        }
    ];

    if (advancedSearch) {
        btns.push({
            text: '<i class="fa-brands fa-searchengin"></i>',
            className: 'table-icon-btn',
            action: function (e, dt, node, config) {
                $('#advancedSearchContainer-' + title).slideToggle(300);
            }
        })
    }

    return btns;
}

function GetModalHtmlBlock(usecaseId) {

    var useCase = RetrieveUCGeneralInfo(usecaseId);

    var html = '';

    html += '<div id="5ghubmodal" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>' + useCase.UseCaseDescription+' -------- History Details</h4>';
    html += '<span onclick="CloseModal()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'

    html += '                               <div class="col-md-12 col-12 scnariobuttons main-buttons-with-icons scenariobuttons">';
    html += '                                   <button id="view_experiment_btn" class="scenariobuttons isDisabled" type="button" onclick=""> View Details <i class="fa-solid fa-circle-info marginicon"></i></button>'
    html += '                                   <button id="download_csv_experiment_btn" class="scenariobuttons isDisabled" type="button" onclick="DownloadExperimentCsv()"> Export as Csv <i class="fa-solid fa-file-csv marginicon"></i></button>'
    html += '                                   <button id="download_json_experiment_btn" class="scenariobuttons isDisabled" type="button" onclick="DownloadExperimentJson()">Export as Json <i class="fa-solid fa-file-export marginicon"></i></button>'
    html += '                               </div>';

    html += '<div id="group_members_block">';

    html += '<table id="users_table" class="table table-striped table-bordered" style="width:100% !important">';
    html += '</table>';
    html += '<input type="hidden" id="experiment_record_id"/>'
    html += '</div>'
    /*start ROW OF 2*/
    

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-12 modaloverwriteerror">'
    html += '</div>';
    html += '</div>';

    html += '<div class="row" style="padding: 4px !important;">'
    //html += '<div class="col-sm-12 modalbuttons">'

    ////html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';


    //html += '<input class="btn btn-primary savebutton sacecancelbuttonoc" type = "button" value = "Overwrite" onclick = "CheckOverWriteButton()">'
    //html += '<input class="btn btn-primary sacecancelbuttonoc" type = "button" value = "Cancel" onclick = "CloseModal()">'

    html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'


    //html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';
    //html += '<button class="savebutton sacecancelbuttonoc" onclick="CheckOverWriteButton()" type="button">Overwrite<i class="marginicon fas fa-clone"></i></button>';
    html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';




    //html += '<a onclick = "SubmitNewKPIJS()"><i class="fas fa-plus-circle modalsinglebutton"></i></a>'
    //html += '<a onclick = "CloseModal()"><i class="fas fa-times modalsinglebutton"></i></a>'

    //html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';

    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>'; /*end of modal div*/

    return html;
}

function DownloadExperimentJson() {
    var selectedExperimentID = $('#experiment_record_id').val();
    if (selectedExperimentID !== '-1') {

        var exp = RetrieveAllTestDataSentByDataCollector($('#ucdesc_id').val())
            .filter(r => r.experimentID == selectedExperimentID)[0];

        var obj = JSON.stringify(exp.object);

        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob(["" + obj], { type: "application/json" }));
        a.download = exp.experimentID + ".json";
        a.click();
    }
}

function DownloadExperimentCsv() {
    var selectedExperimentID = $('#experiment_record_id').val();
    if (selectedExperimentID !== '-1') {

        var exp = RetrieveAllTestDataSentByDataCollector($('#ucdesc_id').val())
            .filter(r => r.experimentID == selectedExperimentID)[0];

        var obj = convertToCSV(exp.object);

        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([obj], { type: 'text/csv;charset=utf-8;' }));
        a.download = exp.experimentID + ".csv";
        a.click();
    }
}

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function DisplayTable(table_id_name, data, withButton, withColumnSearch) {
    var tableId = '#' + table_id_name;
    var title = table_id_name;

    var cols = getTableColFromObj(data);

    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    
    var datatable_object = {
        searching: true,
        data: data,
        columns: cols,
        buttons: null
    };

    if (withButton) {
        var buttons = getTableButtons(title);
        datatable_object.buttons = buttons;
    }

    var table = $('#users_table').DataTable(datatable_object);

    if (withColumnSearch) {
        setDatatableColumnSearch(title, table, title, false);
    }

    return table;
}

function getTableColFromObj(obj) {
    if (obj.length == 0) {
        return [];
    }
    let col = []
    for (var prop in obj[0]) {
        if (obj[0].hasOwnProperty(prop)) {
            col.push({
                "name": prop, "title": prop, "data": prop
            })
        }
    }
    return col;
}

function returnExportTitle(title) {
    return `${title} - ${new Date().toDateString()}`
}

async function setDatatableColumnSearch(tableId, table, pageName, resizeCol = true, advancedSearch = true, colVisibility = false) {

    if (tableId[0] == '#') {
        tableId = tableId.substring(1);
    }

    if (!colVisibility) {
        //TODO: take page name from function header
        let res = await preHideColumns(table, pageName, tableId)
    }


    //check if the request from colVisibility method -> remove old search header (the next part will add the new header)
    if (colVisibility) {
        let headers = $(`#${tableId} thead tr `);
        if (headers.length == 2) {
            headers[1].remove()
        }
    }
    else {
        if (resizeCol) {
            // set columns resize
            new $.fn.dataTable.ColResize(table, this.tableResizeOptions);
        }
    }

    // add search header
    let tableNH = $(`#${tableId} thead tr`).clone(false).appendTo(`#${tableId} thead`);
    tableNH.attr('class', 'searchHeader');
    $(`#${tableId} thead tr:eq(1) th`).each(function (i) {
        $(this).attr('style', 'background-color: white !important; padding:0');
        var title = $(this).text();

        //$(this).html(
        //    '<div class="form-outline">' +
        //    '<input type="text" class="form-control" placeholder="Search ' + title + '" />' +
        //    '</div>'
        //);
        $(this).html(
            '<input type="text" class="form-control" style="border:1px solid #f174a3" placeholder="Search ' + title + '" />'
        );

        //$(this).html(
        //    '<input type="text" placeholder="Search ' + title + '" />'
        //);

        // set input listener for each column
        $('input', this).on('keyup change', function () {
            if (table.column(i).search() !== this.value) {
                table
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
    });

    // add event listener for columns display change
    if (!colVisibility) {
        $(`#${tableId}`).on('column-visibility.dt', function (e, settings, column, state) {
            //console.log(
            //    'Column ' + column + ' has changed to ' + (state ? 'visible' : 'hidden')
            //);
            //TODO: Check if advnaced should be true or false
            setDatatableColumnSearch(tableId, table, pageName, resizeCol, advancedSearch, true)
            //console.log(table.columns());
            //console.log(table.columns().header().toArray().map(x => x.innerText));

            let inv = get_invisible_columns(table)
            handleColUpdate(pageName, tableId, inv)
        });
    }

    if (advancedSearch) {
        var columns = table.settings().init().columns;
        setUpAdvancedSearchArea(tableId, columns, 'EGTN-node')

        $('#applySearch' + tableId).click(function() {
            //currentTableSearch = title;
            setupAdvancedSearchObject(tableId)
            table.draw();
            currentTableSearch = '';
        });
    }

}

function preHideColumns(table, pageName, tableId) {
    //return new Promise(function (resolve, reject) {
    let colToHide = [];

    //if (!userSettings.pages) {
    //    return
    //}

    //let index = userSettings.pages.findIndex(x => x.name == pageName);
    //if (index > -1) {
    //    let index2 = userSettings.pages[index].tables.findIndex(x => x.tableId == tableId);
    //    if (index2 > -1) {
    //        colToHide = userSettings.pages[index].tables[index2].hiddenColumns;
    //    }
    //}
    //await hideColumns(table, colToHide);

    return new Promise(function(resolve, reject) {
        try {
            for (let i = 0; i < colToHide.length; i++) {
                let index = table.column(`${colToHide[i]}:name`).index();
                table.column(index).visible(!table.column(index).visible());;
            }
            resolve(true);
        } catch (ex) {
            reject(false)
        }
    });
}

function OnGraphType_Change() {
    var experiment_id = $('#experimentdesc_id').val();

    if (experiment_id !== '') {

        var new_selected_graph_type = $('#graph_type_selector').val();
        var uc_type = ($('#ucdesc_id option:selected')[0].className === 'netapp') ? 'netapp' : 'uc';

        var data;

        if (uc_type == 'netapp') {
            data = RetrieveKpiValuesPerExectionId(experiment_id);
        } else {
            data = RetrieveKpiValuePerTestId(experiment_id);
        }

        if (new_selected_graph_type === 'line_chart') {
            //Display TIME SERIES

            DisplayTemporaryKPIGraph_TimeSeries(new_selected_graph_type, data);

            ShowSuccessMessage("Changes Applied Successfully");

        } else if (new_selected_graph_type === 'bar_chart') {
            //Display BAR CHART
            DisplayTemporaryKPIGraph_BarChart(new_selected_graph_type, data);

            ShowSuccessMessage("Changes Applied Successfully");
        } else {
            //Display PIE CHART
            DisplayTemporaryKPIGraph_PieChart(new_selected_graph_type, data);

            ShowSuccessMessage("Changes Applied Successfully");
        }

    } else {
        ShowErrorMessage("Experiment Not Selected!");
    }
}

function DisplayTemporaryKPIGraph_BarChart(type, data) {
    for (var i = 0; i < data.length; i++) {
        var html =
            '<div id="chartContainerForKpiType_' +
                i +
                '" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
        $('.' + i + 'table').empty().append(html);

        data[i].values.forEach(v => {
            v.values.forEach(elt => {
                elt.x = new Date(elt.x);
            });
        });

        var chart = new CanvasJS.Chart("chartContainerForKpiType_" + i, {
            exportEnabled: true,
            animationEnabled: true,
            //title: {
            //    text: "Car Parts Sold in Different States"
            //},
            //subtitles: [{
            //    text: "Click Legend to Hide or Unhide Data Series"
            //}],
            axisX: {
                title: "Time",
                valueFormatString: "DD-MM-YY hh:mm tt",
                labelFontSize: 10
            },
            axisY: {
                title: data[i].kpi + ' (' + data[i].unit + ')',
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
                includeZero: true
            },
            //axisY2: {
            //    title: "Clutch - Units",
            //    titleFontColor: "#C0504E",
            //    lineColor: "#C0504E",
            //    labelFontColor: "#C0504E",
            //    tickColor: "#C0504E",
            //    includeZero: true
            //},
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: GetBarChartDatapoints(data[i].values)
        });
        chart.render();
    }
}

function GetBarChartDatapoints(data) {
    var res = [];

    for (var i = 0; i < data.length; i++) {
        var obj = {
            type: "column",
            name: data[0].graphName,
            //axisYType: "secondary",
            showInLegend: true,
            //yValueFormatString: "#,##0.# Units",
            dataPoints: ExtractDifferentGraph_1s(data[i].values)
        }

        res.push(obj);
    }
    return res;
}

function ExtractDifferentGraph_1s(values) {
    var data = [];

    for (var i = 0; i < values.length; i++) {
        data.push({
            label: values[i].x,
            y: values[i].y
        });
    }

    return data;
}

function DisplayTemporaryKPIGraph_PieChart(type, data) {
    for (var i = 0; i < data.length; i++) {
        var html =
            '<div id="chartContainerForKpiType_' +
                i +
                '" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
        $('.' + i + 'table').empty().append(html);

        data[i].values.forEach(v => {
            v.values.forEach(elt => {
                elt.x = new Date(elt.x);
            });
        });
        console.log(data[i]);
        var chart = new CanvasJS.Chart("chartContainerForKpiType_"+i, {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: data[i].kpi + ' Average Estimation'
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}%",
                dataPoints: GetPieChartDataPoints(data[i].values)
            }]
        });
        chart.render();
    }
}

function GetPieChartDataPoints(data) {
    var d = [];

    for (var i = 0; i < data.length; i++) {
        var sum = 0;
        var dt = {
            label: data[i].graphName,
            y: null
        };

        for (var j = 0; j < data[i].values.length; j++) {
            sum += data[i].values[j].y;
        }

        dt.y = sum / data[i].values.length;

        d.push(dt);
    }

    return d;
}

//---------------------PERMISSIONS------------------

function ApplyUserPermissions() {
    if (userGroups.length) {
        for (var i = 0; i < userGroups.length; i++) {
            console.log(userGroups[i].name);
            //if(userGroups[i].name === 'Experiment Runners'){}
        }

        $('.nav-menu').remove();
        RenderSideMenuItems();
        

        if (!userGroups.some(u => u.name.toLowerCase() === 'catalogue users')) {
            $('#iframe1').remove();
        }

        if (!userGroups.some(u => u.name.toLowerCase() === 'umm administrators')) {
            $('#iframe2').remove();
        }

        if (!userGroups.some(u => u.name.toLowerCase() === 'netapps repo users')) {
            $('#iframe3').remove();
        }

        if (!userGroups.some(u => u.name.toLowerCase() === 'v&v engine users')) {
            $('#iframe4').remove();
        }

        //if ($('#collapse_show_iframes div ul').length <= 1) {
        //    $('.accordion').remove();
        //}

    }
}