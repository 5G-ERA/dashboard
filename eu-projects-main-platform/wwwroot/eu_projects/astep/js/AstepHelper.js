
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


// UC BUTTONS
function UC_HideEditButton() {
    $('.editbuttonuc').hide();
}

function UC_ShowEditButton() {
    $('.editbuttonuc').show();
}

function UC_HideSaveCancelButtons() {
    HideButton('sacecancelbuttonoc');
}

function UC_ShowSaveCancelButtons() {
    ShowButton('sacecancelbuttonoc');
}

//UC BUTTONS THRESHOLD CONFIG
function UC_ShowThresholdUseCaseConfigButtons() {
    ShowButton('threshold_table_button');
}

function UC_HideThresholdUseCaseConfigButtons() {
    HideButton('threshold_table_button');
}

//General button functos
function ShowButton(button_class) {
    $('.' + button_class).show();
}

function HideButton(button_class) {
    $('.' + button_class).hide();
}

// Show Table button
function ShowTableButton(tableid, button_class) {
    $('.' + tableid + '_' + button_class).show();
}

//Hide Table button
function HideTableButton(tableid, button_class) {
    $('.' + tableid + '_' + button_class).hide();
}
//Disable Table button
function DisableTableButton(tableid, button_class) {
    $('.' + tableid + '_' + button_class).addClass('isDisabled')
}

//Undisable Table button
function UndisableTableButton(tableid, button_class) {
    $('.' + tableid + '_' + button_class).removeClass('isDisabled')
}

//Disable Table button -- Edit Delete_1
function DisableTableButtons_EditDelete(tableid) {
    DisableTableButton(tableid, 'edit');
    DisableTableButton(tableid, 'delete');
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

function ApplyDarkStyles() {
    $('.container-scroller').addClass('black-bg');
    zingchart.THEME = 'dark';
}

function ApplyLightStyles() {
    $('.container-scroller').removeClass('black-bg');
    zingchart.THEME = 'light';
}

function UC_ResetUseCaseSection() {
    $('#treshold_bloc_title').empty();

    $('#uc_threshold_config_left_block').empty(); //Clean left bloc
    $('#uc_threshold_config_right_block').empty(); //Clean right bloc

    $('#uc_id').val("");
    $('#uc_id_string').val("");
    $('#uc_description_id').val("");
    $('#uc_responsible_id').val("");
    $('#uc_contact_id').val("");
    $('#uc_date_id').val("");

    $('#uc_category').val("");
}