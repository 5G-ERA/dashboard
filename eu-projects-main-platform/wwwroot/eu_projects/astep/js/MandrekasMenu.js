//this is the first implementation where the menu has submenu
//function ShowMandrekas() {
//    let HTML = ''
//    var menuCode = 'mandrekas';
//    $.ajax({
//        async: false,
//        type: "POST",
//        url: "/Astep/loadMenu",
//        data: { menuName: menuCode },
//        success: function (resp) {
//            HTML = resp;
//        }, error: function (resp) {
//            console.error(resp)
//        }
//    });
//    $(`#${mainContainer}`).empty().append(HTML);
//    DisplayMandrekasMenu(menuCode);
//}

function ShowMandrekas() {
    view = 'tables'
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Astep/MandrekasCategory1",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML);
    $('.experimentresults_data_area').hide();
    $('.experiment_graph').hide();
    $("#ucdesc_id").chosen({ search_contains: true });
    GenerateUCDropdown(false);
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');

    if ($("#ucdesc_id").val() != '' || $("#ucdesc_id").val() != null) {
        UC_Description_OnChange();
    }
}

function DisplayMandrekasMenu(code) {
    var userId = $('#user_id').val();

    var allMenus = RetrieveUserMenus(userId);
    var menus = allMenus.filter(m => m.ParentMenuId === 0);
    var groupedMenus = GetMenuItems(allMenus).filter(m => m.menu_code.includes(code));

    var html = '';

    for (var i = 0; i < groupedMenus[0].subMenu.length; i++) {
        html += '<li onclick="' + groupedMenus[0].subMenu[i].click_event + '(); updateActiveMenu(\'Main Menu\', \'' + groupedMenus[0].MenuCode + '\',\'' + groupedMenus[0].subMenu[i].menu_code + '\')" >'
        html += '<div >'
        html += '<i class="' + groupedMenus[0].subMenu[i].menu_icon + ' mainMenuIcon" style="font-size:55px"></i> <p ><b>' + groupedMenus[0].subMenu[i].menu_name + '</b></p>'
        html += '</div>'
        html += '</li>'
    }

    $('#mandrekas_grid_card').empty().append(html);
}
