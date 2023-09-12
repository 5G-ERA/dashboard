function RetrieveMongoCollectionData(databaseName, collectionName) {
    var data;

    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: '/Planet/RetrieveMongoCollectionData',
        data: {
            databaseName: databaseName,
            collectionName: collectionName
        },
        success: function (resp) {
            data = resp;
        }, error: function (error) {
            console.log(error);

        }
    });

    return data;
}

function RetrieveMongoCollectionDataPerObjectId(databaseName, collectionName, objectId) {
    var data;

    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: '/Planet/RetrieveMongoCollectionData',
        data: {
            databaseName: databaseName,
            collectionName: collectionName,
            objectId: objectId
        },
        success: function (resp) {
            data = resp;
        }, error: function (error) {
            console.log(error);

        }
    });

    return data;
}

function RetrieveMongoDatabaseCollections(databaseName) {
    var data;

    $.ajax({
        async: false,
        type: "GET",
        dataType: "json",
        url: '/Planet/RetrieveMongoDatabaseCollections',
        data: {
            databaseName: databaseName
        },
        success: function (resp) {
            data = resp;
        }, error: function (error) {
            console.log(error);
        }
    });

    return data;
}