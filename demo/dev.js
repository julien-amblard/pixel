
import Pixel from "../src/"

var aThumbs = document.querySelectorAll('.w--thumbs-item');
var aPixel = [];


var init = function(){

	for (var i = 0; i < aThumbs.length; i++) {

		aPixel.push( new Pixel( aThumbs[i].querySelector('img'), {

			w : 7,
			preload : true
			
		}) );

	};

}

window.onload = init;
