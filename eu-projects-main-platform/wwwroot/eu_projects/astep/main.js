
var userInfo = {};
var userSettings = {};
var mainContainer = 'main-platform-content';

$(function () {

    RenderSideMenuItems();

    loadUserInfo();
    AstepHomeView();
    handleCloseDropdown();
    $('.color-tiles').remove()
    $($('.settings-heading')[1]).hide()
    $('.settings-heading').text('SITE THEME')
    LightMode();
});

//#region for light or dark mode

function LightMode() {
    $('.main-panel').addClass('lightMode').removeClass('darkMode')
    //$('#5groutesmodal').addClass('lightMode').removeClass('darkMode')
    _graphTheme = 'light1'
    SideBarLightMode();
    ApplyLightStyles()

}

function DarkMode() {
    $('.main-panel').removeClass('lightMode').addClass('darkMode')
    //$('#5groutesmodal').removeClass('lightMode').addClass('darkMode')
    _graphTheme = 'dark2'
    SideBarDarkMode();
    ApplyDarkStyles();

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

function ApplyDarkStyles() {
    $('.container-scroller').addClass('black-bg');
}

function ApplyLightStyles() {
    $('.container-scroller').removeClass('black-bg');
}

//#end region

function loadUserInfo() {
    $.ajax({
        async: false,
        type: "POST",
        url: "/Astep/getUserToken",
        success: function (resp) {
            userInfo = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
}

function AstepHomeView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Astep/loadMenu",
        data: { menuName: 'Home' },
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    DisplayHomeContent();
}

function DisplayHomeContent() {
    var userId = $('#user_id').val();

    var allMenus = RetrieveUserMenus(userId);
    var menus = allMenus.filter(m => m.ParentMenuId === 0);
    var groupedMenus = GetMenuItems(allMenus);

    var html = '';
    for (var i = 0; i < menus.length; i++) {
        if (menus[i].MenuCode !== 'Astephomemenu') {

            var subMenus = groupedMenus.filter(m => m.menu_id === menus[i].MenuId);

            //ClickedOnMenuItem_New(this, AstepHomeView); ClearSubMenuState_New()
            //ClickedOnMenuItem_New(this, ShowMandrekas); ClearSubMenuState_New()
            //ClickedOnMenuItem_New(this, ShowArcellormittal); ClearSubMenuState_New()
            if (subMenus[0].subMenu.length >= 1) {
                debugger
                var event = (menus[i].MenuClickEvent.trim() === '') ? subMenus[0].subMenu[0].click_event : menus[i].MenuClickEvent;
                html += '<li onclick="' + event + '(); updateActiveMenu(\'Main Menu\', \'' + menus[i].MenuCode + '\',\'' + subMenus[0].subMenu[0].menu_code + '\')" >'
                html += '<div >'
                html += '<i class="' + menus[i].MenuIcon + ' mainMenuIcon"></i> <p ><b>' + menus[i].MenuName + '</b></p>'
                html += '</div>'
                html += '</li>'
            }
            else {
                debugger
                html += '<li onclick="' + menus[i].MenuClickEvent + '();" >'
                //html += '<li onclick="' + menus[i].MenuClickEvent + '(); updateActiveMenu(\'Main Menu\', \'' + menus[i].MenuCode + '\')" >'
                html += '<div >'
                html += '<i class="' + menus[i].MenuIcon + ' mainMenuIcon"></i> <p ><b>' + menus[i].MenuName + '</b></p>'
                html += '</div>'
                html += '</li>'
            }
        }
    }
    $('#home_menu_grid_card').empty().append(html);
}

function handleCloseDropdown() {
    window.onclick = function (event) {
        //if (!event.target.matches('.fa-solid.fa-gear.settings-icon')) {
        //if (!$(event.target).hasClass('settings-icon')) {
        //the click is outside the dropdown elemnt
        if ($(event.target).closest(".dropdown-grid").length <= 0) {
            var dropdowns = document.getElementsByClassName("gridDropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    //openDropdown.classList.remove('show');
                    gridDropdownToglle();
                }
            }
        }

        if ($(event.target).closest(".dropdown-alert").length <= 0) {
            var dropdowns = document.getElementsByClassName("alertDropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
}

function loadMandrekasCategory1() {
    view = 'tables'
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Astep/MandrekasCategory1",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML);
    $('.experimentresults_data_area').hide();
    $('.experiment_graph').hide();
    $("#ucdesc_id").chosen({ search_contains: true });
    GenerateUCDropdown(false);
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');

    if ($("#ucdesc_id").val() != '' || $("#ucdesc_id").val() != null) {
        UC_Description_OnChange();
    }
}
function loadArcellorCategory1() {
    view = 'tables'
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Astep/ArcellorCategory1",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML)
    $("#ucdesc_id").chosen({ search_contains: true });
    UC_HideEditButton();
    UC_HideSaveCancelButtons()
    GenerateUCDropdown(false);
    HideKPITables();
    UCAndScenarioFocusedAfterTabChange(uidc, scenarioid)
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');

    if ($("#ucdesc_id").val() != '' || $("#ucdesc_id").val() != null) {
        UC_Description_OnChange();
    }
}
function returnExportTitle(title) {
    return `${title} - ${new Date().toDateString()}`
}
function getTableButtons(title, advancedSearch = true) {
    //debugger;
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
        },

    ]
    return btns;
}
async function setDatatableColumnSearch(tableId, table, pageName, resizeCol = true, advancedSearch = true, colVisibility = false) {
    //debugger;

    //$('#experiment').hide();
    if (tableId != '') {
        if (tableId[0] == '#') {
            tableId = tableId.substring(1);
        }

        if (colVisibility) {
            //TODO: take page name from function header
            let res = await preHideColumns(table, pageName, tableId)
        }

        //check if the request from colVisibility method -> remove old search header (the next part will add the new header)
        if (!colVisibility) {
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
        // debugger;
        // add search header
        let tableNH = $(`#${tableId} thead tr`).clone(false).appendTo(`#${tableId} thead`);
        if (tableNH.length > 0) {
            // debugger;
            $(`#${tableId} thead tr.searchHeader`).remove();
        }
        tableNH.attr('class', 'searchHeader');


        $(`#${tableId} thead tr:eq(1) th`).each(function (i) {
            $(this).attr('style', 'background-color: white !important; padding:0');
            var title = $(this).text();

            $(this).html(
                '<input type="text" class="form-control cst-search" style="border:1px solid #517ea1;" placeholder="Search ' + title + '" />'
            );

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
        if (!colVisibility) {
            $(`#${tableId} thead tr:eq(0) th`).each(function (i) {

                var title = $(this).text();
                if (title != 'Date/Time' && title.toLowerCase() != 'timestamp') {

                    $(this).append(
                        ' <input type="checkbox" class="form-check-input" value=' + i + ' id="' + title + '"  name="chkResultHdr" style="margin-left:10px;"/>'
                    );
                }
            });
        }
        // after checked checkbox for each column
        $('input[name=chkResultHdr]').on('click', function () {
            testResultHeaderAvg(table, null);

        });
        // colvis header function
        $(`#${tableId}`).on('column-visibility.dt', function (e, settings, index, state) {
            //debugger;
            testResultHeaderAvg(table, index);
            $('#testresult_route_map').show();
        });
        // add event listener for columns display change
        if (!colVisibility) {
            $(`#${tableId}`).on('column-visibility.dt', function (e, settings, column, state) {
                //TODO: Check if advnaced should be true or false
                setDatatableColumnSearch(tableId, table, pageName, resizeCol, advancedSearch, true)
                let inv = get_invisible_columns(table)
                handleColUpdate(pageName, tableId, inv)
            });
        }

        //if (advancedSearch) {
        //    var columns = table.settings().init().columns;
        //    setUpAdvancedSearchArea(tableId, columns, 'EGTN-node')

        //    $('#applySearch' + tableId).click(function () {
        //        setupAdvancedSearchObject(tableId)
        //        table.draw();
        //        currentTableSearch = '';
        //    })
        //}


    }
}
function testResultHeaderAvg(table, index) {
    let checkIsCheckedCols = false;
    $('input[name=chkResultHdr]').each(function () {
        //debugger
        if ($(this).is(':checked')) {
            checkIsCheckedCols = true;
        }
    });
    let searchIsExist = false;
    $('input[type="text"].cst-search').each(function () {
        //debugger
        if ($(this).val() != null)
            searchIsExist = true;
    });

    $('.ColumnTestResult-bottomContainer-main').empty();
    let TestResultSelectedHeader = [];
    let mapPolylineValues = [];
    let CheckedTableColumns = [];
    var newData = [];
    let polyCount = 0;


    //if any column checked then call function else avoid
    if (checkIsCheckedCols) {
        $('input[name=chkResultHdr]').each(function (e) {
            let colName = $(this).attr('id');

            if (index == parseInt($(this).val())) {
                $(this).prop('checked', false);
            }
            else {
                if ($(this).is(':checked')) {
                    //debugger;
                    let data = null; let Dates = null;
                    if (index == 'Filter' && searchIsExist) {
                        //Dates = verifyanddGetStampdateCols($('#experimentresultsevaluation_table').DataTable().rows({ page: 'current' }).data());
                        Dates = verifyanddGetStampdateCols($('#experimentresultsevaluation_table').DataTable().column(0, { page: 'current' }).data());
                        data = $('#experimentresultsevaluation_table').DataTable().column($(this).val(), { page: 'current' }).data();
                    }
                    else {
                        Dates = verifyanddGetStampdateCols($('#experimentresultsevaluation_table').DataTable().column(0).data());
                        data = $('#experimentresultsevaluation_table').DataTable().column($(this).val()).data();
                    }

                    // reading values based on header name
                    if (colName == 'LAT' || colName == 'LATITUDE' || colName == 'LON' || colName == 'LONGITUDE') {
                        $('#LON, #LONGITUDE').prop('checked', true);
                        $('#LAT, #LATITUDE').prop('checked', true);

                        if (polyCount == 0) {
                            var rows = $('#experimentresultsevaluation_table').DataTable().rows({ page: 'current' }).data();
                            //debugger;
                            for (var i = 0; i < rows.length; i++) {

                                if (rows[i].lat >= -90 && rows[i].lat <= 90 && rows[i].lon >= -180 && rows[i].lon <= 180 || rows[i].Latitude >= -90 && rows[i].Latitude <= 90 && rows[i].Longitude >= -180 && rows[i].Longitude <= 180) {

                                    if (colName == 'LAT' || colName == 'LON') {
                                        mapPolylineValues.push({
                                            lat: rows[i].lat,
                                            lng: rows[i].lon,
                                        });
                                    }
                                    else if (colName == 'LATITUDE' || colName == 'LONGITUDE') {
                                        mapPolylineValues.push({
                                            lat: rows[i].Latitude,
                                            lng: rows[i].Longitude,
                                        });
                                    }
                                }
                            }
                            polyCount++;
                        }
                    }
                    else {

                        var dataPoint = []; let lng = []; let lat = [];
                        // reading checked column values and column name dyanamically
                        for (var i = 0; i < data.length; i++) {
                            //debugger;
                            var tblCell = parseFloat(data[i]);
                            dataPoint.push({ "label": Dates[i], "y": tblCell });
                            //}
                        }
                          debugger;
                        if (dataPoint.length > 0) {
                            debugger
                            newData.push({
                                type: "spline",
                                showInLegend: true,
                                // yValueFormatString: "#0.0##################",
                                name: colName,
                                dataPoints: dataPoint
                            });
                        }
                        //colleting selected columns names
                        CheckedTableColumns.push(colName.toLowerCase());

                        var min = data.reduce(function (a, b) { return Math.min(a, b); });

                        var max = data.reduce(function (a, b) { return Math.max(a, b); });

                        var mediam = median(data);

                        // Calculate the mean (avg)
                        const mean = data.reduce((acc, curr) => acc + curr, 0) / data.length;

                        // Subtract the mean, square the result, and calculate the sum
                        //debugger;
                        const squaredDiffsSum = data.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);

                        // Calculate the variance
                        const variance = squaredDiffsSum / (data.length - 1);

                        const STD = Math.sqrt(variance);

                        //
                        var n = data.length;

                        const sem = STD / Math.sqrt(n);

                        const marginOfError = 1.96 * (STD / Math.sqrt(data.length));
                        const ciLower = mean - marginOfError;

                        const ciUpper = mean + 1.96 * STD / Math.sqrt(data.length);

                        const percentile = 0.111215; //data => quantile(data, .95);

                        TestResultSelectedHeader.push({
                            colName: colName,
                            // LAT:LAT,
                            min: min,
                            max: max,
                            mediam: mediam,
                            mean: mean.toFixed(2),
                            STD: STD.toFixed(2),
                            ciLower: ciLower.toFixed(2),
                            ciUpper: ciUpper.toFixed(2),
                            percentile: percentile,
                            sem: sem


                        });
                    }
                }
            }
        });
    }


    /* Polyline function called */
    //initMap1(mapPolylineValues);
    //$('#map1').show();
    $('.cst-map2').hide();
    /* Polyline function end */

    if (TestResultSelectedHeader.length > 0) {
        TestResult_SelectedAvg(TestResultSelectedHeader);
    }
    // line chart
    if (newData.length > 0) {
        TestResultCanvasJS_Chart1(newData);
    }
    else {
        //debugger;
        var datachartPoints = [];
        let Dates = table.column(0).data();
        if (Dates != null && Dates.length > 0) {
            for (var i = 0; i < Dates.length; i++) {
                datachartPoints.push({ "label": Dates[i].split(' ')[2], "y": null });
            }
        }
        if (datachartPoints.length > 0) {
            TestResultCanvasJS_Chart(datachartPoints);
        }
    }
}
function median(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
};

function updateTableSettings(setting) {
    let id = getUserId()

    $.ajax({
        async: true,
        type: "PSOT",
        url: `/_5groutes/UpdateUserTableSettings`,
        data: { id: id, setting: setting },
        success: function (resp) {

            userSettings = resp
        }, error: function (error) {
            //debugger
            console.log(error)
        }
    });
}
function handleColUpdate(page, table, invisible) {
    //debugger;
    let setting = {
        pageName: page,
        tables: {
            tableId: table,
            hiddenColumns: invisible //['','','']
        }
    }
    //updateTableSettings(setting);
}

function get_invisible_columns(table) {
    //console.log(table);
    var all_columns = table.settings().init().columns;
    console.log('all_columns', all_columns);
    var invisible_columns = [];
    for (var i in all_columns) {
        if (!table.column(all_columns[i].name + ':name').visible()) {
            invisible_columns.push(all_columns[i].name);
        }
    }

    return invisible_columns;
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

function getTableButtons(title, advancedSearch = true) {
    //debugger;
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
        },

    ]
    return btns;
}

function preHideColumns(table, pageName, tableId) {
    //   debugger;
    //return new Promise(function (resolve, reject) {
    let colToHide = [];

    if (!userSettings.pages) {
        return
    }

    let index = userSettings.pages.findIndex(x => x.name == pageName);
    if (index > -1) {
        let index2 = userSettings.pages[index].tables.findIndex(x => x.tableId == tableId);
        if (index2 > -1) {
            colToHide = userSettings.pages[index].tables[index2].hiddenColumns;
        }
    }
    //await hideColumns(table, colToHide);

    return new Promise(function (resolve, reject) {
        try {
            for (let i = 0; i < colToHide.length; i++) {
                let index = table.column(`${colToHide[i]}:name`).index();
                table.column(index).visible(!table.column(index).visible());;
            }
            resolve(true);
        }
        catch (ex) {
            reject(false)
        }
    })
    //}
}

function hideColumns(table, columns) {
    // debugger;
    return new Promise(function (resolve, reject) {
        try {
            for (let i = 0; i < columns.length; i++) {
                let index = table.column(`${columns[i]}:name`).index();
                table.column(index).visible(!table.column(index).visible());;
            }
            resolve(true);
        }
        catch (ex) {
            reject(false)
        }
    })
}

//#endregion

//#region helper

function verifyanddGetStampdateCols(data) {
    //debugger;
    var dates = [];
    for (var i = 0; i < data.length > 0; i++) {
        dates.push(data[i].split(' ')[2]);
    }
    return dates;
}
// MIN, MAX, AVG, STD, MEDIAM
function TestResult_SelectedAvg(data) {
    //debugger;
    var html = "";
    for (var i = 0; i < data.length; i++) {

        html += '<div class="trackDetail-bottomContainer row" style="margin-bottom:5px;margin-top:5px">';
        html += '<div>';
        html += '<div class="container-date" style="display:block;">';
        html += '<b>' + data[i].colName + '</b><br/><br/>';
        html += '</div>'
        html += '</div>'
        html += '<div style="display:flex;">'


        html += '<div class="top-bot-info">'
        html += '<p>AVG</p>'
        html += '<span>' + data[i].mean + '</span>'
        html += '</div>'
        html += '<div class="top-bot-info">'
        html += '<p>MIN</p>'
        html += '<span>' + data[i].min + '</span>'
        html += '</div>'

        html += '<div class="top-bot-info">'
        html += '<p>MAX</p>'
        html += '<span>' + data[i].max + '</span>'
        html += '</div>'
        html += '<div class="top-bot-info">'
        html += '<p>STD</p>'
        html += '<span>' + data[i].STD + '</span>'
        html += '</div>'

        html += '<div class="top-bot-info">'
        html += '<p>95% CI Upper bound</p>'
        html += '<span>' + data[i].ciUpper + '</span>'
        html += '</div>'
        html += '<div class="top-bot-info">'
        html += '<p>95% CI Lower bound</p>'
        html += '<span>' + data[i].ciLower + '</span>'
        html += '</div>'

        html += '<div class="top-bot-info">'
        html += '<p>Median</p>'
        html += '<span>' + data[i].mediam + '</span>'
        html += '</div>'

        //html += '<div class="top-bot-info">'
        //html += '<p>95% PERCENTILE</p>'
        //html += '<span>' + data[i].percentile + '</span>'

        //html += '</div>'

        html += '</div>'
        html += '</div>';
    }
    $('.ColumnTestResult-bottomContainer-main').empty().append(html);
}

// testresult canvasJS
function TestResultCanvasJS_Chart1(data) {
    // debugger;
    var chart = {};

    var NamedData = { values: data };
    $('.line_charts_cst').show();

    chart = new CanvasJS.Chart('scenario_line_chart', GetTestresultGraphConfig(NamedData));
    chart.render();
}
function TestResultCanvasJS_Chart(data) {
    // debugger;
    var chart = {};

    var precipitationData = ExtractTestResultDataPerHostType(data);
    var NamedData = {

        values: precipitationData
    };
    //  $('#line_charts').addClass('experimentresults_data_area');
    $('.line_charts_cst').show();
    // debugger;
    chart = new CanvasJS.Chart('scenario_line_chart', GetTestresultGraphConfig(NamedData));
    chart.render();
}
function ExtractTestResultDataPerHostType(testResultTableData) {
    /*debugger;*/
    var newData = [];

    if (testResultTableData.length > 0) {

        newData.push({
            type: "spline",
            dataPoints: testResultTableData
        });
    }

    return newData;
}



