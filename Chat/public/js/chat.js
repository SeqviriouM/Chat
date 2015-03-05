jQuery(document).ready(function () {

  if ($('.users-online')) {
      $.when($('.users-online').fadeOut("slow")).then(function () {
          $('.chat').fadeIn("slow");
      })
  }    

  /* Change active item in navigation */
  $('.navigation ul.menu li.active').removeClass('active');
  $('.navigation ul.menu li').eq(0).addClass('active');

})

