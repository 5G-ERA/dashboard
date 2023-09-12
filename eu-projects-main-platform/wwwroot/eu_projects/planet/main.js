var baseApiUrl = 'https://localhost:7294';

var userInfo = {};
var userSettings = {};
var currentGridList = []
var currentTableSearch = '';
var mainContainer = 'main-platform-content';

$(function () {

    RenderSideMenuItems();

    loadUserInfo();
    //let scripts = getPlanetScripts();
    //let styles = getPlanetStyles();
    //let HTML = styles + scripts //+ '<div id="main-planet-content"> </div>'
    ////$('#main-platform-content').empty().append(HTML);
    //$('#main-panel').prepend(HTML);
    loadHomeMenu();
    handleCloseDropdown();
    loadDataTableCustomSearch();
    $('.color-tiles').remove()
    $($('.settings-heading')[1]).hide()
    $('.settings-heading').text('SITE THEME')
    LightMode();
    LoadPlanetUserAlerts();
});

function LoadPlanetUserAlerts() {
    var userId = $('#user_id').val();
    var alerts = RetrieveDssLastMilesAlerts(userId);
    var otherAlerts = RetrieveTrackAndTraceAlerts(userId);

    setAlertDropdown();
    
    for (var i = 0; i < alerts.length; i++) {

        if (alerts[i].isNew) {
            var recordData = JSON.parse(alerts[i].alertMessage);
            var thresholdData = JSON.parse(alerts[i].alertDataObject);

            var date = new Date(recordData.vrp_ETA_time);
            var newFormatedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            var alertContent = [
                'Task ID: <b>' + recordData['Task ID'] + '</b>',
                'Maximum ' + thresholdData.AlertThresholdType + ' value: ' + thresholdData.MaxValue,
                'Minimum ' + thresholdData.AlertThresholdType + ' value: ' + thresholdData.MinValue,
                'Current ' + thresholdData.AlertThresholdType + ' value: <b>' + recordData.ETA2 + '</b>',
                'Date: ' + date.toDateString(),
                '<button class="btn btn-light" onclick="OpenDssLastMile(\'' + newFormatedDate + '\', \'' + recordData['Task ID'] + '\', \'' + alerts[i].userAlertId + '\')" style="font-weight: 700;margin-top: 5% !important; margin-left:50%;padding: 4% !important;border-radius: 20px;background: white;border - color: white!important;color: #507800!important;"> View Details </button>'
            ];
            ShowToastAlertMessage(alerts[i].alertTitle, alertContent, 30000, 2);
            
        }
        
    }

    for (var i = 0; i < otherAlerts.length; i++) {

        if (alerts[i].isNew) {
            var recordData = JSON.parse(otherAlerts[i].alertMessage);
            var thresholdData = JSON.parse(otherAlerts[i].alertDataObject);

            var currentValue = GetTrackAndTraceAlertTargetValue(thresholdData.AlertThresholdType, recordData);

            var alertContent = [
                'UID: <b style="font-size:10px">' + recordData['UID'] + '</b>',
                'Maximum ' + thresholdData.AlertThresholdType + ' value: ' + thresholdData.MaxValue,
                'Minimum ' + thresholdData.AlertThresholdType + ' value: ' + thresholdData.MinValue,
                'Current ' + thresholdData.AlertThresholdType + ' value: <b>' + currentValue + '</b>',
                //'Date: ' + date.toDateString(),
                //'<button class="btn btn-light" onclick="OpenDssLastMile(\'' + newFormatedDate + '\', \'' + recordData['Task ID'] + '\', \'' + alerts[i].userAlertId + '\')" style="font-weight: 700;margin-top: 5% !important; margin-left:50%;padding: 4% !important;border-radius: 20px;background: white;border - color: white!important;color: #507800!important;"> View Details </button>'
            ];

            if (i == 0 || i == 1) {
                //ShowToastAlertMessage(otherAlerts[i].alertTitle, alertContent, 50000, 3, '#9ab33d', 'bottom-left');
                $.toast({
                    heading: otherAlerts[i].alertTitle,
                    text: alertContent,
                    showHideTransition: 'slide',
                    bgColor: '#9ab33d',
                    position: 'bottom-right',
                    loaderBg: 'rgb(80 120 0)',
                    hideAfter: 50000
                })
            }
        }

    }
}

function GetTrackAndTraceAlertTargetValue(type, obj) {
    var value;
    if (type.toLowerCase() === 'battery') {
        value = obj.Battery
    }

    if (type.toLowerCase() === 'luminance') {
        value = obj.Luminance
    }

    if (type.toLowerCase() === 'temperature') {
        value = obj.Temperature
    }

    if (type.toLowerCase() === 'humidity') {
        value = obj.Humidity
    }

    if (type.toLowerCase() === 'accelerometerx') {
        value = obj.AccelerometerX
    }

    if (type.toLowerCase() === 'accelerometery') {
        value = obj.AccelerometerY
    }

    if (type.toLowerCase() === 'accelerometerz') {
        value = obj.AccelerometerZ
    }
    
    return value
}

function RetrieveDssLastMilesAlerts(userId) {
    var data;
    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: `/Planet/LoadDssTableUserAlerts`,
        data: { userId: userId },
        success: function (resp) {
            data = resp;
        }, error: function (error) {
            console.log(resp)
        }
    });

    return data;
}

function RetrieveTrackAndTraceAlerts(userId) {
    var data;
    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: `/Planet/LoadTrackAndTraceUserAlerts`,
        data: { userId: userId },
        success: function (resp) {
            data = resp;
        }, error: function (error) {
            console.log(resp)
        }
    });

    return data;
}

function MarkAlertAsRead(alertId) {
    var data;
    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: `/Planet/SetAlertAsRead`,
        data: { alertId: alertId },
        success: function (resp) {
            data = resp;
        }, error: function (error) {
            console.log(resp)
        }
    });
    updateAlertList();
}

function OnMarkAllAlertsAsRead() {
    var userId = parseInt($('#user_id').val());
    swal({
        title: "Are you sure?",
        text: "All Active alerts will be marked as read and will not notify you aain...",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                async: false,
                type: "GET",
                dataType: "json",
                url: `/Planet/SetAllAlertAsRead`,
                data: { userId: userId },
                success: function (resp) {
                    data = resp;
                    ShowSuccessMessage("Operation completed successfully!");
                    updateAlertList();
                    GenerateUserAlertsTable();
                }, error: function (error) {
                    console.log(resp)
                }
            });
        }

    });
    
}

function OpenDssLastMile(date, recordId, alertId) {
    //alert("date: " + date + "and Record: " + recordId);
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

    //Load default dss last mile

    getPIDatatablePerDate(date);

    var table = $('#DSS_lastmile_t1').DataTable();
    table.rows().eq(0).each(function (index) {
        var row = table.row(index);

        var data = row.data();
        var taskId = data['Task ID'];

        if (taskId === recordId) {
            /*alert("One Matching Value");*/
            $(row.node()).addClass('selected');
        }
        else {
            $(row.node()).removeClass('selected');
        }
    });

    var tableId = '#DSS_lastmile_t1';
    var url = window.location.origin + '/Home/Index';

    window.open(url + tableId, "_self");

    MarkAlertAsRead(alertId);
}

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


function loadUserInfo() {
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/getUserToken",
        success: function (resp) {
            userInfo = resp;
            //userInfo = { 'Id': '628f1eeafc59b78d0ca96243', 'username': 'user', 'role': 'admin' };
        }, error: function (resp) {
            console.error(resp)
        }
    });
}

function getPlanetScripts() {
    let scripts = ''
    let scriptsList = [
        '../lib/signalr/dist/browser/signalr.js',
        '../eu_projects/planet/js/EgtnLogistic.js',
        '../eu_projects/planet/js/EgtnInfra.js',
        '../eu_projects/planet/js/OtherPages.js',
        '../eu_projects/planet/js/ViewDocuments.js',
        '../eu_projects/planet/js/SignalR.js',
        '../eu_projects/planet/js/apiCalls.js',
        //@*xml to json*@ 
        '../lib/xmlToJSON/xml2json.min.js',
        //display json pretty 
        'https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js',
        //tomtom map
        'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.18.0/maps/maps-web.min.js',
        'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.18.0/services/services-web.min.js',

    ]
    for (let i = 0; i < scriptsList.length; i++) {
        scripts += `<script type="text/javascript" src="${scriptsList[i]}" asp-append-version="true"></script>`;
    }
    return scripts;
}

function getPlanetStyles() {
    let styles = ''
    let styleList = [
        'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.18.0/maps/maps.css',
    ]
    for (let i = 0; i < styleList.length; i++) {
        styles += ` <link rel="stylesheet" type="text/css" href="${styleList[i]}">`;
    }
    return styles;
}

function setAlertDropdown() {
    let HTML = ''
    HTML += '<li id="alertDD"class="nav-item nav-logout d-none d-md-block">'
    HTML += '<span class="dropdown-alert" onclick="alertDropdownToglle()">'
    HTML += '  <div class="dropdown-icon-container-icon-container position-relative" id="bell_notification_item"> <i id="alertsIcon" class="fa-solid fa-bell fa-lg alert-dropdown-icon"></i> </div>'

    HTML += '   <div id="alertDropdown" class="alertDropdown-content">'
    HTML += '   </div>'
    HTML += '</span>'
    HTML += '</li>'

    $('#top-nav-right').prepend(HTML)
    updateAlertList();
}

function loadHomeMenu() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadMenu",
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
        if (menus[i].MenuCode !== 'loadHomeMenu') {

            var subMenus = groupedMenus.filter(m => m.menu_id === menus[i].MenuId);

            if (subMenus[0].subMenu.length >= 1) {
                var event = (menus[i].MenuClickEvent.trim() === '') ? subMenus[0].subMenu[0].click_event : menus[i].MenuClickEvent;
                html += '<li onclick="' + event+ '(); updateActiveMenu(\'Main Menu\', \'' + menus[i].MenuCode + '\',\'' + subMenus[0].subMenu[0].menu_code+'\')" >'
                html += '<div >'
                html += '<i class="' + menus[i].MenuIcon + ' mainMenuIcon"></i> <p ><b>' + menus[i].MenuName + '</b></p>'
                html += '</div>'
                html += '</li>'
            }
            else {
                html += '<li onclick="' + menus[i].MenuClickEvent+ '(); updateActiveMenu(\'Main Menu\', \'' + menus[i].MenuCode + '\')" >'
                html += '<div >'
                html += '<i class="' + menus[i].MenuIcon + ' mainMenuIcon"></i> <p ><b>' + menus[i].MenuName + '</b></p>'
                html += '</div>'
                html += '</li>'
            }
        }
    }
    $('#home_menu_grid_card').empty().append(html);
}

async function updateAlertList() {

    let alertsList = await loadUserAlerts();
    let alertsList1 = await loadUserAlerts1();

    var activeAlertsLists = alertsList.filter(a => a.isNew === true);
    var activeAlertsLists1 = alertsList1.filter(a => a.isNew === true);

    var total = activeAlertsLists.length + activeAlertsLists1.length

    if (total>= 0) {

        if (total === 0) {
            var html = '<i id="alertsIcon" class="fa-solid fa-bell fa-lg alert-dropdown-icon"></i>';
            $('#bell_notification_item').empty().append(html);
        }
        else {
            var html = ' <div class="badge badge-info badge-pill" style="position: absolute;z-index: 2;border-color: #bd9225;background-color: #bd9225;left: 100%;top: 0;transform: translate(-80%,-50%)!important;font-size: 11px;">+' + total + '</div>';


            $('#bell_notification_item').append(html);
        }
    }


    let HTML = ''
    //for (let i = 0; i < alertsList.length; i++) {
    //    HTML += `        <a onClick='ShowAlertMessage( ${JSON.stringify(alertsList[i])} )'>`
    //    HTML += alertsList[i].isNew ? `<label class="task new-alert" id=alert-${alertsList[i].alertId}>` : `<label class="task" id=alert-${alertsList[i].alertId}>`
    //    HTML += `                    ${alertsList[i].title}`
    //    HTML += '           </label>'
    //    HTML += '       </a>'
    //}

    if (total === 0) {
        HTML += `        <a onClick='ShowEmptyAlertMessage()'>`
        HTML += `<label class="task">`
        HTML += `                    No Alerts yet!`
        HTML += '</label>'
        HTML += '</a>'
    }
    else {
        HTML += `        <a onClick='OpenAllUseAlertsView()'>`
        HTML += `<label class="task new-alert">`
        HTML += 'View All (' + total + ') ';
        HTML += '</label>';
        HTML += '</a>';
    }

    $('#alertDropdown').html(HTML)

    if (alertsList.some(x => x.isNew) || alertsList1.some(x => x.isNew)) {
        $('#alertsIcon').addClass("UnreadMsg")
    }
}

function ShowEmptyAlertMessage() {
    ShowSuccessMessage("Your alert box is currently empty");
}

function OpenAllUseAlertsView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'alerts' },
        success: function (resp) {

            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);

    GenerateUserAlertsTable();
}

function GenerateUserAlertsTable() {
    var userId = $('#user_id').val();
    var alerts = RetrieveDssLastMilesAlerts(userId);
    var otherAlerts = RetrieveTrackAndTraceAlerts(userId);

    var html = '';

    html += '<table id="alerts_table" class="table table-striped table-bordered" style="width:100%">';
    //html += '<caption style="caption-side:bottom">DSS Last Mile Alerts</caption>'
    html += '<thead>';
    html += '<tr>';
    html += '<th style="display:none">AlertUserId</th>'
    html += '<th>Record ID</th>';
    html += '<th>Type</th>';
    html += '<th>Table</th>';
    html += '<th style="text-align:center">Min Threshold</th>';
    html += '<th style="text-align:center">Current Value</th>';
    html += '<th style="text-align:center">Max Threshold</th>';
    html += '<th style="text-align:center">Date Recorded</th>';
    html += '<th style="text-align:center">Is New</th>';
    html += '<th style="text-align:center">Actions</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    if (alerts.length > 0) {
        for (var i = 0; i < alerts.length; i++) {

            var recordData = JSON.parse(alerts[i].alertMessage);
            var thresholdData = JSON.parse(alerts[i].alertDataObject);

            var date = new Date(recordData.vrp_ETA_time);
            var newFormatedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            html += '<tr>';
            html += '<td class="' + alerts[i].userAlertId + '" style="display:none">' + alerts[i].userAlertId + '</td>';
            html += '<td>' + recordData['Task ID'] + '</td>';
            html += '<td>' + thresholdData.AlertThresholdType + '</td>';
            html += '<td>' + thresholdData.AlertThresholdTable + '</td>';
            html += '<td style="text-align:center">' + thresholdData.MinValue + '</td>';
            html += '<td style="text-align:center">' + recordData.ETA2 + '</td>';
            html += '<td style="text-align:center">' + thresholdData.MaxValue + '</td>';
            html += '<td style="text-align:center">' + date.toDateString() + '</td>';

            var icon = (alerts[i].isNew) ? '<i class="fa-solid fa-circle" style="color:#198754; font-size:1.4em"></i>' : '<i class="fa-solid fa-circle" style="color:#a0a0a0; font-size:1.4em"></i>'
            
            html += '<td style="text-align:center">' + icon + '</td>';
            html += '<td style="text-align:center"><button class="btn btn-dark" onclick="OpenDssLastMile(\'' + newFormatedDate + '\', \'' + recordData['Task ID'] + '\', \'' + alerts[i].userAlertId +'\')">View Details</button></td>';
            html += '</tr>';
        }
    }

    if (otherAlerts.length > 0) {
        for (var i = 0; i < otherAlerts.length; i++) {

            var recordData = JSON.parse(otherAlerts[i].alertMessage);
            var thresholdData = JSON.parse(otherAlerts[i].alertDataObject);
            var currentValue = GetTrackAndTraceAlertTargetValue(thresholdData.AlertThresholdType, recordData);

            html += '<tr>';
            html += '<td class="' + otherAlerts[i].userAlertId + '" style="display:none">' + otherAlerts[i].userAlertId + '</td>';
            html += '<td>' + recordData['UID'] + '</td>';
            html += '<td>' + thresholdData.AlertThresholdType + '</td>';
            html += '<td>' + thresholdData.AlertThresholdTable + '</td>';
            html += '<td style="text-align:center">' + thresholdData.MinValue + '</td>';
            html += '<td style="text-align:center">' + currentValue + '</td>';
            html += '<td style="text-align:center">' + thresholdData.MaxValue + '</td>';
            html += '<td style="text-align:center">' + new Date(recordData['TimeStamp']).toDateString() +'</td>';

            var icon = (alerts[i].isNew) ? '<i class="fa-solid fa-circle" style="color:#198754; font-size:1.4em"></i>' : '<i class="fa-solid fa-circle" style="color:#a0a0a0; font-size:1.4em"></i>'

            html += '<td style="text-align:center">' + icon + '</td>';
            html += '<td style="text-align:center"><button class="btn btn-dark">View Details</button></td>';
            html += '</tr>';
        }
    }

    html += '</tbody>';
    html += '</table>';

    $('#alerts_table_container').empty().append(html);

    var table = $('#table_rules').DataTable({
        columnDefs: [
            {
                targets: [0],
                visible: false,
                searchable: false
            }
        ],
        lengthMenu: [20, 50, 75, 100],
    });
}

function addAlert(newAlert) {

    let HTML = ''
    HTML += `        <a onClick='ShowAlertMessage( ${JSON.stringify(newAlert)} )'>`
    HTML += `<label class="task" id=alert-${newAlert.alertId}>`
    HTML += `                    ${newAlert.title}`
    HTML += '           </label>'
    HTML += '       </a>'

    $('#alertDropdown').prepend(HTML)
    ShowAlertMessage(newAlert)

    //referenceId
}

function loadUserAlerts() {
    //let id = getUserId()
    //return [{
    //    name: 'test'
    //}];

    return new Promise(function (resolve, reject) {
        let id = getUserId()
        $.ajax({
            async: true,
            type: "GET",
            dataType: "json",
            url: `/Planet/LoadDssTableUserAlerts`,
            data: { userId: id },
            success: function (resp) {
                resolve(resp)
            }, error: function (error) {
                reject(resp)
            }
        });
    })
}

function loadUserAlerts1() {
    //let id = getUserId()
    //return [{
    //    name: 'test'
    //}];

    return new Promise(function (resolve, reject) {
        let id = getUserId()
        $.ajax({
            async: true,
            type: "GET",
            dataType: "json",
            url: `/Planet/LoadTrackAndTraceUserAlerts`,
            data: { userId: id },
            success: function (resp) {
                resolve(resp)
            }, error: function (error) {
                reject(resp)
            }
        });
    })
}

//#region to check and remove


function retrieveRouteNodeSelectionView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/retrieveRouteNodeSelectionView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);

    NodeCharts();
}

function retrieveForecastView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/retrieveForecastView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML)

    Forecastcharts();
}


//#region FORECAST
function Forecastcharts() {
    generateforecastGraph1()
    generateforecastGraph2()
    generateforecastGraph3();
}

function generateforecastGraph1() {
    am5.ready(function () {
        var root = am5.Root.new("forecastGraph1");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            maxTooltipDistance: 0
        }));
        var data1 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 8
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 7
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 7
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 11
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 6
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 5
        },
        ];

        var data2 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 4
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 4
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 4
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 6
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 7
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 1
        },
        ];
        var data3 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 8
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 9
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 10
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 7
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 8
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 5
        },
        ];
        var data4 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 8
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 7
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 8
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 10
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 5
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 5
        },
        ];
        var data5 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 5
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 6
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 8
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 4
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 6
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 10
        },
        ];
        var data6 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 2
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 1
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 2
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 3
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 4
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 3
        },
        ];
        var data7 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 3
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 2
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 3
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 6
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 7
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 4
        },
        ];
        var data8 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 12
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 11
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 14
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 17
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 19.2
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 2.4
        },
        ];
        var data9 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 6
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 9
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 6
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 8
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 7
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 7
        },
        ];
        var data10 = [{
            day: new Date(2021, 0, 1).getTime(),
            value: 10
        }, {
            day: new Date(2021, 0, 2).getTime(),
            value: 9
        },
        {
            day: new Date(2021, 0, 3).getTime(),
            value: 9
        },
        {
            day: new Date(2021, 0, 4).getTime(),
            value: 8
        },
        {
            day: new Date(2021, 0, 5).getTime(),
            value: 10
        },
        {
            day: new Date(2021, 0, 6).getTime(),
            value: 10
        },
        ];
        var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            maxDeviation: 0.2,
            baseInterval: {
                timeUnit: "day",
                count: 1
            },
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
        }));

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        var series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series.data.setAll(data1);
        series.appear();
        var series2 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 2",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series2.data.setAll(data2);
        series2.appear();
        var series3 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 3",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series3.data.setAll(data3);
        series3.appear();
        var series4 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 4",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series4.data.setAll(data4);
        series4.appear();
        var series5 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 5",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series5.data.setAll(data5);
        series5.appear();
        var series6 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 6",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series6.data.setAll(data6);
        series6.appear();
        var series7 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 7",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series7.data.setAll(data7);
        series7.appear();
        var series8 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 8",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series8.data.setAll(data8);

        series8.appear();
        var series9 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 9",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series9.data.setAll(data9);
        series9.appear();
        var series10 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Store 10",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "day",
            legendValueText: "{valueY}",
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal",
                labelText: "{valueY}"
            })
        }));
        series10.data.setAll(data10);
        series10.appear();
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none"
        }));
        cursor.lineY.set("visible", false);
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
        }));

        chart.set("scrollbarY", am5.Scrollbar.new(root, {
            orientation: "vertical"
        }));


        yAxis.axisHeader.children.push(am5.Label.new(root, {
            text: "Predicted Personnel needs- wk 34- all stores",
            fontWeight: "100",
            y: am5.p50,
        }));

        var legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, {
            width: 200,
            paddingLeft: 15,
            height: am5.percent(100)
        }));
        legend.itemContainers.template.events.on("pointerover", function (e) {
            var itemContainer = e.target;

            // As series list is data of a legend, dataContext is series
            var series = itemContainer.dataItem.dataContext;

            chart.series.each(function (chartSeries) {
                if (chartSeries != series) {
                    chartSeries.strokes.template.setAll({
                        strokeOpacity: 0.15,
                        stroke: am5.color(0x000000)
                    });
                } else {
                    chartSeries.strokes.template.setAll({
                        strokeWidth: 3
                    });
                }
            })
        })

        legend.itemContainers.template.events.on("pointerout", function (e) {
            var itemContainer = e.target;
            var series = itemContainer.dataItem.dataContext;

            chart.series.each(function (chartSeries) {
                chartSeries.strokes.template.setAll({
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    stroke: chartSeries.get("fill")
                });
            });
        })

        legend.itemContainers.template.set("width", am5.p100);
        legend.valueLabels.template.setAll({
            width: am5.p100,
            textAlign: "right"
        });

        legend.data.setAll(chart.series.values);

        chart.appear(1000, 100);

    });

}

function generateforecastGraph2() {
    am5.ready(function () {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("forecastGraph2");

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "none",
                wheelY: "none"
            })
        );

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
        xRenderer.labels.template.setAll({ text: "{realName}" });


        var xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                maxDeviation: 0,
                categoryField: "category",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{realName}"
                })
            })
        );

        var yAxis1 = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                height: am5.percent(70),
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        yAxis1.axisHeader.children.push(am5.Label.new(root, {
            text: "Receipts forecast- wk34- all stores",
            fontWeight: "500",
            y: am5.p50,
        }));

        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 0.3,
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        var yAxis2 = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 0.3,
                syncWithAxis: yAxis,
                renderer: am5xy.AxisRendererY.new(root, { opposite: true })
            })
        );

        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Series 1",
                xAxis: xAxis,
                yAxis: yAxis2,
                valueYField: "value",
                sequencedInterpolation: true,
                categoryXField: "category",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{provider} {realName}: {valueY}"
                })
            })
        );

        series.columns.template.setAll({
            fillOpacity: 0.9,
            strokeOpacity: 0
        });
        series.columns.template.adapters.add("fill", (fill, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", (stroke, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        //var lineSeries = chart.series.push(
        //	am5xy.LineSeries.new(root, {
        //		name: "Series 2",
        //		xAxis: xAxis,
        //		yAxis: yAxis,
        //		valueYField: "value",
        //		sequencedInterpolation: true,
        //		stroke: chart.get("colors").getIndex(13),
        //		fill: chart.get("colors").getIndex(13),
        //		categoryXField: "category",
        //		tooltip: am5.Tooltip.new(root, {
        //			labelText: "{valueY}"
        //		})
        //	})
        //);

        //lineSeries.strokes.template.set("strokeWidth", 2);

        //lineSeries.bullets.push(function () {
        //	return am5.Bullet.new(root, {
        //		locationY: 1,
        //		locationX: undefined,
        //		sprite: am5.Circle.new(root, {
        //			radius: 5,
        //			fill: lineSeries.get("fill")
        //		})
        //	});
        //});

        //// when data validated, adjust location of data item based on count
        //lineSeries.events.on("datavalidated", function () {
        //	am5.array.each(lineSeries.dataItems, function (dataItem) {
        //		// if count divides by two, location is 0 (on the grid)
        //		if (
        //			dataItem.dataContext.count / 2 ==
        //			Math.round(dataItem.dataContext.count / 2)
        //		) {
        //			dataItem.set("locationX", 0);
        //		}
        //		// otherwise location is 0.5 (middle)
        //		else {
        //			dataItem.set("locationX", 0.5);
        //		}
        //	});
        //});

        var chartData = [];

        // Set data
        var data = {
            "Store 1": {
                "Mon": 123,
                "Tue": 100,
                "Wed": 101,
                "Thur": 168,
                "Fri": 89,
                "Sat": 70,
            },
            "Store 2": {
                "Mon": 60,
                "Tue": 60,
                "Wed": 58,
                "Thur": 85,
                "Fri": 101,
                "Sat": 20,
            },
            "Store 3": {
                "Mon": 80,
                "Tue": 90,
                "Wed": 101,
                "Thur": 66,
                "Fri": 78,
                "Sat": 50,
            },
            "Store 4": {
                "Mon": 90,
                "Tue": 88,
                "Wed": 95,
                "Thur": 120,
                "Fri": 60,
                "Sat": 58,
            },
            "Store 5": {
                "Mon": 40,
                "Tue": 50,
                "Wed": 65,
                "Thur": 30,
                "Fri": 45,
                "Sat": 80,
            },
            "Store 6": {
                "Mon": 20,
                "Tue": 10,
                "Wed": 18,
                "Thur": 35,
                "Fri": 48,
                "Sat": 28,
            },
            "Store 7": {
                "Mon": 10,
                "Tue": 7,
                "Wed": 9,
                "Thur": 18,
                "Fri": 21,
                "Sat": 12,
            },
            "Store 8": {
                "Mon": 60,
                "Tue": 55,
                "Wed": 70,
                "Thur": 85,
                "Fri": 96,
                "Sat": 12,
            },
            "Store 9": {
                "Mon": 40,
                "Tue": 61,
                "Wed": 45,
                "Thur": 55,
                "Fri": 51,
                "Sat": 48,
            },
            "Store 10": {
                "Mon": 90,
                "Tue": 80,
                "Wed": 78,
                "Thur": 69,
                "Fri": 93,
                "Sat": 90,
            }

        };
        for (var providerName in data) {
            var providerData = data[providerName];


            var tempArray = [];
            var count = 0;
            for (var itemName in providerData) {
                if (itemName != "quantity") {
                    count++;
                    tempArray.push({
                        category: providerName + "_" + itemName,
                        realName: itemName,
                        value: providerData[itemName],
                        provider: providerName
                    });
                }
            }

            var lineSeriesDataIndex = Math.floor(count / 2);
            tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
            tempArray[lineSeriesDataIndex].count = count;
            am5.array.each(tempArray, function (item) {
                chartData.push(item);
            });

            var range = xAxis.makeDataItem({});
            xAxis.createAxisRange(range);

            range.set("category", tempArray[0].category);
            range.set("endCategory", tempArray[tempArray.length - 1].category);

            var label = range.get("label");

            label.setAll({
                text: tempArray[0].provider,
                dy: 30,
                fontWeight: "bold",
                tooltipText: tempArray[0].provider
            });

            var tick = range.get("tick");
            tick.setAll({ visible: true, strokeOpacity: 1, length: 50, location: 0 });

            var grid = range.get("grid");
            grid.setAll({ strokeOpacity: 1 });
        }
        var range = xAxis.makeDataItem({});
        xAxis.createAxisRange(range);
        range.set("category", chartData[chartData.length - 1].category);
        var tick = range.get("tick");
        tick.setAll({ visible: true, strokeOpacity: 1, length: 50, location: 1 });
        var grid = range.get("grid");
        grid.setAll({ strokeOpacity: 1, location: 1 });
        xAxis.data.setAll(chartData);
        series.data.setAll(chartData);
        series.appear(1000);
        chart.appear(1000, 100);
    });
}

function generateforecastGraph3() {
    am5.ready(function () {
        var root = am5.Root.new("forecastGraph3");
        root.setThemes([am5themes_Animated.new(root)]);
        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout
            })
        );

        var data = [
            {
                days: "Mon",
                Orders: 1350,
                Volume: 540
            },
            {
                days: "Tue",
                Orders: 1298,
                Volume: 259.6
            },
            {
                days: "Wed",
                Orders: 1344,
                Volume: 537.6
            },
            {
                days: "Thur",
                Orders: 1308,
                Volume: 784.8
            },
            {
                days: "Fri",
                Orders: 1322,
                Volume: 383.38,
                strokeSettings: {
                    stroke: chart.get("colors").getIndex(1),
                    strokeWidth: 3,
                    strokeDasharray: [5, 5]
                }
            },
        ];
        var xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "days",
                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
            })
        );
        xAxis.data.setAll(data);
        var yAxis1 = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                height: am5.percent(100),
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );
        yAxis1.axisHeader.children.push(am5.Label.new(root, {
            text: "SKU 1234567- orders forecast -wk 34",
            fontWeight: "500",
            y: am5.p50,
        }));
        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: 1250,
                extraMax: 0.1,
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );
        var series2 = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: "Volume",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Orders",
                categoryXField: "days",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "{name} in {categoryX}: {valueY} {info}"
                })
            })
        );
        series2.strokes.template.setAll({
            strokeWidth: 3,
            templateField: "strokeSettings"
        });
        series2.data.setAll(data);
        series2.bullets.push(function () {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    strokeWidth: 3,
                    stroke: series2.get("stroke"),
                    radius: 5,
                    fill: root.interfaceColors.get("background")
                })
            });
        });
        chart.set("cursor", am5xy.XYCursor.new(root, {}));
        var legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            })
        );
        legend.data.setAll(chart.series.values);
        chart.appear(1000, 100);
    });

}
//#endregion


//#region NODE
function NodeCharts() {
    NodeGraphWithDummyData1()
    NodeGraphWithDummyData2()
}

function NodeGraphWithDummyData1() {
    am5.ready(function () {
        var root = am5.Root.new("routeNodeGraph1");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout
        }));
        var legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50
        }));

        var data = [{
            "year": "Node1",
            "ambient": 7500,
            "frozen": 1500,
            "chilled": 2500,

        }, {
            "year": "Node2",
            "ambient": 7200,
            "frozen": 1200,
            "chilled": 2850,

        }, {
            "year": "Node3",
            "ambient": 4000,
            "frozen": 0,
            "chilled": 0,

        }, {
            "year": "Node4",
            "ambient": 7100,
            "frozen": 900,
            "chilled": 1010,

        },
        {
            "year": "Node5",
            "ambient": 6950,
            "frozen": 0,
            "chilled": 0,
        },
        {
            "year": "Node6",
            "ambient": 6000,
            "frozen": 0,
            "chilled": 0,

        },
        {
            "year": "Node7",
            "ambient": 7150,
            "frozen": 2800,
            "chilled": 3000,

        },
        {
            "year": "Node8",
            "ambient": 2500,
            "frozen": 3000,
            "chilled": 2500,

        },
        {
            "year": "Node9",
            "ambient": 3600,
            "frozen": 0,
            "chilled": 0,

        },
        {
            "year": "Node10",
            "ambient": 7500,
            "frozen": 4500,
            "chilled": 4000,
        },
        ];
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "year",
            renderer: am5xy.AxisRendererX.new(root, {
                cellStartLocation: 0.1,
                cellEndLocation: 0.9
            }),
            tooltip: am5.Tooltip.new(root, {})
        }));
        xAxis.data.setAll(data);

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));
        yAxis.axisHeader.children.push(am5.Label.new(root, {
            text: "Node storage capacity - wk34- cubic meter Ambient- Frozen - Chilled ",
            fontWeight: "500",
            y: am5.p50
        }));
        function makeSeries(name, fieldName, stacked) {
            var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                stacked: stacked,
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: fieldName,
                categoryXField: "year"
            }));
            series.columns.template.setAll({
                tooltipText: "{name}, {categoryX}:{valueY}",
                width: am5.percent(90),
                tooltipY: am5.percent(10)
            });
            series.data.setAll(data);
            series.appear();
            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    locationY: 0.5,
                    sprite: am5.Label.new(root, {
                        text: "{valueY}",
                        fill: root.interfaceColors.get("alternativeText"),
                        centerY: am5.percent(50),
                        centerX: am5.percent(50),
                        populateText: true
                    })
                });
            });
            legend.data.push(series);
        }
        makeSeries("Ambient", "ambient", false);
        makeSeries("Frozen", "frozen", true);
        makeSeries("Chilled", "chilled", true);
        chart.appear(1000, 100);
    });
}

function NodeGraphWithDummyData2() {
    am5.ready(function () {
        var root = am5.Root.new("routeNodeGraph2");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout
        }));
        var legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            })
        );
        var data = [{
            "year": "Terminal1",
            "Mon": 27,
            "Tue": 32,
            "Wed": 41,
            "Thur": 42,
            "Fri": 30,
            "Sat": 18,
            "Sun": 22
        }, {
            "year": "Terminal2",
            "Mon": 39,
            "Tue": 20,
            "Wed": 33,
            "Thur": 34,
            "Fri": 41,
            "Sat": 20,
            "Sun": 28
        }, {
            "year": "Terminal3",
            "Mon": 12,
            "Tue": 40,
            "Wed": 15,
            "Thur": 18,
            "Fri": 25,
            "Sat": 50,
            "Sun": 54
        }]
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "year",
            renderer: am5xy.AxisRendererX.new(root, {
                cellStartLocation: 0.1,
                cellEndLocation: 0.9
            }),
            tooltip: am5.Tooltip.new(root, {})
        }));
        xAxis.data.setAll(data);
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        yAxis.axisHeader.children.push(am5.Label.new(root, {
            text: "Unloading times (minutes)- Valencia port- wk34 ",
            fontWeight: "500",
            y: am5.p50
        }));
        function makeSeries(name, fieldName) {
            var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: fieldName,
                categoryXField: "year"
            }));
            series.columns.template.setAll({
                draggable: true,
                cursorOverStyle: "pointer",
                tooltipText: "{name}, {categoryX}:{valueY}",
                width: am5.percent(90),
                tooltipY: 0
            });
            series.data.setAll(data);
            series.appear();
            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    locationY: 0,
                    sprite: am5.Label.new(root, {
                        text: "{valueY}",
                        fill: root.interfaceColors.get("alternativeText"),
                        centerY: 0,
                        centerX: am5.p50,
                        populateText: true
                    })
                });
            });
            legend.data.push(series);
        }
        makeSeries("Mon", "Mon");
        makeSeries("Tue", "Tue");
        makeSeries("Wed", "Wed");
        makeSeries("Thur", "Thur");
        makeSeries("Fri", "Fri");
        makeSeries("Sat", "Sat");
        makeSeries("Sun", "Sun");
        chart.appear(1000, 100);

    });
}
//#endregion

//#endregion

//#region table helpers

//advanced search

function setUpAdvancedSearchArea(tableName, columns, pageName) {

    currentTableSearch = '';
    tableSearchData = [];

    let HTML = '';



    //left side
    HTML += '<div  class="advanced-search-rs">'
    // list of saves searches
    HTML += '<div class="field-info row">'

    HTML += '   <div class="col-3">'
    HTML += '       <label class="searchLabel" > Saved:</label>'
    HTML += '   </div>'

    HTML += '   <div class="col-6 dropdownarea" id="saved-searches-container-' + tableName + '" >'
    // should be from list of saves searches
    HTML += '               <select name="saved-searches-' + tableName + '" id="saved-searches-' + tableName + '" class="Containers selectDropdown" onchange="savedSearchSelected(this,\'' + pageName + '\',\'' + tableName + '\');" >'
    HTML += '                   <option selected value=""></option>'
    let oldSearh = getTableSavedSearch(pageName, tableName)
    for (let i = 0; i < oldSearh.length; i++) {
        HTML += '                   <option value="' + oldSearh[i].name + '">' + oldSearh[i].name + '</option>'
    }
    HTML += '               </select>'
    HTML += '    </div>'
    HTML += '   <div class="col-1" style="display:flex" onclick="deleteSearch(\'' + pageName + '\',\'' + tableName + '\')">'
    HTML += '       <i class="fa-solid fa-trash-can Asearch-icon"></i>'
    HTML += '   </div>'

    HTML += '   <div class="col-1" style="display:flex" onclick="saveSearch(\'' + pageName + '\',\'' + tableName + '\')">'
    HTML += '       <i class="fa-solid fa-floppy-disk Asearch-icon" ></i>'
    HTML += '   </div>'


    HTML += '</div>'


    // list of table fields
    HTML += ' <div class="field-info row">'

    HTML += '   <div class="col-3">'
    HTML += '      <label class="searchLabel" > Table fields:</label>'
    HTML += '   </div>'
    HTML += '           <div class="col-6 dropdownarea">'
    //should be list of datatable columns
    HTML += '               <select name="field-lists-opt-' + tableName + '" id="field-lists-opt-' + tableName + '" class="Containers selectDropdown" style="width:100%">'
    HTML += '                   <option selected value=""></option>'
    for (let i = 0; i < columns.length; i++) {
        let value = `${i},${camelize(columns[i].title)}`
        HTML += '                   <option value=' + value + '>' + columns[i].title + '</option>'
    }
    HTML += '               </select>'
    HTML += '            </div>'
    HTML += '   <div class="col-1" style="display:flex;">'
    //HTML += '       <label class="main-btn" onClick="addAdvancedSearchField(\'' + tableName + '\',\'' + pageName + '\')"> Add </label>'
    HTML += '       <i class="fa-solid fa-plus Asearch-icon" onClick="addAdvancedSearchField(\'' + tableName + '\',\'' + pageName + '\')"></i>'
    HTML += '   </div>'

    HTML += '   <div class="col-1" style="display:flex;" id="applySearch' + tableName + '">'
    HTML += '      <i class="fa-solid fa-magnifying-glass Asearch-icon"> </i> '

    HTML += '   </div>'

    HTML += '</div>'
    HTML += '</div>'


    //right side
    HTML += '<div class="fields-list"  id="filed-search-list-' + tableName + '">'
    HTML += '</div>'

    $('#advancedSearchContainer-' + tableName).html(HTML)


    $('#advancedSearchToggle-' + tableName).click(function () {
        $('#advancedSearchContainer-' + tableName).slideToggle(300);
    })
    //$('#min, #max').keyup(function () {
    //    table.draw();
    //});
}

function addAdvancedSearchField(tableName, pageName) {
    let val = $('#field-lists-opt-' + tableName).val();
    if (val == '') {
        return;
    }
    let index = val.split(',')[0]
    let fieldName = normlizeCamelcase(val.split(',')[1])


    let HTML = '';
    HTML += '<div class="field-info search-field-container row">'

    HTML += '   <div class="col-4" >'
    HTML += '            <label class="searchLabel" id="searchFieldName">' + fieldName + ':</label>'
    HTML += '   </div>'

    HTML += '   <div class="col-2 dropdownarea">'
    HTML += '           <select name="field-search-opt" id="DdVal" class="Containers selectDropdown bolderDropdown">'
    HTML += '                   <option selected value="equal"> = </option>'
    HTML += '                   <option value="more-than"> > </option>'
    HTML += '                   <option value="less-than"> < </option>'
    HTML += '           </select>'
    HTML += '   </div>'

    HTML += '   <div class="col-5">'
    HTML += '       <input type="text" id="InputVal" class="form-control searchInput" style="" placeholder="Value" />'
    HTML += '       <input type="hidden" id="fieldIndex" value="' + index + '" />'
    HTML += '   </div>'

    HTML += '   <div class="col-1" onclick="$(this).parent().remove()" style="display:flex;">'
    //HTML += '            <i class="fa-solid fa-trash-can Asearch-icon"></i>'
    HTML += '            <i class="fa-solid fa-circle-minus Asearch-icon"></i>'
    HTML += '   </div>'

    $('#filed-search-list-' + tableName).append(HTML)
    //$('#field-search-opt-' + fieldName).chosen({ search_contains: true })

}

function addHistorySearchField(tableName, pageName, fieldName, option, value, index) {
    let HTML = '';
    HTML += '<div class="field-info search-field-container row">'

    HTML += '   <div class="col-4" >'
    HTML += '            <label class="searchLabel" id="searchFieldName">' + fieldName + ':</label>'
    HTML += '   </div>'

    HTML += '   <div class="col-2 dropdownarea">'
    HTML += '           <select name="field-search-opt" id="DdVal" class="Containers selectDropdown bolderDropdown">'
    HTML += option == 'equal' ? '<option selected value="equal"> = </option>' : '<option value="equal"> = </option>';
    HTML += option == 'more-than' ? '<option selected value="more-than"> > </option>' : '<option value="more-than"> > </option>'
    HTML += option == 'less-than' ? '<option selected value="less-than"> < </option>' : '<option value="less-than"> < </option>'
    HTML += '           </select>'
    HTML += '   </div>'

    HTML += '   <div class="col-5">'
    HTML += '       <input type="text" id="InputVal" class="form-control searchInput" style="" placeholder="Value" value="' + value + '" />'
    HTML += '       <input type="hidden" id="fieldIndex" value="' + index + '" />'
    HTML += '   </div>'

    HTML += '   <div class="col-1" onclick="$(this).parent().remove()" style="display:flex;">'
    //HTML += '            <i class="fa-solid fa-trash-can Asearch-icon"></i>'
    HTML += '            <i class="fa-solid fa-circle-minus Asearch-icon"></i>'
    HTML += '   </div>'
    HTML += '   </div>'

    return HTML;
    //$('#field-search-opt-' + fieldName).chosen({ search_contains: true })

}

function saveSearch(pageName, tableName) {
    /*return*/
    let searchQuery = setupAdvancedSearchObject(tableName, true)
    if (searchQuery == null || searchQuery.length == 0) {
        return
    }

    swal({
        content: {
            element: "input",
            attributes: {
                placeholder: "Type your search name",
                type: "text",
            },
        },
    }).then(function (input) {

        if (input == null) {
            return
        }


        if (input == '') {
            ShowErrorMessage('Wrong input')
            return
        }

        let saveSearch = {
            name: input,
            searchParams: searchQuery
        }

        let setting = {
            pageName: pageName,
            tables: {
                tableId: tableName,
                savedSearches: [saveSearch]
            }

        }

        updateTableSavedSearches(setting).then(function (success) {
            if (success) {
                ShowSuccessMessage("Search saved successfully")
                updateSavesSearchList(pageName, tableName);
            }
            else {
                ShowErrorMessage('Something went wrong')
            }
        })

    });

}

function deleteSearch(pageName, tableName) {
    //id="saved-searches-' + tableName + '"
    //saved-searches-container-' + tableName
    let searchName = $('#saved-searches-' + tableName).val();

    if (searchName == null || searchName == '') {
        return;
    }

    swal({
        title: "Delete " + searchName + " ?",
        text: "You will not be able to recover deleted data!",
        icon: "warning",
        buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
        ],
        dangerMode: true,
    }).then(function (isConfirm) {
        if (isConfirm) {
            let obj = {
                pageName: pageName,
                tableId: tableName,
                searchName: searchName
            };
            deleteTableSavedSearch(obj).then(function (success) {
                if (success) {
                    ShowSuccessMessage("Search deleted successfully")
                    updateSavesSearchList(pageName, tableName);
                }
                else {
                    ShowErrorMessage('Something went wrong')
                }
            })
        }
    })


}

function updateSavesSearchList(pageName, tableName) {
    let HTML = '';

    //HTML += '   <div class="col-6 dropdownarea" id="saved-searches-container-' + tableName + '" >'
    HTML += '               <select name="saved-searches-' + tableName + '" id="saved-searches-' + tableName + '" class="Containers selectDropdown" onchange="savedSearchSelected(this,\'' + pageName + '\',\'' + tableName + '\');" >'
    HTML += '                   <option selected value=""></option>'
    let oldSearh = getTableSavedSearch(pageName, tableName)
    for (let i = 0; i < oldSearh.length; i++) {
        HTML += '                   <option value="' + oldSearh[i].name + '">' + oldSearh[i].name + '</option>'
    }
    HTML += '               </select>'
    //HTML += '    </div>'
    $('#saved-searches-container-' + tableName).html(HTML);
}

function savedSearchSelected(selected, pageName, tableName) {

    let name = selected.name;
    let value = selected.value;
    let index = selected.selectedIndex - 1;
    let searches = getSavedSearchParams(pageName, tableName, value)

    let HTML = '';
    // foreach field add
    for (let i = 0; i < searches.length; i++) {

        HTML += addHistorySearchField(tableName, pageName, searches[i].name, searches[i].type, searches[i].value, searches[i].index)
    }

    //addHistorySearchField()
    $('#filed-search-list-' + tableName).html(HTML)

}

tableSearchData = []
function setupAdvancedSearchObject(tableName, returnObj = false) {
    tableSearchData = {}

    let tableSearchDataTemp = []
    //if (!returnObj) {
    //    currentTableSearch = tableName;
    //}
    currentTableSearch = tableName;

    let fieldList = $('#filed-search-list-' + currentTableSearch).find('.search-field-container');
    for (let i = 0; i < fieldList.length; i++) {
        let id = fieldList[i].querySelector('#fieldIndex').value;
        let searchType = fieldList[i].querySelector('#DdVal').value;
        let searchValue = fieldList[i].querySelector('#InputVal').value;
        let fieldName = fieldList[i].querySelector('#searchFieldName').innerHTML.split(':')[0].trim();

        //if (!tableSearchDataTemp.hasOwnProperty(+id)){
        //    tableSearchDataTemp[+id] = [];
        //}
        tableSearchDataTemp.push({
            index: id,
            type: searchType,
            value: searchValue,
            name: fieldName
        })
    }

    if (returnObj) {
        return tableSearchDataTemp;
    }
    else {
        tableSearchData = tableSearchDataTemp
    }
}

function loadDataTableCustomSearch() {
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        
        if (currentTableSearch == '' || tableSearchData.length <= 0) {
            return true;
        }

        let groupedQueries = groupBy(tableSearchData, "index")
        if (groupedQueries == null) {
            return true;
        }
        for (const [key, value] of Object.entries(groupedQueries)) {
            let val = data[parseInt(key)] || null
            for (let i = 0; i < groupedQueries[key].length; i++) {
                let type = groupedQueries[key][i]['type']
                let valueCompare = groupedQueries[key][i]['value']

                if (!isNaN(valueCompare)) {
                    if (val.match(/\d+/) == null) {
                        return false
                    }
                    val = val.match(/\d+/)[0];
                }

                if (type == 'equal') {
                    if (val != valueCompare) {
                        return false;
                    }
                }

                if (!isNaN(val) && !isNaN(valueCompare)) {
                    if (type == 'more-than') {
                        if (parseFloat(val) <= parseFloat(valueCompare)) {
                            return false
                        }
                    }
                    if (type == 'less-than') {
                        if (parseFloat(val) >= parseFloat(valueCompare)) {
                            return false
                        }
                    }
                }

            }
        }

        return true

    });
}

function getTableSavedSearch(pageName, tableName) {

    if (!userSettings.pages) {
        return [];
    }
    let pageIndex = userSettings.pages.findIndex(x => x.name == pageName);
    if (pageIndex < 0) {
        return []
    }

    let tableIndex = userSettings.pages[pageIndex].tables.findIndex(x => x.tableId == tableName);
    if (tableIndex < 0) {
        return []
    }

    let tableSavedSearches = userSettings.pages[pageIndex].tables[tableIndex].savedSearches;
    return tableSavedSearches
}

function getSavedSearchParams(pageName, tableName, searchName) {
    if (!userSettings.pages) {
        return [];
    }

    let pageIndex = userSettings.pages.findIndex(x => x.name == pageName);
    if (pageIndex < 0) {
        return []
    }

    let tableIndex = userSettings.pages[pageIndex].tables.findIndex(x => x.tableId == tableName);
    if (tableIndex < 0) {
        return []
    }

    let searchIndex = userSettings.pages[pageIndex].tables[tableIndex].savedSearches.findIndex(x => x.name == searchName);
    if (searchIndex < 0) {
        return []
    }

    return userSettings.pages[pageIndex].tables[tableIndex].savedSearches[searchIndex].searchParams
}

//end of advanced search

let tableResizeOptions = {
    isEnabled: true,
    saveState: false,
    hoverClass: 'dt-colresizable-hover',
    hasBoundCheck: true,
    minBoundClass: 'dt-colresizable-bound-min',
    maxBoundClass: 'dt-colresizable-bound-max',
    isResizable: function (column) {
        return true;
    },
    onResizeStart: function (column, columns) {
    },
    onResize: function (column) {
    },
    onResizeEnd: function (column, columns) {
    },
    getMinWidthOf: function ($thNode) {
    },
    stateSaveCallback: function (settings, data) {
    },
    stateLoadCallback: function (settings) {
    }
}
function returnExportTitle1(title) {
    debugger;
    let val = `${title} - ${new Date().toDateString()}`;

    return val;
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
            '<input type="text" class="form-control" style="border:1px solid #47a58d" placeholder="Search ' + title + '" />'
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

        $('#applySearch' + tableId).click(function () {
            //currentTableSearch = title;
            setupAdvancedSearchObject(tableId)
            table.draw();
            currentTableSearch = '';
        })
    }

    ////below test for greater than / equal [check how to specify table]
    //https://datatables.net/examples/plug-ins/range_filtering.html
    //$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    //    //debugger
    //    let h = settings.sTableId;
    //    console.log(h)

    //    var min = parseInt($('#min').val(), 10);
    //    var max = parseInt($('#max').val(), 10);
    //    var age = parseFloat(data[2]) || 0; // use data for the age column

    //    if (
    //        (isNaN(min) && isNaN(max)) ||
    //        (isNaN(min) && age <= max) ||
    //        (min <= age && isNaN(max)) ||
    //        (min <= age && age <= max)
    //    ) {
    //        return true;
    //    }
    //    return false;
    //});

    //$('#min, #max').keyup(function () {
    //    //debugger
    //    table.draw();
    //});

}

function handleColUpdate(page, table, invisible) {
    let setting = {
        pageName: page,
        tables: {
            tableId: table,
            hiddenColumns: invisible //['','','']
        }
    }
    updateTableSettings(setting);
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
        //{
        //    extend: 'print',
        //    title: returnExportTitle(title)
        //},
    ]

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

function preHideColumns(table, pageName, tableId) {
    //debugger;
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

//#region helpers
function getUserId() {
    return $('#user_id').val();
    //if (userInfo && userInfo.Id) {
    //    return userInfo.Id;
    //}
    //return "";
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getObjectPropertyKeys(obj) {
    let names = []
    Object.keys(obj).forEach(key => {
        names.push(key)
    })
    return names;
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

const camelizeKeys = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(v => camelizeKeys(v));
    } else if (obj != null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [camelize(key)]: camelizeKeys(obj[key]),
            }),
            {},
        );
    }
    return obj;
};

function normlizeCamelcase(text) {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}

function countInstances(string, word) {
    return string.split(word).length - 1;
}

function isXMLString(xml) {
    try {
        xmlDoc = $.parseXML(xml); //is valid XML
        return true;
    } catch (err) {
        // was not XML
        return false;
    }
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function xml2json(xml) {
    let value = xml.substring(
        xml.indexOf("<") + 1,
        xml.indexOf(">")
    );
    while (countInstances(xml, `</${value}>`) < 1) {
        let i = xml.indexOf('>') + 1;
        xml = xml.substring(i).trim();
        value = xml.substring(
            xml.indexOf("<") + 1,
            xml.indexOf(">")
        );
    }

    var x2js = new X2JS();
    return x2js.xml_str2json(xml);

    const json = {};
    //for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
    //    const key = res[1] || res[3];
    //    const value = res[2] && parseXmlToJson(res[2]);
    //    json[key] = ((value && Object.keys(value).length) ? value : res[2]) || null;

    //}
    //return json;

    //res[0] - return the xml(as is)
    //res[1] - return the xml tag name
    //res[2] - return the xml content
    //res[3] - return the xml tag name in case the tag closes itself.In example: <tag />
}

function setGridViewDropdown(page, list = []) {
    let gridsList = getGridViewListForPage(page)
    currentGridList = gridsList;
    let HTML = ''
    HTML += '<div class="dropdown-grid">'

    HTML += '  <div class="dropdown-icon-container"> <i class="fa-solid fa-chart-pie settings-icon" onclick="gridDropdownToglle()"></i> </div>'

    HTML += '   <div id="gridDropdown" class="gridDropdown-content">'
    for (let i = 0; i < gridsList.length; i++) {
        if (!gridsList[i].visible) {
            handleGridDropdownChange(page, gridsList[i].objId, { checked: false }, false)
        }
        HTML += '        <a>'
        HTML += `           <label class="task" >`
        HTML += `               <input type="checkbox" name="${gridsList[i].name}" id="${gridsList[i].name}" onclick="handleGridDropdownChange('${page}','${gridsList[i].objId}',this);"` + (gridsList[i].visible == true ? `checked>` : `>`);
        HTML += `                    ${gridsList[i].name}`
        HTML += '           </label>'
        HTML += '       </a>'
    }
    HTML += '   </div>'
    HTML += '</div>'
    $('#gird-settings').empty().append(HTML);
}

function getGridViewListForPage(pageName) {
    let pageGrids = [];
    if (pageName == 'TrackAndTraceView') {
        pageGrids = [
            {
                name: 'table',
                objId: '#tableGrid',
                DbGrid: 'table',
                visible: true
            },
            {
                name: 'Map',
                objId: '#map1Grid',
                DbGrid: 'map1Grid',
                visible: true
            },

            //{
            //    name: 'Temperature chart',
            //    objId: '#temp1Grid',
            //    DbGrid: 'temp1Grid',
            //    visible: true
            //},
            //{
            //    name: 'Humidity chart',
            //    objId: '#humidity1Grid',
            //    DbGrid: 'humidity1Grid',
            //    visible: true
            //},

            //{
            //    name: 'Temperature per time chart',
            //    objId: '#temp2Grid',
            //    DbGrid: 'temp2Grid',
            //    visible: true
            //},
            //{
            //    name: 'Humidity per time chart',
            //    objId: '#humidity2Grid',
            //    DbGrid: 'humidity2Grid',
            //    visible: true
            //},

            //{
            //    name: 'Map 2',
            //    objId: '#map2Grid',
            //    DbGrid: 'map2Grid',
            //    visible: true
            //}
        ];
    }
    if (pageName == 'EGTN-node') {
        pageGrids = [
            {
                name: 'warehouse table',
                objId: '#warehousTable',
                DbGrid: 'warehousTable',
                visible: true
            },
            {
                name: 'Pallet pie chart',
                objId: '#pie1Grid',
                DbGrid: 'pie1Grid',
                visible: true
            },
            {
                name: 'storage pie chart',
                objId: '#pie2Grid',
                DbGrid: 'pie2Grid',
                visible: true
            },
            {
                name: 'Pallet bar chart',
                objId: '#barCol1Grid',
                DbGrid: 'barCol1Grid',
                visible: true
            },
            {
                name: 'storage bar chart',
                objId: '#barCol2Grid',
                DbGrid: 'barCol2Grid',
                visible: true
            },
        ];
    }
    if (pageName == 'DSS:Last') {
        pageGrids = [
            {
                name: 'route map',
                objId: '#routeMap',
                DbGrid: 'routeMap',
                visible: true
            },
            {
                name: 'Table 1',
                objId: '#table1Grid',
                DbGrid: 'table1Grid',
                visible: true
            },
            {
                name: 'Table 2',
                objId: '#table2Grid',
                DbGrid: 'table2Grid',
                visible: true
            }
        ];
    }
    if (pageName == 'Forecasts') {
        pageGrids = [
            {
                name: 'Resources table',
                objId: '#table1Grid',
                DbGrid: 'table1Grid',
                visible: true
            }
        ];
    }
    if (pageName == 'EGTN-network') {
        pageGrids = [
            {
                name: 'AEM Table 1',
                objId: '#table1Grid',
                DbGrid: '',
                visible: true
            },
            {
                name: 'AEM Table 2',
                objId: '#table2Grid',
                DbGrid: '',
                visible: true
            },
            {
                name: 'BCN Activity Table',
                objId: '#table3Grid',
                DbGrid: '',
                visible: true
            },
            {
                name: 'Depots Table',
                objId: '#table4Grid',
                DbGrid: '',
                visible: true
            },
            {
                name: 'MAD Activity Table',
                objId: '#table5Grid',
                DbGrid: '',
                visible: true
            },
            {
                name: 'Port terminals Table ',
                objId: '#table6Grid',
                DbGrid: '',
                visible: true
            },
        ];
    }

    pageGrids = pageGrids.map(obj => ({ ...obj, visible: true }));
    if (userSettings && userSettings.pages) {
        let index = userSettings.pages.findIndex(x => x.name == pageName)
        if (index > -1) {
            let invisible = userSettings.pages[index].hiddenGrids;
            if (invisible && invisible.length > 0)
                pageGrids = pageGrids.map(obj => invisible.some(i => i == obj.objId) ? ({ ...obj, visible: false }) : obj)
        }
    }
    return pageGrids;
}

function gridDropdownToglle() {
    document.getElementById("gridDropdown").classList.toggle("show");
    if (!document.getElementById("gridDropdown").classList.contains("show")) {

    }
}

function alertDropdownToglle() {
    document.getElementById("alertDropdown").classList.toggle("show");
    $('#alertsIcon').removeClass("UnreadMsg")
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

function handleGridDropdownChange(page, gridId, e, updateDb = true) {

    if (updateDb) {
        let i = currentGridList.findIndex(x => x.objId == gridId);
        currentGridList[i].visible = !currentGridList[i].visible;

        let grids = currentGridList.filter(x => !x.visible).map(x => { return x.objId });

        updateGridSettings({ pageName: page, hiddenGrids: grids })
    }

    if (e.checked) {
        $(gridId).show();
    }
    else {
        $(gridId).hide();
    }
}

function roundNumbersInObj(obj, fixed = 2, ignore = []) {

    for (let i = 0; i < obj.length; i++) {
        for (var prop in obj[i]) {
            if (!isNaN(obj[i][prop]) && !ignore.some(x => x == prop)) {
                obj[i][prop] = (+obj[i][prop]).toFixed(fixed);
                if (+obj[i][prop] == 0) {
                    obj[i][prop] = '0'
                }
            }
        }
    }

    return obj;
}

function convertNumericStringToNumber(obj) {

    for (let i = 0; i < obj.length; i++) {
        for (var prop in obj[i]) {
            if (!isNaN(obj[i][prop])) {
                obj[i][prop] = +obj[i][prop]
            }
        }
    }

    return obj;
}


function getObjectValuesAsArray(obj, keysToIgnore = []) {
    let arr = [];
    for (var prop in obj) {
        if (!keysToIgnore.includes(prop)) {
            if (obj.hasOwnProperty(prop)) {
                var innerObj = {
                    name: prop,
                    value: obj[prop]
                };
                arr.push(innerObj)
            }
        }
    }
    return arr;
}

function toggleGridsDisplay(toHide = [], toShow = []) {
    for (let i = 0; i < toHide.length; i++) {
        $(toHide[i]).hide();
    }

    for (let i = 0; i < toShow.length; i++) {
        $(toShow[i]).show();
    }
}

function groupBy(xs, key) {
    try {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }
    catch (ex) {
        return null
    }
};

//#endregion

//#region graph helpers

function ClearGraphsAreaAndGenerateNewArea(display) {
    for (let i = 0; i < display.length; i++) {
        $(`.${display[i]}`).empty();
    }

    for (let i = 0; i < display.length; i++) {
        $(`.${display[i]}`).append(generateGraphContainer(display[i]));
    }
    //$('.currentTemperatureGraphArea').empty();
    //$('.temperaturePerTimeGraphArea').empty();
    //$('.humidityPerTimeGraphArea').empty();
    //$('.currentHumidityGraphArea').empty();
    //$('.mapGraphArea').empty();
    //$('.pie1GraphArea').empty();
    //$('.pie2GraphArea').empty();
    //$('.barCol1GraphArea').empty();
    //$('.barCol2GraphArea').empty();

    //if (display.some(x => x == 'Temp1'))
    //    $('.currentTemperatureGraphArea').append(generateGraphContainer('currentTemperatureGraph'));
    //if (display.some(x => x == 'Humidity1'))
    //    $('.currentHumidityGraphArea').append(generateGraphContainer('currentHumidityGraph'));
    //if (display.some(x => x == 'Temp2'))
    //    $('.temperaturePerTimeGraphArea').append(generateGraphContainer('temperaturePerTimeGraph'));
    //if (display.some(x => x == 'Humidity2'))
    //    $('.humidityPerTimeGraphArea').append(generateGraphContainer('humidityPerTimeGraph'));
    //if (display.some(x => x == 'Map'))
    //    $('.mapGraphArea').append(generateGraphContainer('mapGraphArea'));
    //if (display.some(x => x == 'pie1GraphArea'))
    //    $('.pie1GraphArea').append(generateGraphContainer('pie1GraphArea'));
    //if (display.some(x => x == 'pie2GraphArea'))
    //    $('.pie2GraphArea').append(generateGraphContainer('pie2GraphArea'));
    //if (display.some(x => x == 'barCol1GraphArea'))
    //    $('.barCol1GraphArea').append(generateGraphContainer('barCol1GraphArea'));
    //if (display.some(x => x == 'barCol2GraphArea'))
    //    $('.barCol2GraphArea').append(generateGraphContainer('barCol2GraphArea'));
}

function generateGraphContainer(id) {
    let HTML = '';
    HTML += '<div id="' + id + '" style="width:100%; height:500px;">'
    HTML += '</div>'
    return HTML;
}

function generateCurrentTemperatureGraph(temp) {
    am5.ready(function () {
        var root = am5.Root.new("currentTemperatureGraphArea");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        var chart = root.container.children.push(am5radar.RadarChart.new(root, {
            panX: false,
            panY: false,
            startAngle: 160,
            endAngle: 380
        }));
        var axisRenderer = am5radar.AxisRendererCircular.new(root, {
            innerRadius: -40
        });
        axisRenderer.grid.template.setAll({
            stroke: root.interfaceColors.get("background"),
            visible: true,
            strokeOpacity: 0.8
        });
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: -40,
            max: 100,
            strictMinMax: true,
            renderer: axisRenderer
        }));
        var axisDataItem = xAxis.makeDataItem({});
        var clockHand = am5radar.ClockHand.new(root, {
            pinRadius: am5.percent(20),
            radius: am5.percent(100),
            bottomWidth: 40
        })
        var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
            sprite: clockHand
        }));
        xAxis.createAxisRange(axisDataItem);
        var label = chart.radarContainer.children.push(am5.Label.new(root, {
            fill: am5.color(0xffffff),
            centerX: am5.percent(50),
            textAlign: "center",
            centerY: am5.percent(50),
            fontSize: "3em"
        }));
        axisDataItem.set("value", temp);
        bullet.get("sprite").on("rotation", function () {
            var value = axisDataItem.get("value");
            var text = Math.round(axisDataItem.get("value")).toString();
            var fill = am5.color(0x000000);
            xAxis.axisRanges.each(function (axisRange) {
                if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
                    fill = axisRange.get("axisFill").get("fill");
                }
            })
            label.set("text", Math.round(value).toString());
            clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
            clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
        });
        chart.bulletsContainer.set("mask", undefined);
        var bandsData = [{
            title: "Cold",
            color: "#0400FE",
            lowScore: -40,
            highScore: 0
        }, {
            title: "Warm",
            color: "#FE9A00",
            lowScore: 0,
            highScore: 30
        }, {
            title: "Hot",
            color: "#FE0000",
            lowScore: 30,
            highScore: 100
        },];
        am5.array.each(bandsData, function (data) {
            var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
            axisRange.setAll({
                value: data.lowScore,
                endValue: data.highScore
            });
            axisRange.get("axisFill").setAll({
                visible: true,
                fill: am5.color(data.color),
                fillOpacity: 0.8
            });
            axisRange.get("label").setAll({
                text: data.title,
                inside: true,
                radius: 15,
                fontSize: "0.9em",
                fill: root.interfaceColors.get("background")
            });
        });
        chart.appear(1000, 100);
    });
}

function generateCurrentHumidityGraph(humd) {
    am5.ready(function () {
        var root = am5.Root.new("currentHumidityGraphArea");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        var chart = root.container.children.push(am5radar.RadarChart.new(root, {
            panX: false,
            panY: false,
            startAngle: 160,
            endAngle: 380
        }));
        var axisRenderer = am5radar.AxisRendererCircular.new(root, {
            innerRadius: -40
        });
        axisRenderer.grid.template.setAll({
            stroke: root.interfaceColors.get("background"),
            visible: true,
            strokeOpacity: 0.8
        });
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: 0,
            max: 100,
            strictMinMax: true,
            renderer: axisRenderer
        }));
        var axisDataItem = xAxis.makeDataItem({});
        var clockHand = am5radar.ClockHand.new(root, {
            pinRadius: am5.percent(20),
            radius: am5.percent(100),
            bottomWidth: 40
        })
        var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
            sprite: clockHand
        }));
        xAxis.createAxisRange(axisDataItem);
        var label = chart.radarContainer.children.push(am5.Label.new(root, {
            fill: am5.color(0xffffff),
            centerX: am5.percent(50),
            textAlign: "center",
            centerY: am5.percent(50),
            fontSize: "3em"
        }));
        axisDataItem.set("value", humd);
        bullet.get("sprite").on("rotation", function () {
            var value = axisDataItem.get("value");
            var text = Math.round(axisDataItem.get("value")).toString();
            var fill = am5.color(0x000000);
            xAxis.axisRanges.each(function (axisRange) {
                if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
                    fill = axisRange.get("axisFill").get("fill");
                }
            })

            label.set("text", Math.round(value).toString());

            clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
            clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
        });
        chart.bulletsContainer.set("mask", undefined);
        var bandsData = [{
            title: "Dry",
            color: "#FE7F00",
            lowScore: 0,
            highScore: 30
        }, {
            title: "Normal",
            color: "#41FE00",
            lowScore: 30,
            highScore: 60
        },
        {
            color: "#FEF600",
            lowScore: 60,
            highScore: 70
        }, {
            title: "Humid",
            color: "#0078FF",
            lowScore: 70,
            highScore: 100
        },];
        am5.array.each(bandsData, function (data) {

            var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

            axisRange.setAll({
                value: data.lowScore,
                endValue: data.highScore
            });

            axisRange.get("axisFill").setAll({
                visible: true,
                fill: am5.color(data.color),
                fillOpacity: 0.8
            });

            axisRange.get("label").setAll({
                text: data.title,
                inside: true,
                radius: 15,
                fontSize: "0.9em",
                fill: root.interfaceColors.get("background")
            });
        });
        chart.appear(1000, 100);
    });
}

function generateTemperatuePerTimeGrap(resp) {
    am5.ready(function () {
        var root = am5.Root.new("temperaturePerTimeGraphArea");
        root.setThemes([am5themes_Animated.new(root)]);
        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout
            })
        );
        chart.set(
            "scrollbarX",
            am5.Scrollbar.new(root, {
                orientation: "horizontal"
            })
        );
        var graphData = [];
        for (i = 0; i < resp.length; i++) {
            graphData.push({
                Time: resp[i].Timestamp,
                Temp: resp[i].Temperature
            });
        }
        var xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "Time",
                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
            })
        );
        xAxis.data.setAll(graphData);
        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: 0,
                extraMax: 0.1,
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );
        yAxis.axisHeader.children.push(am5.Label.new(root, {
            text: "Temperature",
            fontWeight: "500",
            textAlign: "center",
            y: am5.p50,
            x: am5.percent(50),
            centerX: am5.percent(50),
        }));
        var series1 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Time",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Temp",
                categoryXField: "Time",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "{name} in {categoryX}: {valueY} {info}"
                })
            })
        );
        series1.columns.template.setAll({
            tooltipY: am5.percent(10),
            templateField: "columnSettings"
        });
        series1.data.setAll(graphData);
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        var legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            })
        );
        legend.data.setAll(chart.series.values);
        chart.appear(1000, 100);
        series1.appear();
    });

}

function generateHumidityPerTimeGrap(resp) {
    am5.ready(function () {
        var root = am5.Root.new("humidityPerTimeGraphArea");
        root.setThemes([am5themes_Animated.new(root)]);
        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout
            })
        );
        chart.set(
            "scrollbarX",
            am5.Scrollbar.new(root, {
                orientation: "horizontal"
            })
        );
        var graphData = [];
        for (i = 0; i < resp.length; i++) {
            graphData.push({
                date: resp[i].Timestamp[1],
                Time: resp[i].Timestamp,
                Temp: resp[i].Humidity
            });
        }
        var xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                maxDeviation: 30,
                categoryField: "Time",
                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
            })
        );

        xAxis.data.setAll(graphData);
        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: 0,
                extraMax: 0.1,
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );
        yAxis.axisHeader.children.push(am5.Label.new(root, {
            text: "Humidity",
            fontWeight: "500",
            textAlign: "center",
            y: am5.p50,
            x: am5.percent(50),
            centerX: am5.percent(50),
        }));

        var series1 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Time",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Temp",
                categoryXField: "Time",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "{name} in {categoryX}: {valueY} {info}"
                })
            })
        );
        series1.columns.template.setAll({
            tooltipY: am5.percent(10),
            templateField: "columnSettings"
        });
        series1.data.setAll(graphData);
        chart.set("cursor", am5xy.XYCursor.new(root, {}));
        var legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            })
        );
        legend.data.setAll(chart.series.values);
        chart.appear(1000, 100);
        series1.appear();
    });
}

function generateWoldMapGraph(coords) {
    am5.ready(function () {

        var root = am5.Root.new("mapGraphArea");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "translateY",
            projection: am5map.geoMercator()
        })
        );

        var cont = chart.children.push(
            am5.Container.new(root, {
                layout: root.horizontalLayout,
                x: 20,
                y: 40
            })
        );

        cont.children.push(
            am5.Label.new(root, {
                centerY: am5.p50,
                text: "Map"
            })
        );

        var switchButton = cont.children.push(
            am5.Button.new(root, {
                themeTags: ["switch"],
                centerY: am5.p50,
                icon: am5.Circle.new(root, {
                    themeTags: ["icon"]
                })
            })
        );

        switchButton.on("active", function () {
            if (!switchButton.get("active")) {
                chart.set("projection", am5map.geoMercator());
                chart.set("panY", "translateY");
                chart.set("rotationY", 0);
                backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
            } else {
                chart.set("projection", am5map.geoOrthographic());
                chart.set("panY", "rotateY")

                backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
            }
        });

        cont.children.push(
            am5.Label.new(root, {
                centerY: am5.p50,
                text: "Globe"
            })
        );

        var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
        backgroundSeries.mapPolygons.template.setAll({
            fill: root.interfaceColors.get("alternativeBackground"),
            fillOpacity: 0,
            strokeOpacity: 0
        });

        backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

        var polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow
            })
        );
        var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
        lineSeries.mapLines.template.setAll({
            stroke: root.interfaceColors.get("alternativeBackground"),
            strokeOpacity: 0.3
        });

        var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
        var colorset = am5.ColorSet.new(root, {});

        pointSeries.bullets.push(function () {
            var container = am5.Container.new(root, {});

            var circle = container.children.push(
                am5.Circle.new(root, {
                    radius: 4,
                    tooltipY: 0,
                    fill: '#FE0000',
                    strokeOpacity: 0,
                    tooltipText: " lat: {latitude} long:{longitude}"
                })
            );

            var circle2 = container.children.push(
                am5.Circle.new(root, {
                    radius: 4,
                    tooltipY: 0,
                    fill: '#FE0000',
                    strokeOpacity: 0,
                    tooltipText: " lat: {latitude} long:{longitude}"
                })
            );

            circle.animate({
                key: "scale",
                from: 1,
                to: 5,
                duration: 600,
                easing: am5.ease.out(am5.ease.cubic),
                loops: Infinity
            });
            circle.animate({
                key: "opacity",
                from: 1,
                to: 0,
                duration: 600,
                easing: am5.ease.out(am5.ease.cubic),
                loops: Infinity
            });

            return am5.Bullet.new(root, {
                sprite: container
            });
        });

        var cities = [
            {
                title: "Brussels",
                temp: 22.5,
                hum: 68.57,
                latitude: 50.8371,
                longitude: 4.3676
            },
            {
                title: "Copenhagen",
                temp: 22.5,
                latitude: 55.6763,
                longitude: 12.5681
            },
            {
                title: "Paris",
                temp: 22.5,
                latitude: 48.8567,
                longitude: 2.351
            },
            {
                title: "Reykjavik",
                temp: 22.5,
                latitude: 64.1353,
                longitude: -21.8952
            },
            {
                title: "Moscow",
                temp: 22.5,
                latitude: 55.7558,
                longitude: 37.6176
            },
            {
                title: "Madrid",
                temp: 22.5,
                latitude: 40.4167,
                longitude: -3.7033
            },
            {
                title: "London",
                temp: 22.5,
                latitude: 51.5002,
                longitude: -0.1262,
                url: "http://www.google.co.uk"
            },
            {
                title: "Peking",
                temp: 22.5,
                latitude: 39.9056,
                longitude: 116.3958
            },
            {
                title: "New Delhi",
                temp: 22.5,
                latitude: 28.6353,
                longitude: 77.225
            },
            {
                title: "Tokyo",
                temp: 22.5,
                latitude: 35.6785,
                longitude: 139.6823,
                url: "http://www.google.co.jp"
            },
            {
                title: "Ankara",
                temp: 22.5,
                latitude: 39.9439,
                longitude: 32.856
            },
            {
                title: "Buenos Aires",
                temp: 22.5,
                latitude: -34.6118,
                longitude: -58.4173
            },
            {
                title: "Brasilia",
                temp: 22.5,
                latitude: -15.7801,
                longitude: -47.9292
            },
            {
                title: "Ottawa",
                temp: 22.5,
                latitude: 45.4235,
                longitude: -75.6979
            },
            {
                title: "Washington",
                temp: 22.5,
                latitude: 38.8921,
                longitude: -77.0241
            },
            {
                title: "Kinshasa",
                temp: 22.5,
                latitude: -4.3369,
                longitude: 15.3271
            },
            {
                title: "Cairo",
                temp: 22.5,
                latitude: 30.0571,
                longitude: 31.2272
            },
            {
                title: "Pretoria",
                temp: 22.5,
                latitude: -25.7463,
                longitude: 28.1876
            }
        ];
        var latitude = coords[0];
        var longitude = coords[1];
        addCity(latitude, longitude);
        function addCity(longitude, latitude) {
            pointSeries.data.push({
                geometry: { type: "Point", coordinates: [latitude, longitude] },
            });
        }
        chart.appear(1000, 100);
    });
}

function generateBarColChart(data, id) {
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
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true
        }));

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);


        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
        xRenderer.labels.template.setAll({
            rotation: -90,
            centerY: am5.p50,
            centerX: am5.p100,
            paddingRight: 15
        });

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.3,
            categoryField: "name",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));


        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            sequencedInterpolation: true,
            categoryXField: "name",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
            })
        }));

        series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
        series.columns.template.adapters.add("fill", function (fill, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", function (stroke, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        // Set data
        let chartData = [];
        for (let i = 0; i < data.length; i++) {
            chartData.push({
                name: data[i].name,
                value: data[i].value
            })
        }

        //let data = []

        xAxis.data.setAll(chartData);
        series.data.setAll(chartData);


        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);

    }); // end am5.ready()
}

function generatePieChart(data, id) {

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
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
        var chart = root.container.children.push(am5percent.PieChart.new(root, {
            radius: am5.percent(90),
            innerRadius: am5.percent(50),
            layout: root.horizontalLayout
        }));

        // Create series
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
        var series = chart.series.push(am5percent.PieSeries.new(root, {
            name: "Series",
            valueField: "value",
            categoryField: "category"
        }));

        // Set data
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data

        let pieData = [];
        for (let i = 0; i < data.length; i++) {
            pieData.push({
                category: data[i].name,
                value: data[i].value
            })
        }


        series.data.setAll(pieData);

        // Disabling labels and ticks
        series.labels.template.set("visible", false);
        series.ticks.template.set("visible", false);

        // Adding gradients
        series.slices.template.set("strokeOpacity", 0);
        series.slices.template.set("fillGradient", am5.RadialGradient.new(root, {
            stops: [{
                brighten: -0.8
            }, {
                brighten: -0.8
            }, {
                brighten: -0.5
            }, {
                brighten: 0
            }, {
                brighten: -0.5
            }]
        }));

        // Create legend
        // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
        var legend = chart.children.push(am5.Legend.new(root, {
            centerY: am5.percent(50),
            y: am5.percent(50),
            marginTop: 15,
            marginBottom: 15,
            layout: root.verticalLayout
        }));

        legend.data.setAll(series.dataItems);


        // Play initial series animation
        // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
        series.appear(1000, 100);

    }); // end am5.ready()
    return
}

//#endregion


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

function ShowAlertMessage(alert) {
    swal({
        title: "New Alert!",
        text: alert.message,
        buttons: "Done"
    }).then(function () {
        if (alert.isNew) {
            setAlertAsRead(alert.alertId)
            $('#alert-' + alert.alertId).removeClass('new-alert')
        }
    });

}

function ShowToastAlertMessage(title, message, duration, nbr, primaryColor = 'rgb(80 120 0)', position = 'bottom-right') {

    $.toast({
        text: message, // Text that is to be shown in the toast
        heading: title, // Optional heading to be shown on the toast
        showHideTransition: 'fade',
        allowToastClose: true, // Boolean value true or false
        hideAfter: duration, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        stack: nbr, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
        position: position, // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
        //icon: 'warning',
        bgColor: primaryColor,  // Background color of the toast
        textColor: '#eeeeee',  // Text color of the toast
        textAlign: 'left',
        loader: true,  // Whether to show loader or not. True by default
        loaderBg: 'white', // Text alignment i.e. left, right or center
        beforeShow: function () { }, // will be triggered before the toast is shown
        afterShown: function () { }, // will be triggered after the toat has been shown
        beforeHide: function () { }, // will be triggered before the toast gets hidden
        afterHidden: function () { }  // will be triggered after the toast has been hidden
    });
}
