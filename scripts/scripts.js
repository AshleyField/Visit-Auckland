$(function() {

    // Open and close nav on mobile
    $('.bars').on('click', function(e) {

        var navData = $('.navigation').data('nav');

        e.stopPropagation();

        if (navData == 'close') {
            $('.navigation').addClass('nav-open')
                .data('nav', 'open')

            $('.bars>i').first().removeClass('fas fa-bars')
                .addClass('fas fa-times');

        } else {
            $('.navigation').removeClass('nav-open')
                .data('nav', 'close');
            $('.bars>i').removeClass('fas fa-times')
                .addClass('fas fa-bars');

        }
    });

    $('.grid-bla').isotope({
	  // set itemSelector so .grid-sizer is not used in layout
	  itemSelector: '.grid-item-bla',
	  percentPosition: true,
	  masonry: {
	    // use element for option
	    columnWidth: '.grid-sizer-bla'
	  }
	})
});
