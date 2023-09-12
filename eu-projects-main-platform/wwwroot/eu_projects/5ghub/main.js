var uidc = 0
var scenarioid = 0;
var _graphTheme = 'light1';
var userGroups = [];

$(function () {

        RenderSideMenuItems();

        DisplayUseCaseInfos();
        $('.main-panel').addClass('lightMode');
        $('#5groutesmodal').addClass('lightMode');
        $('.color-tiles').remove();
        $($('.settings-heading')[1]).hide();
        $('.settings-heading').text('SITE THEME');
        _graphTheme = 'light1';

        userGroups = JSON.parse(RetrieveUserGroupDetails().content);

        ApplyUserPermissions();
    }
);


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

function DisplayUseCaseInfos() {
    let HTML = '';
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveHomeView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });

    $('#main-platform-content').empty().append(HTML);
    $("#ucdesc_id").val('');
    $('#uc_experiment_monitoring_block').hide();
    $("#ucdesc_id").chosen({ search_contains: true });
    $("#scenariodesc_id").chosen({ search_contains: true });
    UC_HideEditButton();
    UC_HideSaveCancelButtons();
    GenerateUCDropdown();
    HideKPITables();
    //ScenarioFocused(uidc, scenarioid);
    $('.generalinfoclass').hide();
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');
    $('#main-platform-content').removeClass('no-padding');
}

function ShowIframes() {
    var html = PrepareIframeCards();
    $('#main-platform-content').empty().append(html);
    $('#main-platform-content').addClass('no-padding');
}

function ShowMessages() {
    let HTML = '';
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5ghub/RetrieveMessages",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });

    $('#main-platform-content').empty().append(HTML);
}

function ShowNotifications() {
    let HTML = '                <div class="row">';
    HTML += 'Display     <b>notifications</b>   here.. '
    HTML += '                </div>'
    $('#main-platform-content').empty().append(HTML);
}

function ShowGraphs() {
    let HTML = '                <div class="row">';
    HTML += 'Display    b>graphs</b>    here.. '
    HTML += '                </div>'
    $('#main-platform-content').empty().append(HTML);
}

function ShowMaps() {
    let HTML = '                <div class="row">';
    HTML += 'Display    <b>maps</b>     here.. '
    HTML += '                </div>'
    $('#main-platform-content').empty().append(HTML);
}

function PrepareIframeCards() {
    var userId = $('#user_id').val();
    var code = "show_iframes";
    var items = [];

    var allMenus = RetrieveUserMenus(userId);
    var groupedMenus = GetMenuItems(allMenus).filter(m => m.menu_code.includes(code));

    //var userGroups = RetrieveUserGroupDetails();
    //userGroups = JSON.parse(RetrieveUserGroupDetails().content);

    for (var k = 0; k < groupedMenus[0].subMenu.length; k++) {
        if (groupedMenus[0].subMenu[k].menu_name === 'User Management Portal') {

            for (var l = 0; l < userGroups.length; l++) {
                debugger;
                if (userGroups[l].name === 'UMM Administrator') {
                    items.push(groupedMenus[0].subMenu[k]);
                } else {
                    $('#' + groupedMenus[0].subMenu[k].menu_code).remove();
                    //console.log('$(#' + groupedMenus[0].subMenu[k].menu_code+').remove();');
                }
            }
        } else {
            items.push(groupedMenus[0].subMenu[k]);
        }
    }

    var html = '';
    html += '<div class="container">'
    html += '<div class="row" >'

    for (var i = 0; i < items.length; i++) {
        var j = i + 1;
        html += '<div class="col-lg-3 d-flex justify-content-center" id=card_' + items[i].menu_code+'">'
        html += '<div class="card" onclick="' + items[i].click_event +'()">'
        html += '<div class="testimonial d-flex align-items-center">'
        html += '<div class="cardBody text-center">'
        html += '<div class="h2">0'+j+'</div>'
        html += '<div class="empty-space"></div>'
        html += '<div class="h3 text-uppercase">' + items[i].menu_name +'</div>'
        //html += '<div class="text mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius nemo'
        //html += 'aliasaspernatur ex ab'
        //html += 'nisi vel amet tenetur maxime quod!</div>'
        html += '</div>'
        //html += '<h6 style="text-align:right">User Management Module</h6>'
        html += '</div>'
        html += '</div>'
        html += '</div>'
    }

    html += '</div>'
    html += '</div>'

    //html += '<div class="col-lg-3 d-flex justify-content-center">'
    //html += '<div class="card" onclick="LoadIFrame(1)">'
    //html += '<div class="testimonial d-flex align-items-center">'
    //html += '<div class="cardBody text-center">'
    //html += '<div class="h2">01</div>'
    //html += '<div class="empty-space"></div>'
    //html += '<div class="h3 text-uppercase">Catalogue</div>'
    ////html += '<div class="text mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius nemo'
    ////html += 'alias'
    ////html += 'aspernatur'
    ////html += 'exab'
    ////html += 'nisi vel amet tenetur maxime quod!</div>'
    //html += '</div>'
    //html += '</div>'
    //html += '</div>'
    //html += '</div>'
    //html += '<div class="col-lg-3 d-flex justify-content-center">'
    //html += '<div class="card" onclick="LoadIFrame(2)">'
    //html += '<div class="testimonial d-flex align-items-center">'
    //html += '<div class="cardBody text-center">'
    //html += '<div class="h2">02</div>'
    //html += '<div class="empty-space"></div>'
    //html += '<div class="h3 text-uppercase">UMM</div>'
    ////html += '<div class="text mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius nemo'
    ////html += 'aliasaspernatur ex ab'
    ////html += 'nisi vel amet tenetur maxime quod!</div>'
    //html += '</div>'
    ////html += '<h6 style="text-align:right">User Management Module</h6>'
    //html += '</div>'
    //html += '</div>'
    //html += '</div>'
    //html += '<div class="col-lg-3 d-flex justify-content-center">'
    //html += '<div class="card" onclick="LoadIFrame(3)">'
    //html += '<div class="testimonial d-flex align-items-center">'
    //html += '<div class="cardBody text-center">'
    //html += '<div class="h2">03</div>'
    //html += '<div class="empty-space"></div>'
    //html += '<div class="h3 text-uppercase">NRA</div>'
    ////html += '<div class="text mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius nemo'
    ////html += 'alias'
    ////html += 'aspernatur ex'
    ////html += 'ab'
    ////html += 'nisi vel amet tenetur maxime quod!</div>'
    //html += '</div>'
    ////html += '<h6 style="text-align:right">NetApps Repository Application</h6>'
    //html += '</div>'
    //html += '</div>'
    //html += '</div>'
    //html += '<div class="col-lg-3 d-flex justify-content-center">'
    //html += '<div class="card" onclick="LoadIFrame(4)">'
    //html += '<div class="testimonial d-flex align-items-center">'
    //html += '<div class="cardBody text-center">'
    //html += '<div class="h2">04</div>'
    //html += '<div class="empty-space"></div>'
    //html += '<div class="h3 text-uppercase">V&V Engine</div>'
    ////html += '<div class="text mb-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius nemo'
    ////html += 'aliasaspernatur ex ab'
    ////html += 'nisi vel amet tenetur maxime quod!</div>'
    //html += '</div>'
    ////html += '<h6 style="text-align:right">User Management Module</h6>'
    //html += '</div>'
    //html += '</div>'
    //html += '</div>'
    //html += '</div >'
    //html += '</div >'

    return html;
}

function LoadIFrame(index) {
    var html = RetrieveIframe(index);
    $('#main-platform-content').empty().append(html);
}

function RetrieveIframe(i) {
    let HTML = ''
    var url = '';

    if (i == 1) {
        url = "https://iot.iquadrat.com/"
    } else if (i == 2){
        url = "https://umm.netapps-5gmediahub.eu/"
    }else if (i == 3) {
        url = " https://netapps-5gmediahub.eu/"
    }
    else if (i == 4) {
        url = "https://5gmediahub.app-art.gr/vv-engine/login"
    }
    else {
        url = undefined
    }

    $('.sub-menu-link').removeClass('active-submenu');

    $('#sub_menu_item_iframe' + i).addClass('active-submenu');

    HTML += '<iframe src="' + url + '" loading="lazy" style="width:100%; height:100%" frameborder="0"></iframe>'

    return HTML;
}

function LoadCatalogIFrame() {
    LoadIFrame(1);
}
function LoadUMMIFrame() {
    LoadIFrame(2);
}
function LoadNRAIFrame() {
    LoadIFrame(3);
}

function LoadVnVFrame() {
    LoadIFrame(4);
}

function MediaHubLogout() {
    try {
        $.ajax({
            url: '/_5ghub/Logout',
            type: "POST",
            success: function (resp) {

                var res = resp;

                location.href = res.logout_endpoint;

                /*location.href = res.login_endpoint;*/

            },
            error: function (err) {
                console.error('Failed Logout:' + err);
            }
        });
    } catch (err) {
        console.error('Logout:' + err);
    }
}

function ShowOverlayLoader(msg) {
    $('#main-platform-content').LoadingOverlay("show", {
        text: msg,
        textColor: "rgb(148,11,62)",
        imageColor: "rgb(148,11,62)",
    });
}

function HideOverlayLoader() {
    $('#main-platform-content').LoadingOverlay("hide");
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