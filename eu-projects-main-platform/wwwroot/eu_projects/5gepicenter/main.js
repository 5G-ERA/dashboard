var _graphTheme = 'light1';
var service_exe = '';


$(function () {
    RenderSideMenuItems();

    ShowHomeView();

    $('.main-panel').addClass('lightMode');
    $('#5groutesmodal').addClass('lightMode');
    $('.color-tiles').remove();
    $($('.settings-heading')[1]).hide();
    $('.settings-heading').text('SITE THEME');
    _graphTheme = 'light1';
  
});

function LightMode() {
    $('.main-panel').addClass('lightMode').removeClass('darkMode')
    $('#5groutesmodal').addClass('lightMode').removeClass('darkMode')
    _graphTheme = 'light1'
    SideBarLightMode();
}

function DarkMode() {
    $('.main-panel').removeClass('lightMode').addClass('darkMode')
    $('#5groutesmodal').removeClass('lightMode').addClass('darkMode')
    _graphTheme = 'dark2'
    SideBarDarkMode();
}

          /*------------------------------------First_View-----------------------------------------*/
function ShowHomeView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5gepicenter/Index",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $('#main-platform-content').empty().append(HTML)
    $("#ucdesc_id").chosen({ search_contains: true });
    Retrieve5GE5QiValues_JS();
    request01();
    Populate();
}

          /*------------------------------------5QI_Request_Table-----------------------------------------*/
function Retrieve5GE5QiValues_JS() {
  
    //debugger;
    $.ajax({
        method:"GET",
        url: "/_5gepicenter/Retrieve5GE5QiValues",
        success: function (response) {
            var p = JSON.parse(response);

            /*------------------------------------Selector_Operation-----------------------------------------*/

            for (var i = 0; i < p.length; i++) {
            
                $('#info_id').append('<option value="' + p[i].QiValue + '">' + p[i].QiValue + ' - ' + p[i].ExampleServices + '</option>')

            }

            /*------------------------------------Table_Of_Node-----------------------------------------*/

            var html = '';
            for (var i = 0; i < p.length; i++) {
                html += '<tr>'
                html += '<td>' + p[i].QiValue + '</td>'
                html += '<td>' + p[i].ResourceType + '</td>'
                html += '<td>' + p[i].DefaultPriority + '</td>'
                html += '<td>' + p[i].PacketDelay + '</td>'
                html += '<td>' + p[i].PacketError + '</td>'
                html += '<td>' + p[i].DefaultMaximum + '</td>'
                html += '<td>' + p[i].DefaultAverage + '</td>'
                html += '<td>' + p[i].ExampleServices + '</td>'
                html += '</tr>';
            }
            $('#5QI').empty().append(html);
            $('#5qi_mapping').DataTable();
            $("#info_id").chosen({
                search_contains: true,
                width: '10%',
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

          /*------------------------------------Populate_5Qrequest_tab-----------------------------------------*/
function Populate() {
    $('#info_id').change(function () { 
    var jon = $('#info_id').val();

        $.ajax({
            method: "GET",
            url: "/_5gepicenter/Retrieve5GE5QiValues",
            success: function (response) {
                var p = JSON.parse(response);

                for (var i = 0; i < p.length; i++) {

                    if (jon == p[i].QiValue) {
                        
                        $('#qi_value').val(p[i].QiValue)
                        $('#resources_type').val(p[i].ResourceType)
                        $('#default_prio').val(p[i].DefaultPriority)
                        $('#packet_delay').val(p[i].PacketDelay)
                        $('#packet_error').val(p[i].PacketError)
                        $('#default_ave').val(p[i].DefaultMaximum)
                        $('#default_max').val(p[i].DefaultAverage)
                        service_exe = p[i].ExampleServices;
                        break
                    } else
                    {
                        $('#qi_value').val("")
                        $('#resources_type').val("")
                        $('#default_prio').val("")
                        $('#packet_delay').val("")
                        $('#packet_error').val("")
                        $('#default_ave').val("")
                        $('#default_max').val("")
                    }
                }
            },
             error: function (error) {
                console.log(error);
            }
        });
    })
}



          /*------------------------------------5QI_Request_Table-----------------------------------------*/
function request01() {
    $.ajax({
        method: "GET",
        url: "/_5gepicenter/Retrieve5GE5QiValuesrequest",
        success: function (response) {
            var p = JSON.parse(response);

            var HTML = '';
            for (var i = 0; i < p.length; i++) {

                HTML += '<tr onclick="PopulatefromTable(this)">'
                HTML += '<td style=" width:70%" >' + p[i].Experimental_id + '</td>'
                HTML += '<td style="text-align:center; width:20%">' + p[i].RequestDate + '</td>'
                HTML += '</tr>';

            }
            $('#requestor').empty().append(HTML);
            $('#5qi_request').DataTable();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

          /*------------------------------------Submition Operation-----------------------------------------*/
function Sub() {
    var expriment = $('#expriment').val()
    var qi_value = $('#qi_value').val()
    var resources_type = $('#resources_type').val()
    var default_prio = $('#default_prio').val()
    var packet_delay = $('#packet_delay').val()
    var packet_error = $('#packet_error').val();
    var default_ave = $('#default_ave').val();
    var default_max = $('#default_max').val();
      

        /*------------------------------------Date-----------------------------------------*/

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTimer = date + ' ' + time;


    var expriment_1 = "5q1-" + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + "-" + expriment;


    if (expriment == '') {
        alert("Experimental Id needed to Procced")
    } else if (expriment == '' && qi_value == '') {
        alert("Select a QoS indicator")
    } else if (qi_value == '') {
        alert("Select a QoS indicator")
    } else {

        $.ajax({
            async: false,
            type: "POST",
            url: "/_5gepicenter/Insert5GE5QiValuesrequest",
            data: {
                exe_id: expriment_1,
                qival: qi_value,
                rtyp: resources_type,
                dprio: default_prio,
                pdely: packet_delay,
                perro: packet_error,
                dmax: default_ave,
                dave: default_max,
                eserv: service_exe,
                rdate: dateTimer
            },
            success: function (response) {

                alert("The 5QI QoS request has been submitted.");

                $('#expriment').val("")
                $('#qi_value').val("")
                $('#resources_type').val("")
                $('#default_prio').val("")
                $('#packet_delay').val("")
                $('#packet_error').val("")
                $('#default_ave').val("")
                $('#default_max').val("")

                request01();
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
}




 
function PopulatefromTable(x) {
    var request_name = x.rowIndex;
    alert(request_name);
}

function ClearPopulated() {

    $('#expriment').val("")
    $('#qi_value').val("")
    $('#resources_type').val("")
    $('#default_prio').val("")
    $('#packet_delay').val("")
    $('#packet_error').val("")
    $('#default_ave').val("")
    $('#default_max').val("")
}





