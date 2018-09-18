var venueArray = [];
// var filteredArray = [];
var map;
var markerLayer;
var restaurantCategories = ["Indian Restaurant", "Food Court", "Japanese Restaurant", "Australian Restaurant", "Pizza Place", "Vegetarian / Vegan Restaurant", "Restaurant", "Steakhouse", "Vietnamese Restaurant", "Seafood Restaurant", "Mexican Restaurant", "Asian Restaurant", "Sushi Restaurant", "Middle Eastern Restaurant", "Noodle House", "Cajun / Creole Restaurant", "French Restaurant", "Italian Restaurant", "Modern European Restaurant"]

//Initiate leaflet key

var version = '?v=20170901';
var clientid = '&client_id=1C3ZIZUJZDFCWZPWN1NS4F3RUBALGDNH5HUFLVSNKISZOABA';
var clientSecret = '&client_secret=11SXOUY3WXTWN1HJJ00NIU22UCV2WRLW33DOLZWUNQVKLIHK';
var key = version + clientid + clientSecret;

var popupHTML = $('#templatePopup').text();
var popupTemplate = Template7(popupHTML).compile();

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

    // masonry grid for popular section

    var $grid = $('.grid-bla').isotope({
      
      itemSelector: '.grid-item-bla',
      percentPosition: true,
      masonry: {
        //column width set in CSS
        columnWidth: '.grid-sizer-bla'

      }
    });

    //Insert mapbox styles

    var center = {lat: -36.842770,lng: 174.766930};

    map = L.map('map', {scrollWheelZoom: false}).setView(center,17);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYXNoZXlmaWVsZCIsImEiOiJjamtrZXlvNnMwZTg3M3FwYzAxbGNqYTA4In0.AyMC7APOvh72_Q2evO5VTQ').addTo(map);

    markerLayer = new L.LayerGroup().addTo(map);
    //Initalise foursquare

    let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+ key +'&limit=100&ll=-36.8446152873055,174.76662397384644'

    if(venueArray.length == 0){

        console.log("Ajax request initiated")

        $.ajax({
            url: exploreUrl,
            dataType: 'jsonp',
            success: function(res){

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
            }

        })

    }

    $('.map-filter-row').on('click', function(){
        markerLayer.clearLayers();

        var clickedFilter = $(this).data('category');

        displayFilteredVenue(clickedFilter)
    });

    function getTrending(){

        console.log('Called Get Trending');

        let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll=-36.8446152873055,174.76662397384644&limit=9';

        $.ajax({
            url:exploreUrl,
            dataType:'jsonp',
            success:function(res){

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

    getTrending();

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

});

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

    console.log('Display Venues Called')

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
                    console.log(res);
                    console.log(res.response.venue.categories["0"].name);

                    var venuePhoto = res.response.venue.bestPhoto.prefix + '200x200' + res.response.venue.bestPhoto.suffix

                    var data = {venuePhoto:venuePhoto,res:res};
                    console.log(data);
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