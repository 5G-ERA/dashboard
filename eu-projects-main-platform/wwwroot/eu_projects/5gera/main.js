setTimeout(() => {
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');
    RenderSideMenuItems();
    HomeView()
    LightMode();
}, 500);



function LightMode() {
    let HTML = '';
    HTML += '<a class="nav-link d-block mainimagehtmlcode 5gERA" href="#"><img class="sidebar-brand-logo" src="/images/platform_logos/5gera/5gera.png" width="200" alt="">'
    HTML += '<img class="sidebar-brand-logomini" src = "/images/platform_logos/5gera/5gera_mini.png" width = "50" alt = "" ></a >';
    $('.mainimagehtmlcode').html(HTML);

    $('.main-panel').addClass('lightMode').removeClass('darkMode')
    _graphTheme = 'light1';
    SideBarLightMode();
    ApplyLightStyles();

}

function DarkMode() {
    let HTML = '';
    HTML += '<a class="nav-link d-block mainimagehtmlcode 5gERA" href="#"><img class="sidebar-brand-logo" src="/images/platform_logos/5gera/5gera_dark.png" width="200" alt="">'
    HTML += '<img class="sidebar-brand-logomini" src = "/images/platform_logos/5gera/5gera_mini_dark.png" width = "50" alt = "" ></a >';
    $('.mainimagehtmlcode').html(HTML);

    $('.main-panel').addClass('darkMode').removeClass('lightMode')
    _graphTheme = 'dark2';
    SideBarDarkMode();
    ApplyDarkStyles();
}

function HomeView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5gera/retrieveHomeView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML);
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');
    graph();
}

function retrievePortalView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5gera/retrievePortalView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
  
        }
    });
    $('#main-platform-content').empty().append(HTML);
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');
}

function ShowConverterView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5gera/ShowConverterView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML);
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');
    $("#task_priority_drp").chosen({ search_contains: true });
}


function dropdownList() {
	var row_val = $("#dropdown option:selected").val();
	// alert("This is " + row_val);
	var errorString = "Something went wrong in the controller.";
	if (row_val == "robot_task") {
		$.ajax({
			type: "GET",
			url: "/_5gera/_GridGetDataRobotTask",
			success: function (resp) {
				$("#robot_tasks").html(resp);
			}, error: function () {
				alert("Something went wrong in the controller.");
			}
		});
	}
	else if (row_val == "cloud") {
		$.ajax({
			type: "GET",
			url: "/_5gera/_GridGetDataCloud",
			success: function (resp) {
				$("#robot_tasks").html(resp);
			}, error: function () {
				alert("Something went wrong in the controller.");
			}
		});
	}
	else if (row_val == "action") {
		$.ajax({
			type: "GET",
			url: "/_5gera/_GridGetDataAction",
			success: function (resp) {
				$("#robot_tasks").html(resp);
			},
			error: function () {
				alert(errorString);
			}
		});
	}
	else if (row_val == "edge") {
		$.ajax({
			type: "GET",
			url: "/_5gera/_GridGetDataEdge",
			success: function (resp) {
				$("#robot_tasks").html(resp);
			}, error: function () {
				alert("Something went wrong in the controller.");
			}
		});
	}
	else if (row_val == "netApps") {
		$.ajax({
			type: "GET",
			url: "/_5gera/_GridGetDataNetApps",
			success: function (resp) {
				$("#robot_tasks").html(resp);
			}, error: function () {
				alert("Something went wrong in the controller.");
			}
		});
	}
	else if (row_val == "robots") {
		$.ajax({
			type: "GET",
			url: "/_5gera/_GridGetDataRobots",
			success: function (resp) {
				$("#robot_tasks").html(resp);
			}, error: function () {
				alert("Something went wrong in the controller.");
			}
		});
	}
}
function showPolicy() {
	$.ajax({
		type: "GET",
		url: "/_5gera/_GetMiddlewarePolicy",
		success: function (resp) {
			$("#middleware_policy").html(resp);
		}, error: function () {
			alert("Something went wrong in the controller.");
		}
	});
}
function AddEditPolicy(id) {
	var url = "/_5gera/AddMiddlewarePolicy?id=" + id;

	$("#myModalBodyDiv1").load(url, function () {
		$("#myModal1").modal("show");

	})
}
function AddRobotTask(id) {
	var url = "/_5gera/AddRobotTask?id=" + id;

	$("#myModalBodyDiv1").load(url, function () {
		$("#myModal1").modal("show");

	})
}
function AddCloud(id) {
	var url = "/_5gera/AddCloud?id=" + id;

	$("#myModalBodyDiv1").load(url, function () {
		$("#myModal1").modal("show");

	})
}

