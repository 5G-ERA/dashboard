$(function () {
    //RenderSideMenuItems();

    $(document).on("click", function (event) {
        var $trigger = $("#alertDD");
        if ($trigger !== event.target && !$trigger.has(event.target).length) {
            //$(".dropdown-menu").slideUp("fast");
            //$("#euProjectDropdown").hide();
        }
    });
});

function RenderSideMenuItems()
{
    let HTML = '';
    let _side_menu = SideMenuPerProject();
    for (let _category of _side_menu)
    {
        //HTML += RenderSideMenuItemCategory(_category.category_name);
        HTML += RenderSideMenuItemCategoryItems_New(_category.menu_items, _category.project);
    }

    //Append for now Dashboard Menu at the end
    //var isAdmin = _side_menu[0].isUserAdmin;
    //if (false && isAdmin) {
    //    HTML += RenderSideMenuItemCategory('Settings');
    //    HTML += '<li class="nav-item" id="' + 'dash_manager' + '">'
    //    HTML += '<a class="nav-link" onclick="ClickedOnMenuItem(this,' + 'OpenDashboard' + ');ClearSubMenuState()">';
    //    HTML += '<i class="menuIconFa fa-solid fa-diagram-predecessor"></i>';
    //    HTML += '<span class="menu-title">' + 'Dashboard Manager' + '</span>';
    //    HTML += '</a>';
    //    HTML += '</li>';
    //}

    

    //HTML += '<div class="nav-menu">'
    //HTML += '<ul list-unstyled components mb-5>'
    //HTML += '<li class="accordion">'
    //HTML += '<a href="#" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne" class="collapsible">'
    //HTML += '<span class="fa fa-home mr-3"></span>Feed'
    //HTML += '</a>'
    //HTML += ' <div id="collapseOne" class="collapse" aria-labelledby="headingOne">'
    //HTML += ' <div>'
    //HTML += '<ul>'
    //HTML += ' <li><a href="#">News</a></li>'
    //HTML += '<li><a href="#">Sport</a></li>'
    //HTML += '<li><a href="#">Health</a></li>'
    //HTML += '</ul>'
    //HTML += ' </div>'
    //HTML += '</div>' 
    //HTML += '</li>'
    //HTML += '<li class="accordion">'
    //HTML += '<a href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" class="collapsible">'
    //HTML += ' <span class="fa fa-home mr-3"></span>Explore'
    //HTML += '</a>'

    //HTML += ' <div id="collapseTwo" class="collapse" aria-labelledby="headingOne">'
    //HTML += '  <div>'
    //HTML += ' <ul>'
    //HTML += ' <li><a href="#">Interior</a></li>'
    //HTML += ' <li><a href="#">Food</a></li>'
    //HTML += ' <li><a href="#">Travel</a></li>'
    //HTML += ' </ul>'
    //HTML += ' </div>'
    //HTML += '</div>'

    //HTML += ' </li>'
    //HTML += ' <li><a href="#"><span class="fa fa-home mr-3"></span>Notifications</a></li>'
    //HTML += '<li><a href="#"><span class="fa fa-home mr-3"></span>Direct</a></li>'
    //HTML += '<li><a href="#"><span class="fa fa-home mr-3"></span>Stats</a></li>'
    //HTML += ' <li><a href="#"><span class="fa fa-home mr-3"></span>Sign out</a></li>'
    //HTML += ' </ul>'
    //HTML += ' </div>'

    $('.mainMenuArea').after(HTML);
}

function RenderSideMenuItemCategory(_category_name) {
    let HTML = '';
    HTML += '<li class="pt-2 pb-1">';
    HTML += '<span class="nav-item-head">' + _category_name+'</span>'
    HTML += '</li>';
    return HTML;
}

function RenderSideMenuItemCategoryItems_New(menu_items, project) {
    let HTML = '';
    HTML += '<div class="nav-menu">'
    HTML += '<ul class="list-unstyled components mb-5">'
    for (item of menu_items) {
        if (item.subMenu && item.subMenu.length > 0) {

            HTML += '<li class="accordion" id="accordion_'+ item.menu_code +'">';
            HTML += '<a href="#" data-toggle="collapse" data-target="#collapse_' +
                item.menu_code +
                '" aria-expanded="false" aria-controls="collapse_' +
                item.menu_code +
                '" class="collapsible flexible-item">';
            HTML += '<i class="' + item.menu_icon + ' mr-3"></i> <span>' + item.menu_name;
            HTML += '</span></a>';
            HTML += ' <div id="collapse_' + item.menu_code + '" class="collapse" data-bs-parent="#accordion_'+ item.menu_code +'">';
            HTML += ' <div>';
            HTML += '<ul style="margin-left:12%">';

            for (subItem of item.subMenu) {

                var isValid = subItem.click_event.endsWith(")");
                var formattedEventMethod = FormatEventMethod(subItem.click_event);

                HTML += '<li id="' + subItem.menu_code + '">';
                HTML += isValid
                    ? '<a href="#" onclick="' +formattedEventMethod +'; UpdateSidebarMenuState(this, \'' +item.menu_name +'\')">'
                    : '<a href="#" onclick="' + subItem.click_event + '(); UpdateSidebarMenuState(this, \'' + item.menu_name + '\')">'
                //HTML += '<a href="#">News</a>'
                HTML += subItem.menu_icon ? '<i style="font-size:14px" class="' + subItem.menu_icon + '"></i>' : '';
                HTML += '<span class="menu-title" style="font-size:12px">' + subItem.menu_name + '</span>';
                HTML += '</a>';
                HTML += '</li>';
            }
            HTML += '</ul>';
            HTML += ' </div>';
            HTML += '</div>';
            HTML += '</li>';
        }
        else {
            HTML += item.active
                ? '<li class="active" id="' + item.menu_code + '">'
                : '<li id="' + item.menu_code + '">';

            HTML += '<a href="#" onclick="ClickedOnMenuItem_New(this,' + item.click_event + ');ClearSubMenuState_New()" class="flexible-item">';
            HTML += item.menu_icon ? '<i class="' + item.menu_icon + ' mr-3"></i>' : '';

            HTML += '<span>' + item.menu_name + '</span>';
            HTML += '</a></li>';
        }
    }

    HTML += '</ul>';
    HTML += '</div>'
    return HTML;
}

function RenderSideMenuItemCategoryItems(menu_items, project) {
    let HTML = '';
    
        for (item of menu_items) {
            if (item.subMenu && item.subMenu.length > 0) {
                //HTML += item.active ? '<li class="nav-item active" id="' + item.menu_code + 'SubMenu"  data-toggle="collapse"  data-target="#' + item.menu_code + 'SubMenu" aria-expanded="false">' : '<li class="nav-item"id="' + item.menu_code + '"  data-toggle="collapse"  data-target="#' + item.menu_code + 'SubMenu" aria-expanded="false" >'
                HTML += item.active
                    ? '<li class="nav-item active" id=menu_item_"' + item.menu_code + '">'
                    : '<li class="nav-item" id="menu_item_' + item.menu_code + '">'
                HTML += '<a class="nav-link" onclick="ClickedOnMenuItem(this,' + item.click_event + ');ClearSubMenuState()" data-bs-toggle="collapse" href="#menu_' +
                    item.menu_code +
                    '" aria-expanded="false" aria-controls="menu_' +
                    item.menu_code +
                    '">';
                HTML += '<i class="' + item.menu_icon + '" ></i >'
                HTML += '<span class="menu-title">' + item.menu_name + '</span>'
                HTML += '<i class="menu-arrow"></i>'
                HTML += '</a>'
                HTML += ' <div class="collapse" id="menu_' + item.menu_code + '">'
                HTML += '<ul class="nav flex-column sub-menu">'
                for (subItem of item.subMenu) {

                    var isValid = subItem.click_event.endsWith(")");
                    var formattedEventMethod = FormatEventMethod(subItem.click_event);

                    HTML += '<li class="nav-item" id="' + subItem.menu_code + '">'
                    //HTML += isValid
                    //    ? '<a class="nav-link" onclick="' +
                    //    formattedEventMethod
                    //    + ';SetCurrentMenuGroupActive(\'' +
                    //    item.menu_name +
                    //    '\', \'' +
                    //    subItem.menu_code +
                    //    '\')">'
                    //    : '<a class="nav-link" onclick="' +
                    //    subItem.click_event
                    //    + '();SetCurrentMenuGroupActive(\'' +
                    //    item.menu_name +
                    //    '\', \'' +
                    //    subItem.menu_code +
                    //    '\')">'

                    HTML += '<a href="'
                    HTML += subItem.menu_icon ? '<i class="' + subItem.menu_icon + '"></i>' : ''
                    HTML += '<span class="menu-title" style="font-size:12px">' + subItem.menu_name + '</span>'
                    HTML += '</a>';
                    HTML += '</li>';
                }
                HTML += ' </ul>'
                HTML += ' </div>'
            }
            else {
                HTML += item.active
                    ? '<li class="nav-item active" id="' + item.menu_code + '">'
                    : '<li class="nav-item" id="' + item.menu_code + '">'
                HTML += '<a class="nav-link" onclick="ClickedOnMenuItem(this,' + item.click_event + ');ClearSubMenuState()">';
                HTML += item.menu_icon ? '<i class="' + item.menu_icon + '"></i>' : '';
                HTML += '<span class="menu-title">' + item.menu_name + '</span>';
                HTML += '</a>';
                HTML += '</li>';
            }
        }
        
    //else {
    //    for (item of menu_items) {
    //        //HTML += item.active ? '<li class="nav-item active">' : '<li class="nav-item">'
    //        if (item.subMenu && item.subMenu.length > 0) {
    //            HTML += item.active ? '<li class="nav-item active" id="' + item.menu_code + 'SubMenu"  data-toggle="collapse"  data-target="#' + item.menu_code + 'SubMenu" aria-expanded="false">' : '<li class="nav-item"id="' + item.menu_code + '"  data-toggle="collapse"  data-target="#' + item.menu_code + 'SubMenu" aria-expanded="false" >'
    //        }
    //        else {
    //            HTML += item.active ? '<li class="nav-item active" id="' + item.menu_code + '">' : '<li class="nav-item" id="' + item.menu_code + '">'
    //        }

    //        HTML += '<a class="nav-link" onclick="ClickedOnMenuItem(this,' + item.click_event + ')">';
    //        HTML += item.menu_icon ? '<i class="' + item.menu_icon + '"></i>' : ''
    //        HTML += '<span class="menu-title">' + item.menu_name + '</span>'
    //        HTML += '</a>';
    //        HTML += '</li>';

    //        if (item.subMenu && item.subMenu.length > 0) {
    //            HTML += '  <div class="collapse collapse-' + item.menu_code + '" id="' + item.menu_code + 'SubMenu">'
    //            for (subItem of item.subMenu) {
    //                HTML += subItem.active ? '<li class="nav-item active" id="' + subItem.menu_code + '">' : '<li class="nav-item" id="' + subItem.menu_code + '">'
    //                HTML += '<a class="nav-link" onclick="ClickedOnMenuItem(this,' + subItem.click_event + '); updateActiveMenu(\'' + item.menu_name + '\', \'' + item.menu_code + '\',\'' + subItem.menu_code + '\')">';
    //                //HTML += subItem.menu_icon ? '<i class="' + subItem.menu_icon + '"></i>' : ''
    //                HTML += '<span class="menu-title">' + subItem.menu_name + '</span>'
    //                HTML += '</a>';
    //                HTML += '</li>';
    //            }
    //            HTML += ' </div>'
    //        }
    //    }

    //}
    return HTML;
}

function SideMenuPerProject() {
    let project_code = $('#project_code').val();
    let _side_menu = [];

    var userId = $('#user_id').val();

    var menus = RetrieveUserMenus(userId);
    //console.log(menus);
    _side_menu.push({
        project: menus.map(m => m.ProjectName)[0],
        category_name: 'Main Menu',
        menu_items: GetMenuItems(menus),
        isUserAdmin: menus[0].DepartmentName.toLowerCase() === 'admins'
    });

    return _side_menu;

    //if (project_code == '5ghub')
    //{
    //    _side_menu.push({
    //        project: project_code,
    //        category_name: 'Main Menu',
    //        menu_items: [
    //            { menu_name: 'Home', menu_icon: 'menuIconFa fa-solid fa-house', menu_code: 'home', click_event:'DisplayUseCaseInfos', active: true },
    //            //{ menu_name: 'iFrames', menu_icon: 'menuIconFa fa-solid fa-f', menu_code: 'show_iframes', click_event: 'ShowIframes', subMenu: loadSubMenu('iFrames', project_code) },
    //            { menu_name: 'Modules', menu_icon: 'menuIconFa fa-solid fa-grip', menu_code: 'show_iframes', click_event: 'ShowIframes', subMenu: loadSubMenu('Modules', project_code) },

    //            { menu_name: 'Messages', menu_icon: 'menuIconFa fa-solid fa-envelope', menu_code: 'show_messages', click_event:'ShowMessages' },
    //            { menu_name: 'Notifications', menu_icon: 'menuIconFa fa-solid fa-bell', menu_code: 'show_notifications', click_event:'ShowNotifications' },
    //            { menu_name: 'Graph', menu_icon: 'menuIconFa fa-solid fa-chart-pie', menu_code: 'show_graphs', click_event:'ShowGraphs' },
    //            { menu_name: 'Location', menu_icon: 'menuIconFa fa-solid fa-map-marker', menu_code: 'show_maps', click_event:'ShowMaps' }
    //        ]
    //    });
    //}
    //else if (project_code == 'inspectr') {
    //    _side_menu.push({
    //        project: project_code,
    //        category_name: 'Main Menu',
    //        menu_items: [
    //            //{ menu_name: 'Rules', menu_icon: 'menuIconFa fa-solid fa-house', menu_code: 'rules', click_event: 'Rules' },
    //            { menu_name: 'Rules', menu_icon: 'menuIconFa fa-solid fa-house', menu_code: 'visualizeRules', click_event: 'VisualizeRules', active: true}

    //        ]
    //    });
    //}
    //else if (project_code == '5gera') {
    //    _side_menu.push({
    //        project: project_code,
    //        category_name: 'Main Menu',
    //        menu_items: [
    //            { menu_name: 'Home', menu_icon: 'menuIconFa fa-solid fa-house', menu_code: 'homemenu', click_event: 'HomeView', active: true },
    //            { menu_name: 'Portal', menu_icon: 'menuIconFa fas fa-file', menu_code: 'portalmenu', click_event: 'retrievePortalView' },
    //        ]
    //    });
    //}
    //else
    //if (project_code == 'planet') {
    //    _side_menu = [];
    //    _side_menu.push({
    //        project: project_code,
    //        category_name: 'Main Menu',
    //        menu_items: [
    //            { menu_name: 'Home', menu_icon: 'menuIconFa fa-solid fa-house', menu_code: 'loadHomeMenu', click_event: 'loadHomeMenu', active: true },
    //            { menu_name: 'Track & Trace', menu_icon: 'menuIconFa fa-solid fa-map-location-dot', menu_code: 'trackandtrace', click_event: 'retrieveTrackAndTraceView', active: false },
    //            { menu_name: 'EGTN - Logistics Information', menu_icon: 'menuIconFa fa-solid fa-truck-fast', menu_code: 'EGTNL-Menu', click_event: 'loadEgtnLogisticMenu', active: false, subMenu: loadSubMenu('EGTN - Logistics Information', 'planet') },
    //            { menu_name: 'EGTN - Infrastructure Observatory', menu_icon: 'menuIconFa fa-solid fa-dolly', menu_code: 'EGTNI-Menu', click_event: 'loadEgtnInfraMenu', active: false, subMenu: loadSubMenu('EGTN - Infrastructure Observatory', 'planet')},
    //            //{ menu_name: 'Route/Node Selection', menu_icon: 'menuIconFa fa-solid fa-route', menu_code: 'routenodeselection', click_event: 'retrieveRouteNodeSelectionView' },
    //            //{ menu_name: 'Forecasts', menu_icon: 'menuIconFa fa-solid fa-chart-bar', menu_code: 'forecast', click_event: 'retrieveForecastView' },
    //            { menu_name: 'View Documents', menu_icon: 'menuIconFa fa-solid fa-file', menu_code: 'viewDocs', click_event: '', active: false, subMenu: loadSubMenu('View Documents', 'planet') },
    //            { menu_name: 'Physical Internet Services', menu_icon: 'menuIconFa fa-solid fa-gears', menu_code: 'physicalInternet', click_event: '', active: false, subMenu: loadSubMenu('Physical Internet Services', 'planet') },
    //            { menu_name: 'Forecasts', menu_icon: 'menuIconFa fa-solid fa-chart-bar', menu_code: 'forecast', click_event: '', active: false, subMenu: loadSubMenu('Forecasts', 'planet') },
    //            { menu_name: 'Other', menu_icon: 'menuIconFa fa-solid fa-bars-staggered', menu_code: 'other', click_event: 'loadOtherPage', active: false },
    //        ]
    //    });
    //}
    //return _side_menu;
}


//function loadSubMenu(menu, project) {
//    if (project == 'planet') {
//        if (menu == 'EGTN - Logistics Information') {
//            let subs = [];
//            subs.push({ menu_name: 'Regulatory', menu_code: 'EGTNL-Regulatory', click_event: 'loadDocView', active: false })
//            subs.push({ menu_name: 'Network', menu_code: 'EGTNL-Network', click_event: 'loadEgtnNetowrk', active: false })
//            subs.push({ menu_name: 'Political', menu_code: 'EGTNL-Political', click_event: 'loadDocView(\'Political\')', active: false })
//            subs.push({ menu_name: 'Financial', menu_code: 'EGTNL-Financial', click_event: 'loadDocView(\'Financial\')', active: false })

//            subs.push({ menu_name: 'Economic', menu_code: 'EGTNL-Economic', click_event: 'loadDocView(\'Economic\')', active: false })
//            subs.push({ menu_name: 'Legal', menu_code: 'EGTNL-Legal', click_event: 'loadDocView(\'Legal\')', active: false })
//            subs.push({ menu_name: 'Environmental', menu_code: 'EGTNL-Environmental', click_event: 'loadDocView(\'Environmental\')', active: false })
//            subs.push({ menu_name: 'Governance', menu_code: 'EGTNL-Governance', click_event: 'loadDocView(\'Governance\')', active: false })

//            return subs;
//        }
//        if (menu == 'EGTN - Infrastructure Observatory') {
//            let subs = [];
//            subs.push({ menu_name: 'Node', menu_code: 'EGTNI-Node', click_event: 'loadEGTNnode', active: false })
//            subs.push({ menu_name: 'Corridor/ Route index', menu_code: 'EGTNI-Corridor', click_event: 'loadEgtnCorridorRouteIndex', active: false })
//            subs.push({ menu_name: 'CO2 Emissions', menu_code: 'EGTNI-CO2', click_event: 'loadEgtnCO2emissions', active: false })
//            subs.push({ menu_name: 'Blockchain Secured Transactions', menu_code: 'EGTNI-Blockchain', click_event: 'loadBlockchain', active: false })

//            return subs;
//        }
//        if (menu == 'Physical Internet Services') {
//            let subs = [];
//            subs.push({ menu_name: 'DSS:Last mile', menu_code: 'DSS3', click_event: 'loadDssLastMile', active: false })
//            subs.push({ menu_name: 'DSS: Optimize Node (Inland / Maritime)', menu_code: 'DSS1', click_event: '', active: false })
//            subs.push({ menu_name: 'DSS:Optimize Route', menu_code: 'DSS2', click_event: '', active: false })

//            return subs;
//        }
//        if (menu == 'Forecasts') {
//            let subs = []; 
//            subs.push({ menu_name: 'Resources', menu_code: 'Resources', click_event: 'loadResources', active: false })
//            subs.push({ menu_name: 'Pallet flow', menu_code: 'PalletFlow', click_event: 'loadResources(2)', active: false })
//            subs.push({ menu_name: 'Container flow Port', menu_code: 'ContainerFlowPort', click_event: 'loadResources(3)', active: false })
//            //subs.push({ menu_name: 'ETA', menu_code: 'ETA', click_event: 'loadResources(4)', active: false })

//            return subs;
//        }
//        if (menu == 'View Documents') {
//            let subs = [];
//            subs.push({ menu_name: 'PI Container No', menu_code: 'PIContainerNo', click_event: 'loadShippingAgent', active: false })
//            subs.push({ menu_name: 'Consignment reference number', menu_code: 'ConsRefNumber', click_event: 'loadShippingAgent(2)', active: false })
//            subs.push({ menu_name: 'PI pallet number', menu_code: 'PiPalletNumber', click_event: 'loadShippingAgent(3)', active: false })
//            subs.push({ menu_name: 'Category 1', menu_code: 'Category1', click_event: 'loadShippingAgent(4)', active: false })

//            return subs;
//        }
//    }

//    if (project == '5ghub' && menu == 'Modules') {
//        var subs = [
//            {
//                menu_name: 'Catalogue',
//                menu_icon: 'menuIconFa fa-solid fa-border-top-left',
//                menu_code: 'iframe1',
//                click_event: 'LoadCatalogIFrame'
//            },
//            {
//                menu_name: 'User Management Portal',
//                menu_icon: 'menuIconFa fa-solid fa-border-none',
//                menu_code: 'iframe2',
//                click_event: 'LoadUMMIFrame'
//            },
//            {
//                menu_name: 'NetApps Repository Application',
//                menu_icon: 'menuIconFa fa-solid fa-border-all',
//                menu_code: 'iframe3',
//                click_event: 'LoadNRAIFrame'
//            },
//            {
//                menu_name: 'V&V Engine',
//                menu_icon: 'menuIconFa fa-solid fa-border-all',
//                menu_code: 'iframe4',
//                click_event: 'LoadVnVFrame'
//            }
//        ];
//        return subs;
//    }
//    return [];
//}


function ClickedOnMenuItem(el, clickedEventHandler) {
    $(".collapse").removeClass('show');
    if (clickedEventHandler != undefined) {
        $('.nav-item').removeClass('active');
        $(el).parent().addClass('active');
        clickedEventHandler();
    }
}

function ClickedOnMenuItem_New(el, clickedEventHandler) {
    //$(".collapse").removeClass('show');
    if (clickedEventHandler != undefined) {
        $('li.active').removeClass('active');
        $(el).parent().addClass('active');
        clickedEventHandler();
    }
}

function updateActiveMenu(menuName, code, sub = null) {
    debugger
    $('.nav-item').removeClass('active');
    $('.nav-item').removeClass('selected');

    let mainMenu = document.getElementById(code)
    if (mainMenu) {
        $(mainMenu).addClass('active');
    }

    if (sub) {
        let subMenu = document.getElementById(sub)
        if (subMenu) {
            $(subMenu).addClass('active');
        }
        //close all sub menus
        $(".collapse").removeClass('show');
        //open the required sub menu
        let target = '#' + code + 'SubMenu'
        $(target).addClass('show')
    }
    
}

function UpdateSidebarMenuState(el, parentMenuId) {
    $('li.active').removeClass('active');
    $(el).parent().addClass('active');
}

function SetCurrentMenuGroupActive(menuName, menuCode) {
    $('.nav-item').removeClass('active');
    $('.nav-item').removeClass('selected');

    $('#menu_item_' + menuCode).addClass('active');

    $('#' + menuCode).addClass('selected');
}

function ClearSubMenuState() {
    $('.nav-item').removeClass('selected');
    
}

function ClearSubMenuState_New() {
    $('li.active').removeClass('active');
}

function RetrieveUserMenus(userId) {
    var data;
    $.ajax({
        async: false,
        type: "POST",
        url: "/Menu/RetrieveProjectMenu",
        data: { userId: userId },
        success: function (response) {
            data = JSON.parse(response.result);
        },
        error: function (error) {

        }
    });
    return data;
}

function GetMenuItems(items) {
    var menuObjects = [];
    var rootMenuItems = items.filter(m => m.ParentMenuId == 0);
    var subMenuItems = items.filter(m => m.ParentMenuId > 0);
    for (var i in rootMenuItems) {
        menuObjects.push({
            menu_name: rootMenuItems[i].MenuName,
            menu_icon: 'menuIconFa ' + rootMenuItems[i].MenuIcon,
            menu_code: rootMenuItems[i].MenuCode.replace(" ", "_"),
            click_event: rootMenuItems[i].MenuClickEvent,
            menu_id: rootMenuItems[i].MenuId,
            active: rootMenuItems[i].IsMenuActive,
            subMenu: GetSubMenus(rootMenuItems[i] ,subMenuItems)
    });
    }

    return menuObjects;
}

function GetSubMenus(rootMenuItem, subMenus) {
    var res = [];

    for (var i in subMenus) {
        if (subMenus[i].ParentMenuId === rootMenuItem.MenuId) {
            res.push({
                menu_name: subMenus[i].MenuName,
                menu_icon: 'menuIconFa ' + subMenus[i].MenuIcon,
                menu_code: subMenus[i].MenuCode.replace(" ", "_"),
                menu_id: subMenus[i].MenuId,
                click_event: subMenus[i].MenuClickEvent,
                active: subMenus[i].IsMenuActive
            });
        }
    }
    return res;
}

function FormatEventMethod(event) {
    var finalEventFormat = "";
    if (event.includes("LoadDashboard") && !event.includes('"') && event.includes('-')) {

        var firstStep = event.replace("(", "('");

        finalEventFormat = firstStep.replace(")", "')");
    }
    else {
        finalEventFormat = event;
    }

    return finalEventFormat;
}

function LoadDashboard(dashboardId) {
    var html = '';
    html += '<div class="container">' + dashboardId + '</div>';
    $('#main-platform-content').empty().append(html);
}

function euProjectDropdownToggle() {
    $("#euProjectDropdown").toggle("slow")
    //$('#alertsIcon').removeClass("UnreadMsg")
}