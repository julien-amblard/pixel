import { createGrilled } from "./createGrilled"

interface PixelizerInterface {
	sayHello: () => void
}
interface PixelizerConstructor {
	(element: HTMLImageElement, options: { [key: string]: any }): PixelizerInterface
}
export const Pixelizer: PixelizerConstructor = (element, options) => {
	if (!(element instanceof HTMLElement) || element.tagName.toLocaleLowerCase() !== "img")
		throw "element must be an image"

	const defaultOptions = {
		pixelWidth: 10,
	}
	const _options = { ...options, ...defaultOptions }

	const rowNumber = Math.floor(element.height / _options.pixelWidth)
	const cellNumber = Math.floor(element.width / _options.pixelWidth)

	const createCanvas = () => {
		const canvas = document.createElement("canvas")
		canvas.width = element.width
		canvas.height = element.height
		element.parentNode.insertBefore(canvas, element)
	}
	createCanvas()
	const grilled = createGrilled(rowNumber, cellNumber, _options.pixelWidth)
	const flattenGrilled = grilled.flat(1)
	console.log(flattenGrilled)

	const sayHello = () => {
		// console.log(element, element.width, _options, grilled)
	}
	return {
		sayHello,
	}
}
