$(function(){

	$('.grid-bla').isotope({
	  // set itemSelector so .grid-sizer is not used in layout
	  itemSelector: '.grid-item-bla',
	  percentPosition: true,
	  masonry: {
	    // use element for option
	    columnWidth: '.grid-sizer-bla'
	  }
	})
	
})