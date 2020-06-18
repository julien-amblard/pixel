import { PixelInterface } from "./interfaces/PixelInterface"

interface CreateGrilled {
	(rowNumber: number, cellNumber: number, pixelWidth: number): PixelInterface[][]
}

export const createGrilled: CreateGrilled = (rowNumber, cellNumber, pixelWidth) => {
	const arr = Array(rowNumber)
		.fill(null)
		.map(() => Array(cellNumber).fill(null))

	for (let r = 0; r < rowNumber; r++)
		for (let c = 0; c < cellNumber; c++)
			arr[r][c] = { x: c * pixelWidth, y: r * pixelWidth, c: { r: 0, g: 0, b: 0, a: 0 } }

	return arr
}
