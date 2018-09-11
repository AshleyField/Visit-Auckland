
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


    //------------------starting map javascript


    // mapboxgl.accessToken = 'pk.eyJ1IjoibWx5MDIyMyIsImEiOiJjamxuNGc5Zm8xZjdyM2twaGpsa3E2cnRmIn0.YC9jrYJYIQWj25EF4Wn3Zg';
    // const map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mly0223/cjln4h5eu5wca2snqpippvx3f',
    //     center: [174.767164, -36.851146],
    //     zoom: 15
    // });

    const version = '?v=20170901';
    const clientid = '&client_id=NMXJZAHXRWHSYSLXYGNJC4032TRUV1BJMGJ5KGNKN3QXVSRI';
    const clientSecret = '&client_secret=BQ1G5KHZAHTXNISQU4HDDXVNRYB4BL0AAKTLDTFXM0F10N10';
    const key = version + clientid + clientSecret;

    $(function(){

        let center = [-36.8446152873055,174.76662397384644];
        let map = L.map('map').setView(center,17);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

        let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&limit=50&ll=-36.8446152873055,174.76662397384644';

        $.ajax({
        url:exploreUrl,
        dataType:'jsonp',
            success:function(res){
                var data = res.response.groups["0"].items;

                // console.log(data);

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

                console.log(venues);

                //loop list of venues and add a marker onto the map
                _(venues).each(function(venue){

                   

                    var iconImage = '../assets/images/food.svg'; //default marker

                    if(venue.category == 'cafe'){

                         var iconImage = '../assets/images/location.svg';
                    }

                    if(venue.category == 'bar'){

                         var iconImage = '../assets/images/food.svg';
                    }
                    if(venue.category == 'Hotel'){

                         var iconImage = '../assets/images/location.svg';
                    }

                    let foodIcon = L.icon({
                        iconUrl:iconImage,
                        iconSize:[30,30]

                    });
                     
                    let marker = L.marker(venue.latlng,{icon:foodIcon}).addTo(map);
                    // marker.venueid = venue.venueid;  

                    
                });

                
                // let marker = L.marker(venue.latlng,).addTo(map);
               

            
            }

        });

    });


});












