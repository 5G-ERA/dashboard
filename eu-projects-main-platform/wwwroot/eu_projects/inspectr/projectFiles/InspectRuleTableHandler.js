function GenerateInspectRuleTable() {
    var conditions = RetrieveLookupRules();

    var html = '<table id="table_rules" class="display" style="width:100%">';
    html += '       <thead class="table-rule-header">'
    html += '           <tr>'
    html += '               <th>Rule ID</th>'
    html += '               <th>Rule Name</th>'
    html += '               <th style="text-align:center; width:10%">Status</th>'
    html += '               <th>Name</th>'
    html += '               <th>State</th>'
    html += '           </tr>'
    html += '       </thead >'
    html += '       <tbody>'
    for (var i = 0; i < conditions.length; i++) {
        html += '           <tr>'
        html += '               <td>' + conditions[i].RuleID +'</td>'
        html += '               <td colspan="1" class="' + conditions[i].RuleID +'"><div class="readonly-component" id="ruleId_' + conditions[i].RuleID +'"></div></td>'
        html += '               <td></td>'
        html += '               <td>' + conditions[i].RuleName +'</td>'
        html += '               <td>' + conditions[i].Status+'</td>'
        html += '           </tr>';
        
    }
    html += '        </tbody>'
    html += '        <input type="hidden" id="selected_rule_id"/>';
    html += '</table >'

    $('#rules_table_container').empty().append(html);

    //var defaultFilters = GetDefaultQueryBuilderFilters();

    //for (var i = 0; i < conditions.length; i++) {
    //    $('#ruleId_' + conditions[i].RuleID).queryBuilder({
    //        plugins: {
    //            'chosen-selectpicker': {
    //                search_contains: true,
    //                width: '10rem'
    //            }
    //        },
    //        filters: defaultFilters,
    //        icons: {
    //            add_group: 'fa-solid fa-layer-group',
    //            add_rule: 'fas fa-plus',
    //            remove_group: 'fa-solid fa-trash-can',
    //            remove_rule: 'fa fa-trash-alt',
    //            error: 'fa fa-circle-exclamation'
    //        }
    //    });

    //    $('#ruleId_' + conditions[i].RuleID).queryBuilder('setRules', JSON.parse(conditions[i].Query));

    //}

    //var filterCollection = '.readonly-component .rules-group-container .rules-group-body .rules-list .rule-container .rule-filter-container select';
    //var operatorCollection = '.readonly-component .rules-group-container .rules-group-body .rules-list .rule-container .rule-operator-container select';
    //var valueCollection = '.readonly-component .rules-group-container .rules-group-body .rules-list .rule-container .rule-value-container select';

    //$(filterCollection).attr('disabled', true).trigger("chosen:updated");
    //$(operatorCollection).attr('disabled', true).trigger("chosen:updated");
    //$(valueCollection).attr('disabled', true).trigger("chosen:updated");

    var collapsedGroups = {};

    var table = $('#table_rules').DataTable({
        columnDefs: [
            {
                targets: [0],
                visible: false,
                searchable: false
            },
            {
                targets: [3],
                visible: false,
                searchable: true
            },
            {
                targets: [4],
                visible: false,
                searchable: true
            },
        ],
        rowGroup: {
            dataSrc: 0,
            startRender: function (rows, group) {
                var collapsed = !!collapsedGroups[group];

                rows.nodes().each(function (r) {
                    r.style.display = 'none';
                    if (collapsed) {
                        r.style.display = '';
                    }
                });

                var arrow_icon = (collapsed)
                    ? '<i class="fa-solid fa-caret-down" style="margin-right:1%"></i>'
                    : '<i class="fa-solid fa-caret-right" style="margin-right:1%"></i>';
                
                var groupDetails = conditions.filter(c => c.RuleID == group);

                var status_icon = (groupDetails[0].Status == 'Active')
                    ? '<i class="fa-solid fa-circle-check" style="color:#198754; font-size:1.4em"></i>'
                    : '<i class="fa-solid fa-circle-xmark" style="color:#dc3545; font-size:1.4em"></i>';
                
                return $('<tr/>')
                    .append(
                        '<td>' + arrow_icon + groupDetails[0].RuleName + '</td>'+
                        //'<td>' + groupDetails[0].Response + '</td>' +
                        '<td style="text-align:center">' + status_icon + '</td>' 
                        //'<td style="text-align:center">' + groupDetails[0].PriorityRange + '</td>'
                        )
                    .attr('data-name', group)
                    .toggleClass('collapsed', collapsed);
            }
        }
    });

    $('#table_rules tbody').on('click', 'tr.dtrg-group', function () {
        var name = $(this).data('name');

        var ruleId = name;
        RenderRuleQuery(ruleId);

        collapsedGroups[name] = !collapsedGroups[name];
        table.draw(false);
    });


    $('#table_rules tbody').on('click', 'tr.odd, tr.even', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#EditRuleInspectr').addClass('isDisabled')
            $('#DeleteRuleInspectr').addClass('isDisabled');
            $('#DuplicateRuleInspectr').addClass('isDisabled');

            $('#selected_rule_id').val(-1);
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#EditRuleInspectr').removeClass('isDisabled')
            $('#DeleteRuleInspectr').removeClass('isDisabled')
            $('#DuplicateRuleInspectr').removeClass('isDisabled')

            var ruleId = parseFloat(this.firstElementChild.className);

            $('#selected_rule_id').val(ruleId);
        }
    });

    $('#ExpandAllRows').on('click', function () {

        ShowOverlayLoader();

        for (var r = 0; r < requestRows.length; r++) {
            var requestId = $(requestRows[r]).data('name');
            RenderRequestQuery(requestId);
        }

        HideOverlayLoader();

        $('tr.odd').css("display", "");
        $('tr.even').css("display", "");
    });

    // Handle click on "Collapse All" button
    $('#CollapseAllRows').on('click', function () {
        $('tr.odd').css("display", "none");
        $('tr.even').css("display", "none");
    });
}

function AddorEditInspectRule(button) {
    var statuses = RetrieveStatuses();

	let html = '';
	html += '<div id="modal_inspectr" class="modal">';
	html += '	<div class="modal-content custom-modal-content">';
	html += '		<div class="modal-header">';
	if (button == 'add')
		html += '<h4>Add Inspect Rule</h4>';
	else
		html += '<h4>Edit Inspect Rule</h4>';
	html += '	<span onclick="CloseModal()" class="close">&times;</span>';
	html += '</div>';
	html += '<div class="mainbodyborder">'
	html += '	<div class="modalwidth90">'
	html += '		<div class="modalbody_class">'
    html += '			<div class="row">' /*start of div class 1st row*/
    html += '						<div class="col-2">'
    html += '							Rule Name:'
    html += '						</div>'
    html += '						<div class="col-6">'
    html += '							<input class="inputclass" type="text" id="rule_name" style="margin:-4px;" required placeholder="Enter your rule name here...">'
    if (button != 'add') {
        html += '							<input type="hidden" id="rule_id">'
    }
    //html += '						</div>'
    //html += '						<div class="col-2">'
    //html += '							Is Active:'
    //html += '						</div>'
    //html += '                       <div class="material-switch pull-right col-2">'
    //html += '                           <input id="is_active" name="switch" type="checkbox"/>'
    //html += '                           <label for="is_active" class="label-primary"></label>'
    //html += '                       </div >'

    html += '						</div>'
    html += '                       <div class="col-4" style="margin:0">'
    html += '                           Status: '
    html += '                           <select id="statusId">'
    html += '							<option value="0">Select an Option</option>'
    for (var i = 0; i < statuses.length; i++) {
        if (statuses[i].statusName.toLowerCase() === 'active') {
            html += '					<option selected value="' + statuses[i].statusID + '">' + statuses[i].statusName + '</option>';
        } else {
            html += '					<option value="' + statuses[i].statusID + '">' + statuses[i].statusName + '</option>';
        }
    }
    html += '							</select>'
    html += '                       </div >'

    html += '               <div id="builder"></div>'
	html += '           </div>'; /*start of div class 2st row*/
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
		html += '<button class="btn btn-dark btn-with-icon" onclick="SubmitNewInspectRule()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
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
	html += '</div>'; /*end of 5groutesmodal div*/
    $(".homemodal").append(html);

    var defaultFilters = GetDefaultQueryBuilderFilters();

    $('#builder').queryBuilder({
        plugins: {
            'chosen-selectpicker': {
                search_contains: true,
                width: '10rem'
            }
        },
        filters: defaultFilters,
        icons: {
            add_group: 'fa-solid fa-layer-group',
            add_rule: 'fas fa-plus',
            remove_group: 'fa-solid fa-trash-can',
            remove_rule: 'fa fa-trash-alt',
            error: 'fa fa-circle-exclamation'
        }
    });

    
    if (button != 'add') {
        var ruleId = $('#selected_rule_id').val();

        var ruleDetails = RetrieveRuleDetails(ruleId);
        $('#rule_name').val(ruleDetails.RuleName);

        $('#is_active').prop('checked', ruleDetails.IsActive);

        $('#builder').queryBuilder('setRules', JSON.parse(ruleDetails.Query));
        $('#rule_id').val(ruleDetails.RuleID);

        $('#statusId').val(ruleDetails.StatusId)
    }
    $('#statusId').chosen({ search_contains: true });
	$('#modal_inspectr').show();
}

function CloseModal() {
	$('#modal_inspectr').remove();
}

function SubmitNewInspectRule() {

    var ruleName = $('#rule_name').val();
    var status_id = $('#statusId').val();

    $('.modaloverwriteerror').empty()
    var errormessage = '';
    var valid = true;
    if (ruleName == '' || ruleName == undefined) {
        valid = false;
        errormessage = '* Rule Name cannot be empty</br>'
        $("#rule_name").addClass('userNotFoundClass');
    }

    if (status_id == 0 || status_id == '' || status_id == undefined) {
        valid = false;
        errormessage = '* Select a Status Type please...</br>'
    }

    var rules = $('#builder').queryBuilder('getRules');
    var sqlQuery = $('#builder').queryBuilder('getSQL').sql;

    if (valid == true) {
        CloseModal();
        $.ajax({
            type: "POST",
            url: "/Inspectr/AddInspectRule",
            data: { ruleName: ruleName, ruleStatus: status_id, ruleConditions: JSON.stringify(rules), sqlQuery: sqlQuery },
            beforeSend: function () {
                ShowOverlayLoader();
            },
            success: function (response) {
                if (response.status === "success") {
                    ShowSuccessMessage("New Rule Saved Successfully!");

                } else {
                    ShowErrorMessage(response.content);
                }
                HideOverlayLoader();
                GenerateInspectRuleTable();
                
            },
            error: function (error) {
                ShowErrorMessage(error);
            },
            //complete: function (response) {
                
            //    if (r.status === "success") {
            //        ShowSuccessMessage("New Rule Saved Successfully!");

            //    } else {
            //        ShowErrorMessage(response.responseJSON);
            //    }
            //    HideOverlayLoader();
            //    GenerateInspectRuleTable();
            //}
        });
        ResetHeaderButtons();
    } else {
        $(".modaloverwriteerror").empty().append('<label class=".alert-danger-login alert alert-danger" style="width: 100%">' + errormessage + '</label>');
    }

}

function SubmitEditInspectRule() {
    var ruleName = $('#rule_name').val();
    var status_id = $('#statusId').val();
    var rule_id = $('#rule_id').val();
    
    $('.modaloverwriteerror').empty()
    var errormessage = '';
    var valid = true;
    if (ruleName == '' || ruleName == undefined) {
        valid = false;
        errormessage = '* Rule Name cannot be empty</br>'
        $("#rule_name").addClass('userNotFoundClass');
    }

    if (status_id == 0 || status_id == '' || status_id == undefined) {
        valid = false;
        errormessage = '* Select a Status Type please...</br>'
    }

    var rules = $('#builder').queryBuilder('getRules');
    var sqlQuery = $('#builder').queryBuilder('getSQL').sql;

    if (valid == true) {
        CloseModal();
        $.ajax({
            type: "POST",
            url: "/Inspectr/EditInspectRuleDetails",
            data: { ruleId: rule_id, ruleName: ruleName, ruleStatus: status_id, ruleQuery: JSON.stringify(rules) , sqlQuery: sqlQuery},
            beforeSend: function () {
                ShowOverlayLoader();
            },
            success: function (response) {
                ShowSuccessMessage('Rule Edited Successfully!');
            },
            error: function (error) {
                var error_content = JSON.parse(error);
                ShowErrorMessage(error_content.Message);
            },
            complete: function () {
                HideOverlayLoader();
                GenerateInspectRuleTable();
            }
        });

        ResetHeaderButtons();
    } else {
        $(".modaloverwriteerror").empty().append('<label class=".alert-danger-login alert alert-danger" style="width: 100%">' + errormessage + '</label>');
    }
}

function DeleteInspectRule() {
    var ruleId = $('#selected_rule_id').val();

    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this specific rule",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/Inspectr/DeleteRuleInspectr",
                    data: { ruleID: ruleId },
                    success: function (resp) {
                        swal({
                            title: "Rule successfully deleted!",
                            icon: "success",
                            button: "Done",
                        });
                    }, error: function (error) {
                        ShowErrorMessage(error);
                    },
                    complete: function () {
                        GenerateInspectRuleTable();
                    }
                });
                ResetHeaderButtons();
            }
        });
}

function DuplicateInspectRule() {

    var rules = RetrieveLookupRules();
    var selectedRuleId = $('#selected_rule_id').val();

    var html = '';
    
    html += '<div id="modal_inspectr" class="modal">';
    html += '	<div class="modal-content custom-modal-content">';
    html += '<div class="modal-header">';
    html += '			<h4>Duplicate Existing Rule</h4>';
    html += '			<span onclick="CloseModal()" class="close">&times;</span>';
    html += '		</div>';
    html += '		<div class="mainbodyborder">'
    html += '			<div class="modalwidth90">'
    html += '				<div class="modalbody_class">'
    html += '					<div class="row" style="padding: 4px !important;">'
    html += '						<div class="col-sm-5">'
    html += '							Rule to clone (source):'
    html += '						</div>'
    html += '						<div class="col-sm-7">'
    html += '							<input class="inputclass" id="ruleName" type="text" readonly>'
    html += '							<input id="rule_old_id" type="hidden" readonly>'
    html += '						</div>'
    html += '					</div>'

    html += '					<div class="row" style="padding: 4px !important;">'
    html += '						<div class="col-sm-5">'
    html += '							New Rule Name:'
    html += '						</div>'
    html += '						<div class="col-sm-7">'
    html += '							<input class="inputclass" id="newruleName" type="text" required placeholder="Enter a name for the duplicated rule here...">'
    html += '						</div>'
    html += '					</div>'
    //html += '					<div class="row" style="padding: 4px !important;">'
    //html += '						<div class="col-sm-5">'
    //html += '							Select Rule to clone'
    //html += '						</div>'
    //html += '						<div class="col-sm-7">'
    //html += '							<select id="rule_from_id" onchange = "">'
    //html += '							<option selected value="0">Select an Option</option>'
    //for (var i = 0; i < rules.length; i++) {
    //    if (rules[i].RuleID != selectedRuleId) {
    //        html += '					<option value="' + rules[i].RuleID + '">' + rules[i].RuleName + '</option>';
    //    }
    //}
    //html += '							</select>'
    //html += '						</div>'
    //html += '					</div>'
    html += '                   <div class="row">'
    html += '                       <div class="col-sm-12 modaladdediterror">'
    html += '                       </div>';
    html += '                   </div>';
    html += '   <br/><hr/>'
    html += '<div class="row">'
    html += '   <div class="col-sm-12 modalbuttons main-buttons-with-icons">'
    html += '       <button class="btn btn-dark btn-with-icon" onclick="DuplicateInspectRuleOperation()" type="button" style="margin-right:1%"><i class="marginicon fas fa-save" style="margin-right:5px"></i>Save</button>';
    html += '       <button class="btn btn-outline-secondary btn-with-icon" onclick="CloseModal()" type="button"><i class="marginicon fas fa-window-close" style="margin-right:5px"></i>Cancel</button>';

    html += '   </div>';
    html += '</div>';
    html += '		</div>';
    html += '	</div>'
    html += '</div>';
    $(".homemodal").append(html);

    $('#rule_old_id').val(selectedRuleId);
    $('#ruleName').val(rules.filter(r => r.RuleID == selectedRuleId)[0].RuleName);
    //$('#rule_from_id').chosen({ search_contains: true });
    $('#modal_inspectr').show();
}

function DuplicateInspectRuleOperation() {

    var sourceRuleId = parseFloat($('#rule_old_id').val());
    var newRuleName = $('#newruleName').val();
    var valid = true;

    if (newRuleName == '' || newRuleName == undefined) {
        valid = false;
        errormessage = '* The generated rule name cannot be empty</br>'
        $("#rule_name").addClass('userNotFoundClass');
    }

    if (valid == true) {
        CloseModal();
        $.ajax({
            type: "POST",
            url: "/Inspectr/DuplicateInspectRule",
            data: { sourceRuleId: sourceRuleId, newRuleName: newRuleName},
            beforeSend: function () {
                ShowOverlayLoader();
            },
            success: function (response) {
                ShowSuccessMessage('Rule Cloned Successfully!');
            },
            error: function (error) {
                ShowErrorMessage(error);
            },
            complete: function () {
                HideOverlayLoader();
                GenerateInspectRuleTable();
            }
        });
        ResetHeaderButtons();
    } else {
        $(".modaloverwriteerror").empty().append('<label class=".alert-danger-login alert alert-danger" style="width: 100%">' + errormessage + '</label>');
    }
}

function ResetHeaderButtons() {
    $('#EditRuleInspectr').addClass('isDisabled')
    $('#DeleteRuleInspectr').addClass('isDisabled');
    $('#DuplicateRuleInspectr').addClass('isDisabled');
}

function RenderRuleQuery(ruleId) {

    if (!$('#ruleId_' + ruleId).hasClass('query-builder')) {
        var ruleQueryBodyContent = RetrieveRuleDetails(ruleId).Query;

        $('#ruleId_' + ruleId).queryBuilder({
            plugins: {
                'chosen-selectpicker': {
                    search_contains: true,
                    width: '10rem'
                }
            },
            filters: GetDefaultQueryBuilderFilters(),
            icons: {
                add_group: 'fa-solid fa-layer-group',
                add_rule: 'fas fa-plus',
                remove_group: 'fa-solid fa-trash-can',
                remove_rule: 'fa fa-trash-alt',
                error: 'fa fa-circle-exclamation'
            }
        });

        $('#ruleId_' + ruleId).queryBuilder('setRules', JSON.parse(ruleQueryBodyContent));

        var filterCollection =
            '.readonly-component .rules-group-container .rules-group-body .rules-list .rule-container .rule-filter-container select';
        var operatorCollection =
            '.readonly-component .rules-group-container .rules-group-body .rules-list .rule-container .rule-operator-container select';
        var valueCollection =
            '.readonly-component .rules-group-container .rules-group-body .rules-list .rule-container .rule-value-container select';

        $(filterCollection).attr('disabled', true).trigger("chosen:updated");
        $(operatorCollection).attr('disabled', true).trigger("chosen:updated");
        $(valueCollection).attr('disabled', true).trigger("chosen:updated");
    }
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

function RetrieveLookupRules() {
    var rules;

    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveLookupRules",
        success: function (response) {
            rules = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return rules;
}

function RetrieveRuleDetails(rule_id) {
    var data;

    $.ajax({
        async: false,
        type: "POST",
        data: { ruleId: rule_id },
        url: "/Inspectr/RetrieveRuleDetailsPerId",
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}