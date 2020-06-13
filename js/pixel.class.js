var Pixel = function( _o, _options ){

	this.settings 		= {

		w 		: 	5,
		
		trace 	: 0.1, 
		
		addClass : true,
		
		aClass  : [

					'_top',
					'_right',
					'_bottom',
					'_left'
		],

		wave : {

			w : 10,
			speed : 5

		},

		preload : false
	};


	this.img 			= {};
	this.canvas;
	this.ctx;
	this.aPixels 		= [];
	this.iCell 			= 0;
	this.iRow 			= 0;
	this.bRuning 		= false;
	this.wave 			= {

		x : 0,
		y : 0,
		r : 0,
		w : 0,
		s : 0
	}
	this.aWaves = [];

	

	

	Pixel.prototype.init = function()
	{	

		this.getSettings();
		this.buildCanvas();
		this.buildPixels();
		this.drawImg();	

		if( this.settings.preload )
			this.getColors();

		this.img.o.style.display = 'none';

	};

	Pixel.prototype.getSettings = function()
	{

		for (var attr in _options) { 
			this.settings[attr] = _options[attr]; 
		}

		this.img 			= {
			o 	: _o,
			sw 	: _o.naturalWidth,
			sh 	: _o.naturalHeight,
			h 	: _o.height,
			w 	: _o.width,
			x 	: _o.offsetLeft,
			y 	: _o.offsetTop
		};

		this.wave.w = -this.settings.wave.w;
		this.wave.s = this.settings.wave.speed;

	};

	Pixel.prototype.buildCanvas = function()
	{

		this.canvas 		= document.createElement('canvas');
		this.canvas.width 	= this.img.w;
		this.canvas.height 	= this.img.h;
		this.ctx 			= this.canvas.getContext('2d');
		this.img.o.parentNode.appendChild( this.canvas );

		this.bindEvent();

	};

	Pixel.prototype.buildPixels = function()
	{

		this.iCell = Math.floor( this.img.w / this.settings.w );
		this.iRow = Math.floor( this.img.h / this.settings.w );
		this.aPixels = [];

	    for (var r = 0; r <= this.iRow; r++) {

			this.aPixels[ r ] = [];
			
			for (var c = 0; c <= this.iCell; c++) {

				this.aPixels[ r ][ c ] = {
					x : c * this.settings.w,
					y : r * this.settings.w,
					c : false,
					a : 1
				};

			};
			
		};

	};































	Pixel.prototype.getColors = function(){

		for (var r = 0; r <= this.iRow; r++) {
			for (var c = 0; c <= this.iCell; c++) {
				if( !this.aPixels[r][c].c )
					this.aPixels[r][c].c = this.getColor( this.aPixels[r][c] );
			};
		};

	}

	Pixel.prototype.getColor = function( obj )
	{	

		var  pixels = this.ctx.getImageData( obj.x, obj.y, this.settings.w, this.settings.w ).data;
		var  rgb = { r: 0, g: 0, b: 0};

		var i = 0;
		var count = 0;

		while ( (i += this.settings.w * 4) < pixels.length ) {
	        ++count;
	        rgb.r += pixels[i];
	        rgb.g += pixels[i+1];
	        rgb.b += pixels[i+2];
	    }
	    
	    // ~~ used to floor values
	    rgb.r = ~~(rgb.r/count);
	    rgb.g = ~~(rgb.g/count);
	    rgb.b = ~~(rgb.b/count);

		return rgb; 

	};



























	Pixel.prototype.bindEvent = function()
	{

		this.enter = this.launch.bind( this );
		this.canvas.addEventListener('mouseenter', this.enter);

		this.remove = this.out.bind( this );
		this.canvas.addEventListener('mouseleave', this.remove);

		this.move = this.updateDir.bind( this );
		this.canvas.addEventListener('mousemove', this.move);

		this.click = this.addWave.bind( this );
		this.canvas.addEventListener('click', this.click);
		
	};
	Pixel.prototype.clearEvent = function()
	{

		this.canvas.removeEventListener('mouseenter', this.enter);
		this.canvas.removeEventListener('mouseleave', this.remove);
		this.canvas.removeEventListener('mousemove', this.move);
		this.canvas.removeEventListener('click', this.click);
		
	};


	Pixel.prototype.launch = function()
	{

		if( this.settings.addClass )
			this.updateClass();
	
		if( !this.bRuning ){

			this.bRuning = true;
			this.run();

		}

	};

	Pixel.prototype.out = function()
	{

		this.dir = -1;
		this.removeClass();

	};

	Pixel.prototype.stop = function()
	{

		this.bRuning = false;

	};


	Pixel.prototype.run = function( e )
	{

		this.update();
		this.drawWave();

		if( this.bRuning ){

			var run = this.run.bind( this );
			requestAnimationFrame( run );

		}

	}














	Pixel.prototype.updateDir = function()
	{

		var d = this.getDir( event );

		if( this.dir != d ){

			this.dir = d;
			if( this.settings.addClass )
				this.updateClass();

			this.getAnim();
			
			if( !this.bRuning )
				this.launch();

		}

	}
	Pixel.prototype.getDir = function(e)
	{
		
		var po 	= this.canvas.getBoundingClientRect();
		var cx  = po.left + ( this.img.w / 2 );
		var cy  = po.top  + ( this.img.h / 2 );
		var x	= ( e.pageX - cx ) * ( this.img.w > this.img.h ? ( this.img.h / this.img.w ) : 1 );
		var y   = -( e.pageY - cy ) * ( this.img.h > this.img.w ? ( this.img.w / this.img.h ) : 1 );
		var d 	= Math.round( ( (Math.atan2(x,y) + Math.PI) / (Math.PI/2)) + 2 ) % 4;

		return d; 

	}





	Pixel.prototype.updateClass = function()
	{

		this.removeClass();
		if( typeof( this.settings.aClass[ this.dir ] ) != 'undefined' )
			this.canvas.parentNode.classList.add( this.settings.aClass[ this.dir ] );

	}

	Pixel.prototype.removeClass = function()
	{

		for (var i = 0; i < this.settings.aClass.length; i++) {

			this.canvas.parentNode.classList.remove( this.settings.aClass[i] );
		
		};

	}




	




	Pixel.prototype.checkWaves = function( x, y )
	{

		var bReturn = false;

		for (var i = this.aWaves.length - 1; i >= 0; i--) {

			if( this.checkWave( x, y, this.aWaves[i].x, this.aWaves[i].y, this.aWaves[i].r ) && !this.checkWave( x, y, this.aWaves[i].x, this.aWaves[i].y, this.aWaves[i].w ) )
				bReturn = true;

		};

		return bReturn;

	};


	Pixel.prototype.checkWave = function( x, y, cx, cy, cr )
	{

		var distX = Math.abs(cx - x-this.settings.w/2);
	    var distY = Math.abs(cy - y-this.settings.w/2);

	    if (distX > (this.settings.w/2 + cr)) { return false; }
	    if (distY > (this.settings.w/2 + cr)) { return false; }

	    if (distX <= (this.settings.w/2)) { return true; } 
	    if (distY <= (this.settings.w/2)) { return true; }

	    var dx=distX-this.settings.w/2;
	    var dy=distY-this.settings.w/2;
	    return (dx*dx+dy*dy<=(cr*cr));

	};

	Pixel.prototype.addWave = function(){

		this.animFromClick( event );

		if( !this.bRuning )
			this.launch();

	}

	Pixel.prototype.updateWave = function( i )
	{

		this.aWaves[i].r += this.aWaves[i].s;
		this.aWaves[i].w += this.aWaves[i].s;

		if( this.aWaves[i].w > this.aWaves[i].end )
			this.aWaves.splice( i, 1 );

	}



















	Pixel.prototype.update = function()
	{

		for (var i = this.aWaves.length - 1; i >= 0; i--) {
			
			this.updateWave( i );
		
		};

		if( this.aWaves.length == 0 )
			this.stop();

	};

	






























	Pixel.prototype.getAnim = function()
	{

		switch( this.dir ) {

			case 0:
				this.animFromT();
			break;

			case 1:
				this.animFromR();
			break;

			case 2:
				this.animFromB();
			break;

			case 3:
				this.animFromL();
			break;

		}

	};

	Pixel.prototype.animFromT = function(){

		var newWave = {

			x : this.canvas.width / 2,
			y : 0,
			r : 0,
			w : this.wave.w,
			s : this.wave.s,
			end : this.canvas.height * 1.3

		};

		this.aWaves.push( newWave );

	};


	Pixel.prototype.animFromR = function(){


		var newWave = {

			x : this.canvas.width,
			y : this.canvas.height / 2,
			r : 0,
			w : this.wave.w,
			s : this.wave.s,
			end : this.canvas.width * 1.3

		};

		this.aWaves.push( newWave );

	};


	Pixel.prototype.animFromB = function()
	{

		var newWave = {

			x : this.canvas.width / 2,
			y : this.canvas.height,
			r : 0,
			w : this.wave.w,
			s : this.wave.s,
			end : this.canvas.height * 1.3

		};

		this.aWaves.push( newWave );

	};


	Pixel.prototype.animFromL = function()
	{

		var newWave = {

			x : 0,
			y : this.canvas.height / 2,
			r : 0,
			w : this.wave.w,
			s : this.wave.s,
			end : this.canvas.width * 1.3

		};

		this.aWaves.push( newWave );

	};

	Pixel.prototype.animFromClick = function(e)
	{

		var newWave = {

			x : e.layerX,
			y : e.layerY,
			r : 0,
			w : this.wave.w,
			s : this.wave.s,
			end : this.canvas.width * 1.3

		};

		this.aWaves.push( newWave );

	};



	



















































	Pixel.prototype.drawWave = function()
	{

		this.ctx.globalAlpha = this.settings.trace;
		this.drawImg();
		this.ctx.globalAlpha = 1;

		for (var r = 0; r <= this.iRow; r++) {
			for (var c = 0; c <= this.iCell; c++) {

				var p = this.aPixels[ r ][ c ];

				if( this.checkWaves( p.x, p.y ) )
					this.drawPixel( r, c );

			};
		};

	};




	Pixel.prototype.drawAll = function() 
	{

		this.drawImg();
		this.drawAllPixel();

	};

	Pixel.prototype.drawImg = function()
	{

		this.ctx.drawImage( 
			this.img.o, 				//Specifies the image, canvas, or video element to use
			0, 							//The x coordinate where to start clipping
			0, 							//The y coordinate where to start clipping
			this.img.sw, 				//The width of the clipped image
			this.img.sh, 				//The height of the clipped image
			this.img.x, 				//The x coordinate where to place the image on the canvas
			this.img.y, 				//The y coordinate where to place the image on the canvas
			this.img.w, 				//The width of the image to use (stretch or reduce the image)
			this.img.h  				//The height of the image to use (stretch or reduce the image)
		);

	};

	Pixel.prototype.drawAllPixel = function() 
	{

		for (var r = 0; r <= this.iRow; r++) {
			for (var c = 0; c <= this.iCell; c++) {
				this.drawPixel( r, c );
			};
		};

	};

	Pixel.prototype.drawPixel = function( r, c )
	{

		if( !this.aPixels[r][c].c )
			this.aPixels[r][c].c = this.getColor( this.aPixels[r][c] );

		this.ctx.fillStyle = 'rgba( ' + this.aPixels[r][c].c.r + ', ' + this.aPixels[r][c].c.g + ', ' + this.aPixels[r][c].c.b + ', ' + this.aPixels[r][c].a + ' )';
		this.ctx.fillRect( this.aPixels[r][c].x, this.aPixels[r][c].y, this.settings.w, this.settings.w );

	};

	this.init();

};

