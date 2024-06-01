import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { FuseV1Options, FuseVersion } from '@electron/fuses'

import MakerDMG from '@electron-forge/maker-dmg'
import PublisherGithub from '@electron-forge/publisher-github'

const config: ForgeConfig = {
	packagerConfig: {
		asar: true,
	},
	rebuildConfig: {},
	plugins: [
		new VitePlugin({
			// `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
			// If you are familiar with Vite configuration, it will look really familiar.
			build: [
				{
					// `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
					entry: 'src/index.ts',
					config: 'vite.main.config.ts',
				},
				{
					entry: 'src/electron/preload.ts',
					config: 'vite.preload.config.ts',
				},
			],
			renderer: [
				{
					name: 'main_window',
					config: 'vite.renderer.config.ts',
				},
			],
		}),
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true,
		}),
	],
	makers: [
		new MakerSquirrel({}),
		new MakerZIP({}, ['darwin']),
		new MakerDeb({
			options: {
				maintainer: 'James Bithell & John Cherry',
				homepage: 'https://github.com/Paradise-Pi/ParadisePi',
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
}

export default config
