function Logout() {
    //debugger;
    try {
        $.ajax({
            url: '/Authentication/Logout',
            type: "POST",
            success: function (resp) {
                if (resp != '')
                    console.error('Success Logout:' + resp);
                else
                    location.reload();
            },
            error: function (err) {
                console.error('Failed Logout:' + err);
            }
        });
    } catch (err) {
        console.error('Logout:' + err);
    }
}

function OpenDashboard() {
    var currentProjectId = $('#project_id').val();

    try {
        $.ajax({
            url: '/Dashboard/Index',
            type: "POST",
            success: function (resp) {
                $('#main-platform-content').empty().append(resp)
            },
            error: function (err) {
                console.error('Error:' + err);
            }
        });
    } catch (err) {
        console.error('Error:' + err);
    }
}

/* SYSTEM SETTINGS PART */

function OpenSystemSettings() {
    var currentUserId = $('#user_id').val();

    try {
        $.ajax({
            url: '/Settings/Index',
            data: {userId: currentUserId},
            type: "POST",
            success: function (resp) {
                $('#main-platform-content').empty().append(resp);
                $('.nav-item').removeClass('active');
                $('.nav-item').removeClass('selected');
                $('#euProjectDropdown').hide();
            },
            error: function (err) {
                console.error('Error:' + err);
            }
        });
    } catch (err) {
        console.error('Error:' + err);
    }
}


 //----------------- NEW SIDEBAR SECTION -------------------
(function ($) {

    "use strict";

    var fullHeight = function () {

        $('.js-fullheight').css('height', $(window).height());
        $(window).resize(function () {
            $('.js-fullheight').css('height', $(window).height());
        });

    };
    fullHeight();

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

})(jQuery)
