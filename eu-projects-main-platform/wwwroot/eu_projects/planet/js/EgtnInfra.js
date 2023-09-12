var barcelonaSpreadSheet;
var valenciaSpreadSheet;
var mixedSpreadSheet;

function loadEgtnInfraMenu() {
    var menuCode = 'EGTNI'

    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadMenu",
        data: { menuName: menuCode},
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    DisplayInfrastructureMenu(menuCode);
}

function DisplayInfrastructureMenu(code) {
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

    $('#egtn_infrastructure_grid_card').empty().append(html);
}

//#region node

function loadEGTNnode() {
    
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'EGTN-node' },
        success: function (resp) {

            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);

    //this.default = loadSyncFusion_spreadsheet();

    setGridViewDropdown('EGTN-node')

    getEgtnNodeTableData();
    
    /*loadFromServerSyncFusion_spreadsheet();*/

    DisplayDryPortInfos();
}

function DisplayDryPortInfos() {
    var html = ''
    var files = [
        {
            name: 'Costes_Rangos_BARCELONA_2021.xlsx',
            id: 'barcelona'
        },
        {
            name: 'Costes_Rangos_VALENCIA_2021.xlsx',
            id: 'valencia'
        },
        {
            name: 'Port Costs per call ALG_BCN_VLC.xlsx',
            id: 'mixed'
        }
    ];

    html += '<div class="accordion" id="dryPortAccordion>';

    for (var i = 0; i < files.length; i++) {

        html += ' <div class="accordion-item" >';
        html += '<h3 class="accordion-header" id="flush-headingOne' + files[i].id +'">';
        html +=
            '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne' + files[i].id + '" aria-expanded="false" aria-controls="flush-collapseOne' + files[i].id +'">';
        html += files[i].name;
        html += '</button>';
        html += '</h3>';
        html +=
            '<div id="flush-collapseOne' + files[i].id + '" class="accordion-collapse collapse" aria-labelledby="flush-headingOne' + files[i].id +'" data-bs-parent="#dryPortAccordion">';
        html +=
            '<div class="accordion-body" id="file_'+files[i].id+'"></div>';
        html += '</div>';
        
    }

    html += '</div>';

    $('#T1VESSEL_TaxTable').empty().append(html);

    for (var j = 0; j < files.length; j++) {
        
        loadSyncFusion_spreadsheet(files[j].id);

        loadFromServerSyncFusion_spreadsheet(files[j].id, files[j].name);
    }

}

//SPREADSHEET INIT
function loadSyncFusion_spreadsheet(id) {
    var tagId = '#file_' + id;
    var spreadsheet;
    spreadsheet = new ej.spreadsheet.Spreadsheet({
        openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
        saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
    });

    if (id === 'barcelona') {
        barcelonaSpreadSheet = spreadsheet;
        barcelonaSpreadSheet.appendTo(tagId);
    }
    else if (id === 'valencia') {
        valenciaSpreadSheet = spreadsheet;
        valenciaSpreadSheet.appendTo(tagId);
    } else {
        mixedSpreadSheet = spreadsheet;
        mixedSpreadSheet.appendTo(tagId);
    }

    $(tagId+'_sheet_panel').css('height', 'auto');
}

function loadFromServerSyncFusion_spreadsheet(id, fileName) {
    var directory = 'EGTNL-network-node\\Costs';

    $.ajax({
        type: 'POST',
        url: '/Planet/LoadExcel',
        dataType: "json",
        data: {
            directory: directory,
            filename: fileName
        },
        success: function (result) {
            if (id === 'barcelona') {
                barcelonaSpreadSheet.openFromJson({ file: result });
            }
            else if (id === 'valencia') {
                valenciaSpreadSheet.openFromJson({ file: result });
            } else {
                mixedSpreadSheet.openFromJson({ file: result });
            }
        },
        error: function (result) {
            console.log(result);
        }
    });
}

function getEgtnNodeTableData() {

    var warehouses = [
        { "Warehouse Name": 'Warehouse A 2710', 'Pallet Capacity': 17140, 'Free Storage Level': 1886, 'Free Storage Picking Zone': 1397 },
        { "Warehouse Name": 'Warehouse A 2610', 'Pallet Capacity': 17275, 'Free Storage Level': 1840, 'Free Storage Picking Zone': 1502 },
        { "Warehouse Name": 'Warehouse A 2510', 'Pallet Capacity': 17063, 'Free Storage Level': 1912, 'Free Storage Picking Zone': 1457 },
        { "Warehouse Name": 'Warehouse A 2410', 'Pallet Capacity': 17023, 'Free Storage Level': 1922, 'Free Storage Picking Zone': 1373}
    ];

    //request the data from API/service
    let data = warehouses;

    //for (let i = 0; i < 3; i++) {
    //    data.push(
    //        {
    //            "Warehouse Name": 'Warehouse ' + String.fromCharCode('A'.charCodeAt(0) + i),
    //            "Pallet capacity": 1300 * (i + 1),
    //            "Free storage": 20 * (i + 1),
    //            "Ambient": 'No',
    //            "Chilled": 'Yes',
    //            "Frozen": 'No',
    //            "Cross Docking": 'Yes',
    //        }
    //    )
    //}
    generateEgtnNodeDatatable(data);

    //sort by date

    let dataForPie1 = data.map(x => ({ name: x['Warehouse Name'], value: x['Pallet Capacity'] }));
    let dataForPie2 = data.map(x => ({ name: x['Warehouse Name'], value: x['Free Storage Level'] }));
    let dataForPie3 = data.map(x => ({ name: x['Warehouse Name'], value: x['Free Storage Picking Zone'] }));

    ClearGraphsAreaAndGenerateNewArea(['pie1GraphArea', 'pie2GraphArea', 'pie3GraphArea', 'barCol1GraphArea', 'barCol2GraphArea', 'barCol3GraphArea']);
    generatePieChart(dataForPie1, 'pie1GraphArea');
    generatePieChart(dataForPie2, 'pie2GraphArea');
    generatePieChart(dataForPie3, 'pie3GraphArea');

    generateBarColChart(dataForPie1, 'barCol1GraphArea')
    generateBarColChart(dataForPie2, 'barCol2GraphArea')
    generateBarColChart(dataForPie3, 'barCol3GraphArea')

    //generateHumidityPerTimeGrap(resp);

    $('.Charts').show();

}


function generateEgtnNodeDatatable(resp) {

    let title = 'Node-Table';
    let tableId = '#' + title;
    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.NodeTablearea').show();
    else
        $('.NodeTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    var cols = getTableColFromObj(resp);

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        'searching': true,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title, true)
    });

    setDatatableColumnSearch(title, table, 'EGTN-node')
   
}

//#endregion



//#region EGNT Corridor Route / Index

function loadEgtnCorridorRouteIndex() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'CorridorRouteIndex' },
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    getEgtnCorridorTableData();
    getEgtnCorridorNodeTableData();

}

function getEgtnCorridorTableData() {

    //request the data from API/service
    let data = [];

    for (let i = 0; i < 5; i++) {
        data.push(
            {
                "Nodes": 'Route ' + (i + 1),
                "CO2": 100 * (i + 1) + ' grms',
                "Total transport Cost": '50.532',
                "Congestion level": i == 0 ? 'low' : i == 1 ? 'meduim' : 5.28,
                "Distance": '230km',
                "Average delays": '45min',
                "Other": 7
            }
        )
    }
    generateEgtnCorridorDatatable(data);

}

function generateEgtnCorridorDatatable(resp) {

    let title = 'Corridor-Table';
    let tableId = '#' + title;


    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.CorridorTablearea').show();
    else
        $('.CorridorTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: [
            { "title": 'Nodes', "data": "Nodes" },
            { "title": 'CO2', "data": "CO2" },
            { "title": 'Total transport Cost', "data": "Total transport Cost" },
            { "title": 'Congestion level', "data": "Congestion level" },
            { "title": 'Distance', "data": "Distance" },
            { "title": 'Average delays', "data": "Average delays" },
            { "title": 'Other', "data": "Other" },
        ],
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });
    setDatatableColumnSearch(title, table, 'EGTN-Corr');
}

function getEgtnCorridorNodeTableData() {
    let fileName = 'route-node.xlsx'
    $.ajax({
        async: false,
        type: "POST",
        data: { fileName: fileName },
        url: "/Planet/getExcelFileObject",
        success: function (resp) {
            let data = JSON.parse(resp);
            data = roundNumbersInObj(data);
            generateEgtnCorridorNodeDatatable(data);
            //filterNodeCorridorGraphs(data);

        }, error: function (resp) {
            console.error(resp)
        }
    });
}

function generateStackedBarChart(data, id) {
    am5.ready(function () {
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new(id);


        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panY",
            wheelY: "zoomY",
            layout: root.verticalLayout
        }));

        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set("scrollbarY", am5.Scrollbar.new(root, {
            orientation: "vertical"
        }));

        //data = [{
        //    "port": "2021",
        //    "europe": 2.5,
        //    "namerica": 2.5,
        //    "asia": 2.1,
        //    "lamerica": 1,
        //    "meast": 0.8,
        //    "africa": 0.4
        //}, {
        //    "port": "2022",
        //    "europe": 2.6,
        //    "namerica": 2.7,
        //    "asia": 2.2,
        //    "lamerica": 0.5,
        //    "meast": 0.4,
        //    "africa": 0.3
        //}, {
        //    "port": "2023",
        //    "europe": 2.8,
        //    "namerica": 2.9,
        //    "asia": 2.4,
        //    "lamerica": 0.3,
        //    "meast": 0.9,
        //    "africa": 0.5
        //}]


        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "port",
            renderer: am5xy.AxisRendererY.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
        }));

        yAxis.data.setAll(data);

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            min: 0,
            renderer: am5xy.AxisRendererX.new(root, {})
        }));


        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        var legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50
        }));


        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function makeSeries(name, fieldName) {
            var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: name,
                stacked: true,
                xAxis: xAxis,
                yAxis: yAxis,
                baseAxis: yAxis,
                valueXField: fieldName,
                categoryYField: "port"
            }));

            series.columns.template.setAll({
                tooltipText: "{name}, {categoryY}: {valueX}",
                tooltipY: am5.percent(90)
            });
            series.data.setAll(data);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();

            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    sprite: am5.Label.new(root, {
                        text: "{valueX}",
                        fill: root.interfaceColors.get("alternativeText"),
                        centerY: am5.p50,
                        centerX: am5.p50,
                        populateText: true
                    })
                });
            });

            legend.data.push(series);
        }

        let series = [];
        if (data.length > 0) {
            series = getObjectPropertyKeys(data[0])
        }

        for (let i = 0; i < series.length; i++) {
            if (series[i] != 'port')
                makeSeries(normlizeCamelcase(series[i]), series[i]);
        }

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);

    }); // end am5.ready()
}

function generateEgtnCorridorNodeDropdown(col, graphData) {
    col = col.filter(e => e.name !== 'Port' && e.name !== 'Overall Rank');
    let HTML = '';
    HTML += '<div class="col-2">'
    HTML += '   <label for= "Columns" > Selected Columns:</label >'
    HTML += '</div>'
    HTML += '<div class="col-6 dropdownarea">'
    HTML += '   <select name="Containers" id="selectedColGraph" class="Containers" multiple size="4">'
    for (var i = 0; i < col.length; i++) {
        if (col[i].data == ['Overall Rank']) {
            HTML += '   <option selected value="' + col[i].data + '">' + col[i].data + '</option>';
        }
        else {
            HTML += '   <option value="' + col[i].data + '">' + col[i].data + '</option>';
        }
    }
    HTML += '   </select>'
    HTML += '</div>'

    graphLen = [10, 15];
    HTML += '<div class="col-2 dropdownarea">'
    HTML += '   <select id="maxGraphSize" >'
    HTML += '   <option selected value="5"> Top 5 </option>';

    for (var i = 0; i < graphLen.length; i++) {
        HTML += '   <option value="' + graphLen[i] + '"> Top ' + graphLen[i] + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'


    HTML += '<div class="col-2"> <label id="filterGraphs" class="main-btn" style="display: block; text-align: center;" > Submit </label> </div>'


    //HTML +='<div class="col-2"> <label class="main-btn" onClick="RetrieveTrackTrace()"> Track now </label> </div>'
    $('.nodeTableDropdown').empty().append(HTML);
    $('#maxGraphSize').chosen({ search_contains: true });
    $('#selectedColGraph').chosen({ search_contains: true });
    $("#filterGraphs").click(function () {
        filterNodeCorridorGraphs(graphData);
    });
}

function filterNodeCorridorGraphs(dataToProcess) {
    let data = dataToProcess.slice();
    $('.Charts').hide();
    let columns = $('#selectedColGraph').val();
    let size = +$('#maxGraphSize').val();
    if (isNaN(size)) size = 5;
    let dataForGraph = []

    //nothing selected (overall)
    if (columns.length == 0 || (columns.length == 1 && columns[0] == 'Overall Rank')) {
        data = data.sort((a, b) => (parseFloat(a['Overall Rank']) < parseFloat(b['Overall Rank'])) ? 1 : -1)
            .slice(0, size);
        //remove overall rank from the data
        dataForGraph = convertNumericStringToNumber(camelizeKeys(data.map(function(item) {
            delete item["Overall Rank"];
            return item;
        })));

    } else {

        //remove unpicked properties (columns)
        for (let i = 0; i < data.length; i++) {

            //let res = Object.keys(data[i]).reduce(function(obj, k) {
            //        if (columns.some(x => x == k) || k == 'Port') obj[k] = data[i][k];
            //        return obj;
            //    },
            //    {});

            var res = data[i];

            dataForGraph.push(res);
        }

        //sort by needed col then slice
        dataForGraph = dataForGraph.sort(
            function(a, b) {
                let sumA = 0;
                sumB = 0;
                for (let j = 0; j < columns.length; j++) {
                    sumA += +a[columns[j]];
                    sumB += +b[columns[j]];
                }
                if (sumA > sumB) {
                    return -1;
                }
                return 1;
            }
        ).slice(0, size);

        //turn obj values to numbers
        dataForGraph = convertNumericStringToNumber(camelizeKeys(dataForGraph));

        //div info for grapgh container
        let graphs = {
            name: 'd-' + 'stackedBar',
            //displayName: 'stacked Bar',
            displayName: '',
            size: '12',
        }

        generateDynamicGrapghAreas([graphs], false)

        //generate new HTML area for grapgh
        let arrayGraphs = [(graphs['name'] + 'GraphArea')]
        ClearGraphsAreaAndGenerateNewArea(arrayGraphs);

        var newDataForGraph = [];

        var newCols = [];
        columns.forEach(elt => {
            newCols.push(toCamelCase(elt));
        });

        for (let i = 0; i < dataForGraph.length; i++) {

            let res = Object.keys(dataForGraph[i]).reduce(function(obj, k) {
                if (newCols.some(x => x == k) || k == 'port') obj[k] = dataForGraph[i][k];
                    return obj;
                },
                {});

            newDataForGraph.push(res);
        }

        var table = $('#Corridor-Node-Table').DataTable();
        var allCols = table.columns()[0];

        var orderingInfos = [];

        for (var l = 0; l < allCols.length; l++) {

            var colName = table.column(l).dataSrc();
            //console.log(colName);

            for (var m = 0; m < columns.length; m++) {
                if (columns[m] === colName) {
                    var or = [];
                    or.push(l);
                    or.push('desc');
                    orderingInfos.push(or);
                }
            }
        }
        table.order(orderingInfos).draw();

        table.page.len(size).draw();

        generateStackedBarChart(newDataForGraph, graphs['name'] + 'GraphArea');

        // set up proper height for the grapgh accourding to number of element
        let maxH = 750;
        if (newDataForGraph.length > 5) {
            maxH = 1000;
        }
        if (newDataForGraph.length > 10) {
            maxH = 1500;
        }
        document.getElementById("d-stackedBarGraphArea").style.minHeight = maxH + "px";

        $('.Charts').show();
    }
}

function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function generateEgtnCorridorNodeDatatable(resp) {
    let title = 'Corridor-Node-Table'
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.corrNodeTablearea').show();
    else
        $('.corrNodeTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    let col = getTableColFromObj(resp)

    generateEgtnCorridorNodeDropdown(col, resp)
    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: col,
        dom: 'lBfrtip',
        buttons: getTableButtons(title,false)
    });
    setDatatableColumnSearch(title, table, 'EGTN-Corr', true, false);

}

//#endregion

//#region EGNT CO2 emissions

function loadEgtnCO2emissions() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'CO2emissions' },
        success: function (resp) {

            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    getEgtnCO2emissionsTableData();
}

function getEgtnCO2emissionsTableData() {

    //request the data from API/service
    let data = [];

    for (let i = 0; i < 5; i++) {
        data.push(
            {
                "Vehicle Description": 'Truck ' + (i + 1),
                "Period": ' Jan 1-20',
                "Total Distance travelled": '180km',
                "No of Orders delivered": 240 * (i + 1),
                "CO2": 130 * (i + 1)
            }
        )
    }
    generateEgtnCO2emissionsDatatable(data);

}

function generateEgtnCO2emissionsDatatable(resp) {

    let title = 'CO2-emissions-corridor-Table'
    let tableId = '#' + title;


    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.CO2_emissionsTablearea').show();
    else
        $('.CO2_emissionsTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        fCorridor - Table
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        columns: [
            { "title": 'Vehicle Description', "data": "Vehicle Description" },
            { "title": 'Period', "data": "Period" },
            { "title": 'Total Distance travelled', "data": "Total Distance travelled" },
            { "title": 'No of Orders delivered', "data": "No of Orders delivered" },
            { "title": 'CO2', "data": "CO2" }
        ],
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });

    setDatatableColumnSearch(title, table, 'CO2-emissions')
}

//#endregion

//#region  blockchain

function loadBlockchain() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'EgtnBlockchain' },
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    getEgtnBcAISCTableData();
}

function getEgtnBcAISCTableData() {

    generateEgtnBcAISCDatatable();

    generateBcKPIDatatable();
}

function generateBcKPIDatatable() {

    var data = [
        {
            "KPI 9": 'Smart Contracts',
            "Baseline": '£150',
            "Cost of Paper": '-30%'
        }
    ];

    let title = 'BcKPITable';
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (data.length > 0)
        $('.BcAISCTablearea').show();
    else
        $('.BcAISCTablearea').hide();

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

    setDatatableColumnSearch(title, table, 'EGTN-BC')
}

function generateEgtnBcAISCDatatable() {
    var data = RetrieveMongoCollectionData('Contracts', 'agreements');

    let title = 'BcAISCTable';
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (data.length > 0)
        $('.BcAISCTablearea').show();
    else
        $('.BcAISCTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    var cols = getTableColFromObj(data);

    cols = cols.filter(c => c.name.toLowerCase() !== '_id');

    //datatable initialization
    var table = $(tableId).DataTable({
        data: data,
        'searching': true,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });

    setDatatableColumnSearch(title, table, 'EGTN-BC')
}

function getEgtnBcLogisticsTableData() {

    //request the data from API/service
    let data = [];

    //for (let i = 0; i < 3; i++) {
    //    data.push(
    //        {
    //            "timestamp": randomDate(new Date(2012, 0, 1), new Date()),
    //            "ShipmentID": 1300 * (i + 1),
    //            "Location": 'Madrid',
    //            "ContainerID": 400 * (i + 1),
    //            "EventDescription": 'Description ' + (i + 1),
    //            "TrustedEGTNEvent": 'option ' + (i + 1),
    //        }
    //    )
    //}

    data = RetrieveKafkaBcEvents();
    generateEgtnBcLogisticsDatatable(data);

    genereateEgtnBcLogKPIDatatable();
}

function RetrieveKafkaBcEvents() {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveKafkaBcEvents",
        success: function (resp) {
            data = resp;
        }, error: function (resp) {
            console.error(resp);
        }
    });

    return data;

}

function genereateEgtnBcLogKPIDatatable() {
    var data = [
        {
            "KPI 10": 'Logistic Events',
            "Baseline": '-18%',
            "Ratio of Disputes": '-10%'
        }
    ];

    let title = 'BcLogKPITable';
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (data.length > 0)
        $('.BcLogTablearea').show();
    else
        $('.BcLogTablearea').hide();

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

    setDatatableColumnSearch(title, table, 'EGTN-BC')
}

function generateEgtnBcLogisticsDatatable(resp) {

    let title = 'Logistics-Table';
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.BcLogTablearea').show();
    else
        $('.BcLogTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }

    //var cols = [
    //    { "name": 'Timestamp', "title": 'Timestamp', "data": "timestamp" },
    //    { "name": 'Shipment ID', "title": 'Shipment ID', "data": "ShipmentID" },
    //    { "name": 'Location', "title": 'Location', "data": "Location" },
    //    { "name": 'Container ID', "title": 'Container ID', "data": "ContainerID" },
    //    { "name": 'Event description', "title": 'Event description', "data": "EventDescription" },
    //    { "name": 'Trusted EGTN Event', "title": 'Trusted EGTN Event', "data": "TrustedEGTNEvent" },
    //];

    var cols = getTableColFromObj(resp);

    var eventTypes = [
        { name: "ContainerArrivalPort", color: "#d64e12", font: "white" },
        { name: "AgreementsConditionsViolation", color: "#f9a52c", font: "black" },
        { name: "EGTNContainerReadyForTransport", color: "#efdf48", font: "black" },
        { name: "EGTNContainerPickup", color: "#8bd346", font: "black" },
        { name: "ContainerReadyForTransport", color: "#16a4d8", font: "black" },
        { name: "ContainerPickup", color: "#9b5fe0", font: "white" },
        { name: "ContainerDeparted", color: "#ba1e68", font: "white" }
    ];

    for (var i = 0; i < resp.length; i++) {

        for (var j = 0; j < eventTypes.length; j++) {
            if (resp[i].event === eventTypes[j].name) {
                resp[i].event = '<span class="badge text-bg-primary" style="background-color: '+ eventTypes[j].color +';color: '+ eventTypes[j].font +'">'+ resp[i].event +'</span>'
            }
        }
    }

    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        'searching': true,
        columns: cols,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });

    setDatatableColumnSearch(title, table, 'EGTN-BC')

    $(tableId + ' tbody').on('click',
        'tr',
        function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $('#view_blockchain_doc_btn').addClass('isDisabled');
            } else {
                
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');

                var documentId = table.row(this).data().transport_Order_reference_number;
                $('#selected_doc_reference').val(documentId);
                $('#view_blockchain_doc_btn').removeClass('isDisabled');
            }
        });
}

function ViewBlockchainDocument() {
    var documentId = $('#selected_doc_reference').val();

    var docs = RetrieveBlockchainDocumentPerId(documentId);

    if (Array.isArray(docs) && docs.length > 0) {

        var documentDetails = docs[0];

        var html = '';

        html += '<div id="sub_modal_planet" class="modal">';
        html += '	<div class="modal-content custom-modal-content" style="width:85% !important;margin:10% !important">';
        html += '		<div class="modal-header">';
        html += '           <h4>View Blockchain Documents</h4>';
        html += '	        <span onclick="CloseSubModal()" class="close">&times;</span>';
        html += '       </div>';
        html += '       <div class="mainbodyborder">'
        html += '	        <div class="modalwidth90">'
        html += '		        <div class="modalbody_class">'
        html += '                   <div class="row">'
        html += '                       <div class="col-12" id="document_wrapper" style="min-height:10rem"></div>';
        html += '                       <div class="col-sm-12 modaladdediterror">'
        html += '                   </div>';
        html += '               </div>';
        html += '<hr/>'
        html += '               <div class="row">'
        html += '                   <div class="col-sm-12 modalbuttons main-buttons-with-icons">'
        html += '                       <button id="download_button" class="btn btn-outline-success btn-with-icon" type="button"><i class="marginicon fa-solid fa-download" style="margin-right:5px"></i>Download PDF</button>';
        html += '                       <button class="btn btn-outline-secondary btn-with-icon" onclick="CloseSubModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Close</button>';
        html += '                   </div>';
        html += '               </div>';
        html += '           </div>';
        html += '           <div class="width90">' /*end of width90 div*/
        html += '           <div>' /*end of mainbodyborder div*/
        html += '       </div>';
        html += '   </div>';
        html += '</div>';

        $('.homesubmodal').empty().append(html);
        $('#sub_modal_planet').show();

        $('#document_wrapper').jsonTable(documentDetails, {
            objectClass: 'table-striped table-bordered'
        });

        $('#download_button').on('click',
            function () {
                try {
                    //var doc = new jsPDF('l', 'pt');

                    //var elem = $('#document_wrapper>table')[0];

                    //var data = doc.autoTableHtmlToJson(elem);
                    //doc.autoTable(data.columns, data.rows, {
                    //    margin: { left: 35 },
                    //    theme: 'grid',
                    //    tableWidth: 'auto',
                    //    fontSize: 8,
                    //    overflow: 'linebreak',
                    //    didDrawCell: function (d) {
                    //        if (d.column.dataKey === 1 && d.cell.section === 'body') {
                    //            doc.autoTable({
                    //                theme: 'grid',
                    //                tableWidth: 'auto',
                    //                fontSize: 8,
                    //                overflow: 'linebreak'
                    //            });
                    //        }
                    //    },
                    //}
                    //);

                    //doc.save(documentId + ".pdf");
                    ShowSuccessMessage('Please consider setting the scale at 45% for the best rendering');
                    window.print();
                } catch (e) {
                    ShowErrorMessage("Ooooups! Something went wrong... Use Ctrl + P shortcut instead! Notice: Please set the scale at 45% for the best rendering");
                }

            });
    }

}

function CloseSubModal() {
    $('#sub_modal_planet').remove();
}

function RetrieveBlockchainDocumentPerId(documentId) {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveBlockchainDocument",
        data: { documentRefId: documentId },
        success: function (response) {
            var result = response;
            if (result.code === "SUCCESS") {
                if (result.content === "Could not find asset for shipment\n") {
                    ShowErrorMessage(response.content);
                } else {
                    data.push(JSON.parse(result.content));
                }
                
            } else {
                ShowErrorMessage(result.msg);
            }
        },
        error: function (error) {

        }
    });

    return data;
}

function getEgtnBcMetaDataTableData() {

    //request the data from API/service
    let data = [];

    for (let i = 0; i < 1; i++) {
        data.push(
            {
                "Delivery Place ": '',
                "Loading place": '',
                "Loading date": '',
                "Annexed documents": '',
                "Marks and numbers": '',
                "Packages type": '',
                "Packages amount": '',
                "Packing type": '',
                "Gross weight": '',
                "Volume (m3)": '',
                "Haulier name": '',
                "Haulier address": '',
                "Subsequent transporter name": '',
                "Subsequent transporter address": '',
                "Current possesor of cargo": '',
                "Cargo destination": '',
                "Place of pick - up": '',
                "Date of pick - up": '',
                "description of cargo": '',
                "Gross weight of cargo": '',
                "Type of packages": '',
                "Amount of packages": '',
                "Moment of pick - up": '',
                "Moment of delivery": '',
                "Vehicle ID": '',
                "Pick - up confirmation": '',
                "Delivery confirmation": '',
                "Document type": '',
                "Document hash": '',
                "eCMR document reference number": '',
            }
        )
    }
    generateEgtnBcMetaDataDatatable(data);


}

function generateEgtnBcMetaDataDatatable(resp) {

    let title = 'Blockchain-Metadata-Table';
    let tableId = '#' + title;

    //making the datatable area visible if we have data to show
    if (resp.length > 0)
        $('.BcMetadataTablearea').show();
    else
        $('.BcMetadataTablearea').hide();

    //if datatable aready exist destroy to create a new one(the dropdown changed)
    if ($.fn.DataTable.fnIsDataTable(tableId) == true) {
        $(tableId).DataTable().destroy();
        $(tableId).empty();
    }
    let col = getTableColFromObj(resp)
    //datatable initialization
    var table = $(tableId).DataTable({
        data: resp,
        'searching': true,
        columns: col,
        dom: 'lBfrtip',
        buttons: getTableButtons(title)
    });

    setDatatableColumnSearch(title, table, 'EGTN-BC', false);

}
//#endregion







