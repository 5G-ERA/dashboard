
$(function () {
    $('.nav-item').removeClass('active');
    $('#dash_manager').addClass("active");

    DisplayDashboard();

    var grid = $('.grid').packery({
        // options
        itemSelector: '.grid-item',
        gutter: 10,
        resize: true
    });

    // make all grid-items draggable
    grid.find('.grid-item').each(function (i, gridItem) {
        var draggie = new Draggabilly(gridItem);
        // bind drag events to Packery
        grid.packery('bindDraggabillyEvents', draggie);
    });
});

function openAddDashboardModal() {
    var html = GetWizardHtmlComponent();
    $(".homemodal").empty().append(html);

    //Dropdowns
    $('#project_drp').chosen({ search_contains: true });
    $('#dashtype_drp').chosen({ search_contains: true });
    $('#dash_data_src').chosen({ search_contains: true });
    $('#dash_col_data_src').chosen({ search_contains: true });
    $('#parent_menu_drp').chosen({ search_contains: true });


    $('#modal_eu_project').show();
    var formnumber = 0;

    $(".next_button").on('click',
        function () {
            if (!validateStep()) {
                return false;
            }
            formnumber++;
            updateform(formnumber);
            progress_forward(formnumber);
            contentchange(formnumber);
        });

    $(".back_button").on('click',
        function() {
            formnumber--;
            updateform(formnumber);
            progress_backward(formnumber);
            contentchange(formnumber);
        });

    $(".submit_button").on('click',
        function() {
            formnumber++;
            updateform(formnumber);
            CreateEuProjectDashboard();
        });

    $('.form-review-button').on('click',
        function () {
            //Step1
            $('#dash_name_value').empty().append($('#dashboard_name').val());
            $('#dash_menu_value').empty().append($('#menu_name').val());
            $('#dash_menu_order_value').empty().append($('#menu_order').val());
            $('#dash_project_name_value').empty().append($('#project_drp').find(":selected").text());
            $('#dash_type_value').empty().append($('#dashtype_drp').find(":selected").text());

            //Step2
            $('#dash_data_src_value').empty().append($('#dash_data_src').find(":selected").text());
            $('#dash_col_data_src_value').empty().append($('#col_data_src_bloc').find(":selected").text());

            //Step3
            $('#dash_bg_value').empty().append($('#dash_bg').val());
            $('#dash_fg_value').empty().append($('#dash_fg').val());
        });
}

function contentchange(nbr) {
    $('.step-number-content').removeClass('active');
    $('.step-number-content').addClass('d-none');
    $('.step-number-content')[nbr].classList.remove('d-none');
    $('.step-number-content')[nbr].classList.add('active');
}

function updateform(nbr) {
    $(".main").removeClass('active');
    $(".main")[nbr].classList.add('active');
}

function progress_forward(nbr) {

    $(".step-number").text(nbr + 1);
    $(".progress-bar li")[nbr].classList.add('active');
}

function progress_backward(nbr) {
    var form_num = nbr + 1;
    $(".progress-bar li")[form_num].classList.remove('active');
    $(".step-number").text(form_num);
}

function validateStep() {
    var validate = true;
    var validate_inputs = document.querySelectorAll('.main.active .dash-input');
    var validate_selects = document.querySelectorAll(".main.active select");

    for (var i=0; i < validate_inputs.length; i++) {
        if (validate_inputs[i].value.length == 0) {
            validate = false;
            validate_inputs[i].classList.add('warning');
        }
    }

    if (validate) {
        $(".main.active input").removeClass('warning');
        //$(".main.active .chosen-single").removeClass('warning');
    }

    for (var j = 0; j < validate_selects.length; j++) {
        if (validate_selects[j].selectedIndex == 0) {
            validate = false;
            var selectId = validate_selects[j].id;
            $('#' + selectId + '_chosen .chosen-single').addClass('warning')
        }
    }

    if (validate) {
        //$(".main.active input").removeClass('warning');
        $(".main.active .chosen-single").removeClass('warning');
    }
    
    return validate;

}

function DisplayDashboard() {
    var dashboards = RetrieveDashboards();

    var html = '';

    for (var i = 0; i < dashboards.length; i++) {
        var dashbaordConfig = JSON.parse(dashboards[i].DashboardObjectConfig);

        html += '<div class="grid-item">';

        if (dashbaordConfig.dashboard_type.toLowerCase() === "table") {

            var columns = RetrieveTableColumnsDataSources(dashbaordConfig.dashboard_object_datasource);

            html += '<h4>' + dashboards[i].DashboardName +'</h4>'
            html += '<table id="table_dashboard_' + dashboards[i].DashboardId +'" class="display dashboard-table" style="width:100%">'
            html += '<thead>'
            html += '<tr>'
            var array_column_ids = [];
            array_column_ids = JSON.parse(dashbaordConfig.dashboard_columns);
            var count = 0;

            for (var j = 0; j < array_column_ids.length; j++) {

                var col = columns.filter(c => c.ColumnId === parseFloat(array_column_ids[j]));
                if (col !== 'undefined' && col.length > 0) {
                    html += '<th>' + col[0].ColumnName + '</th>';
                    count++;
                }
            }
            html += '</tr>'
            html += ' </thead >'
            html += '<tbody>'
            html += '<tr>'
            

            for (var x = 0; x < count; x++) {
               html += '<td>'+'</td>'
            }
            html += '</tr>'
            html += '</tbody>'
            html += '</table>'

        } else {
            html += '<div id="graph_dashboard_' + dashboards[i].DashboardId +'"></div>';
        }
        
        html += '</div>';
        $('#grid_dashboard').empty().append(html);
        $('#table_dashboard_' + dashboards[i].DashboardId).DataTable({
            destroy: true
        });
        
    }

    for (var j = 0; j < dashboards.length; j++) {

        if (dashbaordConfig.dashboard_type.toLowerCase() === "graph") {
            var myChartConfig = {
                type: "line",
                plot: {
                    tooltip: {
                        visible: false
                    }
                },
                series: [{
                        values: [20, 40, 25, 50, 15, 45, 33, 34, 49, 53, 19, 35, 24],
                        text: "Blueberries"
                    },
                    {
                        values: [11, 30, 21, 18, 59, 50, 28, 33, 23, 15, 18, 26, 34],
                        text: "Cherries"
                    },
                    {
                        values: [30, 21, 18, 21, 33, 41, 29, 15, 11, 12, 26, 23, 26],
                        text: "Kiwis"
                    },
                    {
                        values: [34, 16, 26, 15, 19, 21, 20, 24, 35, 41, 42, 38, 39],
                        text: "Kumquats"
                    }
                ]
            };

            zingchart.render({
                id: 'graph_dashboard_' + dashboards[j].DashboardId,
                data: myChartConfig,
                height: '400',
                width: '100%'
            });
        }
    }

}

function CloseDashboardModal() {
    $('#modal_eu_project').hide();
}

function GetWizardHtmlComponent() {

    var project_name = $('#project_code').val();
    var project_logo_src = "/images/platform_logos/" + project_name + "/" + project_name + ".png";

    var projects = RetrieveEuProjects();
    var dataSources = RetrieveTableDataSources();

    var html = '';
    html += '<div id="modal_eu_project" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="container">';
    html += '<div class="card" >';
    
    html += '<div class="form">';
    html += '<div class="left-side">';
    html += '<div class="left-heading" style="text-align:center">';
    //html += '<h4 class="dash-title-project" style="text-align:center">' + project_name +'</h4>';
    html += '<img class="sidebar-brand-logo" src="' + project_logo_src + '" width="200" height="100" alt="">'
    html += '</div>';
    html += '<div class="steps-content">';
    html += '<h3>Step <span class="step-number">1</span></h3>';
    html += '<p class="step-number-content active">Provide information related to the new dashboard</p>';
    html +=
        '<p class="step-number-content d-none">Configure Object Datasources</p>';
    html +=
        '<p class="step-number-content d-none">Configure how the dashboard will look like visually.</p>';
    html += '<p class="step-number-content d-none">Please review and verify informations provided.</p>';
    html += '</div>';
    html += '<ul class="progress-bar">';
    html += '<li class="active">Dashboard Informations</li>';
    html += '<li>Data Configuration</li>';
    html += '<li>Styling</li>';
    html += '<li>Finish</li>';
    html += '</ul>';
    html += '</div>';
    html += '<div class="right-side">';
    html += '	<span onclick="CloseDashboardModal()" class="close">&times;</span>';
    html += '<div class="main active">';
    html += '';
    html += '<div class="text">';
    html += '<h2>Dashboard Informations</h2>';
    html += '<p>Provide information related to the new dashboard</p>';
    html += '</div>';
    html += '<div class="input-text">';
    html += '<div class="input-div">';
    html += '<input type="text" id="dashboard_name" class="dash-input" required require>';
    html += '<span>Dashboard Name</span>';
    html += '</div>';
    //html += '<div class="input-div">';
    //html += '<input type="text" required>';
    //html += '<span>Dashboard Type</span>';
    //html += '</div>';
    html += '</div>';
    html += '<div class="row">';
    html += '<div class="input-div col-6">';
    html += '<select id="project_drp" onchange="OnProjectChange()">';
    html += '<option value="0">Select a Project</option>';

    for (var i in projects) {
        html += '<option value="' + projects[i].ProjectId + '">' + projects[i].ProjectName + '</option>';
    }
    html += '</select>';

    html += '</div>';
    html += '<div class="input-div col-6" id="parent_menu_drp_bloc">';
    html += '<select id="parent_menu_drp" disabled>';
    html += '<option value="0">Select Parent Menu</option>';
    html += '</select>';

    html += '</div>';
    html += '</div>';

    html += '<div class="input-text">';
    html += '<div class="input-div">';
    html += '<input type="text" id="menu_name" required class="dash-input" require>';
    html += '<span>Menu</span>';
    html += '</div>';
    html += '<div class="input-div">';
    html += '<input type="number" id="menu_order" required class="dash-input" require>';
    html += '<span>Menu Order</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="buttons">';
    html += '<button class="next_button">Next Step</button>';
    html += '</div>';
    html += '</div>';
    html += '<div class="main">';
    html += '';
    html += '<div class="text">';
    html += '<h2>Data Configuration</h2>';
    html += '<p>Configure Object Datasources</p>';
    html += '</div>';
    html += '<div class="">'
    html += '<div class="input-div">'
    html += '<select id="dash_data_src" onchange="LoadColumnsPerDatasource()">'
    html += '<option>Select Object Data Source</option>'
    for (var x in dataSources) {
        html += '<option value="' + dataSources[x].TableId +'">'+ dataSources[x].TableName +'</option>'
    }
    html += '</select>'
    //html += '<div class="input-div">'
    //html += '<input type="text" required>'
    //html += '<span>Board Name</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="">'
    html += '<div id="col_data_src_bloc" class="">'
    html += '<select data-placeholder="Select Columns..." multiple id="dash_col_data_src" disable>'
    html += '</select>'
    html += '</div>'
    html += '</div> <br/><br/>'
    html += '<div class="">'
    html += '<div class="">'
    //html += '<select>'
    //html += '<option>Select Course</option>'
    //html += '<option>BCA</option>'
    //html += '<option>B-TECH</option>'
    //html += '<option>BA</option>'
    //html += '<option>B-COM</option>'
    //html += '<option>B-SC</option>'
    //html += '<option>MBA</option>'
    //html += '<option>MCA</option>'
    //html += '<option>M-COM</option>'
    //html += '<option>M-TECH</option>'
    //html += '</select>'
    html += '<select id="dashtype_drp">';
    html += '<option>Select Dashboard Type</option>';
    html += '<option value="Graph">Graph</option>';
    html += '<option value="Table">Table</option>';
    html += '</select>';
    html += '</div>'
    html += '</div>'
    html += '<div class="buttons button_space">'
    html += '<button class="back_button">Back</button>'
    html += '<button class="next_button">Next Step</button>'
    html += '</div>'
    html += '</div>'
    html += '<div class="main">'
    html += ''
    html += '<div class="text">'
    html += '<h2>Styling</h2>'
    html += '<p>Configure how the dashboard will look like visually.</p>'
    html += '</div>'
    html += '<div class="input-text">'
    html += '<div class="input-div">'
    //html += '<input type="text" required require>'
    html += '<label>Background Color</label>'
    html += '<input type="color" id="dash_bg" class="form-control-color col-12" value="#ffffff" title="Choose your color">'
    html += '</div>'
    //html += '<div class="input-div">'
    //html += '<input type="text" required require>'
    //html += '<span>Position</span>'
    //html += '</div>'
    html += '</div>'
    html += '<div class="input-text">'
    //html += '<div class="input-div">'
    //html += '<input type="text" required>'
    //html += '<span>Experience 2</span>'
    //html += '</div>'
    html += '<div class="input-div">'
    html += '<label>Text Color</label>'
    html += '<input type="color" id="dash_fg" class="form-control-color col-12" value="#000000" title="Choose your color">'
    //html += '<span >Text Color</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="input-text">'
    //html += '<div class="input-div">'
    //html += '<input type="text" required>'
    //html += '<span>Experience 3</span>'
    //html += '</div>'
    //html += '<div class="input-div">'
    //html += '<input type="text" required>'
    //html += '<span>Position</span>'
    //html += '</div>'
    html += '</div>'
    html += '<div class="buttons button_space">'
    html += '<button class="back_button">Back</button>'
    html += '<button class="next_button form-review-button">Next Step</button>'
    html += '</div>'
    html += '</div>'



    html += '<div class="main">'
    html += ''
    html += '<div class="">'
    html += '<h2>Finish</h2>'
    html += '<p>Please review and verify informations provided.</p>'
    html += '</div>'
    html += '<span class="theme-color"> Dashboard Informations</span >'
    html += '<div class="mb-3">'
    html += '<hr class="new1">'
    html += '</div>'

    html += '<div class="d-flex justify-content-between">'
    html += '<h6>Dashboard Name</h6>'
    html += '<h6 id="dash_name_value">...</h6>'
    html += '</div>'
        
    html += '<div class="d-flex justify-content-between">'
    html += '<h6>Menu</h6>'
    html += '<h6 id="dash_menu_value">...</h6>'
    html += '</div>'

    html += '<div class="d-flex justify-content-between">'
    html += '<h6>Menu Order</h6>'
    html += '<h6 id="dash_menu_order_value">...</h6>'
    html += '</div>'

    html += '<div class="d-flex justify-content-between">'
    html += '<h6>Project</h6>'
    html += '<h6 id="dash_project_name_value">...</h6>'
    html += '</div>'

    html += '<div class="d-flex justify-content-between">'
    html += '<h6>Dashboard Type</h6>'
    html += '<h6 id="dash_type_value">...</h6>'
    html += '</div>'

    html += '<br/><br/>'

    html += '<div class="row">'
    html += '<div class="col-6"'
    html += '<span class="theme-color"> Data Configuration</span >'
    html += '<div class="mb-3">'
    html += '<hr class="new1">'
    html += '</div>'

    html += '<div class="d-flex justify-content-between">'
    html += '<h6>DataSource</h6>'
    html += '<h6 style="font-size:8px" id="dash_data_src_value">...</h6>'
    html += '</div>'

    //html += '<div class="d-flex justify-content-between">'
    //html += '<h6>Columns</h6>'
    //html += '<h6 id="dash_col_data_src_value">...</h6>'
    //html += '</div>'
    html += '</div>'
    html += '<div class="col-6"'
    html += '<span class="theme-color"> Styling</span >'
    html += '<div class="mb-3">'
    html += '<hr class="new1">'
    html += '</div>'

    html += '<div class="d-flex justify-content-between">'
    html += '<h6>Background Color</h6>'
    html += '<h6 id="dash_bg_value">...</h6>'
    html += '</div>'

    html += '<div class="d-flex justify-content-between">'
    html += '<h6>Text Color</h6>'
    html += '<h6 id="dash_fg_value">...</h6>'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    
    html += '<div class="buttons button_space" style="margin-top:10%">'
    html += '<button class="back_button">Back</button>'
    html += '<button class="submit_button">Submit</button>'
    html += '</div>'
    html += '</div>'

    html += '<div class="main">'
    html += '<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">'
    html += '<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />'
    html += '<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />'
    html += '</svg>';

    html += '<div class="text congrats">'
    html += '<h2>Success!</h2>'
    html += '<p>Great! <span class="shown_name"></span> The dashboard has been created successfully!</p>'
    html += '</div>'
    html += '</div>'

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
}

function LoadColumnsPerDatasource() {
    var tableId = $('#dash_data_src').val();

    if ((tableId === '' || tableId === '') && parseInt(tableId) > 0) {
        alert("You must select a datasource")
    } else {
        var columns = RetrieveTableColumnsDataSources(tableId);
        var html = '';
        html += '<select data-placeholder="Select Columns..." multiple id="dash_col_data_src">';

        for (var i = 0; i < columns.length; i++) {
            html += '<option value="' + columns[i].ColumnId + '">' + columns[i].ColumnName + '</option>'
        }

        html += '</select>';
        $('#col_data_src_bloc').empty().append(html);
        $('#dash_col_data_src').chosen({ search_contains: true})
    }
}

function OnProjectChange() {
    var projectId = $('#project_drp').val();

    if ((projectId === '' || projectId === '') && parseInt(projectId) > 0) {
        alert("You must select a project")
    } else {
        var menu = RetrieveMenuPerProject(projectId);
        var html = '';
        html += '<select id="parent_menu_drp">';
        html += '<option value="0">Select Parent Menu</option>';
        for (var i = 0; i < menu.length; i++) {
            html += '<option value="' + menu[i].MenuId + '">' + menu[i].MenuName + '</option>'
        }
        html += '</select>';
        $("#parent_menu_drp_bloc").empty().append(html);
        $('#parent_menu_drp').chosen({ search_contains: true })
    }
}

function RetrieveEuProjects() {
    var data = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/Menu/RetrieveProjects",
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });

    return data;
}

function RetrieveTableDataSources() {
    var data = [];
    $.ajax({
        async: false,
        type: "POST",
        url: "/Menu/RetrieveTableDataSources",
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveDashboards() {
    var data = [];
    $.ajax({
        async: false,
        type: "POST",
        url: "/Dashboard/RetrieveDashboards",
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveTableColumnsDataSources(tableId) {
    var data = [];
    $.ajax({
        async: false,
        type: "POST",
        data: {
            tableId: tableId
        },
        url: "/Menu/RetrieveColumnTableDataSources",
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveMenuPerProject(projectId) {
    var data = [];
    $.ajax({
        async: false,
        type: "POST",
        data: {
            projectId: projectId
        },
        url: "/Dashboard/RetrieveMenuPerProject",
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function CreateEuProjectDashboard() {
    var dash_obj = {
        dashboard_name: $('#dashboard_name').val(),
        menu_name: $('#menu_name').val(),
        menu_order: $('#menu_order').val(),
        parent_menu_id: $('#parent_menu_drp').val(),
        project_id: $('#project_drp').val(),
        dashboard_type: $('#dashtype_drp').val(),
        dashboard_object_datasource: $('#dash_data_src').val(),
        dashboard_columns: JSON.stringify($('#dash_col_data_src').val()),
        dashboard_background_color: $('#dash_bg').val(),
        dashbarod_foreground_color: $('#dash_fg').val()
    }
    
    $.ajax({
        async: false,
        type: "POST",
        url: "/Dashboard/InsertDashboard",
        data: {
            dashboard: JSON.stringify(dash_obj),
        },
        success: function (response) {
            data = JSON.parse(response.result);
            console.log(data);
        },
        error: function (error) {

        }
    });
}

