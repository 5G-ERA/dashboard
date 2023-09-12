$(function () {
    CreateAlertTresholdTable();
    CreateProjectUsersTable();
});

/*ALERT SECTION*/

function CreateAlertTresholdTable() {
    var userId = $('#user_id').val();

    var alerts = RetrieveUserAlertTresholds(userId);

    var html = '';

    html += '<table id="alerts_table" class="table table-striped" style="width:100%">';
    html += '<thead>';
    html += '<tr>';
    html += '<th style="display:none">AlertTresholdId</th>'
    html += '<th>Name</th>';
    html += '<th>Type</th>';
    html += '<th>Table</th>';
    html += '<th>Min Threshold</th>';
    html += '<th>Max Threshold</th>';
    html += '<th>Is Active</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    if (alerts.length > 0) {
        for (var i = 0; i < alerts.length; i++) {
            html += '<tr>';
            html += '<td class="' + alerts[i].AlertThresholdId +'" style="display:none">' + alerts[i].AlertThresholdId + '</td>';
            html += '<td>' + alerts[i].AlertThresholdName + '</td>';
            html += '<td>' + alerts[i].AlertThresholdType + '</td>';
            html += '<td>' + alerts[i].AlertThresholdTable + '</td>';
            html += '<td style="text-align:center">' + alerts[i].MinValue + '</td>';
            html += '<td style="text-align:center">' + alerts[i].MaxValue + '</td>';

            var icon = (alerts[i].IsActive) ? '<i class="fa-solid fa-circle" style="color:#198754; font-size:1.4em"></i>' : '<i class="fa-solid fa-circle" style="color:#dc3545; font-size:1.4em"></i>'
            
            html += '<td style="text-align:center">' + icon + '</td>';
            html += '</tr>';
        }
    }
    
    html += '</tbody>';
    html += '        <input type="hidden" id="selected_alertThreshold_id"/>';
    html += '</table>';

    $('#alert_sytem_setting').empty().append(html);
    var table = $('#alerts_table').DataTable();

    $('#alerts_table tbody').on('click', 'tr', function () {
        

        if ($(this).hasClass('selected')) {

            $(this).removeClass('selected');
            $('#edit_alert_btn').addClass('isDisabled');
            $('#delete_alert_btn').addClass('isDisabled');
            $('#selected_alertThreshold_id').val(-1);

        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#edit_alert_btn').removeClass('isDisabled');
            $('#delete_alert_btn').removeClass('isDisabled');
            var thresholdId = parseFloat(this.firstElementChild.className);

            $('#selected_alertThreshold_id').val(thresholdId);
        }
    });
}

function OpenCreateAlertConfigModal() {
    var button = 'add'
    var html = '';

    html += '<div id="modal_planet" class="modal">';
    html += '	<div class="modal-content custom-modal-content">';
    html += '		<div class="modal-header">';
    if (button == 'add')
        html += '<h4>Add New Alert Threshold</h4>';
    else
        html += '<h4>Edit Inspect Rule</h4>';
    html += '	<span onclick="CloseModal()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '	<div class="modalwidth90">'
    html += '		<div class="modalbody_class">'
    html += '<br/>'
    html += '			<div class="row">' /*start of div class 1st row*/
    html += '						<div class="col-2">'
    html += '							Name:'
    html += '						</div>'
    html += '						<div class="col-4">'
    html +=
        '							<input class="inputclass" type="text" id="alert_name" style="margin:-4px;" required placeholder="Enter your Alert Threshold name here...">';

    html += '						</div>'
    html += '<div class="col-2">  Table: </div>'
    html += '                       <div class="col-4" style="margin:0">'
    html += '                           <select id="thresholdTable_id" onchange="OnTableTresholdChange()">'
    html += '							<option value="T&T Table">Track & Trace Table</option>'
    html += '							<option value="DSS Table">DSS: Last Mile Table</option>'
    html += '							</select>'
    html += '                       </div >'
    html += '           </div>'; /*start of div class 2st row*/

    html += '<br/>'

    html += '	<div class="row">' /*start of div class 1st row*/
    html += '		<div class="col-sm-6">' /*start of div class 1st col-6*/
    html += '			<div class="row">'
    html += '				<div class="col-sm-6">'
    html += '					Is Active'
    html += '				</div>'
    html += '				<div class="col-sm-6">'
    html += '					<select id="thresholdStatus_id">'
    html += '							<option value="true">Yes</option>'
    html += '							<option value="false">No</option>'
    html += '					</select>'
    html += '				</div>'
    html += '			</div>'
    html += '		</div>';
    html += '<div class="col-2">  Type: </div>'
    html += '                       <div id="thresholdType_block" class="col-4" style="margin:0">'
    html += '                           <select id="thresholdType_id">'
    html += '							<option value="Temperature">Temperature</option>'
    html += '							<option value="Humidity">Humidity</option>'
    html += '							<option value="Battery">Battery</option>'
    html += '							<option value="Luminance">Luminance</option>'
    html += '							<option value="AccelerationX">Acceleration-X</option>'
    html += '							<option value="AccelerationY">Acceleration-Y</option>'
    html += '							<option value="AccelerationZ">Acceleration-Z</option>'
    html += '							</select>'
    html += '                       </div >'
    html += '           </div>'; /*start of div class 2st row*/

    html += '<br/>'

    html += '	<div class="row">' /*start of div class 1st row*/
    html += '		<div class="col-sm-6">' /*start of div class 1st col-6*/
    html += '			<div class="row">'
    html += '				<div class="col-sm-6">'
    html += '					Minimum Threshold'
    html += '				</div>'
    html += '				<div class="col-sm-6">'
    html += '					<input class="inputclass" type="number" id="lowvalue_id">'
    html += '				</div>'
    html += '			</div>'
    html += '		</div>'
    html += '		<div class="col-sm-6">' /*start of div class 1st col-6*/
    html += '			<div class="row">'
    html += '				<div class="col-sm-6">'
    html += '					Maximum Threshold'
    html += '				</div>'
    html += '				<div class="col-sm-6">'
    html += '					<input class="inputclass" type="number" id="maxvalue_id">'
    html += '				</div>'
    html += '			</div>'
    html += '		</div>';
    html += '     </div>';
    html += '</div>'

    html += '<hr/>'
    /*END OF ROW OF 2*/
    html += '			<div class="row" style="padding: 4px !important;">'
    html += '				<div class="col-sm-12 modaloverwriteerror">'
    html += '				</div>';
    html += '			</div>';
    html += '<div class="row">'
    html += '<div class="col-sm-12 modaladdediterror">'
    html += '</div>';
    html += '</div>';
    html += '<div class="row">'
    html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'

    if (button == 'add') {
        html += '<button class="btn btn-success btn-with-icon" onclick="SaveAlertTreshold()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
        html += '<button class="btn btn-outline-secondary btn-with-icon" onclick="CloseModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';
    }
    else {
        html += '<button class="btn btn-dark btn-with-icon" onclick="SubmitEditInspectRule()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
        html += '<button class="btn btn-outline-secondary btn-with-icon" onclick="CloseModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';
    }
    html += '</div>';
    html += '</div>';
    html += '<p>'
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="width90">' /*end of width90 div*/
    html += '<div>' /*end of mainbodyborder div*/
    html += '</div>'
    html += '</div>';

    $('.homemodal').empty().append(html);

    $('#thresholdStatus_id').chosen({ search_contains: true });
    $('#thresholdType_id').chosen({ search_contains: true });
    $('#thresholdTable_id').chosen({ search_contains: true });
    $('#modal_planet').show();
}

function CloseModal() {
    $('#modal_planet').remove();
}

function CloseSubModal() {
    $('#sub_modal_planet').remove();
}

function SaveAlertTreshold() {
    var alertName = $('#alert_name').val();
    var thresholdType = $('#thresholdType_id').val();
    var minValue = $('#lowvalue_id').val();
    var maxValue = $('#maxvalue_id').val();
    var status = $('#thresholdStatus_id').val();
    var userId = $('#user_id').val();
    var table = $('#thresholdTable_id').val();

    var valid = true;

    if (valid == true) {
        CloseModal();
        $.ajax({
            type: "POST",
            url: "/Settings/AddNewAlertThreshold",
            data: {
                name: alertName,
                type: thresholdType,
                maxValue: maxValue,
                minValue: minValue,
                userId: userId,
                status: status,
                table: table
            },
            beforeSend: function () {
                ShowOverlayLoader();
            },
            success: function (response) {
                if (response.status === "success") {
                    ShowSuccessMessage("New Alert Threshold Configured Successfully!");
                    CreateAlertTresholdTable();
                } else {
                    ShowErrorMessage(response.content);
                }
                HideOverlayLoader();

            },
            error: function (error) {
                ShowErrorMessage(error);
            }
        });
        ResetHeaderButtons();
    } else {
        $(".modaloverwriteerror").empty().append('<label class=".alert-danger-login alert alert-danger" style="width: 100%">' + errormessage + '</label>');
    }
}

function ResetHeaderButtons() {
    $('#edit_alert_btn').addClass('isDisabled');
    $('#delete_alert_btn').addClass('isDisabled');
}

function OpenEditAlertConfigModal() {
    var alertId = $('#selected_alertThreshold_id').val();

    var alert = RetrieveAlertThresholdDetails(alertId);

    var button = 'edit'
    var html = '';

    html += '<div id="modal_planet" class="modal">';
    html += '	<div class="modal-content custom-modal-content">';
    html += '		<div class="modal-header">';
    if (button == 'add')
        html += '<h4>Add New Alert Threshold</h4>';
    else
        html += '<h4>Edit Alert Threshold</h4>';
    html += '	<span onclick="CloseModal()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '	<div class="modalwidth90">'
    html += '		<div class="modalbody_class">'
    html += '<br/>'
    html += '			<div class="row">' /*start of div class 1st row*/
    html += '						<div class="col-2">'
    html += '							Name:'
    html += '						</div>'
    html += '						<div class="col-4">'
    html += '						<input type="hidden" id="alert_ThresholdId" value="'+alert.AlertThresholdId+'">'
    html +=
        '							<input class="inputclass" type="text" value="' + alert.AlertThresholdName +'" id="alert_name" style="margin:-4px;" required placeholder="Enter your Alert Threshold name here...">';

    html += '						</div>'
    html += '<div class="col-2">  Table: </div>'
    html += '                       <div class="col-4" style="margin:0">'
    html += '                           <select id="thresholdTable_id" onchange="OnTableTresholdChange()">'
    html += '							<option value="T&T Table">Track & Trace Table</option>'
    html += '							<option value="DSS Table">DSS: Last Mile Table</option>'
    html += '							</select>'
    html += '                       </div >'
    html += '           </div>'; /*start of div class 2st row*/

    html += '<br/>'

    html += '	<div class="row">' /*start of div class 1st row*/
    html += '		<div class="col-sm-6">' /*start of div class 1st col-6*/
    html += '			<div class="row">'
    html += '				<div class="col-sm-6">'
    html += '					Is Active'
    html += '				</div>'
    html += '				<div class="col-sm-6">'
    html += '					<select id="thresholdStatus_id">'
    if (alert.IsActive) {
        html += '							<option selected value="true">Yes</option>'
        html += '							<option value="false">No</option>'
    } else {
        html += '							<option value="true">Yes</option>'
        html += '							<option selected value="false">No</option>'
    }
    html += '					</select>'
    html += '				</div>'
    html += '			</div>'
    html += '		</div>';
    html += '<div class="col-2">  Type: </div>'
    html += '                       <div id="thresholdType_block" class="col-4" style="margin:0">'
    html += '                           <select id="thresholdType_id">'
    html += '							<option value="Temperature">Temperature</option>'
    html += '							<option value="Humidity">Humidity</option>'
    html += '							<option value="Battery">Battery</option>'
    html += '							<option value="Luminance">Luminance</option>'
    html += '							<option value="AccelerationX">Acceleration-X</option>'
    html += '							<option value="AccelerationY">Acceleration-Y</option>'
    html += '							<option value="AccelerationZ">Acceleration-Z</option>'
    html += '							</select>'
    html += '                       </div >'
    html += '           </div>'; /*start of div class 2st row*/

    html += '<br/>'

    html += '	<div class="row">' /*start of div class 1st row*/
    html += '		<div class="col-sm-6">' /*start of div class 1st col-6*/
    html += '			<div class="row">'
    html += '				<div class="col-sm-6">'
    html += '					Minimum Threshold'
    html += '				</div>'
    html += '				<div class="col-sm-6">'
    html += '					<input class="inputclass" type="number" id="lowvalue_id" value="' + alert.MinValue +'">'
    html += '				</div>'
    html += '			</div>'
    html += '		</div>'
    html += '		<div class="col-sm-6">' /*start of div class 1st col-6*/
    html += '			<div class="row">'
    html += '				<div class="col-sm-6">'
    html += '					Maximum Threshold'
    html += '				</div>'
    html += '				<div class="col-sm-6">'
    html += '					<input class="inputclass" type="number" id="maxvalue_id" value="' + alert.MaxValue +'">'
    html += '				</div>'
    html += '			</div>'
    html += '		</div>';
    html += '     </div>';
    html += '</div>'

    html += '<hr/>'
    /*END OF ROW OF 2*/
    html += '			<div class="row" style="padding: 4px !important;">'
    html += '				<div class="col-sm-12 modaloverwriteerror">'
    html += '				</div>';
    html += '			</div>';
    html += '<div class="row">'
    html += '<div class="col-sm-12 modaladdediterror">'
    html += '</div>';
    html += '</div>';
    html += '<div class="row">'
    html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'

    html += '<button class="btn btn-success btn-with-icon" onclick="EditAlertTreshold()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Update</button>';
    html += '<button class="btn btn-outline-secondary btn-with-icon" onclick="CloseModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';

    html += '</div>';
    html += '</div>';
    html += '<p>'
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="width90">' /*end of width90 div*/
    html += '<div>' /*end of mainbodyborder div*/
    html += '</div>'
    html += '</div>';

    $('.homemodal').empty().append(html);
    
    $('#thresholdTable_id').val(alert.AlertThresholdTable);
    OnTableTresholdChange();

    $('#thresholdType_id').val(alert.AlertThresholdType);

    $('#thresholdStatus_id').chosen({ search_contains: true });
    $('#thresholdType_id').chosen({ search_contains: true });
    $('#thresholdTable_id').chosen({ search_contains: true });
    $('#modal_planet').show();
}

function EditAlertTreshold() {
    var alertName = $('#alert_name').val();
    var thresholdType = $('#thresholdType_id').val();
    var minValue = $('#lowvalue_id').val();
    var maxValue = $('#maxvalue_id').val();
    var status = $('#thresholdStatus_id').val();
    var userId = $('#user_id').val();
    var table = $('#thresholdTable_id').val();
    var alertId = $('#alert_ThresholdId').val();
    console.log(alertId)

    var valid = true;

    if (valid == true) {
        CloseModal();
        $.ajax({
            type: "POST",
            url: "/Settings/EditAlertThreshold",
            data: {
                name: alertName,
                type: thresholdType,
                maxValue: maxValue,
                minValue: minValue,
                userId: userId,
                status: status,
                table: table,
                alertId: alertId
            },
            beforeSend: function() {
                ShowOverlayLoader();
            },
            success: function(response) {
                if (response.status === "success") {
                    ShowSuccessMessage("Alert Threshold Configuration Edited Successfully!");
                    CreateAlertTresholdTable();
                } else {
                    ShowErrorMessage(response.content);
                }
                HideOverlayLoader();

            },
            error: function(error) {
                ShowErrorMessage(error);
            }
        });
        ResetHeaderButtons();
    } else {
        $(".modaloverwriteerror").empty()
            .append('<label class=".alert-danger-login alert alert-danger" style="width: 100%">' +
                errormessage +
                '</label>');
    }
}

function DeleteAlertConfig() {

    var alertId = $('#selected_alertThreshold_id').val();

    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Alert Threshold Configuration",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/Settings/DeleteAlertThreshold",
                    data: {
                        alertId: alertId
                    },
                    success: function (response) {
                        
                        if (response.status === "success") {
                            ShowSuccessMessage("Alert Threshold Configuration Deleted!");
                            CreateAlertTresholdTable();
                        }
                    },
                    error: function (error) {

                    }
                });
            }
        });
}

function RetrieveUserAlertTresholds(userId) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Settings/RetrieveUserAlertThresholds",
        data: { userId: userId},
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

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

function ShowOverlayLoader() {
    $('#main-platform-content').LoadingOverlay("show", {
        text: "Loading...",
        textColor: "#131313",
        imageColor: "#3e4b5b",
    });
}

function HideOverlayLoader() {
    $('#main-platform-content').LoadingOverlay("hide");
}

function OnTableTresholdChange() {
    var selectedValue = $('#thresholdTable_id').val();

    var html = '';

    if (selectedValue === 'DSS Table') {
        html += '                     <select id="thresholdType_id">'
        html += '							<option value="ETA2">Estimated Time of Arrival (ETA2 in hrs)</option>';
        html += '                       </select>'
    } else {
        html += '                     <select id="thresholdType_id">'
        html += '							<option value="Temperature">Temperature</option>';
        html += '							<option value="Humidity">Humidity</option>'
        html += '							<option value="Battery">Battery</option>'
        html += '							<option value="Luminance">Luminance</option>'
        html += '							<option value="AccelerationX">Acceleration-X</option>'
        html += '							<option value="AccelerationY">Acceleration-Y</option>'
        html += '							<option value="AccelerationZ">Acceleration-Z</option>'
        html += '                       </select>'
    }
    $('#thresholdType_block').empty().append(html);
    $('#thresholdType_id').chosen({ search_contains: true });
}

function RetrieveAlertThresholdDetails(alertId) {
    var alert;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Settings/RetrieveAlertThresholdDetails",
        data: { alertId: alertId },
        success: function (response) {
            alert = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });

    return alert;
}

/*END ALERT SECTION*/

/*USERS AND PERMISSION*/

function CreateProjectUsersTable() {


    var userGroups = RetrievePlanetUserGroups();

    var html = '';

    html += '<ul id="user_group_menu_grid_card" class="square-menu-small">';

    for (var i = 0; i < userGroups.length; i++) {
        html += '<li onclick="ViewGroupDetails(' + userGroups[i].DepartmentId+')">'
        html += '<div>';
        var name = (userGroups[i].DepartmentName.length > 19)
            ? userGroups[i].DepartmentName.substring(0, 16) + '...'
            : userGroups[i].DepartmentName;

        html += '<i class="fa-solid fa-user-group mainMenuIcon" style="font-size:27px"></i><h6 style="font-size:12px">' + name + '</h6>'
        html += '</div>'
        html += '</li>'
    }

    html += '</ul>';

    $('#user_list').empty().append(html);
}

function RetrieveUserProjectPerId(projectId) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Settings/RetrieveProjectUsersPerProject",
        data: { projectId: projectId },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrievePlanetUserGroups() {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrievePlanetUserGroups",
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });

    return data;
}

function RetrieveDepartmentDetailsPerId(departemntId) {
    var allDepartments = RetrievePlanetUserGroups();

    var arr = allDepartments.filter(d => d.DepartmentId === departemntId);

    return arr[0];
}

function OpenCreateNewGroupModal() {
    var html = '';

    html += '<div id="sub_modal_planet" class="modal">';
    html += '	<div class="modal-content custom-modal-content" style="width:45% !important">';
    html += '		<div class="modal-header">';
    html += '           <h4>Add Existing User To Group</h4>';
    html += '	        <span onclick="CloseSubModal()" class="close">&times;</span>';
    html += '       </div>';
    html += '       <div class="mainbodyborder">'
    html += '	        <div class="modalwidth90">'
    html += '		        <div class="modalbody_class">'
    html += '                   <div class="row">'
    html += '                       <div class="col-4" style="align-self:center">Group Name: </div>';
    html += '                       <div class="col-6"><input type="text" id="new_group_name" class="form-control" value="" style="height:1.5rem"></div>'
    html += '                       <div class="col-sm-12 modaladdediterror">'
    html += '                   </div>';
    html += '               </div>';
    html += '<hr/>'
    html += '               <div class="row">'
    html += '                   <div class="col-sm-12 modalbuttons main-buttons-with-icons">'
    html += '                       <button class="btn btn-success btn-with-icon" onclick="OnAddNewGroup()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
    html += '                       <button class="btn btn-outline-secondary btn-with-icon" onclick="CloseSubModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';
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
}

function OnAddNewGroup() {
    var groupName = $('#new_group_name').val();

    if (groupName.length === 0) {
        $('.modaladdediterror').empty()
            .append(
                '<label class=".alert-danger-login alert alert-danger">Group name cannot be null or empty!</label>');
    } else {
        $.ajax({
            async: false,
            type: "POST",
            url: "/Planet/AddNewGroup",
            data: { groupName: groupName },
            success: function (response) {
                if (response.message === 'FAIL') {
                    CloseSubModal();
                    ShowErrorMessage();
                } else {
                    CloseSubModal();
                    CreateProjectUsersTable();
                    ShowSuccessMessage("New Group Created Successfully!");

                }
            },
            error: function (error) {

            }
        });
    }
}

function ViewGroupDetails(departmentId) {

    var selectedDepartment = RetrieveDepartmentDetailsPerId(departmentId);
    var html = '';

    html += '<div id="modal_planet" class="modal">';
    html += '	<div class="modal-content custom-modal-content" style="margin-top:10%">';
    html += '		<div class="modal-header">';
    html += '           <h4>View User Group Details ---- ' + selectedDepartment.DepartmentName.toUpperCase() + ' ----</h4>';
    html += '           <input type="hidden" id="dept_value" value="' + departmentId+'">'
    html += '	        <span onclick="CloseModal()" class="close">&times;</span>';
    html += '       </div>';
    html += '       <div class="mainbodyborder">'
    html += '	        <div class="modalwidth90">'
    html += '		        <div class="modalbody_class">'
    html += '                   <nav>';
    html += '                      <div class="nav nav-tabs" id = "nav-tab" role = "tablist">';
    html += '                           <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Members</button>';
    html += '                           <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Permissions</button>';
    html += '                      </div >';
    html += '                   </nav >';
    html += '			        <div class="row" style="height:auto;padding:3%">'
    html += '                       <div class="tab-content" id="nav-tabContent">';
    html += '                           <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">';
    html += '                               <div class="d-grid gap-2 d-md-flex justify-content-md-end">';
    html += '                                   <button class="btn btn-success me-md-2" type="button" onclick="OpenAddExistingUserModal()" style="margin-right: 5px; background-color: #3D6D57" > <i class="fas fa-user-plus" style="color:white"></i> Add Existing User</button >'
    html += '                                   <button class="btn btn-success" type="button" onclick="OpenAddUserModal()" style="margin-right: 5px;background-color: #3D6D57"><i class="fa-solid fa-plus" style="color:white"></i> Add New User</button>'
    html += '                                   <button id="edit_user_btn" class="btn btn-secondary isDisabled" type="button" onclick="OpenEditUserModal()" style="margin-right: 5px;><i class="fa-solid fa-pencil" style="color:white"></i> Edit User</button>'
    html += '                                   <button id="remove_user_btn" class="btn btn-danger isDisabled" type="button" onclick="RemoveSelectedUser()" style="margin-right: 5px;"><i class="fa-solid fa-user-minus" style="color:white"></i> Remove User</button>';
    html += '                               </div>';
    html += '                               <div id="group_members_block">';
    html += RetrieveUserMembersPerDepartmentTable(selectedDepartment.DepartmentId);
    html += '                               </div>'
    html += '                           </div>';
    html += '                           <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">';
    html += '                               <div style="width:100%; height:auto" class="row">'
    html += '                                   <div class="col-11" style="max-height:20rem; overflow-y:auto">';
    html += GenerateAllPlanetPermissionChexBoxes();
    html += '                                   </div>';
    html += '<hr/>'
    html += '               <div class="row">'
    html += '                   <div class="col-sm-12 modalbuttons main-buttons-with-icons" style="margin-bottom: 10px;padding-right: 50px;">'
    html += '                       <button class="btn btn-success btn-with-icon" onclick="OnSavePermissionsToGroup()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
    html += '                       <button class="btn btn-outline-secondary btn-with-icon" onclick="CloseModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';
    html += '                   </div>';
    html += '               </div>';
    html += '                               </div>'
    html += '                           </div>';
    html += '                       </div>';
    html += '                   </div>'
    html += '                   <div class="row">'
    html += '                       <div class="col-sm-12 modaladdediterror">'
    html += '                   </div>';
    html += '               </div>';

    html += '           </div>';
    html += '           <div class="width90">' /*end of width90 div*/
    html += '           <div>' /*end of mainbodyborder div*/
    html += '       </div>';
    html += '   </div>';
    html += '</div>';


    $('.homemodal').empty().append(html);
    $('#modal_planet').show();

    SetDepartmentPermissions(departmentId);

    var table = $('#users_table').DataTable({
        info: false,
        searching: false
    });

    $('#users_table tbody').on('click', 'tr', function () {


        if ($(this).hasClass('selected')) {

            $(this).removeClass('selected');
            $('#remove_user_btn').addClass('isDisabled');
            $('#edit_user_btn').addClass('isDisabled');
            $('#selected_user_id').val(-1);

        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#remove_user_btn').removeClass('isDisabled');
            $('#edit_user_btn').removeClass('isDisabled');
            var userId = parseFloat(this.firstElementChild.className);

            $('#selected_user_id').val(userId);
        }
    });
}

function RemoveSelectedUser() {
    var selectedUserId = $('#selected_user_id').val();
    var departmentId = $('#dept_value').val();

    swal({
            title: "Are you sure?",
            text: "Once removed, this user will no more belongs to this group",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/Planet/RemoveUser2Department",
                    data: {
                        userId: selectedUserId,
                        departmentId: departmentId
                    },
                    success: function (response) {
                        CloseSubModal();
                        CloseModal();
                    },
                    error: function (error) {

                    }
                });
            }
        });
}

function OpenAddExistingUserModal() {

    var projectId = $('#project_id').val();

    var users = RetrieveUserProjectPerId(projectId).filter(u => u.DepartmentId === 0);

    var html = '';

    html += '<div id="sub_modal_planet" class="modal">';
    html += '	<div class="modal-content custom-modal-content" style="width:45% !important">';
    html += '		<div class="modal-header">';
    html += '           <h4>Add Existing User To Group</h4>';
    html += '	        <span onclick="CloseSubModal()" class="close">&times;</span>';
    html += '       </div>';
    html += '       <div class="mainbodyborder">'
    html += '	        <div class="modalwidth90">'
    html += '		        <div class="modalbody_class">'
    html += '                   <div class="row">'
    html += '                       <div class="col-4">Select User: </div>'
    html += '                       <div class="col-8"><select id="user_drp_id">';
    for (var i = 0; i < users.length; i++) {
        if (users[i].Username !== 'planet') {
            html += '<option value="'+ users[i].UserId +'">'+ users[i].Username +'</option>'
        }
    }
    html += '                       </select> </div>'
    html += '                       <div class="col-sm-12 modaladdediterror">'
    html += '                   </div>';
    html += '               </div>';
    html += '<hr/>'
    html += '               <div class="row">'
    html += '                   <div class="col-sm-12 modalbuttons main-buttons-with-icons">'
    html += '                       <button class="btn btn-success btn-with-icon" onclick="OnAddExistingUserToDepartment()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
    html += '                       <button class="btn btn-outline-secondary btn-with-icon" onclick="CloseSubModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';
    html += '                   </div>';
    html += '               </div>';
    html += '           </div>';
    html += '           <div class="width90">' /*end of width90 div*/
    html += '           <div>' /*end of mainbodyborder div*/
    html += '       </div>';
    html += '   </div>';
    html += '</div>';


    $('.homesubmodal').empty().append(html);
    $('#user_drp_id').chosen({ search_contains: true });
    $('#sub_modal_planet').show();
}

function OnAddExistingUserToDepartment() {
    var userId = $('#user_drp_id').val();
    var departmentId = $('#dept_value').val();

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/AddExistingUser2Department",
        data: {
            userId: userId,
            departmentId: departmentId
        },
        success: function (response) {
            CloseSubModal();
            CloseModal();
            swal({
                title: "Existing User added successfully in the group!",
                icon: "success",
                button: "Done",
            });
        },
        error: function (error) {

        }
    });
}

function OpenAddUserModal() {
    var html = '';

    html += '<div id="sub_modal_planet" class="modal">';
    html += '	<div class="modal-content custom-modal-content" style="width:45% !important">';
    html += '		<div class="modal-header">';
    html += '           <h4>Add New User</h4>';
    html += '	        <span onclick="CloseSubModal()" class="close">&times;</span>';
    html += '       </div>';
    html += '       <div class="mainbodyborder">'
    html += '	        <div class="modalwidth90">'
    html += '		        <div class="modalbody_class">'
    html += '                   <div class="row">'
    html += '                       <div class="col-sm-12 modaladdediterror">'
    html += '                   </div>';
    html += '               </div>';

    html += '       <div class="row">'
    html += '           <div class="col-md-6" >'
    html += '               <div class="form-group">'
    html += '                   <label>First Name</label>'
    html += '                   <input type="text" id="username" class="form-control" value="">'
    html += '               </div>'
    html += '           </div>'
    html += '           <div class="col-md-6">'
    html += '               <div class="form-group">'
    html += '                   <label>Last Name</label>'
    html += '                   <input type="text" id="fullname" class="form-control" value="">'
    html += '               </div>'
    html += '           </div>'
    html += '           <div class="col-md-6">'
    html += '               <div class="form-group">'
    html += '                   <label>Password</label>'
    html += '                   <input type="password" id="user_password" class="form-control" value="">'
    html += '               </div>'
    html += '           </div>'
    html += '           <div class="col-md-6">'
    html += '               <div class="form-group">'
    html += '                   <label>Confirm Password</label>'
    html += '                   <input type="password" id="user_confirmPassword" class="form-control" value="">'
    html += '               </div>'
    html += '           </div>'
    html += '      </div>'

    html += '<hr/>'

    html += '               <div class="row">'
    html += '                   <div class="col-sm-12 modalbuttons main-buttons-with-icons">'
    html += '                       <button class="btn btn-success btn-with-icon" onclick="OnAddNewUserToGroup()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
    html += '                       <button class="btn btn-outline-secondary btn-with-icon" onclick="CloseSubModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';
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
}

function OnAddNewUserToGroup() {
    var username = $('#username').val();
    var fullname = $('#fullname').val();
    var password = $('#user_password').val();
    var confirmPassword = $('#user_confirmPassword').val();
    var projectId = $('#project_id').val();
    var departmentId = $('#dept_value').val();

    var isValid = false;
    var errormessage = '';

    if (password.length === confirmPassword.length && password.localeCompare(confirmPassword) === 0) {
        if (username.toLowerCase().localeCompare('planet') === 0) {
            isValid = false;
            errormessage =
                'Sorry but this username is <b>Reserved for admin user only!</b> Try a different one please...'
        } else {
            isValid = true;
        }

    } else {
        isValid = false;
        errormessage = 'The 2 password doesn\'t match! Try again please...'
    }

    if (isValid == false) {
        $('.modaladdediterror').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>')
    }
    else {
        $.ajax({
            async: false,
            type: "POST",
            url: "/Planet/AddNewUserToDepartment",
            data: {
                username: username,
                fullname: fullname,
                password: password,
                projectId: projectId,
                departmentId: departmentId
            },
            success: function (response) {
                CloseSubModal();
                CloseModal();
                swal({
                    title: "New User added in the group",
                    icon: "success",
                    button: "Done",
                });
            },
            error: function (error) {

            }
        });
    }
}

function OpenEditUserModal() {
    var selectedUserId = $('#selected_user_id').val();

    var user = RetrieveUserDetailsPerId(selectedUserId);

    var html = '';

    html += '<div id="sub_modal_planet" class="modal">';
    html += '	<div class="modal-content custom-modal-content" style="width:45% !important">';
    html += '		<div class="modal-header">';
    html += '           <h4>Edit User</h4>';
    html += '	        <span onclick="CloseSubModal()" class="close">&times;</span>';
    html += '       </div>';
    html += '       <div class="mainbodyborder">'
    html += '	        <div class="modalwidth90">'
    html += '		        <div class="modalbody_class">'
    html += '                   <div class="row">'
    html += '                       <div class="col-sm-12 modaladdediterror">'
    html += '                   </div>';
    html += '               </div>';

    html += '       <div class="row">'
    html += '           <div class="col-md-6" >'
    html += '               <div class="form-group">'
    html += '                   <label>First Name</label>'
    html += '                   <input type="text" id="new_username" class="form-control" value="' + user.Username + '">'
    html += '                   <input type="hidden" id="old_user_id" value="' + user.UserId + '">'
    html += '               </div>'
    html += '           </div>'
    html += '           <div class="col-md-6">'
    html += '               <div class="form-group">'
    html += '                   <label>Last Name</label>'
    html += '                   <input type="text" id="new_fullname" class="form-control" value="' + user.Fullname +'">'
    html += '               </div>'
    html += '           </div>'
    html += '           <div class="col-md-6">'
    html += '               <div class="form-group">'
    html += '                   <label>Password</label>'
    html += '                   <input type="password" id="new_password" class="form-control" value="' + user.Password +'">'
    html += '               </div>'
    html += '           </div>'
    html += '           <div class="col-md-6">'
    html += '               <div class="form-group">'
    html += '                   <label>Confirm Password</label>'
    html += '                   <input type="password" id="new_confirmPassword" class="form-control" value="' + user.Password +'">'
    html += '               </div>'
    html += '           </div>'
    html += '      </div>'

    html += '<hr/>'
    html += '               <div class="row">'
    html += '                   <div class="col-sm-12 modalbuttons main-buttons-with-icons">'
    html += '                       <button class="btn btn-success btn-with-icon" onclick="OnEditUserDetails()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
    html += '                       <button class="btn btn-outline-secondary btn-with-icon" onclick="CloseSubModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';
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
}

function OnEditUserDetails() {
    var userId = $('#old_user_id').val();
    var username = $('#new_username').val();
    var fullname = $('#new_fullname').val();
    var password = $('#new_password').val();
    var confirmPassword = $('#new_confirmPassword').val();

    var isValid = false;
    var errormessage = '';

    if (password.length === confirmPassword.length && password.localeCompare(confirmPassword) === 0) {
        if (username.toLowerCase().localeCompare('planet') === 0) {
            isValid = false;
            errormessage =
                'Sorry but this username is <b>Reserved for admin user only!</b> Try a different one please...'
        } else {
            isValid = true;
        }
        
    } else {
        isValid = false;
        errormessage = 'The 2 password doesn\'t match! Try again please...'
    }

    if (isValid == false) {
        $('.modaladdediterror').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>')
    }
    else {
        $.ajax({
            async: false,
            type: "POST",
            url: "/Planet/EditProjectUserDetails",
            data: {
                userId: userId,
                username: username,
                fullname: fullname,
                password: password
            },
            success: function (response) {
                CloseSubModal();
                CloseModal();
                swal({
                    title: "User details edited successfully!",
                    icon: "success",
                    button: "Done",
                });
            },
            error: function (error) {

            }
        });
    }
}

function RetrieveUserMembersPerDepartmentTable(departmentId) {
    var projectId = $('#project_id').val();

    var users = RetrieveUserProjectPerId(projectId).filter(u => u.DepartmentId === departmentId);

    var html = '';

    html += '<table id="users_table" class="table table-striped" style="width:100% !important">';
    html += '<thead>';
    html += '<tr>';
    html += '<th style="display:none">UserId</th>'
    html += '<th>Username</th>';
    html += '<th>Fullname</th>';
    html += '<th>Department</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    if (users.length > 0) {
        for (var i = 0; i < users.length; i++) {
            html += '<tr>';
            html += '<td class="' + users[i].UserId + '" style="display:none">' + users[i].UserId + '</td>';
            html += '<td>' + users[i].Username + '</td>';
            html += '<td>' + users[i].Fullname + '</td>';
            html += '<td>' + users[i].DepartmentName + '</td>';
            html += '</tr>';
        }
    }

    html += '</tbody>';
    html += '        <input type="hidden" id="selected_user_id"/>';
    html += '</table>';

    return html;
    //$('#user_list').empty().append(html);
    //var table = $('#users_table').DataTable({
    //    info: false,
    //    searching: false
    //});

    //$('#users_table tbody').on('click', 'tr', function () {


    //    if ($(this).hasClass('selected')) {

    //        $(this).removeClass('selected');
    //        $('#edit_user_btn').addClass('isDisabled');
    //        $('#delete_user_btn').addClass('isDisabled');
    //        $('#selected_user_id').val(-1);

    //    } else {
    //        table.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //        $('#edit_user_btn').removeClass('isDisabled');
    //        $('#delete_user_btn').removeClass('isDisabled');
    //        var userId = parseFloat(this.firstElementChild.className);

    //        $('#selected_user_id').val(userId);
    //    }
    //});
}

function GenerateAllPlanetPermissionChexBoxes() {
    var projectId = parseInt($('#project_id').val());

    var users = RetrieveUserProjectPerId(projectId);
    var adminDepartmentId = users.filter(u => u.Username.toLowerCase() === 'planet')[0].DepartmentId; //Getting admin department

    var allPermissions = RetrievePlanetPermissionsPerDepartment(adminDepartmentId).filter(p => p.ProjectId === projectId);

    var html = '';

    html += '<div class="card">';
    html += ' <div class="card-header">Group Permissions</div>';
    html +='    <ul class="list-group list-group-flush">';
    for (var i = 0; i < allPermissions.length; i++) {
        html += '       <li class="list-group-item">';
        html += allPermissions[i].PermissionName;
        html += '           <label class="checkbox" id="checkbox_permission_' + allPermissions[i].MenuId +'">';
        html += '               <input class="special-checkbox" type="checkbox" id="permission_' + allPermissions[i].MenuId+'" /><span class="default" ></span >';
        html += '           </label>';
        html += '       </li>';
    }
    html += '   </ul>';
    html += '</div>';
    html += '</div>';

    return html;
}

function SetDepartmentPermissions(departmentId) {
    var permissions = RetrievePlanetPermissionsPerDepartment(departmentId);

    for (var i = 0; i < permissions.length; i++) {
        $('#checkbox_permission_' + permissions[i].MenuId).click();
        $('#permission_' + permissions[i].MenuId).attr('checked', true);
    }
}

function OnSavePermissionsToGroup() {
    var allCheckBoxes = $('.special-checkbox');
    var departmentId = $('#dept_value').val();
    var projectId = $('#project_id').val();

    var selectedPermissionIds = [];

    for (var i = 0; i < allCheckBoxes.length; i++) {
        if (allCheckBoxes[i].checked) {
            var permissionId = parseInt(allCheckBoxes[i].id.replace('permission_', ''));
            selectedPermissionIds.push(permissionId);
        }
    }

    //Remove previous old permissions

    console.log(selectedPermissionIds);
    debugger;
    RemoveOldPermissions(departmentId);

    var errorMsg = [];

    for (var j = 0; j < selectedPermissionIds.length; j++) {
        var res = AddPermissionToDepartment(departmentId, selectedPermissionIds[j], projectId);
        if (res.message === 'FAIL') {
            errorMsg.push(res);
        }
    }

    if (errorMsg.length === 0) {
        CloseSubModal();
        CloseModal();
        swal({
            title: "Group Permission List Updated!",
            icon: "success",
            button: "Done",
        });
    }
}

function RemoveOldPermissions(departmentId) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RemoveOldDepartmentPermissions",
        data: { departmentId: departmentId },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function AddPermissionToDepartment(departmentId, permissionId, projectId) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/AddDepartmentPermission",
        data: {
            departmentId: departmentId,
            menuId: permissionId,
            projectId: projectId
        },
        success: function (response) {
            data = response;
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrievePlanetPermissionsPerDepartment(departmentId) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrievePlanetPermissionsPerDepartment",
        data: { departmentId: departmentId },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveUserDetailsPerId(userId) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/RetrieveUserDetails",
        data: { userId: userId },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function UpdateUserPassword() {
    var msg = '';

    var oldUserPassword = $('#old_user_password').val();
    var oldExisitingUserPassword = $('#old_existing_user_password').val()

    var newUserPassword = $('#new_user_password').val();
    var confirmNewUserPassword = $('#confirm_new_user_password').val();
    

    if (oldExisitingUserPassword.localeCompare(oldUserPassword, 'en') !== 0) {
        msg = 'Sorry, But the old password you provided doesm\'t match with what we have';
        ShowErrorMessage(msg);
    }

    if (newUserPassword === '' && confirmNewUserPassword === '') {
        msg = 'The password cannot be null or empty';
        ShowErrorMessage(msg);
    }

    if (newUserPassword.localeCompare(confirmNewUserPassword) !== 0) {
        msg = 'Error the new password and confirm values does not match. Please verify';
        ShowErrorMessage(msg);
    }

    if (msg === '') {
        var userId = $('#user_id').val();

        $.ajax({
            async: false,
            type: "POST",
            url: "/Settings/UpdateUserPassword",
            data: {
                userId: userId,
                password: newUserPassword
            },
            success: function (response) {
                //data = JSON.parse(response.result);
                ShowSuccessMessage("Password changed successfully!");
            },
            error: function (error) {

            }
        });
    }
}