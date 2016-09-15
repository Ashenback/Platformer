var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'JASK.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: [
					path.join(__dirname, 'node_modules'),
					path.join(__dirname, 'src', 'lib')
				],
				loader: 'babel'
			}, {
				test: /\.frag$/,
				loader: 'raw'
			}, {
				test: /\.woff2$/,
				loader: 'url?name=font-[hash:base64:10].[ext]&limit=8192&mimetype=application/font-woff'
			}, {
				test: /\.css$/,
				loader: "style-loader!css-loader"
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin([
				{
					context: 'src/lib',
					from: '**/*',
					to: path.join(__dirname, 'build', 'lib')
				},
				{
					context: 'src/assets',
					from: '**/*',
					to: path.join(__dirname, 'build', 'assets')
				}
			]
		)
	],
	resolve: {
		modulesDirectories: ['node_modules', 'src'],
		extensions: ['', '.js', '.json']
	}
};
