
$(function () {
    RenderSideMenuItems();
    ShowHomeView()

    $('.main-panel').addClass('lightMode');
    $('#5groutesmodal').addClass('lightMode');
    $('.color-tiles').remove();
    $($('.settings-heading')[1]).hide();
    $('.settings-heading').text('SITE THEME');
    _graphTheme = 'light1';
});


/*------------------------------------Home_View-----------------------------------------*/

function ShowHomeView() {

    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/databrix/Index",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $('#main-platform-content').empty().append(HTML)

}

/*------------------------------------Case_1_View-----------------------------------------*/

function ShowCase1View(){
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/databrix/Case1",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $('#main-platform-content').empty().append(HTML)
}

/*------------------------------------Case_2_View-----------------------------------------*/

function ShowCase2View(){
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/databrix/Case2",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $('#main-platform-content').empty().append(HTML)
}

/*------------------------------------Case_3_View-----------------------------------------*/

function ShowCase3View(){
    let HTML = ''
    $.ajax({
        async: false,
        type: "POST",
        url: "/databrix/Case3",
        success: function (resp) {
            HTML = resp;
        }, error: function (resp) {
            console.error(resp)
        }
    });
    $('#main-platform-content').empty().append(HTML)
}





