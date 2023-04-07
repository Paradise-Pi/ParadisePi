import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'

import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'
import MakerDMG from '@electron-forge/maker-dmg'
import PublisherGithub from '@electron-forge/publisher-github'

const config: ForgeConfig = {
	packagerConfig: {},
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
				jsonStats: true,
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
