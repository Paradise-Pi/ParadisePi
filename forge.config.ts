import { MakerDeb } from '@electron-forge/maker-deb'
import MakerDMG from '@electron-forge/maker-dmg'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import PublisherGithub from '@electron-forge/publisher-github'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'
const config: ForgeConfig = {
	packagerConfig: {
		afterComplete: [
			async (buildPath, electronVersion, platform, arch, done) => {
				throw new Error(`${__dirname}***${buildPath}***${electronVersion}***${platform}***${arch}***`)
			},
		],
	},
	rebuildConfig: {},
	makers: [
		new MakerSquirrel({}),
		new MakerZIP({}, ['darwin']),
		new MakerDeb({
			options: {
				maintainer: 'James Bithell',
				homepage: 'https://github.com/Jbithell/ParadisePi',
				icon: 'icon/favicon.ico',
				name: 'Paradise Pi',
			},
		}),
		new MakerDMG({
			icon: 'icon/favicon.ico',
			name: 'Paradise Pi',
		}),
	],
	publishers: [
		new PublisherGithub({
			repository: {
				owner: 'Paradise-Pi',
				name: 'ParadisePi',
			},
			draft: true,
		}),
	],
	plugins: [
		new WebpackPlugin({
			mainConfig,
			renderer: {
				config: rendererConfig,
				nodeIntegration: false,
				jsonStats: false,
				entryPoints: [
					{
						nodeIntegration: false,
						html: './src/app/index.html',
						js: './src/app/app.tsx',
						name: 'main_window',
						preload: {
							js: './src/electron/preload.ts',
						},
					},
				],
			},
		}),
	],
}

export default config
