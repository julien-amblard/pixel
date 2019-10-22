var path = require('path')
var webpack = require('webpack')
const config = {
	entry : './src/index.js',
	output : {
		path: path.resolve(__dirname,'dist'),
		filename: 'pixel.min.js',
		libraryTarget: 'umd'
	},
	mode: 'production',
	target: 'web',
	plugins: [],
	resolve: {
		extensions: ['.js']
	},
	module: {
		rules: [
			{
			test: /\.(js)$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-proposal-object-rest-spread']
					}
				}
			}
		]
	}
}
module.exports = config