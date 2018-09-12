
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

    //masonry grid for popular section

    var $grid = $('.grid-bla').isotope({
	  
	  itemSelector: '.grid-item-bla',
	  percentPosition: true,
	  masonry: {
	    //column width set in CSS
	    columnWidth: '.grid-sizer-bla'

	  }
	});

    //Initiate leaflet key

    const version = '?v=20170901';
    const clientid = '&client_id=1C3ZIZUJZDFCWZPWN1NS4F3RUBALGDNH5HUFLVSNKISZOABA';
    const clientSecret = '&client_secret=11SXOUY3WXTWN1HJJ00NIU22UCV2WRLW33DOLZWUNQVKLIHK';
    const key = version + clientid + clientSecret;


    //Insert mapbox styles

    var center = {lat: -36.842770,lng: 174.766930};

    var map = L.map('map', {scrollWheelZoom: false}).setView(center,17);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYXNoZXlmaWVsZCIsImEiOiJjamtrZXlvNnMwZTg3M3FwYzAxbGNqYTA4In0.AyMC7APOvh72_Q2evO5VTQ').addTo(map);

    //Initalise foursquare

    let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+ key +'&limit=100&ll=-36.8446152873055,174.76662397384644'

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

            // console.log(data);
            // console.log(venues);

            var icon = '';

            var foundCategory;

            var restaurantCategories = ["Indian Restaurant", "Food Court", "Japanese Restaurant", "Australian Restaurant", "Pizza Place", "Vegetarian / Vegan Restaurant", "Restaurant", "Steakhouse", "Vietnamese Restaurant", "Seafood Restaurant", "Mexican Restaurant"]

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

                else if (venue.category == "Cocktail Bar" || venue.category == "Brewery"){
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

                else if (foundCategory == false){
                    for(var i = 0; i < restaurantCategories.length; i++){
                        if(venue.category == restaurantCategories[i]){
                            icon = 'foodIcon';
                            foundCategory = true;
                        }
                    }
                }

                else if (foundCategory == false){
                    icon = 'locationIcon';
                    foundCategory = true;
                }

                console.log(icon);


                let venueIcon = L.icon({
                    iconUrl: '../assets/icons/' + icon + '.svg',
                    iconSize: [30,30]
                });

                let marker = L.marker(venue.latlng, {icon: venueIcon}).addTo(map);
                marker.venueid = venue.venueid

                marker.on('click', function(){
                    var venueUrl = 'https://api.foursquare.com/v2/venues/'+ this.venueid + key;

                    $.ajax({
                        url: venueUrl,
                        dataType: 'jsonp',
                        success: function(res){
                            console.log(res);
                            console.log(res.response.venue.categories["0"].name);
                        }
                    })
                });
            })
        }
    })

});


