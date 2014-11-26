jQuery(document).ready(function () {

    if ($('.chat')) {
        $.when($('.chat').fadeOut("slow")).then(function () {
          $('.users-online').fadeIn("slow");
        })
    }    


})