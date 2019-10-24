import Engine from "./engine"
class Pixel extends Engine { 
	constructor ( $img, _options ){
		super(_options)
		this.$img = $img
		this.settings = {
			size: 5,
			trace: 0.1, 
			addClass: true,
			aClass: [ '_top', '_right', '_bottom', '_left' ],
			wave: {
				w: 10,
				speed: 5
			},
			preload: false,
			..._options
		}
		this.init()
	}

	img = {}
	canvas
	ctx
	aPixels = []
	iCell = 0
	iRow = 0
	bRuning = false
	wave = { x : 0, y : 0, r : 0, w : 0, s : 0 }
	aWaves = []

	init () {
		this.getSettings()
		this.buildCanvas()
		this.buildPixels()
		this.drawImg()
		if( this.settings.preload ) this.getColors()

		this.img.o.style.display = 'none'
	}

	getSettings () {
		this.img = {
			o 	: this.$img,
			sw 	: this.$img.naturalWidth,
			sh 	: this.$img.naturalHeight,
			h 	: this.$img.height,
			w 	: this.$img.width,
			x 	: this.$img.offsetLeft,
			y 	: this.$img.offsetTop
		}
		this.wave.w = -this.settings.wave.w
		this.wave.s = this.settings.wave.speed
	}

	buildCanvas () {
		this.canvas = document.createElement('canvas')
		this.canvas.width = this.img.w
		this.canvas.height = this.img.h
		this.ctx = this.canvas.getContext('2d')
		this.img.o.parentNode.appendChild( this.canvas )
		this.bindEvent()
	}

	buildPixels () {
		this.iCell = Math.floor( this.img.w / this.settings.size )
		this.iRow = Math.floor( this.img.h / this.settings.size )
		this.aPixels = []

		for (var r = 0; r <= this.iRow; r++) {
			this.aPixels[ r ] = []
			for (var c = 0; c <= this.iCell; c++) {
				this.aPixels[ r ][ c ] = {
					x : c * this.settings.size,
					y : r * this.settings.size,
					c : false,
					a : 1
				}
			}
		}
	}

	getColors () {
		for (var r = 0; r <= this.iRow; r++)
			for (var c = 0; c <= this.iCell; c++)
				if( !this.aPixels[r][c].c ) this.aPixels[r][c].c = this.getColor( this.aPixels[r][c] )
	}

	getColor( obj ) {
		const  pixels = this.ctx.getImageData( obj.x, obj.y, this.settings.size, this.settings.size ).data
		const  rgb = { r: 0, g: 0, b: 0 }
		let i = 0
		let count = 0
		while ( (i += this.settings.size * 4) < pixels.length ) {
			++count
			rgb.r += pixels[i]
			rgb.g += pixels[i+1]
			rgb.b += pixels[i+2]
		}
		rgb.r = ~~(rgb.r/count)
		rgb.g = ~~(rgb.g/count)
		rgb.b = ~~(rgb.b/count)
		return rgb
	}

	bindEvent () {
		this.enter = this.launch.bind( this )
		this.canvas.addEventListener('mouseenter', this.enter)
		this.remove = this.out.bind( this )
		this.canvas.addEventListener('mouseleave', this.remove)
		this.move = this.updateDir.bind( this )
		this.canvas.addEventListener('mousemove', this.move)

		this.click = this.addWave.bind( this )
		this.canvas.addEventListener('click', this.click)
	}
	clearEvent () {
		this.canvas.removeEventListener('mouseenter', this.enter)
		this.canvas.removeEventListener('mouseleave', this.remove)
		this.canvas.removeEventListener('mousemove', this.move)
		this.canvas.removeEventListener('click', this.click)
	}


	launch () {
		if( this.settings.addClass ) this.updateClass()
	
		if( !this.bRuning ){
			this.bRuning = true
			this.run()
		}
	}

	out () {
		this.dir = -1
		this.removeClass()
	}

	stop ()
	{

		this.bRuning = false;

	};


	run ( e )
	{

		this.update();
		this.drawWave();

		if( this.bRuning ){

			var run = this.run.bind( this );
			requestAnimationFrame( run );

		}

	}

	updateDir ()
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
	getDir (e)
	{
		
		var po 	= this.canvas.getBoundingClientRect();
		var cx  = po.left + ( this.img.w / 2 );
		var cy  = po.top  + ( this.img.h / 2 );
		var x	= ( e.pageX - cx ) * ( this.img.w > this.img.h ? ( this.img.h / this.img.w ) : 1 );
		var y   = -( e.pageY - cy ) * ( this.img.h > this.img.w ? ( this.img.w / this.img.h ) : 1 );
		var d 	= Math.round( ( (Math.atan2(x,y) + Math.PI) / (Math.PI/2)) + 2 ) % 4;

		return d; 

	}


	updateClass ()
	{

		this.removeClass();
		if( typeof( this.settings.aClass[ this.dir ] ) != 'undefined' )
			this.canvas.parentNode.classList.add( this.settings.aClass[ this.dir ] );

	}

	removeClass ()
	{

		for (var i = 0; i < this.settings.aClass.length; i++) {

			this.canvas.parentNode.classList.remove( this.settings.aClass[i] );
		
		};

	}


	checkWaves ( x, y )
	{

		var bReturn = false;

		for (var i = this.aWaves.length - 1; i >= 0; i--) {

			if( this.checkWave( x, y, this.aWaves[i].x, this.aWaves[i].y, this.aWaves[i].r ) && !this.checkWave( x, y, this.aWaves[i].x, this.aWaves[i].y, this.aWaves[i].w ) )
				bReturn = true;

		};

		return bReturn;

	};


	checkWave ( x, y, cx, cy, cr )
	{

		var distX = Math.abs(cx - x-this.settings.size/2);
		var distY = Math.abs(cy - y-this.settings.size/2);

		if (distX > (this.settings.size/2 + cr)) { return false; }
		if (distY > (this.settings.size/2 + cr)) { return false; }

		if (distX <= (this.settings.size/2)) { return true; } 
		if (distY <= (this.settings.size/2)) { return true; }

		var dx=distX-this.settings.size/2;
		var dy=distY-this.settings.size/2;
		return (dx*dx+dy*dy<=(cr*cr));

	};

	addWave (){

		this.animFromClick( event );

		if( !this.bRuning )
			this.launch();

	}

	updateWave ( i )
	{

		this.aWaves[i].r += this.aWaves[i].s;
		this.aWaves[i].w += this.aWaves[i].s;

		if( this.aWaves[i].w > this.aWaves[i].end )
			this.aWaves.splice( i, 1 );

	}

	update ()
	{

		for (var i = this.aWaves.length - 1; i >= 0; i--) {
			
			this.updateWave( i );
		
		};

		if( this.aWaves.length == 0 )
			this.stop();

	};

	getAnim ()
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

	animFromT (){

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


	animFromR (){


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


	animFromB ()
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


	animFromL ()
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

	animFromClick (e)
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

	drawWave ()
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




	drawAll () 
	{

		this.drawImg();
		this.drawAllPixel();

	};

	drawImg ()
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

	drawAllPixel () 
	{

		for (var r = 0; r <= this.iRow; r++) {
			for (var c = 0; c <= this.iCell; c++) {
				this.drawPixel( r, c );
			};
		};

	};

	drawPixel ( r, c )
	{

		if( !this.aPixels[r][c].c )
			this.aPixels[r][c].c = this.getColor( this.aPixels[r][c] );

		this.ctx.fillStyle = 'rgba( ' + this.aPixels[r][c].c.r + ', ' + this.aPixels[r][c].c.g + ', ' + this.aPixels[r][c].c.b + ', ' + this.aPixels[r][c].a + ' )';
		this.ctx.fillRect( this.aPixels[r][c].x, this.aPixels[r][c].y, this.settings.size, this.settings.size );

	}
}



export default Pixel