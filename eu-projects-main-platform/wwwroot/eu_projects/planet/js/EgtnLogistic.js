var transportSpreadSheet;
var transportSpreadSheet1;

function loadEgtnLogisticMenu() {
    let HTML = ''
    var menuCode = 'EGTNL';
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadMenu",
        data: { menuName:  menuCode},
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    DisplayLogisticMenu(menuCode);
}

function DisplayLogisticMenu(code) {
    var userId = $('#user_id').val();

    var allMenus = RetrieveUserMenus(userId);
    var menus = allMenus.filter(m => m.ParentMenuId === 0);
    var groupedMenus = GetMenuItems(allMenus).filter(m => m.menu_code.includes(code));

    var html = '';

    for (var i = 0; i < groupedMenus[0].subMenu.length; i++) {
        html += '<li onclick="' + groupedMenus[0].subMenu[i].click_event + '(); updateActiveMenu(\'Main Menu\', \'' + groupedMenus[0].MenuCode + '\',\'' + groupedMenus[0].subMenu[i].menu_code + '\')" >'
        html += '<div >'
        html += '<i class="' + groupedMenus[0].subMenu[i].menu_icon + ' mainMenuIcon" style="font-size:55px"></i> <p ><b>' + groupedMenus[0].subMenu[i].menu_name+ '</b></p>'
        html += '</div>'
        html += '</li>'
    }

    $('#egtn_logistic_grid_card').empty().append(html);
}


//network
function loadEgtnNetwork() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'EGTN-Netowrk' },
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    setGridViewDropdown('EGTN-network')
    getNetworkDatatable();
    AddWeatherStationsInfo();

    DisplayTransportModeSchedule();
}

function DisplayTransportModeSchedule() {
    
    var files = [
        {
            name: 'Train services schedules',
            id: 'schedule'
        },
        {
            name: 'Train services',
            id: 'schedule_1'
        }];

    var html = '';
    html += '<div class="alert alert-dark" id="schedule_notice" role="alert">';
    html += '</div>';
    html += '<div class="accordion" id="trainSchedulesAccordion>';

    for (var i = 0; i < files.length; i++) {
        html += ' <div class="accordion-item" >';
        html += '<h3 class="accordion-header" id="flush-headingOne' + files[i].id + '">';
        html +=
            '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne' + files[i].id + '" aria-expanded="false" aria-controls="flush-collapseOne' + files[i].id + '">';
        html += files[i].name;
        html += '</button>';
        html += '</h3>';
        html +=
            '<div id="flush-collapseOne' + files[i].id + '" class="accordion-collapse collapse" aria-labelledby="flush-headingOne' + files[i].id + '" data-bs-parent="#trainSchedulesAccordion">';
        html +=
            '<div class="accordion-body" id="f_' + files[i].id + '"><br/><table id="schedule_table_' + files[i].id + '"></table ></div>';
        html += '</div>';
    }
    html += '</div>';

    $('#tab4').empty().append(html);

    var schedulesData = LoadTransportSchedulesData();

    $('#schedule_notice').empty().append(schedulesData.Notice);

    for (var j = 0; j < files.length; j++) {
        var data;
        var id = "schedule_table_" + files[j].id;
        var title = files[j].name;
        var isDetailed = true;
        if (j === 0) {
            data = schedulesData.Schedule2;
            isDetailed = false;
        } else {
            data = schedulesData.Schedule1;
            isDetailed = true;
        }
        GenerateTransportScheduleDatable(id, title, data, isDetailed);
    }
}

function GenerateTransportScheduleDatable(id, title,data, isDetailed) {
    let tableId = '#' + id;

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    var cols = [
        { "name": 'Origin station', "title": 'Origin station', "data": "Origin station" },
        { "name": 'Destination station ', "title": 'Destination station ', "data": "Destination station " },
        /*{ "name": 'Distance', "title": 'Distance', "data": "Distance " }*/
        { "name": 'Departure per day', "title": 'Departure per day', "data": "Departure per day" },
        { "name": 'Departure per week', "title": 'Departure per week', "data": "Departure per week" },
        { "name": 'Transit time', "title": 'Transit time', "data": "Transit time" }
    ];

    if (isDetailed) {
        cols.push({ "name": 'Distance', "title": 'Distance', "data": "Distance " });
    }

    //datatable initialization
    var table = $(tableId).DataTable({
        data: data,
        'searching': true,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title, true)
    });

    setDatatableColumnSearch(title, table, 'EGTN-node')
}

function LoadTransportSchedulesData() {
    var data = [];
    var file = 'transportSchedulesData.json';

    var fileName = 'Other\\' + file;
    $.ajax({
        async: false,
        type: "POST",
        data: { fileName: fileName },
        url: "/Planet/getJsonFile",
        success: function (resp) {
            data = JSON.parse(resp);
            //handleTableCreation(data);
        }, error: function (resp) {
            console.error(resp)
        }
    });

    return data;

}

function AddWeatherStationsInfo() {
    var stations = RetrieveWeatherStations();

    var html = '';
    html += '<div class="col-md-2 col-sm-12">';
    html += '<label for= "ucdescription" > Select Weather Stations</label >';
    html += '</div >';
    html += '<div class="col-md-9 col-sm-10">';
    html += '<select id="weatherStation_id" data-placeholder="Choose a weather station..." multiple onchange="OnWeatherStationChange()">';
    html += '<option value="none"></option>'
    for (var i = 0; i < stations.length; i++) {
        html += '<option value="' + stations[i].id + '">' + stations[i].rdfs_label+'</option>'
    }
    html += '</select>';
    html += '</div>';

    $('#weather_station_chooser_block').empty().append(html);
    $('#weatherStation_id').chosen({ search_contains: true, max_selected_options: 3 });
    $("#weatherStation_id").bind("chosen:maxselected", function() {
        ShowErrorMessage("Sorry! Cannot select more than 3 weather stations at a time");
    });
    $('.EgtnNetowrkTablearea').hide();
}

function OnWeatherStationChange() {
    debugger;
    var weatherId = $('#weatherStation_id').val();

    if (weatherId === 'none' || weatherId === null || weatherId.length === 0) {
        $('.EgtnNetowrkTablearea').hide();
    } else {
        var tables = ['Precipitation', 'Minimum Temperature', 'Maximum Temperature', 'Average Temperature'];
        $('#weather_data_left_block').empty();
        $('#weather_data_right_block').empty();

        var weatherStationData = RetrieveWeatherStationDetails(weatherId);

        for (var i = 0; i < tables.length; i++) {
            var htmlBlock = '';
            htmlBlock += '<div class="tablemain col-12 card" style="margin-top:5%">'
            htmlBlock += '<div class="row">'
            htmlBlock += '<div class="col-4">'
            htmlBlock += '<div class="headtabletitle">' + tables[i] + '</div>'
            htmlBlock += ' </div>'
            htmlBlock += '</div>'


            htmlBlock += '<div class="row">'
            htmlBlock += '<div class="col-sm-12">'
            htmlBlock += '<hr style="width:100%;text-align:center;margin-left:0">'
            htmlBlock += '</div>'
            htmlBlock += '</div>'

            htmlBlock += '<div class="col-sm-12 table_class">'
            htmlBlock += '<div class="' + i + 'table">'
            htmlBlock += '<div id="graph_'+i+'" style="height:18rem"></div>'
            htmlBlock += '</div>'
            htmlBlock += '</div>'
            htmlBlock += '</div>';

            if (i % 2 === 0) {
                $('#weather_data_left_block').append(htmlBlock);
            } else {
                $('#weather_data_right_block').append(htmlBlock);
            }

            var chart = {};
            
            if (tables[i] === 'Precipitation') {
                var allNamedData = [];

                for (var j = 0; j < weatherStationData.length; j++) {
                    var stationName = weatherStationData[j].rdfs_label;

                    var precipitationData = ExtractWeatherDataPerHostType('/precipitation', weatherStationData[j]);
                    var NamedData = {
                        name: stationName,
                        values: precipitationData
                    };

                    allNamedData.push(NamedData);
                }
                chart = new CanvasJS.Chart('graph_' + i, GetWeatherStationHostGraphConfig(allNamedData));
            }

            if (tables[i] === 'Minimum Temperature') {
                var allNamedData = [];

                for (var j = 0; j < weatherStationData.length; j++) {
                    var stationName = weatherStationData[j].rdfs_label;

                    var precipitationData = ExtractWeatherDataPerHostType('/temperature/minimum', weatherStationData[j]);
                    var NamedData = {
                        name: stationName,
                        values: precipitationData
                    };

                    allNamedData.push(NamedData);
                }

                chart = new CanvasJS.Chart('graph_' + i, GetWeatherStationHostGraphConfig(allNamedData));
            }

            if (tables[i] === 'Maximum Temperature') {
                var allNamedData = [];

                for (var j = 0; j < weatherStationData.length; j++) {
                    var stationName = weatherStationData[j].rdfs_label;

                    var precipitationData = ExtractWeatherDataPerHostType('/temperature/maximum', weatherStationData[j]);
                    var NamedData = {
                        name: stationName,
                        values: precipitationData
                    };

                    allNamedData.push(NamedData);
                }

                chart = new CanvasJS.Chart('graph_' + i, GetWeatherStationHostGraphConfig(allNamedData));
            }

            if (tables[i] === 'Average Temperature') {
                var allNamedData = [];

                for (var j = 0; j < weatherStationData.length; j++) {
                    var stationName = weatherStationData[j].rdfs_label;

                    var precipitationData = ExtractWeatherDataPerHostType('/temperature/average', weatherStationData[j]);
                    var NamedData = {
                        name: stationName,
                        values: precipitationData
                    };

                    allNamedData.push(NamedData);
                }

                chart = new CanvasJS.Chart('graph_' + i, GetWeatherStationHostGraphConfig(allNamedData));
            }

            chart.render();
        }

        $('.EgtnNetowrkTablearea').show();
    }
}

function GetWeatherStationHostGraphConfig(data) {
    var stationDataPoints = [];

    for (var i = 0; i < data.length; i++) {

        var dp = {
            name: data[i].name,
            type: "spline",
            showInLegend: true,
            dataPoints: data[i].values
        };

        stationDataPoints.push(dp);
    }

    var config = {
        animationEnabled: true,
        axisX: {
            valueFormatString: "DD-MM-YY hh:mm tt"
        },
        axisY: {
            title: "Value"
        },
        legend: {
            cursor: "pointer",
            fontSize: 16,
            //itemclick: toggleDataSeries
        },
        toolTip: {
            shared: true
        },
        data: stationDataPoints
    }

    return config;
}

function ExtractWeatherDataPerHostType(type, weatherStationData) {
    debugger;
    var newData = [];
    for (var i = 0; i < weatherStationData.hosts.length; i++) {
        if (weatherStationData.hosts[i].id.includes(type)) {
            for (var k = 0; k < weatherStationData.hosts[i].observations.length; k++) {
                newData.push({
                    x: new Date(weatherStationData.hosts[i].observations[k].timestamp),
                    y: weatherStationData.hosts[i].observations[k].value
                });
            }
        }
    }
    
    return newData;
}

function RetrieveWeatherStations() {

    var data = [];
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveWeatherStations",
        success: function (resp) {
            if (resp.code === 200) {
                data = resp.data.data.weatherStation
            } else data = [];
        }, error: function (resp) {
            //console.error(resp)
        }
    });
    return data;
}

function RetrieveWeatherStationDetails(ids) {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        data: {ids:ids},
        url: "/Planet/RetrieveWeatherStationDataPerId",
        success: function (resp) {
            if (resp.code === 200) {
                data = resp.data
            } else {
                ShowErrorMessage("Oups! Something went wrong!");
            }
        }, error: function (resp) {
            //console.error(resp)
        }
    });
    return data;
}

function getNetworkDatatable() {

    let data = [];

    for (let i = 0; i < 8; i++) {
        data.push(
            {
                "routeA3": (19 + i) + " Jan",
                "temprature": (18 + i) + "C",
                "humidity": 50.3209 + ((i) / 0.5),
                "precipitation": 5.28,
                "airPressure": 86.74,
                "wind": "30/ WE",
                "visibility": 4 + i,
            }
        )
    }
    generateNetworkDatatable(data);
}

function generateNetworkDatatable(resp) {
    //debugger
    let title = 'EGTN-netowrk-Table'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.EgtnNetowrkTablearea').show();
    else
        $('.EgtnNetowrkTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        //sort:false,
        columns: [
            {
                "name": 'Route A3',
                "title": 'Route A3',
                "data": "routeA3"
            },
            {
                "name": 'Temprature',
                "title": 'Temprature',
                "data": "temprature"
            },
            {
                "name": 'Humidity',
                "title": 'Humidity',
                "data": "humidity"
            },
            {
                "name": 'Precipitation',
                "title": 'Precipitation',
                "data": "precipitation"
            },
            {
                "name": 'Air Pressure',
                "title": 'Air Pressure',
                "data": "airPressure"
            },
            {
                "name": 'Wind speed/Direction',
                "title": 'Wind speed/Direction',
                "data": "wind"
            },
            {
                "name": 'Visibility',
                "title": 'Visibility',
                "data": "visibility"
            }
        ],
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });

    setDatatableColumnSearch(title, table, 'EGTN-network')
    loadEGTNL_node();
}

function getNetworkDropdownData() {

    let data = [];

    for (let i = 1; i < 5; i++) {
        data.push(
            {
                "RouteID": i,
                "RouteName": "Route " + i,
            }
        )
    }
    dropdownGeneratorOfNetwork(data);
}

function dropdownGeneratorOfNetwork(resp) {
    let HTML = '';
    HTML += '<div class="col-2">'
    HTML += '   <label for= "Routes" > Select area/ route:</label >'
    HTML += '</div>'
    HTML += '<div class="col-8 dropdownarea">'
    //HTML += '   <select name="Routes" id="RouteID" class="Routes" onchange="getNetworkTrafficRouteData()">'
    HTML += '   <select name="Routes" id="RouteID" class="Routes">'
    HTML += '       <option selected value="">Select an Option</option>'
    for (var i = 0; i < resp.length; i++) {
        HTML += '   <option value="' + resp[i].RouteID + ' ">' + resp[i].RouteName + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'
    //HTML += '<div class="col-2"> <label class="main-btn" onClick="getNetworkTrafficRouteData()"> Track now </label> </div>'
    $('.networkRoutesDropdown').empty().append(HTML);
    $('#RouteID').chosen({ search_contains: true })
    $('#RouteID').chosen().on("change", function (evt, params) {
        getNetworkTrafficRouteData(params.selected);
    })

}

function getNetworkTrafficRouteData(routeId) {

    //request the data from API/service
    let data = [];

    for (let i = 0; i < 3; i++) {
        data.push(
            {
                "date": (15 + i) + "/4/2021",
                "congestion": i % 2 == 0 ? "Expected delay" : "No",
                "roadWorks": i % 2 == 0 ? "Yes" : "No",
                "divertedTraffic": 7
            }
        )
    }
    generateNetworkTrafficDatatable(data);

}

function generateNetworkTrafficDatatable(resp) {
    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.TrafficTablearea').show();
    else
        $('.TrafficTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable('#TrafficTable') == true) {
        $('#TrafficTable').DataTable().destroy();
        $('#TrackingTable').empty();
    }

    //datatable initialization
    var table = $('#TrafficTable').DataTable({
        data: resp,
        columns: [
            { "name": 'Date', "title": 'Date', "data": "date" },
            { "name": 'Congestion', "title": 'Congestion', "data": "congestion" },
            { "name": 'Road Works', "title": 'Road Works', "data": "roadWorks" },
            { "name": 'Diverted traffic', "title": 'Diverted traffic', "data": "divertedTraffic" }
        ],
    });

    var url = 'https://www.bing.com/maps/traffic?toWww=1&redig=6469F54450A64E55B9A258C91CB699A8';
    $('#iframe_link').remove();
    var html = '';
    html += '<a role="button" id="iframe_link" class="btn btn-success" href="' + url +'" target="_blank">View Detailed Tracking</a>'

    $('.networkRoutesDropdown').append(html);

}



// network > node
function loadEGTNL_node() {
    let docs = 'EGTNLNode.json';

    let fileName = 'EGTNL-network-node\\' + docs;
    $.ajax({
        async: false,
        type: "POST",
        data: { fileName: fileName },
        url: "/Planet/getJsonFile",
        success: function (resp) {
            let data = JSON.parse(resp);
            handleTableCreation(data);
        }, error: function (resp) {
            console.error(resp)
        }
    });



}

async function handleTableCreation(dataObj) {
    for (const [key, value] of Object.entries(dataObj)) {
        let tableId = key;
        let data = value;
        await loadTableAsync(data, tableId)
    }
}

function loadTableAsync(data, tableId) {

    return new Promise(resolve => {
        if (tableId.includes(".")) {
            tableId = tableId.split('.')[0];
        }

        //remove white spaces
        tableId = tableId.replace(/ +/g, "");
        let tableAreaClass = `.${tableId}Tablearea`;
        let tableContainerId = `#${tableId}Table`;

        if (data.length > 0)
            $(tableAreaClass).show();
        else
            $(tableAreaClass).hide();

        if ($.fn.DataTable.fnIsDataTable(tableContainerId) == true) {
            $(tableContainerId).DataTable().destroy();
            $(tableContainerId).empty();
        }

        let title = tableId
        let col = getTableColFromObj(data);

        //datatable initialization
        var table = $(tableContainerId).DataTable({
            data: data,
            columns: col,
            dom: 'lBfrtip',
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            buttons: getTableButtons(title,false)
        });

        if (tableId === 'AEM1-CCU-037') {
            var html = '';
            html += '<select id="AEM_columns_drp" data-placeholder="Select Table Columns..." multiple class="chosen-select">'
            for (var i = 0; i < col.length; i++) {
                html += '<option value="' + col[i].name + '">' + col[i].name +'</option>'
            }
            html += '</select>'

            $('#AEM_column_chooser_block').empty().append(html);
            $('#AEM_columns_drp').chosen({ search_contains: true });
            $('.top-drp').chosen({ search_contains: true });
        }

        if (tableId === 'BCNActivity') {
            var html = '';
            html += '<select id="BCN_columns_drp" data-placeholder="Select Table Columns..." multiple class="chosen-select">'
            for (var i = 0; i < col.length; i++) {
                html += '<option value="' + col[i].name + '">' + col[i].name + '</option>'
            }
            html += '</select>'

            $('#BCN_column_chooser_block').empty().append(html);
            $('#BCN_columns_drp').chosen({ search_contains: true });
            $('.top-drp').chosen({ search_contains: true });
        }

        setDatatableColumnSearch(tableContainerId, table,'EGTN-network', true, false);
        resolve(true);

    });
}

function FilterAEM_Table() {
    var selectedColumns = $('#AEM_columns_drp').val();
    var table = $('#AEM1-CCU-037Table').DataTable();
    var size = parseInt($('#aem_top_value').val());

    var dateColumns = [
        "Berth LTA(LTB)", "Berth LTD", "Berth ATA(ATB)", "Berth ATD", "Proforma Port Stay", "Actual Port Stay"
    ];

    var allCols = table.columns()[0];

    var orderingInfos = [];

    for (var l = 0; l < allCols.length; l++) {

        var colName = table.column(l).dataSrc();
        //console.log(colName);

        for (var m = 0; m < selectedColumns.length; m++) {

            if (dateColumns.includes(selectedColumns[m]) && selectedColumns[m] === colName ) {

                var or = [];
                or.push(l);
                or.push('asc');
                orderingInfos.push(or);
            }

            if (selectedColumns[m] === colName && !dateColumns.includes(selectedColumns[m])) {
                var or = [];
                or.push(l);
                or.push('desc');
                orderingInfos.push(or);
            }
        }
    }
    table.order(orderingInfos).draw();

    table.page.len(size).draw();
}

function FilterBCN_Table() {
    var selectedColumns = $('#BCN_columns_drp').val();
    var table = $('#BCNActivityTable').DataTable();
    var size = parseInt($('#bcn_top_value').val());

    var dateColumns = [
        "Estimated Berth Arrival"
    ];

    var allCols = table.columns()[0];

    var orderingInfos = [];

    for (var l = 0; l < allCols.length; l++) {

        var colName = table.column(l).dataSrc();
        //console.log(colName);

        for (var m = 0; m < selectedColumns.length; m++) {
            if (dateColumns.includes(selectedColumns[m]) && selectedColumns[m] === colName) {

                var or = [];
                or.push(l);
                or.push('asc');
                orderingInfos.push(or);
            }

            if (selectedColumns[m] === colName && !dateColumns.includes(selectedColumns[m])) {
                var or = [];
                or.push(l);
                or.push('desc');
                orderingInfos.push(or);
            }
        }
    }
    table.order(orderingInfos).draw();

    table.page.len(size).draw();
}

function loadEGTNL_nodeOld() {

    let docs = [
        'AEM1-CCU-037-NEW.xlsx',
        'AEM1 proforma schedule.xlsx',
        'BCN Activity-NEW.xlsx',
        'Depots.XLS',
        'MAD Activity.xlsx',
        'Port terminals.XLS'
    ]
    docsObj = {};

    for (let i = 0; i < docs.length; i++) {
        let fileName = 'EGTNL-network-node\\' + docs[i];
        $.ajax({
            async: false,
            type: "POST",
            data: { fileName: fileName },
            url: "/Planet/getExcelFileObject",
            success: function (resp) {
                let data = JSON.parse(resp);
                data = roundNumbersInObj(data);
                handleTableCreation(data, docs[i]);
            }, error: function (resp) {
                console.error(resp)
            }
        });
    }
}

function handleTableCreationOld(data, tableId) {

    //docObj[tableId.split('.')[0]] = data;


    //if (Object.keys(docObj).length == 6) {
    //    var fileContent = JSON.stringify(docObj);
    //    var bb = new Blob([fileContent], { type: 'text/plain' });
    //    var a = document.createElement('a');
    //    a.download = 'download.json';
    //    a.href = window.URL.createObjectURL(bb);
    //    a.click();
    //    return
    //}
    //else {
    //    return
    //}
    if (tableId.includes(".")) {
        tableId = tableId.split('.')[0];
    }
    //remove white spaces
    tableId = tableId.replace(/ +/g, "");
    let tableAreaClass = `.${tableId}Tablearea`;
    let tableContainerId = `#${tableId}Table`;

    //making the datatable area visible if we have data to show
    if (data.length > 0)
        $(tableAreaClass).show();
    else
        $(tableAreaClass).hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableContainerId) == true) {
        $(tableContainerId).DataTable().destroy();
        $(tableContainerId).empty();
    }

    let title = tableId
    let col = getTableColFromObj(data)
    //datatable initialization
    var table = $(tableContainerId).DataTable({
        data: data,
        columns: col,
        dom: 'lBfrtip',
        buttons: getTableButtons(title, false)
    });

    setDatatableColumnSearch(tableContainerId, table, 'EGTN-network', true, false);
}