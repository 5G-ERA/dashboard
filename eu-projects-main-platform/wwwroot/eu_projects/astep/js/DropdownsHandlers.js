var selectedTests = [];

function GenerateUCDropdown(isReadOnly) {
	var data;
	data = RetrieveUseCases_JS();
	debugger
	ChosenCreator(data, 'ucdescriptionchosen', 'ucdesc_id', 'Select dataset', isReadOnly, null);
}
function ChosenCreator(data, chosenclass, closenid, title, isReadOnly, selectedItemId) {
	var html = '';
	$('.' + chosenclass).empty();
	html += '<div class="col-md-2 col-sm-12">'
	html += '<label">' + title + '</label>'

	html += '</div>'
	if (closenid == 'ucdesc_id') {
		html += '<div class="col-md-6 col-12">'
		html += '<select id="' + closenid + '" onchange = "UC_Description_OnChange()">'
	}
	//else if (closenid == 'scenariodesc_id') {
	//	html += '<div class="col-md-10 col-12">'
	//	html += '<select id="' + closenid + '" onchange = "Scenario_Description_OnChange()">'
	//}
	debugger;
	for (var i = 0; i < data.length; i++) {
		if (title == 'Select dataset') {
			if(i==0) html += '<option selected value="">Select dataset</option>'
			html += '<option value="' + data[i].UseCaseId + '">' + data[i].UseCaseDescription + '</option>';
		}
	}
	html += '</select>'
	html += '</div>'
	//if (title == 'Select dataset') {
	//	html += '<div class="col-md-4 col-12 scnariobuttons main-buttons-with-icons buttons-margin-top">'
	//	if (!isReadOnly) {
	//		html += '<button class="editbuttonuc" onclick = "EditUseCase()" type = "button">Edit<i class="marginicon fas fa-edit"></i></button>'
	//		html += '<button class="savebutton sacecancelbuttonoc" onclick = "SaveUseCase()" type = "button">Save<i class="marginicon fas fa-save"></i></button>'
	//		html += '<button class="sacecancelbuttonoc" onclick = "CancelEdit()" type = "button">Cancel<i class="marginicon fas fa-window-close"></i></button>'
	//	}

	//	html += '</div>'
	//}

	html += '</div>'
	$('.' + chosenclass).append(html);

	if (selectedItemId != 'undefined' && !isNaN(selectedItemId) && selectedItemId != null) {
		$('#' + closenid).val(selectedItemId);
	}

	$('#' + closenid).chosen({ search_contains: true });
	UC_HideEditButton();
	UC_HideSaveCancelButtons()
	
}

function UC_Description_OnChange() {
	var usecase_id;
	usecase_id = $('#ucdesc_id').val();
	uidc = $('#ucdesc_id').val();
	document.cookie = "uid=" + usecase_id;
	//Fill_UseInfo(usecase_id);
	//HideKPITables();
	debugger;
	if (usecase_id == 0 || usecase_id == '') {

		
		//$('#uc_description_id')[0].readOnly = true;
		//$('#uc_responsible_id')[0].readOnly = true;
		//$('#uc_contact_id')[0].readOnly = true;
		//$('#uc_date_id')[0].readOnly = true;
		$('.experimentresults_dropdown_area').hide();
		$('.experimentresults_data_area').hide();
		$('.experiment_graph').hide();
		UC_ResetUseCaseSection();

		
	}
	else {
		//GenerateScenarioDropdown(usecase_id, null);
		debugger;
		if (usecase_id == 36) {
			Fill_UseInfo(usecase_id);
			FillGrid_ExperimentResultsEvaluation(usecase_id);

			//$('#uc_description_id')[0].readOnly = true;
			$('#uc_responsible_id')[0].readOnly = true;
			$('#uc_contact_id')[0].readOnly = true;
			$('#uc_date_id')[0].readOnly = true;
		}
		if (usecase_id == 37) {
			debugger;
			Fill_UseInfo(usecase_id);
			$('.experimentresults_dropdown_area').hide();
			$('.experimentresults_data_area').hide();
			$('.experiment_graph').hide();
			//$('#uc_description_id')[0].readOnly = true;
			$('#uc_responsible_id')[0].readOnly = true;
			$('#uc_contact_id')[0].readOnly = true;
			$('#uc_date_id')[0].readOnly = true;
		}
	}
}
function ClearSelectedTestCache() {
	selectedTests = [];
	console.log(selectedTests);
}