import Pixels from "../src/"
import "../src/core.scss"
new Pixels({
	$el: document.querySelectorAll(".item"),
	onUpdate: () => console.log( "update" ),
	size: 15
})