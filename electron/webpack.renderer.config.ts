import type { Configuration } from 'webpack'

import { rules } from './webpack.rules'
import { plugins } from './webpack.plugins'

rules.push(
	{
		test: /\.css$/,
		use: [
			{ loader: 'style-loader' },
			{
				loader: 'css-loader',
				options: {
					importLoaders: 1,
				},
			},
			{ loader: 'postcss-loader' },
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

export const rendererConfig: Configuration = {
	module: {
		rules,
	},
	plugins,
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
	},
}
