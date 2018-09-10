
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


    
    $('.login-button').on('click', function(e){
        e.preventDefault();
    });

    //masonry grid for popular section

    var $grid = $('.grid-bla').isotope({
	  
	  itemSelector: '.grid-item-bla',
	  percentPosition: true,
	  masonry: {
	    //column width set in CSS
	    columnWidth: '.grid-sizer-bla'

	  }
	});

    mapboxgl.accessToken = 'pk.eyJ1IjoibWx5MDIyMyIsImEiOiJjamxuNGc5Zm8xZjdyM2twaGpsa3E2cnRmIn0.YC9jrYJYIQWj25EF4Wn3Zg';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mly0223/cjln4h5eu5wca2snqpippvx3f',
        center: [174.767164, -36.851146],
        zoom: 15.3
    });

});


