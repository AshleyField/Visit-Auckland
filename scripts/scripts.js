//Create a global array for venues
var venueArray = [];

//Global map vairable
var map;

//Gloval marker layer vairable
var markerLayer;

//Global array for filtering the restaurat category
var restaurantCategories = ["Indian Restaurant", "Food Court", "Japanese Restaurant", "Australian Restaurant", "Pizza Place", "Vegetarian / Vegan Restaurant", "Restaurant", "Steakhouse", "Vietnamese Restaurant", "Seafood Restaurant", "Mexican Restaurant", "Asian Restaurant", "Sushi Restaurant", "Middle Eastern Restaurant", "Noodle House", "Cajun / Creole Restaurant", "French Restaurant", "Italian Restaurant", "Modern European Restaurant"]

//Initiate leaflet key globally
var version = '?v=20170901';
var clientid = '&client_id=JHRWMJORB0NT2B1SVIAWAT5UUKGL1SPEGSH1P5SSPLL513JH';
var clientSecret = '&client_secret=O0JUJBTFDBLZY2AEGGTBTP312032WGNOVHVTK2PTCZRM05HH';
var key = version + clientid + clientSecret;

//Define Template7 for map tooltip popup
var popupHTML = $('#templatePopup').text();
var popupTemplate = Template7(popupHTML).compile();

//Global Google Maps DirectionService vairable
var directionsService

var $grid;

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

    //Prevent login button from refreshing the page.
    
    $('.login-button').on('click', function(e){
        e.preventDefault();
    });

    //Masonry grid for popular section

    $grid = $('.grid-bla').isotope({
      
      itemSelector: '.grid-item-bla',
      percentPosition: true,
      masonry: {
        //Column width set in CSS
        columnWidth: '.grid-sizer-bla'

      }
    });

    //Define center of map and initial zoom
    var center = {lat: -36.842770,lng: 174.766930};

    map = L.map('map', {scrollWheelZoom: false}).setView(center,17);

    //Insert mapbox styles
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYXNoZXlmaWVsZCIsImEiOiJjamtrZXlvNnMwZTg3M3FwYzAxbGNqYTA4In0.AyMC7APOvh72_Q2evO5VTQ').addTo(map);

    //Create layer groups to add items to
    markerLayer = new L.LayerGroup().addTo(map);
    directionGroup = new L.LayerGroup().addTo(map);

    //Initalise foursquare and store all data in venueArray

    let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+ key +'&limit=100&ll=-36.8446152873055,174.76662397384644'

    if(venueArray.length == 0){

        console.log("Called initial Ajax request")

        $.ajax({
            url: exploreUrl,
            dataType: 'jsonp',
            success: function(res){ //If the request is sucessful loop through the data and insert into the venueArray

                var data = res.response.groups["0"].items;

                var venues = _(data).map(function(item){

                    return {
                        latlng: {lat: item.venue.location.lat, lng: item.venue.location.lng},
                        name: item.venue.name,
                        venueid: item.venue.id,
                        category: item.venue.categories['0'].name

                    }
                });

                venueArray = venues;

                displayVenues(venueArray);

                getTrending(venueArray);
            }

        })

    }

    $('.map-filter-row').on('click', function(){
        markerLayer.clearLayers();

        var clickedFilter = $(this).data('category');

        displayFilteredVenue(clickedFilter)
    });

    $('#grid-container').on('click','.fa-star', function(){

        console.log('Star Clicked');

        var clickedStar = $(this).data('star');

        if(clickedStar == "inactive"){
            $(this).css('color', '#FFD800')
                    .data('star', 'active');
        }

        else {
            $(this).css('color', '#212529')
                    .data('star', 'inactive');
        }
    });

    $('.map-area').on('click', '.get-directions', function(){
        var lat = $(this).data('lat');
        var lng = $(this).data('lng');

        getDirections(lat,lng)
    });

    //On click of a navigation menu item scroll to the correct section

    $('nav a').on('click', function(e){
        e.preventDefault();
       let toLocation = $(this).data('to');
       smoothScroll(toLocation);
        
    });

    //On click of hero map button smooth scroll to map

    $('.hero-button').on('click', function(e){
        e.preventDefault()
        smoothScroll('.map-area')
    })
    
    //On click of footer links smooth scroll

    $('.footer-page-links li').on('click', function(){
        let toLocation = $(this).data('to');

        smoothScroll(toLocation);
    })
});

function getTrending(venueArray){

    console.log('Called Get Trending');

    let popularHTML = $('#templatePopular').text();
    let popularTemplate = Template7(popularHTML).compile();

    _(venueArray).each(function(item,i){
        if(i<50){

        
            let venueid = item.venueid;
            let venueUrl = 'https://api.foursquare.com/v2/venues/'+venueid+key;
            $.ajax({
                url: venueUrl,
                success:function(res){
                    
                    let output = popularTemplate(res.response.venue);
                    
                    var gridItem = $(output);

                    $grid.append(gridItem)
                    .isotope('appended', gridItem);

                    $grid.isotope({
                        filter: ':nth-child(-n+10)'
                    });

                }
            });
        }
    });
}

function smoothScroll(dataTo){
    if((dataTo != "home") && (dataTo != "login")){
        $('html, body').animate({
            scrollTop: $(dataTo).offset().top
        }, 800, function(){

            console.log('scrolled');
        });
    }

    else if(dataTo == "home"){
        window.location.replace("/")
    }
}

function displayFilteredVenue(filter){
    
    var filteredArray = _(venueArray).filter(function(venue){

        if(filter == "Restaurant"){

            return restaurantCategories.indexOf(venue.category) != -1;
        }

        else if (filter == "All"){
            return venueArray;
        }

        else if (filter == "Cafe"){
            return (venue.category == "Coffee Shop") || (venue.category == "Café");
        }

        else if (filter == "Bars"){
            return (venue.category == "Cocktail Bar") || (venue.category == 'Brewery') || (venue.category == "Bar")
        }

        else {

            return venue.category == filter;
        }

    });

    displayVenues(filteredArray);

}

function displayVenues(venues){

    console.log('Called Display Venues')

    var icon = '';

    var foundCategory;

    markerLayer.clearLayers();

    _(venues).each(function(venue){

        var foundCategory = false;


        if(venue.category == "Park"){
            icon = 'parkIcon';
            foundCategory = true;
        }

        else if (venue.category == "Hotel"){
            icon = 'hotelIcon';
            foundCategory = true;
        }

        else if(venue.category == "Gym"){
            icon = 'gymIcon';
            foundCategory = true;
        }

        else if (venue.category == "Cocktail Bar" || venue.category == "Brewery" || venue.category == "Bar"){
            icon = 'barIcon';
            foundCategory = true;
        }

        else if (venue.category == "Coffee Shop" || venue.category == "Café"){
            icon = 'coffeeIcon';
            foundCategory = true;
        }

        else if (venue.category == "Dessert Shop" || venue.category == "Ice Cream Shop"){
            icon = 'dessertIcon';
            foundCategory = true;
        }

        else if (venue.category == "Burger Joint"){
            icon = 'burgerIcon';
            foundCategory = true;
        }
        else if (restaurantCategories.indexOf(venue.category) != -1 ){
            icon = 'foodIcon';
            foundCategory = true;
        }
        else {
            icon = 'locationIcon';
            foundCategory = true;
        }

        let venueIcon = L.icon({
            iconUrl: '../assets/icons/' + icon + '.svg',
            iconSize: [30,30]
        });



        let marker = L.marker(venue.latlng, {icon: venueIcon}).addTo(markerLayer);
        marker.venueid = venue.venueid

        marker.on('click', function(){
            var venueUrl = 'https://api.foursquare.com/v2/venues/'+ this.venueid + key;

            $.ajax({
                url: venueUrl,
                dataType: 'jsonp',
                success: function(res){

                    console.log(res)

                    var venuePhoto = res.response.venue.bestPhoto.prefix + '200x200' + res.response.venue.bestPhoto.suffix

                    var data = {venuePhoto:venuePhoto,res:res};
                    var output = popupTemplate(data)

                    var popupContent = L.popup()
                        .setLatLng(venue.latlng)
                        .setContent(output)
                        .openOn(map);

                    marker.bindPopup(popupContent).openPopup();

                }
            })
        });
    })
}

function initMap(){
    directionsService = new google.maps.DirectionsService;
    //create a request for directions
}

function getDirections(lat,lng){

    directionGroup.clearLayers();

    var polyline

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {
            userLatitude  = position.coords.latitude;
            userLongitude = position.coords.longitude;

            // Add user marker to the map

            let icon = L.icon({iconUrl:'../assets/icons/youIcon.svg', iconSize:[30,30]});

            var currentPosition = {lat:userLatitude,lng:userLongitude};
            let marker = L.marker(currentPosition,{icon:icon}).addTo(map);

            var request = {
              origin: currentPosition,
              destination: {lat: lat, lng: lng},
              travelMode: 'DRIVING'
            };

            //ask directionsService to fulfill your request
            directionsService.route(request,function(response,status){

                var path = response.routes["0"].overview_path;

                var polyline = _(path).map(function(item){
                    return {lat:item.lat(),lng:item.lng()};
                });

                L.polyline(polyline,{
                    color:'tomato',
                    weight:5
                }).addTo(directionGroup);
            });
        });
    }

    else { 
        console.log('cannot access location');
    }
}