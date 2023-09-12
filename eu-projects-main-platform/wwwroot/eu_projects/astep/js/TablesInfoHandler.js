var localisationselected, trajectoryselected, safetyselected, ctimessagesafetyselected, videoselected, sensorselected, routingalgorithmselected, gamingselected, dedicatedselected, smsselected, mobilityselected, radiocoverageselected, radiocapacityselected, networklatencyselected, couldandmecselected
var table;

function RefreshKpiThreshodTables() {
    usecase_id = $('#ucdesc_id').val();

    FillThresholdTablesWithData(usecase_id);
}

function FillGrid_ExperimentResultsEvaluation(id) {
    //debugger;
    $('.experimentresults_data_area').hide();
    $('.experiment_graph').hide();
    $('.ColumnTestResult-bottomContainer-main').empty();

    var jsonData = RetrieveSingleExperimentResultsEvaluation(id);

    var datatable = [];

    // convert data json to object
    //datatable = JSON.parse(jsonData);
    datatable = jsonData
    
    // this is result table id
    let title = 'experimentresultsevaluation_table'
    let tableId = '#' + title;
    //if datatable aready exist destroy to create a new one(the dropdown changed)

    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        //$(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    let columns1 = [];
    for (var i = 0; i < datatable.length; i++) {

        let objData = Object.keys(datatable[i]);
        let cols = [];

        for (var col in objData) {

            cols.push({
                name: objData[col],
                title: objData[col],
                data: objData[col],
                autoWidth: true
            });
            //debugger
        }
        columns1.push(cols);
        break;
    }
    let column = columns1[0];
    debugger
    //let mapPolylineValues = [];
    var table = $(tableId).DataTable({
        ordering: false,
        //targets: [1,2,3,4],
        data: datatable,
        searching: true,
        destroy: true,
        //order: asc,
        //order: [[0, "asc"]],
        //columns: columns1[0],
        "columnDefs": [{
            "targets": [7],
            "visible": false,
            "searchable": false
        }], 
        columns : [
            { "data": "Date", "name": "Date", "title": "Date/Time", "autoWidth": true },
            //{ "data": "Time", "name": "Name", "title": "Time", "autoWidth": true },
            { "data": "WindSpeed", "name": "WindSpeed", "title": "Wind Speed(m/s)", "autoWidth": true },
            { "data": "WindDirectionAv", "name": "WindDirectionAv", "title": "Wind Direction(avg)", "autoWidth": true },
            { "data": "AmbientTemperature", "name": "AmbientTemperature", "title": "Ambient Temperature(℃)", "autoWidth": true },
            { "data": "AtmosphericPressure", "name": "AtmosphericPressure", "title": "Atmospheric Pressure(mPa)", "autoWidth": true },
            { "data": "WindDirectionO", "name": "WindDirectionO", "title": "Wind Direction(°)", "autoWidth": true },
            { "data": "WindDirectionDegrees", "name": "WindDirectionDegrees", "title": "Wind Direction Degrees(°)", "autoWidth": true },
            { "data": "Experiment_id", "name": "Experiment_id", "title": "Experiment ID", "autoWidth": true },
            //{
            //    "render": function (data, type, full, meta) { return '<a class="btn btn-info" href="#">Edit</a>'; }
            //},
            //{
            //    data: null,
            //    render: function (data, type, row) {
            //        return "<a href='#' class='btn btn-danger' >Delete</a>";
            //    }
            //}
            ],  
        dom: 'lBfrtip', //Bfrtip
        //getTableButtons this function implemented in main.js file
        // this function use for adding all colvin options and its properties
        buttons: getTableButtons(title, true)
    });
    //debugger
    jsonData = null;
    var datachartPoints = [];
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let colIdx = 0; let colAsc = 0;
        $.each(this.data(), function (key, value) {
            // convert the date string to a Date object >= replace this with your own comparison date
            if (new Date(value) >= new Date("2000-01-01")) {
                let convertDateTime = stringToDatestamp(value);
                table.cell(rowIdx, colIdx).data(convertDateTime);
                datachartPoints.push({ "label": convertDateTime.split(' ')[2], "y": null });
                colAsc = colIdx;
            }
            colIdx++;
        });

        if ((table.rows().count() - 1) == rowIdx) {
            var column = table.columns();
            var currentOrder = column.order()[colAsc];
            // Toggle sorting order between ascending and descending
            column.order(currentOrder === 'asc' ? 'desc' : 'asc').draw();
            if (datachartPoints.length > 0) {
                TestResultCanvasJS_Chart(datachartPoints);
            }
        }
    });
    debugger;
    debugger;
    setDatatableColumnSearch(title, table, 'Mandrekas', colVisibility = false);
    graph();
    // added file display time in (mili sec)
    setTimeout(function () {
        //datatable_addexcelname_area(filename)
        $('.experimentresults_data_area').show();
        $('.experiment_graph').show();

    }, 250);
    $('.experimentresultsevaluation_table').show();

    // line chart funcion
    TestResultCanvasJS_Chart(table.rows().data());

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
function ReadTimestamp(str) {
    return stringToDatestamp(str).split(' ')[2];

}
function stringToDatestamp(str) {
    //debugger;
    let date = new Date(str);

    let dd = date.getDate();
    let mo = date.getMonth() + 1;

    let customDate = (dd < 10 ? '0' + dd : dd) + "/" + (mo < 10 ? '0' + mo : mo) + "/" + date.getFullYear();

    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    let ms = date.getMilliseconds();

    return customDate + "  " + (hh < 10 ? '0' + hh : hh) + ":" + (mm < 10 ? '0' + mm : mm) + ":" + (ss < 10 ? '0' + ss : ss) + ":" + (ms < 10 ? '0' + ms : ms);

}
