var vanTypes = [
    { id: 0, name: 'Electric' },
    { id: 1, name: 'Hybrid' },
    { id: 3, name: 'Contractor' },
    { id: 2, name: 'Large Hybrid' }
];

//#region physical internet
function loadDssLastMile(query = false) {

    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'DSS:Last mile' },
        success: function (resp) {

            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    $('#dss_date_selector').chosen({ search_contains: true });
    setGridViewDropdown('DSS:Last')
    getPIDatatable();

}

function LoadDssLastMileData() {
    var data = [];
    var file = 'dsslastmiledata.json';

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

function getPIDatatable() {

    //let query1 = $('#query1').val();
    //let query2 = $('#query2').val();
    //let query3 = $('#query3').val();
    //if (query1 == "") {
    //    getPIDatatable1();
    //}
    //else {
    //    getPIDatatable1(true);
    //}

    var data = LoadDssLastMileData();
    var dateSelected;
    if ($('#dss_date_selector').val() === "0") {
        dateSelected = new Date(2021, 8, 17);
        getPIDatatable1(data, 0);
    }
    else if ($('#dss_date_selector').val() === "1") {
        dateSelected = new Date(2021, 7, 15);
        getPIDatatable1(data, 1);
    }

    
    //RefreshDssLastMileMap(data, dateSelected);
    getPIDatatable2();
}

function getPIDatatablePerDate(date) {
    
    var date1 = new Date(2022, 7, 17).toString();
    var date2 = new Date(2022, 6, 15).toString();

    debugger;
    if (date1 === date) {
        $('#dss_date_selector').val("0");
        //DisplaySelectedMileDateInfos();
    }
    else if (date2 === date) {
        $('#dss_date_selector').val("1"); //Set Dropdown value
        //DisplaySelectedMileDateInfos();
    }

    $("#dss_date_selector").trigger("chosen:updated");
    getPIDatatable();
    
}

function RefreshDssLastMileMap(data) {

    //var dssMileData = data;

    //for (var i = 0; i < dssMileData.length; i++) {
    //    var point = {
    //        'type': 'Feature',
    //        'geometry': {
    //            'type': 'Point',
    //            'coordinates': [
    //                parseFloat(dssMileData[i].Longitude),
    //                parseFloat(dssMileData[i].Latitude)
    //            ]
    //        },
    //        'properties': {
    //            'id': String(new Date().getTime()) + i.toString()
    //        }
    //    };
    //    points.push(point);
    //}

    //map.removeLayer('measure-lines');
    //map.removeLayer('measure-points');

    //map.addSource('geojson', {
    //    'type': 'geojson',
    //    'data': geojson
    //});

    //map.addLayer({
    //    id: 'measure-lines',
    //    type: 'line',
    //    source: 'geojson',
    //    layout: {
    //        'line-cap': 'round',
    //        'line-join': 'round'
    //    },
    //    paint: {
    //        'line-color': '#e6462e',
    //        'line-width': 6
    //    },
    //    filter: ['in', '$type', 'LineString']
    //});

    //map.addLayer({
    //    id: 'measure-points',
    //    type: 'circle',
    //    source: 'geojson',
    //    dragable: true,
    //    paint: {
    //        'circle-radius': 2,
    //        'circle-color': '#3a3a3a',
    //        'circle-stroke-width': 2,
    //        'circle-stroke-color': '#FFF'
    //    },
    //    filter: ['in', '$type', 'Point']
    //});

    //updateView();
}


function getPIDatatable1(data, index) {
    //if (change) {
    //    for (let i = 0; i < 5; i++) {
    //        data.push(
    //            {
    //                "originWarehouse": "Calle de los Tapiceros, 1, 28830 Torrejón de Ardoz, Madrid",
    //                "activity": "classic",
    //                "typeOfService": "delivery",
    //                "taskID": 1606 + (i * 12),
    //                "dateFecha": "16/07/2021",
    //                "route": "E27"
    //            }
    //        )
    //    }
    //}
    //else {
    //    for (let i = 0; i < 38; i++) {
    //        data.push(
    //            {
    //                "originWarehouse": "Calle de los Tapiceros, 1, 28830 Torrejón de Ardoz, Madrid",
    //                "activity": "classic",
    //                "typeOfService": "delivery",
    //                "taskID": 1606 + (i * 12),
    //                "dateFecha": "16/07/2021",
    //                "route": "E27"
    //            }
    //        )
    //    }
    //}

    if (index === 0) {
        generatePIDatatable1(data.LastMile1);
        RefreshDssLastMileMap(data.LastMile1);
    }
    else {
        generatePIDatatable1(data.LastMile2);
        RefreshDssLastMileMap(data.LastMile2);
    }

}

function DisplaySelectedMileDateInfos() {
    var selectedDateIndex = parseInt($('#dss_date_selector').val());
    var data = LoadDssLastMileData();
    var newData = [];

    if (selectedDateIndex === 0) {
        generatePIDatatable1(data.LastMile1)
        newData = data.LastMile1;
    }
    else if (selectedDateIndex === 1) {
        generatePIDatatable1(data.LastMile2);
        newData = data.LastMile2;
    }

    map.removeLayer('measure-lines');
    map.removeLayer('measure-points');
    map.removeSource('geojson');

    points = [];

    var dssMileData = newData;

    for (var i = 0; i < dssMileData.length; i++) {
        var point = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    parseFloat(dssMileData[i].Longitude),
                    parseFloat(dssMileData[i].Latitude)
                ]
            },
            'properties': {
                'id': String(new Date().getTime()) + i.toString()
            }
        };
        points.push(point);
    }

    map.addSource('geojson', {
        'type': 'geojson',
        'data': geojson
    });

    map.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'geojson',
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': '#e6462e',
            'line-width': 6
        },
        filter: ['in', '$type', 'LineString']
    });

    map.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'geojson',
        dragable: true,
        paint: {
            'circle-radius': 2,
            'circle-color': '#3a3a3a',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFF'
        },
        filter: ['in', '$type', 'Point']
    });

    updateView();
}

function generatePIDatatable1(data) {


    //making the datatable area visible if we have data to show
    //if (resp.length > 0)
    //    $('.PITable1area').show();
    //else
    //    $('.PITable1area').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)

    let title = 'DSS_lastmile_t1'
    let tableId = '#' + title;

    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    var cols = [];
    var wantedColumns = ['Task ID', 'Origin Warehouse', 'Latitude', 'Longitude', 'label_route', 'ETA2'];

    for (const key in data[0]) {
        if (data[0].hasOwnProperty(key) && wantedColumns.includes(key)) {

            cols.push({
                name: key,
                title: key,
                data: key
            });
        }
    }

    //datatable initialization
    var table = $(tableId).DataTable({
        data: data,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title,false)
    });

    setDatatableColumnSearch(title, table, 'DSS:Last', true , false);
}


function getPIDatatable2() {

    let data = [];

    for (let i = 1; i < 2; i++) {
        data.push(
            {
                "KPI": "Route " + i,
                "Baseline": "4 days",
                "leadTime": "-12%",
            }
        )
    }

    //TODO: find the min cost kpi to make it bold font in the table
    //data = data.map(obj => ({ ...obj, min: false }))
    //let min = Math.min(...data.map(item => item.cost));
    //for (let i = 0; i < data.length; i++) {
    //    if (data[i].cost === min) {
    //        data[i].min = true;
    //        break;
    //    }
    //}

    generatePIDatatable2(data);
}

function generatePIDatatable2(resp) {

    let title = 'DSS_lastmile_t2'
    let tableId = '#' + title;

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: [
            { "name": 'KPI', "title": 'KPI 1', "data": "KPI" },
            { "name": 'Baseline', "title": 'Baseline', "data": "Baseline" },
            { "name": 'Lead time', "title": 'Delivery Lead Time Inland Transport', "data": "leadTime" }
            //{ "name": 'Serv. Level', "title": 'Serv. Level', "data": "servLevel" },
        ],
        dom: 'lBfrtip',
        buttons: getTableButtons(title,false)
    });
    setDatatableColumnSearch(title, table, 'DSS:Last',true,false);
}

//#endregion

//#region forcast
function loadResources(tab = 1) {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'Resources' },
        success: function (resp) {

            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    setGridViewDropdown('Forecasts')
    getForecastResourcesDropdownData();
    getPalletDropdownData();
    getContainerDropdownData();

    DisplayTabContent();

    if (tab == 2) {
        $('#PalletFlow-tab').click();
        //document.getElementById('pallet-tab').click();
    }
    else if (tab == 3) {
        $('#ContainerFlowPort-tab').click();
    }
}

function DisplayTabContent() {

    var userId = $('#user_id').val();
    var code = 'forecast'
    var allMenus = RetrieveUserMenus(userId);
    var groupedMenus = GetMenuItems(allMenus).filter(m => m.menu_code.includes(code));
    var tabHeader = '';

    for (var i = 0; i < groupedMenus[0].subMenu.length; i++) {
        var j = i + 1;
        if (i === 0) {
            tabHeader += '<li class="nav-item" role="presentation">';
            tabHeader +=
                ' <button class="nav-link active" id="' + groupedMenus[0].subMenu[i].menu_code+ '-tab" data-bs-toggle="tab" data-bs-target="#tab' + j + '" type="button" role="tab" aria-controls="tab' + j + '" aria-selected="true" onclick="updateActiveMenu(\'' + groupedMenus[0].menu_name + '\', \'' + groupedMenus[0].menu_name + '\',\'' + groupedMenus[0].subMenu[i].menu_code + '\')"> ' + groupedMenus[0].subMenu[i].menu_name+'</button >';
            tabHeader += '</li>';
            
        } else {
            if (groupedMenus[0].subMenu[i].menu_code !== 'EGTNI-Transport') {
                tabHeader += '<li class="nav-item" role="presentation">';
                tabHeader += ' <button class="nav-link" id="' + groupedMenus[0].subMenu[i].menu_code + '-tab" data-bs-toggle="tab" data-bs-target="#tab' + j + '" type="button" role="tab" aria-controls="tab' + j + '" aria-selected="true" onclick="updateActiveMenu(\'' + groupedMenus[0].menu_name + '\', \'' + groupedMenus[0].menu_name + '\',\'' + groupedMenus[0].subMenu[i].menu_code + '\')"> ' + groupedMenus[0].subMenu[i].menu_name + '</button >';
                tabHeader += '</li>';
            }
        }
        
    }
    $('#forecastTab').empty().append(tabHeader);
    
}

function getForecastResourcesDropdownData() {

    let periodData = [];
    let warehouseData = [];
    var seaportData = [];

    var units = ['Container', 'Pallet'];

    let types = ['Human', 'Equipment'];

    var pallet = RetrieveMongoDatabaseCollections('pallet');
    var container = RetrieveMongoDatabaseCollections('container');

    periodData.push({
        container: {
            period: container
        },
        pallet: {
            period: pallet
        }
    });

    for (let i = 1; i <= 3; i++) {
        //periodData.push(
        //    {
        //        "periodID": i,
        //        "Name": "Period " + i,
        //    }
        //)

        warehouseData.push(
            {
                "warehouseID": i,
                "Name": "Warehouse " + i,
            }
        );

        seaportData.push(
            {
                "seaportID": i,
                "Name": "Seaport " + i,
            }
        );
    }

    let data = {
        periodData: periodData,
        warehouseData: warehouseData,
        seaportData: seaportData,
        types: types,
        units: units
    }

    dropdownGeneratorOfForecastResources(data);

    generateRouteOptKPIDatatable();
}

function dropdownGeneratorOfForecastResources(resp) {
    let HTML = '';

    //dropdown 1
    HTML += '<div class="col-1 self-align-col">'
    HTML += '   <label for= "Types" > Category:</label >'
    HTML += '</div>'
    HTML += '<div class="col-2 dropdownarea">'
    HTML += '   <select name="Types" id="types" onchange="OnFlowTypeChange()">'
    //HTML += '       <option selected value="0">Select an Option</option>'
    for (var i = 0; i < resp.types.length; i++) {
        HTML += '   <option value="' + resp.types[i] + '">' + resp.types[i] + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'

    HTML += '<div class="col-1 self-align-col">'
    HTML += '   <label for= "Types"> Unit:</label >'
    HTML += '</div>'
    HTML += '<div class="col-2 dropdownarea">'
    HTML += '   <select name="Types" id="units">'
    HTML += '       <option selected value="0">Select an Option</option>'
    for (var i = 0; i < resp.units.length; i++) {
        HTML += '   <option value="' + resp.units[i] + '">' + resp.units[i] + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'

    //dropdown 2
    HTML += '<div class="col-1 self-align-col">'
    HTML += '   <label for= "Period" > Period:</label >'
    HTML += '</div>'
    HTML += '<div class="col-2 dropdownarea" id="unit_period_area">'
    HTML += '   <select name="Period" id="periodID">'
    HTML += '       <option selected value="0">Select an Option</option>'
    HTML += '   </select>'
    HTML += '</div>'

    //dropdown 3
    HTML += '<div class="col-1 self-align-col">'
    HTML += '   <label for= "Warehouse" id="resource_sub_unit_type"> Warehouse:</label >'
    HTML += '</div>'
    HTML += '<div class="col-2 dropdownarea" id="warehouse_block_selector">'
    HTML += '   <select name="Warehouse" id="warehouseID">'
    HTML += '       <option selected value="0">Select an Option</option>'
    //for (var i = 0; i < resp.warehouseData.length; i++) {
    //    HTML += '   <option value="' + resp.warehouseData[i].warehouseID + ' ">' + resp.warehouseData[i].Name + '</option>';
    //}
    HTML += '   </select>'
    HTML += '</div>'
    
    HTML += '<div class="row" style="width:100%"><div class="accordion" id="accordionFlushExample" style="width:100%;">';
    HTML += ' <div class="accordion-item" style="margin:8px">';
    HTML += '<h3 class="accordion-header" id="flush-headingOne">';
    HTML +=
        '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">';
    HTML += 'Capacity Rates per day';
    HTML += '</button>';
    HTML += '</h3>';
    HTML +=
        '<div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">';
    HTML += '<div class="accordion-body" id="forecast_rates" style="padding:1%">Select a unit first'
    HTML += '</div>';
    HTML += '</div>';
    HTML += '</div><div>';

    HTML += '<div class="col-md-12 col-12 scnariobuttons main-buttons-with-icons scenariobuttons" style="margin-top: 1%; text-align: right">';
    HTML += '<div class="col-12"> <label class="main-btn" onClick="getForecastResourcesRouteData()"> Submit </label> </div>'
    HTML += '</div>'

    $('.networkRoutesDropdown').empty().append(HTML);
    $('#types').chosen({ search_contains: true });
    $('#units').chosen({ search_contains: true });
    $('#periodID').chosen({ search_contains: true });
    $('#warehouseID').chosen({ search_contains: true });


    $('#units').chosen().on("change", function (evt, params) {
        var unitId = $('#units').val();
        var HTML = '';

        var html1 = '';
        if (unitId.trim() === 'Container') {
            HTML += '   <select name="Period" class="f_container" id="periodID">'
            HTML += '       <option selected value="0">Select an Option</option>'
            for (var i = 0; i < resp.periodData[0].container.period.length; i++) {
                if (resp.periodData[0].container.period[i] !== 'container_train') {
                    HTML += '   <option value="' + resp.periodData[0].container.period[i] + ' ">' + resp.periodData[0].container.period[i] + '</option>';
                }
            }
            HTML += '   </select>';

            html1 = '';
            html1 += '   <select name="Warehouse" id="warehouseID">'
            html1 += '       <option selected value="0">Select an Option</option>'
            for (var i = 0; i < resp.seaportData.length; i++) {
                html1 += '   <option value="' + resp.seaportData[i].seaportID + ' ">' + resp.seaportData[i].Name + '</option>';
            }
            html1 += '</select>'
            //$('#warehouseID').empty().append(html1);
            $('#resource_sub_unit_type').empty().append('Seaports:');

            GetContainerRates();
        }
        else {
            HTML += '   <select name="Period" id="periodID" class="f_pallet">'
            HTML += '       <option selected value="0">Select an Option</option>'
            for (var i = 0; i < resp.periodData[0].pallet.period.length; i++) {
                if (resp.periodData[0].pallet.period[i] !== 'pallet_train') {
                    HTML += '   <option value="' + resp.periodData[0].pallet.period[i] + ' ">' + resp.periodData[0].pallet.period[i] + '</option>';

                }
            }
            HTML += '   </select>'

            html1 = '';
            html1 += '   <select name="Warehouse" id="warehouseID">'
            html1 += '       <option selected value="0">Select an Option</option>'
            for (var i = 0; i < resp.warehouseData.length; i++) {
                html1 += '   <option value="' + resp.warehouseData[i].warehouseID + ' ">' + resp.warehouseData[i].Name + '</option>';
            }
            html1 += '</select>'
            
            $('#resource_sub_unit_type').empty().append('Warehouse:');

            GetPalletRates();
        }
        
        $('#unit_period_area').empty().append(HTML);
        $('#warehouse_block_selector').empty().append(html1);

        $('#periodID').chosen({ search_contains: true });
        $('#warehouseID').chosen({ search_contains: true });
    })
}

function OnFlowTypeChange() {
    $('#units').val(0);
    $('#periodID').val(0);
    $('#warehouseID').val(0);

    $("#units").trigger("chosen:updated");
    $("#periodID").trigger("chosen:updated");
    $("#warehouseID").trigger("chosen:updated");

    $('#forecast_rates').empty().append('Select a unit first');
}

function GetContainerRates() {

    var type = $('#types').val();

    var html = '';

    if (type.trim() === 'Equipement') {
        html += '<div class="row">';

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Crane:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="c_crane" type="number" value="80">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Truck:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="c_truck" type="number" value="100">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Forklift:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="c_forklift" type="number" value="150">';
        html += '</div>'

        html += '</div>'
    }
    else {
        html += '<div class="row">';

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Crane:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="c_crane" type="number" value="80">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Truck:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="c_truck" type="number" value="100">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Forklift:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="c_forklift" type="number" value="150">';
        html += '</div>'

        html += '</div>'
    }
    
    $('#forecast_rates').empty().append(html);
}

function GetPalletRates() {

    var type = $('#types').val();

    var html = '';

    if (type.trim() !== 'Equipment') {
        html += '<div class="row">';

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Order Picker:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="p_order_picker" type="number" value="20">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label>Pallet Truck Drivers:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="p_truck_driver" type="number" value="50">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Forklift Drivers:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="p_forklift_driver" type="number" value="40">';
        html += '</div>'

        html += '</div>'
    }
    else {
        html += '<div class="row">';

        html += '<div class="col-1 self-align-col">'
        html += '   <label> AGVs:</label >'
        html += '</div>'
        html += '<div class="col-3 dropdownarea">'
        html += '<input class="form-control" id="p_avg" type="number" value="80">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label>Pallet Trucks:</label >'
        html += '</div>'
        html += '<div class="col-2 dropdownarea">'
        html += '<input class="form-control" id="p_truck" type="number" value="100">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Pallet Wrappers:</label >'
        html += '</div>'
        html += '<div class="col-2 dropdownarea">'
        html += '<input class="form-control" id="p_wrapper" type="number" value="150">';
        html += '</div>'

        html += '<div class="col-1 self-align-col">'
        html += '   <label> Forklifts:</label >'
        html += '</div>'
        html += '<div class="col-2 dropdownarea">'
        html += '<input class="form-control" id="p_forklift" type="number" value="150">';
        html += '</div>'

        html += '</div>'
    }

    $('#forecast_rates').empty().append(html);
}

function getForecastResourcesRouteData() {

    var type = $('#types').val();
    var unit = $('#units').val();
    var periodID = $('#periodID').val().trim();
    var warehouseID = $('#warehouseID').find(":selected").text();

    //request the data from API/service
    let data = [];

    if (type == 0 || unit == 0 || periodID == 0 || warehouseID == 'Select an Option') {
        ShowErrorMessage('Please select the needed options')
        return
    }
    var database = unit.toLowerCase();
    var forecastData = RetrieveMongoCollectionData(database, periodID);
    var finalData = [];

    if (type == 'Equipment') {

        if (unit.trim() === 'Container') {
            var crane = parseInt($('#c_crane').val());
            var truck = parseInt($('#c_truck').val());
            var forklift = parseInt($('#c_forklift').val());

            for (var i = 0; i < forecastData.length; i++) {
                finalData.push(
                    {
                        Date: new Date(forecastData[i].date).toDateString(),
                        Crane: Math.floor(forecastData[i].forecasted_value_mean / crane),
                        Truck: Math.floor(forecastData[i].forecasted_value_mean / truck),
                        Forklift: Math.floor(forecastData[i].forecasted_value_mean / forklift),
                        Containers_To_Handle: Math.round(forecastData[i].forecasted_value_mean)
                    });
            }
        }
        else {
            var agv = parseInt($('#p_avg').val());
            var p_trucks = parseInt($('#p_truck').val());
            var p_wrappers = parseInt($('#p_wrapper').val());
            var p_forklifts = parseInt($('#p_forklift').val());
            var p_reachTrucks = parseInt($('#p_avg').val());

            for (var i = 0; i < forecastData.length; i++) {
                finalData.push(
                    {
                        Date: new Date(forecastData[i].time).toDateString(),
                        AGVs: Math.floor(forecastData[i].forecasted_value_mean / agv),
                        Pallet_Trucks: Math.floor(forecastData[i].forecasted_value_mean / p_trucks),
                        Pallet_Wrappers: Math.floor(forecastData[i].forecasted_value_mean / p_wrappers),
                        Forklifts: Math.floor(forecastData[i].forecasted_value_mean / p_forklifts),
                        Reach_Trucks: 0,
                        Pallets_To_Pick: Math.round(forecastData[i].forecasted_value_mean)
                    });
            }
        }
    }
    else {
        if (unit.trim() === 'Container') {

            var crane_op = parseInt($('#c_crane').val());
            var truck_op = parseInt($('#c_truck').val());
            var forklift_op = parseInt($('#c_forklift').val());

            for (var i = 0; i < forecastData.length; i++) {
                finalData.push(
                    {
                        Date: new Date(forecastData[i].date).toDateString(),
                        Crane_Operators: Math.floor(forecastData[i].forecasted_value_mean / crane_op),
                        Truck_Operators: Math.floor(forecastData[i].forecasted_value_mean / truck_op),
                        Forklift_Operators: Math.floor(forecastData[i].forecasted_value_mean / forklift_op),
                        Containers_To_Handle: Math.round(forecastData[i].forecasted_value_mean)
                    });
            }
        }
        else {
            for (var i = 0; i < forecastData.length; i++) {
                var order_picker = parseInt($('#p_order_picker').val());
                var truck_driver = parseInt($('#p_truck_driver').val());
                var forklift_driver = parseInt($('#p_forklift_driver').val());

                finalData.push(
                    {
                        Date: new Date(forecastData[i].time).toDateString(),
                        Order_Picker: Math.floor(forecastData[i].forecasted_value_mean / order_picker),
                        Pallet_Truck_Drivers: Math.floor(forecastData[i].forecasted_value_mean / truck_driver),
                        Forklift_Drivers: Math.floor(forecastData[i].forecasted_value_mean / forklift_driver),
                        Orders_To_Pick: Math.round(forecastData[i].forecasted_value_mean)
                    });
            }
        }
    }

    generateWarehouseDatatable(finalData);

    GenerateResourceGraph(finalData);
    //let graphs = data.map(x => ({
    //    name: 'd-' + x.date.replaceAll('/', '-'),
    //    displayName: x.date,
    //    size: '6',
    //    data: getObjectValuesAsArray(x, ['date'])
    //}))
    //generateDynamicGrapghAreas(graphs)
    //let arrayGraphs = graphs.map(x => ((x['name']) + 'GraphArea'))
    //ClearGraphsAreaAndGenerateNewArea(arrayGraphs);

    //for (let i = 0; i < graphs.length; i++) {
    //    generatePieChart(graphs[i]['data'], graphs[i]['name'] + 'GraphArea');
    //}


    //$('.Charts').show();

}

function GenerateResourceGraph(data) {
    var html = '';
    html += '<div id="chartContainer" style="width:100%; height:40rem"></div>';
    $('#ContainerGraph').empty().append(html);

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        axisX: {
            valueFormatString: "DD MMM YYYY hh:mm",
            titleFontSize: 13,
            labelFontSize: 13,
            title: 'Time'
        },
        axisY: {
            title: "Predictions",
            titleFontSize: 10,
            labelFontSize: 10
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "right",
            dockInsidePlotArea: true,
            fontSize: 12
        },
        data: GetResourcesColumnsTimeSeriesVariation(data)
    });
    chart.render();

    
}

function GetResourcesColumnsTimeSeriesVariation(data) {
    var lineConfigs = [];
    var cols = [];

    cols = ExtractColumnsFromMongoDocuments(data);
    cols = cols.filter(c => c.name.toLowerCase() !== 'date');
    cols = cols.filter(c => c.name.toLowerCase() !== 'Orders_To_Pick'.toLocaleLowerCase());

    for (var i = 0; i < cols.length; i++) {
        lineConfigs.push({
            type: "spline",
            name: cols[i].name,
            showInLegend: true,
            markerSize: 0,
            dataPoints: GetForecastResourceTimeSeriesPerCol(cols[i].name, data)
        });
    }
    return lineConfigs;
}

function GetForecastResourceTimeSeriesPerCol(col, values) {
    var data = [];

    for (var i = 0; i < values.length; i++) {
        data.push({
            x: new Date(values[i].Date),
            y: values[i][col]
        });
    }

    return data;
}

function generateDynamicGrapghAreas(chartsList, handle = true) {

    let HTML = ''
    for (let i = 0; i < chartsList.length; i++) {
        HTML += `<div class="col-xl-${chartsList[i].size} chart-main-container" id="${chartsList[i].name}Grid">`;
        HTML += `   <div class="col-xl-12 stretch-card grid-margin Charts" style="display:none">`;
        HTML += `       <div class="card">`;
        HTML += `           <div class="card-body">`;
        HTML += `               <div class="row">`;
        handle ? HTML += `                   <span class="handle2" ><i class="fa-solid fa-arrows-up-down-left-right"></i></span>` : '';
        HTML += `                   <label style="text-align:center;"> ${chartsList[i].displayName}</label>`;
        HTML += `                    <div class="${chartsList[i].name}GraphArea col-12">`;
        HTML += `                    </div>`;
        HTML += `               </div>`;
        HTML += `           </div>`;
        HTML += `       </div>`;
        HTML += `   </div>`;
        HTML += `</div>`;
    }
    $('#ContainerGraph').empty().append(HTML);

}

function generateWarehouseDatatable(resp) {
    let title = 'Forecasts-Resources-Table'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.Forecasts_ResourcesTablearea').show();
    else
        $('.Forecasts_ResourcesTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    var cols = getTableColFromObj(resp);

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        //sort: false,
        //columns: [
        //    { "name": 'Date', "title": 'Date', "data": "date" },
        //    { "name": 'AGVs', "title": 'AGVs', "data": "AGVs" },
        //    { "name": 'Pallet Trucks', "title": 'Pallet Trucks', "data": "Pallet Trucks" },
        //    { "name": 'Pallet wrappers', "title": 'Pallet wrappers', "data": "Pallet wrappers" },
        //    { "name": 'Forklifts', "title": 'Forklifts', "data": "Forklifts" },
        //    { "name": 'ReachTrucks', "title": 'ReachTrucks', "data": "ReachTrucks" },
        //    { "name": 'Ordes to pick', "title": 'Ordes to pick', "data": "Ordes to pick" },

        //],
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    setDatatableColumnSearch(title, table, 'Forecasts');

    //id="${ chartsList[i].name } Grid"
    $('#WarehouseTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('.chart-main-container').show()
        }
        else {
            $('.chart-main-container').hide()
            $('#d-' + (table.row(this).data().date).replaceAll('/', '-') + 'Grid').show();
            $('tr.selected').removeClass('selected')
            $(this).addClass('selected');
        }
    });
}

function getContainerDropdownData() {
    var periodData = [];
    var containerCollections = RetrieveMongoDatabaseCollections('container');

    for (var j = 0; j < containerCollections.length; j++) {
        if (containerCollections[j] !== 'container_train') {

            periodData.push(
                {
                    "periodID": containerCollections[j],
                    "Name": "Period " + containerCollections[j]
                });
        }
    }
    
    dropdownGeneratorOfContainer(periodData);
}

function getPalletDropdownData() {

    let periodData = [];
    let warehouseData = [];
    let distirbutionCenterData = [];

    var palletPeriods = [];
    var palletCollections = RetrieveMongoDatabaseCollections('pallet');

    for (var j = 0; j < palletCollections.length; j++) {
        if (palletCollections[j] !== 'pallet_train') {
            palletPeriods.push(palletCollections[j]);

            periodData.push(
                {
                    "periodID": palletCollections[j],
                    "Name": "Period " + palletCollections[j]
                });
        }
    }


    for (let i = 1; i <= 3; i++) {
        //periodData.push(
        //    {
        //        "periodID": i,
        //        "Name": "Period " + i,
        //    }
        //)

        warehouseData.push(
            {
                "warehouseID": i,
                "Name": "Warehouse " + i,
            }
        )

        distirbutionCenterData.push(
            {
                "centerID": i,
                "Name": "Center  " + i,
            }
        )
    }

    let data = {
        periodData: periodData,
        warehouseData: warehouseData,
        distirbutionCenterData: distirbutionCenterData
    }

    dropdownGeneratorOfPallet(data);
}

function dropdownGeneratorOfPallet(resp) {
    let HTML = '';

    //dropdown 1
    HTML += '<div class="col-1">'
    HTML += '   <label for= "Period" > Period:</label >'
    HTML += '</div>'
    HTML += '<div class="col-5 dropdownarea">'
    HTML += '   <select name="Period" id="PperiodID">'
    HTML += '       <option selected value="">Select an Option</option>'
    for (var i = 0; i < resp.periodData.length; i++) {
        HTML += '   <option value="' + resp.periodData[i].periodID + '">' + resp.periodData[i].Name + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'



    HTML += '<div class="col-3"> <label class="main-btn" onClick="getPalletNewRouteData()"> Calculate </label> </div>'

    $('.palletDropdown').empty().append(HTML);

    $('#PperiodID').chosen({ search_contains: true })

}

function dropdownGeneratorOfContainer(resp) {
    let HTML = '';

    //dropdown 1
    HTML += '<div class="col-1">'
    HTML += '   <label for= "Period" > Period:</label >'
    HTML += '</div>'
    HTML += '<div class="col-5 dropdownarea">'
    HTML += '   <select name="Period" id="CperiodID">'
    HTML += '       <option selected value="">Select an Option</option>'
    for (var i = 0; i < resp.length; i++) {
        HTML += '   <option value="' + resp[i].periodID + '">' + resp[i].Name + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'



    HTML += '<div class="col-3"> <label class="main-btn" onClick="getContainerNewRouteData()"> Calculate </label> </div>'

    $('.containerDropdown').empty().append(HTML);

    $('#CperiodID').chosen({ search_contains: true })

}

function getPalletRouteData(id = 0) {

    //request the data from API/service
    let data = [];
    

    for (let i = 0; i < 3; i++) {
        data.push(
            {
                "day": (15 + i) + "/4/2021",
                "palletsIn": (7 + i),
                "palletsOut": (3 + i)
            }
        )
    }

    //data = RetrieveMongoCollectionData('pallet', id)

    generatePalletDatatable(data);
}

function generatePalletDatatable(resp) {
    let title = 'Forecasts-Pallet-Table'
    let tableId = '#' + title;
    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.PalletTablearea').show();
    else
        $('.PalletTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: [
            { "name": 'day', "title": 'day', "data": "day" },
            { "name": 'Pallets in', "title": 'Pallets in', "data": "palletsIn" },
            { "name": 'Pallets out', "title": 'Pallets out', "data": "palletsOut" },

        ],
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    setDatatableColumnSearch(title, table, 'Forecasts')
}





function getPalletNewRouteData(id = 0) {

    //request the data from API/service
    let data = [];

    var periodID = $('#PperiodID').val();
    if (periodID == 'Select an Option') {
        ShowErrorMessage('Please select the needed options')
        return
    }

    data = RetrieveMongoCollectionData('pallet', periodID.trim());
    generatePalletNewDatatable(data);

    AddPalletGraphDisplay(data);
    //let fileName = "forecasts\\bank_holiday_forecast.xlsx"
    //$.ajax({
    //    async: false,
    //    type: "POST",
    //    data: { fileName: fileName },
    //    url: "/Planet/getExcelFileObject",
    //    success: function (resp) {
    //        resp = JSON.parse(resp);

    //        resp = roundNumbersInObj(resp, 4);
    //        generatePalletNewDatatable(resp);

    //    }, error: function (resp) {
    //        console.error(resp)
    //    }
    //});

}

function getContainerNewRouteData() {
    let data = [];

    var periodID = $('#CperiodID').val();
    if (periodID == 'Select an Option') {
        ShowErrorMessage('Please select the needed options')
        return
    }

    data = RetrieveMongoCollectionData('container', periodID.trim());
    generateContainerNewDatatable(data);
    AddContainerGraphDisplay(data);
}

function AddPalletGraphDisplay(MongoData) {
    var html = '';
    html += '<div id="pallet_Graph" style="height:35rem;"></div>';
    $('#pallet_Graph_block').empty().append(html);
    $('.Pallet-graph').show();

    var chart = new CanvasJS.Chart("pallet_Graph", {
        title: {
            text: "Parameters Time Series Variation",
            fontFamily: 'arial',
            fontSize: 20
        },
        animationEnabled: true,
        zoomEnabled: true,
        axisX: {
            valueFormatString: "DD-MM-YY hh:mm tt"
        },
        axisY: {
            title: "Pallets"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            fontSize: 14
        },
        data: GetPalletColumnsTimeSeriesVariation(MongoData)
    });

    chart.render();
}

function AddContainerGraphDisplay(MongoData) {
    var html = '';
    html += '<div id="container_Graph" style="height:35rem;"></div>';
    $('#container_Graph_block').empty().append(html);
    $('.Container-graph').show();

    var chart = new CanvasJS.Chart("container_Graph", {
        title: {
            text: "Parameters Time Series Variation",
            fontFamily: 'arial',
            fontSize: 20
        },
        animationEnabled: true,
        zoomEnabled: true,
        axisX: {
            valueFormatString: "DD-MM-YY hh:mm tt",
            fontSize: 11
        },
        axisY: {
            title: "Containers"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            fontSize: 12
        },
        data: GetContainerColumnsTimeSeriesVariation(MongoData)
    });

    chart.render();
}

function GetPalletColumnsTimeSeriesVariation(data) {
    var lineConfigs = [];
    var cols = [];

    cols = ExtractColumnsFromMongoDocuments(data);
    cols = cols.filter(c => c.name !== 'time');

    for (var i = 0; i < cols.length; i++) {
        lineConfigs.push({
            type: "line",
            name: cols[i].name,
            showInLegend: true,
            markerSize: 0,
            dataPoints: GetPalletTimeSeriesPerCol(cols[i].name, data)
        });
    }
    return lineConfigs;
}

function GetContainerColumnsTimeSeriesVariation(data) {
    var lineConfigs = [];
    var cols = [];

    cols = ExtractColumnsFromMongoDocuments(data);
    cols = cols.filter(c => c.name !== 'date');

    for (var i = 0; i < cols.length; i++) {
        lineConfigs.push({
            type: "line",
            name: cols[i].name,
            showInLegend: true,
            markerSize: 0,
            dataPoints: GetContainerTimeSeriesPerCol(cols[i].name, data)
        });
    }
    return lineConfigs;
}

function GetContainertColumnsTimeSeriesVariation(data) {
    var lineConfigs = [];
    var cols = [];

    cols = ExtractColumnsFromMongoDocuments(data);
    cols = cols.filter(c => c.name !== 'date');

    for (var i = 0; i < cols.length; i++) {
        lineConfigs.push({
            type: "line",
            name: cols[i].name,
            showInLegend: true,
            markerSize: 0,
            dataPoints: GetContainerTimeSeriesPerCol(cols[i].name, data)
        });
    }
    return lineConfigs;
}

function GetPalletTimeSeriesPerCol(col, values) {
    var data = [];
    debugger;
    for (var i = 0; i < values.length; i++) {
        if (col === 'forecasted_value_mean') {
            data.push({
                x: new Date(values[i].time),
                y: values[i].forecasted_value_mean
            });
        }

        if (col === 'lower_bound') {
            data.push({
                x: new Date(values[i].time),
                y: values[i].lower_bound
            });
        }

        if (col === 'upper_bound') {
            data.push({
                x: new Date(values[i].time),
                y: values[i].upper_bound
            });
        }

        if (col === 'std') {
            data.push({
                x: new Date(values[i].time),
                y: values[i].std
            });
        }

        if (col === 'actual_value') {
            data.push({
                x: new Date(values[i].time),
                y: values[i].actual_value
            });
        }
    }

    return data;
}

function GetContainerTimeSeriesPerCol(col, values) {
    var data = [];
    debugger;
    for (var i = 0; i < values.length; i++) {
        if (col === 'forecasted_value_mean') {
            data.push({
                x: new Date(values[i].date),
                y: values[i].forecasted_value_mean
            });
        }

        if (col === 'lower_bound') {
            data.push({
                x: new Date(values[i].date),
                y: values[i].lower_bound
            });
        }

        if (col === 'upper_bound') {
            data.push({
                x: new Date(values[i].date),
                y: values[i].upper_bound
            });
        }

        if (col === 'std') {
            data.push({
                x: new Date(values[i].date),
                y: values[i].std
            });
        }

        if (col === 'actual_value') {
            data.push({
                x: new Date(values[i].date),
                y: values[i].actual_value
            });
        }
    }

    return data;
}

function generatePalletNewDatatable(resp) {
    let title = 'Forecasts-Pallet-Table'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.PalletTablearea').show();
    else
        $('.PalletTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    /*let col = getTableColFromObj(resp)*/

    var cols = ExtractColumnsFromMongoDocuments(resp);

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    setDatatableColumnSearch(title, table, 'Forecasts')

}

function generateContainerNewDatatable(resp) {
    let title = 'Forecasts-Container-Table'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.ContainerTablearea').show();
    else
        $('.ContainerTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    /*let col = getTableColFromObj(resp)*/

    var cols = ExtractColumnsFromMongoDocuments(resp);

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    setDatatableColumnSearch(title, table, 'Forecasts')

}

function ExtractColumnsFromMongoDocuments(resp) {
    var cols = [];

    var properties = Object.keys(resp[0]);
    for (var i = 0; i < properties.length; i++) {
        if (properties[i] !== '_id') {
            cols.push(
                {
                    "name": properties[i], "title": properties[i], "data": properties[i]
                });
        }
    }

    return cols;
}

//#endregion

//#region other


function generateSimulationDropdown() {

    let PI = [20, 50, 100]
    let HTML = '';
    HTML += '<div class="col-2">'
    HTML += '   <label for= "Containers" > Physical Internet:</label >'
    HTML += '</div>'
    HTML += '<div class="col-2 dropdownarea">'
    HTML += '   <select name="Containers" id="PI-S" class="Containers" onchange="RetrieveTrackTrace(1)">'
    //HTML += '       <option selected value="">Select an Option</option>'
    HTML += '       <option selected value="0">0</option>'
    //for (var i = 0; i < resp.length; i++) {
    for (var i = 0; i < PI.length; i++) {
        HTML += '   <option value="' + PI[i] + '">' + PI[i] + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'

    HTML += '<div class="col-5">'
    HTML += '   <label for= "Containers" style="padding:0 15px"> AI:</label >'
    HTML += '<label class="switch" >'
    HTML += '   <input type="checkbox" id="AI-T" style="padding-right:20px">'
    HTML += '       <span class="slider round"></span>'
    HTML += '</label>'

    HTML += '   <label for= "Containers" style="padding:0 15px"> IoT:</label >'
    HTML += '<label class="switch" >'
    HTML += '   <input type="checkbox" id="IoT-T" style="padding-right:20px">'
    HTML += '       <span class="slider round"></span>'
    HTML += '</label>'


    HTML += '   <label for= "Containers" style="padding:0 15px"> BC:</label >'
    HTML += '<label class="switch" >'
    HTML += '   <input type="checkbox" id="BC-T" style="padding-right:20px">'
    HTML += '       <span class="slider round"></span>'
    HTML += '</label>'

    HTML += '</div>'


    HTML += '<div class="col-2"> <label class="main-btn" style="display: block; text-align: center;" onClick="calculateSimulation()"> Calculate </label> </div>'
    HTML += '<div class="col-1" id="simu-clear-btn" style="display:none"> <label class="main-btn" onClick="clearSimulationFilter()">  Clear </label> </div>'


    //HTML +='<div class="col-2"> <label class="main-btn" onClick="RetrieveTrackTrace()"> Track now </label> </div>'
    $('.SimulationDropdown').empty().append(HTML);
    $('#PI-S').chosen({ search_contains: true });

}

simulationData = [];

function clearSimulationFilter() {
    $('.simu-chart').hide();
    $('#simu-clear-btn').hide()


    $('#SimulationTable').dataTable().fnClearTable();
    $('#SimulationTable').dataTable().fnAddData(simulationData);
}


function calculateSimulation() {
    $('.simu-chart').hide();

    let AI = $('#AI-T').is(":checked") ? 1 : 0;
    let IOT = $('#IoT-T').is(":checked") ? 1 : 0;
    let BC = $('#BC-T').is(":checked") ? 1 : 0;
    let PI = +$('#PI-S').val();


    let index = simulationData.findIndex(x => x['PI (Physical Internet)'] == PI && x['AI (Artificial Intelligence)'] == AI &&
        x['IoT (Internet of Things)'] == IOT && x['BC (Blockchain)'] == BC)


    if (index > -1) {
        let dataObj = simulationData[index];
        debugger;

        let values = [
            {
                name: 'PI (Physical Internet)',
                value: dataObj['PI (Physical Internet)']
            },
            {
                name: 'AI (Artificial Intelligence)',
                value: dataObj['AI (Artificial Intelligence)']
            },
            {
                name: 'IoT (Internet of Things)',
                value: dataObj['IoT (Internet of Things)']
            },
            {
                name: 'BC (Blockchain)',
                value: dataObj['BC (Blockchain)']
            },

            {
                name: 'Delivered Containers',
                value: dataObj['Delivered Containers']
            },
            {
                name: 'Delivered Containers (On Time)',
                value: dataObj['Delivered Containers (On Time)']
            },
            {
                name: '% Containers Delivered On Time',
                value: dataObj['% Containers Delivered On Time']
            },
            {
                name: 'Container Average Lead Time (days)',
                value: dataObj['Container Average Lead Time (days)']
            },
            {
                name: 'Rail Distance (km)',
                value: dataObj['Rail Distance (km)']
            },
            {
                name: 'Rail Emissions (t CO2)',
                value: dataObj['Rail Emissions (t CO2)']
            },
            {
                name: 'Rail Modal Split (%)',
                value: dataObj['Rail Modal Split (%)']
            },
            {
                name: 'Rail Capacity Usage (%)',
                value: dataObj['Rail Capacity Usage (%)']
            },
            {
                name: 'Road Distance (km)',
                value: dataObj['Road Distance (km)']
            },
            {
                name: 'Road Emissions (t CO2)',
                value: dataObj['Road Emissions (t CO2)']
            },
            {
                name: 'Road Modal Split (%)',
                value: dataObj['Road Modal Split (%)']
            },
            {
                name: 'Road Activated Trucks',
                value: dataObj['Road Activated Trucks']
            },
            {
                name: 'Total Distance (km x 10e6)',
                value: dataObj['Total Distance (km x 10e6)']
            },
            {
                name: 'Total Emissions (t CO2)',
                value: dataObj['Total Emissions (t CO2)']
            }
        ]

        let HTML = '';
        HTML += '<div class="simu-container">';
        HTML += '<ul style = "width:100%; text-align:center" > ';

        for (let i = 0; i < values.length; i++) {
            HTML += '<li> <div class="bottom">' + values[i].name + '</div> <div class="simu-card-content"> ' + values[i].value + ' </div></li>'
        }
        HTML += '   </ul>';
        HTML += '</div">';


        $('#simu-chart').empty().append(HTML);
        $('.simu-chart').show();

        document.getElementById('simu-chart').scrollIntoView();
        //filter table data also
        $('#SimulationTable').dataTable().fnClearTable();
        $('#SimulationTable').dataTable().fnAddData([dataObj]);

        $('#simu-clear-btn').show()
    }
}

function getSimulationDatatable() {
    generateSimulationDropdown();

    let data = [];

    let fileName = 'other\\params.json';
    $.ajax({
        async: false,
        type: "POST",
        data: { fileName: fileName },
        url: "/Planet/getJsonFile",
        success: function (resp) {
            let data = JSON.parse(resp);

            //remove idSim if exist
            data = data.map(function (item) {
                delete item['idSim'];
                return item;
            });

            data = roundNumbersInObj(data, 2, ['idSim', 'PI (Physical Internet)', 'AI (Artificial Intelligence)', 'IoT (Internet of Things)', 'BC (Blockchain)']);
            simulationData = data;
            generateSimulationDatatable(data);
        }, error: function (resp) {
            console.error(resp)
        }
    });

}

function generateSimulationDatatable(resp) {

    let title = 'Simulation-Table'
    let tableId = '#' + title;
    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.SimulationTablearea').show();
    else
        $('.SimulationTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    let col = getTableColFromObj(resp)

    let btns = getTableButtons(title, false);
    btns = btns.filter(x => x.extend == "colvis" || x.extend == "excel" || x.extend == 'copy')
    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: col,
        dom: 'lBfrtip',
        buttons: btns
    });
    setDatatableColumnSearch(title, table, 'Other', false, false)
}

//#endregion

//#region Track & Trace
function retrieveTrackAndTraceView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/retrieveTrackAndTraceView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    setGridViewDropdown('TrackAndTraceView')
    RetrieveContainerID();
}

function RetrieveContainerID() {
    let data;
    $.ajax({
        type: 'POST',
        url: '/Planet/RetrieveContainerID',
        async: false,
        dataType: 'json',
        success: function (resp) {
            if (resp.message == 'FAIL') {
                swal({
                    title: "Error!",
                    icon: "error",
                    text: "Something went wrong!",
                });
            } else {
                //the response here is success so we get the result and parse it into the data
                data = JSON.parse(resp.result);
                dropdownGeneratorOfContainers(data);
            }

            //data = resp;
            //dropdownGeneratorOfContainers(data);
        }, error: function (resp) {
            console.error(resp)
        }
    });
}

function dropdownGeneratorOfContainers(resp) {

    //var gsins = ["40212345678900001041", "98016541097804605005", "74561396385490565223"];

    var gsinListIds = RetrieveAllIotShipments();

    let HTML = '';
    HTML += '<div class="col-2">'
    HTML += '   <label for= "Containers" style="height:100%; padding-top:5px"> Choose a Shipment GSIN Code:</label >'
    HTML += '</div>'
    HTML += '<div class="col-4 dropdownarea">'
    HTML += '   <select name="Containers" id="ContainerID" class="Containers" onchange="RetrieveTrackTrace(1)">'
    HTML += '       <option selected value="0">Select an Option</option>'
    //for (var i = 0; i < resp.length; i++) {
    for (var i = 0; i < gsinListIds.length; i++) {
        HTML += '   <option value="' + gsinListIds[i].id + '">' + gsinListIds[i].code + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'

    HTML += '<div class="col-2">'
    HTML += '   <label for= "Pallet" style="height:100%; padding-top:5px"> Choose a Logistic Unit SSCC Code:</label >'
    HTML += '</div>'
    HTML += '<div class="col-4 dropdownarea" id="logistic_unit_block">'
    HTML += '   <select name="Containers" id="PalletID" class="Pallet" onchange="RetrieveTrackTrace(2)">'
    HTML += '       <option selected value="0">Select an Option</option>'
    //for (var i = 0; i < resp.length; i++) {
    //console.log(resp);
    //for (var i = 1; i < resp.length; i++) {
    //    HTML += '   <option value="' + resp[i].ContainerID + '">' + resp[i].ContainerID + '</option>';
    //}
    HTML += '   </select>'
    HTML += '</div>'
    HTML += '<br/><div class="d-grid gap-2 d-md-flex justify-content-md-end" style="width:100%; margin-top:10px">';
    HTML +=
        '<button class="btn btn-success me-md-2" type="button" onclick="DisplayTrackHistory()" style="margin-right: 5px; background-color: #3D6D57" > <i class="fas fa-map-marked" style="color:white"></i> View Full History</button >';
    HTML += '</div>';

    var html1 = '';
    html1 += '<div class="col-2">'
    html1 += '   <label for= "Containers" style="height:100%; padding-top:5px"> Choose a GSIN Code:</label >'
    html1 += '</div>'
    html1 += '<div class="col-4 dropdownarea">'
    html1 += '   <select name="Containers" id="ContainerID1" class="Containers" onchange="RetrieveTrack2Trace(1)">'
    html1 += '       <option selected value="0">Select an Option</option>'
    //for (var i = 0; i < resp.length; i++) {
    for (var i = 0; i < 1; i++) {
        html1 += '   <option value="' + resp[i].ContainerID + '">' + resp[i].ContainerID  + '</option>';
    }
    html1 += '   </select>'
    html1 += '</div>'

    html1 += '<div class="col-2">'
    html1 += '   <label for= "Pallet" style="height:100%; padding-top:5px"> Choose a PI Pallet:</label >'
    html1 += '</div>'
    html1 += '<div class="col-4 dropdownarea">'
    html1 += '   <select name="Containers" id="PalletID1" class="Pallet" onchange="RetrieveTrack2Trace(2)">'
    html1 += '       <option selected value="0">Select an Option</option>'
    for (var i = 1; i < resp.length; i++) {
        html1 += '   <option value="' + resp[i].ContainerID + '">' + resp[i].ContainerID + '</option>';
    }
    html1 += '   </select>'
    html1 += '</div>'
    html1 += '<br/><div class="d-grid gap-2 d-md-flex justify-content-md-end" style="width:100%; margin-top:10px">';
    html1 +=
        '<button class="btn btn-success me-md-2" type="button" onclick="DisplayTrack2History()" style="margin-right: 5px; background-color: #3D6D57" > <i class="fas fa-map-marked" style="color:white"></i> View Full History</button >';
    html1 += '</div>';

    //HTML += '<button class="btn btn-success" onclick="DisplayTrackHistory()"> View Full History</button>';

    //HTML +='<div class="col-2"> <label class="main-btn" onClick="RetrieveTrackTrace()"> Track now </label> </div>'
    $('#Track_and_Trace_Region1').empty().append(HTML);
    $('#Track_and_Trace_Region2').empty().append(html1);
    $('#ContainerID').chosen({ search_contains: true });
    $('#PalletID').chosen({ search_contains: true });
    $('#ContainerID1').chosen({ search_contains: true });
    $('#PalletID1').chosen({ search_contains: true });

    $('#ContainerID').chosen().on("change", function (evt, params) {

        var selectedGsin = $('#ContainerID').val();
        if (selectedGsin != 0) {
            var logisticUnits = gsinListIds.filter(e => e.id == selectedGsin)[0].logisticUnits;

            var h = '';

            h += '   <select name="Containers" id="PalletID" class="Pallet" onchange="RetrieveTrackTrace(2)">'
            h += '       <option selected value="">Select an Option</option>'
            for (var i = 0; i < logisticUnits.length; i++) {
                h += '   <option value="' + logisticUnits[i].id + '">' + logisticUnits[i].code + '</option>';
            }
            h += '   </select>'

            $('#logistic_unit_block').empty().append(h);
            $('#PalletID').chosen({ search_contains: true });
        }
    });
}

function RetrieveAllIotShipments() {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveLL1_AllShipments",
        success: function (resp) {
            if (resp.code == 200) {
                data = ExtractShipmentDetails(resp.result);
            }
            else {
                ShowErrorMessage("Oups! Something went wrong... Please try again");
            }
        }, error: function (resp) {
            console.error(resp)
        }
    });

    return data;
}

function ExtractShipmentDetails(res) {
    for (var i = 0; i < res.length; i++) {
        res[i].code = res[i].id.replace('https://id.gs1.org/', '');

        for (var j = 0; j < res[i].logisticUnits.length; j++) {
            res[i].logisticUnits[j].code = res[i].logisticUnits[j].id.replace('https://id.gs1.org/', '');
        }
    }

    return res;
}

function RetrieveKafkaDataPerTopic(type) {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveKafkaTopicObjectsPerType",
        data: { type: type },
        success: function (resp) {
            data = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });

    return data;
}

var selectedGsinInfo;

function RetrieveTrackTrace(dorpdownToFetch) {
    let Id = ''
    if (dorpdownToFetch == 1) {

        //Read from kafka gsin object

        var gsin = $('#ContainerID').val();
        //$('#PalletID').val('').trigger('chosen:updated');

        //var gsinDetails = RetrieveKafkaDataPerTopic('ll1_iot').filter(l => l.gsin === gsin)[0];
        //selectedGsinInfo = {
        //    raw: gsinDetails,
        //    filtered_values: []
        //};

        //GenerateLl1IotTableFromKafkaData(gsinDetails);

        if (gsin != 0) {
            var data = GetGsinDetails(gsin);

            selectedGsinInfo = {
                raw: data,
                filtered_values: []
            };

            GenerateLl1IotTableForGraphQlData(data);

            AddNgsAccordion(gsin.replace('https://id.gs1.org/', ''));//passing the GSIN Code here only

            ReInitializeMapComponent();
        }
        else {
            selectedGsinInfo = {};
            $('.TrackingTablearea').hide();
        }
    }
    else if (dorpdownToFetch == 2) {
        //$('#ContainerID').val('').trigger('chosen:updated');

        //let data;
        //$.ajax({
        //    type: 'POST',
        //    url: '/Planet/RetrieveTrackTrace',
        //    data: { ContainerID: Id },
        //    async: false,
        //    dataType: 'json',
        //    success: function (resp) {
        //        if (resp.message == 'FAIL') {
        //            swal({
        //                title: "Error!",
        //                icon: "error",
        //                text: "Something went wrong!",
        //            });
        //        } else {
        //            //the response here is success so we get the result and parse it into the data
        //            data = JSON.parse(resp.result)
        //            generateDatatable(data);
        //            AddNgsAccordion();
        //        }
        //    }, error: function (resp) {
        //        console.error(resp)
        //    }
        //});

        var sscc = $('#PalletID').val();
        if (sscc != 0) {
            //var allData = selectedGsinInfo.filtered_values;
            //var subUnitData = allData.filter(i => i.SSCC == sscc);

            $($('.searchHeader th.sorting > input')[1]).val(sscc.replace('https://id.gs1.org/', ''));
            $($('.searchHeader th.sorting > input')[1]).trigger("change");
        }
        else {
            $($('.searchHeader th.sorting > input')[1]).val('');
        }

        ReInitializeMapComponent();
    }
}

function GetGsinDetails(selectedGsin) {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveLl1_GsinDetails",
        data: { gsin: selectedGsin },
        success: function (resp) {
            if (resp.code == 200) {
                data = resp.result.data.shipment[0];
            }
        }, error: function (resp) {
            console.error(resp)
        }
    });

    return data;
}


function RetrieveTrack2Trace(drp) {
    if (drp === 1) {
        Id = $('#ContainerID1').val()
        $('#PalletID1').val('').trigger('chosen:updated');
    }
    else {
        Id = $('#PalletID1').val()
        $('#ContainerID1').val('').trigger('chosen:updated');
    }

    let data;
    $.ajax({
        type: 'POST',
        url: '/Planet/RetrieveTrackTrace',
        data: { ContainerID: Id },
        async: false,
        dataType: 'json',
        success: function (resp) {
            if (resp.message == 'FAIL') {
                swal({
                    title: "Error!",
                    icon: "error",
                    text: "Something went wrong!",
                });
            } else {
                //the response here is success so we get the result and parse it into the data
                data = JSON.parse(resp.result)
                generateDatatableRegion2(data);
                AddNgsAccordionRegion2();
            }
        }, error: function (resp) {
            console.error(resp)
        }
    });

    ReInitializeMapComponent();
}

function ReInitializeMapComponent() {
    initMap();
}


function AddNgsAccordion(gsinCode) {
    var url = 'https://trackone.ngs-sensors.it/external?' + gsinCode;
    var html = '';
    html += '<div class="accordion" id="accordionFlushExample">';
    html += ' <div class="accordion-item" >';
    html += '<h3 class="accordion-header" id="flush-headingOne">';
    html +=
        '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">';
    html += 'Detailed Tracking';
    html += '</button>';
    html += '</h3>';
    html +=
        '<div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">';
    html +=
        '<div class="accordion-body" style="height:600px"><iframe src="' + url + '" loading="lazy" style="width:100%; height:100%" frameborder="0"></iframe></div>';
    html += '</div>';
    html += '</div>';

    $('#ngs_iframe_block').empty().append(html);
}

function AddNgsAccordionRegion2() {
    var url = 'https://trackone.ngs-sensors.it/external?40212345678900001041';
    var html = '';
    html += '<div class="accordion" id="accordionFlushExample1">';
    html += ' <div class="accordion-item" >';
    html += '<h3 class="accordion-header" id="flush-headingOne1">';
    html +=
        '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne1" aria-expanded="false" aria-controls="flush-collapseOne1">';
    html += 'Detailed Tracking';
    html += '</button>';
    html += '</h3>';
    html +=
        '<div id="flush-collapseOne1" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample1">';
    html +=
        '<div class="accordion-body" style="height:600px"><iframe src="' + url + '" loading="lazy" style="width:100%; height:100%" frameborder="0"></iframe></div>';
    html += '</div>';
    html += '</div>';

    $('#ngs_iframe_block1').empty().append(html);
}

var map;
var map1;
function generateDatatable(resp) {
    debugger;
    let title = 'Track-Trace-Table'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('#trackingTableare_region1').show();
    else
        $('#trackingTableare_region1').hide();

    //making coordinates from string to array
    for (i = 0; i < resp.length; i++) {
        resp[i].coordinates = JSON.parse(resp[i].coordinates);
    }

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: [
            { "name": 'MACAddress', "title": 'MACAddress', "data": "MACAddress" },
            { "name": 'Timestamp', "title": 'Timestamp', "data": "Timestamp" },
            { "name": 'Latitude', "title": 'Latitude', "data": "coordinates.0" },
            { "name": 'Longitude', "title": 'Longitude', "data": "coordinates.1" },
            { "name": 'Temperature', "title": 'Temperature', "data": "Temperature" },
            { "name": 'Humidity', "title": 'Humidity', "data": "Humidity" },
            //{ "name": 'Accelerometer X', "title": 'Accelerometer X', "data": "AccelerometerX" },
            //{ "name": 'Accelerometer Y', "title": 'Accelerometer Y', "data": "AccelerometerY" },
            //{ "name": 'Accelerometer Z', "title": 'Accelerometer Z', "data": "AccelerometerZ" },
            //{ "name": 'Exceed Threshold', "title": 'Exceed Threshold', "data": "Exceedthreshold" },
            { "name": 'ContainerID', "title": 'ContainerID', "data": "ContainerID" }
        ],
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    //hideColumns(table, ['MACAddress','ContainerID'])

    //$('#TrackingTable').css('font-size', '15px');

    setDatatableColumnSearch(title, table, 'TrackAndTraceView', false);

    $(tableId+ ' tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            //$('.Charts').hide()
            //ClickedOnRowSetSelectedID(tableid, id);
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            //ClearGraphsAreaAndGenerateNewArea(['currentTemperatureGraphArea', 'currentHumidityGraphArea', 'temperaturePerTimeGraphArea', 'humidityPerTimeGraphArea', 'mapGraphArea']);
            var cord = table.row(this).data().coordinates; // array of 2
            var temp = table.row(this).data().Temperature;  //number
            var humd = table.row(this).data().Humidity; //number
            var date = new Date(table.row(this).data().Timestamp);

            var html = '<div class="trackDetail-bottomContainer">';
            html += '<div>';
            html += '<div class="container-date">';
            html += date.toLocaleDateString()
            html += '</div>'
            html += '<div class="container-time">'
            html += date.toLocaleTimeString()
            html += '</div>'
            html += '</div>'
            html += '<div>'
            html += ' <div class="top-bot-info">'
            html += ' <h1 class="main-text">'
            html += temp + ' °C'
            html += '</h1>'

            if (temp >= 20) {
                html += '<span>Sunny</span>'
                html += '</div>'
                html += '<i class="fa-solid fa-sun"></i>'
            }
            else if (temp < 20 && temp >= 10) {
                html += '<span>Partly Sunny</span>'
                html += '</div>'

                html += '<i class="fa-solid fa-cloud-sun-rain" style="font-size:40px; color:grey"></i>'
            } else {
                html += '<span>Raining</span>'
                html += '</div>'

                html += '<i class="fa-solid fa-cloud" style="color:grey"></i>'
            }
            
            


            html += '<div class="top-bot-info">'
            html += '<p>Latitude</p>'
            html += '<span>' + cord[0] +'</span>'
            html += '</div>'
            html += '<div class="top-bot-info">'
            html += '<p>Longitude</p>'
            html += '<span>'+ cord[1] +'</span>'
            html += '</div>'
            html += '<div class="top-bot-info">'
            html += '<p>Humidity</p>'
            html += '<span>'+humd+'</span>'
            html += '</div>'
            html += '</div>'
            html += '</div>';

            $('.trackDetail-bottomContainer-main').empty().append(html);

            //Display google map
            var coordinates = { lat: cord[0], lng: cord[1] };
            map = new google.maps.Map(
                document.getElementById('google_planet_map'),
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

            var marker = new google.maps.Marker({
                position: coordinates,
                map: map
            });

            //generateWoldMapGraph(cord);
            //generateCurrentTemperatureGraph(temp);
            //generateCurrentHumidityGraph(humd);
            //generateTemperatuePerTimeGrap(resp);
            //generateHumidityPerTimeGrap(resp);
            //$('.Charts').show();


            //id = $('#' + tableid + ' .selected .piid').text()
            //ClickedOnRowSetSelectedID(tableid, id);
            //$('#' + subtype + '_selected_piid_value').val(id);
        }
    });

}

function generateDatatableRegion2(resp) {
    let title = 'Track-Trace-Table2'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('#trackingTableare_region2').show();
    else
        $('#trackingTableare_region2').hide();

    //making coordinates from string to array
    for (i = 0; i < resp.length; i++) {
        resp[i].coordinates = JSON.parse(resp[i].coordinates);
    }

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: [
            { "name": 'MACAddress', "title": 'MACAddress', "data": "MACAddress" },
            { "name": 'Timestamp', "title": 'Timestamp', "data": "Timestamp" },
            { "name": 'Latitude', "title": 'Latitude', "data": "coordinates.0" },
            { "name": 'Longitude', "title": 'Longitude', "data": "coordinates.1" },
            { "name": 'Temperature', "title": 'Temperature', "data": "Temperature" },
            { "name": 'Humidity', "title": 'Humidity', "data": "Humidity" },
            //{ "name": 'Accelerometer X', "title": 'Accelerometer X', "data": "AccelerometerX" },
            //{ "name": 'Accelerometer Y', "title": 'Accelerometer Y', "data": "AccelerometerY" },
            //{ "name": 'Accelerometer Z', "title": 'Accelerometer Z', "data": "AccelerometerZ" },
            //{ "name": 'Exceed Threshold', "title": 'Exceed Threshold', "data": "Exceedthreshold" },
            { "name": 'ContainerID', "title": 'ContainerID', "data": "ContainerID" }
        ],
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    //hideColumns(table, ['MACAddress','ContainerID'])

    //$('#TrackingTable').css('font-size', '15px');

    setDatatableColumnSearch(title, table, 'TrackAndTraceView', false);

    $(tableId + ' tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            //$('.Charts').hide()
            //ClickedOnRowSetSelectedID(tableid, id);
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            //ClearGraphsAreaAndGenerateNewArea(['currentTemperatureGraphArea', 'currentHumidityGraphArea', 'temperaturePerTimeGraphArea', 'humidityPerTimeGraphArea', 'mapGraphArea']);
            var cord = table.row(this).data().coordinates; // array of 2
            var temp = table.row(this).data().Temperature;  //number
            var humd = table.row(this).data().Humidity; //number
            var date = new Date(table.row(this).data().Timestamp);

            var html = '<div class="trackDetail-bottomContainer">';
            html += '<div>';
            html += '<div class="container-date">';
            html += date.toLocaleDateString()
            html += '</div>'
            html += '<div class="container-time">'
            html += date.toLocaleTimeString()
            html += '</div>'
            html += '</div>'
            html += '<div>'
            html += ' <div class="top-bot-info">'
            html += ' <h1 class="main-text">'
            html += temp + ' °C'
            html += '</h1>'

            if (temp >= 20) {
                html += '<span>Sunny</span>'
                html += '</div>'
                html += '<i class="fa-solid fa-sun"></i>'
            }
            else if (temp < 20 && temp >= 10) {
                html += '<span>Partly Sunny</span>'
                html += '</div>'

                html += '<i class="fa-solid fa-cloud-sun-rain" style="font-size:40px; color:grey"></i>'
            } else {
                html += '<span>Raining</span>'
                html += '</div>'

                html += '<i class="fa-solid fa-cloud" style="color:grey"></i>'
            }




            html += '<div class="top-bot-info">'
            html += '<p>Latitude</p>'
            html += '<span>' + cord[0] + '</span>'
            html += '</div>'
            html += '<div class="top-bot-info">'
            html += '<p>Longitude</p>'
            html += '<span>' + cord[1] + '</span>'
            html += '</div>'
            html += '<div class="top-bot-info">'
            html += '<p>Humidity</p>'
            html += '<span>' + humd + '</span>'
            html += '</div>'
            html += '</div>'
            html += '</div>';

            $('#trackDetail_region2').empty().append(html);

            //Display google map
            var coordinates = { lat: cord[0], lng: cord[1] };
            map1 = new google.maps.Map(
                document.getElementById('google_planet_map2'),
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

            var marker = new google.maps.Marker({
                position: coordinates,
                map: map1
            });

            //generateWoldMapGraph(cord);
            //generateCurrentTemperatureGraph(temp);
            //generateCurrentHumidityGraph(humd);
            //generateTemperatuePerTimeGrap(resp);
            //generateHumidityPerTimeGrap(resp);
            //$('.Charts').show();


            //id = $('#' + tableid + ' .selected .piid').text()
            //ClickedOnRowSetSelectedID(tableid, id);
            //$('#' + subtype + '_selected_piid_value').val(id);
        }
    });

}

function initMap() {
    debugger
    // The location of Uluru
    const uluru = { lat: 43.8712516, lng: 19.3216951 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("google_planet_map"), {
        zoom: 5,
        center: uluru,
    });

    map1 = new google.maps.Map(document.getElementById("google_planet_map2"), {
        zoom: 5,
        center: uluru,
    });
}

//#endregion

function loadPhysicalServicesMenu() {
    let HTML = ''
    var menuCode = 'physicalInternet';
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadMenu",
        data: { menuName: menuCode },
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    DisplayPhysicalInternetMenu(menuCode);
}

function loadDssOptNode() {
    alert("Not implemented yet!");
}

function loadDssOptRoute() {
    var viewName = "OptRoute";

    var html = '';

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: viewName },
        success: function (resp) {

            html = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(html);

    var shtml = '';
    var items = RetrieveAllDateRoutes();
    shtml += '<option selected value=""></option>'
    for (var i = 0; i < items.length; i++) {
        shtml += '<option value="' + items[i].date + '">' + new Date(items[i].date)+'</option>'
    }

    $('#RouteDate_id').empty().append(shtml);
    $('#optimized_route_block').hide();
    $('#van_Block').hide();
    $('#RouteDate_id').chosen({ search_contains: true });

    generateRouteOptKPIDatatable();
}

function generateRouteOptKPIDatatable() {
    var data = [
        {
            "KPIs": 'KPI 1',
            "Description": 'Transport Cost',
            "Baseline": '$600',
            "Cost": '-28%'
        },
        {
            "KPIs": 'KPI 2',
            "Description": 'Operational Cost',
            "Baseline": '70 Workers',
            "Cost": '-17%'
        },
        {
            "KPIs": 'KPI 3',
            "Description": 'Delivery Time',
            "Baseline": '90 minutes',
            "Cost": ' > 10%'
        }
    ];

    let title = 'RouteOptimizationKPITable';
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (data.length > 0)
        $('.KPIDatatableArea').show();
    else
        $('.KPIDatatableArea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    var cols = getTableColFromObj(data);

    var table = $(tableId).DataTable({
        data: data,
        'searching': true,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });

    setDatatableColumnSearch(title, table, 'DSS Opt Route')
}

function DisplayPhysicalInternetMenu(code) {
    var userId = $('#user_id').val();

    var allMenus = RetrieveUserMenus(userId);
    var menus = allMenus.filter(m => m.ParentMenuId === 0);
    var groupedMenus = GetMenuItems(allMenus).filter(m => m.menu_code.includes(code));

    var html = '';

    for (var i = 0; i < groupedMenus[0].subMenu.length; i++) {
        html += '<li onclick="' + groupedMenus[0].subMenu[i].click_event + '(); updateActiveMenu(\'Main Menu\', \'' + groupedMenus[0].MenuCode + '\',\'' + groupedMenus[0].subMenu[i].menu_code + '\')" >'
        html += '<div >'
        html += '<i class="' + groupedMenus[0].subMenu[i].menu_icon + ' mainMenuIcon" style="font-size:55px"></i> <p ><b>' + groupedMenus[0].subMenu[i].menu_name + '</b></p>'
        html += '</div>'
        html += '</li>'
    }

    $('#pis_grid_card').empty().append(html);
}

function loadForecastsMenu() {
    let HTML = ''
    var menuCode = 'forecast';
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadMenu",
        data: { menuName: menuCode },
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    DisplayForecastMenus(menuCode);
}

function DisplayForecastMenus(code) {
    var userId = $('#user_id').val();

    var allMenus = RetrieveUserMenus(userId);
    var menus = allMenus.filter(m => m.ParentMenuId === 0);
    var groupedMenus = GetMenuItems(allMenus).filter(m => m.menu_code.includes(code));

    var html = '';

    for (var i = 0; i < groupedMenus[0].subMenu.length; i++) {
        html += '<li onclick="' + groupedMenus[0].subMenu[i].click_event + '(); updateActiveMenu(\'Main Menu\', \'' + groupedMenus[0].MenuCode + '\',\'' + groupedMenus[0].subMenu[i].menu_code + '\')" >'
        html += '<div >'
        html += '<i class="' + groupedMenus[0].subMenu[i].menu_icon + ' mainMenuIcon" style="font-size:55px"></i> <p ><b>' + groupedMenus[0].subMenu[i].menu_name + '</b></p>'
        html += '</div>'
        html += '</li>'
    }

    $('#forecasts_grid_card').empty().append(html);
}

function GenerateLl1IotTableForGraphQlData(gsinDetails) {

    let title = 'Track-Trace-Table'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (gsinDetails.logisticUnits.length > 0)
        $('.TrackingTablearea').show();
    else
        $('.TrackingTablearea').hide();

    //making coordinates from string to array
    //for (i = 0; i < values.length; i++) {
    //    resp[i].coordinates = JSON.parse(resp[i].coordinates);
    //}

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    //Preparing cols
    var cols = [
        { "name": 'GSIN', "title": 'GSIN', "data": "GSIN" },
        { "name": 'SSCC', "title": 'SSCC', "data": "SSCC" },
        { "name": 'MACAddress', "title": 'MACAddress', "data": "MACAddress" },
        { "name": 'Timestamp', "title": 'Timestamp', "data": "Timestamp" },
        { "name": 'Latitude', "title": 'Latitude', "data": "Latitude" },
        { "name": 'Longitude', "title": 'Longitude', "data": "Longitude" },
        { "name": 'Temperature', "title": 'Temperature', "data": "Temperature" },
        { "name": 'RelativeHumidity', "title": 'Humidity', "data": "Humidity" },
        { "name": 'Comp-x', "title": 'Accelerometer X', "data": "AccelerometerX" },
        { "name": 'Comp-y', "title": 'Accelerometer Y', "data": "AccelerometerY" },
        { "name": 'Comp-z', "title": 'Accelerometer Z', "data": "AccelerometerZ" },
        { "name": 'Luminance', "title": 'Luminance', "data": "Luminance" },
        { "name": 'Battery', "title": 'Battery', "data": "Battery" },
        { "name": 'UID', "title": 'UID', "data": "UID" }
    ];

    //var randomRecord = values[0].epcisBody.eventList[0].sensorElementList.sensorReport;

    //for (var j = 0; j < cols.length; j++) {
    //    if(cols[j].)
    //}

    var newData = [];
    //Preparing  newData values
    
    var shipment = gsinDetails;
    for (var j = 0; j < shipment.logisticUnits.length; j++) {
        var logisticUnit = shipment.logisticUnits[j];

        for (var k = 0; k < logisticUnit.sensors.length; k++) {
            var sensor = logisticUnit.sensors[k];

            for (var l = 0; l < sensor.hosts[0].observations.length; l++) {

                var newDataItem = {
                    GSIN: shipment.id.replace('https://id.gs1.org/', ''),
                    SSCC: logisticUnit.id.replace('https://id.gs1.org/', ''),
                    MACAddress: sensor.name,
                    Timestamp: sensor.hosts[0].observations[l].time,
                    Latitude: ExtractIotDataPerType('Latitude', sensor.hosts, l),
                    Longitude: ExtractIotDataPerType('Longitude', sensor.hosts, l),
                    Temperature: ExtractIotDataPerType('Temperature', sensor.hosts, l),
                    Humidity: ExtractIotDataPerType('RelativeHumidity', sensor.hosts, l),
                    AccelerometerX: ExtractIotDataPerType('Acceleration/Comp-x', sensor.hosts, l),
                    AccelerometerY: ExtractIotDataPerType('Acceleration/Comp-y', sensor.hosts, l),
                    AccelerometerZ: ExtractIotDataPerType('Acceleration/Comp-z', sensor.hosts, l),
                    Luminance: ExtractIotDataPerType('Luminance', sensor.hosts, l),
                    Battery: ExtractIotDataPerType('Battery', sensor.hosts, l),
                    UID: shipment.id.replace('https://id.gs1.org/', '') + '-' + logisticUnit.id.replace('https://id.gs1.org/', '') + '-' + sensor.name + '-' + sensor.hosts[0].observations[l].timestamp,
                }

                newData.push(newDataItem);
            }


        }

    }

    selectedGsinInfo.filtered_values = newData;
    

    //for (var i = 0; i < values.length; i++) {

    //    var geoString = values[i].epcisBody.eventList[0].readPoint.id.replace('geo:', '');
    //    var cords = geoString.split(',');

    //    if (Array.isArray(values[i].epcisBody.eventList[0].sensorElementList)) {
    //        var newDataItem = {
    //            GSIN: gsinDetails.gsin,
    //            MACAddress: values[i].epcisBody.eventList[0].sensorElementList[0].sensorMetadata.deviceID,
    //            Timestamp: values[i].epcisBody.eventList[0].sensorElementList[0].sensorMetadata.time,
    //            Latitude: cords[0],
    //            Longitude: cords[1],
    //            Temperature: ExtractParameterPerType('Temperature', values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
    //            Humidity: ExtractParameterPerType('RelativeHumidity', values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),

    //            AccelerometerX: ExtractParameterPerTypeAndComponent('Comp-x',
    //                values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
    //            AccelerometerY: ExtractParameterPerTypeAndComponent('Comp-y',
    //                values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
    //            AccelerometerZ: ExtractParameterPerTypeAndComponent('Comp-z',
    //                values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
    //            Luminance: ExtractParameterPerType('Luminance', values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
    //            Battery: ExtractParameterPerType('Luminance', values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport)
    //        }

    //        newData.push(newDataItem);
    //    }
    //}

    //selectedGsinInfo.filtered_values = newData;

    //datatable initialization
    var table = $(tableId).DataTable({
        //data: resp,
        order: [[3, 'desc']], //Sort descendent By Timestamp
        lengthMenu: [20, 50, 75, 100],
        columns: cols,
        data: newData,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    //hideColumns(table, ['MACAddress','ContainerID'])

    //$('#TrackingTable').css('font-size', '15px');

    setDatatableColumnSearch(title, table, 'TrackAndTraceView', false);

    $(tableId + ' tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            //$('.Charts').hide()
            //ClickedOnRowSetSelectedID(tableid, id);
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            //ClearGraphsAreaAndGenerateNewArea(['currentTemperatureGraphArea', 'currentHumidityGraphArea', 'temperaturePerTimeGraphArea', 'humidityPerTimeGraphArea', 'mapGraphArea']);
            //var cord = table.row(this).data().coordinates; // array of 2
            var lat = table.row(this).data().Latitude;
            var lon = table.row(this).data().Longitude;

            var cord = [];
            cord.push(parseFloat(lat));
            cord.push(parseFloat(lon));

            var temp = table.row(this).data().Temperature;  //number
            var humd = table.row(this).data().Humidity; //number
            var date = new Date(table.row(this).data().Timestamp);

            var html = '<div class="trackDetail-bottomContainer">';
            html += '<div>';
            html += '<div class="container-date">';
            html += date.toLocaleDateString()
            html += '</div>'
            html += '<div class="container-time">'
            html += date.toLocaleTimeString()
            html += '</div>'
            html += '</div>'
            html += '<div>'
            html += ' <div class="top-bot-info">'
            html += ' <h1 class="main-text">'
            html += temp + ' °C'
            html += '</h1>'

            if (temp >= 20) {
                html += '<span>Sunny</span>'
                html += '</div>'
                html += '<i class="fa-solid fa-sun"></i>'
            }
            else if (temp < 20 && temp >= 10) {
                html += '<span>Partly Sunny</span>'
                html += '</div>'

                html += '<i class="fa-solid fa-cloud-sun-rain" style="font-size:40px; color:grey"></i>'
            } else {
                html += '<span>Raining</span>'
                html += '</div>'

                html += '<i class="fa-solid fa-cloud" style="color:grey"></i>'
            }




            html += '<div class="top-bot-info">'
            html += '<p>Latitude</p>'
            html += '<span>' + cord[0] + '</span>'
            html += '</div>'
            html += '<div class="top-bot-info">'
            html += '<p>Longitude</p>'
            html += '<span>' + cord[1] + '</span>'
            html += '</div>'
            html += '<div class="top-bot-info">'
            html += '<p>Humidity</p>'
            html += '<span>' + humd + '</span>'
            html += '</div>'
            html += '</div>'
            html += '</div>';

            $('.trackDetail-bottomContainer-main').empty().append(html);

            if (temp > 25) {
                //Toast Alert implementation
                ShowToastAlertMessage("Alert!", "Alert, Temperature has exceeded maximum....");
            }
            //Display google map
            var coordinates = { lat: cord[0], lng: cord[1] };
            var map = new google.maps.Map(
                document.getElementById('google_planet_map'),
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

            var marker = new google.maps.Marker({
                position: coordinates,
                map: map
            });
        }
    });
}

function ExtractIotDataPerType(type, hosts, index) {
    var data;

    for (var i = 0; i < hosts.length; i++) {
        if (hosts[i].id.includes(type)) {
            data = hosts[i].observations[index].value
        }
    }

    return data;
}

function GenerateLl1IotTableFromKafkaData(gsinDetails) {

    var values = gsinDetails.values;

    let title = 'Track-Trace-Table'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (values.length > 0)
        $('.TrackingTablearea').show();
    else
        $('.TrackingTablearea').hide();

    //making coordinates from string to array
    //for (i = 0; i < values.length; i++) {
    //    resp[i].coordinates = JSON.parse(resp[i].coordinates);
    //}

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    //Preparing cols
    var cols = [
        { "name": 'GSIN', "title": 'GSIN', "data": "GSIN" },
        { "name": 'MACAddress', "title": 'MACAddress', "data": "MACAddress" },
        { "name": 'Timestamp', "title": 'Timestamp', "data": "Timestamp" },
        { "name": 'Latitude', "title": 'Latitude', "data": "Latitude" },
        { "name": 'Longitude', "title": 'Longitude', "data": "Longitude" },
        { "name": 'Temperature', "title": 'Temperature', "data": "Temperature" },
        { "name": 'RelativeHumidity', "title": 'Humidity', "data": "Humidity" },
        { "name": 'Comp-x', "title": 'Accelerometer X', "data": "AccelerometerX" },
        { "name": 'Comp-y', "title": 'Accelerometer Y', "data": "AccelerometerY" },
        { "name": 'Comp-z', "title": 'Accelerometer Z', "data": "AccelerometerZ" },
        { "name": 'Luminance', "title": 'Luminance', "data": "Luminance" },
        { "name": 'Battery', "title": 'Battery', "data": "Battery" }
    ];

    //var randomRecord = values[0].epcisBody.eventList[0].sensorElementList.sensorReport;

    //for (var j = 0; j < cols.length; j++) {
    //    if(cols[j].)
    //}

    var newData = [];
    //Preparing  newData values

    for (var i = 0; i < values.length; i++) {

        var geoString = values[i].epcisBody.eventList[0].readPoint.id.replace('geo:', '');
        var cords = geoString.split(',');

        if (Array.isArray(values[i].epcisBody.eventList[0].sensorElementList)) {
            var newDataItem = {
                GSIN: gsinDetails.gsin,
                MACAddress: values[i].epcisBody.eventList[0].sensorElementList[0].sensorMetadata.deviceID,
                Timestamp: values[i].epcisBody.eventList[0].sensorElementList[0].sensorMetadata.time,
                Latitude: cords[0],
                Longitude: cords[1],
                Temperature: ExtractParameterPerType('Temperature', values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
                Humidity: ExtractParameterPerType('RelativeHumidity', values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),

                AccelerometerX: ExtractParameterPerTypeAndComponent('Comp-x',
                    values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
                AccelerometerY: ExtractParameterPerTypeAndComponent('Comp-y',
                    values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
                AccelerometerZ: ExtractParameterPerTypeAndComponent('Comp-z',
                    values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
                Luminance: ExtractParameterPerType('Luminance', values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport),
                Battery: ExtractParameterPerType('Luminance', values[i].epcisBody.eventList[0].sensorElementList[0].sensorReport)
            }

            newData.push(newDataItem);
        }
    }

    selectedGsinInfo.filtered_values = newData;

    //datatable initialization
    var table = $(tableId).DataTable({
        //data: resp,
        order: [[2, 'desc']], //Sort descendent By Timestamp
        columns: cols,
        data: newData,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    //hideColumns(table, ['MACAddress','ContainerID'])

    //$('#TrackingTable').css('font-size', '15px');

    setDatatableColumnSearch(title, table, 'TrackAndTraceView', false);

    $(tableId + ' tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            //$('.Charts').hide()
            //ClickedOnRowSetSelectedID(tableid, id);
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            //ClearGraphsAreaAndGenerateNewArea(['currentTemperatureGraphArea', 'currentHumidityGraphArea', 'temperaturePerTimeGraphArea', 'humidityPerTimeGraphArea', 'mapGraphArea']);
            //var cord = table.row(this).data().coordinates; // array of 2
            var lat = table.row(this).data().Latitude;
            var lon = table.row(this).data().Longitude;

            var cord = [];
            cord.push(parseFloat(lat));
            cord.push(parseFloat(lon));

            var temp = table.row(this).data().Temperature;  //number
            var humd = table.row(this).data().Humidity; //number
            var date = new Date(table.row(this).data().Timestamp);

            var html = '<div class="trackDetail-bottomContainer">';
            html += '<div>';
            html += '<div class="container-date">';
            html += date.toLocaleDateString()
            html += '</div>'
            html += '<div class="container-time">'
            html += date.toLocaleTimeString()
            html += '</div>'
            html += '</div>'
            html += '<div>'
            html += ' <div class="top-bot-info">'
            html += ' <h1 class="main-text">'
            html += temp + ' °C'
            html += '</h1>'

            if (temp >= 20) {
                html += '<span>Sunny</span>'
                html += '</div>'
                html += '<i class="fa-solid fa-sun"></i>'
            }
            else if (temp < 20 && temp >= 10) {
                html += '<span>Partly Sunny</span>'
                html += '</div>'

                html += '<i class="fa-solid fa-cloud-sun-rain" style="font-size:40px; color:grey"></i>'
            } else {
                html += '<span>Raining</span>'
                html += '</div>'

                html += '<i class="fa-solid fa-cloud" style="color:grey"></i>'
            }




            html += '<div class="top-bot-info">'
            html += '<p>Latitude</p>'
            html += '<span>' + cord[0] + '</span>'
            html += '</div>'
            html += '<div class="top-bot-info">'
            html += '<p>Longitude</p>'
            html += '<span>' + cord[1] + '</span>'
            html += '</div>'
            html += '<div class="top-bot-info">'
            html += '<p>Humidity</p>'
            html += '<span>' + humd + '</span>'
            html += '</div>'
            html += '</div>'
            html += '</div>';

            $('.trackDetail-bottomContainer-main').empty().append(html);

            if (temp > 25) {
                //Toast Alert implementation
                ShowToastAlertMessage("Alert!", "Alert, Temperature has exceeded maximum....");
            }
            //Display google map
            var coordinates = { lat: cord[0], lng: cord[1] };
            var map = new google.maps.Map(
                document.getElementById('google_planet_map'),
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

            var marker = new google.maps.Marker({
                position: coordinates,
                map: map
            });
        }
    });

}

function ExtractParameterPerType(type, reportList) {
    var data = 0;

    for (var i = 0; i < reportList.length; i++) {

        if ((reportList[i].type !== null) && reportList[i].type.toLowerCase().includes(type.toLowerCase())) {
            data = reportList[i].value;

            if (data === null) data = 0;
        }

    }

    return data;
}

function ExtractParameterPerTypeAndComponent(componentType, reportList) {
    var data = 0;

    for (var i = 0; i < reportList.length; i++) {

        if ((reportList[i].component !== null) && reportList[i].component.toLowerCase().includes(componentType.toLowerCase())) {
            data = reportList[i].value;

            if (data === null) data = 0;
        }

    }

    return data;
}

function DisplayTrackHistory() {
    var gsin = $('#ContainerID').val();

    if (gsin === 0) {
        ShowErrorMessage("Select a GSIN Before");
    } else {

        var allValues = selectedGsinInfo.filtered_values;

        var groupedRecords = allValues.reduce((acc, value) => {

            acc[value.MACAddress] = [...acc[value.MACAddress] || [], value];
                return acc;
            },
            {});

        for (var i in groupedRecords) {

            var deviceCordinates = [];

            for (var j = 0; j < groupedRecords[i].length; j++) {
                var cords = {
                    lat: parseFloat(groupedRecords[i][j].Latitude),
                    lng: parseFloat(groupedRecords[i][j].Longitude)
                };

                deviceCordinates.push(cords);
            }

            var containerPath = new google.maps.Polyline({
                path: deviceCordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                //strokeColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            containerPath.setMap(map);
            map.panTo(deviceCordinates[0]);
        }

        ShowSuccessMessage("All Sensors Positions displayed successfully!");
    }
}

function DisplayTrack2History() {
    var gsin = $('#ContainerID1').val();

    if (gsin === '' || gsin === null || isNaN(gsin)) {
        ShowErrorMessage("Select a GSIN Before");
    } else {

        var allValues = selectedGsinInfo.filtered_values;

        var groupedRecords = allValues.reduce((acc, value) => {

            acc[value.MACAddress] = [...acc[value.MACAddress] || [], value];
            return acc;
        },
            {});

        for (var i in groupedRecords) {

            var deviceCordinates = [];

            for (var j = 0; j < groupedRecords[i].length; j++) {
                var cords = {
                    lat: parseFloat(groupedRecords[i][j].Latitude),
                    lng: parseFloat(groupedRecords[i][j].Longitude)
                };

                deviceCordinates.push(cords);
            }

            var containerPath = new google.maps.Polyline({
                path: deviceCordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                //strokeColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            debugger;
            containerPath.setMap(map);
        }

        ShowSuccessMessage("All Sensors Positions displayed successfully!");
    }
}

function loadDigiport() {
    var html = '';

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'digiport' },
        success: function (resp) {

            html = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });

    $(`#${mainContainer}`).empty().append(html);
}

function RetrieveGsinIdList() {
    var logisticUnits = RetrieveAllLogisticUnits();
    console.log(logisticUnits);
}

function RetrieveAllLogisticUnits() {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveLL1_AllLogisticUnits",
        success: function (resp) {
            data = resp.result.data.logisticUnit;
        }, error: function (resp) {
            console.error(resp)
        }
    });

    return data;
}

function loadTransportModel() {
    var html = '';

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'PT-Models' },
        success: function (resp) {

            html = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(html);
    GeneratePredictiveCorrelationGraphs();
}

function GeneratePredictiveCorrelationGraphs() {
    var graphs = [
        //{ id: "correlation_vector_predicted_var", name: "Correlation Vector Predicted Var" },
        //{ id: "correlation_vector_predictors_vars", name: "Cost - Volume Test Correlation" },
        {
            id: "correlation_vector_predictors_vars", name: "Cost - Volume Correlations Predicted", param: 'cont_cost_eur (hinterland)' },
        //{ id: "correlation_vector_predictors_vars", name: "Time Hrs - Volume Test Correlation" },
        { id: "correlation_vector_predictors_vars", name: "Time Hrs - Volume Predicted", param: 'cont_leadtime_hours (hinterland)' },
        //{ id: "correlation_vector_predictors_vars", name: "CO2 Emission Cost - Volume Test Correlation" },
        {
            id: "correlation_vector_predictors_vars", name: "CO2 Emission Cost - Volume Predicted", param: 'cont_emissions_kgCO2 (hinterland)' },
        { id: "container_prediction", name: "Container Predictions", param: '' }
    ];

    for (var i = 0; i < graphs.length; i++) {
        var htmlBlock = '';
        htmlBlock += '<div class="tablemain col-12 card" style="margin-top:5%">'
        htmlBlock += '<div class="row">'
        htmlBlock += '<div class="col-5">'
        htmlBlock += '<div class="headtabletitle">' + graphs[i].name + '</div>'
        htmlBlock += ' </div>'
        htmlBlock += '</div>'


        htmlBlock += '<div class="row">'
        htmlBlock += '<div class="col-sm-12">'
        htmlBlock += '<hr style="width:100%;text-align:center;margin-left:0">'
        htmlBlock += '</div>'
        htmlBlock += '</div>'

        htmlBlock += '<div class="col-sm-12 table_class">'
        htmlBlock += '<div class="' + i + 'table">'
        htmlBlock += '<div id="graph_' + i + '" style="height:18rem"></div>'
        htmlBlock += '</div>'
        htmlBlock += '</div>'
        htmlBlock += '</div>';

        if (i % 2 === 0) {
            $('#ptm_data_left_block').append(htmlBlock);
        } else {
            $('#ptm_data_right_block').append(htmlBlock);
        }

        var chart = {};
        chart = new CanvasJS.Chart('graph_' + i, GetCorrelationGraphPerId(graphs[i]));
        chart.render();
    }
}

function GetCorrelationGraphPerId(g) {
    var predictiveRepositoryName = 'PredictiveTP';

    var data = RetrieveMongoCollectionData(predictiveRepositoryName, g.id);
    var config = {};

    if (g.id === 'container_prediction') {
        config = {
            animationEnabled: true,
            zoomEnabled: true,
            axisX: {
                title: "Time",
                valueFormatString: "DD-MM-YY hh:mm"
            },
            legend: {
                cursor: "pointer",
                fontSize: 16,
            },
            axisY: {
                title: "Containers",
            },
            data: [
                {
                    type: "line",
                    name: "volume_no_containers",
                    showInLegend: true,
                    dataPoints: GetContainersGraphDataPoints(data)
                },
                {
                    type: "line",
                    name: "predicted",
                    showInLegend: true,
                    dataPoints: GetPredictedContainersGraphDataPoints(data)
                }
            ]
        };
    }
    else {
        console.log(data);
        config = {
            animationEnabled: true,
            zoomEnabled: true,
            axisX: {
                title: g.param
            },
            axisY: {
                title: "Volume No of Containers",
            },
            data: [{
                type: "scatter",
                dataPoints: GetCorrelationDataPointsPerParam(g.param, data)
            }]
        };
    }

    return config;
}

function GetCorrelationDataPointsPerParam(param, values) {
    var data = [];

    /*if (param == 'cont_cost_eur (hinterland)') {*/
        for (var i = 0; i < values.length; i++) {
            data.push({
                x: values[i][param],
                y: values[i].cont_transport_numeric
            });
        }
    //}

    return data;
}

function GetContainersGraphDataPoints(values) {
    var data = [];
    for (var i = 0; i < values.length; i++) {
        data.push({
            x: new Date(values[i].time),
            y: values[i].volume_no_containers
        });
    }

    data.sort(function (a, b) {
        return new Date(b.x) - new Date(a.x);
    });

    return data;
}

function GetPredictedContainersGraphDataPoints(values) {
    var data = [];
    for (var i = 0; i < values.length; i++) {
        data.push({
            x: new Date(values[i].time),
            y: values[i].predicted
        });
    }
    data.sort(function (a, b) {
        return new Date(b.x) - new Date(a.x);
    });
    
    return data;
}

//DSS Route Optimization

function OnRouteDateChange() {
    $('.scnariobuttons').show();
    var selectedRouteDate = $('#RouteDate_id').val();
    GenerateRouteOptDateDetailsInfos(selectedRouteDate);
}


function RetrieveAllDateRoutes() {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveAllRouteDates",
        success: function (resp) {
            data = resp.result;
        }, error: function (resp) {
            console.error(resp)
        }
    });

    return data;
}


function GenerateRouteOptDateDetailsInfos(date) {
    var dateRoutes = RetrieveOptRoutePerDate(date);
    //AllOptimizedRoutes.push(dateRoutes);

    var html = '<div id="optimized_route_map" style="width:100%; height:550px"></div>';
    $('#map_block').empty().append(html);
    $('#van_Block').show();
    $('#optimized_route_block').show();

    AddAggregratedDate(dateRoutes);

    InitRouteMap();
    LoadVanDetails(dateRoutes, vanTypes);
}

function AddAggregratedDate(data) {
    var html = '';
    html += '<div class="accordion" id="accordionFlushExample">';
    html += ' <div class="accordion-item" >';
    html += '<h3 class="accordion-header" id="flush-headingOne">';
    html +=
        '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">';
    html += 'Aggregrated Statistics';
    html += '</button>';
    html += '</h3>';
    html +=
        '<div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">';
    html += '<div class="accordion-body" style="padding:3%">'
    html += GetAggregratedVanStats(data);
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('#aggreated_route_block').empty().append(html);

    var routes = [];
    for (var i = 0; i < data[0].van_stats.length; i++) {
        routes.push(data[0].van_stats[i]);
    }

    var tableId = '#aggregrated_van_route_Table';
    var title = 'aggregrated_van_route_Table';

    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    let col = getTableColFromObj(routes);

    //datatable initialization
    var table = $(tableId).DataTable({
        data: routes,
        'searching': true,
        columns: col,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });

    setDatatableColumnSearch(title, table, 'Route Optimized', false);
}

function GetAggregratedVanStats(data) {

    var avg_distance = 0;
    var avg_ev = 0;
    var total_distance = 0;
    var avg_time = 0;
    var total_time = 0;

    for (var i = 0; i < data[0].van_stats.length; i++) {
        total_distance = avg_distance + data[0].van_stats[i].total_distand_km;
        //avg_ev = 0;
        total_time = total_time + data[0].van_stats[i].total_time_seconds;
    }

    avg_time = ((total_time / data[0].van_stats.length) / 3600).toFixed(2);
    avg_distance = ((total_distance / data[0].van_stats.length) / 1000).toFixed(2);

    var html = '';
    html += '<div class="row">'

    html += '<div class="col-sm-4">'
    html += '<div class="stat-card" >'
    html += '<div class="stat-card__content">'
    html += '<p class="text-uppercase mb-1 text-muted">Average Time</p>'
    html += '<h2> ' + avg_distance + ' Hr(s)</h2>'
    html += '<div>'
    //html += '<span class="text-success font-weight-bold mr-1"><i class="fas fa-info-circle"></i></span>'
    //html += '<span class="text-muted">' + van_details + '</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="stat-card__icon stat-card__icon--success">'
    html += '<div class="stat-card__icon-circle">'
    html += '<i class="fa fa-clock stat-icon"></i>'
    html += '</div>'
    html += '</div>'
    html += '</div >'
    html += '</div >'

    //TOTAL DISTANCE
    html += '<div class="col-sm-4">'
    html += '<div class="stat-card" >'
    html += '<div class="stat-card__content">'
    html += '<p class="text-uppercase mb-1 text-muted">Total Distance</p>'
    html += '<h2> ' + total_distance + ' (Km)</h2>'
    html += '<div>'
    //html += '<span class="text-success font-weight-bold mr-1"><i class="fas fa-info-circle"></i></span>'
    //html += '<span class="text-muted">' + van_details + '</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="stat-card__icon stat-card__icon--success">'
    html += '<div class="stat-card__icon-circle">'
    html += '<i class="fas fa-ruler-horizontal stat-icon"></i>'
    html += '</div>'
    html += '</div>'
    html += '</div >'
    html += '</div >'

    html += '<div class="col-sm-4">'
    html += '<div class="stat-card" >'
    html += '<div class="stat-card__content">'
    html += '<p class="text-uppercase mb-1 text-muted">Vans Used</p>'
    html += '<h2> ' + data[0].van_stats.length + '</h2>'
    html += '<div>'
    //html += '<span class="text-success font-weight-bold mr-1"><i class="fas fa-info-circle"></i></span>'
    //html += '<span class="text-muted">' + van_details + '</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="stat-card__icon stat-card__icon--success">'
    html += '<div class="stat-card__icon-circle">'
    html += '<i class="fas fa-truck-loading stat-icon"></i>'
    html += '</div>'
    html += '</div>'
    html += '</div >'
    html += '</div >'

    html += '</div>'

    html += '<div class="row">';
    html += '<div class="table-responsive col-12"><table class="table table-striped table-bordered" id="aggregrated_van_route_Table" style="width:100% !important"></table></div>';
    html += '</div>'
    return html;
}

var invalidCols = ['_id', 'date', 'hub_origin', 'van_index', 'street', 'postcode', 'city', 'dest_string', 'van_type', 'activity', 'service_Type', 'steps', 'cluster'];

function LoadVanDetails(data, types, index = 0) {
    var html = '';
    html += '<div class="col-md-2 col-sm-12"><label for="ucdescription"> Select Van ID</label></div>';
    html += '<div class="col-md-9 col-sm-10">';
    html += '<select id="van_selector_id" onchange="OnRouteVanChanged()">';
    for (var i = 0; i < data[0].van_stats.length; i++) {
        html += '<option value="' + data[0].van_stats[i].van_index + '">' + data[0].van_stats[i].van_index +'</option>'
    }
    html += '</select>'
    html += '</div>'

    html += '<div class="row" id="cards_statistic_block" style="margin-top:2%; width:100%">'
    
    html += GetVanStats(index, data[0].van_stats, types)
    html += '</div>'

    $('#van_selection_block').empty().append(html);
    $('#van_selector_id').chosen({ search_contains: true });

    var html1 = '';
    html1 = '<div class="table-responsive col-12"><table class="table table-striped table-bordered" id="van_route_Table" style="width:100% !important"></table></div>';
    $('#van_route_details').empty().append(html1);

    AddRouteTableDetails(index, data);

    SetMapRoutes(index, data);
}

function AddRouteTableDetails(index, data) {
    var routes = data[0].routes.filter(r => r.van_index === index);

    var tableId = '#van_route_Table';
    var title = 'van_route_Table';

    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    let col = getTableColFromObj(routes)
    var cols = [];

    for (var i = 0; i < col.length; i++) {
        if (!invalidCols.includes(col[i].data)) {
            cols.push(col[i]);
        }
    }

    //datatable initialization
    var table = $(tableId).DataTable({
        data: routes,
        'searching': true,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });

    setDatatableColumnSearch(title, table, 'Route Optimized', false);
}

function OnRouteVanChanged() {
    var newVanIndex = parseInt($('#van_selector_id').val());
    var selectedDate = $('#RouteDate_id').val();
    var routeData = RetrieveOptRoutePerDate(selectedDate);

    var html = GetVanStats(newVanIndex, routeData[0].van_stats, vanTypes);
    $('#cards_statistic_block').empty().append(html);

    AddRouteTableDetails(newVanIndex, routeData);
}

function GetVanStats(index, stats, vanTypes) {

    vanStats = stats.filter(s => s.van_index === index);
    

    var total_time = vanStats[0].total_time_seconds / 3600; //Converting in hrs
    var total_distance = vanStats[0].total_distand_km / 1000; //Converting in Km
    var total_volume = vanStats[0].total_volume_cm;
    var total_quantity = vanStats[0].total_quantity;
    var total_weight = vanStats[0].total_weight;

    var van_details = vanTypes.filter(t => t.id === vanStats[0].van_type)[0].name + ' Van No <b>' + vanStats[0].van_index + '</b> statisitics'

    var html = '';
    //TOTAL TIME
    html += '<div class="col-sm-3">'
    html += '<div class="stat-card" >'
    html += '<div class="stat-card__content">'
    html += '<p class="text-uppercase mb-1 text-muted">Total Time</p>'
    html += '<h2> '+ total_time.toFixed(2)+' Hr(s)</h2>'
    html += '<div>'
    html += '<span class="text-success font-weight-bold mr-1"><i class="fas fa-info-circle"></i></span>'
    html += '<span class="text-muted">'+ van_details+'</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="stat-card__icon stat-card__icon--success">'
    html += '<div class="stat-card__icon-circle">'
    html += '<i class="fa fa-clock stat-icon"></i>'
    html += '</div>'
    html += '</div>'
    html += '</div >'
    html += '</div >'

    //TOTAL DISTANCE
    html += '<div class="col-sm-3">'
    html += '<div class="stat-card" >'
    html += '<div class="stat-card__content">'
    html += '<p class="text-uppercase mb-1 text-muted">Total Distance</p>'
    html += '<h2> ' + Math.round(total_distance) + ' (Km)</h2>'
    html += '<div>'
    html += '<span class="text-success font-weight-bold mr-1"><i class="fas fa-info-circle"></i></span>'
    html += '<span class="text-muted">' + van_details + '</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="stat-card__icon stat-card__icon--success">'
    html += '<div class="stat-card__icon-circle">'
    html += '<i class="fas fa-ruler-horizontal stat-icon"></i>'
    html += '</div>'
    html += '</div>'
    html += '</div >'
    html += '</div >'

    //TOTAL VOLUME
    html += '<div class="col-sm-3">'
    html += '<div class="stat-card" >'
    html += '<div class="stat-card__content">'
    html += '<p class="text-uppercase mb-1 text-muted">Total Volume</p>'
    html += '<h2> ' + total_volume + ' (cm)</h2>'
    html += '<div>'
    html += '<span class="text-success font-weight-bold mr-1"><i class="fas fa-info-circle"></i></span>'
    html += '<span class="text-muted">'+ van_details+'</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="stat-card__icon stat-card__icon--success">'
    html += '<div class="stat-card__icon-circle">'
    html += '<i class="fas fa-cube stat-icon"></i>'
    html += '</div>'
    html += '</div>'
    html += '</div >'
    html += '</div >'

    //TOTAL QUANTITY
    html += '<div class="col-sm-3">'
    html += '<div class="stat-card" >'
    html += '<div class="stat-card__content">'
    html += '<p class="text-uppercase mb-1 text-muted">Total Deliveries</p>'
    html += '<h2> ' + total_quantity + '</h2>'
    html += '<div>'
    html += '<span class="text-success font-weight-bold mr-1"><i class="fas fa-info-circle"></i></span>'
    html += '<span class="text-muted">'+ van_details+'</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="stat-card__icon stat-card__icon--success">'
    html += '<div class="stat-card__icon-circle">'
    html += '<i class="fas fa-truck-loading stat-icon"></i>'
    html += '</div>'
    html += '</div>'
    html += '</div >'
    html += '</div >'

    html += '<div class="col-12 alert alert-info" role="alert" style="margin-left:1%"> Routes assume each package takes 5 minutes to pickup / deliver (plus 30 seconds for additional packages) and does not take into account traffic delays</div>'


    //TOTAL WEIGHT
    //html += '<div class="col-sm-3">'
    //html += '<div class="stat-card" >'
    //html += '<div class="stat-card__content">'
    //html += '<p class="text-uppercase mb-1 text-muted">Total Weight</p>'
    //html += '<h2> ' + total_weight + '</h2>'
    //html += '<div>'
    //html += '<span class="text-success font-weight-bold mr-1"><i class="fas fa-info-circle"></i></span>'
    //html += '<span class="text-muted">'+ van_details+'</span>'
    //html += '</div>'
    //html += '</div>'
    //html += '<div class="stat-card__icon stat-card__icon--success">'
    //html += '<div class="stat-card__icon-circle">'
    //html += '<i class="fa fa-suitcase stat-icon"></i>'
    //html += '</div>'
    //html += '</div>'
    //html += '</div >'
    //html += '</div >'

    return html;
}

var map2 = {};

function InitRouteMap() {
    const madrid = { lat: 40.399088, lng: -3.712549 };
    // The map, centered at Madrid
    map2 = new google.maps.Map(document.getElementById("optimized_route_map"), {
        zoom: 8,
        center: madrid,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#181818"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1b1b1b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2c2c2c"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8a8a8a"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#373737"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3c3c3c"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3d3d3d"
                    }
                ]
            }
        ]
    });
}

function SetMapRoutes(index, data) {

    InitRouteMap(); //Reinitialize map

    for (var i = 0; i < data[0].routes.length; i++) {
        var vanCordinates = [];
        var steps = data[0].routes[i].steps.split(';');

        for (var j = 0; j < steps.length; j++) {

            var lon = steps[j].split(',')[0];
            var lat = steps[j].split(',')[1];

            vanCordinates.push({
                lat: parseFloat(lat),
                lng: parseFloat(lon)
            })
        }

        var vanNumberString = "Van No. " + data[0].routes[i].van_index;
        var vanPath = {};
        if (data[0].routes[i].van_index == index) {
            vanPath = new google.maps.Polyline({
                path: vanCordinates,
                geodesic: true,
                strokeColor: "#0c6e55",
                strokeOpacity: 0.9,
                strokeWeight: 2
            });
        }
        else {
            vanPath = new google.maps.Polyline({
                path: vanCordinates,
                geodesic: true,
                //strokeColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
                strokeColor: "#B1890C",
                strokeOpacity: 0.5,
                strokeWeight: 1
            });
        }

        vanPath.setMap(map2);

        //var tooltip = new google.maps.InfoWindow({
        //    content: vanNumberString,
        //    anchor: vanPath
        //})
        
        //google.maps.event.addListener(vanPath, 'mouseover', function (e) {
        //    var latLng = e.latLng;
        //    this.setOptions({ fillOpacity: 0.1 });
        //    tooltip.setPosition(latLng);
        //    tooltip.open(map2);
        //});
        //google.maps.event.addListener(vanPath, 'mouseout', function () {
        //    this.setOptions({ fillOpacity: 0.35 });
        //    tooltip.close();
        //});
    }
}

function AddNewDateRoutes() {

    var targets = [
        { id: 'total_time', name: 'Total Time' },
        { id: 'total_distance', name: 'Total Distance' },
        { id: 'ev_utilization', name: 'EV Utitilization' }
    ];
    
    var html = '';
    html += '<div id="modal_planet" class="modal" role="dialog">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>Add new orders or updated delivery status</h4>';
    html += '<span onclick="CloseModal()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'
    /*start ROW OF 2*/

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-4">'
    html += 'Select Optimization Target:'
    html += '</div>'
    html += '<div class="col-sm-8">'
    html += '<select class="form-control" id="optimization_target" style="margin:-5px;">'

    for (var i = 0; i < targets.length; i++) {
        html += '<option value="' + targets[i].id+'">'+ targets[i].name+'</option>'
    }

    html += '</select>'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'
    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-4">'
    html += 'Upload CSV File:'
    html += '</div>'
    html += '<div class="col-sm-8 fileuploaderexperiment">'
    html += '<input type="file" id="docpicker" accept=".csv">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'
    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-12 addnewexperimentresultonerror">'
    html += '</div>';
    html += '</div>';

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<input id="selected_test_file_Id" type="hidden"/>'

    html += '<div class="col-sm-12 ExperimentResultsModalButtons modalbuttons main-buttons-with-icons">'
    html += '<button class="savebutton sacecancelbuttonoc btn btn-success" onclick="Browse()" type="button"  style="background-color: #0c6e55; border-color: #0c6e55">Browse<i class="marginicon fas fa-folder-open"></i></button>';
    html += '<button class="savebutton sacecancelbuttonoc btn btn-success" onclick="UploadRouteFile()" type="button"  style="background-color: #0c6e55; border-color: #0c6e55">Save / Update<i class="marginicon fas fa-save"></i></button>';
    html += '<button class="sacecancelbuttonoc btn btn-danger" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>';
    $(".homemodal").append(html);
    $("#modal_planet").show();

    $('#optimization_target').chosen({ search_contains: true });

    $('#docpicker').fileinput({
        theme: "fas",
        uploadUrl: '/Planet/UploadRouteExcelRawDataFile',
        uploadExtraData: function (previewId, index) {
            return { target: $('#optimization_target').val() };
        },
        showUpload: true,
        hideThumbnailContent: true,
        showCaption: true,
        autoReplace: true,
        maxFileCount: 1,
        browseClass: "d-none"
    }).on('fileloaded', function () {
        $('.addnewexperimentresultonerror').empty()
        if ($(this).closest('.file-input').find('.kv-preview-thumb').length > 1) {
            $(this).closest('.file-input').find('.kv-preview-thumb').eq(0).remove();
        }
    }).on('fileuploaded', function (event, previewId, index, fileId) {
        debugger;
        if (previewId.response.code != 200) {
            //$('.kv-file-remove').click()
            $('.addnewexperimentresultonerror').empty()
                .append('<label class=".alert-danger-login alert alert-danger">' + previewId.response.result + '</label>');
        } else {
            ShowSuccessMessage('Csv file uploaded successfully!');
            CloseModal();
            loadDssOptRoute();
        }
    });

    $('.file-drop-zone-title').text('Drag & Drop excel file here...')
    $('.fileinput-remove').hide();
    $('.file-caption').hide();
    $('.kv-file-zoom').remove();
}

function CloseModal() {
    $('#modal_planet').remove();
}

function Browse() {
    $('#docpicker').click();
}

function UploadRouteFile() {
    var filesCount = $('#docpicker').fileinput('getFilesCount');
    if (filesCount == 0) {
        ShowErrorMessage('Error! Must provide a .csv file');
    }
    else if (filesCount == 1) {
        $("#docpicker").fileinput("upload");
    }
    
}

function RetrieveOptRoutePerDate(date) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveOptRoutePerDate",
        data: {
            date: date.substring(0, 10) //Extract date only
        },
        success: function (resp) {
            data = resp.result;
        }, error: function (resp) {
        }
    });

    return data;
}