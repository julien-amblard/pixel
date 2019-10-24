const DEFAULT_FUNC = () => void 0
class Engine {
	constructor({ 
		onUpdate = DEFAULT_FUNC, 
		onDraw = DEFAULT_FUNC, 
		onStart = DEFAULT_FUNC, 
		onStop = DEFAULT_FUNC 
	} = {}) {
		this.onUpdate = typeof onUpdate === "function" ? onUpdate : null
		this.onDraw = typeof onDraw === "function" ? onDraw : null
		this.onStart = typeof onStart === "function" ? onStart : null
		this.onStop = typeof onStop === "function" ? onStop : null
	}
	_isRunning = false
	update () {
		if( !!this.onUpdate ) this.onUpdate()
	}
	draw () {
		if( !!this.onDraw ) this.onDraw()
	}
	_run () {
		if( !this._isRunning ) return
		this.update()
		this.draw()
		requestAnimationFrame( () => this._run() )
	}
	stop () {
		if( !!this.onStop ) this.onStop()
		this._isRunning = false
	}
	start () {
		if( !!this.onStart ) this.onStart()
		this._isRunning = true
		this._run()
	}
	toggle () {
		this._isRunning = !this._isRunning
		this._run()
	}
}
export default Engine