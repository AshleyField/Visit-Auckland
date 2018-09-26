


$(function() {

    // Open and close nav on mobile ------------------------------
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


    
    $('.login-button').on('click', function(e){
        e.preventDefault();
    });

    //-----------------------------------------------------------

    // masonry grid for popular section -------------------------
    var $grid = $('.grid-bla').isotope({
      
      itemSelector: '.grid-item-bla',
      percentPosition: true,
      masonry: {
        //column width set in CSS
        columnWidth: '.grid-sizer-bla'

      }
    });
    //-----------------------------------------------------------

    //-----------------------------------------------------------

    $(function() {
    
    getTrending();

    function getTrending(){
        let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll=-36.8446152873055,174.76662397384644&limit=9';
        console.log(exploreUrl);
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
    });

    //--------------------------------------------------------------------------

    // var offset1 = $('.section1').offset().top;
    var offset2 = $('.section2').offset().top;
    var offset3 = $('.section3').offset().top;
    var offset4 = $('.section4').offset().top;

    //sticky menu---------------------------------------------------------------

    var menuOffset = $('.pure-menu-horizontal').offset();
    $(document).on('scroll',function(){

        var iScrollTop = $(document).scrollTop();
   

        if(iScrollTop > menuOffset.top){
            //fix it
            $('.pure-menu-horizontal').addClass('fixed');
        }else{
            //unfix it
            $('.pure-menu-horizontal').removeClass('fixed');

        }

        if(iScrollTop > offset2 + -100){

            $('.pure-menu-horizontal').addClass('background-fixed');
        }else{
            $('.pure-menu-horizontal').removeClass('background-fixed');
        }

        if(iScrollTop > offset2 + -0){

            $('.fa-bars').addClass('bars-fixed');
        }else{
            $('.fa-bars').removeClass('bars-fixed');
        }
    });

    //-------------------------------------------------------------------------

    //Sections scrolling highlight---------------------------------------------
    $(document).on('scroll',function(){
        var iScrollTop = $(document).scrollTop();

        var activeLi;

        var iScrollTopWithAdjustment = iScrollTop + 10;
        
        if(iScrollTopWithAdjustment<offset2){
            activeLi = $('.pure-menu-list>li:nth-child(1)');
        }

        if(iScrollTopWithAdjustment>=offset2 && iScrollTopWithAdjustment<offset3){
            activeLi = $('.pure-menu-list>li:nth-child(2)');
        }

        if(iScrollTopWithAdjustment>=offset3 && iScrollTopWithAdjustment<(offset4)){
            activeLi = $('.pure-menu-list>li:nth-child(3)');
        }

        if(iScrollTopWithAdjustment>= (offset4)){
            activeLi = $('.pure-menu-list>li:nth-child(4)');
        }

        activeLi.addClass('active');
        $('.pure-menu-list>li').not(activeLi).removeClass('active');
    });
    //-------------------------------------------------------------------------

    //smooth scrolling---------------------------------------------------------

    $('a[data-to]').on('click',function(e){
        e.preventDefault();

        var sTarget = $(this).data('to');
        var targetOffsetTop = $(sTarget).offset().top;

        $('html,body').animate({scrollTop:targetOffsetTop},1000);
    });

    $('h1.animated').addClass('invisible');

    //-------------------------------------------------------------------------
});

//Raj Map START --------------------------------------------------------------

const version = '?v=20170901';
const clientid = '&client_id=H2QZGKM3QVJB2PCW1JREIEJJMRBL1QXZOYIYWGRFDABW4E4Y';
const clientSecret = '&client_secret=GYCB1CW24L0HLFKGOFIHCKOLYZQPVI3ZKDLKE5O3QHCTWGI2';
const key = version + clientid + clientSecret;

var food = '4d4b7105d754a06374d81259';
var drinks = '4bf58dd8d48988d11a941735';
var hotels = '4bf58dd8d48988d1fa931735';
var landmarks = '4d4b7104d754a06370d81259';

let map;

$(function(){

    let center = [-36.8446152873055,174.76662397384644];
    map = L.map('map',{
        scrollWheelZoom:false,
    }).setView(center,17);
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

    getVenues('-36.844720,174.766553',food,'scripts/plus-food.svg',foodGroup);
    getVenues('-36.844720,174.766553',drinks,'scripts/plus-drinks.svg',drinksGroup);
    getVenues('-36.844720,174.766553',hotels,'scripts/plus-hotels.svg',hotelsGroup);
    getVenues('-36.844720,174.766553',landmarks,'scripts/plus-landmarks.svg',landmarksGroup);

    $('.filter-icon.food').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(foodGroup)){
            map.removeLayer(foodGroup);
        }else{
            map.addLayer(foodGroup);
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

    $('.filter-icon.hotels').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(hotelsGroup)){
            map.removeLayer(hotelsGroup);
        }else{
            map.addLayer(hotelsGroup);
        }
    });

    $('.filter-icon.landmarks').on('click',function(e){
        e.preventDefault();

        if(map.hasLayer(landmarksGroup)){
            map.removeLayer(landmarksGroup);
        }else{
            map.addLayer(landmarksGroup);
        }
    });
});

function getVenues(ll,section,icon,layerGroup){

    //Explore venues -- foursquare api

    let searchUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&categoryId='+section+'&limit=20&radius=500&ll='+ll;

    console.log(searchUrl);

    $.ajax({
        url:searchUrl,
        datatype:'jsonp',
        success: function(res){
            var data = res.response.groups["0"].items;

            var venues = _(data).map(function(item){

                return {
                    latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
                    name:item.venue.name,
                    venueid:item.venue.id,

                };

            });

            _(venues).each(function(venue){
                let venueIcon = L.icon({
                    iconUrl:icon,
                    iconSize:[30,30]
                });
                let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(layerGroup);

                marker.venueid = venue.venueid;
            
                marker.on('click',function(){
                    var venueUrl = 'https://api.foursquare.com/v2/venues/'+
                    this.venueid+key;

                    $.ajax({
                        url:venueUrl,
                        dataType:'jsonp',
                        success:function(res){
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

                            var directionsUrl = 'https://www.google.com/maps/dir/Current+Location/'+venue.location.lat+','+venue.location.lng;
                            $('.get-directions').attr('href',directionsUrl);               

                            if(venue.url){
                                $('.website-url').attr('href',venue.url);
                            }
                            $('#venueModal').modal('show');
                        }
                    });  
                });
            });
        }
    });    
}

//Raj END Map Trial --------------------------------------------------------------














