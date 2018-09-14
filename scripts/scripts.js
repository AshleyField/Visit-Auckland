


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

    // mapboxgl.accessToken = 'pk.eyJ1IjoicmFqaXYwNSIsImEiOiJjamtrZXpnMmg2NWZiM3JtbG4zNXF0cnZwIn0.hcHWauYXniub3gkiDYWFQw';
    // const map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/rajiv05/cjlwzccyb42l82sqrsva48olw',
    //     center: [174.767164, -36.851146],
    //     zoom: 15.3
    // });


//Raj START Map Trial --------------------------------------------------------------

const version = '?v=20170901';
const clientid = '&client_id=YWZH5MR1ENQY5XKG1P4A4Q1AW0UJYGHBRLOG330IH35RO0C5';
const clientSecret = '&client_secret=PUFZ2EQERAZJJ5HWDLCTGFUAAKKCCXRCQTFO3MFMSZZJ5435';
const key = version + clientid + clientSecret;

var food = '4d4b7105d754a06374d81259'
var drinks = '4bf58dd8d48988d11a941735'
var hotels = '4bf58dd8d48988d1fa931735'
var landmarks = '4c38df4de52ce0d596b336e1'

let map;

//-36.844720,174.766553
$(function(){

    let center = [-36.8446152873055,174.76662397384644];
    map = L.map('map').setView(center,17);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

    //vicinity circle
    L.circle(center, {
                        radius: 600,
                        color: 'transparent',
                        weight:1,
                        fill:'grey'
                    }).addTo(map);



    // stop mouse scroll over map when scrolling through website -----------------------
    // map.scrollWheelZoom.disable();
    // this.map.on('click', () => { this.map.scrollWheelZoom.enable();});
    // this.map.on('mouseout', () => { this.map.scrollWheelZoom.disable();});

    getVenues('-36.844720,174.766553',food,'scripts/food.svg');
    getVenues('-36.844720,174.766553',drinks,'scripts/drinks.svg');
    getVenues('-36.844720,174.766553',hotels,'scripts/hotels.svg');
    getVenues('-36.844720,174.766553',landmarks,'scripts/attractions.svg');

    // var baseLayers = {};
    // var overLayers = {
    //     'venue': venueUrl
    //     // 'Bus Stops' : busStopGroup,
    //     // 'other' : 
    // };
    // L.control.layers(baseLayers,overLayers).addTo(map);


});

//Raj END Map Trial --------------------------------------------------------------

function getVenues(ll,section,icon){

    //Explore venues -- foursquare api

    // let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&section='+section+'&limit=20&radius=500&ll='+ll;
    let searchUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&categoryId='+section+'&limit=20&radius=500&ll='+ll;

    console.log(searchUrl)

    $.ajax({
        url:searchUrl,
        datatype:'jsonp',
        success: function(res){
            var data = res.response.groups["0"].items;

            // console.log(res);

            var venues = _(data).map(function(item){

                return {
                    latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
                    name:item.venue.name,
                    venueid:item.venue.id,

                };

            });
            console.log(venues);

            _(venues).each(function(venue){
                let venueIcon = L.icon({
                    iconUrl:icon,
                    iconSize:[50,50]
                })
                let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(map);

                marker.venueid = venue.venueid;
            
                marker.on('click',function(){
                    var venueUrl = 'https://api.foursquare.com/v2/venues/'+
                    this.venueid+key

                    $.ajax({
                        url:venueUrl,
                        dataType:'jsonp',
                        success:function(res){

                            console.log(res);

                            var venue = res.response.venue;
                            // $('.modal-body').text(venue.location);
                            $('.modal-title').text(venue.name);

                            if(venue.bestPhoto){
                                var photo = venue.bestPhoto;
                                var source = photo.prefix+'230x200'+photo.suffix;

                            }
                            

                            $('.modal-body>.left').empty();
                            $('<img src="'+source+'">').appendTo('.modal-body>.left');
                            $('.modal-body>.right').empty();
                            if(venue.location.address){
                                $('<p class="address-heading">Address:</p>').appendTo('.modal-body>.right');
                                $('<p>'+venue.location.address+', '+venue.location.city+', '+venue.location.country+'</p>').appendTo('.modal-body>.right');
                                
                            }

                            if(venue.hours){
                                 _(venue.hours.timeframes).each(function(opening){
                                    $('<p class="hours-heading">Hours:</p>').appendTo('.modal-body>.right');
                                    $('<p>'+opening.days+' : '+opening.open[0].renderedTime+'</p>').appendTo('.modal-body>.right');
                                });

                            }else{
                                 $('<p>No information. Visit Website for more details</p>').appendTo('.modal-body>.right');
                            }
                           
                            $('#venueModal').modal('show');
                        }
                    });

                    
                });
            });
        }
    });

}







