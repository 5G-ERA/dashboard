
var artefactTypes = RetrieveAllArtefactTypes();

function AddNewArtefact() {
   // debugger;
    var artefactTableLength = 0;

    if ($('#artefact_table>tbody>tr').length === 1) {
        if ($('#artefact_table>tbody>.odd>.dataTables_empty').length === 0) {
            artefactTableLength = 1;
        } else {
            artefactTableLength = 0;
        }
    } else {
        artefactTableLength = $('#artefact_table>tbody>tr').length;
    }

    var html = '';
    html += '<div id="modal_5groutes" class="modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';

    html += '<h4>Add New Artefact</h4>';
    html += '<span onclick="CloseArtefactWindow()" class="close">&times;</span>';
    html += '</div>';
    html += '<div class="mainbodyborder">'
    html += '<div class="modalwidth90">'
    html += '<div class="modalbody_class">'
    /*start ROW OF 2*/

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-4">'
    html += 'Artefact Type:'
    html += '</div>'
    html += '<div class="col-sm-8">'
    html += '<select id="artefact_type" style="margin:-5px;" onchange="OnArtefactTypeChange()">'
    html += '<option selected value="-1">Select Artefact Type...</option>';
    for (var i = 0; i < artefactTypes.length; i++) {
        //if (i != artefactTableLength) {
        //html += '<option value="' + artefactTypes[i].ArtefactTypeId + '">' + artefactTypes[i].ArtefactTypeName + '</option>';
        //}

        if (i < artefactTableLength+1) {
            html += '<option value="' +
                artefactTypes[i].ArtefactTypeId +
                '">' +
                artefactTypes[i].ArtefactTypeName +
                '</option>';
        } else {
            html += '<option disabled value="' + artefactTypes[i].ArtefactTypeId + '">' + artefactTypes[i].ArtefactTypeName + '</option>';
        }
    }
    //for (var j = artefactTableLength+1; j < artefactTypes.length; j++) {
    //    html += '<option disabled value="' + artefactTypes[j].ArtefactTypeId + '">' + artefactTypes[j].ArtefactTypeName + '</option>';
    //}
    html += '</select>'
    html += '</div>'
    html += '</div>'

    html += '<div id="artefact_file_chosen_block"></div>'

    html += '<div class="row" style="padding: 4px !important;">'
    html += '<div class="col-sm-12 addnewartefactfileerror">'
    html += '</div>';
    html += '</div>';

    html += '<div class="row" style="padding: 4px !important;">'
    //html += '<input id="selected_test_file_Id" type="hidden"/>'

    html += '<div class="col-sm-12 ExperimentResultsModalButtons modalbuttons main-buttons-with-icons">'
    html += '<button id="browse_btn" class="savebutton sacecancelbuttonoc" onclick="BrowseFileArtefact()" type="button">Browse<i class="marginicon fas fa-folder-open"></i></button>';
    html += '<button id="save_artefact_btn" class="savebutton sacecancelbuttonoc isDisabled" onclick="OnSaveArtefactButttonClick()" type="button">Save Artefact<i class="marginicon fas fa-save"></i></button>';
    html += '<button class="sacecancelbuttonoc" onclick="CloseArtefactWindow()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'
    html += '</div>'; /*end of 5groutesmodal div*/
    
    $(".homemodal").append(html);
    $("#modal_5groutes").show();
    $('#browse_btn').hide();

    $('#artefact_type').chosen({ search_contains: true });
}

function CloseArtefactWindow() {
    CloseModal();
}
function BrowseFileArtefact() {
    $('#artefact_file_picker').click()
}
function OnArtefactTypeChange() {
    //debugger;
    var selectedArtefactTypeIndex = $('#artefact_type').val();

    if (selectedArtefactTypeIndex >= 0) {

        var html = '';
        html += '<div class="row" style="padding: 4px !important;">'
        html += '<div class="col-sm-4">'
        html += 'Upload Artefact File:'
        html += '</div>'
        html += '<div class="col-sm-8 fileuploaderexperiment">'
        html += '<input type="file" id="artefact_file_picker" accept=".tar.gz, .tgz">';
        html += '<input type="hidden" id="artefact_file_id" />'

        html += '</div>'
        html += '</div>'

        $('#artefact_file_chosen_block').empty().append(html);
        var selectedArtefact = artefactTypes.filter(t => t.ArtefactTypeId == selectedArtefactTypeIndex)[0];

        var selectedArtefactTypeExt = selectedArtefact.ArtefactTypeExtension;
       // debugger;
        var username = $('.username-left').text();
        //debugger;
        $('#artefact_file_picker').fileinput({
            theme: "fas",
            uploadUrl: '/_5groutes/UploadArtefactFile',
            uploadExtraData: function (previewId, index) {
               // debugger;
                //alert('data-' + username + '/' + selectedArtefact.artefactFileName);
                return { username: username, artefactType: selectedArtefact.ArtefactTypeName };
                //return { username: '5groutes', artefactType: 'CONTAINER' };
            },
            deleteUrl: '/_5groutes/DeleteUploadedArtefactFile',
            deleteExtraData: function (previewId, index) {
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
          //debugger;

          $('.addnewartefactfileerror').empty();

      }).on('fileuploaded', function (event, previewId, index, fileId) {
          //debugger;
          if (previewId.response.status != 'SUCCESS') {

              if (previewId.response.onboard_code !== 200) {
                  $('#artefact_file_picker').fileinput('refresh'); //Refreshing the file input box
              }

              $('.addnewartefactfileerror').empty()
                  .append('<label class=".alert-danger-login alert alert-danger">' + previewId.response.status + '</label>');
          } else {
              $('#save_artefact_btn').removeClass('isDisabled');
              $('#artefact_file_id').val(previewId.response.fileId);
             // debugger;
              //$('#artefact_file_id').val(previewId.files.filter(t => t.name != null)[0].name);  
          }
      });
    

        $('#browse_btn').show();
        //$('.kv-file-remove').on('click', function () {
        //    $('#save_artefact_btn').addClass('isDisabled');
        //    $('#artefact_file_id').val("");
        //});
    }
}

function OnSaveArtefactButttonClick() {
  //  debugger;
    var userName = $('.username-left').text();
    var artefactTypeId = $('#artefact_type').val();
    var artefactTypeName = artefactTypes.filter(t => t.ArtefactTypeId == artefactTypeId)[0].ArtefactTypeName;
    var uploadedFileName = $('#artefact_file_id').val();

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/SaveArtefact",
        data: {
            artefactTypeId: artefactTypeId,
            username: userName,
            fileName: uploadedFileName,
            artefactTypeName: artefactTypeName
        },
        success: function (response) {
            //debugger;
            CloseArtefactWindow();
            ShowSuccessMessage(artefactTypeName + " Artefact created successfully");
            PopulateArtefactTable();
        },
        error: function (error) {
            ShowErrorMessage("Sorry, something went wrong!");
            //debugger;
        }
    });
}

function RetrieveUC_LeaderArtefacts(username) {
    //debugger;
    var data = []
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/Retrieve5GroutesArtefacts",
        data: {username: username},
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
   // debugger;
}

function DeleteArtefact(artefactId) {

    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this network artefact",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/_5groutes/DeleteUcNetworkArtefact",
                    data: {
                        networkArtefactId: artefactId
                    },
                    success: function (response) {
                        ShowSuccessMessage("Network Artefact deleted successfully");
                        PopulateArtefactTable();
                    },
                    error: function (error) {
                        ShowErrorMessage("Sorry, something went wrong!");
                    }
                });
            }
        });
}