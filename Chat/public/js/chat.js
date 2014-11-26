jQuery(document).ready(function () {

    if ($('.users-online')) {
        $.when($('.users-online').fadeOut("slow")).then(function () {
            $('.chat').fadeIn("slow");
        })
    }    


})

