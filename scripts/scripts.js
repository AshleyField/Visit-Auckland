
$(function() {

    const version = '?v=20170901';
    const clientid = '&client_id=KAR4RSKFIVBU5BQIT2FPVIU0ME3LM0NJAQHT2DK4DJESTCMR';
    const clientSecret = '&client_secret=KL4HQQ5LAPM5MBJSIWS0GDHXPD4VLKZWV3BJAWINUXK4ZXCF';
    const key = version + clientid + clientSecret;

    var iconFood = '../assets/images/lightbluepin.svg';
    var iconDrinks = '../assets/images/darkbluepin.svg';
    var iconShop = '../assets/images/pinkpin.svg';
    var iconSight = '../assets/images/purplepin.svg';
    var iconUser = '../assets/images/user.svg';

    
    let map;
    let center = [-36.8446152873055,174.76662397384644];


    let userLatitude = 0;
    let userLongitude = 0;


    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {
            userLatitude  = position.coords.latitude;
            userLongitude = position.coords.longitude;

            // Add marker to the map
            console.log(userLongitude,userLatitude);

            let icon = L.icon({iconUrl:iconUser, iconSize:[60,60]});

            let marker = L.marker({lat:userLatitude,lng:userLongitude},{icon:icon}).addTo(map);


        });

    } 
    else { 
        console.log('cannot access location');
    }
    




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


    map = L.map('map',{scrollWheelZoom:false}).setView(center,17);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

    var foodGroup = L.layerGroup().addTo(map);
    var shopGroup = L.layerGroup().addTo(map);



    getVenues('food',iconFood,foodGroup);
    // getVenues('drinks',iconDrinks);
    getVenues('shops',iconShop,shopGroup);
    // getVenues('sights',iconSight);

    getTrending();



    // if already clicked and unclicked( remove layer from map)
    $('.filter-icon.food').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(foodGroup)){
            map.removeLayer(foodGroup)
        }else{
            map.addLayer(foodGroup)
        }
    })



    

    function getVenues(section, icon, layerGroup) {


        var exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&section='+section+'&ll=-36.8446152873055,174.76662397384644';

        $.ajax({
        url:exploreUrl,
        dataType:'jsonp',
            success:function(res){
                var data = res.response.groups["0"].items;

                // console.log(data);

                //  map data to a simpler venues format

                var venues = _(data).map(function(item){ // this function is to transform each item into smaller pieces of data. these items/venues have alot of data 
                //in the console. Also called mapping data
                // console.log(item);

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


                    // var iconImage = '../assets/images/darkbluepin.svg'; //default marker


                    let foodIcon = L.icon({
                        iconUrl:icon,
                        iconSize:[60,60]

                    });
                     
                    let marker = L.marker(venue.latlng,{icon:foodIcon}).addTo(layerGroup);
                    marker.venueid = venue.venueid;

                    marker.on('click',function(){
                        let venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueid+key;
                        var website = '';

                        $.ajax({
                            url: 'https://api.foursquare.com/v2/venues/'+this.venueid+'/links'+key,
                            dataType: 'jsonp',
                            success:function(res) {

                                // if (res.meta.code !== '200') {
                                //     alert('Message from FourSquare : ' + res.meta.errorDetail);
                                //     return;
                                // }

                                // console.log(res);
                            }

                        });

                        $.ajax({
                            url:venueUrl,
                            dataType:'jsonp',
                            success:function(res) {

                                // if (res.meta.code !== '200') {
                                //     alert('Message from FourSquare : ' + res.meta.errorDetail);
                                //     return;
                                // }
                                // console.log(res);

                                let markerHTML     = $('#templateMarker').text();
                                let markerTemplate = Template7(markerHTML).compile();


                                var venue = res.response.venue;


                                $('.modal-title').text(venue.name);
                                var photo = venue.bestPhoto; //find where to go from dom inspection
                                var source = photo.prefix+'300x300'+photo.suffix;
                                var contact = venue.contact.phone;
                                var address = venue.location.address;
                                var category = venue.categories.name;
                                var price = venue.price.message;

                                if(venue.hours){

                                    var weekHours = venue.hours.timeframes["0"].open["0"].renderedTime;
                                    var weekendHours = venue.hours.timeframes["1"].open["0"].renderedTime;
                                    var weekDays = venue.hours.timeframes["0"].days; 
                                    var weekendDays = venue.hours.timeframes["1"].days;   

                                }else{
                                    var hours = 'not available';
                                }
                                
                                // var hours = venue.popular.isOpen ? venue.popular.isOpen : false ;
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
                                // console.log(output);

                                $('.marker-container').empty();
                                $('.marker-container').append(output);

                                $('#venueModal').modal('show');
                            }
                        });


                    });
                });
            
            } // success

        }); //ajax

    } //getVenues

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

                

   
            
            } // success

        }); //ajax

    }//get trending



});

 












