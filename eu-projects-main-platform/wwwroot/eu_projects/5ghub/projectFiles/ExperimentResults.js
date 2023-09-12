function AddNewExperimentResult() {
    var html = '';
    html += '<div id="5groutesmodal" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>Add Experiment Results</h4>';
    html += '<span onclick="CancelAddExperimentResults()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'
    /*start ROW OF 2*/

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-4">'
    html += 'Experiment Results Name:'
    html += '</div>'
    html += '<div class="col-sm-8">'
    html += '<input type="text" id="experimentresultsname" style="margin:-5px;">'
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


    html += '<div class="col-sm-12 ExperimentResultsModalButtons modalbuttons main-buttons-with-icons">'
    html += '<button class="savebutton sacecancelbuttonoc" onclick="Browse()" type="button">Browse<i class="marginicon fas fa-folder-open"></i></button>';
    html += '<button class="savebutton sacecancelbuttonoc" onclick="AddNewExperimentResultOnClick()" type="button">Add Experiment Results Evaluation<i class="marginicon fas fa-save"></i></button>';
    html += '<button class="sacecancelbuttonoc" onclick="CancelAddExperimentResults()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>'; /*end of 5groutesmodal div*/
    $(".homemodal").append(html);
    $(".modal").show();
    $('#docpicker').fileinput({
        uploadUrl: '/_5groutes/UploadFiles',
        deleteUrl: '/_5groutes/EmptyAttachmentsFolder',
        showUpload: true,
        hideThumbnailContent: true,
        showCaption: false,
        autoReplace: true,
        maxFileCount: 30,
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
        if (previewId.response != 'SUCCESS') {
            EmptyAttachmentsFolder();
            $('.kv-file-remove').click()
            $('.addnewexperimentresultonerror').empty().append('<label class=".alert-danger-login alert alert-danger">' + previewId.response + '</label>');
        }
    });
    $('.file-drop-zone-title').text('Drag & Drop excel file here...')
    $('.fileinput-remove').hide();
    $('.kv-file-zoom').remove();
}

function Browse() {
    $('#docpicker').click();
}

function AddNewExperimentResultOnClick() {
    $('.addnewexperimentresultonerror').empty();
    var errormessage = '';
    var valid = true;
    var excelfile;
    var experimentresultsname
    if ($('#experimentresultsname').val() == '') {
        valid = false;
        errormessage += '*Experiment Results Name Cannot Be Empty </br>';
    }
    if ($('.file-upload-indicator').attr('title') != 'Uploaded') {
        valid = false;
        errormessage += '*Please upload an excel file</br>';
    }

    if (valid == false) {
        $('.addnewexperimentresultonerror').empty().append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>');
    } else {
        excelfile = $('.file-caption-info').text();
        experimentresultsname = $('#experimentresultsname').val();
        $('.addnewexperimentresultonerror').empty()
        SubmitNewExperimentResult(excelfile, experimentresultsname)
    }
}

function SubmitNewExperimentResult(excelfile, experimentresultsname) {
    $.ajax({
        type: "POST",
        async: false,
        url: "/_5groutes/AddExperimentResults",
        data: {
            ExperimentResultsName: experimentresultsname,
            excelfile: excelfile,
            scenarioid: $('#scenariodesc_id').val()
        },
        success: function (response) {
            //debugger
            if (response.status == 'FAIL') {
                $('.addnewexperimentresultonerror').empty().append('<label class=".alert-danger-login alert alert-danger">' + response.message + '</label>');
            } else {
                GenerateExperimentResultsDropdown($('#scenariodesc_id').val())
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
    var ExperimentResultsEvaluationId = $('#experimentresults_dropdown_id').val()
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
                        GenerateExperimentResultsDropdown($('#scenariodesc_id').val())
                        $('#experimentresults_dropdown_id').val(0);
                        $('#experimentresults_dropdown_id').trigger('chosen:updated');
                        $('#uc_date_id2').val('')
                        EXPERIMENT_RESULTS_EVALUATION__HideDeleteButton()
                        $('.experimentresults_data_area').hide();
                    },
                    error: function (error) {

                    }
                });
            }

        });
}

function datatable_addexcelname_area(filename) {
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

///////////////////////////////// NEW EXPERIMENT BLOCK ///////////////////////////////

var timerIntervalId;

function StartExperimentConfigModal() {

    var html = GetExperimentConfigModal_Html();

    $(".homemodal").append(html);
    $(".modal").show();

}

function GetExperimentConfigModal_Html() {
    var html = '';

    html += '<div id="5ghubmodal" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>Configure New Experiment</h4>';
    html += '<span onclick="CloseModal()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'
    /*start ROW OF 2*/

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-3">'
    html += 'Experiment ID:'
    html += '</div>'
    html += '<div class="col-sm-9">'
    html += '<input type="text" id="exp_name" style="margin:-5px;">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'
    html += '<br></br>'
    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-3">'
    html += 'Time to run:'
    html += '</div>'
    html += '<div class="col-sm-9">'
    html += '<input type="time" id="exp_time" style=";width:150px">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'


    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-12 modaladdediterror">'
    html += '</div>';
    html += '</div>';

    html += '<div class="row" style="padding: 4px !important;">'

    html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'
    html += '<button class="savebutton sacecancelbuttonoc" onclick="GetExperimentConfigDetails()" type="button">Start Experiment<i class="marginicon fas fa-plus"></i></button>';
    html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';

    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>';

    return html;
}

function GetExperimentConfigDetails() {
    var time = $('#exp_time').val();
    var experiment = $('#exp_name').val();

    //var valid = true;
    //var errormessage = '';

    //if (experiment == '') {
    //    errormessage += '*Experiment ID Cannot Be Empty'
    //    valid = false;
    //    $('#exp_name').addClass('userNotFoundClass');
    //}

    //if (!valid) {
    //    $('.modaladdediterror').empty()
    //        .append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>')
    //}

    if (experiment != '') {
        StartExperiment(experiment, 5);
        CloseModal();
    } else {
        ShowErrorMessage("Experiment ID cannot be null! Please provide Experiment ID");
    }
}

function StartExperiment(experiment_name, minutes) {
    var selectedUC_Id = $('#ucdesc_id').val();
    var selectedUC_Name = $('#ucdesc_id option:selected').text();
    var currentDate = new Date();

    //Verify if there is any resource available
    var availableResources = RetrieveAvailableResources();

    if (availableResources.length > 0) {
        ReserveExperimentResource(availableResources[0]);
        sessionStorage.setItem('resourceUsedId', availableResources[0].resourceId);

        //var experimentName = selectedUC_Name +
        //    '_' +
        //    currentDate.toLocaleDateString() +
        //    '_' +
        //    currentDate.toLocaleTimeString() +
        //    '';

        var experimentName =currentDate.toJSON() + '_' + selectedUC_Name + ' ' + experiment_name;
        ShowOverlayLoader("Creating new experiment instance...");

        HideButton('addnewexperiment');
        ShowButton('stopexperiment');
        $('#test_experiment_status').empty().append(experimentName + ' is running...');

        SetStaticCountdown(minutes); //5mins countdown to stop automatically the experiment

        HideOverlayLoader();

        var experimentId = CreateUcTestExperiment(selectedUC_Id, experimentName);
    } else {
        ShowErrorMessage("Not enough resources available to run a new experiment. Please try again later");
    }
    
    
}

function StopExperiment() {
    var selectedUC_Id = $('#ucdesc_id').val();
    ShowOverlayLoader("Stopping experiment instance...");

    HideButton('stopexperiment');
    ShowButton('addnewexperiment');
    
    clearInterval(timerIntervalId);

    document.getElementById("test_experiment_countdown").innerHTML = "Experiment Stopped!";
    document.getElementById("test_experiment_status").innerHTML = "";
    var resourceId = sessionStorage.getItem('resourceUsedId');
    FreeExperimentResource(resourceId);

    sessionStorage.removeItem('resourceUsedId');

    GenerateUC_TestDropdown(selectedUC_Id);
    HideOverlayLoader();

    $('#experimentdesc_id').chosen({ search_contains: true });
}

function SetStaticCountdown(nbr) {

    var countDownDate = new Date().setMinutes(nbr);
    var secondsRemaining = nbr * 60;

    // Update the count down every 1 second
    timerIntervalId = setInterval(function () {

        // Get today's date and time
        //var now = new Date().getTime();

        // Find the distance between now and the count down date
        //var distance = countDownDate - now;
        
        var minutes = Math.floor(secondsRemaining / 60);
        var seconds = secondsRemaining - (minutes * 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }


        document.getElementById("test_experiment_countdown").innerHTML = minutes + "m " + seconds + "s ";
        //$('#test_experiment_countdown').append('<input id="timer_interval_id" type="hidden" value="' + intervalId + '" />');

        // If the count down is finished, write some text
        if (secondsRemaining < 0) {
            clearInterval(timerIntervalId);
            document.getElementById("test_experiment_countdown").innerHTML = "Experiment Stopped!";
            StopExperiment();
        }

        secondsRemaining--;
    }, 1000);

}

function RetrieveAvailableResources() {
    var res = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveAvailableResources",
        beforeSend: function () {
            ShowOverlayLoader("Checking Resources Availability....")
        },
        success: function (resp) {
            HideOverlayLoader();
            res = resp;
        },
        error: function (resp) {
            console.log(error);
        }
    });

    return res;
}

function RetrieveAllResources() {
    var res = [];

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveAllResources",
        beforeSend: function () {
        },
        success: function (resp) {
            res = resp;
        },
        error: function (resp) {
            console.log(error);
        }
    });

    return res;
}

function ReserveExperimentResource(resource) {
    var id = resource.resourceId;
    var state = true;

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/UpdateExperimentResourceAvailability",
        data: {
            resourceId: id,
            isInUse: state
        },
        success: function (response) {
        },
        error: function (error) {

        }
    });
}

function FreeExperimentResource(resourceId) {
    var state = false;

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/UpdateExperimentResourceAvailability",
        data: {
            resourceId: resourceId,
            isInUse: state
        },
        success: function (response) {
        },
        error: function (error) {

        }
    });
}

function CreateUcTestExperiment(ucId, experimentName) {
    var id;

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/CreateTestExperiment",
        data: {
            useCaseId: ucId,
            experimentName: experimentName
        },
        success: function (response) {
            id = response;
        },
        error: function (error) {

        }
    });

    return id;
}

function ViewResourceAvailability() {

    var resources = RetrieveAllResources();

    var html = '';
    html += '<div id="5groutesmodal" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>Experiment Resources Availability</h4>';
    html += '<span onclick="CloseModal()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'

    html += '<div class="row" style="padding: 4px !important;margin-right:5px;margin-left:5px">';
    html += '<div class="row row-cols-1 row-cols-md-2 g-4">';

    for (var i = 0; i < resources.length; i++) {
        html += '<div class="col" >';
        var status = (!resources[i].isInUse) ? 'FREE - ' : 'BUSY - ';

        if (!resources[i].isInUse) {
            html += '<div class="card mb-3" style="max-width: 18rem;background-color:#198754;color:white">';
            html += '<div class="card-header"><b>Resource</b></div>';
            html += '<div class="card-body">';
            
            html += '<h5 class="card-title" style="color:white">' + status + ' ' + resources[i].resourceCode +'</h5>';
            html +=
                '<p class="card-text">Resource ID: ' + resources[i].resourceId + '</p>'
            html += '</div>';
            html += '</div>';
        } else {
            html += '<div class="card text-bg-danger mb-3" style="max-width: 18rem;background-color:#d53343;color:white">';
            html += '<div class="card-header">Resource</div>';
            html += '<div class="card-body">';
            html += '<h5 class="card-title" style="color:white">' + status + ' ' + resources[i].resourceCode + '</h5>';
            html +=
                '<p class="card-text">Resource ID: ' + resources[i].resourceId +'</p>'
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
    }
    html += '</div>'
    html += '</div>'

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-12 modaladdediterror">'
    html += '</div>';
    html += '</div>';

    html += '<div class="row" style="padding: 4px !important;">'

    html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'


    //html += '<div class= "modalsubmit"><input type="submit" onclick="SubmitEditKPIJS()" value="Submit"></div>';
    html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
    
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>';

    $(".homemodal").append(html);
    $(".modal").show();
}

function ScheduleExperimentConfigModal() {
    var html = '';
    html += '<div id="5groutesmodal" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>Schedule Automatic Experiment run</h4>';
    html += '<span onclick="CloseModal()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'
    
    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-3">'
    html += 'Experiment Unique ID:'
    html += '</div>'
    html += '<div class="col-sm-9">'
    html += '<input type="text" id="exp_name" style="margin:-5px;">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-3">'
    html += 'Experiment Starting Date:'
    html += '</div>'
    html += '<div class="col-sm-3 col-offset-1">'
    html += '<input type="date" id="exp_date" style="margin:-5px;">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '<div class="col-sm-3">'
    html += 'Experiment Starting Time:'
    html += '</div>'
    html += '<div class="col-sm-3">'
    html += '<input type="time" id="exp_time" style="margin:-5px;">'
    //html += $('#scenariodesc_id option:selected').text()
    html += '</div>'
    html += '</div>'

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-12 modaladdediterror">'
    html += '</div>';
    html += '</div>';

    html += '<div class="row" style="padding: 4px !important;">'

    html += '<div class="col-sm-12 modalbuttons main-buttons-with-icons">'


    //html += '<div class= "modalsubmit"><input type="submit" class="sacecanelbuttonoc" onclick="" value="Submit"></div>';
    html += '<button class="savebutton sacecancelbuttonoc" onclick="RecordScheduleExperiment()" type="button">Submit<i class="marginicon fas fa-save"></i></button>';
    html += '<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';

    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>';

    $(".homemodal").append(html);
    $(".modal").show();
}

function RecordScheduleExperiment() {
    var exp_id = $('#exp_name').val();
    var exp_date = $('#exp_date').val();
    var exp_time = $('#exp_time').val();

    var uc_id = $('#ucdesc_id').val();

    var selectedUC_Name = $('#ucdesc_id option:selected').text();
    var currentDate = new Date();

    var valid = true;
    var errormessage = '';

    if (exp_id == '') {
        errormessage += '*Experiment ID Cannot Be Empty'
        valid = false;
        $('#exp_id').addClass('userNotFoundClass');
    }

    if (exp_date == '') {
        errormessage += '*Start Date Cannot Be Empty'
        valid = false;
        $('#exp_date').addClass('userNotFoundClass');
    }

    if (exp_time == '') {
        errormessage += '*Start Time Cannot Be Empty'
        valid = false;
        $('#exp_time').addClass('userNotFoundClass');
    }
    
    if (!valid) {
        $('.modaladdediterror').empty()
            .append('<label class=".alert-danger-login alert alert-danger">' + errormessage + '</label>')
    } else {
        var experimentName = selectedUC_Name + '_' + exp_id + '_' + currentDate.toJSON();

        $.ajax({
            type: "POST",
            async: false,
            url: "/_5ghub/CreateSchedulableTestExperiment",
            data: {
                useCaseId: uc_id,
                experimentName: experimentName,
                startDate: exp_date,
                startTime: exp_time
            },
            success: function (response) {
                ShowOverlayLoader("Creating new experiment instance...");

                ShowSuccessMessage("Scheduled Experiment recorded successfully!");
                CloseModal();
                HideOverlayLoader();

            },
            error: function (error) {
                console.log(error);
            }
        });
    }

}