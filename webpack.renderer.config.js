/* eslint-disable @typescript-eslint/no-var-requires */
const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')

rules.push(
	{
		test: /\.css$/,
		use: [
			'style-loader',
			{
				loader: 'css-loader',
				options: {
					importLoaders: 1,
				},
			},
			'postcss-loader',
		],
	},
	{
		test: /\.svg/,
		type: 'asset/resource',
	},
	{
		test: /\.png/,
		type: 'asset/resource',
	}
)

module.exports = {
	module: {
		rules,
	},
	plugins: plugins,
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
	},
}
