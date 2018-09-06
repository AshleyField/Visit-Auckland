
//----init masonry----//

var $grid = $('#grid-container').masonry({
  itemSelector: '.grid-item',
  percentPosition: true,
  columnWidth: '.grid-sizer'
});



//-----layout masonry after each image loads----//

// $grid.imagesLoaded().progress( function() {
//   $grid.masonry();
// });  
