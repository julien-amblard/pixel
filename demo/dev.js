import Pixels from "../src/"
const imgs = [...document.querySelectorAll(".item img")]
imgs.map( o => {
	new Pixels(o, {
		onUpdate: () => console.log( "update" ),
		size: 15
	})
})
// trolol.start()
// import Pixel from "../src/"

// var aThumbs = document.querySelectorAll('.item');
// var aPixel = [];


// var init = function(){

// 	for (var i = 0; i < aThumbs.length; i++) {

// 		aPixel.push( new Pixel( aThumbs[i].querySelector('img'), {

// 			w : 10,
// 			preload : true
			
// 		}) );

// 	};

// }

// window.onload = init;
