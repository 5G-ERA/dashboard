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

function PI_GenerateThresholdStatusTables(response) {
    var compositeKpis = RetrieveCompositeKpiTypes();

    for (var index in compositeKpis) {

        var compositeKpiName = compositeKpis[index].KpiSubTypeCode;

        GenerateKpiThresholdTable(compositeKpiName + "_table_id", compositeKpiName + "_kpi_threshold_tab", response, compositeKpiName);

    }
}

function PI_GenerateScenarioMeasurementTables(response) {
    var compositeKpis = RetrieveCompositeKpiTypes();

    for (var index in compositeKpis) {
        var KPISubTypeId = compositeKpis[index].KpiSubTypeID;
        var compositeKpiName = compositeKpis[index].KpiSubTypeCode;

        var res = response.filter(pi => pi.KPISubTypeId == KPISubTypeId);

        GenerateKpiMeasurementTable(compositeKpiName + "_measurement_table_id",
            KPISubTypeId + "_kpi_measurement_values_tab",
            res,
            KPISubTypeId);
    }
}

function RefreshKpiThreshodTables() {
    usecase_id = $('#ucdesc_id').val();

    FillThresholdTablesWithData(usecase_id);
}

function GenerateKpiThresholdTable(tableid, tableclass, data, subtype) {
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
        html += '<th class="th-green-bg">Green</th>';
        html += '<th class="th-red-bg">Red</th>';
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
                    html += '<td style="display:none" class ="piid">' + data[i].PIId + '</td >';
                    html += '<td>' + ShortDescription + '</td >';
                    html += '<td class="td-align-center">' + HighOperator + ' ' + HighValue + ' ' + Unit + '</td >';
                    html += '<td class="td-align-center">' + LowOperator + ' ' + LowValue + ' ' + Unit + '</td >';
                    html += '</tr>';
                }
            }
        }
        html += '</tbody>';
        html += '<input type="hidden" id="' + subtype + '_selected_piid_value"/>';
        html += '</table>';
        if (count > 0) {
            //$('.' + tableid + '_graph').removeClass('isDisabled')
            $('.' + tableclass).empty().append(html);
            $(document).ready(function () {
                var table = $('#' + tableid).DataTable({
                    searching: false,
                    paging: false,
                    info: false,
                    destroy: true
                });


                var id;
                $('#' + tableid + ' tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        id = -1;
                        $('.' + tableid + '_edit').addClass('isDisabled')
                        $('.' + tableid + '_delete').addClass('isDisabled')
                        ClickedOnRowSetSelectedID(tableid, id);
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                        id = $('#' + tableid + ' .selected .piid').text()
                        $('.' + tableid + '_edit').removeClass('isDisabled')
                        $('.' + tableid + '_delete').removeClass('isDisabled')
                        ClickedOnRowSetSelectedID(tableid, id);
                        $('#' + subtype + '_selected_piid_value').val(id);
                    }
                });
            });
        } else {
            $('.' + tableclass).empty();
            /*$('.' + tableid + '_graph').addClass('isDisabled')*/
        }
    }
    //ShowTableButton(tableid, 'graph');
    ShowTableButton(tableid, 'add');
    ShowTableButton(tableid, 'edit');
    ShowTableButton(tableid, 'delete');
    //HideTableButton(tableid, 'table');
    DisableTableButtons_EditDelete(tableid);
}

function GenerateKpiMeasurementTable(tableid, tableclass, data, subTypeId) {
    //debugger
    var ShortDescription;
    var HighValue;
    //var Unit;
    //var LowOperator;
    //var HighOperator;
    var LowValue;
    if (typeof (data) != 'undefined' && data != []) {
        var count = 0;
        var html = '';
        html += '<table id="' + tableid + '" class="display ' + data[0].KPISubTypeId + '_type_measure_value" style="width:100%">';

        html += '<thead>';
        html += '<tr>';
        html += '<tr>';
        //Start Hidden columns declaration
        html += '<th style="display:none">Scenario Measurement ID</th>';
        html += '<th style="display:none">PI ID</th>';
        html += '<th style="display:none">KPI SubType ID</th>';
        html += '<th style="display:none">Low Value</th>';
        html += '<th style="display:none">Low Operator</th>';
        html += '<th style="display:none">High Operator</th>';
        html += '<th style="display:none">High Value</th>';
        html += '<th style="display:none">Unit Of Measure</th>';
        //End Hidden columns declaration

        html += '<th>Performance Indicators</th>';
        html += '<th>Value</th>';
        html += '<th>Satisfaction Level</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '<tr>';
        if (data != 'undefined' && data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].KPISubTypeId == subTypeId) {
                    ShortDescription = data[i].ShortDescription || "";
                    HighValue = data[i].HighValue || "";
                    //Unit = data[i].Unit || "";
                    //LowOperator = data[i].LowOperator || "";
                    LowValue = data[i].LowValue || "";
                    count++;

                    //Start Hidden columns values
                    html += '<td style="display:none" class ="TSM_ScenarioMeasurementId">' + data[i].ScenarioMeasurementId + '</td >';
                    html += '<td style="display:none" class ="TSM_PIId">' + data[i].PIId + '</td >';
                    html += '<td style="display:none" class ="TSM_KpiSubTypeId">' + data[i].KPISubTypeId + '</td >';
                    html += '<td style="display:none" class ="TSM_LowValue">' + data[i].LowValue + '</td >';
                    html += '<td style="display:none" class ="TSM_LowOperator">' + data[i].LowOperator + '</td >';
                    html += '<td style="display:none" class ="TSM_HighOperator">' + data[i].HighOperator + '</td >';
                    html += '<td style="display:none" class ="TSM_HighValue">' + data[i].HighValue + '</td >';
                    html += '<td style="display:none" class ="TSM_UnitOfMeasure">' + data[i].UnitOfMeasure + '</td >';
                    //End Hidden columns values

                    html += '<td>' + ShortDescription + '</td >';
                    html += '<td style="width:100px"><input type="text" id="measure_field_value_id' + data[i].ScenarioMeasurementId + '" readonly alt="' + data[i].ScenarioMeasurementId + '" class="measurement-value-field measure-value-type-' + data[i].KPISubTypeId + '" /></td >';
                    html += '<td id="satifactory_level_' + data[i].ScenarioMeasurementId + '" class="ms-value" style="width:90px"></td >';
                    html += '</tr>';
                }
            }
        }
        html += '</tbody>';
        html += '</table>';
        if (count > 0) {
            //$('.' + tableid + '_graph').removeClass('isDisabled')
            $('.' + tableclass).empty().append(html);
            $(document).ready(function () {
                var table = $('#' + tableid).DataTable({
                    searching: false,
                    paging: false,
                    info: false,
                    destroy: true
                });
                var testScenarioMeasurement_id;

                $('#' + tableid + ' tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        testScenarioMeasurement_id = -1;
                        //$('.' + tableid + '_edit').addClass('isDisabled')
                        //$('.' + tableid + '_delete').addClass('isDisabled');
                        ClickedOnRowSetSelectedID(tableid, testScenarioMeasurement_id);

                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                        testScenarioMeasurement_id = $('#' + tableid + ' .selected .TSM_ScenarioMeasurementId').text();
                        //$('.' + tableid + '_edit').removeClass('isDisabled')
                        //$('.' + tableid + '_delete').removeClass('isDisabled');
                        ClickedOnRowSetSelectedID(tableid, testScenarioMeasurement_id);
                    }
                });
            });

            //Finally get latest valid measurement values

            if (data != 'undefined' && data != null && data.length > 0) {

                var percentageSum = 0;
                var counter = 0;
                var testScenarioId = $('#testscenariodesc_id').val();

                for (var i = 0; i < data.length; i++) {

                    var individualValue = RetrieveLatestTestScenarioMeasureValue(testScenarioId, data[i].ScenarioMeasurementId);
                    if (individualValue != null) {
                        if (individualValue.SatisfactoryLevelTypeValue != 'None') {
                            ApplyMeasureSatisfactoryLevel(individualValue);
                            percentageSum += individualValue.SatisfactoryPercentageValue;
                            counter++;
                        }
                    }

                    ApplyMeasureSatisfactoryLevel(individualValue);
                }
                var meanPercentage = Math.floor(percentageSum / counter);

                SetCompositeKpiMeanPercentage(meanPercentage, subTypeId);

                var values = $('.measure-value-type-' + subTypeId);
                var c = 0;

                values.each(function () {
                    if (this.value !== "") {
                        c++;
                    }
                });

                if (c > 0) TSCENARIO_EnableResetTableValues(subTypeId);
            }

        } else {
            $('.' + tableclass).empty();
            //$('.' + tableid + '_graph').addClass('isDisabled')
        }
    }
    //ShowTableButton(tableid, 'graph');
    //ShowTableButton(tableid, 'add');
    //ShowTableButton(tableid, 'edit');
    ShowTableButton(tableid, 'delete');
    //HideTableButton(tableid, 'table');
    DisableTableButtons_EditDelete(tableid);
}

function SetCompositeKpiMeanPercentage(percentage, subTypeId) {
    if (!isNaN(percentage) && percentage != 'Undefined') {
        $('#' + subTypeId + '_Percentage_value').empty().append(percentage + ' %');
    }
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
        html += '<th class="th-green-bg">Green</th>';
        html += '<th class="th-red-bg">Red</th>';
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
                    html += '<td style="display:none" class ="piid">' + data[i].PIId + '</td >';
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
                    destroy: true
                });
                var id;
                $('#' + tableid + ' tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        id = -1;
                        $('.' + tableid + '_edit').addClass('isDisabled')
                        $('.' + tableid + '_delete').addClass('isDisabled')
                        ClickedOnRowSetSelectedID(tableid, id);
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                        id = $('#' + tableid + ' .selected .piid').text()
                        $('.' + tableid + '_edit').removeClass('isDisabled')
                        $('.' + tableid + '_delete').removeClass('isDisabled')
                        ClickedOnRowSetSelectedID(tableid, id);
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

function EditKpiMeasurementValues(kpiTypeId) {
    $('.' + kpiTypeId + '_table_value_id_edit').hide();
    $('.' + kpiTypeId + '_table_value_id_cancel').show();
    $('.' + kpiTypeId + '_table_value_id_save').show();

    //Make all input in this table writable
    $('.measure-value-type-' + kpiTypeId).prop('readonly', false);
}

function DiscardKpiMeasurementValues(kpiTypeId) {
    $('.' + kpiTypeId + '_table_value_id_edit').show();

    $('.' + kpiTypeId + '_table_value_id_cancel').hide();

    $('.' + kpiTypeId + '_table_value_id_save').hide();

    //$('.measure-value-type-' + kpiTypeId).val(0); //set all to 0 for now

    $('.measure-value-type-' + kpiTypeId).prop('readonly', true);
}

function SaveKpiMeasurementValues(kpiTypeId) {

    $('.' + kpiTypeId + '_table_value_id_edit').show();

    $('.' + kpiTypeId + '_table_value_id_cancel').hide();

    $('.' + kpiTypeId + '_table_value_id_save').hide();

    $('.' + kpiTypeId + '_table_value_id_reset').removeClass("isDisabled");

    $('.measure-value-type-' + kpiTypeId).prop('readonly', true);

    var kpiMeasurementValuesInputs = $('.measure-value-type-' + kpiTypeId);
    var kpiMeasurementValues = [];

    kpiMeasurementValuesInputs.each(function () {
        var measurementId = parseInt(this.alt);
        kpiMeasurementValues.push({ measurementId: measurementId, measurementValue: (this.value === "") ? null : Number(this.value) });
    });

    AddAllTestScenarioMeasures(kpiTypeId, kpiMeasurementValues);
    RefreshTestScenarioSpiderGraph();
}

function ResetKpiMeasurementValues(kpiTypeId) {
    $('.measure-value-type-' + kpiTypeId).val("");
    $('.' + kpiTypeId + '_table_value_id_reset').addClass("isDisabled");


    try {
        SaveKpiMeasurementValues(kpiTypeId);
        var kpiMeasurementValuesInputs = $('.measure-value-type-' + kpiTypeId);

        kpiMeasurementValuesInputs.each(function () {
            var measurementId = parseInt(this.alt);
            var obj = {
                MeasurementId: measurementId,
                SatisfactoryLevelType: null
            };

            ApplyMeasureSatisfactoryLevel(obj);
        });

        ShowSuccessMessage("Measurement Value Table Cleared Successfully");
    } catch (e) {
        ShowErrorMessage("Sorry, Something Wrong Happened! Try again later")
    }

}

function DisplayCompositeKpiGraph(kpiTypeId, kpiTypeName) {
    html = '<div id="chartContainer_' + kpiTypeId + '" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>'
    $('.' + kpiTypeId + '_kpi_measurement_values_tab').empty().append(html);
}

function RefreshTestScenarioSpiderGraph() {

    $.LoadingOverlay("show", {
        text: "Loading...",
        textColor: "#131313",
        imageColor: "#1b7db5",
    });

    var testScenario_id = $('#testscenariodesc_id').val();
    var testScenario = RetrieveTestScenarioDetailsPerId(testScenario_id);

    var testScenarioPercentageValues = RetrieveAllTestMeasurementValuesPerTest(testScenario_id);
    var kpis = [];
    var values = [];

    for (var x in testScenarioPercentageValues) {
        kpis.push(testScenarioPercentageValues[x].KpiSubTypeCode);
        values.push(testScenarioPercentageValues[x].PercentageValue);
    }

    $.LoadingOverlay("hide");

    ShowTestScenarioSpiderGraph(testScenario, kpis, values);
}

function GenerateScenarioAnalyticLegend(tests) {
    var html = '<div class="form-check">';

    for (var i in tests) {

        html += '<label class="list-group-item strike" onclick="ToggleLegendItem(' + tests[i].TestScenarioId + ')" id="legend_row_' + tests[i].TestScenarioId + '" style="font-size:12px; text-align:center; font-weight:500;    display: flex;padding: 5 %;align-items: center">';
        html += '<div class="legend-box-color" style="background-color: ' + tests[i].TestScenarioColor + '"></div>';
        html += '<b style="padding-left: 4%">' + tests[i].TestScenarioName + '</b>';
        html += '</label >';
        html += '<input class="form-check-input me-1" type="checkbox"  style="visibility:hidden;">';
    }
    html += '</div>';

    $('#scenario_legend_id').empty().append(html);
}

function ToggleLegendItem(testId) {
    $.LoadingOverlay("show", {
        text: "Loading...",
        textColor: "#131313",
        imageColor: "#1b7db5",
    });

    var compositeKpiTypes = RetrieveCompositeKpiTypes();

    var selectedItem = $('#legend_row_' + testId);
    selectedItem.toggleClass('strike');

    if (selectedItem.hasClass('strike')) {

        RemoveAnalyticGraph(testId, compositeKpiTypes);
    } else {
        UpdateAnalyticGraph(testId, compositeKpiTypes);
    }

    $.LoadingOverlay("hide");

}


function RemoveAnalyticGraph(testId, compositeKpiTypes) {

    zingchart.exec('scenario_spider_chart',
        'removeplot',
        {
            plotid: 'plot_for_test_' + testId
        });

    //Remove selected test from the list
    selectedTests = selectedTests.filter(t => t.testId !== testId);
    var plotLength = zingchart.exec('aggregated_scenario_spider_chart', 'getplotlength');
    for (var i = 1; i < plotLength; i++) {
        zingchart.exec('aggregated_scenario_spider_chart',
            'removeplot',
            {
                plotindex: i
            });

    }
    //Update Graph
    UpdateAggregratedSpiderGraph(testId, compositeKpiTypes);

    RemoveCompositeKpiAnalyticGraph(testId, compositeKpiTypes);
}

function RemoveCompositeKpiAnalyticGraph(testId, compositeKpiTypes) {
    var usecaseId = $('#ucdesc_id').val();
    var allPis = RetrievePIMeasurementDetails(usecaseId);
    console.log(allPis);

    for (var i in compositeKpiTypes) {
        var compositeKpiName = compositeKpiTypes[i].KpiSubTypeCode;
        var pis = allPis.filter(p => p.KPISubTypeId == compositeKpiTypes[i].KpiSubTypeID);

        for (var x = 0; x < pis.length; x++) {

            zingchart.exec(compositeKpiName + '_' + x + '_chart',
                'removeplot',
                {
                    plotid: 'graph_for_PI' + pis[x].PIId + '_test_' + testId
                });


            zingchart.exec(compositeKpiName + '_' + x + '_chart',
                'removeplot',
                {
                    plotid: 'graph_for_aggregated_PI'
                });

            UpdateAggregatedPerformanceIndicatorsGraph(pis[x].PIId, compositeKpiName + '_' + x + '_chart');
        }

    }
}

function UpdateAnalyticGraph(testId, compositeKpiTypes) {

    var testDetails = RetrieveTestDetailsPerId(testId);

    var values = RetrieveAllTestMeasurementValuesPerTest(testId);
    var raw_values = RetrieveDetailedTestMeasurmentValues(testId);


    selectedTests.push({
        testId: testDetails.TestScenarioId,
        testDetails: testDetails,
        values: values,
        raw_values: raw_values
    });

    var testPercentageValues = [];

    for (var x in compositeKpiTypes) {

        var matchingValue = values.filter(v => v.KpiSubTypeId == compositeKpiTypes[x].KpiSubTypeID);

        if (Array.isArray(matchingValue) && matchingValue.length) {
            testPercentageValues.push(matchingValue[0].PercentageValue);
        } else {
            testPercentageValues.push(0);
        }
    }

    var graphValues = [];

    graphValues.push({
        id: 'plot_for_test_' + testId,
        values: testPercentageValues,
        text: testDetails.TestScenarioName,
        backgroundColor: testDetails.TestScenarioColor,
        lineColor: testDetails.TestScenarioColor,
        marker: {
            backgroundColor: testDetails.TestScenarioColor
        }
    });

    var aggregratedGraphValues = [];

    if (selectedTests.length >= 1) {

        var aggregratedPercentages = GetAggregratedPercentageValues(testId, compositeKpiTypes);
        aggregratedGraphValues.push({
            id: 'plot_for_aggregrated_test',
            values: aggregratedPercentages,
            backgroundColor: "#351431",
            lineColor: "#351431",
            marker: {
                backgroundColor: "#351431"
            }
        });

        // Render individual graph
        zingchart.exec('scenario_spider_chart',
            'addplot',
            {
                data: graphValues[0]
            });
    }

    //update aggregrated graph

    if (selectedTests.length > 1) {
        zingchart.exec('aggregated_scenario_spider_chart',
            'removeplot',
            {
                plotindex: 1

            });
    }

    zingchart.exec('aggregated_scenario_spider_chart',
        'addplot',
        {
            data: aggregratedGraphValues[0]
        });

    UpdateCompositeKpiAnalyticGraph(testDetails, compositeKpiTypes);
}

function UpdateCompositeKpiAnalyticGraph(testDetails, compositeKpiTypes) {
    for (var i = 0; i < compositeKpiTypes.length; i++) {
        var compositeKpiId = compositeKpiTypes[i].KpiSubTypeID;

        var testValues = RetrieveMeasurementValuesPerTestAndKpiSubtypeId(testDetails.TestScenarioId, compositeKpiId);

        var res = [];

        for (var x = 0; x < testValues.length; x++) {
            res.push({
                id: 'graph_for_PI' + testValues[x].PiId + '_test_' + testDetails.TestScenarioId,
                type: "bar",
                values: Array.of(null, testValues[x].MeasurementValue),
                text: testValues[x].TestName,
                barWidth: "50%",
                'value-box': {
                    text: "%t",
                    type: "first",
                    placement: "bottom",
                    'font-size': 8,
                    backgroundColor: "white",
                    fontColor: testDetails.TestScenarioColor,
                    "border-radius": 4,
                    angle: 30,
                    "offset-y": 25
                },
                backgroundColor: testDetails.TestScenarioColor,
                lineColor: testDetails.TestScenarioColor,
                marker: {
                    backgroundColor: testDetails.TestScenarioColor
                }
            });

            zingchart.exec(compositeKpiTypes[i].KpiSubTypeCode + '_' + x + '_chart',
                'addplot',
                {
                    data: res[x]
                });

            var aggregatedRes = [];
            aggregatedRes.push({
                id: 'graph_for_aggregated_PI',
                type: "bar",
                values: Array.of(null, GetAggregratedValues(testValues[x].PiId)),
                text: "Aggregated",
                barWidth: "50%",
                'value-box': {
                    text: "%t",
                    type: "first",
                    placement: "bottom",
                    'font-size': 10,
                    fontColor: "#351431",
                    "offset-y": 25
                },
                backgroundColor: "#351431",
                lineColor: "#351431",
                marker: {
                    backgroundColor: "#351431"
                }
            });



            //Remove previous aggregrated graph pi if exists
            zingchart.exec(compositeKpiTypes[i].KpiSubTypeCode + '_' + x + '_chart',
                'removeplot',
                {
                    plotid: 'graph_for_aggregated_PI'
                });

            //Add new aggregrated graph pi
            zingchart.exec(compositeKpiTypes[i].KpiSubTypeCode + '_' + x + '_chart',
                'addplot',
                {
                    data: aggregatedRes[0]
                });
        }

    }
}

function GetAggregratedPercentageValues(testId, compositeKpis) {
    var compositePercentages = [];

    var data = selectedTests.map(t => t.raw_values);

    if (selectedTests.length === 1) {
        for (var x = 0; x < compositeKpis.length; x++) {

            var matchingValue = selectedTests[0].values.filter(v => v.KpiSubTypeId == compositeKpis[x].KpiSubTypeID);

            if (Array.isArray(matchingValue) && matchingValue.length) {
                compositePercentages.push(matchingValue[0].PercentageValue);
            } else {
                compositePercentages.push(0);
            }
        }
    }
    else if (selectedTests.length > 1) {
        for (var i = 0; i < compositeKpis.length; i++) {
            var allMeasuresValues = data.flat().filter(v => v.kpiSubTypeId === compositeKpis[i].KpiSubTypeID);

            var groupedMeasuresPerKPI = allMeasuresValues.reduce((acc, value) => {

                acc[value.measurementId] = [...acc[value.measurementId] || [], value];
                return acc;
            },
                {});

            var performanceIndicatorsPercentages = [];
            for (var k in groupedMeasuresPerKPI) {

                var sum = 0;

                for (var j = 0; j < groupedMeasuresPerKPI[k].length; j++) {
                    var t = groupedMeasuresPerKPI[k];
                    sum += t[j].measurementValue;
                }

                var mean = sum / groupedMeasuresPerKPI[k].length;

                var aggValue =
                    GetMeasureSatisfactoryLevelInfos(testId, groupedMeasuresPerKPI[k][0].measurementId, mean);
                performanceIndicatorsPercentages.push(aggValue.satisfactoryPercentageValue);
            }

            var performanceAggValue = 0;
            var s = 0;

            for (var l = 0; l < performanceIndicatorsPercentages.length; l++) {
                s += performanceIndicatorsPercentages[l];
            }

            performanceAggValue = s / performanceIndicatorsPercentages.length;

            if (isNaN(performanceAggValue)) performanceAggValue = null;

            compositePercentages.push(performanceAggValue);
        }

    }
    return compositePercentages;
}

function GetAggregratedValues(piid) {
    var allPis = [];

    for (var i = 0; i < selectedTests.length; i++) {

        for (var j = 0; j < selectedTests[i].raw_values.length; j++) {

            if (selectedTests[i].raw_values[j].piId === piid) {
                allPis.push(selectedTests[i].raw_values[j]);
            }
        }
    }

    if (Array.isArray(allPis) && !allPis.length) {
        return null;
    }

    var sum = 0;
    for (var k = 0; k < allPis.length; k++) {

        sum += allPis[k].measurementValue;
    }

    return sum / allPis.length;
}

function UpdateAggregratedSpiderGraph(testId, compositeKpiTypes) {
    var aggregratedGraphValues = [];

    var aggregratedPercentages = GetAggregratedPercentageValues(testId, compositeKpiTypes);

    if (aggregratedPercentages.length > 0) {
        aggregratedGraphValues.push({
            id: 'plot_for_aggregrated_test',
            values: aggregratedPercentages,
            backgroundColor: "#351431",
            lineColor: "#351431",
            marker: {
                backgroundColor: "#351431"
            }
        });

        zingchart.exec('aggregated_scenario_spider_chart',
            'addplot',
            {
                data: aggregratedGraphValues[0]
            });
    }
}

function UpdateAggregatedPerformanceIndicatorsGraph(piid, chartId) {

    var aggregatedRes = [];
    aggregatedRes.push({
        id: 'graph_for_aggregated_PI',
        type: "bar",
        values: Array.of(null, GetAggregratedValues(piid)),
        text: "Aggregated",
        barWidth: "50%",
        'value-box': {
            text: "%t",
            type: "first",
            placement: "bottom",
            'font-size': 10,
            fontColor: "#351431",
            "offset-y": 25
        },
        backgroundColor: "#351431",
        lineColor: "#351431",
        marker: {
            backgroundColor: "#351431"
        }
    });

    zingchart.exec(chartId,
        'addplot',
        {
            data: aggregatedRes[0]
        });
}

//--------  test result development-------


function FillGrid_ExperimentResultsEvaluation(id) {
    //  debugger;
    $('.experimentresults_data_area').hide();
    $('.ColumnTestResult-bottomContainer-main').empty();

    var jsonData = RetrieveSingleExperimentResultsEvaluation(id);
    var date = DateConversion(jsonData.EntryDate)

    var filename = jsonData.ExcelFileName;

    $('#uc_date_id2').val(date);
    var datatable = [];

    // convert data json to object
    datatable = JSON.parse(jsonData.Data.replace(/\\/g, ""));

    $('#attached_file_name').val(jsonData.UniqueResultId);

    // this is result table id
    let title = 'experimentresultsevaluation_table'
    let tableId = '#' + title;

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    let columns1 = [];
    for (var i = 0; i < datatable.length; i++) {
        
        let objData = Object.keys(datatable[i]);
        let cols = [];

        for (var col in objData) {
           
            cols.push({
                name: objData[col],
                title: objData[col].toUpperCase(),
                data: objData[col],
                autoWidth: true
            });

        }
        columns1.push(cols);
        break;
    }
    let mapPolylineValues = [];
    var table = $(tableId).DataTable({
        ordering: false,
        data: datatable,
        searching: true,
        destroy: true,
        columns: columns1[0],
        //"columnDefs": [
            //{
            //    targets: [0],
            //    //ordering: true,
            //    render: function (data, type, row) {
            //        alert(data +'/'+ type+'/'+ row);
            //        //if (null == data)
            //        //    return data;
            //        //return stringToDatestamp(data);
            //    },
            //},
            //{
            //    targets: [1],
            //    orderData: [1, 2]
            //}
        //],
        
        //this dome added for display header filter and export icons button (copy, csv,excel etc.)
        dom: 'lBfrtip', //Bfrtip
        //getTableButtons this function implemented in main.js file
        // this function use for adding all colvin options and its properties
        //buttons: getTableButtons(title, true)
    });
    jsonData = null;
    var datachartPoints = [];
    debugger
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let colIdx = 0; let colAsc = 0;
        $.each(this.data(), function (key, value) {
            //debugger;
            var convertDate = moment(value).format('YYYY-MM-DD');
           
            // convert the date string to a Date object >= replace this with your own comparison date
            if (new Date(convertDate) >= new Date("2000-01-01")) {
                var newFormatDate = moment(value).format('DD/MM/YYYY HH:mm:ss:ms');
                //var vallss = stringToDatestamp(value, false);
               // debugger;
                table.cell(rowIdx, colIdx).data(newFormatDate);
                datachartPoints.push({ "label": newFormatDate.split(' ')[2], "y": null });
                colAsc = colIdx;
            }
            colIdx++;
        });
    
        if ((table.rows().count() - 1) == rowIdx) {
            var column = table.columns();
            var currentOrder = column.order()[colAsc];
            // Toggle sorting order between ascending and descending
            debugger
            column.order(currentOrder === 'asc' ? 'desc' : 'asc').draw();
            if (datachartPoints.length > 0) {
                TestResultCanvasJS_Chart(datachartPoints);
            }
        }
    });

    // this function use for adding table column search textbox ('UseCaseScenarios' (this is partial page in 5G controller))
    setDatatableColumnSearch(title, table, 'UseCaseScenarios')
    // added file display time in (mili sec)
    setTimeout(function () {
        datatable_addexcelname_area(filename)
        $('.experimentresults_data_area').show();

    }, 250);
    $('.experimentresultsevaluation_table').show();
    
    // line chart funcion
    TestResultCanvasJS_Chart(table.rows().data());


    //$(tableId + ' tbody').on('click', 'tr', function () {
    //   /* debugger;*/
    //    var row = $('#experimentresultsevaluation_table').DataTable().row(this).data();

    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //        $('#map1').show();
    //        $('.cst-map2').hide();
    //        TestResultCanvasJS_Chart(table, 1, null);
    //    }
    //    else {
    //        table.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //        TestResultCanvasJS_Chart(row, 0, null);
    //        TestResult_googleMap((row.lon != null ? row.lon : row.Longitude), (row.lat != null ? row.lat : row.Latitude), new Date((row.date_and_time != null ? row.date_and_time : row.Timestamp)));
    //        $('#map1').hide();
    //        $('.cst-map2').show();
    //    }
    //});
    // while serching in searchbox reading current displayed rows
    $('#experimentresultsevaluation_table').on('search.dt', function () {
       testResultHeaderAvg(table, 'Filter');
     });

    //$('#experimentresultsevaluation_table').on('page.dt', function () {
    //    //debugger
    //    testResultHeaderAvg(table, null);
    //});
}

function median1(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
};
//function ReadTimestamp(str) {
//    return stringToDatestamp(str).split(' ')[2];
//    //var d = date.split(' ')[2];
//    //return date.split(' ')[2];

//    //let hh = date.getHours();
//    //let mm = date.getMinutes();
//    //let ss = date.getSeconds();
//    //let ms = date.getMilliseconds();

//   // return (hh < 10 ? '0' + hh : hh) + ":" + (mm < 10 ? '0' + mm : mm) + ":" + (ss < 10 ? '0' + ss : ss) + ":" + (ms < 10 ? '0' + ms : ms);
 
//}
function stringToDatestamp(str, time) {
    debugger;
    let date = new Date(str);
    if (date == 'Invalid Date') {
        return str.split(' ')[2];
    }
    else {
        let dd = date.getDate();
        let mo = date.getMonth() + 1;

        let customDate = (dd < 10 ? '0' + dd : dd) + "/" + (mo < 10 ? '0' + mo : mo) + "/" + date.getFullYear();

        let hh = date.getHours();
        let mm = date.getMinutes();
        let ss = date.getSeconds();
        let ms = date.getMilliseconds();

        if (time) {
            return (hh < 10 ? '0' + hh : hh) + ":" + (mm < 10 ? '0' + mm : mm) + ":" + (ss < 10 ? '0' + ss : ss) + ":" + (ms < 10 ? '0' + ms : ms);
        }
        else {
            return customDate + "  " + (hh < 10 ? '0' + hh : hh) + ":" + (mm < 10 ? '0' + mm : mm) + ":" + (ss < 10 ? '0' + ss : ss) + ":" + (ms < 10 ? '0' + ms : ms);
        }
    }
   // let ms = new Date(str).getMilliseconds();
   // return new Date(str).toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', " ") + ':' + (ms < 10 ? '0' + ms : ms);
    //Modify string comma position

    //var dateString = str.toString();

    //if (dateString.length >= 13) {
    //    var f = dateString.replace('.', '');
    //    var fd = f.substring(0, 13);
    //    //+ '.' + f.substring(14, f.length - 1);

    //    return new Date(parseInt(fd));
    //} else {
    //    return new Date(dateString);
    //}
}
function TestResult_googleMap(longitude, latitude, date) {
    //debugger;

    //Display google map
    var coordinates = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

    if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {

        var map = new google.maps.Map(

            document.getElementById('google_testresult_route_map'),
            {
                zoom: 9,
                center: coordinates,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER,
                },
            });

        const marker = new google.maps.Marker({
            position: coordinates,
            map: map
        });

        var contentString = '<div id="content">' +
            '<div id="bodyContent">' +
            '<center><b>Latitude</b>: ' + latitude + ' </center>' +
            '<center><b>Longitude</b>: ' + longitude + ' </center>' +
            '</div> </div>';

        const infowindow1 = new google.maps.InfoWindow({
            content: contentString,
            //ariaLabel: "Uluru",
        });

        marker.addListener("click", () => {
            infowindow1.open({
                anchor: marker,
                map,
            });
        });
    
    }

}

function initMap1(flightPlanCoordinates) {
  //debugger;
    const map = new google.maps.Map(document.getElementById("map1"), {
        zoom: 3,
        center: { lat: 0, lng: -180 },
        mapTypeId: "terrain",
    });
    const flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    flightPath.setMap(map);
}
