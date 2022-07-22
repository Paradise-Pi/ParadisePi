/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const relocateLoader = require('@vercel/webpack-asset-relocator-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = [
	new ForkTsCheckerWebpackPlugin(),
	new BundleAnalyzerPlugin({
		generateStatsFile: false,
		analyzerMode: 'disabled',
	}),
	{
		// https://github.com/electron-userland/electron-forge/issues/2412#issuecomment-1013740102
		apply(compiler) {
			compiler.hooks.compilation.tap('webpack-asset-relocator-loader', compilation => {
				relocateLoader.initAssetCache(compilation, 'native_modules')
			})
		},
	},
]
