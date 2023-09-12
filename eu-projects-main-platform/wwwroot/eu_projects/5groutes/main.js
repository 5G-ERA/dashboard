var uidc = 0
var scenarioid = 0;
var _graphTheme = 'light1';

$(function () {
    view = 'tables'

     RenderSideMenuItems();

    /*PerformanceIndicators();*/
    ShowUseCaseConfigurationView();
    
    $('.main-panel').addClass('lightMode')
    $('#5groutesmodal').addClass('lightMode')
    $('.color-tiles').remove()
    $($('.settings-heading')[1]).hide()
    $('.settings-heading').text('SITE THEME')
    _graphTheme = 'light1'
    RetrieveLeaderName();
});


function LightMode() {
    $('.main-panel').addClass('lightMode').removeClass('darkMode')
    $('#5groutesmodal').addClass('lightMode').removeClass('darkMode')
    _graphTheme = 'light1'
    SideBarLightMode();
    ApplyLightStyles()
    
}



function DarkMode() {
    $('.main-panel').removeClass('lightMode').addClass('darkMode')
    $('#5groutesmodal').removeClass('lightMode').addClass('darkMode')
    _graphTheme = 'dark2'
    SideBarDarkMode();
    ApplyDarkStyles();
    
}

function ShowUseCaseConfigurationView() {
    view = 'tables'
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/UseCaseConfigurations",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML)
    $("#ucdesc_id").chosen({ width: 65%});
    //$("#scenariodesc_id").chosen({ search_contains: true });
    UC_HideEditButton();
    UC_HideSaveCancelButtons()
    GenerateUCDropdown(false);
    HideKPITables();
    SCENARIO_ShowAddButton()
    SCENARIO_ShowEditButton()
    SCENARIO_ShowDeleteButton()
    UCAndScenarioFocusedAfterTabChange(uidc, scenarioid)
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');
    
    if ($("#ucdesc_id").val() != '' || $("#ucdesc_id").val() != null) {
        UC_Description_OnChange();
    }
}

function ShowUseCaseScenariosView() {
    view = 'tables'
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/ShowUseCaseScenriosView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    
    $('#main-platform-content').empty().append(HTML)
    $("#ucdesc_id").chosen({ search_contains: true });
    $("#scenariodesc_id").chosen({ search_contains: true });
    $("#testscenariodesc_id").chosen({ search_contains: true });
    UC_HideEditButton();
    UC_HideSaveCancelButtons()
    GenerateUCDropdown(true);
    HideKPITables();
    SCENARIO_ShowAddButton();
    SCENARIO_ShowEditButton();
    SCENARIO_ShowDeleteButton();
    UCAndScenarioFocusedAfterTabChange(uidc, scenarioid);
    UCHideAnalyticTab();
    TSCENARIO_HideTestScenarioButtonBloc();
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');

}

function VisualiseKPIs() {
    view = 'visualize';
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/VisualiseKPIs",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML)
    $("#ucdesc_id").chosen({ search_contains: true });
    $("#scenariodesc_id").chosen({ search_contains: true });
    UC_HideEditButton();
    UC_HideSaveCancelButtons();
    GenerateUCDropdown();
    HideKPITables();
    VisualizeAllGraphs();
    UCAndScenarioFocusedAfterTabChange(uidc, scenarioid);
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');
}

function ExperimentResultsEvaluation() {
    view = 'resultsevaluation';
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/ExperimentResultsEvaluation",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML)
    $("#ucdesc_id").chosen({ search_contains: true });
    $("#scenariodesc_id").chosen({ search_contains: true });
    UC_HideEditButton();
    UC_HideSaveCancelButtons();
    GenerateUCDropdown();
    HideKPITables();
    SCENARIO_ShowAddButton()
    SCENARIO_ShowEditButton()
    SCENARIO_ShowDeleteButton()
    SCENARIO_HideDuplicateButton()
    UCAndScenarioFocusedAfterTabChange(uidc, scenarioid)
    $('.scenarioarea experimentresults_data_area').hide();
    $('#main-platform-content').css('min-height', $(window).height() - $('#topLayoutBar').height() - 35 + 'px');
}

function ShowApiConfigureView() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/ShowApiConfigurationView",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML);
    RefreshTokenKeyTable();
}

function ShowAnalytics() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/ShowAnalytics",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });

    $('#main-platform-content').empty().append(HTML);

    $("#ucdesc_id").chosen({ search_contains: true });
    $("#scenariodesc_id").chosen({ search_contains: true });
    $("#testscenariodesc_id").chosen({ search_contains: true });
    UC_HideEditButton();
    UC_HideSaveCancelButtons()
    GenerateUCDropdown(true);
    HideKPITables();
    SCENARIO_ShowAddButton();
    SCENARIO_ShowEditButton();
    SCENARIO_ShowDeleteButton();
    UCAndScenarioFocusedAfterTabChange(uidc, scenarioid);
    UCHideAnalyticTab();
    TSCENARIO_HideTestScenarioButtonBloc();
}

function ShowArtefacts() {
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/_5groutes/ShowArtefacts",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {

        }
    });
    $('#main-platform-content').empty().append(HTML);
    PopulateArtefactTable();
    $('#artefact_table').DataTable();
}

function DismissAlert() {
    $('#alert_block').hide();
}

function PopulateArtefactTable() {
    //debugger;
    var username = $('.username-left').text();
    var artefacts = RetrieveUC_LeaderArtefacts(username);

    var html = '';
    for (var i = 0; i < artefacts.length; i++) {
        html += '<tr>'
        html += '<td style="display:none">' + artefacts[i].LeaderArtefactId + '</td>';
        html += '<td>' + artefacts[i].ArtefactTypeName + '</td>';
        html += '<td>' + artefacts[i].ArtefactFileName + '</td>'
        html += '<td>' + formatBytes(artefacts[i].ArtefactFileSize) + '</td>'
        html += '<td>' + artefacts[i].UploadedAt + '</td>'
        html += '<td style="text-align:center"><button class="btn btn-danger" onclick="DeleteArtefact(' + artefacts[i].LeaderArtefactId +')"> <i class="fa-solid fa-trash"></i></button></td>'
        html += '</tr>';
    }

    $('#artefact_table_body').empty().append(html);
}

function formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
//---------Monika Development-- 

//#region table helpers
var userSettings = {};

//advanced search

function setUpAdvancedSearchArea(tableName, columns, pageName) {

    currentTableSearch = '';
    tableSearchData = [];

    let HTML = '';



    //left side
    HTML += '<div  class="advanced-search-rs">'
    // list of saves searches
    HTML += '<div class="field-info row">'

    HTML += '   <div class="col-3">'
    HTML += '       <label class="searchLabel" > Saved:</label>'
    HTML += '   </div>'

    HTML += '   <div class="col-6 dropdownarea" id="saved-searches-container-' + tableName + '" >'
    // should be from list of saves searches
    HTML += '               <select name="saved-searches-' + tableName + '" id="saved-searches-' + tableName + '" class="Containers selectDropdown" onchange="savedSearchSelected(this,\'' + pageName + '\',\'' + tableName + '\');" >'
    HTML += '                   <option selected value=""></option>'
    let oldSearh = getTableSavedSearch(pageName, tableName)
    for (let i = 0; i < oldSearh.length; i++) {
        HTML += '                   <option value="' + oldSearh[i].name + '">' + oldSearh[i].name + '</option>'
    }
    HTML += '               </select>'
    HTML += '    </div>'
    HTML += '   <div class="col-1" style="display:flex" onclick="deleteSearch(\'' + pageName + '\',\'' + tableName + '\')">'
    HTML += '       <i class="fa-solid fa-trash-can Asearch-icon"></i>'
    HTML += '   </div>'

    HTML += '   <div class="col-1" style="display:flex" onclick="saveSearch(\'' + pageName + '\',\'' + tableName + '\')">'
    HTML += '       <i class="fa-solid fa-floppy-disk Asearch-icon" ></i>'
    HTML += '   </div>'


    HTML += '</div>'


    // list of table fields
    HTML += ' <div class="field-info row">'

    HTML += '   <div class="col-3">'
    HTML += '      <label class="searchLabel" > Table fields:</label>'
    HTML += '   </div>'
    HTML += '           <div class="col-6 dropdownarea">'
    //should be list of datatable columns
    HTML += '               <select name="field-lists-opt-' + tableName + '" id="field-lists-opt-' + tableName + '" class="Containers selectDropdown" style="width:100%">'
    HTML += '                   <option selected value=""></option>'
    for (let i = 0; i < columns.length; i++) {
        let value = `${i},${camelize(columns[i].title)}`
        HTML += '                   <option value=' + value + '>' + columns[i].title + '</option>'
    }
    HTML += '               </select>'
    HTML += '            </div>'
    HTML += '   <div class="col-1" style="display:flex;">'
    //HTML += '       <label class="main-btn" onClick="addAdvancedSearchField(\'' + tableName + '\',\'' + pageName + '\')"> Add </label>'
    HTML += '       <i class="fa-solid fa-plus Asearch-icon" onClick="addAdvancedSearchField(\'' + tableName + '\',\'' + pageName + '\')"></i>'
    HTML += '   </div>'

    HTML += '   <div class="col-1" style="display:flex;" id="applySearch' + tableName + '">'
    HTML += '      <i class="fa-solid fa-magnifying-glass Asearch-icon"> </i> '

    HTML += '   </div>'

    HTML += '</div>'
    HTML += '</div>'


    //right side
    HTML += '<div class="fields-list"  id="filed-search-list-' + tableName + '">'
    HTML += '</div>'

    $('#advancedSearchContainer-' + tableName).html(HTML)


    $('#advancedSearchToggle-' + tableName).click(function () {
        $('#advancedSearchContainer-' + tableName).slideToggle(300);
    })
    //$('#min, #max').keyup(function () {
    //    table.draw();
    //});
}

function addAdvancedSearchField(tableName, pageName) {
    let val = $('#field-lists-opt-' + tableName).val();
    if (val == '') {
        return;
    }
    let index = val.split(',')[0]
    let fieldName = normlizeCamelcase(val.split(',')[1])


    let HTML = '';
    HTML += '<div class="field-info search-field-container row">'

    HTML += '   <div class="col-4" >'
    HTML += '            <label class="searchLabel" id="searchFieldName">' + fieldName + ':</label>'
    HTML += '   </div>'

    HTML += '   <div class="col-2 dropdownarea">'
    HTML += '           <select name="field-search-opt" id="DdVal" class="Containers selectDropdown bolderDropdown">'
    HTML += '                   <option selected value="equal"> = </option>'
    HTML += '                   <option value="more-than"> > </option>'
    HTML += '                   <option value="less-than"> < </option>'
    HTML += '           </select>'
    HTML += '   </div>'

    HTML += '   <div class="col-5">'
    HTML += '       <input type="text" id="InputVal" class="form-control searchInput" style="" placeholder="Value" />'
    HTML += '       <input type="hidden" id="fieldIndex" value="' + index + '" />'
    HTML += '   </div>'

    HTML += '   <div class="col-1" onclick="$(this).parent().remove()" style="display:flex;">'
    //HTML += '            <i class="fa-solid fa-trash-can Asearch-icon"></i>'
    HTML += '            <i class="fa-solid fa-circle-minus Asearch-icon"></i>'
    HTML += '   </div>'

    $('#filed-search-list-' + tableName).append(HTML)
    //$('#field-search-opt-' + fieldName).chosen({ search_contains: true })

}

function addHistorySearchField(tableName, pageName, fieldName, option, value, index) {
    let HTML = '';
    HTML += '<div class="field-info search-field-container row">'

    HTML += '   <div class="col-4" >'
    HTML += '            <label class="searchLabel" id="searchFieldName">' + fieldName + ':</label>'
    HTML += '   </div>'

    HTML += '   <div class="col-2 dropdownarea">'
    HTML += '           <select name="field-search-opt" id="DdVal" class="Containers selectDropdown bolderDropdown">'
    HTML += option == 'equal' ? '<option selected value="equal"> = </option>' : '<option value="equal"> = </option>';
    HTML += option == 'more-than' ? '<option selected value="more-than"> > </option>' : '<option value="more-than"> > </option>'
    HTML += option == 'less-than' ? '<option selected value="less-than"> < </option>' : '<option value="less-than"> < </option>'
    HTML += '           </select>'
    HTML += '   </div>'

    HTML += '   <div class="col-5">'
    HTML += '       <input type="text" id="InputVal" class="form-control searchInput" style="" placeholder="Value" value="' + value + '" />'
    HTML += '       <input type="hidden" id="fieldIndex" value="' + index + '" />'
    HTML += '   </div>'

    HTML += '   <div class="col-1" onclick="$(this).parent().remove()" style="display:flex;">'
    //HTML += '            <i class="fa-solid fa-trash-can Asearch-icon"></i>'
    HTML += '            <i class="fa-solid fa-circle-minus Asearch-icon"></i>'
    HTML += '   </div>'
    HTML += '   </div>'

    return HTML;
    //$('#field-search-opt-' + fieldName).chosen({ search_contains: true })

}

function saveSearch(pageName, tableName) {
    /*return*/
    let searchQuery = setupAdvancedSearchObject(tableName, true)
    if (searchQuery == null || searchQuery.length == 0) {
        return
    }

    swal({
        content: {
            element: "input",
            attributes: {
                placeholder: "Type your search name",
                type: "text",
            },
        },
    }).then(function (input) {

        if (input == null) {
            return
        }


        if (input == '') {
            ShowErrorMessage('Wrong input')
            return
        }

        let saveSearch = {
            name: input,
            searchParams: searchQuery
        }

        let setting = {
            pageName: pageName,
            tables: {
                tableId: tableName,
                savedSearches: [saveSearch]
            }

        }

        updateTableSavedSearches(setting).then(function (success) {
            if (success) {
                ShowSuccessMessage("Search saved successfully")
                updateSavesSearchList(pageName, tableName);
            }
            else {
                ShowErrorMessage('Something went wrong')
            }
        })

    });

}

function deleteSearch(pageName, tableName) {
    //id="saved-searches-' + tableName + '"
    //saved-searches-container-' + tableName
    let searchName = $('#saved-searches-' + tableName).val();

    if (searchName == null || searchName == '') {
        return;
    }

    swal({
        title: "Delete " + searchName + " ?",
        text: "You will not be able to recover deleted data!",
        icon: "warning",
        buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
        ],
        dangerMode: true,
    }).then(function (isConfirm) {
        if (isConfirm) {
            let obj = {
                pageName: pageName,
                tableId: tableName,
                searchName: searchName
            };
            deleteTableSavedSearch(obj).then(function (success) {
                if (success) {
                    ShowSuccessMessage("Search deleted successfully")
                    updateSavesSearchList(pageName, tableName);
                }
                else {
                    ShowErrorMessage('Something went wrong')
                }
            })
        }
    })


}

function updateSavesSearchList(pageName, tableName) {
    let HTML = '';

    //HTML += '   <div class="col-6 dropdownarea" id="saved-searches-container-' + tableName + '" >'
    HTML += '               <select name="saved-searches-' + tableName + '" id="saved-searches-' + tableName + '" class="Containers selectDropdown" onchange="savedSearchSelected(this,\'' + pageName + '\',\'' + tableName + '\');" >'
    HTML += '                   <option selected value=""></option>'
    let oldSearh = getTableSavedSearch(pageName, tableName)
    for (let i = 0; i < oldSearh.length; i++) {
        HTML += '                   <option value="' + oldSearh[i].name + '">' + oldSearh[i].name + '</option>'
    }
    HTML += '               </select>'
    //HTML += '    </div>'
    $('#saved-searches-container-' + tableName).html(HTML);
}

function savedSearchSelected(selected, pageName, tableName) {

    let name = selected.name;
    let value = selected.value;
    let index = selected.selectedIndex - 1;
    let searches = getSavedSearchParams(pageName, tableName, value)

    let HTML = '';
    // foreach field add
    for (let i = 0; i < searches.length; i++) {

        HTML += addHistorySearchField(tableName, pageName, searches[i].name, searches[i].type, searches[i].value, searches[i].index)
    }

    //addHistorySearchField()
    $('#filed-search-list-' + tableName).html(HTML)

}

tableSearchData = []
function setupAdvancedSearchObject(tableName, returnObj = false) {
    tableSearchData = {}

    let tableSearchDataTemp = []
    //if (!returnObj) {
    //    currentTableSearch = tableName;
    //}
    currentTableSearch = tableName;

    let fieldList = $('#filed-search-list-' + currentTableSearch).find('.search-field-container');
    for (let i = 0; i < fieldList.length; i++) {
        let id = fieldList[i].querySelector('#fieldIndex').value;
        let searchType = fieldList[i].querySelector('#DdVal').value;
        let searchValue = fieldList[i].querySelector('#InputVal').value;
        let fieldName = fieldList[i].querySelector('#searchFieldName').innerHTML.split(':')[0].trim();

        //if (!tableSearchDataTemp.hasOwnProperty(+id)){
        //    tableSearchDataTemp[+id] = [];
        //}
        tableSearchDataTemp.push({
            index: id,
            type: searchType,
            value: searchValue,
            name: fieldName
        })
    }

    if (returnObj) {
        return tableSearchDataTemp;
    }
    else {
        tableSearchData = tableSearchDataTemp
    }
}

function loadDataTableCustomSearch() {
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {

        console.log(currentTableSearch)
        if (currentTableSearch == '' || tableSearchData.length <= 0) {
            return true;
        }

        let groupedQueries = groupBy(tableSearchData, "index")
        if (groupedQueries == null) {
            return true;
        }
        for (const [key, value] of Object.entries(groupedQueries)) {
            let val = data[parseInt(key)] || null
            for (let i = 0; i < groupedQueries[key].length; i++) {
                let type = groupedQueries[key][i]['type']
                let valueCompare = groupedQueries[key][i]['value']

                if (!isNaN(valueCompare)) {
                    if (val.match(/\d+/) == null) {
                        return false
                    }
                    val = val.match(/\d+/)[0];
                }

                if (type == 'equal') {
                    if (val != valueCompare) {
                        return false;
                    }
                }

                if (!isNaN(val) && !isNaN(valueCompare)) {
                    if (type == 'more-than') {
                        if (parseFloat(val) <= parseFloat(valueCompare)) {
                            return false
                        }
                    }
                    if (type == 'less-than') {
                        if (parseFloat(val) >= parseFloat(valueCompare)) {
                            return false
                        }
                    }
                }

            }
        }

        return true

    });
}

function getTableSavedSearch(pageName, tableName) {

    if (!userSettings.pages) {
        return [];
    }
    let pageIndex = userSettings.pages.findIndex(x => x.name == pageName);
    if (pageIndex < 0) {
        return []
    }

    let tableIndex = userSettings.pages[pageIndex].tables.findIndex(x => x.tableId == tableName);
    if (tableIndex < 0) {
        return []
    }

    let tableSavedSearches = userSettings.pages[pageIndex].tables[tableIndex].savedSearches;
    return tableSavedSearches
}

function getSavedSearchParams(pageName, tableName, searchName) {
    if (!userSettings.pages) {
        return [];
    }

    let pageIndex = userSettings.pages.findIndex(x => x.name == pageName);
    if (pageIndex < 0) {
        return []
    }

    let tableIndex = userSettings.pages[pageIndex].tables.findIndex(x => x.tableId == tableName);
    if (tableIndex < 0) {
        return []
    }

    let searchIndex = userSettings.pages[pageIndex].tables[tableIndex].savedSearches.findIndex(x => x.name == searchName);
    if (searchIndex < 0) {
        return []
    }

    return userSettings.pages[pageIndex].tables[tableIndex].savedSearches[searchIndex].searchParams
}

//end of advanced search

let tableResizeOptions = {
    isEnabled: true,
    saveState: false,
    hoverClass: 'dt-colresizable-hover',
    hasBoundCheck: true,
    minBoundClass: 'dt-colresizable-bound-min',
    maxBoundClass: 'dt-colresizable-bound-max',
    isResizable: function (column) {
        return true;
    },
    onResizeStart: function (column, columns) {
    },
    onResize: function (column) {
    },
    onResizeEnd: function (column, columns) {
    },
    getMinWidthOf: function ($thNode) {
    },
    stateSaveCallback: function (settings, data) {
    },
    stateLoadCallback: function (settings) {
    }
}
//function returnExportTitle1(title) {
//    debugger;
//    let val = `${title} - ${new Date().toDateString()}`;

//    return val;
//}
function returnExportTitle(title) {
    return `${title} - ${new Date().toDateString()}`
}

async function setDatatableColumnSearch(tableId, table, pageName, resizeCol = true, advancedSearch = true, colVisibility = false) {
    //debugger;
    if (tableId != '') {
        if (tableId[0] == '#') {
            tableId = tableId.substring(1);
        }

        if (!colVisibility) {
            //TODO: take page name from function header
            let res = await preHideColumns(table, pageName, tableId)
        }


        //check if the request from colVisibility method -> remove old search header (the next part will add the new header)
        if (colVisibility) {
            let headers = $(`#${tableId} thead tr `);
            if (headers.length == 2) {
                headers[1].remove()
            }
        }
        else {
            if (resizeCol) {
                // set columns resize
                new $.fn.dataTable.ColResize(table, this.tableResizeOptions);
            }
        }
       // debugger;
        // add search header
        let tableNH = $(`#${tableId} thead tr`).clone(false).appendTo(`#${tableId} thead`);
        if (tableNH.length > 0) {
           // debugger;
            $(`#${tableId} thead tr.searchHeader`).remove();
        }
        tableNH.attr('class', 'searchHeader');

        
            $(`#${tableId} thead tr:eq(1) th`).each(function (i) {
                $(this).attr('style', 'background-color: white !important; padding:0');
                var title = $(this).text();

                $(this).html(
                    '<input type="text" class="form-control cst-search" style="border:1px solid #517ea1;" placeholder="Search ' + title + '" />'
                );
                
                // set input listener for each column
                $('input', this).on('keyup change', function () {
                    if (table.column(i).search() !== this.value) {
                        table
                            .column(i)
                            .search(this.value)
                            .draw();
                    }
                });
            });
        if (!colVisibility) {
            $(`#${tableId} thead tr:eq(0) th`).each(function (i) {
               
                var title = $(this).text();

                if (title != 'DATE_AND_TIME' && title.toLowerCase() != 'timestamp') {

                    $(this).append(
                        ' <input type="checkbox" class="form-check-input" value=' + i + ' id="' + title + '"  name="chkResultHdr" style="margin-left:10px;"/>'
                    );
                }
            });
        }
        // after checked checkbox for each column
        $('input[name=chkResultHdr]').on('click', function () {
            //debugger;
            ($('#LAT, #LATITUDE').is(':checked') ? $("#LON, #LONGITUDE").not(this).prop('checked', true) : $("#LON, #LONGITUDE").not(this).prop('checked', false));
            ($('#LON, #LONGITUDE').is(':checked') ? $("#LAT, #LATITUDE").not(this).prop('checked', true) : $("#LAT, #LATITUDE").not(this).prop('checked', false));

                      
            testResultHeaderAvg(table, null);

        });
        // colvis header function
        $(`#${tableId}`).on('column-visibility.dt', function (e, settings, index, state) {
            //debugger;
            testResultHeaderAvg(table, index);
            $('#testresult_route_map').show();
        });
        // add event listener for columns display change
        if (!colVisibility) {
            $(`#${tableId}`).on('column-visibility.dt', function (e, settings, column, state) {
                //console.log(
                //    'Column ' + column + ' has changed to ' + (state ? 'visible' : 'hidden')
                //);
                //TODO: Check if advnaced should be true or false
                setDatatableColumnSearch(tableId, table, pageName, resizeCol, advancedSearch, true)
                //console.log(table.columns());
                //console.log(table.columns().header().toArray().map(x => x.innerText));

                let inv = get_invisible_columns(table)
                handleColUpdate(pageName, tableId, inv)
            });
        }

        if (advancedSearch) {
            var columns = table.settings().init().columns;
            setUpAdvancedSearchArea(tableId, columns, 'EGTN-node')

            $('#applySearch' + tableId).click(function () {
                //currentTableSearch = title;
                setupAdvancedSearchObject(tableId)
                table.draw();
                currentTableSearch = '';
            })
        }

       
    }
}
function verifyanddGetStampdateCols(data) {
    //debugger;
    var dates = [];
    for (var i = 0; i < data.length > 0; i++) {
        dates.push(stringToDatestamp(data[i], true));
        //$.each(data[i], function (key, value) {
        //    if (new Date(value) >= new Date("2000-01-01")) {
        //        debugger;
        //        // convert the date string to a Date object >= replace this with your own comparison date
        //        dates.push(stringToDatestamp(value, true));
        //    }
        //});
    }
    return dates;
}
function testResultHeaderAvg(table, index) {
   //debugger;
    let checkIsCheckedCols = false;
    $('input[name=chkResultHdr]').each(function () {
        if ($(this).is(':checked')) {
            checkIsCheckedCols = true;
        }
    });
    let searchIsExist = false;
    $('input[type="text"].cst-search').each(function () {
        if ($(this).val() != null)
            searchIsExist = true;
    });

    $('.ColumnTestResult-bottomContainer-main').empty();
    let TestResultSelectedHeader = [];
    let mapPolylineValues = [];
    let CheckedTableColumns = [];
    var newData = [];
    let polyCount = 0;


    //if any column checked then call function else avoid
    if (checkIsCheckedCols) {
        $('input[name=chkResultHdr]').each(function (e) {
            
            let colName = $(this).attr('id');

            if (index == parseInt($(this).val())) {
                $(this).prop('checked', false);
            }
            else {
                if ($(this).is(':checked')) {
                  //debugger;
                    let data = null; let Dates = null;
                    if (index == 'Filter' && searchIsExist) {
                       // Dates = verifyanddGetStampdateCols($('#experimentresultsevaluation_table').DataTable().rows({ page: 'current' }).data());
                        Dates = verifyanddGetStampdateCols($('#experimentresultsevaluation_table').DataTable().column(0, { page: 'current' }).data());
                        data = $('#experimentresultsevaluation_table').DataTable().column($(this).val(), { page: 'current' }).data();
                    }
                    else {
                        Dates = verifyanddGetStampdateCols($('#experimentresultsevaluation_table').DataTable().column(0).data());
                        data = $('#experimentresultsevaluation_table').DataTable().column($(this).val()).data();
                    }

                    // reading values based on header name
                    if (colName == 'LAT' || colName == 'LATITUDE' || colName == 'LON' || colName == 'LONGITUDE') {
                        $('#LON, #LONGITUDE').prop('checked', true);
                        $('#LAT, #LATITUDE').prop('checked', true);

                        if (polyCount == 0) {
                            var rows = $('#experimentresultsevaluation_table').DataTable().rows({ page: 'current' }).data();
                            debugger;
                            for (var i = 0; i < rows.length; i++) {

                                if (rows[i].lat >= -90 && rows[i].lat <= 90 && rows[i].lon >= -180 && rows[i].lon <= 180 || rows[i].Latitude >= -90 && rows[i].Latitude <= 90 && rows[i].Longitude >= -180 && rows[i].Longitude <= 180) {

                                    if (colName == 'LAT' || colName == 'LON') {
                                        mapPolylineValues.push({
                                            lat: rows[i].lat,
                                            lng: rows[i].lon,
                                        });
                                    }
                                    else if (colName == 'LATITUDE' || colName == 'LONGITUDE') {
                                        mapPolylineValues.push({
                                            lat: rows[i].Latitude,
                                            lng: rows[i].Longitude,
                                        });
                                    }
                                }
                            }
                            polyCount++;
                        }
                    }
                    else {

                        var dataPoint = []; let lng = []; let lat = [];
                        // reading checked column values and column name dyanamically
                        for (var i = 0; i < data.length; i++) {
                            //debugger;
                            var tblCell = parseFloat(data[i]);

                            //if (tblCell >= -90 && tblCell <= 90) {
                            //    //read longitude values (-90<longitude<90)
                            //    lng.push(tblCell);
                            //}
                            //else if (tblCell >= -180 && tblCell <= 180) {
                            //    //read latitude values (-180<latitude<180 )
                            //    lat.push(tblCell);
                            //}
                            //else {
                                dataPoint.push({ "label": Dates[i], "y": tblCell });
                            //}
                        }
                        debugger;
                        if (dataPoint.length > 0) {
                            newData.push({
                                type: "spline",
                                showInLegend: true,
                               // yValueFormatString: "#0.0##################",
                                name: colName,
                                dataPoints: dataPoint
                            });
                        }
                        //colleting selected columns names
                        CheckedTableColumns.push(colName.toLowerCase());

                        var min = data.reduce(function (a, b) { return Math.min(a, b); });

                        var max = data.reduce(function (a, b) { return Math.max(a, b); });

                        var mediam = median(data);

                        // Calculate the mean (avg)
                        const mean = data.reduce((acc, curr) => acc + curr, 0) / data.length;

                        // Subtract the mean, square the result, and calculate the sum
                        //debugger;
                        const squaredDiffsSum = data.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);

                        // Calculate the variance
                        const variance = squaredDiffsSum / (data.length - 1);

                        const STD = Math.sqrt(variance);

                        //
                        var n = data.length;

                        const sem = STD / Math.sqrt(n);

                        const marginOfError = 1.96 * (STD / Math.sqrt(data.length));
                        const ciLower = mean - marginOfError;

                        const ciUpper = mean + 1.96 * STD / Math.sqrt(data.length);

                        const percentile = 0.111215; //data => quantile(data, .95);

                        TestResultSelectedHeader.push({
                            colName: colName,
                            // LAT:LAT,
                            min: min,
                            max: max,
                            mediam: mediam,
                            mean: mean.toFixed(7),
                            STD: STD.toFixed(7),
                            ciLower: ciLower.toFixed(7),
                            ciUpper: ciUpper.toFixed(7),
                            percentile: percentile,
                            sem: sem


                        });
                    }
                }
            }
        });
    }
    

        /* Polyline function called */
        initMap1(mapPolylineValues);
        $('#map1').show();
        $('.cst-map2').hide();
        /* Polyline function end */

        if (TestResultSelectedHeader.length > 0) {
            TestResult_SelectedAvg(TestResultSelectedHeader);
        }
        // line chart
        if (newData.length > 0) {
            TestResultCanvasJS_Chart1(newData);
        }
        else {
            debugger;
            var datachartPoints = [];
            let Dates = table.column(0).data();
            if (Dates != null && Dates.length > 0) {
                for (var i = 0; i < Dates.length; i++) {
                    datachartPoints.push({ "label": stringToDatestamp(Dates[i], true), "y": null });
                }
            }
            if (datachartPoints.length > 0) {
                TestResultCanvasJS_Chart(datachartPoints);
            }
        }
}
function median(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
};

function updateTableSettings(setting) {
    let id = getUserId()

    $.ajax({
        async: true,
        type: "PSOT",
        url: `/_5groutes/UpdateUserTableSettings`,
        data: { id: id, setting: setting },
        success: function (resp) {

            userSettings = resp
        }, error: function (error) {
            //debugger
            console.log(error)
        }
    });
}
function handleColUpdate(page, table, invisible) {
    //debugger;
    let setting = {
        pageName: page,
        tables: {
            tableId: table,
            hiddenColumns: invisible //['','','']
        }
    }
    updateTableSettings(setting);
}

function get_invisible_columns(table) {
    //console.log(table);
    var all_columns = table.settings().init().columns;
    console.log('all_columns', all_columns);
    var invisible_columns = [];
    for (var i in all_columns) {
        if (!table.column(all_columns[i].name + ':name').visible()) {
            invisible_columns.push(all_columns[i].name);
        }
    }

    return invisible_columns;
}

function getTableColFromObj(obj) {
    if (obj.length == 0) {
        return [];
    }
    let col = []
    for (var prop in obj[0]) {
        if (obj[0].hasOwnProperty(prop)) {
            col.push({
                "name": prop, "title": prop, "data": prop
            })
        }
    }
    return col;
}

function getTableButtons(title, advancedSearch = true) {
    //debugger;
    let btns = [
        {
            extend: 'colvis',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-eye"></i>',
            className: 'table-icon-btn'
        },
        {
            extend: 'copy',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-copy"></i>',
            className: 'table-icon-btn'
        },
        {
            extend: 'pdf',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-file-pdf"></i>',
            className: 'table-icon-btn'
        },
        {
            extend: 'csv',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-file-csv"></i>',
            className: 'table-icon-btn'
        },
        {
            extend: 'excel',
            title: returnExportTitle(title),
            text: '<i class="fa-solid fa-file-excel"></i>',
            className: 'table-icon-btn'
        },
        
    ]

    //if (advancedSearch) {
    //    btns.push({
    //        text: '<i class="fa-brands fa-searchengin"></i>',
    //        className: 'table-icon-btn',
    //        action: function (e, dt, node, config) {
    //            $('#advancedSearchContainer-' + title).slideToggle(300);
    //        }
    //    })
    //}

    return btns;
}

function preHideColumns(table, pageName, tableId) {
     //   debugger;
    //return new Promise(function (resolve, reject) {
    let colToHide = [];

    if (!userSettings.pages) {
        return
    }

    let index = userSettings.pages.findIndex(x => x.name == pageName);
    if (index > -1) {
        let index2 = userSettings.pages[index].tables.findIndex(x => x.tableId == tableId);
        if (index2 > -1) {
            colToHide = userSettings.pages[index].tables[index2].hiddenColumns;
        }
    }
    //await hideColumns(table, colToHide);

    return new Promise(function (resolve, reject) {
        try {
            for (let i = 0; i < colToHide.length; i++) {
                let index = table.column(`${colToHide[i]}:name`).index();
                table.column(index).visible(!table.column(index).visible());;
            }
            resolve(true);
        }
        catch (ex) {
            reject(false)
        }
    })
    //}
}

function hideColumns(table, columns) {
   // debugger;
    return new Promise(function (resolve, reject) {
        try {
            for (let i = 0; i < columns.length; i++) {
                let index = table.column(`${columns[i]}:name`).index();
                table.column(index).visible(!table.column(index).visible());;
            }
            resolve(true);
        }
        catch (ex) {
            reject(false)
        }
    })
}

//#endregion

//#region helpers
function getUserId() {
    return $('#user_id').val();
    //if (userInfo && userInfo.Id) {
    //    return userInfo.Id;
    //}
    //return "";
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getObjectPropertyKeys(obj) {
    let names = []
    Object.keys(obj).forEach(key => {
        names.push(key)
    })
    return names;
}

function camelize(str) {
    //debugger;
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

const camelizeKeys = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(v => camelizeKeys(v));
    } else if (obj != null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [camelize(key)]: camelizeKeys(obj[key]),
            }),
            {},
        );
    }
    return obj;
};

function normlizeCamelcase(text) {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}

function countInstances(string, word) {
    return string.split(word).length - 1;
}

function isXMLString(xml) {
    try {
        xmlDoc = $.parseXML(xml); //is valid XML
        return true;
    } catch (err) {
        // was not XML
        return false;
    }
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function xml2json(xml) {
    let value = xml.substring(
        xml.indexOf("<") + 1,
        xml.indexOf(">")
    );
    while (countInstances(xml, `</${value}>`) < 1) {
        let i = xml.indexOf('>') + 1;
        xml = xml.substring(i).trim();
        value = xml.substring(
            xml.indexOf("<") + 1,
            xml.indexOf(">")
        );
    }

    var x2js = new X2JS();
    return x2js.xml_str2json(xml);

    const json = {};
   
}

function setGridViewDropdown(page, list = []) {
    let gridsList = getGridViewListForPage(page)
    currentGridList = gridsList;
    let HTML = ''
    HTML += '<div class="dropdown-grid">'

    HTML += '  <div class="dropdown-icon-container"> <i class="fa-solid fa-chart-pie settings-icon" onclick="gridDropdownToglle()"></i> </div>'

    HTML += '   <div id="gridDropdown" class="gridDropdown-content">'
    for (let i = 0; i < gridsList.length; i++) {
        if (!gridsList[i].visible) {
            handleGridDropdownChange(page, gridsList[i].objId, { checked: false }, false)
        }
        HTML += '        <a>'
        HTML += `           <label class="task" >`
        HTML += `               <input type="checkbox" name="${gridsList[i].name}" id="${gridsList[i].name}" onclick="handleGridDropdownChange('${page}','${gridsList[i].objId}',this);"` + (gridsList[i].visible == true ? `checked>` : `>`);
        HTML += `                    ${gridsList[i].name}`
        HTML += '           </label>'
        HTML += '       </a>'
    }
    HTML += '   </div>'
    HTML += '</div>'
    $('#gird-settings').empty().append(HTML);
}
// testresult canvasJS
function TestResultCanvasJS_Chart1(data) {
    // debugger;
    var chart = {};

    var NamedData = { values: data };
    $('.line_charts_cst').show();

    chart = new CanvasJS.Chart('scenario_line_chart', GetTestresultGraphConfig(NamedData));
    chart.render();
}
function TestResultCanvasJS_Chart(data) {
   //debugger;
    var chart = {};
    
    var precipitationData = ExtractTestResultDataPerHostType(data);
    var NamedData = {
      
        values: precipitationData
    };
  //  $('#line_charts').addClass('experimentresults_data_area');
    $('.line_charts_cst').show();
   // debugger;
    chart = new CanvasJS.Chart('scenario_line_chart', GetTestresultGraphConfig(NamedData));
    chart.render();
}
function ExtractTestResultDataPerHostType(testResultTableData) {
  /*debugger;*/
    var newData = [];

    //if (status == 0 && testResultTableData != null) {
    //    for (var key in testResultTableData) {
    //        if (key.toLowerCase() != 'timestamp' && key != 'date_and_time' && key != 'lat' && key.toLowerCase() != 'latitude' && key != 'lon' && key.toLowerCase() != 'longitude') {
    //           // let ms = new Date((testResultTableData.date_and_time != null ? testResultTableData.date_and_time : testResultTableData.Timestamp)).getMilliseconds();
    //            //let _date = new Date((testResultTableData.date_and_time != null ? testResultTableData.date_and_time : testResultTableData.Timestamp)).toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', " ") + ':' + (ms < 10 ? '0' + ms : ms);

    //            newData.push({
    //                type: "spline",
    //                showInLegend: true,
    //                yValueFormatString: "#0.0###############",
    //                name: key,
    //                dataPoints: [{ "label": ReadTimestamp(testResultTableData.date_and_time != null ? testResultTableData.date_and_time : testResultTableData.Timestamp), "y": testResultTableData[key] }]//[{ x: new Date((testResultTableData.date_and_time != null ? testResultTableData.date_and_time : testResultTableData.Timestamp)), y: testResultTableData[key] }]
    //            });
    //        }
    //    }

    //}

   // var Dates = verifyanddGetStampdateCols(testResultTableData.rows().data());// testResultTableData.column(0).data();
    //var datachartPoints = [];
    //for (var i = 0; i < testResultTableData.length; i++) {
    //    $.each(testResultTableData[i], function (key1, value1) {
    //        if (new Date(value1) >= new Date("2022-01-01")) {
    //            datachartPoints.push({ "label": ReadTimestamp(value1), "y": null });
    //        }
    //    });
    //}

    if (testResultTableData.length > 0) {

        newData.push({
            type: "spline",
            dataPoints: testResultTableData
        });
    }
 
   return newData;
}


// MIN, MAX, AVG, STD, MEDIAM
function TestResult_SelectedAvg(data) {
    //debugger;
    var html = "";
    for (var i = 0; i < data.length; i++) {

        html += '<div class="trackDetail-bottomContainer row" style="margin-bottom:5px;margin-top:5px">';
        html += '<div>';
        html += '<div class="container-date">';
        html += '<b>' + data[i].colName + '</b><br/><br/>';
        html += '</div>'
        html += '</div>'
        html += '<div>'


        html += '<div class="top-bot-info">'
        html += '<p>AVG</p>'
        html += '<span>' + data[i].mean + '</span>'
        html += '</div>'
        html += '<div class="top-bot-info">'
        html += '<p>MIN</p>'
        html += '<span>' + data[i].min + '</span>'
        html += '</div>'

        html += '<div class="top-bot-info">'
        html += '<p>MAX</p>'
        html += '<span>' + data[i].max + '</span>'
        html += '</div>'
        html += '<div class="top-bot-info">'
        html += '<p>STD</p>'
        html += '<span>' + data[i].STD + '</span>'
        html += '</div>'

        html += '<div class="top-bot-info">'
        html += '<p>95% CI Upper bound</p>'
        html += '<span>' + data[i].ciUpper + '</span>'
        html += '</div>'
        html += '<div class="top-bot-info">'
        html += '<p>95% CI Lower bound</p>'
        html += '<span>' + data[i].ciLower + '</span>'
        html += '</div>'

        html += '<div class="top-bot-info">'
        html += '<p>Median</p>'
        html += '<span>' + data[i].mediam + '</span>'
        html += '</div>'

        //html += '<div class="top-bot-info">'
        //html += '<p>95% PERCENTILE</p>'
        //html += '<span>' + data[i].percentile + '</span>'
        
        //html += '</div>'

        html += '</div>'
        html += '</div>';
    }
    $('.ColumnTestResult-bottomContainer-main').empty().append(html);
}
