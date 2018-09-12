
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



});

const version = '?v=20170901';
const clientid = '&client_id=NMXJZAHXRWHSYSLXYGNJC4032TRUV1BJMGJ5KGNKN3QXVSRI';
const clientSecret = '&client_secret=BQ1G5KHZAHTXNISQU4HDDXVNRYB4BL0AAKTLDTFXM0F10N10';
const key = version + clientid + clientSecret;
let map; 
let markerHTML = $('#templateMarker').text();
let markerTemplate = Template7(markerHTML).compile();

$(function(){

    let center = [-36.8446152873055,174.76662397384644];
    map = L.map('map',{scrollWheelZoom:false}).setView(center,17);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);


    var iconFood = '../assets/images/lightbluepin.svg';
    var iconDrinks = '../assets/images/darkbluepin.svg';
    var iconShop = '../assets/images/pinkpin.svg';
    var iconSight = '../assets/images/purplepin.svg';


    getVenues('food',iconFood);
    getVenues('drinks',iconDrinks);
    getVenues('shops',iconShop);
    getVenues('sights',iconSight);



});




function getVenues(section,icon){

    // &limit=50 add this in after section+'if i want more markers

    let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&section='+section+'&ll=-36.8446152873055,174.76662397384644';

    $.ajax({
    url:exploreUrl,
    dataType:'jsonp',
        success:function(res){
            var data = res.response.groups["0"].items;

            console.log(data);

            //  map data to a simpler venues format

            var venues = _(data).map(function(item){ // this function is to transform each item into smaller pieces of data. these items/venues have alot of data 
            //in the console. Also called mapping data
                return{
                    latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
                    name:item.venue.name,
                    venueid:item.venue.id,
                    category:item.venue.categories["0"].name,
                    address:item.venue.location
                };

            });

            //loop list of venues and add a marker onto the map
            _(venues).each(function(venue){


                // var iconImage = '../assets/images/darkbluepin.svg'; //default marker


                let foodIcon = L.icon({
                    iconUrl:icon,
                    iconSize:[60,60]

                });
                 
                let marker = L.marker(venue.latlng,{icon:foodIcon}).addTo(map);
                marker.venueid = venue.venueid;

                marker.on('click',function(){
                    let venueUrl = 'https://api.foursquare.com/v2/venues/'+//from foursquare doc, 
                    this.venueid+key;

                    $.ajax({
                        url:venueUrl,
                        dataType:'jsonp',
                        success:function(res){
                            var venue = res.response.venue;

                            $('.modal-title').text(venue.name);
                            var photo = venue.bestPhoto; //find where to go from dom inspection
                            var source = photo.prefix+'100x100'+photo.suffix;
                            var contact = venue.contact.phone;
                            var address = venue.location.address;
                            var category = venue.categories.name;
                            $('.modal-body').empty();
                            $('<img src="'+source+'">').appendTo('.modal-body');
                            $('<p>Phone:'+contact+'</p>').appendTo('.modal-body');
                            $('<p>Address:'+address+'</p>').appendTo('.modal-body');
                            $('<p>category:'+category+'</p>').appendTo('.modal-body');

                            $('#venueModal').modal('show');
                        }
                    });


                });


                
            });

            

           

        
        }

    });
}











