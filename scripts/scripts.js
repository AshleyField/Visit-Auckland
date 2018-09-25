var directionsService;

$(function() {

    // foursquare variables
    const version = '?v=20170901';
    const clientid = '&client_id=I4T5YCBPQBF1JPJTLXJGCPUSXMVHA1M0IVUCXL2F5W2W24EO';
    const clientSecret = '&client_secret=TPDL20X3O3JGLNXMUSUL44BXRKB2AJ2JUZ5COJDTW43LY2YQ';
    const key = version + clientid + clientSecret;

    //icons
    var iconFood = 'assets/images/lightbluepin.svg';
    var iconDrinks = 'assets/images/darkbluepin.svg';
    var iconShop = 'assets/images/pinkpin.svg';
    var iconSight = 'assets/images/purplepin.svg';
    var iconUser = 'assets/images/user.svg';

    
    let map;
    let center = [-36.8446152873055,174.76662397384644];

    //used in directions
    let userLatitude = 0;
    let userLongitude = 0;


    // Open and close nav on mobile
    $('.bars').on('click', function(e) {

        var navData = $('.navigation').data('nav');

        e.stopPropagation();

        if (navData == 'close') {
            $('.navigation').addClass('nav-open')
                .data('nav', 'open');

            $('.bars>i').first().removeClass('fas fa-bars')
                .addClass('fas fa-times');

        } else {
            $('.navigation').removeClass('nav-open')
                .data('nav', 'close');
            $('.bars>i').removeClass('fas fa-times')
                .addClass('fas fa-bars');

        }
    }); 



    //login
    $('.login-button').on('click', function(e){
        e.preventDefault();
    });


    // Isotope masonry grid for popular section
    var $grid = $('.grid-bla').isotope({
	  
	   itemSelector: '.grid-item-bla',
	   percentPosition: true,
	   masonry: {
	    //column width set in CSS
	    columnWidth: '.grid-sizer-bla'

	   }

	});

    //menu highlight 

    var offset1 = $('.header').offset().top - 100;
    var offset2 = $('.popular').offset().top -100;
    var offset3 = $('.map-area').offset().top -100;
    var offset4 = $('.upcoming-events').offset().top -100;

    $(document).on('scroll',function(){
        var iScrollTop = $(document).scrollTop();

        var activeLi;

        if(iScrollTop>=offset1 && iScrollTop<offset2){
            activeLi = $('.desktop-nav>li:nth-child(1)>a');
        }
        if(iScrollTop>=offset2 && iScrollTop<offset3){
            activeLi = $('.desktop-nav>li:nth-child(2)>a');
        }
        if(iScrollTop>=offset3 && iScrollTop<offset4){
            activeLi = $('.desktop-nav>li:nth-child(3)>a');
        }
        if(iScrollTop>=offset4){
            activeLi = $('.desktop-nav>li:nth-child(4)>a');
        }
        activeLi.addClass('active');
        $('.desktop-nav>li>a').not(activeLi)
                                    .removeClass('active');


    });

    //sticky menu

    var menuOffset = $('.desktop-nav').offset();
    $(document).on('scroll',function(){

        var iScrollTop = $(document).scrollTop();
        if(iScrollTop > menuOffset.top){
            //fix it
            $('.desktop-nav').addClass('fixed');
            
        }else{
            //unfix it
            $('.desktop-nav').removeClass('fixed');
        }

    });


    //smooth scrolling
    $('[data-to]').on('click',function(e){
        e.preventDefault();

        var sTarget = $(this).data('to');
        var targetOffsetTop = $(sTarget).offset().top;

        $('html,body').animate({scrollTop:targetOffsetTop - 70},1000);

    });

    //leaflet - mapbox
    map = L.map('map',{scrollWheelZoom:false}).setView(center,17);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

    //filter layers
    var foodGroup = L.layerGroup().addTo(map);
    var shopGroup = L.layerGroup().addTo(map);
    var drinksGroup = L.layerGroup().addTo(map);
    var sitesGroup = L.layerGroup().addTo(map);


    //directions layer
    var directionGroup = L.layerGroup().addTo(map);


    getVenues('food',iconFood,foodGroup);
    getVenues('drinks',iconDrinks, drinksGroup);
    getVenues('shops',iconShop,shopGroup);
    getVenues('sights',iconSight, sitesGroup);


    //calling get trending function
    getTrending();

    //this is called event delegation below. When the star is not loaded in time we can set the onclick event
    //on the grid (as its always there) then the grid watches out for when the star is clicked on. This code wouldnt work in the trending function
    //beacuse it was applying the code every time a grid item loaded - each item would have a different number of click events running at the same time, 
    //so it would work on even numbers but not odd because it finihsed on removing the class. 
    $('.grid-bla').on('click','.fa-star',function() {
        
        $(this).toggleClass('liked');

    }); 

    //function to add extra info for popular venues
    if(window.outerWidth > 425) { // this is so that this piece of code doesnt run on a mobile

        $('.grid-bla').on('click','[data-for]',function() {
            var venueClass = $(this).data('for');
            $('.new-info').hide();
            $('.'+venueClass).show();
            
        }); // onclick button

        // highlight popular grid item

        $('.grid-bla').on('click','.fa-plus',function() {

            $('.fa-plus').parent().removeClass('hello');

            $(this).parent().addClass('hello');

        }); 
        
    }

    //filter
    // if already clicked and unclicked( remove layer from map)
    $('.filter-icon.food').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(foodGroup)){

            map.removeLayer(foodGroup);

        }else{

            map.addLayer(foodGroup);
        }

    });

    $('.filter-icon.shop').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(shopGroup)){

            map.removeLayer(shopGroup);

        }else{

            map.addLayer(shopGroup);
        }

    });

    $('.filter-icon.drinks').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(drinksGroup)){

            map.removeLayer(drinksGroup);

        }else{

            map.addLayer(drinksGroup);
        }

    });

    $('.filter-icon.sites').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(sitesGroup)){

            map.removeLayer(sitesGroup);

        }else{

            map.addLayer(sitesGroup);
        }
    });

    
    //function to get venues on map
    function getVenues(section, icon, layerGroup) {


        var exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&section='+section+'&ll=-36.8446152873055,174.76662397384644';

        $.ajax({
        url:exploreUrl,
        dataType:'jsonp',
            success:function(res){
                var data = res.response.groups["0"].items;

                //  map data to a simpler venues format

                var venues = _(data).map(function(item){ // this function is to transform each item into smaller pieces of data. these items/venues have alot of data 
                //in the console. Also called mapping data

                    return {
                        latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
                        name:item.venue.name,
                        venueid:item.venue.id,
                        category:item.venue.categories["0"].name,
                        address:item.venue.location
                    };

                });

                //loop list of venues and add a marker onto the map
                _(venues).each(function(venue){


                    let foodIcon = L.icon({
                        iconUrl:icon,
                        iconSize:[60,60]

                    });

                    //creating map markers
                    let marker = L.marker(venue.latlng,{icon:foodIcon}).addTo(layerGroup);
                    marker.venueid = venue.venueid;

                    marker.on('click',function(){

                        var currentMarker = this;
                        let venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueid+key;


                        $.ajax({
                            url: 'https://api.foursquare.com/v2/venues/'+this.venueid+'/links'+key,
                            dataType: 'jsonp',
                            success:function(res) {

                            }

                        });

                        $.ajax({
                            url:venueUrl,
                            dataType:'jsonp',
                            success:function(res) {

                                let markerHTML     = $('#templateMarker').text();
                                let markerTemplate = Template7(markerHTML).compile();


                                var venue = res.response.venue;


                                $('.modal-title').text(venue.name);
                                var photo = venue.bestPhoto; 

                                var source = '';
                                if (photo) {
                                    source = photo.prefix+'300x300'+photo.suffix;
                                }
                          

                                var address = venue.location.address;

                                var price = 'not available';

                                if (venue.price) {

                                    price = venue.price.message;  
                                } 
                                
                                var hours = '';
                                var weekHours = '';
                                var weekendHours = '';
                                var weekDays = '';
                                var weekendDays = '';

                                if (venue.hours) {

                                    weekHours = venue.hours.timeframes["0"].open["0"].renderedTime;
                                    weekendHours = venue.hours.timeframes["1"] ? venue.hours.timeframes["1"].open["0"].renderedTime : '';
                                    weekDays = venue.hours.timeframes["0"].days; 
                                    weekendDays = venue.hours.timeframes["1"] ? venue.hours.timeframes["1"].days : '';   

                                } else {

                                    hours = 'not available';
                                }
                                

                                var website = venue.url ? venue.url : false ;

                                var output = markerTemplate({
                                    photo: source,
                                    name:venue.name,
                                    address:address,
                                    website:website,
                                    weekDays:weekDays,
                                    weekendDays:weekendDays,
                                    weekHours:weekHours,
                                    weekendHours:weekendHours,
                                    price:price,
                                    hours:hours,
                                });


                                $('.marker-container').empty();
                                $('.marker-container').append(output);

                                $('#venueModal').modal('show');

                                //get directions
                                $('.directions').click(function(){

                                    //getting users position
                                    if (navigator.geolocation) {

                                        navigator.geolocation.getCurrentPosition(function(position) {
                                            userLatitude  = position.coords.latitude;
                                            userLongitude = position.coords.longitude;

                                            // Add marker to the map

                                            let icon = L.icon({iconUrl:iconUser, iconSize:[60,60]});

                                            var currentPosition = {lat:userLatitude,lng:userLongitude};
                                            
                                            L.marker(currentPosition,{icon:icon}).addTo(map);


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
                                                        return {lat:point.lat(),lng:point.lng()};
                                                    });
                                                    var polyline = L.polyline(path, {color: '#0B132B'});

                                                    directionGroup.clearLayers();
                                                    polyline.addTo(directionGroup); 

                                                }
                                            });

                                        });

                                    } 
                                    else { 
                                        alert('cannot access location');
                                    }

                                });//button on click

                            }//success

                        });//ajax  

                    });//marker on click

                });//venues loop
            
            } // success

        }); //ajax

    } //getVenues

    //function to populate popular section
    function getTrending(){

        let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll=-36.8446152873055,174.76662397384644&limit=9';

        $.ajax({
            url:exploreUrl,
            dataType:'jsonp',
            success:function(res){

                let popularHTML = $('#templatePopular').text();
                let popularTemplate = Template7(popularHTML).compile();

                let infoHTML = $('#templateInfo').text();
                let infoTemplate = Template7(infoHTML).compile();

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

                            var venue = res.response.venue;


                            var weekHours;
                            var weekendHours;
                            var weekDays;
                            var weekendDays;
                            var hours;


                            if(venue.hours){

                                weekHours = venue.hours.timeframes["0"].open["0"].renderedTime;
                                weekendHours = venue.hours.timeframes["1"] ? venue.hours.timeframes["1"].open["0"].renderedTime : '';
                                weekDays = venue.hours.timeframes["0"].days; 
                                weekendDays = venue.hours.timeframes["1"] ? venue.hours.timeframes["1"].days : '';   

                            }else{
                                hours = 'not available';
                            }


                            venue.hours = hours;
                            venue.weekHours = weekHours;
                            venue.weekendHours = weekendHours;
                            venue.weekDays = weekDays;
                            venue.weekendDays = weekendDays;

                            let outputInfo = infoTemplate(venue);
                                
                            var templateInfo= $(outputInfo);
                            $('.new-info-container').append(templateInfo);

                        }//success


                    });//ajax


                });//loop
   
            
            } // success

        }); //ajax


    }//get trending



}); //ready function

//google init map function
function initMap(){

    directionsService = new google.maps.DirectionsService();
    
}












