function GenerateTestAttachmentSection(testId) {

    var html = '<div class="file-loading">'
    html += '<input id="input-id" type="file" multiple />'
    html += '</div >';
    $('#test_attachement').empty().append(html);

    var attachments = [];
    var defaultPreview = [];
    var urls = [];

    attachments = RetrieveAttachmentPerTestId(testId);

    if (Array.isArray(attachments) && attachments.length) {
        //debugger;
        for (var i = 0; i < attachments.length; i++) {

            var fileName = attachments[i].testAttachmentFileName.split('.');

            var extension = fileName[fileName.length - 1];

            defaultPreview.push(
                {
                    caption: attachments[i].testAttachmentFileName,
                    downloadUrl: "/Upload/Test_" +
                        attachments[i].testScenarioId +
                        "/" +
                        attachments[i].testAttachmentFileUID +
                        '.' +
                        extension,
                    //description: "<h5>The Moon</h5>The Moon is Earth's only natural satellite and the fifth largest moon in the solar system. The Moon's distance from Earth is about 240,000 miles (385,000 km).",
                    size: attachments[i].testAttachmentFileSize,
                    //width: "120px",
                    key: attachments[i].testAttachmentFileUID
                });

            urls.push("/Upload/Test_" +
                attachments[i].testScenarioId +
                "/" +
                attachments[i].testAttachmentFileUID +
                '.' +
                extension);
        }

    }
    $("#input-id").fileinput({
        theme: "fas",
        uploadUrl: '/_5groutes/Uploads',
        deleteUrl: '/_5groutes/DeleteTestAttachment',
        uploadExtraData: function (previewId, index) {
            return { testScenarioId: parseInt($('#testscenariodesc_id').val()) };
        },
        deleteExtraData: function (previewId, index) {
            return { testScenarioId: parseInt($('#testscenariodesc_id').val()) };
        },
        overwriteInitial: false,
        initialPreviewFileType: 'image',
        initialPreviewAsData: true,
        initialPreview: urls,
        initialPreviewConfig: defaultPreview,
        showUpload: true,
        hideThumbnailContent: true,
        browseOnZoneClick: true,
        removeTitle: 'Clear all loaded files',
        browseClass: 'btn btn-info',
        removeClass: 'btn btn-danger',
        uploadClass: 'btn btn-primary'
    });
}
