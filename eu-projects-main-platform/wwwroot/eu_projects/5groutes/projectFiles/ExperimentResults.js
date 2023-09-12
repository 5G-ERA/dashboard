function AddNewExperimentResult() {
    var html = '';
    html += '<div id="modal_5groutes" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>Add Test Results</h4>';
    html += '<span onclick="CancelAddExperimentResults()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'
    /*start ROW OF 2*/

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-4">'
    html += 'Test Results Name:'
    html += '</div>'
    html += '<div class="col-sm-8">'
    html += '<input type="text" id="experimentresultsname" placeholder="Enter a test result name here..." style="margin:-5px;">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'
    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-4">'
    html += 'Upload Excel File:'
    html += '</div>'
    html += '<div class="col-sm-8 fileuploaderexperiment">'
    html += '<input type="file" id="docpicker" accept=".xlsx, .csv">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'
    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-12 addnewexperimentresultonerror">'
    html += '</div>';
    html += '</div>';

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<input id="selected_test_file_Id" type="hidden"/>'

    html += '<div class="col-sm-12 ExperimentResultsModalButtons modalbuttons main-buttons-with-icons">'
    html += '<button class="savebutton sacecancelbuttonoc" onclick="Browse()" type="button">Browse<i class="marginicon fas fa-folder-open"></i></button>';
    html += '<button class="savebutton sacecancelbuttonoc" onclick="AddNewExperimentResultOnClick()" type="button">Add Test Results Evaluation1<i class="marginicon fas fa-save"></i></button>';
    html += '<button class="sacecancelbuttonoc" onclick="CancelAddExperimentResults()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>'; /*end of 5groutesmodal div*/
    $(".homemodal").append(html);
    $("#modal_5groutes").show();
    $('#docpicker').fileinput({
        theme: "fas",
        uploadUrl: '/_5groutes/UploadTestResultFile',
        uploadExtraData: function (previewId, index) {
            return { testResultId: parseInt($('#experimentresults_dropdown_id').val()) };
        },
        deleteUrl: '/_5groutes/DeleteUploadedTestResultFile',
        deleteExtraData: function (previewId, index) {
            return { testResultId: parseInt($('#experimentresults_dropdown_id').val()) };
        },
        showUpload: true,
        hideThumbnailContent: true,
        showCaption: true,
        autoReplace: true,
        captionClass: "testResult-uploaded-value",
        maxFileCount: 30,
        browseClass: "d-none"
    }).on("filebatchselected", function (event, files) {
        $("#docpicker").fileinput("upload");
        $('.fileinput-remove').hide();
        $('.kv-file-zoom').remove();
        $('.kv-upload-progress').hide();
        $('.file-drop-zone-title').text('test')
        $('.addnewexperimentresultonerror').empty()
    }).on('fileloaded', function () {
        $('.addnewexperimentresultonerror').empty()
        if ($(this).closest('.file-input').find('.kv-preview-thumb').length > 1) {
            $(this).closest('.file-input').find('.kv-preview-thumb').eq(0).remove();
        }
    }).on('fileuploaded', function (event, previewId, index, fileId) {
        //debugger;
        if (previewId.response.status != 'SUCCESS') {
            EmptyAttachmentsFolder();
            $('.kv-file-remove').click()
            $('.addnewexperimentresultonerror').empty()
                .append('<label class=".alert-danger-login alert alert-danger">' + previewId.response + '</label>');
        } else {
            $('#selected_test_file_Id').val(previewId.response.fileId);
        }
    });
    $('.file-drop-zone-title').text('Drag & Drop excel file here...')
    $('.fileinput-remove').hide();
    $('.kv-file-zoom').remove();
}
function AddNewExperimentResult2() {
    var html = '';
    html += '<div id="modal_5groutes" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>Add Test Results2</h4>';
    html += '<span onclick="CancelAddExperimentResults()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'
    /*start ROW OF 2*/

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-4">'
    html += 'Test Results Name:'
    html += '</div>'
    html += '<div class="col-sm-8">'
    html += '<input type="text" id="experimentresultsname2" placeholder="Enter a test result name here..." style="margin:-5px;">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'
    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-4">'
    html += 'Upload Excel File:'
    html += '</div>'
    html += '<div class="col-sm-8 fileuploaderexperiment2">'
    html += '<input type="file" id="docpicker2" accept=".xlsx, .csv">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'
    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-12 addnewexperimentresultonerror2">'
    html += '</div>';
    html += '</div>';

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<input id="selected_test_file_Id2" type="hidden"/>'

    html += '<div class="col-sm-12 ExperimentResultsModalButtons modalbuttons main-buttons-with-icons">'
    html += '<button class="savebutton sacecancelbuttonoc" onclick="Browse2()" type="button">Browse<i class="marginicon fas fa-folder-open"></i></button>';
    html += '<button class="savebutton sacecancelbuttonoc" onclick="AddNewExperimentResultOnClick2()" type="button">Add Test Results Evaluation1<i class="marginicon fas fa-save"></i></button>';
    html += '<button class="sacecancelbuttonoc" onclick="CancelAddExperimentResults()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>'; /*end of 5groutesmodal div*/
    $(".homemodal").append(html);
    $("#modal_5groutes").show();
    $('#docpicker2').fileinput({
        theme: "fas",
        uploadUrl: '/_5groutes/UploadTestResultFile',
        uploadExtraData: function (previewId, index) {
            return { testResultId: parseInt($('#experimentresults_dropdown_id2').val()) };
        },
        deleteUrl: '/_5groutes/DeleteUploadedTestResultFile',
        deleteExtraData: function (previewId, index) {
            return { testResultId: parseInt($('#experimentresults_dropdown_id2').val()) };
        },
        showUpload: true,
        hideThumbnailContent: true,
        showCaption: true,
        autoReplace: true,
        captionClass: "testResult-uploaded-value2",
        maxFileCount: 30,
        browseClass: "d-none"
    }).on("filebatchselected", function (event, files) {
        $("#docpicker").fileinput("upload");
        $('.fileinput-remove').hide();
        $('.kv-file-zoom').remove();
        $('.kv-upload-progress').hide();
        $('.file-drop-zone-title').text('test')
        $('.addnewexperimentresultonerror2').empty()
    }).on('fileloaded', function () {
        $('.addnewexperimentresultonerror2').empty()
        if ($(this).closest('.file-input').find('.kv-preview-thumb').length > 1) {
            $(this).closest('.file-input').find('.kv-preview-thumb').eq(0).remove();
        }
    }).on('fileuploaded', function (event, previewId, index, fileId) {
        //debugger;
        if (previewId.response.status != 'SUCCESS') {
            EmptyAttachmentsFolder();
            $('.kv-file-remove').click()
            $('.addnewexperimentresultonerror2').empty()
                .append('<label class=".alert-danger-login alert alert-danger">' + previewId.response + '</label>');
        } else {
            $('#selected_test_file_Id2').val(previewId.response.fileId);
        }
    });
    $('.file-drop-zone-title').text('Drag & Drop excel file here...')
    $('.fileinput-remove').hide();
    $('.kv-file-zoom').remove();
}
function Browse2() {
    $('#docpicker2').click();
}

function Browse() {
    $('#docpicker').click();
}

function AddNewExperimentResultOnClick() {
    //debugger;
    $('.addnewexperimentresultonerror').empty();
    var errormessage = '';
    var valid = true;
    var excelfile;
    var experimentresultsname;
    var uniqueFileId = $('#selected_test_file_Id').val();

    if ($('#experimentresultsname').val() == '') {
        valid = false;
        errormessage += '*Test Result Name Cannot Be Empty </br>';
    }
    if ($('.file-upload-indicator').attr('title') != 'Uploaded') {
        valid = false;
        errormessage += '*Please upload an excel file</br>';
    }

    if (valid == false) {
        $('.addnewexperimentresultonerror').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>');
    } else {
        console.log($('.testResult-uploaded-value').val());
        //debugger;
        excelfile = $('.testResult-uploaded-value').attr('title');
        experimentresultsname = $('#experimentresultsname').val();
        $('.addnewexperimentresultonerror').empty()
        SubmitNewExperimentResult(excelfile, experimentresultsname, uniqueFileId)
    }
}

function SubmitNewExperimentResult(excelfile, experimentresultsname, uniqueFileId) {
    //debugger; hgfhfg

    $.ajax({
        type: "POST",
        async: false,
        url: "/_5groutes/AddExperimentResults",
        data: {
            ExperimentResultsName: experimentresultsname,
            excelfile: excelfile,
            testId: $('#testscenariodesc_id').val(),
            fileUID: uniqueFileId
        },
        success: function (response) {
            if (response.status == 'FAIL') {
                $('.addnewexperimentresultonerror').empty().append('<label class=".alert-danger-login alert alert-danger">' + response.message + '</label>');
            } else {
                GenerateExperimentResultsDropdown($('#testscenariodesc_id').val());
                FillGrid_ExperimentResultsEvaluation(response.newExperimentResultsId);
                $('#experimentresults_dropdown_id').val(response.newExperimentResultsId)
                $('#experimentresults_dropdown_id').trigger('chosen:updated')
                EXPERIMENT_RESULTS_EVALUATION__ShowDeleteButton()
                CloseModal();
                swal({
                    title: "Added!",
                    icon: "success",
                    button: "Done",
                });
                EmptyAttachmentsFolder();
            }

        },
        error: function (error) {
            //debugger;
        }
    });
}

function DeleteExperimentResult() {
    //debugger;
    var ExperimentResultsEvaluationId = $('#experimentresults_dropdown_id').val();
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this Experiment Results",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/_5groutes/DeleteExperimentResults",
                    data: {
                        ExperimentResultsEvaluationId: ExperimentResultsEvaluationId,
                    },
                    success: function (response) {
                        GenerateExperimentResultsDropdown($('#testscenariodesc_id').val()); //testscenariodesc_id
                        $('#experimentresults_dropdown_id').trigger('chosen:updated');
                        $('#uc_date_id2').val('')
                        EXPERIMENT_RESULTS_EVALUATION__HideDeleteButton();
                        $('.experimentresults_data_area').hide();
                        $('.ColumnTestResult-bottomContainer-main').empty();
                    },
                    error: function (error) {

                    }
                });
            }

        });
}

function datatable_addexcelname_area(filename) {
   // debugger;
    var html = '';
    html += '<div id="ExcelFileName" class="col-md-6">'
    html += 'File Name: ' + filename;
    html += '</div>'
    $('#SingleExperimentResultsEvaluation_filter').addClass('col-md-6')
    $('#SingleExperimentResultsEvaluation_wrapper').prepend(html);
}

function EmptyAttachmentsFolder() {
    $.ajax({
        type: "POST",
        async: false,
        url: "/_5groutes/EmptyAttachmentsFolder",
        success: function (response) {


        },
        error: function (error) {
         
        }
    });

}

function CancelAddExperimentResults() {
    EmptyAttachmentsFolder();
    CloseModal();
}