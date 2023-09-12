function ApplyDarkStyles() {
    $('.container-scroller').addClass('black-bg');
}

function ApplyLightStyles() {
    $('.container-scroller').removeClass('black-bg');
}

function SideBarLightMode() {
    /*SIDEBAR THEME*/
    $('.sidebar-bg-options').css('background-color', '#fff')
    $('.sidebar-bg-options').css('color', '#000')
    $('#theme-settings').css('background-color', '#fff')
    $('.settings-heading').css('background-color', '#fff')
    $('.settings-heading').css('color', '#000')
    $('.nav-item').addClass('border-bottom')
    $('.rounded-circle').addClass('border')
}

function SideBarDarkMode() {
    /*SIDEBAR THEME*/
    $('.sidebar-bg-options').css('background-color', '#24242e')
    $('.sidebar-bg-options').css('color', 'white')
    $('#theme-settings').css('background-color', '#24242e')
    $('.settings-heading').css('background-color', '#24242e')
    $('.settings-heading').css('color', '#fff')
    $('.nav-item').removeClass('border-bottom')
    $('.rounded-circle').removeClass('border')
}