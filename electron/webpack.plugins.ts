/* eslint-disable @typescript-eslint/no-explicit-any */
import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars
const relocateLoader = require('@vercel/webpack-asset-relocator-loader')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

export const plugins = [
	new ForkTsCheckerWebpackPlugin({
		logger: 'webpack-infrastructure',
	}),
]
