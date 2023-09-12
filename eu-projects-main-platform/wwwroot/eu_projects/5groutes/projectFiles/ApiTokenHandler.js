
function AddApiTokenModal() {
	var html = '';
	html += '<div id="modal_5groutes" class="modal">';
	html += '	<div class="modal-content">';
	html += '		<div class="modal-header">';
	html += '			<h4>Generate Token Key</h4>';
	html += '			<span onclick="CloseModal()" class="close">&times;</span>';
	html += '		</div>';
	html += '		<div class="mainbodyborder">'
	html += '			<div class="modalwidth90">'
	html += '				<div class="modalbody_class">'
	html += '					<div class="row scenariotrialtypechosen" style="padding: 4px !important;">'
	html += '						<div class="alert alert-success alert-dismissible fade show" role="alert">'
	html += '							<i class="fa-solid fa-circle-info" style="margin-right:4px"></i> Tokens generated have a life of <b>30 days</b>'
    html += '						</div >'
	html += '							<div class="col-sm-2">'
	html += '								Note :'
	html += '							</div>'
	html += '						<div class="col-sm-10">'
	html += '							<textarea class="form-control" id="token_note" rows="3" placeholder="Enter a note (*Optional*)"></textarea>'
	html += '						</div>'
	html += '					<div class="row" style="padding: 4px !important;">'
	html += '						<div class="col-sm-12 modaloverwriteerror">'
	html += '					</div>';
	html += '				</div>';
	html += '			</div>';
	html += '			<div class="row" style="padding: 4px !important;">'
	html += '		<div class="col-sm-12 modalbuttons main-buttons-with-icons">'
	html += '			<button class="savebutton sacecancelbuttonoc" onclick="GenerateApiToken()" type="button">Generate<i class="marginicon fa-solid fa-key"></i></button>';
	html += '			<button class="sacecancelbuttonoc" onclick="CloseModal()" type="button">Cancel<i class="marginicon fas fa-window-close"></i></button>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	html += '</div>'
	html += '</div>';
	$(".homemodal").append(html);
	$('#modal_5groutes').show();
}

function CloseModal() {
    $('#modal_5groutes').hide();
}

function GenerateApiToken() {
	var data;
    var user_id = parseFloat($('#user_id').val());
    var token_note = $('#token_note').val();
    console.log(token_note);
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/GenerateUserApiToken",
        data: { userId: user_id, tokenNote: token_note },
        success: function (response) {
            data = JSON.parse(response.result);
            CloseModal();
            swal({
                title: "Success!",
                text: "New Token Generated Successfully!",
                icon: "success",
                buttons: "Done"
            });

            RefreshTokenKeyTable();
        },
        error: function (error) {

        }
    });
}

function RefreshTokenKeyTable() {

	var tokens = RetrieveUserApiTokens();
    var html = '';

    if (Array.isArray(tokens) && tokens.length) {

        html += '<table class="table table-hover">'
        html += '   <thead style = "color: white; font-size:15px" >'
        html += '       <tr>'
        html += '           <th scope="col" style="width:80%">Key</th>'
        html += '           <th scope="col">Life Time</th>'
        html += '           <th scope="col">Actions</th>'
        html += '       </tr>'
        html += '   </thead >'
        html += '<tbody>'
        for (var i in tokens) {
            
            html += '<tr>'
            html += '<td><span id="container_key' + tokens[i].UserTokenID + '" class="badge rounded-pill bg-secondary key-aspect" onclick="copyKey(' + tokens[i].UserTokenID + ')" data-bs-toggle="tooltip" title="Click to copy token key!">' + tokens[i].TokenKey + '</span></td>'
            html += '<td>' + tokens[i].RemainingTime + '</td>'
            html += '<td><button type="button" id="delete_btn_key_' + tokens[i].UserTokenID + '" onclick="DeleteToken(' + tokens[i].UserTokenID + ')" class="btn btn-danger btn-sm" style="border-radius:50rem;background-color:#dd3311"> <i class="marginicon fa-solid fa-trash"></i> <b style="font-size:10px">Delete</b></button> <input id="key_' + tokens[i].UserTokenID+ ' " type="hidden" value="' + tokens[i].TokenKey+'"></td>'
            html += '</tr>'
        }
        
        html += '</tbody>'
        html += '</table >'

        $('#token-table').empty().append(html);
    } else {
        html += '<p style="text-align:center">Nothing Yet!</p>';
        $('#token-table').empty().append(html);
    }
}

function RetrieveUserApiTokens() {
    var data;
	var user_id = parseFloat($('#user_id').val());
    $.ajax({
        async: false,
        type: "POST",
		url: "/_5groutes/RetrieveUserApiTokens",
        data: { userId: user_id },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function DeleteToken(tokenId) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to token",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                async: false,
                type: "POST",
                url: "/_5groutes/DeleteUserApiToken",
                data: { tokenId: tokenId },
                success: function (resp) {
                    swal({
                        title: "Api Token successfully deleted!",
                        icon: "success",
                        button: "Done",
                    });
                }, error: function (error) {
                    swal({
                        title: "Error!",
                        text: error,
                        icon: "warning",
                        buttons: "Done",
                        dangerMode: true
                    });
                },
                complete: function () {
                    RefreshTokenKeyTable();
                }
            });
            ResetHeaderButtons();
        }
    });
}