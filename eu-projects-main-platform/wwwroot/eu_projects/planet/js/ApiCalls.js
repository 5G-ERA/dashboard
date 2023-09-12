let apiUrl = '/api/planet';

$(async function () {
    loadUserSettings();
    //let setting = {
    //    pageName: 'node-egtn',
    //    hiddenGrids: ['grid4', 'grid7']
    //}
    //updateGridSettings(setting)
});



let settings = {
    id: "",
    uid: "",
    pages: [
        {
            name: "",
            hiddenGrids: ['', '', ''],
            tables: [{
                tableId: "",
                hidden: ["", ""]
            }]
        }
    ]
}

function loadUserSettings() {
    let id = getUserId()
    $.ajax({
        async: true,
        type: "GET",
        //contentType: "application/json",
        dataType: "json",
        //url: `${apiUrl}/settings/${id}`,
        url: `/Planet/GetUserSettings`,
        data: { id: id },
        success: function (resp) {
            //debugger
            userSettings = resp
        }, error: function (error) {
            //debugger
            console.log(error)

        }
    });
}


function updateGridSettings(setting) {
    let id = getUserId()

    $.ajax({
        async: true,
        type: "PSOT",
        url: `/Planet/UpdateUserGridSettings`,
        data: { id: id, setting: setting },
        success: function (resp) {

            userSettings = resp
        }, error: function (error) {
            //debugger
            console.log(error)
        }
    });
    //apiUrl + "/settings/" + id +
}

function updateTableSettings(setting) {
    let id = getUserId()

    $.ajax({
        async: true,
        type: "PSOT",
        url: `/Planet/UpdateUserTableSettings`,
        data: { id: id, setting: setting },
        success: function (resp) {

            userSettings = resp
        }, error: function (error) {
            ////debugger
            console.log(error)
        }
    });
}

function updateTableSavedSearches(setting) {

    let id = getUserId()
    return new Promise(function (resolve, reject) {
        $.ajax({
            async: true,
            type: "PSOT",

            url: `/Planet/UpdateUserSavedTableSearch`,
            data: { id: id, setting: setting },
            success: function (resp) {
                userSettings = resp
                resolve(true);
            }, error: function (error) {
                //debugger
                console.log(error)
                resolve(false);
            }
        });
    })
}

function deleteTableSavedSearch(setting) {

    let id = getUserId()
    return new Promise(function (resolve, reject) {
        $.ajax({
            async: true,
            type: "PSOT",
            url: `/Planet/DeleteUserSavedSearch`,
            data: { id: id, setting: setting },
            success: function (resp) {
                userSettings = resp
                resolve(true);
            }, error: function (error) {
                //debugger
                console.log(error)
                resolve(false);
            }
        });
    })
}

function getMongoList(collection) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            async: true,
            type: "GET",
            //contentType: "application/json",
            dataType: "json",
            url: `${apiUrl}/${collection}`,
            success: function (resp) {
                resolve(resp);
            }, error: function (resp) {
                //debugger
                console.error(resp)
                reject(resp);
            }
        });
    })

}

function setAlertAsRead(id) {

    $.ajax({
        async: true,
        type: "PSOT",
        url: `/Planet/SetAlertAsRead`,
        data: { id: id },
        success: function (resp) {
            //debugger
            userSettings = resp
        }, error: function (error) {
            //debugger
            console.log(error)
        }
    });
}