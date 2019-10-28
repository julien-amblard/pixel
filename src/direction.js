const DEFAULT_DIR = -1
class Direction {
	constructor ( settings ) {
		this.classes = [ '_top', '_right', '_bottom', '_left' ]
		this.onUpdate = typeof settings.onUpdate === "function" ? settings.onUpdate : null
		this.$el = settings.el instanceof HTMLElement ? settings.el : null
		this.dir = DEFAULT_DIR
		this.bindEvent()
	}
	bindEvent () {
		this.remove = this.out.bind( this )
		this.$el.addEventListener('mouseleave', this.remove)
		this.move = this.updateDir.bind( this )
		this.$el.addEventListener('mousemove', this.move)
	}
	clearEvent () {
		this.$el.removeEventListener('mouseleave', this.remove)
		this.$el.removeEventListener('mousemove', this.move)
	}
	updateDir ( ev ) {
		const d = this.getDir( ev )
		if( this.dir === d ) return
		this.dir = d
		this.updateClass()
		if( !!this.onUpdate ) this.onUpdate()
	}
	getDir (e) {
		var pos = this.$el.getBoundingClientRect()
		var cx  = pos.left + ( this.$el.width / 2 )
		var cy  = pos.top  + ( this.$el.height / 2 )
		var x	= ( e.pageX - cx ) * ( this.$el.width > this.$el.height ? ( this.$el.height / this.$el.width ) : 1 )
		var y   = -( e.pageY - cy ) * ( this.$el.height > this.$el.width ? ( this.$el.width / this.$el.height ) : 1 )
		var d 	= Math.round( ( (Math.atan2(x,y) + Math.PI) / (Math.PI/2)) + 2 ) % 4
		return d
	}
	get currentClass () { return this.classes[ this.dir ] }
	updateClass () {
		this.removeClass()
		if( !!this.currentClass )
			this.$el.parentNode.classList.add( this.currentClass )
	}
	removeClass () {
		this.classes.forEach( c => this.$el.parentNode.classList.remove( c ) )
	}

	out () {
		this.dir = DEFAULT_DIR
		this.removeClass()
	}
}

export { Direction }
export default Direction