import Engine from "./engine"
class Pixel extends Engine {
	constructor (img, options) {
		super(options)
		this.settings = {
			img,
			size: 5,
			...options
		}
		this.init()
	}
	init () {
		this.buildCanvas()
		this.calcCells()
	}
	buildCanvas () {
		this.canvas = document.createElement('canvas')
		this.canvas.width= this.settings.img.naturalWidth
		this.canvas.height = this.settings.img.naturalHeight
		this.ctx = this.canvas.getContext('2d');
		this.settings.img.parentNode.appendChild( this.canvas )
	}
	calcCells () {
		this.cells = ~~(this.settings.img.width / this.settings.size)
		this.rows = ~~(this.settings.img.height / this.settings.size)
		this.pixels = []
		for (let r = 0; r <= this.rows; r++) {
			this.pixels[r] = []
			for (let c = 0; c <= this.cells; c++) {
				this.pixels[r][c] = {
					x : c * this.settings.size,
					y : r * this.settings.size,
					color : false,
					alpha : 1
				}
			}
		}
	}

	drawImg () {
		this.ctx.drawImage( 
			this.settings.img, 				//Specifies the image, canvas, or video element to use
			0, 							//The x coordinate where to start clipping
			0, 							//The y coordinate where to start clipping
			this.settings.img.naturalWidth, 				//The width of the clipped image
			this.settings.img.naturalHeight, 				//The height of the clipped image
			this.settings.img.offsetLeft, 				//The x coordinate where to place the image on the canvas
			this.settings.img.offsetTop, 				//The y coordinate where to place the image on the canvas
			this.settings.img.width, 				//The width of the image to use (stretch or reduce the image)
			this.settings.img.height  				//The height of the image to use (stretch or reduce the image)
		);
	}

	draw() {
		super.draw()
		this.drawImg()
	}
}

export default Pixel