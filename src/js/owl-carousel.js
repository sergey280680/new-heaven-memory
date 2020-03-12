
$(document).ready(function () {
    $("#carousel1").owlCarousel({
        nav:true,
        margin:10,
        loop:true,
        autoWidth:true,
        dots:false,
        responsive:{
            0:{
                items:1
            },
            375:{
                items:2
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    });
});

