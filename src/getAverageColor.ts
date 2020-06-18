interface GetAverageColor {
	(x: number, y: number, imageData: any): {
		r: number
		g: number
		b: number
		a: number
	}
}
export const getAverageColor: GetAverageColor = (x, y, imageData) => {
	console.log(x, y, imageData)
	return {
		r: 0,
		g: 0,
		b: 0,
		a: 0,
	}
}
