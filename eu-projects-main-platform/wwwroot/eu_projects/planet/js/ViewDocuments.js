function loadDocumentsMenu() {
    var menuCode = 'Docs'

    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadMenu",
        data: { menuName: menuCode },
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);
    DisplayDocumentsMenu(menuCode);
}

function DisplayDocumentsMenu(code) {
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

    $('#view_doc_grid_card').empty().append(html);
}

function loadShippingAgent(tab = 1) {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'ShippingAgent' },
        success: function (resp) {

            HTML = resp;

            $(`#${mainContainer}`).empty().append(HTML);
            //getPIDatatable1();
            //getPIDatatable2();

            DisplayDocumentsTab(tab);

        }, error: function (resp) {
            console.error(resp)
        }
    });

}

function DisplayDocumentsTab(tab) {
    var userId = $('#user_id').val();
    var code = 'Docs';
    var allMenus = RetrieveUserMenus(userId);
    var groupedMenus = GetMenuItems(allMenus).filter(m => m.menu_code.includes(code));
    var tabHeader = '';

    for (var i = 0; i < groupedMenus[0].subMenu.length; i++) {
        var j = 4;
        if (i === 0) {
            tabHeader += '<li class="nav-item" role="presentation">';
            tabHeader +=
                ' <button class="nav-link active" id="' + groupedMenus[0].subMenu[i].menu_code + '-tab" data-bs-toggle="tab" data-bs-target="#tab' + j + '" type="button" role="tab" aria-controls="tab' + j + '" aria-selected="true" onclick="updateActiveMenu(\'' + groupedMenus[0].menu_name + '\', \'' + groupedMenus[0].menu_name + '\',\'' + groupedMenus[0].subMenu[i].menu_code + '\')"> ' + groupedMenus[0].subMenu[i].menu_name + '</button >';
            tabHeader += '</li>';

        } else {
            tabHeader += '<li class="nav-item" role="presentation">';
            tabHeader += ' <button class="nav-link" id="' + groupedMenus[0].subMenu[i].menu_code + '-tab" data-bs-toggle="tab" data-bs-target="#tab' + j + '" type="button" role="tab" aria-controls="tab' + j + '" aria-selected="true" onclick="updateActiveMenu(\'' + groupedMenus[0].menu_name + '\', \'' + groupedMenus[0].menu_name + '\',\'' + groupedMenus[0].subMenu[i].menu_code + '\')"> ' + groupedMenus[0].subMenu[i].menu_name + '</button >';
            tabHeader += '</li>';
        }

    }
    $('#DocumentTabHeader').empty().append(tabHeader);

    let files = [];
    if (tab == 1) {
        files = getFilesList('PI Container No');
    }
    if (tab == 2) {
        $(`#home-tab`).click();
        files = getFilesList('Consignment reference number');
    }
    else if (tab == 3) {
        $(`#Customs-tab`).click();
        files = getFilesList('PI pallet number');
    }
    else if (tab == 4) {
        $(`#Category1-tab`).click();
        files = getFilesList('VD Cat1');
    }
    handleDocumentsListUpdate(files)
}


//#region documents handle
function loadOtherPage() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: 'OtherPage' },
        success: function (resp) {
            HTML = resp;
            $(`#${mainContainer}`).empty().append(HTML);
            getSimulationDatatable();
            //generateSimulationDropdown();
        }, error: function (resp) {
            console.error(resp)
        }
    });
}

function loadDocView(page = 'Regulatory') {

    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/Planet/loadPartial",
        data: { viewName: page },
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $(`#${mainContainer}`).empty().append(HTML);

    let data = null;
    if (page == 'Regulatory') {
        data = [
            'Cars',
            'Pizzas',
            'Computers',
            'Monitors'
        ]
    }

    generateFilesDropdown(data)
}

function handleDocumentClick(filename) {
    if (filename.toLowerCase().endsWith("pdf")) {
        selectPDFFile(filename)
    }
    else if (filename.toLowerCase().endsWith("xml")) {
        selectXmlFile(filename)
    }
    else if (filename.toLowerCase().endsWith("xls") || filename.toLowerCase().endsWith("xlsx")) {
        selectExcelFile(filename)
    }
}

function selectPDFFile(fileName) {
    $('#excel-render').hide();
    $('#json-render').hide();
    $('#pdf-render').show();
    src = "/eu_projects/planet/assets/" + fileName;
    $("#embedPDF").attr("src", src);
}

function selectExcelFile(fileName) {
    $('#pdf-render').hide();
    $('#json-render').hide();
    $('#excel-render').show();

    $.ajax({
        async: false,
        type: "POST",
        data: { fileName: fileName },
        url: "/Planet/getExcelFile",
        success: function (resp) {
            //data = JSON.parse(resp);
            generateExcelTable(resp, fileName)
        }, error: function (resp) {
            console.error(resp)
        }
    });
}

function selectXmlFile(fileName) {
    $.ajax({
        async: false,
        type: "POST",
        data: { fileName: fileName },
        url: "/Planet/getXmlFile",
        success: function (resp) {
            let data = xml2json(resp);
            data = JSON.stringify(data, null, 4);
            $('#pdf-render').hide();
            $('#excel-render').hide();
            $('#json-render').show();
            document.getElementById("json-content").innerHTML = data;
        }, error: function (resp) {
            console.error(resp)
        }
    });
}

function generateExcelTable(sheet_data, fileName) {
    var table_output = '';

    table_output += '<div class="col-3"> <label class="main-btn" onClick="downloadExcelFile(\'' + fileName + '\')"> Download </label> </div>';
    table_output += '<table class="table table-striped table-bordered">';

    for (var row = 0; row < sheet_data.length; row++) {
        table_output += '<tr>';
        for (var cell = 0; cell < sheet_data[row].length; cell++) {
            if (row == 0) {
                table_output += '<th>' + sheet_data[row][cell] + '</th>';
            }
            else {
                table_output += '<td>' + sheet_data[row][cell] + '</td>';
            }
        }
        table_output += '</tr>';
    }
    table_output += '</table>';

    document.getElementById('excel-render').innerHTML = table_output;
}

function downloadExcelFile(fileName) {
    window.location = '/Planet/downloadExcelFile?fileName=' + fileName;
}

function generateFilesDropdown(data = null) {

    if (data == null) {
        data = [
            'Option 1',
            'Option 2',
            'Option 3',
            'Option 4'
        ]
    }

    let HTML = '';

    HTML += '<div class="col-3">'
    HTML += '   <label for= "Types" > Files type:</label >'
    HTML += '</div>'
    HTML += '<div class="col-9 dropdownarea">'
    HTML += '   <select name="files" id="fileType">'
    HTML += '       <option selected value="">Select an Option</option>'
    for (var i = 0; i < data.length; i++) {
        HTML += '   <option value="' + data[i] + ' ">' + data[i] + '</option>';
    }
    HTML += '   </select>'
    HTML += '</div>'


    $('#filesDropdownCotainer').empty().append(HTML);
    $('#fileType').chosen().on("change", function (evt, params) {
        console.log(params.selected);
    })
}

function getFilesList(name) {
    if (name == 'PI Container No') {
        return [
            {
                fileName: 'Summary Declaration for Maritime Traffic',
                path: 'ViewDocs//SUMARIA DESCARGA XIN SHANGHAI EXPEDIENTE 31380 ESCALA 0107 (002).pdf',
                type: 'pdf'
            },
            {
                fileName: 'SUMARIA COSCO HARMONY 561 DES',
                path: 'ViewDocs//SUMARIA COSCO HARMONY 561 DES.pdf',
                type: 'pdf'
            },
            {
                fileName: 'DUT 1',
                path: 'ViewDocs//DUT1.xml',
                type: 'xml'
            },
            {
                fileName: 'DUT 2',
                path: 'ViewDocs//DUT2.xml',
                type: 'xml'
            },
            {
                fileName: 'DUT 3a',
                path: 'ViewDocs//DUT3a.xml',
                type: 'xml'
            },
            {
                fileName: 'DUT 3b',
                path: 'ViewDocs//DUT3b.xml',
                type: 'xml'
            },
            {
                fileName: 'DUT 4',
                path: 'ViewDocs//DUT4.xml',
                type: 'xml'
            },
            {
                fileName: 'DUT 5',
                path: 'ViewDocs//DUT5.xml',
                type: 'xml'
            }
        ]
    }
    else {
        return [
            {
                fileName: 'sample1',
                path: 'sample1.pdf',
                type: 'pdf'
            },
            {
                fileName: 'sample2',
                path: 'ViewDocs//SUMARIA COSCO HARMONY 561 DES.pdf',
                type: 'pdf'
            },
            {
                fileName: 'sample3',
                path: 'sample3.xls',
                type: 'xls'
            },
            {
                fileName: 'sample4',
                path: 'sample4.xlsx',
                type: 'xlsx'
            }
        ]
    }
    return files;
}

function handleDocumentsListUpdate(files) {

    let HTML = '';

    for (let i = 0; i < files.length; i++) {
        HTML += '<div class="pdfFiles">'
        HTML += `   <div class="pdfFilesInfo" onclick="handleDocumentClick(\'${files[i].path}\')">`
        if (files[i].type == 'pdf') {
            HTML += '       <i class="fa-solid fa-file-pdf"></i>'
        }
        else if (files[i].type == 'xml') {
            HTML += '       <i class="fa-solid fa-file-lines"></i>'
        }
        else if (files[i].type == 'xls' || files[i].type == 'xlsx') {
            HTML += '       <i class="fa-solid fa-file-excel"></i>'
        }
        HTML += `       ${files[i].fileName}`
        HTML += '       <div class="top-bot-info">'
        //HTML += '           <span>File Name</span>'
        //HTML += '           <p>Author</p>'
        HTML += '       </div>'
        HTML += '   </div>'
        HTML += '   <div class="pdfFilesInfo-end">'
        //HTML += '       <div><i class="fa-solid fa-caret-down"></i></div>'
        //HTML += '       <div>01/01/2001</div>'
        HTML += '   </div>'
        HTML += '</div>'
    }

    $('.pdfFiles-container').empty().append(HTML);

    if ($(".pdfFilesInfo:first").length > 0) {
        $(".pdfFilesInfo:first").click();
    }
}

function handleDocumentTabClicked(name) {
    let files = getFilesList(name);
    handleDocumentsListUpdate(files)
}
//#endregion