const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
	template: path.join(__dirname, "demo/index.html"),
	filename: "./index.html"
});
module.exports = {
	entry: path.join(__dirname, "demo/dev.js"),
	output : {
		path: path.resolve(__dirname,'demo/dist')
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-proposal-object-rest-spread']
					},
				},
				exclude: /node_modules/
			}
		]
	},
	plugins: [htmlWebpackPlugin],
	resolve: {
		extensions: [".js"]
	},
	devServer: {
		port: 3001
	}
}