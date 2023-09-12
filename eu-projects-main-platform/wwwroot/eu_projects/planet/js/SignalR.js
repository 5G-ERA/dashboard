
var signalrConnection;
let kafkaTopics = {
    'dhl_metrics': 'dhl-metrics',
    'citylogin_deliveries': 'citylogin-deliveries',
    'll1_iot': 'll1-iot',
    'll3_events': 'll3-events',
    'UnifiedInlandTransportDocument': 'UnifiedInlandTransportDocument',
}

$(async function () {
    let tokenInfo = await generateCurrentUserToken();

    signalrConnection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        //.withUrl(`${baseApiUrl}/planetHub`, {
        .withUrl(`/planetHub`, {
            accessTokenFactory: () => tokenInfo.token,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();


    signalrConnection.on("Notification", handleNotification.bind(this));
    signalrConnection.on(kafkaTopics.dhl_metrics, handleDhl.bind(this));
    signalrConnection.on(kafkaTopics.citylogin_deliveries, handleCitylogin.bind(this));
    signalrConnection.on(kafkaTopics.ll1_iot, handleLL1_iot.bind(this));
    signalrConnection.on(kafkaTopics.ll3_events, handleLL3_events.bind(this));
    signalrConnection.on(kafkaTopics.UnifiedInlandTransportDocument, handleUnified.bind(this));

    signalrConnection.start().then(async () => {
        //signalrConnection.invoke("AssignToGroup", "dhl-metrics-data");

        assignGroup(`Notification`);
        assignGroup(`${kafkaTopics.dhl_metrics}-data`);
        assignGroup(`${kafkaTopics.citylogin_deliveries}-data`);
        assignGroup(`${kafkaTopics.ll1_iot}-data`);
        assignGroup(`${kafkaTopics.ll3_events}-data`);
        assignGroup(`${kafkaTopics.UnifiedInlandTransportDocument}-data`);
        console.log("Signalr connected");
    }).catch((err) => {
        console.log(err);
    });

})

function assignGroup(group) {
    try {
        signalrConnection.invoke("AssignToGroup", group);
    }
    catch (ex) {
        console.log(ex);
    }
}
function removeGroup(group) {
    try {
        signalrConnection.invoke("RemoveFromGroup", group);
    }
    catch (ex) {
        console.log(ex);
    }
}

function handleNotification(data) {
    //debugger
    try {
        let obj = convertDataToObject(data)
        console.log(obj)

        addAlert(obj)
    }
    catch (ex) {
        //debugger
    }
}

function handleDhl(data) {
    //debugger
    try {
        let obj = convertDataToObject(data)
        console.log(obj)
    }
    catch (ex) {
        //debugger
    }
}
function handleCitylogin(data) {
    //debugger
    try {
        let obj = convertDataToObject(data)
        console.log(obj)
    }
    catch (ex) {
        //debugger
    }
}
function handleLL1_iot(data) {
    //debugger
    try {
        let obj = convertDataToObject(data)
        console.log(obj)
    }
    catch (ex) {
        //debugger
    }
}
function handleLL3_events(data) {
    //debugger
    try {
        let obj = convertDataToObject(data, true)
        console.log(obj)
    }
    catch (ex) {
        //debugger
    }
}
function handleUnified(data) {
    //debugger
    try {
        let obj = convertDataToObject(data, true)
        console.log(obj)
    }
    catch (ex) {
        //debugger
    }
}


function convertDataToObject(data, isXML = false) {
    if (typeof data === 'string' || data instanceof String) {
        try {
            if (isXML) {
                return data = xml2json(data)
            }

            else {
                return JSON.parse(data)
            }
        }
        catch (ex) {
            return data
        }
    }
    return data
}

function generateCurrentUserToken() {
    return new Promise(function (resolve, reject) {
        let id = getUserId()
        $.ajax({
            async: true,
            type: "GET",
            dataType: "json",
            url: `/Planet/GenerateCurrentUserToken`,
            data: { id: id },
            success: function (resp) {
                resolve(resp)
            }, error: function (error) {
                //debugger
                reject(resp)
            }
        });
    })
}