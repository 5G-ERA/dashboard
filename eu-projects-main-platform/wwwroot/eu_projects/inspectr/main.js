var allCountries = RetrieveCountries();
var resources = {
    crime_cases: RetrieveCrimeCases(),
    crime_countries: allCountries,
    crime_levels: RetrieveCrimeLevels(),
    crime_types: RetrieveCrimeType(),
    requestor_members: RetrieveMembers(),
    requestor_countries: allCountries,
    evidence_sources: RetrieveEvidenceSource(),
    evidence_types: RetrieveEvidenceTypes(),
    request_jurisdictions: RetrieveRequestJurisdiction(),
    request_types: RetrieveRequestTypes()
};

$(function () {

    RenderSideMenuItems();

    VisualizeRules();

    $('.main-panel').addClass('lightMode')
    $('#modal_inspectr').addClass('lightMode')
    $('.color-tiles').remove()
    $($('.settings-heading')[1]).hide()
    $('.settings-heading').text('SITE THEME')
    _graphTheme = 'light1'
});

function LightMode() {
    $('.main-panel').addClass('lightMode').removeClass('darkMode')
    $('#modal_inspectr').addClass('lightMode').removeClass('darkMode')
    _graphTheme = 'light1'
    SideBarLightMode();
}



function DarkMode() {
    $('.main-panel').removeClass('lightMode').addClass('darkMode')
    $('#5groutesmodal').removeClass('lightMode').addClass('darkMode')
    _graphTheme = 'dark2'
    SideBarDarkMode();
}

function Rules() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveRulesView",
        success: function (resp) {
            HTML = resp;
        },
        error: function (resp) {
            console.log(resp);
        }
    });
    $('#main-platform-content').empty().append(HTML);
    RetrieveRuleData();
}
function VisualizeRules() {
    
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/VisualizeRulesView",
        beforeSend: function () {
            $.LoadingOverlay("show", {
                text: "Loading...",
                textColor: "#131313",
                imageColor: "#3e4b5b",
            });
        },
        success: function (resp) {
            HTML = resp;
            $.LoadingOverlay("hide");
            $('#main-platform-content').empty().append(HTML);
            GenerateInspectRuleTable();
        },
        error: function (resp) {
            console.log(error);
        }
    });
    
}

function VisualizeRequests() {
    var HTML = '';
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/VisualizeRequestsView",
        beforeSend: function () {
            $.LoadingOverlay("show", {
                text: "Loading...",
                textColor: "#131313",
                imageColor: "#3e4b5b",
            });
        },
        success: function (resp) {
            HTML = resp;
            $.LoadingOverlay("hide");
            $('#main-platform-content').empty().append(HTML);
            GenerateInspectRequestTable();
        },
        error: function (resp) {
            console.log(error);
        }
    });

}

function RetrieveRuleData() {
    let rules;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveRules",
        dataType: 'json',
        success: function (resp) {
            rules = resp;
        }, error: function (resp) {
            console.log('Error RetrieveRuleData');
        }
    });
    datatable_inspectr(rules);
}
function AddRuleInspectr() {
    $('#Edit_Rule').css('display', 'none');
    $('#Duplicate_Rule').css('display', 'none');
    $('#Save_Rule').show();
    $('#InspectrModal').modal('show');
    AppendDataToRuleModal();
}
function Save_Rule() {
    //debugger;
    if ($('#ruleName').val() != '') {
        ruleName = $('#ruleName').val();
        RequestorCountry = $('#requestorCountry').val();
        RequestorMember = $('#requestorMember').val();
        RequestType = $('#requestType').val();
        RequestJurisdiction = $('#requestJurisdiction').val();
        CrimeType = $('#crimeType').val();
        CrimeCountry = $('#crimeCountry').val();
        CrimeLevel = $('#crimeLevel').val();
        CrimeCase = $('#crimeCase').val();
        EvidenceSource = $('#evidenceSource').val();
        EvidenceType = $('#evidenceType').val();
        Response_inspect = $('#Response').val();
        Status = $('#Status').val();
        Priority = $('#Priority').val();

        var NewlyCreatedData = {
            ruleID: 0,
            RuleInspectr: {
                RuleName: ruleName
                , Response: Response_inspect
                , Status: Status
                , PriorityRange: Priority
            }
            , requestorCountries: RequestorCountry
            , requestorMembers: RequestorMember
            , requestTypes: RequestType
            , requestJurisdictions: RequestJurisdiction
            , crimeTypes: CrimeType
            , crimeCountries: CrimeCountry
            , crimeLevels: CrimeLevel
            , crimeCases: CrimeCase
            , evidenceSources: EvidenceSource
            , evidenceTypes: EvidenceType

        };
        //ValidateData(NewlyCreatedData);
        //if (Ruledoesntexist == true) {
        let rule_ID = InsertData(NewlyCreatedData);
        if (rule_ID != 0) {
            $('#InspectrModal').attr('value', rule_ID);
            $('#Save_Rule').css('display', 'none');
            $('#Edit_Rule').show();
            swal({
                text: "Rule has been added!",
                icon: "success",
                buttons: true,
            });
            //    .then((success) => {
            //    if (success) {
            //        $('#InspectrModal').modal('toggle');
            //    }
            //});
        }
        //}
        //else {
        //    swal({
        //        text: "Rule already exists",
        //        icon: "success",
        //        buttons: true,
        //    }).then((success) => {
        //        if (success) {
        //            $('#InspectrModal').modal('toggle');

        //        }
        //    });
        //}
    } else {
        let html = ''
        html += '<label class="col-12 Invalid_rule"> You need to provide a rule name</label>'
        $('.Modal_Header_Inspectr').append(html);
    }
}
function EditRuleInspectr() {
    //debugger;
     $('#Edit_Rule').show();
        $('#Save_Rule').hide();
    let table = $('#Inspectrtable').DataTable();
    if (typeof (table.row('.selected').data()) != 'undefined') {
        let ruleID = table.row('.selected').data().ruleID;
        let resp = RetrieveSelectedRow_RuleData(ruleID);
        //debugger;
        AppendDataToRuleModal();
        SetDataBasedOnSelectedRule(resp);
        $('#InspectrModal').modal('show');

    }
    else {
        swal({
            text: "Select a rule if you would like to use the edit function!",
            icon: "warning",
        });
    }
}

function DeleteRuleInspectr() {
    let deleted = false;
    let ruleID=0;
    if (typeof (table.row('.selected').data()) != 'undefined') {
        ruleID = table.row('.selected').data().ruleID;
        $.ajax({
            async: false,
            type: "POST",
            url: "/Inspectr/DeleteRuleInspectr",
            data: { ruleID },
        success: function (resp) {
                deleted = resp;
            }, error: function (resp) {
                deleted = false;
            }
        });
    }
    else {
        swal({
            text: "Select a rule if you would like to use the delete function!",
            icon: "warning",
        });
    }
    if (deleted) {
        swal({
            text: "Rule has been Deleted!",
            icon: "success",
            buttons: true,
        });
        RetrieveRuleData();
    }
}
function ImportRuleInspectr() {

}

function datatable_inspectr(resp) {
    if (resp == undefined) {
        return;
    }
    //debugger;
    let html='<table id="Inspectrtable" class="compact" style="width:100%"  >';
    html += '</table>';
    $('#InspectrtableDiv').empty();
    $('#InspectrtableDiv').append(html);
    if ($.fn.DataTable.fnIsDataTable('#Inspectrtable') == false) {
        $('.Inspectrtablearea').css("display", "block");
        table = $('#Inspectrtable').DataTable({
            dom: 'Bfrtip',
            buttons: [
                'excelHtml5',
                'csvHtml5',
            ],
            data: resp,
            columns: [
                //{ name: 'ruleID', title: "ruleID", data: "ruleID" },
                { name: 'Rule Name', title: "Rule Name", data: "ruleName", autoWidth: true },
                { name: 'Country', title: "Requestor Country", data: "requestorCountryName", autoWidth: true },
                { name: 'Member', title: "Requestor Member", data: "requestorMemberName", autoWidth: true },
                { name: 'Request Type', title: "Request Type", data: "requestTypeName", autoWidth: true },
                { name: 'Jurisdiction', title: "Request Jurisdiction", data: "requestJurisdictionName", autoWidth: true },
                { name: 'Crime Type', title: "Crime Type", data: "crimeTypeName", autoWidth: true },
                { name: 'Origin Country', title: "Crime Country", data: "crimeCountryName", autoWidth: true },
                { name: 'Level', title: "Crime Level", data: "crimeLevelName", autoWidth: true },
                { name: 'Case Status', title: "Crime Case", data: "crimeLevelName", autoWidth: true },
                { name: 'Source', title: "Evidence Source", data: "evidenceSourceName", autoWidth: true },
                { name: 'Evidence Type', title: "Evidence Type", data: "evidenceTypeName", autoWidth: true },
                { name: 'Response', title: "Response", data: "response", autoWidth: true },
                { name: 'Priority', title: "Priority", data: "priority", autoWidth: true },
                //{ name: 'Status', title: "Status", data: "status", autoWidth: true, className: 'editable' },
                {
                    name: 'Status',
                    title: "Status",
                    data: "status",
                    render: function (data) {
                        if (data == "Active")
                            return '<input type="checkbox" class="statuscheck" checked value="1"/>';
                        else
                            return '<input type="checkbox" class="statuscheck" value="2"/>';
                    }
                },
            ],

        });
    }
    $('#Inspectrtable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

}
function AppendDataToRuleModal() {
    $('#ruleName').val('');
    AppendEvidenceTypeToModal(RetrieveEvidenceTypes());
    AppendEvidenceSourceToModal(RetrieveEvidenceSource());
    AppendCrimeCasesToModal(RetrieveCrimeCases());
    AppendCrimeLevelsToModal(RetrieveCrimeLevels());
    AppendCrimeTypeToModal(RetrieveCrimeType());
    AppendRequestJurisdictionToModal(RetrieveRequestJurisdiction());
    AppendRequestTypesToModal(RetrieveRequestTypes());
    let countries = RetrieveCountries();
    AppendCrimeCountries(countries);
    AppendRetrieveCountriesToModal(countries);
    AppendMembersToModal(RetrieveMembers());
    AppendResponsesToModal(RetrieveResponses());
    AppendStatusesToModal(RetrieveStatuses());
    $('#InspectrModal').modal({ backdrop: 'static', keyboard: false })
}
function RetrieveEvidenceTypes() {
    let evidenceTypes;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveEvidenceTypes",
        dataType: 'json',
        success: function (resp) {
            evidenceTypes = resp;
        }, error: function (resp) {
            console.log('Error RetrieveEvidenceTypes');
        }
    });
    return evidenceTypes;
}
function AppendEvidenceTypeToModal(resp) {
    let html = '';
    html += ' <label for="evidenceType" class="col-4">Type:</label>';
    html += ' <select name="evidenceType" id="evidenceType" class="col-6 chosen-select " data-placeholder="Choose a type..." multiple>';
    if (resp != undefined) {
        for (i = 0; i < resp.length; i++) {
            html += '<option value="' + resp[i].evidenceTypeID + '">' + resp[i].evidenceTypeName + '</option> ';
        }
    }
    html += '</select>';
    //html += '<i class="fas fa-plus col-1 PlusevidenceType"></i>';
    $('.EvidenceType').empty().append(html);
    $('#evidenceType').chosen();
}
function RetrieveEvidenceSource() {
    let evidenceSource;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveEvidenceSource",
        dataType: 'json',
        success: function (resp) {
            evidenceSource = resp;
        }, error: function (resp) {
            console.log('Error RetrieveEvidenceSource');
        }
    });
    return evidenceSource;
}
function AppendEvidenceSourceToModal(EvidenceSource) {
    let html = '';
    html += ' <label for="evidenceSource" class="col-4">Source:</label>';
    html += ' <select name="evidenceSource" id="evidenceSource" class="col-6 chosen-select " data-placeholder="Choose a source..." multiple>';
    if (EvidenceSource != undefined) {
        for (i = 0; i < EvidenceSource.length; i++) {

            html += '<option value="' + EvidenceSource[i].evidenceSourceID + '">' + EvidenceSource[i].evidenceSourceName + '</option> ';
        }
    }
    html += '</select>';
    //html += '<i class="fas fa-plus col-1 PlusevidenceSource"></i>';
    $('.EvidenceSource').empty().append(html);
    $('#evidenceSource').chosen();
}
function RetrieveCrimeCases() {
    let crimeCases;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveCrimeCases",
        dataType: 'json',
        success: function (resp) {
            crimeCases = resp;
        }, error: function (resp) {
            console.log('Error RetrieveCrimeCases');
        }
    });
    return crimeCases;
}
function AppendCrimeCasesToModal(crimeCases) {
    let html = '';
    html += ' <label for="crimeCase" class="col-4">Case:</label>';
    html += ' <select name="crimeCase" id="crimeCase" class="col-6 chosen-select " data-placeholder="Choose a case..." multiple>';
    if (crimeCases != undefined) {
        for (i = 0; i < crimeCases.length; i++) {

            html += '<option value="' + crimeCases[i].crimeCaseID + '">' + crimeCases[i].crimeCaseName + '</option> ';
        }
    }
    html += '</select>';
    //html += '<i class="fas fa-plus col-1 PlusCrimeCase"></i>';
    $('.CrimeCase').empty().append(html);
    $('#crimeCase').chosen();
}
function RetrieveCrimeLevels() {
    let crimeLevels;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveCrimeLevel",
        dataType: 'json',
        success: function (resp) {
            crimeLevels = resp;
        }, error: function (resp) {
            console.log('Error RetrieveCrimeLevels');
        }
    });
    return crimeLevels;
}
function AppendCrimeLevelsToModal(crimeLevels) {
    let html = '';
    html += ' <label for="crimeLevel" class="col-4">Level:</label>';
    html += ' <select name="crimeLevel" id="crimeLevel" class="col-6 chosen-select " data-placeholder="Choose a level..." multiple>';
    if (crimeLevels != undefined) {
        for (i = 0; i < crimeLevels.length; i++) {
            html += '<option value="' + crimeLevels[i].crimeLevelID + '">' + crimeLevels[i].crimeLevelName + '</option> ';
        }
    }
    html += '</select>';
    //html += '<i class="fas fa-plus col-1 PlusCrimeLevel"></i>';
    $('.CrimeLevel').empty().append(html);
    $('#crimeLevel').chosen();
}
function RetrieveCrimeCountries() {
    let crimeCountries;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveCrimeCountries",
        dataType: 'json',
        success: function (resp) {
            crimeCountries = resp;
        }, error: function (resp) {
            console.log('Error RetrieveCrimeCountries');
        }
    });
    return crimeCountries;
}
function AppendCrimeCountries(crimeCountries) {

    let html = '';
    html += ' <label for="crimeCountry" class="col-4">Country:</label>';
    html += ' <select name="crimeCountry" id="crimeCountry" class="col-6 chosen-select " data-placeholder="Choose a country..." multiple>';
    if (crimeCountries != undefined) {
        for (i = 0; i < crimeCountries.length; i++) {

            html += '<option value="' + crimeCountries[i].countryID + '">' + crimeCountries[i].countryName + '</option> ';
        }
    }
    html += '</select>';
    $('.CrimeCountry').empty().append(html);
    $('#crimeCountry').chosen();
}
function RetrieveCrimeType() {
    let crimeType;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveCrimeType",
        dataType: 'json',
        success: function (resp) {
            crimeType = resp;
        }, error: function (resp) {
            console.log('Error RetrieveCrimeType');
        }
    });
    return crimeType;
}
function AppendCrimeTypeToModal(crimeType) {

    let html = '';
    html += ' <label for="crimeType" class="col-4">Type:</label>';
    html += ' <select name="crimeType" id="crimeType" class="col-6 chosen-select " data-placeholder="Choose a type..." multiple>';
    for (i = 0; i < crimeType.length; i++) {
        html += '<option value="' + crimeType[i].crimeTypeID + '">' + crimeType[i].crimeTypeName + '</option> ';
    }
    html += '</select>';
    //html += '<i class="fas fa-plus col-1 PlusCrimeType"></i>';
    $('.CrimeType').empty().append(html);
    $('#crimeType').chosen();
}
function RetrieveRequestJurisdiction() {
    let retrieveRequestJurisdiction;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveRequestJurisdiction",
        dataType: 'json',
        success: function (resp) {
            retrieveRequestJurisdiction = resp;
        }, error: function (resp) {
            console.log('Error RetrieveRequestJurisdiction');
        }
    });
    return retrieveRequestJurisdiction;
}
function AppendRequestJurisdictionToModal(requestJurisdiction) {

    let html = '';
    html += ' <label for="requestJurisdiction" class="col-4">Jurisdiction:</label>';
    html += ' <select name="requestJurisdiction" id="requestJurisdiction" class="col-6 chosen-select " data-placeholder="Choose a jurisdiction..." multiple>';
    if (requestJurisdiction != undefined) {
        for (i = 0; i < requestJurisdiction.length; i++) {
            html += '<option value="' + requestJurisdiction[i].requestJurisdictionID + '">' + requestJurisdiction[i].requestJurisdictionName + '</option> ';
        }
    }
    html += '</select>';
    //html += '<i class="fas fa-plus col-1 PlusRequestJuri"></i>';
    $('.requestjurisdiction').empty().append(html);
    $('#requestJurisdiction').chosen();
}
function RetrieveRequestTypes() {
    let requestTypes;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveRequestTypes",
        dataType: 'json',
        success: function (resp) {
            requestTypes = resp;
        }, error: function (resp) {
            console.log('Error RetrieveRequestTypes');
        }
    });
    return requestTypes;
}
function AppendRequestTypesToModal(requestTypes) {
    let html = '';
    html += ' <label for="requestType" class="col-4">Type:</label>';
    html += ' <select name="requestType" id="requestType" class="col-6 chosen-select " data-placeholder="Choose a type..." multiple>';
    if (requestTypes != undefined) {
        for (i = 0; i < requestTypes.length; i++) {
            html += '<option value="' + requestTypes[i].requestTypeID + '">' + requestTypes[i].requestTypeName + '</option> ';
        }
    }
    html += '</select>';
    //html += '<i class="fas fa-plus col-1 PlusRequestType"></i>';
    $('.requesttype').empty().append(html);
    $('#requestType').chosen();
}
function RetrieveCountries() {
    let retrieveCountries;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveCountries",
        dataType: 'json',
        success: function (resp) {
            retrieveCountries = resp;
        }, error: function (resp) {
            console.log('Error RetrieveCountries');
        }
    });
    return retrieveCountries;
}
function AppendRetrieveCountriesToModal(retrieveCountries) {
    let html = '';
    html += ' <label for="requestorCountry" class="col-4">Country:</label>';
    html += ' <select name="requestorCountry" id="requestorCountry" class="col-6 chosen-select " data-placeholder="Choose a country..." multiple>';
    if (retrieveCountries != undefined) {
        for (i = 0; i < retrieveCountries.length; i++) {
            html += '<option value="' + retrieveCountries[i].countryID + '">' + retrieveCountries[i].countryName + '</option> ';
        }
    }
    html += '</select>';
    $('.countryarea').empty().append(html);
    $('#requestorCountry').chosen();
}
function RetrieveMembers() {
    let members;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveMembers",
        dataType: 'json',
        success: function (resp) {
            members = resp;
        }, error: function (resp) {
            console.log('Error RetrieveMembers');
        }
    });
    return members;
}
function AppendMembersToModal(members) {

    let html = '';
    html += ' <label for="requestorMember" class="col-4">Member:</label>';
    html += ' <select name="requestorMember" id="requestorMember" class="col-6 chosen-select " data-placeholder="Choose a member..." multiple>';
    if (members != undefined) {
        for (i = 0; i < members.length; i++) {
            html += '<option value="' + members[i].requestorMemberID + '">' + members[i].requestorMemberName + '</option> '
        }
    }
    html += '</select>';
    //html += '<i class="fas fa-plus col-1 PlusMember"></i>';
    $('.requestormember').empty().append(html);
    $('#requestorMember').chosen();
}
function RetrieveResponses() {
    let responses;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveResponses",
        dataType: 'json',
        success: function (resp) {
            responses = resp;
        }, error: function (resp) {
            console.log('Error RetrieveResponses');
        }
    });
    return responses;
}
function AppendResponsesToModal(responses) {
    let html = ''
    html += ' <label for="Response" class="col-4">Response:</label>'
    html += ' <select name="Response" id="Response" class="col-6 chosen-select " data-placeholder="Choose a Response...">'
    for (i = 0; i < responses.length; i++) {

        html += '<option value="' + responses[i].responseID + '">' + responses[i].responseName + '</option> '
    }
    html += '</select>'
    $('.Response').empty().append(html);
    $('#Response').chosen();
}
function RetrieveStatuses() {
    let statuses;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/RetrieveStatuses",
        dataType: 'json',
        success: function (resp) {
            statuses = resp;
        }, error: function (resp) {
            console.log('Error RetrieveStatuses');
        }
    });
    return statuses;
}
function AppendStatusesToModal(statuses) {
    let html = ''
    html += ' <label for="Status" class="col-4">Status:</label>'
    html += ' <select name="Status" id="Status" class="col-6 chosen-select " data-placeholder="Choose a Status..." >'
    for (i = 0; i < statuses.length; i++) {
        html += '<option value="' + statuses[i].statusID + '">' + statuses[i].statusName + '</option> '
    }
    html += '</select>'
    $('.Status').empty().append(html);
    $('#Status').chosen();
}
function InsertData(NewlyCreatedData) {
    let ruleID;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/SaveRule",
        data: {
            ruleObject: JSON.stringify(NewlyCreatedData)
        }, success: function (resp) {
            ruleID = resp;
        },
        error: function (error) {
            alert(error.responseText);
            return false;
        }
    });
    return ruleID;
}

function RetrieveSelectedRow_RuleData(ruleID) {
    let ruleWrapper;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Inspectr/GetRuleData",
        data: {
            ruleID
        }, success: function (resp) {
            //debugger;
            ruleWrapper = resp;
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
    return ruleWrapper;
}
function SetDataBasedOnSelectedRule(resp) {
    $('#InspectrModal').attr('value', resp.ruleInspectr.ruleID);
    $('#ruleName').val(resp.ruleInspectr.ruleName);
    $('#requestorCountry').val(resp.requestorCountries).trigger("chosen:updated");
    $('#requestorMember').val(resp.requestorMembers).trigger("chosen:updated");
    $('#requestType').val(resp.requestTypes).trigger("chosen:updated");
    $('#requestJurisdiction').val(resp.requestJurisdictions).trigger("chosen:updated");
    $('#crimeType').val(resp.crimeTypes).trigger("chosen:updated");
    $('#crimeCountry').val(resp.crimeCountries).trigger("chosen:updated");
    $('#crimeLevel').val(resp.crimeLevels).trigger("chosen:updated");
    $('#crimeCase').val(resp.crimeCases).trigger("chosen:updated");
    $('#evidenceSource').val(resp.evidenceSources).trigger("chosen:updated");
    $('#evidenceType').val(resp.evidenceTypes).trigger("chosen:updated");
    $('#Response').val(resp.ruleInspectr.response).trigger("chosen:updated");
    $('#Status').val(resp.ruleInspectr.status).trigger("chosen:updated");
    //debugger;
}
function Edit_RuleModal() {
    if ($('#ruleName').val() != '') {
        ruleName = $('#ruleName').val();
        RequestorCountry = $('#requestorCountry').val();
        RequestorMember = $('#requestorMember').val();
        RequestType = $('#requestType').val();
        RequestJurisdiction = $('#requestJurisdiction').val();
        CrimeType = $('#crimeType').val();
        CrimeCountry = $('#crimeCountry').val();
        CrimeLevel = $('#crimeLevel').val();
        CrimeCase = $('#crimeCase').val();
        EvidenceSource = $('#evidenceSource').val();
        EvidenceType = $('#evidenceType').val();
        Response_inspect = $('#Response').val();
        Status = $('#Status').val();
        Priority = $('#Priority').val();
        rule_ID = $('#InspectrModal').attr('value');
        var NewlyCreatedData = {
            RuleInspectr: {
                RuleName: ruleName
                , Response: Response_inspect
                , Status: Status
                , PriorityRange: Priority
                , RuleID: rule_ID
            }
            , requestorCountries: RequestorCountry
            , requestorMembers: RequestorMember
            , requestTypes: RequestType
            , requestJurisdictions: RequestJurisdiction
            , crimeTypes: CrimeType
            , crimeCountries: CrimeCountry
            , crimeLevels: CrimeLevel
            , crimeCases: CrimeCase
            , evidenceSources: EvidenceSource
            , evidenceTypes: EvidenceType

        };
        if (InsertData(NewlyCreatedData)!=0) {
            swal({
                text: "Rule has been Updated!",
                icon: "success",
                buttons: true,
            });
        }
    }
}
function CloseModalInspectrModal() {
    //debugger;
    RetrieveRuleData();
    $('#InspectrModal').modal('hide');
}