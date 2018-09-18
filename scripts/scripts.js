


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

    // masonry grid for popular section
    var $grid = $('.grid-bla').isotope({
      
      itemSelector: '.grid-item-bla',
      percentPosition: true,
      masonry: {
        //column width set in CSS
        columnWidth: '.grid-sizer-bla'

      }
    });

    $(function() {
    
    getTrending();
    let userLatitude = 0;
    let userLongitude = 0;

    function getTrending(){

            let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll=-36.8446152873055,174.76662397384644&limit=9';
            console.log(exploreUrl);
            $.ajax({
                url:exploreUrl,
                dataType:'jsonp',
                success:function(res){

                    console.log(res);

                    let popularHTML = $('#templatePopular').text();
                    let popularTemplate = Template7(popularHTML).compile();

                    _(res.response.groups["0"].items).each(function(item){

                        let venueid = item.venue.id;
                        let venueUrl = 'https://api.foursquare.com/v2/venues/'+venueid+key;
                        $.ajax({
                            url: venueUrl,
                            success:function(res){
                                
                                let output = popularTemplate(res.response.venue);
                                
                                var gridItem = $(output);

                                $grid.append(gridItem)
                                .isotope('appended', gridItem);

                            }
                        });


                    });

                }
            });
        }
    });

    $("button").click(function(){
                                    

        //get directions

        //getting users position
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function(position) {
                userLatitude  = position.coords.latitude;
                userLongitude = position.coords.longitude;

                // Add marker to the map
                console.log(userLongitude,userLatitude);

                let icon = L.icon({iconUrl:iconUser, iconSize:[60,60]});

                var currentPosition = {lat:userLatitude,lng:userLongitude};
                let marker = L.marker(currentPosition,{icon:icon}).addTo(map);


                 //create a request for directions
                 var request = {
                    origin: currentPosition,
                    destination: currentMarker.getLatLng(),
                    travelMode: 'WALKING'
                };
                //ask directionsService to fulfill your request
                directionsService.route(request,function(response,status){
                    if(status == 'OK'){
                        var overview_path = response.routes["0"].overview_path;
                        //display direction
                        var path = _(overview_path).map(function(point){
                            return {lat:point.lat(),lng:point.lng()}
                        });
                        var polyline = L.polyline(path, {color: 'red'});
                        map.addLayer(polyline);


                            // if(map.hasLayer(polyline)){
                            //     polyline.redraw();
                            // }

                        // .addTo(map);

                    }
                });

            });

        } 
        else { 
            console.log('cannot access location');
        }
    });//button on click
});



//Raj START Map Trial --------------------------------------------------------------

const version = '?v=20170901';
const clientid = '&client_id=DAEVITOO0LDVKWQHKHHISOA4ZU31N2R4VVIALPEJSU2IEYRB';
const clientSecret = '&client_secret=OBJ1ZRWZOIYNHHVMSLVQYNXEXWHNAVI4W2DYIQ3PL2B32EF5';
const key = version + clientid + clientSecret;

var food = '4d4b7105d754a06374d81259'
var drinks = '4bf58dd8d48988d11a941735'
var hotels = '4bf58dd8d48988d1fa931735'
var landmarks = '4c38df4de52ce0d596b336e1'



let map;

$(function(){

    let center = [-36.8446152873055,174.76662397384644];
    map = L.map('map').setView(center,17);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

    var foodGroup = L.layerGroup().addTo(map);
    var drinksGroup = L.layerGroup().addTo(map);
    var hotelsGroup = L.layerGroup().addTo(map);
    var landmarksGroup = L.layerGroup().addTo(map);

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

    getVenues('-36.844720,174.766553',food,'scripts/plus-food.svg',foodGroup);
    getVenues('-36.844720,174.766553',drinks,'scripts/plus-drinks.svg',drinksGroup);
    getVenues('-36.844720,174.766553',hotels,'scripts/plus-hotels.svg',hotelsGroup);
    getVenues('-36.844720,174.766553',landmarks,'scripts/plus-landmarks.svg',landmarksGroup);

    $('.filter-icon.food').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(foodGroup)){
            map.removeLayer(foodGroup)
        }else{
            map.addLayer(foodGroup)
        }
    });

    $('.filter-icon.drinks').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(drinksGroup)){
            map.removeLayer(drinksGroup)
        }else{
            map.addLayer(drinksGroup)
        }
    });

    $('.filter-icon.hotels').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(hotelsGroup)){
            map.removeLayer(hotelsGroup)
        }else{
            map.addLayer(hotelsGroup)
        }
    });

    $('.filter-icon.landmarks').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(landmarksGroup)){
            map.removeLayer(landmarksGroup)
        }else{
            map.addLayer(landmarksGroup)
        }
    });



});

//Raj END Map Trial --------------------------------------------------------------

function getVenues(ll,section,icon,layerGroup){

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
                    iconSize:[30,30]
                })
                let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(layerGroup);

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
                            
                            // $('.modal-footer>.btn-primary').empty();
                            // $(+url+).appendTo('.modal-footer>.btn-primary');

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











