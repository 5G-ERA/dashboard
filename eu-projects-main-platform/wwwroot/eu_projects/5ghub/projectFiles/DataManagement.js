var typeid;
var subtypeid;
var scenarioid;
var selectedkpi;
var oldcasedescription, oldresponsible, oldcontact, olddate
var view;
var useridmain = 2;
var table;


//System functions
function DateConversion(dateValue) {
	var newDate;
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{3}/.test(dateValue)
		|| /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateValue)) {
		newDate = new Date(dateValue);
	}
	function pad(s) { return (s < 10) ? '0' + s : s; }
	return [newDate.getFullYear(), pad(newDate.getMonth() + 1), pad(newDate.getDate())].join('-')
}


function Fill_UseInfo(usecase_id) {
    ToggleUC_DisplayMode();
	var data;
	data = RetrieveUCGeneralInfo(usecase_id);
	if (data.UCID == null || data.UCID == undefined) {
		$('#uc_id_string').val(usecase_id);
    } else {
        $('#uc_id_string').val(data.UCID);
    }
	$('#uc_id').val(data.UseCaseId);
	$('#uc_description_id').val(data.UseCaseDescription);
	$('#uc_responsible_id').val(data.ResponsiblePerson);
	$('#uc_contact_id').val(data.ContactPerson);
	$('#uc_date_id').val(DateConversion(data.EntryDate));
	
	$('#uc_category').val(data.CategoryName);
}

function Fill_NetAppInfos(netapp_id) {
	var netappInfos = RetrieveNetAppPerId(netapp_id);
	ToggleUC_DisplayMode();

	$('#uc_id_string').val(netappInfos.NetAppId);
	$('#uc_description_id').val(netappInfos.NetAppName);
	$('#uc_contact_id').val('');
	$('#uc_date_id').val(DateConversion(netappInfos.CreatedAt));
}

function ToggleUC_DisplayMode() {
	if ($('#ucdesc_id option:selected')[0].className === 'netapp') {
		$('#responsible_label').hide();
		$('#responsible_field').hide();

		$('#uc_description_label').empty().append('NetApp Name ');
		$('#uc_id_label').empty().append('NetApp ID');
		//$('#contact_label').empty().append('NetApp Execution ID');
        $('#data_source_type').empty().append('NetApp Description');
    } else {

        $('#responsible_label').show();
        $('#responsible_field').show();

		$('#uc_description_label').empty().append('Use Case Description');
		$('#uc_id_label').empty().append('Use Case ID');
		$('#contact_label').empty().append('Contact');
        $('#data_source_type').empty().append('UC Description');
    }
}

function FillTablesWithData(scenario_id) {
	var data = RetrieveKPI_JS(scenario_id)
	PI_GenerateAllTables(data);
	ShowKPITables();
}


//KPI ADD EDIT DELETE
function Generate_EditAdd_KPI_Modal(button, subtypeId, subtype, type) {
	//debugger;
	var operators = [];
	var units = [];
	units = RetrieveUnits_JS();
	operators = RetrieveOperators_JS()
	let html = '';
	html += '<div id="5groutesmodal" class="modal">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
	if (button == 'add')
		html += '<h4>Add KPI</h4>';
	else
		html += '<h4>Edit KPI</h4>';
	html += '<span onclick="CloseModal()" class="close">&times;</span>';
	html += '</div>';
	html += '<div class="mainbodyborder">'
	html += '<div class="modalwidth90">'
	html += '<div class="modalbody_class">'
	/*start ROW OF 2*/
	html += '<div class="row">' /*start of div class 1st row*/
	html += '<div class="col-sm-6">' /*start of div class 1st col-6*/

	html += '<div class="row">'
	html += '<div class="col-sm-4">'
	html += 'Type'
	html += '</div>'
	html += '<div class="col-sm-8">'
	html += '<input type="hidden" id="type_id"/>'
	html += '<input type="text" readonly value="' + type + '"/>'
	html += '</div>'
	html += '</div>'
	html += '</div>'; /*end of div class 1st col-6*/
	html += '<div class="col-sm-6">' /*start of div class 2nd col-6*/
	html += '<div class="row">'
	html += '<div class="col-sm-4">'
	html += 'SubType'
	html += '</div>'
	html += '<div class="col-sm-8">'
	html += '<input type="hidden" id="subtype_id" value="' + subtypeId +'"/>'
	html += '<input type="text" readonly value="' + subtype + '" />'
	html += '</div>'
	html += '</div>'
	html += '</div>'; /*end of div class 2nd col-6*/
	html += '</div>'; /*start of div class 2st row*/
	/*END OF ROW OF 2*/

	/*start ROW OF 2*/
	html += '<div class="row">' /*start of div class 1st row*/
	html += '<div class="col-sm-6">' /*start of div class 1st col-6*/

	html += '<div class="row">'
	html += '<div class="col-sm-4">'
	html += 'Name'
	html += '</div>'
	html += '<div class="col-sm-8">'
	html += '<input type="text" id="name_id">'
	html += '</div>'
	html += '</div>'
	html += '</div>'; /*end of div class 1st col-6*/
	html += '<div class="col-sm-6">' /*start of div class 2nd col-6*/


	html += '<div class="row">'
	html += '<div class="col-sm-4">'
	html += 'Units'
	html += '</div>'
	html += '<div class="col-sm-8">'


	html += '<select id="unitsid" onchange = "">'

	for (var i = 0; i < units.length; i++) {
		if (units[i].Name != '')
			html += '<option value="' + units[i].UnitId + '">' + units[i].Name + '</option>';
		else
			html += '<option value="' + units[i].UnitId + '">No Unit</option>';

	}

	html += '</select>'
	html += '</div>'
	html += '</div>'


	html += '</div>'; /*end of div class 2nd col-6*/
	html += '</div>'; /*start of div class 2st row*/
	/*END OF ROW OF 2*/

	/*start ROW OF 2*/
	html += '<div class="row">' /*start of div class 1st row*/
	html += '<div class="col-sm-6">' /*start of div class 1st col-6*/

	html += '<div class="row">'
	html += '<div class="col-sm-4">'
	html += 'Low Value'
	html += '</div>'
	html += '<div class="col-sm-8">'
	html += '<input type="text" id="lowvalue_id">'
	html += '</div>'
	html += '</div>'

	html += '</div>'; /*end of div class 1st col-6*/
	html += '<div class="col-sm-6">' /*start of div class 2nd col-6*/


	html += '<div class="row">'
	html += '<div class="col-sm-4">'
	html += 'Low Operator'
	html += '</div>'
	html += '<div class="col-sm-8">'
	html += '<select id="lowoperator_id" onchange = "">'
	for (var i = 0; i < operators.length; i++) {
		if (operators[i].Name)
			html += '<option value="' + operators[i].OperatorId + '">' + operators[i].Name + '</option>';
		else
			html += '<option value="' + operators[i].OperatorId + '">No operator</option>';

	}
	html += '</select>'

	html += '</div>'
	html += '</div>'

	html += '</div>'; /*end of div class 2nd col-6*/
	html += '</div>'; /*start of div class 2st row*/
	/*END OF ROW OF 2*/


	/*start ROW OF 2*/
	html += '<div class="row">' /*start of div class 1st row*/
	html += '<div class="col-sm-6">' /*start of div class 1st col-6*/

	html += '<div class="row">'
	html += '<div class="col-sm-4">'
	html += 'High Value'
	html += '</div>'
	html += '<div class="col-sm-8">'
	html += '<input type="text" id="highvalue_id">'
	html += '</div>'
	html += '</div>'

	html += '</div>'; /*end of div class 1st col-6*/
	html += '<div class="col-sm-6">' /*start of div class 2nd col-6*/


	html += '<div class="row">'
	html += '<div class="col-sm-4">'
	html += 'High Operator'
	html += '</div>'
	html += '<div class="col-sm-8">'
	html += '<select id="highoperator_id" onchange = "">'

	for (var i = 0; i < operators.length; i++) {
		if (operators[i].Name)
			html += '<option value="' + operators[i].OperatorId + '">' + operators[i].Name + '</option>';
		else
			html += '<option value="' + operators[i].OperatorId + '">No operator</option>';

	}
	html += '</select>'
	html += '</div>'
	html += '</div>'


	html += '</div>'; /*end of div class 2nd col-6*/
	html += '</div>'; /*start of div class 2st row*/
	/*END OF ROW OF 2*/
	html += '<div class="row">'
	html += '<div class="col-sm-12 modaladdediterror">'
	html += '</div>';
	html += '</div>';
	html += '<hr/>'
	html += '<div class="row">'
	html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'

	if (button == 'add') {
		html += '<button class="savebutton sacecancelbuttonoc" onclick="SubmitNewKPIJS()" type="button">Save<i class="marginicon fas fa-save"></i></button>';
		html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
	}
	else {
		html += '<button class="savebutton sacecancelbuttonoc" onclick="SubmitEditKPIJS()" type="button">Save<i class="marginicon fas fa-save"></i></button>';
		html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
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
	html += '</div>'; /*end of 5groutesmodal div*/
	$(".homemodal").append(html);
	$(".modal").show();
	$("#unitsid").chosen({ search_contains: true });
	$("#lowoperator_id").chosen({ search_contains: true });
	$("#highoperator_id").chosen({ search_contains: true });
}

function addkpi(subtypeId, subtype, type) {
	Generate_EditAdd_KPI_Modal('add', subtypeId, subtype, type)
	var kpiid;
	kpiid = SubTypeString_To_SubTypeId(subtype);
	$('#subtype_id').val(subtype)
}

function editkpi(subtypeId, subtype, type) {
	//debugger;
	Generate_EditAdd_KPI_Modal('edit', subtypeId, subtype, type)
	var kpiid;
	kpiid = SubTypeString_To_SubTypeId(subtype);
	$('#subtype_id').val(subtype)
	Fill_EditModal_With_KPI_Info(kpiid);
}

function deletekpi(subtype) {
	var kpiid;
	kpiid = SubTypeString_To_SubTypeId(subtype);
	swal({
		title: "Are you sure?",
		text: "Once deleted, you will not be able to recover this PI",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				$.ajax({
					async: false,
					type: "POST",
					url: "/_5ghub/DeleteKPI",
					data: {
						kpiid: kpiid,
					},
					success: function (response) {
						//debugger;
						Scenario_Description_OnChange();
					},
					error: function (error) {

					}
				});
			}

		});
}

function Fill_EditModal_With_KPI_Info(kpiid) {
	data = RetrieveKPI(kpiid)
	console.log(data)
	$('#name_id').val(data.PIName);
	$('#lowvalue_id').val(data.LowValue);
	$('#highvalue_id').val(data.HighValue);
	$('#unitsid').val(data.Unit_Id);
	$('#unitsid').trigger('chosen:updated')
	$('#lowoperator_id').val(data.LowOperator_Id);
	$('#lowoperator_id').trigger('chosen:updated')
	$('#highoperator_id').val(data.HighOperator_Id);
	$('#highoperator_id').trigger('chosen:updated')

}

function SubmitNewKPIJS() {
	var valid = true;
	var errormessage = ''
	$('.modaladdediterror').empty();
	$('#name_id').removeClass('userNotFoundClass');

	var name = $('#name_id').val()
	var lowvalue = $('#lowvalue_id').val()
	var highvalue = $('#highvalue_id').val()
	var unitid = $('#unitsid').val()
	var lowoperatorid = $('#lowoperator_id').val()
	var highoperatorid = $('#highoperator_id').val()
	scenarioid = $('#scenariodesc_id').val();
	if (name == '') {
		errormessage += '*PI Name Cannot Be Empty'
		valid = false;
		$('#name_id').addClass('userNotFoundClass');
	}

	if (valid == false) {
		$('.modaladdediterror').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>')
	}
	else {
		$.ajax({
			async: false,
			type: "POST",
			url: "/_5ghub/AddKPI",
			data: {
				typeid: typeid,
				subtypeid: subtypeid,
				scenarioid: scenarioid,
				name: name,
				lowvalue: lowvalue,
				highvalue: highvalue,
				unitid: unitid,
				lowoperatorid: lowoperatorid,
				highoperatorid: highoperatorid
			},
			success: function (response) {
				CloseModal();
				Scenario_Description_OnChange();
				swal({
					title: "Added!",
					icon: "success",
					button: "Done",
				});

			},
			error: function (error) {

			}
		});
	}
}

function SubmitEditKPIJS() {
	var valid = true;
	var errormessage = ''
	$('.modaladdediterror').empty();
	$('#name_id').removeClass('userNotFoundClass');
	var name = $('#name_id').val()
	var lowvalue = $('#lowvalue_id').val()
	var highvalue = $('#highvalue_id').val()
	var unitid = $('#unitsid').val()
	var lowoperatorid = $('#lowoperator_id').val()
	var highoperatorid = $('#highoperator_id').val()
	scenarioid = $('#scenariodesc_id').val();
	if (name == '') {
		errormessage += '*PI Name Cannot Be Empty'
		valid = false;
		$('#name_id').addClass('userNotFoundClass');
	}
	if (valid == false) {
		$('.modaladdediterror').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>')
	}
	else {
		$.ajax({
			async: false,
			type: "POST",
			url: "/_5ghub/EditKPI",
			data: {
				selectedkpi: selectedkpi,
				typeid: typeid,
				subtypeid: subtypeid,
				name: name,
				lowvalue: lowvalue,
				highvalue: highvalue,
				unitid: unitid,
				lowoperatorid: lowoperatorid,
				highoperatorid: highoperatorid
			},
			success: function (response) {
				CloseModal();
				Scenario_Description_OnChange();
				swal({
					title: "Saved!",
					icon: "success",
					button: "Done",
				});

			},
			error: function (error) {

			}
		});
	}
}


function CloseModal() {
	$(".modal").remove();

}

function EditUseCase() {
	$('#uc_description_id')[0].readOnly = false;
	$('#uc_responsible_id')[0].readOnly = false;
	$('#uc_contact_id')[0].readOnly = false;
	$('#uc_date_id')[0].readOnly = false;
	oldcasedescription = $('#uc_description_id').val()
	oldresponsible = $('#uc_responsible_id').val()
	oldcontact = $('#uc_contact_id').val()
	olddate = $('#uc_date_id').val()
	UC_HideEditButton();
	UC_ShowSaveCancelButtons();
}

function CancelEdit() {
	$('#uc_description_id')[0].readOnly = true;
	$('#uc_responsible_id')[0].readOnly = true;
	$('#uc_contact_id')[0].readOnly = true;
	$('#uc_date_id')[0].readOnly = true;
	$('#uc_description_id').val(oldcasedescription);
	$('#uc_responsible_id').val(oldresponsible);
	$('#uc_contact_id').val(oldcontact);
	$('#uc_date_id').val(olddate);
	UC_ShowEditButton();
	UC_HideSaveCancelButtons();
	$("#uc_description_id").removeClass('userNotFoundClass');
	$("#uc_responsible_id").removeClass('userNotFoundClass');
	$("#uc_contact_id").removeClass('userNotFoundClass');
	$('.errormessageusecase').empty();
}

function SaveUseCase() {
	var UseCaseID, CaseDescription, Responsible, Contact, Date;
	$("#uc_description_id").removeClass('userNotFoundClass');
	$("#uc_responsible_id").removeClass('userNotFoundClass');
	$("#uc_contact_id").removeClass('userNotFoundClass');
	$('.errormessageusecase').empty();
	var valid = true;
	var errormessage = '';
	if ($('#uc_description_id').val() == '') {
		errormessage += '*Use Case Description Cannot Be Empty </br>';
		$("#uc_description_id").addClass('userNotFoundClass');
		valid = false;
	}

	if ($('#uc_responsible_id').val() == '') {
		errormessage += '*Responsible Person Cannot Be Empty </br>';
		$("#uc_responsible_id").addClass('userNotFoundClass');
		valid = false;
	}

	if ($('#uc_contact_id').val() == '') {
		errormessage += '*Contact Person Cannot Be Empty </br>';
		$("#uc_contact_id").addClass('userNotFoundClass');
		valid = false;
	}


	if (valid == false) {
		$('.errormessageusecase').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>');

	} else {
		$('#uc_description_id')[0].readOnly = true;
		$('#uc_responsible_id')[0].readOnly = true;
		$('#uc_contact_id')[0].readOnly = true;
		$('#uc_date_id')[0].readOnly = true;
		UseCaseID = $('#uc_id').val();
		CaseDescription = $('#uc_description_id').val();
		Responsible = $('#uc_responsible_id').val();
		Contact = $('#uc_contact_id').val();
		Date = $('#uc_date_id').val();
		UC_ShowEditButton();
		UC_HideSaveCancelButtons()
		$('#ucdesc_id option:selected').text($("#uc_description_id").val()).trigger('chosen:updated')
		$.ajax({
			async: false,
			type: "POST",
			url: "/_5ghub/EditUseCase",
			data: {
				UseCaseID, UseCaseID,
				CaseDescription: CaseDescription,
				Responsible: Responsible,
				Contact: Contact,
				Date: Date
			},
			success: function (response) {
				if (response == 'SUCCESS') {
					swal({
						title: "Saved!",
						icon: "success",
						button: "Done",
					});
				}
			},
			error: function (error) {

			}
		});
	}

}

function SubmitOverwriteScenario(scenario_id_from, scenario_id_to) {

	swal({
		title: "Are you sure?",
		text: "All data of " + $('#scenariodesc_id option:selected').text() + ' will be replaced with the data of ' + $('#scenario_from_id option:selected').text(),
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				$.ajax({
					async: false,
					type: "POST",
					url: "/_5ghub/ScenarioOverWrite",
					data: {
						scenario_id_from: scenario_id_from,
						scenario_id_to: scenario_id_to,
					},
					success: function (response) {
						CloseModal();
						FillTablesWithData(scenario_id_to);
						UC_ShowEditButton();
						$('#scenariodesc_id').val(scenario_id_to).trigger('chosen:updated')
						swal({
							title: "Scenario Data Successfully Overwritten!",
							icon: "success",
							button: "Done",
						});
					},
					error: function (error) {

					}
				});
			}

		});

}



function OverWriteScenario() {
	var html = '';
	var scenarioid = $('#scenariodesc_id').val();
	var usecase_id = $('#ucdesc_id').val();

	var data = []
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveScenarioPerUseCase",
		data: { usecase_id: usecase_id },
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	//debugger;
	html += '<div id="5groutesmodal" class="modal">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';

	html += '<h4>Duplicate Existing Scenario</h4>';
	html += '<span onclick="CloseModal()" class="close">&times;</span>';
	html += '</div>';
	html += '<div class="mainbodyborder">'
	html += '<div class="modalwidth90">'
	html += '<div class="modalbody_class">'
	/*start ROW OF 2*/

	html += '<div class="row" style="padding: 4px !important;">'
	html += '<div class="col-sm-5">'
	html += 'Data of Scenario:'
	html += '</div>'
	html += '<div class="col-sm-7">'
	html += '<input type="text" id="scenario_to_id" readonly>'
	//html += $('#scenariodesc_id option:selected').text()
	html += '</div>'
	html += '</div>'

	html += '<div class="row" style="padding: 4px !important;">'
	html += '<div class="col-sm-5">'
	html += 'Will be replaced with the data of:'
	html += '</div>'
	html += '<div class="col-sm-7">'


	html += '<select id="scenario_from_id" onchange = "">'
	html += '<option selected value="0">Select an Option</option>'
	for (var i = 0; i < data.length; i++) {


		if (data[i].UseCaseScenarioId != scenarioid) {
			html += '<option value="' + data[i].UseCaseScenarioId + '">' + data[i].UseCaseScenarioDescription + '</option>';
		}
	}
	html += '</select>'
	html += '</div>'
	html += '</div>'

	html += '<div class="row" style="padding: 4px !important;">'
	html += '<div class="col-sm-12 modaloverwriteerror">'
	html += '</div>';
	html += '</div>';

	html += '<div class="row" style="padding: 4px !important;">'
	//html += '<div class="col-sm-12 modalbuttons">'

	////html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';


	//html += '<input class="btn btn-primary savebutton sacecancelbuttonoc" type = "button" value = "Overwrite" onclick = "CheckOverWriteButton()">'
	//html += '<input class="btn btn-primary sacecancelbuttonoc" type = "button" value = "Cancel" onclick = "CloseModal()">'

	html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'


	//html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';
	html += '<button class="savebutton sacecancelbuttonoc" onclick="CheckOverWriteButton()" type="button">Overwrite<i class="marginicon fas fa-clone"></i></button>';
	html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';




	//html += '<a onclick = "SubmitNewKPIJS()"><i class="fas fa-plus-circle modalsinglebutton"></i></a>'
	//html += '<a onclick = "CloseModal()"><i class="fas fa-times modalsinglebutton"></i></a>'

	//html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';

	html += '</div>';
	html += '</div>';
	html += '</div>';

	html += '</div>'
	html += '</div>'; /*end of 5groutesmodal div*/
	$(".homemodal").append(html);
	$(".modal").show();
	$("#scenario_from_id").chosen({ search_contains: true });
	$('#scenario_to_id').val($('#scenariodesc_id option:selected').text())

}

function CheckOverWriteButton() {
	scenario_id_from = $('#scenario_from_id').val();
	scenario_id_to = $('#scenariodesc_id').val();
	$("#scenario_from_id_chosen").removeClass('userNotFoundClass');
	$('.modaloverwriteerror').empty()
	var errormessage = '';
	var valid = true;
	if ($('#scenario_from_id').val() == '' || $('#scenario_from_id').val() == 0) {
		valid = false;
		errormessage = '* Please select a Scenario to take Data from </br>'
		$("#scenario_from_id_chosen").addClass('userNotFoundClass');
	}


	if (valid == true) {
		SubmitOverwriteScenario(scenario_id_from, scenario_id_to);
	} else {
		$(".modaloverwriteerror").empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>');
	}
}



function EditScenario() {
	var html = '';

	html += '<div id="5groutesmodal" class="modal">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';

	html += '<h4>Edit Scenario</h4>';
	html += '<span onclick="CloseModal()" class="close">&times;</span>';
	html += '</div>';
	html += '<div class="mainbodyborder">'
	html += '<div class="modalwidth90">'
	html += '<div class="modalbody_class">'
	/*start ROW OF 2*/

	html += '<div class="row" style="padding: 4px !important;">'
	html += '<div class="col-sm-3">'
	html += 'Scenario Description:'
	html += '</div>'
	html += '<div class="col-sm-9">'
	html += '<input type="text" id="newscenariodescription" style="margin:-5px;">'
	//html += $('#scenariodesc_id option:selected').text()
	html += '</div>'
	html += '</div>'



	html += '<div class="row" style="padding: 4px !important;">'
	html += '<div class="col-sm-12 modaloverwriteerror">'
	html += '</div>';
	html += '</div>';

	html += '<div class="row" style="padding: 4px !important;">'
	//html += '<div class="col-sm-12 modalbuttons">'

	////html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';


	//html += '<input class="btn btn-primary savebutton sacecancelbuttonoc" type = "button" value = "Overwrite" onclick = "CheckOverWriteButton()">'
	//html += '<input class="btn btn-primary sacecancelbuttonoc" type = "button" value = "Cancel" onclick = "CloseModal()">'

	html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'


	//html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';
	html += '<button class="savebutton sacecancelbuttonoc" onclick="SubmitEditedScenario()" type="button">Save<i class="marginicon fas fa-save"></i></button>';
	html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';




	//html += '<a onclick = "SubmitNewKPIJS()"><i class="fas fa-plus-circle modalsinglebutton"></i></a>'
	//html += '<a onclick = "CloseModal()"><i class="fas fa-times modalsinglebutton"></i></a>'

	//html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';

	html += '</div>';
	html += '</div>';
	html += '</div>';

	html += '</div>'
	html += '</div>'; /*end of 5groutesmodal div*/
	$(".homemodal").append(html);
	$(".modal").show();
	$('#newscenariodescription').val($('#scenariodesc_id option:selected').text())
}

function AddNewScenario() {
	var html = '';

	html += '<div id="5groutesmodal" class="modal">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';

	html += '<h4>Add new Scenario</h4>';
	html += '<span onclick="CloseModal()" class="close">&times;</span>';
	html += '</div>';
	html += '<div class="mainbodyborder">'
	html += '<div class="modalwidth90">'
	html += '<div class="modalbody_class">'
	/*start ROW OF 2*/

	html += '<div class="row" style="padding: 4px !important;">'
	html += '<div class="col-sm-3">'
	html += 'Scenario Description:'
	html += '</div>'
	html += '<div class="col-sm-9">'
	html += '<input type="text" id="newscenariodescription" style="margin:-5px;">'
	//html += $('#scenariodesc_id option:selected').text()
	html += '</div>'
	html += '</div>'



	html += '<div class="row" style="padding: 4px !important;">'
	html += '<div class="col-sm-12 modaloverwriteerror">'
	html += '</div>';
	html += '</div>';

	html += '<div class="row" style="padding: 4px !important;">'
	//html += '<div class="col-sm-12 modalbuttons">'

	////html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';


	//html += '<input class="btn btn-primary savebutton sacecancelbuttonoc" type = "button" value = "Overwrite" onclick = "CheckOverWriteButton()">'
	//html += '<input class="btn btn-primary sacecancelbuttonoc" type = "button" value = "Cancel" onclick = "CloseModal()">'

	html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'


	//html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';
	html += '<button class="savebutton sacecancelbuttonoc" onclick="SubmitNewScenario()" type="button">Add<i class="marginicon fas fa-plus"></i></button>';
	html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';




	//html += '<a onclick = "SubmitNewKPIJS()"><i class="fas fa-plus-circle modalsinglebutton"></i></a>'
	//html += '<a onclick = "CloseModal()"><i class="fas fa-times modalsinglebutton"></i></a>'

	//html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';

	html += '</div>';
	html += '</div>';
	html += '</div>';

	html += '</div>'
	html += '</div>'; /*end of 5groutesmodal div*/
	$(".homemodal").append(html);
	$(".modal").show();

}

function SubmitNewScenario() {
	var usecase_id = $('#ucdesc_id').val();
	var usecasedescription = $('#newscenariodescription').val();
	$("#newscenariodescription").removeClass('userNotFoundClass');
	$('.modaloverwriteerror').empty()
	var errormessage = '';
	var valid = true;
	if ($('#newscenariodescription').val() == '' || $('#newscenariodescription').val() == 0) {
		valid = false;
		errormessage = '* Scenario description cannot be empty</br>'
		$("#newscenariodescription").addClass('userNotFoundClass');
	}


	if (valid == true) {
		CloseModal();
		$.ajax({
			type: "POST",
			url: "/_5ghub/AddNewScenario",
			data: { usecase_id: usecase_id, usecasedescription: usecasedescription },
			success: function (response) {
				let data = JSON.parse(response.result)
				console.log('data: ' + data)
				GenerateScenarioDropdown(usecase_id)
				$('#scenariodesc_id').val(data);
				$('#scenariodesc_id').trigger('chosen:updated')
				FillTablesWithData(data);
				SCENARIO_ShowDuplicateButton();
                UC_ShowEditButton();
                SCENARIO_ShowAddButton()
                SCENARIO_ShowEditButton();
                SCENARIO_ShowDeleteButton();
                SCENARIO_HideExperimentResultsEvaluationButton();
			},
			error: function (error) {
				console.log(error);
			}
		});
	} else {
		$(".modaloverwriteerror").empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>');
	}
}

function SubmitEditedScenario() {
	var usecase_id = $('#ucdesc_id').val();
	var scenario_id = $('#scenariodesc_id').val();
	var usecasedescription = $('#newscenariodescription').val();
	$("#newscenariodescription").removeClass('userNotFoundClass');
	$('.modaloverwriteerror').empty()
	var errormessage = '';
	var valid = true;
	if ($('#newscenariodescription').val() == '' || $('#newscenariodescription').val() == 0) {
		valid = false;
		errormessage = '* Scenario description cannot be empty</br>'
		$("#newscenariodescription").addClass('userNotFoundClass');
	}


	if (valid == true) {
		CloseModal();
		$.ajax({
			type: "POST",
			url: "/_5ghub/EditScenario",
			data: { scenario_id: scenario_id, usecasedescription: usecasedescription },
			success: function (response) {
				GenerateScenarioDropdown(usecase_id)
				$('#scenariodesc_id').val(scenario_id);
				$('#scenariodesc_id').trigger('chosen:updated')
				FillTablesWithData(scenario_id);
				SCENARIO_ShowDuplicateButton();
				SCENARIO_ShowAddButton()
				SCENARIO_ShowEditButton();
				SCENARIO_ShowDeleteButton();
				UC_ShowEditButton();
                SCENARIO_HideExperimentResultsEvaluationButton();
			},
			error: function (error) {
				console.log(error);
			}
		});
	} else {
		$(".modaloverwriteerror").empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>');
	}
}

function DeleteScenario() {
	var usecase_id = $('#ucdesc_id').val();
	var scenario_id = $('#scenariodesc_id').val();
	swal({
		title: "Are you sure?",
		text: "Once deleted, you will not be able to recover this Scenario",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				$.ajax({
					async: false,
					type: "POST",
					url: "/_5ghub/DeleteScenario",
					data: {
						scenario_id: scenario_id,
					},
					success: function (response) {
						GenerateScenarioDropdown(usecase_id)
						$('#scenariodesc_id').val(0);
						$('#scenariodesc_id').trigger('chosen:updated')
						SCENARIO_HideDuplicateButton()
						SCENARIO_HideVisualiseKpiButton()
						SCENARIO_HideConfigureKpiKpiButton()
						HideKPITables();
						SCENARIO_HideEditButton()
						SCENARIO_HideDeleteButton()
						SCENARIO_HideExperimentResultsEvaluationButton();
                        SCENARIO_ShowAddButton();
                    },
					error: function (error) {

					}
				});
			}

		});
}




//----------------Retrieve DATA ----------------
function RetrieveUseCases_JS() {
	var data;
    var projectid = parseInt($('#project_id').val());
	//debugger
	$.ajax({
		type: "POST",
		async: false,
		url: "/_5ghub/RetrieveUseCasesPerProject",
		data: {
			projectId: projectid
		},
		success: function (response) {
			data = JSON.parse(response.result);		
		},
		error: function (error) {
            console.log(error);
        }
	});
	return data;
}



function RetrieveScenarioPerUseCase_JS(usecase_id) {
	var data = []
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveScenarioPerUseCase",
		data: { usecase_id: usecase_id },
		success: function (response) {
			data = JSON.parse(response.result);


		},
		error: function (error) {

		}
	});
	return data

}

function RetrieveKPI_JS(scenario_id) {
	var data
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {

			data = JSON.parse(response.result);
			console.log(data);

		},
		error: function (error) {

		}
	});
	return data;
}

function RetrieveUCGeneralInfo(usecase_id) {
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveUCGeneralInfo",
		data: { usecase_id: usecase_id },
		success: function (response) {
			data = JSON.parse(response.result);
			console.log(data)
		},
		error: function (error) {

		}
	});
	return data;
}





function RetrieveUnits_JS() {
	var data = []
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveUnits",
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});

	return data;
}



function RetrieveOperators_JS() {
	var data = []
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveOperators",
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return data;
}


function RetrieveKPI(kpiid) {
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveKPI",
		data: {
			kpiid: kpiid,
		},
		success: function (response) {
			data = JSON.parse(response.result);

		},
		error: function (error) {

		}
	});
	return data;
}

function RetrieveSingleExperimentResultsEvaluation(id) {
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveSingleExperimentResultsEvaluation",
		data: {
			id: id,
		},
		success: function (response) {

			data = JSON.parse(response.result);
			console.log(data);
			//debugger;
		},
		error: function (error) {

		}
	});
	return data;
}

function RetrieveExperimentResultsEvaluationPerScenarioID(scenarioid) {
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveExperimentResultsEvaluationPerScenarioID",
		data: {
			scenarioid: scenarioid,
		},
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return data;
}

function RetrieveNetApps() {
    var data = []
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveNetApps",
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveNetAppPerId(id) {
	var data = []
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5ghub/RetrieveNetAppPerId",
		data: {
            netappId: id
        },
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return data;
}

function RetrieveNetAppExecutionPerNetAppId(id) {
    var data = [];
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5ghub/RetrieveNetAppExecution",
        data: {
            netappId: id
        },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveUcTestsPerUsecaseId(id) {
    var data = [];
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5ghub/RetrieveUcTests",
        data: {
            usecaseId: id
        },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveKpiValuesPerExectionId(executionId) {
    var data = [];
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5ghub/RetrieveNetAppKpiValuesPerExecutionId",
        data: {
            execution_id: executionId
        },
        success: function (response) {
            data = response
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveKpiValuePerTestId(testId) {
	var data = [];
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveTestKpiValuesPerTestId",
        data: {
            test_id: testId
        },
        success: function (response) {
            data = response
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveAllTestDataSentByDataCollector(usecase_id) {
    var data = [];
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5ghub/RetrieveAllTestDataSentByDataCollector",
        data: {
            useCaseId: usecase_id
        },
        success: function (response) {
            data = response
        },
        error: function (error) {

        }
    });
    return data;
}
