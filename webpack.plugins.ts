/* eslint-disable @typescript-eslint/no-explicit-any */
import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const relocateLoader = require('@vercel/webpack-asset-relocator-loader')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

export const plugins = [
	new ForkTsCheckerWebpackPlugin({
		logger: 'webpack-infrastructure',
	}),
	{
		// https://github.com/electron-userland/electron-forge/issues/2412#issuecomment-1013740102
		apply(compiler: {
			hooks: {
				compilation: {
					tap: (
						arg0: string,
						arg1: (compilation: any) => void // eslint-disable-next-line @typescript-eslint/no-var-requires
					) => void
				}
			}
		}) {
			compiler.hooks.compilation.tap('webpack-asset-relocator-loader', (compilation: any) => {
				relocateLoader.initAssetCache(compilation, 'native_modules')
			})
		},
	},
]
