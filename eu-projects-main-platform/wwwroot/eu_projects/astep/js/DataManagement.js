
var useridmain = 2;

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
//----------------Retrieve DATA ----------------
function RetrieveUseCases_JS() {
	var data;
	var user_name = $('#project_user_name').val().split('(')[1].split(')')[0];
	//debugger;
	$.ajax({
		type: "POST",
		async: false,
		url: "/Astep/RetrieveUseCases",
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
function Fill_UseInfo(usecase_id) {
	var data;
	data = RetrieveUCGeneralInfo(usecase_id);
	debugger;
	//$('#uc_id').val(data.UseCaseId);
	//$('#uc_description_id').val(data.UseCaseDescription);
	$('#uc_responsible_id').val(data.ResponsiblePerson);
	$('#uc_contact_id').val(data.ContactPerson);
	$('#uc_date_id').val(DateConversion(data.EntryDate));
	//$('#uc_id_string').val(data.UCID);
	//$('#uc_category').val(data.CategoryName);

	var result
	//result = FillGrid_ExperimentResultsEvaluation(usecase_id);

}

function RetrieveUCGeneralInfo(usecase_id) {
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "/Astep/RetrieveUCGeneralInfo",
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
function RetrieveMandrekasData() {
	var data;
	$.ajax({
		async: false,
		type: "POST",
		url: "Astep/RetrieveMandrekasData",
		data: { usecase_id: 0 },
		success: function (response) {
			data = JSON.parse(response.result);
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
		url: "/Astep/RetrieveSingleExperimentResultsEvaluation",
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

