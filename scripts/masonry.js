
//----init masonry----//

// var $grid = $('.grid-bla').masonry({
//   itemSelector: '.grid-item-bla',
//   percentPosition: true,
//   columnWidth: '.grid-sizer-bla'
// });

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



//-----layout masonry after each image loads----//

// $grid.imagesLoaded().progress( function() {
//   $grid.masonry();
// });  
