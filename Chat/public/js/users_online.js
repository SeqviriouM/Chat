jQuery(document).ready(function () {

    if ($('.chat')) {
        $.when($('.chat').fadeOut("slow")).then(function () {
          $('.users-online').fadeIn("slow");
        })
    }

    /* Change active item in navigation */
    $('.navigation ul.menu li.active').removeClass('active');
    $('.navigation ul.menu li').eq(1).addClass('active');
          
})