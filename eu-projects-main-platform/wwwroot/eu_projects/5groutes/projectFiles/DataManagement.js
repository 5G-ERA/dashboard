var typeid;
var subtypeid;
var scenarioid;
var selectedkpi;
var oldcasedescription, oldresponsible, oldcontact, olddate, oldcasecode
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
	var data;
	data = RetrieveUCGeneralInfo(usecase_id);

	$('#uc_id').val(data.UseCaseId);
	$('#uc_description_id').val(data.UseCaseDescription);
	$('#uc_responsible_id').val(data.ResponsiblePerson);
	$('#uc_contact_id').val(data.ContactPerson);
	$('#uc_date_id').val(DateConversion(data.EntryDate));
	$('#uc_id_string').val(data.UCID);
	$('#uc_category').val(data.CategoryName);
	
}

function FillThresholdTablesWithData(useCaseId) {
	var data = RetrieveKPIThresholdPerUseCase_JS(useCaseId)
	//PI_GenerateAllTables(data);
	PI_GenerateThresholdStatusTables(data);
    ShowKPIThresholdTables();
}

function FillScenarioMeasurementTablesWithData(scenario_id) {
	var data = RetrievePIMeasurementDetails(scenario_id);
    PI_GenerateScenarioMeasurementTables(data);
}

function FillTestScenarioMeasurementTablesWithData(useCaseId) {
	var data = RetrievePIMeasurementDetails(useCaseId);
    PI_GenerateScenarioMeasurementTables(data);
}

function FillTablesWithData(scenario_id) {
//	var data = RetrieveKPI_JS(scenario_id)
//	PI_GenerateAllTables(data);
//	ShowKPITables();
}

//KPI ADD EDIT DELETE
function Generate_EditAdd_KPI_Modal(button, subtypeId, subtype) {
	//debugger;
	var operators = [];
	var units = [];
	units = RetrieveUnits_JS();
	operators = RetrieveOperators_JS()
	let html = '';
	html += '<div id="modal_5groutes" class="modal">';
	html += '	<div class="modal-content">';
	html += '		<div class="modal-header">';
	if (button == 'add')
		html += '<h4>Add Status PI (' + subtype +')</h4>';
	else
		html += '<h4>Edit Status PI (' + subtype +')</h4>';
	html += '	<span onclick="CloseModal()" class="close">&times;</span>';
	html += '</div>';
	html += '<div class="mainbodyborder">'
	html += '	<div class="modalwidth90">'
	html += '		<div class="modalbody_class">'	
	html += '			<div class="row">' /*start of div class 1st row*/
	html += '				<div class="col-sm-6">' /*start of div class 1st col-6*/
	html += '					<div class="row">'
	html += '						<div class="col-sm-4">'
	html += '							Type'
	html += '						</div>'
	html += '						<div class="col-sm-8" id="type_id_selector">'
	//html += '							<input type="text" id="type_id">'
    html += '							<select id="type_Id"></select>'
	html += '						</div>'
	html += '					</div>'
	html += '				</div>'; /*end of div class 1st col-6*/
	html += '				<div class="col-sm-6">' /*start of div class 2nd col-6*/
	html += '					<div class="row">'
	html += '						<div class="col-sm-4">'
	html += '							PI Code'
	html += '						</div>'
	html += '						<div class="col-sm-8">'
	html += '							<input type="text" id="pi_code_value" required placeholder="Provide unique code for your PI...">'
	//html += '							<input type="text" id="subtype_value" readonly>'
    html += '							<input type="hidden" id="subtype_id" value="'+subtypeId+'">'
	html += '						</div>'
	html += '					</div>'
	html += '				</div>'; /*end of div class 2nd col-6*/
	html += '			</div>'; /*start of div class 2st row*/
	html += '		<div class="row">' /*start of div class 1st row*/
	html +=				'<div class="col-sm-6">' /*start of div class 1st col-6*/
	html += '				<div class="row">'
	html += '					<div class="col-sm-4">'
	html += '						Name'
	html += '					</div>'
	html += '					<div class="col-sm-8">'
	html += '						<input type="text" id="name_id">'
	html += '					</div>'
	html += '				</div>'
	html += '			</div>'; /*end of div class 1st col-6*/
	html += '			<div class="col-sm-6">' /*start of div class 2nd col-6*/
	html += '				<div class="row">'
	html += '					<div class="col-sm-4">'
	html += '						Units'
	html += '					</div>'
	html += '					<div class="col-sm-8">'
	html += '						<select id="unitsid" onchange = "">'
	for (var i = 0; i < units.length; i++) {
		if (units[i].Name != '')
			html += '				<option value="' + units[i].UnitId + '">' + units[i].Name + '</option>';
		else
			html += '				<option value="' + units[i].UnitId + '">No Unit</option>';
	}
	html += '					</select>'
	html +=					'</div>'
	html += '			</div>'
	html += '		</div>'; /*end of div class 2nd col-6*/
	html += '	</div>'; /*start of div class 2st row*/
	html += '	<div class="row">' /*start of div class 1st row*/
	html += '		<div class="col-sm-6">' /*start of div class 1st col-6*/
	html += '			<div class="row">'
	html += '				<div class="col-sm-4">'
	html += '					Red Threshold (Low Value)'
	html += '				</div>'
	html += '				<div class="col-sm-8">'
	html += '					<input type="text" id="lowvalue_id">'
	html += '				</div>'
	html += '			</div>'
	html += '		</div>'; /*end of div class 1st col-6*/
	html += '		<div class="col-sm-6">' /*start of div class 2nd col-6*/
	html += '			<div class="row">'
	html += '				<div class="col-sm-4">'
	html += '					Low Operator'
	html += '				</div>'
	html += '				<div class="col-sm-8">'
	html += '					<select id="lowoperator_id" onchange = "">'
	for (var i = 0; i < operators.length; i++) {
		if (operators[i].Name)
			html += '				<option value="' + operators[i].OperatorId + '">' + operators[i].Name + '</option>';
		else
			html += '				<option value="' + operators[i].OperatorId + '">No operator</option>';

	}
	html += '					</select>'
	html += '				</div>'
	html += '			</div>'
	html += '		</div>'; 
	html += '	</div>'; 
	html += '	<div class="row">' /*start of div class 1st row*/
	html += '		<div class="col-sm-6">' /*start of div class 1st col-6*/
	html += '			<div class="row">'
	html += '				<div class="col-sm-4">'
	html += '					Green Threshold (High Value)'
	html += '				</div>'
	html += '				<div class="col-sm-8">'
	html += '					<input type="text" id="highvalue_id">'
	html += '				</div>'
	html += '			</div>'
	html += '		</div>'; /*end of div class 1st col-6*/
	html += '		<div class="col-sm-6">' /*start of div class 2nd col-6*/
	html += '			<div class="row">'
	html += '				<div class="col-sm-4">'
	html += '					High Operator'
	html += '				</div>'
	html += '				<div class="col-sm-8">'
	html += '					<select id="highoperator_id" onchange = "">'
	for (var i = 0; i < operators.length; i++) {
		if (operators[i].Name)
			html += '			<option value="' + operators[i].OperatorId + '">' + operators[i].Name + '</option>';
		else
			html += '			<option value="' + operators[i].OperatorId + '">No operator</option>';

	}
	html += '				</select>'
	html += '			</div>'
	html += '		</div>'
	html += '	</div>'; /*end of div class 2nd col-6*/
	html += '</div>'; /*start of div class 2st row*/
	/*END OF ROW OF 2*/
	html += '<div class="row">'
	html += '<div class="col-sm-12 modaladdediterror">'
	html += '</div>';
	html += '</div>';
	html += '<div class="row">'
	html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'

	if (button == 'add') {
		html += '<button class="savebutton sacecancelbuttonoc" onclick="SubmitNewKPIJS()" type="button">Save<i class="marginicon fas fa-save"></i></button>';
		html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
	}
	else {
        html += '<input type="hidden" id="piid_value"/>'
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
	$('#modal_5groutes').show();
	$("#unitsid").chosen({ search_contains: true });
	$("#lowoperator_id").chosen({ search_contains: true });
	$("#highoperator_id").chosen({ search_contains: true });

    GenerateKpiTypesDropdown();
}

function AddKpiHandler(subtypeId,subtype) {
    Generate_EditAdd_KPI_Modal('add', subtypeId, subtype);
	//var kpiid;
	//kpiid = GetSelectedIdOfCategory(subtype);
	$('#subtype_value').val(subtype)
}

function EditKpiHandler(subtypeId,subtype) {
	Generate_EditAdd_KPI_Modal('edit', subtypeId, subtype)
	var kpiid;

	kpiid = GetSelectedPi_Id(subtype);
	console.log(kpiid);
    //debugger;

	//kpiid = GetSelectedIdOfCategory(subtype);

	$('#subtype_value').val(subtype)
	Fill_EditModal_With_KPI_Info(kpiid);
}

function GetSelectedPi_Id(subtype) {
    return parseInt($('#' + subtype + '_selected_piid_value').val());
}

function DeleteKPIHandler(subType) {
	var kpiid;

	//kpiid = GetSelectedIdOfCategory(subtype);

	kpiid = GetSelectedPi_Id(subType);

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
					url: "/_5groutes/DeleteKPI",
					data: {
						kpiid: kpiid,
					},
					success: function (response) {
						//debugger;
						/*Scenario_Description_OnChange();*/
                        RefreshKpiThreshodTables();
                    },
					error: function (error) {

					}
				});
			}
		});
}

function Fill_EditModal_With_KPI_Info(kpiid) {
	data = RetrieveKPI(kpiid);
	
    $('#piid_value').val(kpiid);
	$('#name_id').val(data.PIName);
	$('#lowvalue_id').val(data.LowValue);
	$('#highvalue_id').val(data.HighValue);
	$('#unitsid').val(data.Unit_Id);
	$('#pi_code_value').val(data.PICode);
	$('#unitsid').trigger('chosen:updated')
	$('#lowoperator_id').val(data.LowOperator_Id);
	$('#lowoperator_id').trigger('chosen:updated')
	$('#highoperator_id').val(data.HighOperator_Id);
	$('#highoperator_id').trigger('chosen:updated');
}

function SubmitNewKPIJS() {
	var valid = true;
	var errormessage = ''
	$('.modaladdediterror').empty();
	$('#name_id').removeClass('userNotFoundClass');
	var name = $('#name_id').val().trim();
	var lowvalue = $('#lowvalue_id').val()
	var highvalue = $('#highvalue_id').val()
	var unitid = $('#unitsid').val()
	var lowoperatorid = $('#lowoperator_id').val()
	var highoperatorid = $('#highoperator_id').val()
	var typeId = $('#type_id').val();
    var subTypeId = parseInt($('#subtype_id').val());
	var usecaseid = $('#ucdesc_id').val();
	var picode = $('#pi_code_value').val();

	if (name == '') {
		errormessage += '*PI Name Cannot Be Empty'
		valid = false;
		$('#name_id').addClass('userNotFoundClass');
	}

	if (picode == '') {
		errormessage += '*PI Code Cannot Be Empty'
		valid = false;
		$('#pi_code_value').addClass('userNotFoundClass');
	}
	else {
		if (ValidatePiCode(usecaseid,picode,null) == false) {
			errormessage += '*PI Code Already used by another entity. Provide another one please...'
			valid = false;
			$('#pi_code_value').addClass('userNotFoundClass');
        }
    }

	if (valid == false) {
		$('.modaladdediterror').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>')
	}
	else {
		$.ajax({
			async: false,
			type: "POST",
			url: "/_5groutes/AddKPI",
			data: {
				typeid: typeId,
				subtypeid: subTypeId,
				usecaseid: usecaseid,
				name: name,
				lowvalue: lowvalue,
				highvalue: highvalue,
				unitid: unitid,
				lowoperatorid: lowoperatorid,
				highoperatorid: highoperatorid,
				picode: picode
			},
			success: function (response) {
				CloseModal();
				/*Scenario_Description_OnChange();*/
                RefreshKpiThreshodTables();
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

function ValidatePiCode(usecase_id, code, selected_pi_id) {
	var isValid = false;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/ValidatePiCode",
		data: {
			useCaseId : usecase_id,
			piCode: code,
			piid: selected_pi_id
		},
		success: function (response) {
			isValid = (response.toString() == "true");
			return isValid;
		},
		error: function (error) {

		}
	});
	return isValid;

}function ValidateUseCaseCode(code, usecase_id) {
	var isValid = false;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/ValidateUseCaseCode",
		data: {
			code: code,
			useCaseId, usecase_id
		},
		success: function (response) {
			isValid = (response.toString() == "true");
			return isValid;
		},
		error: function (error) {

		}
	});
	return isValid;
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
	var usecaseid = $('#ucdesc_id').val();
	var typeId = $('#type_id').val();
	var subTypeId = parseInt($('#subtype_id').val());
	var piid = parseInt($('#piid_value').val());
	var picode = $('#pi_code_value').val();

	if (name == '') {
		errormessage += '*PI Name Cannot Be Empty'
		valid = false;
		$('#name_id').addClass('userNotFoundClass');
	}

	if (picode == '') {
		errormessage += '*PI Code Cannot Be Empty'
		valid = false;
		$('#pi_code_value').addClass('userNotFoundClass');
	}
	else {
		if (ValidatePiCode(usecaseid, picode, piid) == false) {
			errormessage += '*PI Code Already used by another entity. Provide another one please...'
			valid = false;
			$('#pi_code_value').addClass('userNotFoundClass');
		}
	}

	if (valid == false) {
		$('.modaladdediterror').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>')
	}
	else {
		$.ajax({
			async: false,
			type: "POST",
			url: "/_5groutes/EditKPI",
			data: {
				selectedkpi: piid,
				typeid: typeId,
				subtypeid: subTypeId,
				name: name,
				lowvalue: lowvalue,
				highvalue: highvalue,
				unitid: unitid,
				lowoperatorid: lowoperatorid,
				highoperatorid: highoperatorid,
				picode: picode
			},
			success: function (response) {
				CloseModal();
				//Scenario_Description_OnChange();
                RefreshKpiThreshodTables();
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

//Save Test Scenario Measurements
function AddAllTestScenarioMeasures(kpiTypeId, valueObjects) {
	var testScenarioId = $('#testscenariodesc_id').val();

    var percentageSum = 0;
	var counter = 0;

	for (var i in valueObjects) {
		var measurementId = valueObjects[i].measurementId;
        var measurementValue = valueObjects[i].measurementValue;
		var addedMeasureValue = AddIndividualTestScenarioMeasureValue(testScenarioId, measurementId, measurementValue);
		
		if (addedMeasureValue != null) {
			if (addedMeasureValue.SatisfactoryLevelTypeValue != 'None') {
				ApplyMeasureSatisfactoryLevel(addedMeasureValue);
				percentageSum += addedMeasureValue.SatisfactoryPercentageValue;
                counter++;
            }
        }
	}
    var meanPercentage = Math.floor(percentageSum / counter);

    SetCompositeKpiMeanPercentage(meanPercentage, kpiTypeId);

}

function GetAllCompositeKpiPercentageValue(testscenario_id, compositeKpiTypes) {

    var percentageValueArray = [];

    for (var i in compositeKpiTypes) {

		var measurementValuesIdArray = RetrieveMeasurementValuesPerKpi(compositeKpiTypes[i].KpiSubTypeID);

		if (measurementValuesIdArray != null) {

            var percentageSum = 0;
			var counter = 0;

			for (var i = 0; i < measurementValuesIdArray.length; i++) {

				var individualValue = RetrieveLatestTestScenarioMeasureValue(testscenario_id, measurementValuesIdArray[i]);
                if (individualValue != null) {
                    if (individualValue.SatisfactoryLevelTypeValue != 'None') {
                        ApplyMeasureSatisfactoryLevel(individualValue);
                        percentageSum += individualValue.SatisfactoryPercentageValue;
                        counter++;
                    }
                }
			}

			var meanPercentage = Math.floor(percentageSum / counter);
            percentageValueArray.push(meanPercentage);
        }
	}
    return percentageValueArray;
}


function ApplyMeasureSatisfactoryLevel(measureValue) {
	//debugger
	if (measureValue != null) {
		$('#satifactory_level_' + measureValue.MeasurementId).empty().append(measureValue.SatisfactoryLevelTypeValue);
		if (measureValue.SatisfactoryLevelTypeValue == 'Good') {
			$('#satifactory_level_' + measureValue.MeasurementId).removeClass();
			$('#satifactory_level_' + measureValue.MeasurementId).addClass('td-good-satisfactory');
		}
		else if (measureValue.SatisfactoryLevelTypeValue == 'Acceptable') {
			$('#satifactory_level_' + measureValue.MeasurementId).removeClass();
			$('#satifactory_level_' + measureValue.MeasurementId).addClass('td-acceptable-satisfactory');
		}
		else if (measureValue.SatisfactoryLevelTypeValue == 'Bad') {
			$('#satifactory_level_' + measureValue.MeasurementId).removeClass();
			$('#satifactory_level_' + measureValue.MeasurementId).addClass('td-bad-satisfactory');
		}
		else {
			$('#satifactory_level_' + measureValue.MeasurementId).removeClass();
			$('#satifactory_level_' + measureValue.MeasurementId).empty().append('INVALID INPUT');
		}

		if (measureValue.MeasurementValue === null || measureValue.MeasurementValue === undefined) {
			$('#satifactory_level_' + measureValue.MeasurementId).removeClass();
			$('#satifactory_level_' + measureValue.MeasurementId).empty();
        }

		$('#measure_field_value_id' + measureValue.MeasurementId).val(measureValue.MeasurementValue);
	}
}

function RetrieveMeasurementValuesPerKpi(kpisubtype_Id) {
    var data
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveMeasurementValuesPerKpi",
        data: { kpiSubtypeId: kpisubtype_Id,},
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function AddIndividualTestScenarioMeasureValue(testscenario_id ,measurement_id, measurement_value) {
    var data;
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/AddIndividualTestScenarioMeasureValue",
		data: {testScenarioId: testscenario_id, measurementId: measurement_id, measurementValue: measurement_value },
		success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveLatestTestScenarioMeasureValue(testscenario_id ,measurement_id) {
    var data
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveLastestTestScenarioMeasureValue",
        data: {testScenarioId: testscenario_id, measureId: measurement_id},
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function CloseModal() {
	$('#modal_5groutes').remove();
	$('#Mymodal').remove();
}

function EditUseCase() {
	$('#uc_description_id')[0].readOnly = false;
	$('#uc_responsible_id')[0].readOnly = false;
	$('#uc_contact_id')[0].readOnly = false;
	$('#uc_date_id')[0].readOnly = false;
	$('#uc_id_string')[0].readOnly = false;
	oldcasedescription = $('#uc_description_id').val()
	oldresponsible = $('#uc_responsible_id').val()
	oldcontact = $('#uc_contact_id').val()
	olddate = $('#uc_date_id').val()
	oldcasecode = $('#uc_id_string').val().trim()
	UC_HideEditButton();
	UC_ShowSaveCancelButtons();
    UC_ShowThresholdUseCaseConfigButtons();
}

function CancelEdit() {
	$('#uc_description_id')[0].readOnly = true;
	$('#uc_responsible_id')[0].readOnly = true;
	$('#uc_contact_id')[0].readOnly = true;
	$('#uc_date_id')[0].readOnly = true;
	$('#uc_id_string')[0].readOnly = true;
	$('#uc_description_id').val(oldcasedescription);
	$('#uc_responsible_id').val(oldresponsible);
	$('#uc_contact_id').val(oldcontact);
	$('#uc_date_id').val(olddate);
	$('#uc_id_string').val(oldcasecode);
	UC_ShowEditButton();
	UC_HideSaveCancelButtons();
    UC_HideThresholdUseCaseConfigButtons();
	$("#uc_description_id").removeClass('userNotFoundClass');
	$("#uc_responsible_id").removeClass('userNotFoundClass');
	$("#uc_contact_id").removeClass('userNotFoundClass');
	$("#uc_id_string").removeClass('userNotFoundClass');
	$('.errormessageusecase').empty();
}

function SaveUseCase() {
	var UseCaseID, CaseDescription, Responsible, Contact, Date;
	$("#uc_description_id").removeClass('userNotFoundClass');
	$("#uc_responsible_id").removeClass('userNotFoundClass');
	$("#uc_contact_id").removeClass('userNotFoundClass');
	$("#uc_id_string").removeClass('userNotFoundClass');
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

	if ($('#uc_id_string').val().trim() == '') {
		errormessage += '*Use Case Code Cannot Be Empty </br>';
		$("#uc_id_string").addClass('userNotFoundClass');
		valid = false;
	}
	else {
		var useCaseCode = $('#uc_id_string').val();
		var uc_id = $('#uc_id').val();
		if (ValidateUseCaseCode(useCaseCode, uc_id) == false) {
			errormessage += '*Use Case Code already in use!</br>';
			$("#uc_id_string").addClass('userNotFoundClass');
			valid = false;
        }
    }


	if (valid == false) {
		$('.errormessageusecase').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>');

	} else {
		$('#uc_description_id')[0].readOnly = true;
		$('#uc_responsible_id')[0].readOnly = true;
		$('#uc_contact_id')[0].readOnly = true;
		$('#uc_date_id')[0].readOnly = true;
		$('#uc_id_string')[0].readOnly = true;
		UseCaseID = $('#uc_id').val();
		CaseDescription = $('#uc_description_id').val();
		Responsible = $('#uc_responsible_id').val();
		Contact = $('#uc_contact_id').val();
		Date = $('#uc_date_id').val();
		oldcasecode = $('#uc_id_string').val().trim();
		UC_ShowEditButton();
		UC_HideSaveCancelButtons();
        UC_HideThresholdUseCaseConfigButtons();
		$('#ucdesc_id option:selected').text($("#uc_description_id").val()).trigger('chosen:updated')
		$.ajax({
			async: false,
			type: "POST",
			url: "/_5groutes/EditUseCase",
			data: {
				UseCaseID: UseCaseID,
				UseCaseCode: oldcasecode,
				CaseDescription: CaseDescription,
				Responsible: Responsible,
				Contact: Contact,
				Date: Date
			},
			success: function (response) {
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
					url: "/_5groutes/ScenarioOverWrite",
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
		url: "/_5groutes/RetrieveScenarioPerUseCase",
		data: { usecase_id: usecase_id },
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	//debugger;
	html += '<div id="modal_5groutes" class="modal">';
	html += '	<div class="modal-content">';
	html +=			'<div class="modal-header">';
	html += '			<h4>Duplicate Existing Scenario</h4>';
	html += '			<span onclick="CloseModal()" class="close">&times;</span>';
	html += '		</div>';
	html += '		<div class="mainbodyborder">'
	html += '			<div class="modalwidth90">'
	html += '				<div class="modalbody_class">'
	html += '					<div class="row" style="padding: 4px !important;">'
	html += '						<div class="col-sm-5">'
	html += '							Data of Scenario:'
	html += '						</div>'
	html += '						<div class="col-sm-7">'
	html += '							<input type="text" id="scenario_to_id" readonly>'	
	html += '						</div>'
	html += '					</div>'
	html += '					<div class="row" style="padding: 4px !important;">'
	html += '						<div class="col-sm-5">'
	html += '							Will be replaced with the data of:'
	html += '						</div>'
	html += '						<div class="col-sm-7">'
	html += '							<select id="scenario_from_id" onchange = "">'
	html += '							<option selected value="0">Select an Option</option>'
	for (var i = 0; i < data.length; i++) {
		if (data[i].UseCaseScenarioId != scenarioid) {
			html += '					<option value="' + data[i].UseCaseScenarioId + '">' + data[i].UseCaseScenarioDescription + '</option>';
		}
	}
	html += '							</select>'
	html += '						</div>'
	html += '					</div>'
	html += '				<div class="row" style="padding: 4px !important;">'
	html += '					<div class="col-sm-12 modaloverwriteerror">'
	html += '				</div>';
	html += '			</div>';
	html += '			<div class="row" style="padding: 4px !important;">'
	html += '				<div class="col-sm-12 modalbuttons main-buttons-with-icons">'	
	html += '					<button class="savebutton sacecancelbuttonoc" onclick="CheckOverWriteButton()" type="button">Overwrite<i class="marginicon fas fa-clone"></i></button>';
	html += '					<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
	html += '				</div>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>'
	html += '</div>'; 
	$(".homemodal").append(html);
	$('#modal_5groutes').show();
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

function RetrieveScenarioDetailsPerId(scenario_id) {
	var scenario;

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/RetrieveScenarioPerId",
        data: { scenarioId: scenario_id },
        success: function (response) {
            scenario = JSON.parse(response.result);
        },
        error: function (error) {

        }
	});

    return scenario;
}

function RetrieveTestDetailsPerId(test_id) {
    var test;

    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveTestDetailsPerId",
        data: { testId: test_id },
        success: function (response) {
            test = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });

    return test;
}

function RetrieveTestScenarioDetailsPerId(testId) {
    var test;

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/RetrieveTestScenarioPerId",
        data: { testScenarioId: testId },
        success: function (response) {
			test = JSON.parse(response.result);
            console.log(test);
        },
        error: function (error) {

        }
    });

    return test;
}

function EditScenario() {

	var selectedScenarioId = parseInt($('#scenariodesc_id').val());

    var selectedScenario = RetrieveScenarioDetailsPerId(selectedScenarioId);

	var html = '';
	html += '<div id="modal_5groutes" class="modal">';
	html += '	<div class="modal-content">';
	html += '		<div class="modal-header">';
	html += '			<h4>Edit Scenario</h4>';
	html += '			<span onclick="CloseModal()" class="close">&times;</span>';
	html += '		</div>';
	html += '		<div class="mainbodyborder">'
	html += '			<div class="modalwidth90">'
	html += '				<div class="modalbody_class">'
	html += '					<div class="row" style="padding: 4px !important;">'
	html += '						<div class="col-sm-4">'
	html += '							Test Scenario Description:'
	html += '						</div>'
	html += '						<div class="col-sm-8">'
	html += '							<input type="text" id="newscenariodescription" style="margin:-5px;">'	
	html += '						</div>'
	html += '					</div>'
    html += '					<div class="row scenariotrialtypechosen" style="padding: 4px !important;">'
    html += '							<div class="col-sm-4">'
    html += '								Test Scenario Trial Type:'
    html += '							</div>'
    html += '						<div class="col-sm-8">'
    html += '							<select id="scenariotrialtype_id">'
    html += '								<option value="Field Trial">Field Trial</option>';
    html += '								<option value="Lab Trial">Lab Trial</option>';
    html += '							</select>'
    html += '						</div>'
    html += '					<div class="row" style="padding: 4px !important;">'
    html += '						<div class="col-sm-12 modaloverwriteerror">'
    html += '					</div>';
    html += '				</div>';
    html += '			</div>';
	html += '			<div class="row" style="padding: 4px !important;">'
	html += '		<div class="col-sm-12 modalbuttons main-buttons-with-icons">'
	html += '			<button class="savebutton sacecancelbuttonoc" onclick="SubmitEditedScenario()" type="button">Save<i class="marginicon fas fa-save"></i></button>';
	html += '			<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	html += '</div>'
	html += '</div>'; 
	$(".homemodal").append(html);
	$('#modal_5groutes').show();
	//$('#newscenariodescription').val($('#scenariodesc_id option:selected').text());
    console.log(selectedScenario);
	$('#newscenariodescription').val(selectedScenario.UseCaseScenarioDescription);

    $('#scenariotrialtype_id').val(selectedScenario.UseCaseScenarioTrialType);

    $('#scenariotrialtype_id').chosen({ search_contains: true });
}

function EditTestScenario() {
	var selectedTestScenarioId = parseInt($('#testscenariodesc_id').val());

	var selectedTestScenario = RetrieveTestScenarioDetailsPerId(selectedTestScenarioId);

	var html = '';
	html += '<div id="modal_5groutes" class="modal">';
	html += '	<div class="modal-content">';
	html += '		<div class="modal-header">';
	html += '			<h4>Edit Test Scenario</h4>';
	html += '			<span onclick="CloseModal()" class="close">&times;</span>';
	html += '		</div>';
	html += '		<div class="mainbodyborder">'
	html += '			<div class="modalwidth90">'
	html += '				<div class="modalbody_class">'
	html += '					<div class="row" style="padding: 4px !important;">'
	html += '						<div class="col-sm-4">'
	html += '							Test Name:'
	html += '						</div>'
	html += '						<div class="col-sm-8">'
	html += '							<input type="text" id="testScenarioName" readonly style="margin:-5px;">'
	html += '						</div>'
	html += '					</div>'
    html += '					<div class="row" style="padding: 4px !important;">'
    html += '						<div class="col-sm-4">'
    html += '							Test Description:'
    html += '						</div>'
    html += '						<div class="col-sm-8">'
    html += '							<input type="text" id="testScenarioDescription" style="margin:-5px;"/>'
    html += '						</div>'
	html += '					<div class="row" style="padding: 4px !important;">'
	html += '						<div class="col-sm-12 modaloverwriteerror">'
	html += '					</div>';
	html += '				</div>';
	html += '			</div>';
	html += '			<div class="row" style="padding: 4px !important;">'
	html += '		<div class="col-sm-12 modalbuttons main-buttons-with-icons">'
	html += '			<button class="savebutton sacecancelbuttonoc" onclick="SubmitEditedTestScenario()" type="button">Save<i class="marginicon fas fa-save"></i></button>';
	html += '			<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	html += '</div>'
	html += '</div>';
	$(".homemodal").append(html);
	$('#modal_5groutes').show();

	$("#testScenarioName").val(selectedTestScenario.TestScenarioName);
	$("#testScenarioDescription").val(selectedTestScenario.TestScenarioDescription);
}

function SubmitEditedTestScenario() {
	var scenario_id = $('#scenariodesc_id').val();

    var testScenarioId = $('#testscenariodesc_id').val();
	var testScenarioName = $('#testScenarioName').val();
	var testScenarioDescription = $('#testScenarioDescription').val();
	
    $('.modaloverwriteerror').empty()
    var errormessage = '';
    var valid = true;
    if (testScenarioName == '' || testScenarioName == undefined) {
        valid = false;
        errormessage = '* Test Scenario Name cannot be empty</br>'
		$("#testScenarioName").addClass('userNotFoundClass');
    }
    if (valid == true) {
        CloseModal();
        $.ajax({
            type: "POST",
            url: "/_5groutes/EditTestScenario",
			data: { testId: testScenarioId, testName: testScenarioName, testDescription: testScenarioDescription },
            success: function (response) {
                GenerateTestScenarioDropdown(scenario_id, null);
				$('#testscenariodesc_id').val(testScenarioId);
				$('#testscenariodesc_id').trigger('chosen:updated')
				/*FillTablesWithData(scenario_id);*/

				ShowKPITables();
                TSCENARIO_ShowDetailedTestInfo(testScenarioId);

                //SCENARIO_ShowDuplicateButton();
                //SCENARIO_ShowVisualiseKpiButton();
                //SCENARIO_ShowAddButton()
                //SCENARIO_ShowEditButton();
                //SCENARIO_ShowDeleteButton();
                //SCENARIO_ShowDetailedScenarioInfo(scenario_id);
                //UC_ShowEditButton();
                ShowSuccessMessage("Test Scenario Edited Successfully!")
            },
            error: function (error) {
                console.log(error);
            }
        });
    } else {
        $(".modaloverwriteerror").empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>');
    }
}

function AddNewScenario() {
	var html = '';

	html += '<div id="modal_5groutes" class="modal">';
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
	html += '	<div class="col-sm-4">'
	html += '		Test Scenario Description:'
	html += '	</div>'
	html += '	<div class="col-sm-8">'
	html += '		<input type="text" id="newscenariodescription" style="margin:-5px;">'
	html += '	</div>'
	html += '</div>'

    html += '<div class="row scenariotrialtypechosen" style="padding: 4px !important;">'
	html += '<div class="col-sm-4">'
    html += 'Test Scenario Trial Type:'
	html += '</div>'
    html += '<div class="col-sm-8">'
    html += '<select id="scenariotrialtype_id">'
	html += '<option value="Field Trial">Field Trial</option>';
	html += '<option value="Lab Trial">Lab Trial</option>';
	html += '</select>'
    html += '</div>'
	html += '<div class="row" style="padding: 4px !important;">'
	html += '	<div class="col-sm-12 modaloverwriteerror">'
	html += '	</div>';
	html += '</div>';
    html += '</div>';
	html += '<div class="row" style="padding: 4px !important;">'
	html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'
	html += '<button class="savebutton sacecancelbuttonoc" onclick="SubmitNewScenario()" type="button">Add<i class="marginicon fas fa-plus"></i></button>';
	html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>'
	html += '</div>'; 
	$(".homemodal").append(html);
	$('#modal_5groutes').show();

	$('#scenariotrialtype_id').chosen({ search_contains: true });
	TSCENARIO_ShowTestScenarioButtonBloc();
	TSCENARIO_HideSelectedTestStatus();
	TSCENARIO_ShowAddButton();
	TSCENARIO_HideEditButton();
	TSCENARIO_HideDeleteButton();
	TSCENARIO_HideStopTestButton();
}

function SubmitNewScenario() {
	var usecase_id = $('#ucdesc_id').val();
	var usecasedescription = $('#newscenariodescription').val();
	var usecase_trial_type = $('#scenariotrialtype_id').val();

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
			url: "/_5groutes/AddNewScenario",
			data: { usecase_id: usecase_id, usecasedescription: usecasedescription, usecasetrialtype: usecase_trial_type },
			success: function (response) {
				let data = JSON.parse(response.result)
                GenerateScenarioDropdown(usecase_id, data);
				FillTablesWithData(data);
                var newScenario = data;
				SCENARIO_ShowDetailedScenarioInfo(newScenario);
				SCENARIO_ShowDuplicateButton();
                SCENARIO_ShowAddButton()
                SCENARIO_ShowEditButton();
                SCENARIO_ShowDeleteButton();
				//if (view == 'tables') {
				//	SCENARIO_ShowVisualiseKpiButton();
				//	SCENARIO_ShowExperimentResultsEvaluationButton()
				//	UC_ShowEditButton();
				//	SCENARIO_ShowAddButton()
				//	SCENARIO_ShowEditButton();
				//	SCENARIO_ShowDeleteButton();
				//}
                UCShowAnalyticTab();

                ShowSuccessMessage("New Scenario added successfully!");
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
    var usecase_trial_type = $('#scenariotrialtype_id').val();

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
			url: "/_5groutes/EditScenario",
			data: { scenario_id: scenario_id, usecasedescription: usecasedescription, usecasetrialtype: usecase_trial_type },
			success: function (response) {
				GenerateScenarioDropdown(usecase_id, null)
				$('#scenariodesc_id').val(scenario_id);
				$('#scenariodesc_id').trigger('chosen:updated')
				FillTablesWithData(scenario_id);
				SCENARIO_ShowDuplicateButton();
				//SCENARIO_ShowVisualiseKpiButton();
				SCENARIO_ShowAddButton()
				SCENARIO_ShowEditButton();
				SCENARIO_ShowDeleteButton();
                SCENARIO_ShowDetailedScenarioInfo(scenario_id);
				UC_ShowEditButton();
				ShowSuccessMessage("Scenario Edited Successfully!")
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
					url: "/_5groutes/DeleteScenario",
					data: {
						scenario_id: scenario_id,
					},
					success: function (response) {
                        GenerateScenarioDropdown(usecase_id, null);
						ResetScenarioSection();
                        SCENARIO_ShowAddButton();
                    },
					error: function (error) {

					}
				});
			}
		});
}

function DeleteTestScenario() {
    var scenario_id = $('#scenariodesc_id').val();
    var testscenario_id = $('#testscenariodesc_id').val();
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Test Scenario",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/_5groutes/DeleteTestScenario",
                    data: {
						testScenarioId: testscenario_id
                    },
                    success: function (response) {
                        GenerateTestScenarioDropdown(scenario_id, null);
                        $('#testscenariodesc_id').val(0);
						$('#testscenariodesc_id').trigger('chosen:updated');
						TSCENARIO_HideEditButton();
						TSCENARIO_HideDeleteButton();
                        TSCENARIO_ShowAddButton();
                        //SCENARIO_HideDuplicateButton()
                        //SCENARIO_HideVisualiseKpiButton()
                        //SCENARIO_HideConfigureKpiKpiButton()
						HideKPITables();
						$('#testDescriptionFieldbloc').empty();
                        //SCENARIO_HideEditButton()
                        //SCENARIO_HideDeleteButton()
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
	var user_name = $('#project_user_name').val().split('(')[1].split(')')[0];
	//debugger;
	$.ajax({
		type: "POST",
		async: false,
		url: "/_5groutes/RetrieveUseCases",
		data: {
			userid: useridmain,
			username: user_name,
		},
		success: function (response) {
			data = JSON.parse(response.result);		
		},
		error: function (error) {

		}
	});
	return data;
}



function RetrieveScenarioPerUseCase_JS(usecase_id) {
	var data = []
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveScenarioPerUseCase",
		data: { usecase_id: usecase_id },
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return data;
}

function RetrieveTestScenariosPerScenario_JS(scenario_id) {
	var data = [];
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/RetrieveTestScenariosPerScenario",
		data: { scenario_Id: scenario_id },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveKPI_JS(scenario_id) {
	var data
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIs",
		data: { scenario_id: scenario_id },
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return data;
}

function RetrieveKPIThresholdPerUseCase_JS(useCaseId) {
	var data
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveKPIThresholdPerUseCase",
		data: { usecaseId: useCaseId },
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return data;
}

function RetrievePIMeasurementDetails(useCaseId) {
    var data;
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveTestScenarioMeasurementPerUseCase",
		data: { usecase_Id: useCaseId },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function RetrieveAllTestMeasurementValuesPerTest(testscenario_id) {
	var data;

    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveAllTestMeasurementValuesPerTest",
        data: { testScenarioId: testscenario_id },
		success: function (response) {
            data = JSON.parse(response);
        },
        error: function (error) {

        }
	});

    return data;
}

function RetrieveDetailedTestMeasurmentValues(testscenario_id) {
	var data;

	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveDetailedTestMeasurmentValues",
		data: { testScenarioId: testscenario_id },
		success: function (response) {
			data = response;
		},
		error: function (error) {

		}
	});

	return data;
}

function RetrieveMeasurementValuesPerScenarioAndKpiSubtypeId(scenario_id, kpisubtype_id) {
	var data;

    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveMeasurementValuesPerScenarioAndKpiSubtypeId",
		data: { scenarioId: scenario_id, subtypeKpiId: kpisubtype_id},
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
	});
    return data;
}

function RetrieveMeasurementValuesPerTestAndKpiSubtypeId(test_id, kpisubtype_id) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveMeasurementValuesPerTestAndKpiType",
        data: { testId: test_id, subtypeKpiId: kpisubtype_id },
        success: function (response) {
            data = JSON.parse(response.result);
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
		url: "/_5groutes/RetrieveUCGeneralInfo",
		data: { usecase_id: usecase_id },
		success: function (response) {
			data = JSON.parse(response.result);
			//console.log(data)
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
		url: "/_5groutes/RetrieveUnits",
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
		url: "/_5groutes/RetrieveOperators",
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
		url: "/_5groutes/RetrieveKPI",
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
// second result table 

function RetrieveSingleExperimentResultsEvaluation2(id) {
	//debugger;
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveSingleExperimentResultsEvaluation",
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
function RetrieveSingleExperimentResultsEvaluation(id) {
	//debugger;
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveSingleExperimentResultsEvaluation",
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

function RetrieveExperimentResultsEvaluationPerScenarioID(testscenarioid) {
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveExperimentResultsEvaluationPerTestID",
		data: {
			testId: testscenarioid,
		},
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return data;
}

function RetrieveTestAttachmentFiles(testscenario_id) {
    var data;
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/RetrieveExperimentResultsEvaluationPerScenarioID",
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

function RetrieveAttachmentPerTestId(testId) {
    var data;
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/RetrieveTestAttachmentFiles",
        data: {
            testScenarioId: testId,
        },
        success: function (response) {
            data = response;
        },
        error: function (error) {

        }
    });
    return data;
}


/*OTHER METHODS*/
function RetrieveDomainCoordinates(id) {
	var result = null;
	//debugger;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveDomainCoordinates",
		data: {
			id: id
		},
		success: function (response) {
			result = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return result;
}
function UC_Domain_OnChange() {
	//debugger;
	var id = $('#domain_list').val();
	if (id != "-1") {
		var data = RetrieveDomainCoordinates(id);
	}
	if (data != null) {
		//var html = '<select id="coordinates_list" style="margin:-5px;" onchange="UC_Coordinate_OnChange()">';
		var html = '<select id="coordinates_list" style="margin:-5px;" onchange="OnYamlTypeChange()">';
		html += '<option selected value="-1">Select Coordinate...</option>';

		for (var i = 0; i < data.length; i++) {
			html += '<option value="' + data[i].Id + '">' + data[i].Coordinates + '</option>';
		}
		html += '</select>';

		$('#Coordinates').html(html);
		$('#coordinates_list').chosen({ search_contains: true });
		$('#Coordinates-div').show();
	}
}
function UC_Coordinates_OnChange() {
	//debugger;
	var id = $('#coordinates_list').val();
	
	if (id != null) {
		
		
		html += '<div class="col-sm-8 fileuploaderexperiment">'
		html += '<input type="file" id="artefact_file_picker" accept=".tar.gz, .tgz">';
		

		html += '</div>'
		html += '</div>'

		//$('#Coordinates').html(html);
		//$('#coordinates_list').chosen({ search_contains: true });
		//$('#Coordinates-div').show();
	}
}
//myfileuploadCode
function uploadYaml() {
	//debugger;
	//var files = $('#Uploadfile').files[0];// e.target.files;
	var files = document.getElementById('Uploadfile').files;//
	if (files.length > 0) {
		if (window.FormData !== undefined) {
			var data = new FormData();
			//debugger;
			for (var x = 0; x < files.length; x++) {
				data.append("file" + x, files[x]);
			}
			$.ajax({
				type: "POST",
				url: "/_5groutes/UploadYamlFile",
				contentType: false,
				processData: false,
				data: data,
				success: function (result) {
					alert(result)
				},


			//})
		//}
		error: function (xhr, status, p3, p4) {
			alert('Something is going to wrong please try again!');
		}
	});
    } else {
	alert("Upgrade your browser!");
}
}
};
function UC_Coordinate_OnChange() {
	if ($('#coordinates_list').val() != "-1") {
		TSCENARIO_ShowStartNewTestButton();
	}
}
function AddNewTestScenario() {
	//debugger;
	var networkServices = FetchNetworkServices();
	// domain calling function''
	var domains = JSON.parse(FetchDomainName().replace(/\\/g, "")); //  calling function
	
	var html = '';
	html += '<div id="modal_5groutes" class="modal">';
	html += '	<div class="modal-content">';
	html += '		<div class="modal-header">';
	html += '			<h4>Select Network Service</h4>';
	html += '			<span onclick="CloseModal()" class="close">&times;</span>';
	html += '		</div>';
	html += '		<div class="mainbodyborder">'
	html += '			<div class="modalwidth90">'
	html += '				<div class="modalbody_class">'
	if (networkServices != null) {
		html += '					<div class="row" style="padding: 4px !important;">'
		html += '						<div class="col-sm-4">'
		html += '							Network Services:'
		html += '						</div>'
		html += '						<div class="col-sm-8">'
		html += '							<select id="network_services_list" style="margin:-5px;">'
		html += '							<option selected value="-1">Select Network Services...</option>'
		for (var i = 0; i < networkServices.length; i++) {
			html += '							<option value="' + networkServices[i] + '">' + networkServices[i] + '</option>';
		}
		/*html += '							<option value="NS1">NS1</option><option value="NS2">NS2</option>';*/
		html += '                           </select>'
		html += '						</div>'
		html += '					</div>'
		html += '					<div class="row" style="padding: 4px !important;">'
		html += '						<div class="col-sm-4">'
		html += '							Domain:'
		html += '						</div>'
		html += '						<div class="col-sm-8">'
		html += '					<select id="domain_list" style="margin:-5px;" onchange="UC_Domain_OnChange()">'
		html += '						<option selected value="-1">Select Domain Type...</option>'
		//debugger;
		for (var i = 0; i < domains.length; i++) {
			html += '							<option value="' + domains[i].Id + '">' + domains[i].DomainName + '</option>';
		}
		html += '                           </select>'
		html += '						</div>'
		html += '					</div>'
		//MYCODE
		html += '					<div class="row" id="Coordinates-div" style="padding: 4px !important;display:none;">'
		html += '						<div class="col-sm-4">'
		html += '							Coordinates:'
		html += '						</div>'
		html += '						<div class="col-sm-8" id="Coordinates">'
		
		html += '						</div>'
		html += '					</div>'
		//html += '            <div class="row" style="padding: 4px !important;">'
		//html += '            <div class="col-sm-4">'
		//html += '           Upload Yaml File:'
		//html += '           </div>'
		//html += '			<div class="col-sm-8" id="configurationparameters">'
		//html += '			<div class="col-sm-8 ">'
		//html += '			<input type="file" id="Uploadfile" onclick=uploadYaml() accept=".tar.gz, .tgz">';
		///*html += '<input type="hidden" id="artefact_file_id" />'*/

		//html += '</div>'
		//html += '</div>'

		/*---------------new file test--------------------*/
		html += '<div id="artefact_file_chosen_block"></div>'

		html += '<div class="row" style="padding: 4px !important;">'
		html += '<div class="col-sm-12 addnewartefactfileerror">'
		html += '</div>';
		html += '</div>';

		html += '<div class="row" style="padding: 4px !important;">'
		//html += '<input id="selected_test_file_Id" type="hidden"/>'

		html += '</div>';
		/*---------end file---- */
	}
	else {
		html += '					<div class="row" style="padding: 4px !important;">'
		html += '						<div class="col-sm-12 modaloverwriteerror">'
		html += '						<label class=".alert-danger-login alert alert-danger">“Error connecting to CAM Services Platform. Please check VPN connection or calling service is active”</label>';
		html += '					</div>';
		html += '					</div>';
	}
	html += '			</div>';
	html += '			<div class="row" style="padding: 4px !important;">'
	html += '			<div class="col-sm-12 ExperimentResultsModalButtons modalbuttons main-buttons-with-icons">'
	html += '			<button id="browse_btn" class="savebutton sacecancelbuttonoc" onclick="BrowseFileYaml()" type="button">Browse<i class="marginicon fas fa-folder-open"></i></button>';
	//savebutton
	html += '		<div style="display:inline" class="col-sm-12 modalbuttons main-buttons-with-icons">'
	html += '      <button class="savebutton sacecancelbuttonoc" onclick="StartNewTestScenario()" type="button">Start Test Now!<i class="marginicon fas fa-plus"></i></button>';
	html += '		<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	html += '</div>'
	html += '</div>';

	$(".homemodal").append(html);
	$('#modal_5groutes').show();
	//debugger;
	$('#network_services_list').chosen({ search_contains: true });
	$('#domain_list').chosen({ search_contains: true });
	TSCENARIO_HideStartNewTestButton();
}
function mqttResponseTable(data) {
	//debugger;
	var html = ' <table class="table table-striped" id="tblMqttResponse">';
	html += ' <thead><tr style="font-"><th>nsId</th><th>brokerId</th><th>nsdId</th><th>status</th></tr> </thead>';
	html += ' <tbody><tr><td id="lblNewtestId">' + data.nsId + '</td><td>' + data.brokerId + '</td><td>' + data.ns_info.nsdId + '</td> ';

	if (data.status == 'INSTANTIATED') {
		html += '<td style="color:green;"><b>' + data.status + '</b></td>';
	}
	else {
		html += '<td style="color:red"><b>' + data.status + '</b></td>';
	}
	html += '</tr></tbody>';
	html += ' </table>';
	return html;
}
function StartNewTestScenario() {
	document.getElementById("overlay").style.display = "block"; // loader

	var networkService = $('#network_services_list').val();
	var domainId = $('#domain_list').val();
	var coordinates = $('#coordinates_list option:selected').text();
	var yaml = $('#artefact_file_id').val();
	//var yaml1 = $('#Yaml_file_picker').val();

	$("#lbldomain").html(domainId);
	CloseModal();
	//debugger;
	var usecaseId = $('#uc_id_string').val();
	var scenarioId = $('#scenariodesc_id').val();
	

    var testScenarioId;
    var trialTypeAcro = GetTrialTypeAcro();
	//debugger;
    var newTestName = 'UC' + usecaseId.trim() + 'SC' + scenarioId.trim() + trialTypeAcro + '_T';

	var savedTest = AddTestScenario(usecaseId, scenarioId, newTestName, networkService, domainId, coordinates, yaml);
	//debugger;
	// if response get then display in MQTT table
	if (savedTest != null) {
		newTestName += savedTest.operationId + ' running';
		$('#test_Mqtt_status').empty().append(mqttResponseTable(savedTest));
	}
    TSCENARIO_HideAddButton();
	$('#test_scenario_status').empty().append(newTestName);
    TSCENARIO_ShowSelectedTestStatus();
	TSCENARIO_ShowStopTestButton();
	//TSCENARIO_ShowStopNetworkServiceButton();
	TSCENARIO_HideStopNetworkServiceButton();
	$('#test_scenario_status').prepend('<input type="hidden" id="created_scenario_test_id"/>');
	$('#created_scenario_test_id').val(savedTest.operationId);
	
	ResetTestSection();

	ShowKPITables();
	// close loader
	$("#overlay").css("display", "none");
	$("#loader").css("display", "none");
}



function StopNetworkService() {
	var html = '<div id="Mymodal" class="modal" tabindex="-1" role="dialog">';
	html += '<div class="modal-dialog modal-dialog-centered" role = "document">';
    html += '<div class="modal-content">';
 
    html += '<div class="modal-body">';
	html += '<p>Do you want to terminate network service?</p>';
    html += '</div>';
    html += '<div class="modal-footer">';
	html += '<button type="button" class="btn btn-primary" onclick="YesTerminateNetworkService()">Yes</button>';
	html += '<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="NoTerminateNetworkService()">No</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

	
	
	//$("#mqtt-data").hide();
	//$("#test_Mqtt_status").hide();

	$(".homemodal").append(html);
	$('#Mymodal').show();
}
function YesTerminateNetworkService() {
	//debugger;
	
	$('#Mymodal').hide();

	var testScenarioId = $('#created_scenario_test_id').val();//2078
	var scenarioId = $('#scenariodesc_id').val();
	var newtestId = $("#lblNewtestId").text(); //UC1.3SC10078LT_T101010
	var scenarioId = $('#scenariodesc_id').val();
	StopTestScenario(testScenarioId, newtestId, "StopTer");
	GenerateTestScenarioDropdown(scenarioId, testScenarioId);
	TSCENARIO_ShowDetailedTestInfo(testScenarioId);
	Test_Scenario_Onchange();

}
function NoTerminateNetworkService() {
	$('#Mymodal').hide();
	return false;
}

function StopRunningTestScenario() {
	
	//debugger;
	TSCENARIO_HideStopTestButton(); 
    TSCENARIO_HideSelectedTestStatus();
	//TSCENARIO_ShowAddButton();
	TSCENARIO_ShowStopNetworkServiceButton();
	var testScenarioId = $('#created_scenario_test_id').val();//2078
	var scenarioId = $('#scenariodesc_id').val();
	var newtestId = $("#lblNewtestId").text();//UC1.3SC10078LT_T101010	
	StopTestScenario(testScenarioId, newtestId,"StopTWP");
	//debugger;
	//GenerateTestScenarioDropdown(scenarioId, testScenarioId);
   // TSCENARIO_ShowDetailedTestInfo(testScenarioId);
	/*TSCENARIO_RefreshDropdown(scenarioId);*/
	/*TSCENARIO_SetDropdownValue(testScenarioId);*/
   // Test_Scenario_Onchange();

}

function GetTrialTypeAcro() {
	var trialTypeString = $('#scenariotrial_id').val();
    var res;
	if (trialTypeString == 'Lab Trial') {
        res = 'LT';
    }
	else{
        res = 'FT';
	}
    return res;
}

function FetchNetworkServices() {
	//debugger;
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/FetchTestNetworkServices",
		success: function (response) {
			data = response;
		},
		error: function (error) {

		}
	});

	return data;
}
function FetchDomainName() {
	//debugger;
	var data;
	$.ajax({
		async: false,
		type: "Get",
		url: "/_5groutes/RetrieveDomainName",
		success: function (response) {
			data = response.result;
		},
		error: function (error) {

		}
	});
	return data;
}

function AddTestScenario(usecaseid, scenarioid, testName, networkService, domainId, coordinate,yaml) {
	
	//debugger;
    var data;
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/AddTestScenario",
        data: {
			scenarioid: scenarioid,
			testname: testName,
			NS: networkService,
			domainId: domainId,
			coordinate: coordinate,
              yaml: yaml
        },
		success: function (response) {
			$('#lblMqttClientId').html(response.message);
			data = JSON.parse(response.result);
        },
        error: function (error) {

        }
	});
    return data;
}

function StopTestScenario(test_Id, testScenarioId, reqTpye) {
	//debugger;
	var domainId = $("#lbldomain").text();
	var clientId = $('#lblMqttClientId').text();
	//debugger;
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/StopTestScenario",
		data: {
			testId: test_Id,
			testScenarioId: testScenarioId ,
			domainId: parseInt(domainId),
			clientId: clientId,
			reqTpye : reqTpye
		},
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	//debugger;
	return data;
}

function GetMeasureSatisfactoryLevelInfos(testId, measurementId, value) {
	var data;

	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/EvaluateScenarioMeasurementSatifactoryLevel",
		data: {
			testScenarioId: testId,
			measurementId: measurementId,
			measurementValue: value
		},
		success: function (response) {
			data = response;
		},
		error: function (error) {

		}
	});

	return data;
}

function RetrieveAllArtefactTypes() {
	var data = []
	$.ajax({
		async: false,
		type: "POST",
		url: "/_5groutes/RetrieveAllArtefactTypes",
		success: function (response) {
			data = JSON.parse(response.result);
		},
		error: function (error) {

		}
	});
	return data;
}
/* ---------yaml file upload js code-------- */
function BrowseFileYaml() {
	//debugger;
	$('#Yaml_file_picker').click()
}
function OnYamlTypeChange() {
	//debugger;
	
	var coordinates = $('#coordinates_list').val();

	if (coordinates >= 0) {

		var html = '';
		html += '<div class="row" style="padding: 4px !important;">'
		html += '<div class="col-sm-4">'
		html += 'Upload Yaml File:'
		html += '</div>'
		html += '<div class="col-sm-8 fileuploaderexperiment">'
		html += '<input type="file" id="Yaml_file_picker" accept=".yaml">';
		html += '<input type="hidden" id="artefact_file_id" />'

		html += '</div>'
		html += '</div>'

		$('#artefact_file_chosen_block').empty().append(html);
		var selectedArtefactTypeExt = 'yaml';//selectedArtefact.ArtefactTypeExtension;
		// debugger;
		var username = '5groutes';// $('.username-left').text();
		//debugger;
		$('#Yaml_file_picker').fileinput({
			theme: "fas",
			uploadUrl: '/_5groutes/UploadYamlFile',
			uploadExtraData: function (previewId, index) {
				
				return { username: '5groutes', artefactType: 'yaml' };
			},
			deleteUrl: '/_5groutes/DeleteUploadedYamlFile',
			deleteExtraData: function (previewId, index) {
				//debugger;
				return { username: username, artefactFileName: $('#artefact_file_id').val() };
			},
			showUpload: false,
			hideThumbnailContent: true,
			showCaption: true,
			autoReplace: true,
			captionClass: "testResult-uploaded-value",
			maxFileCount: 1,
			maxFileSize: 25600000000, // 256 MB
			browseClass: "d-none",
			initialPreviewAsData: true,
			overwriteInitial: false,
			showRemove: false,
			previewFileIcon: '<i class="fa-solid fa-file-zipper"></i>',
			preferIconicZoomPreview: true,
			allowedFileExtensions: Array.of(selectedArtefactTypeExt)
		}).on('fileuploadprocessalways', function (e, data) {
			//debugger;
			var index = data.index,
				file = data.files[index],
				node = $(data.context.children()[index]);
			if (file.preview) {
				node
					.prepend('<br>')
					.prepend(file.preview);
			}
			if (file.error) {
				node
					.append('<br>')
					.append($('<span class="text-danger"/>').text(file.error));
			}
			if (index + 1 === data.files.length) {
				data.context.find('button')
					.text('Upload')
					.prop('disabled', !!data.files.error);
			}
		}).on('fileloaded', function (event, previewId, index, fileId) {
			
			$('.addnewartefactfileerror').empty();

		}).on('fileuploaded', function (event, previewId, index, fileId) {
			//debugger;
			if (previewId.response.status != 'SUCCESS') {
				
				if (previewId.response.onboard_code !== 200) {
					$('#Yaml_file_picker').fileinput('refresh'); //Refreshing the file input box
					//$('#browse_btn').hide();
				}

				$('.addnewartefactfileerror').empty()
					.append('<label class=".alert-danger-login alert alert-danger">' + previewId.response.status + '</label>');
			} else {
				$('#save_artefact_btn').removeClass('isDisabled');
				$('#artefact_file_id').val(previewId.response.fileId);
				
				// debugger;
				//$('#artefact_file_id').val(previewId.files.filter(t => t.name != null)[0].name);  
			}
			TSCENARIO_ShowStartNewTestButton();
			$('#browse_btn').hide();
		});


		$('#browse_btn').show();
		
	}
}
