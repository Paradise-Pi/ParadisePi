module.exports = {
	packagerConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				icon: 'icon/favicon.ico',
				title: 'Paradise Pi',
			},
		},
		{
			name: '@electron-forge/maker-zip',
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				options: {
					maintainer: 'James Bithell',
					homepage: 'https://github.com/Jbithell/ParadisePi',
					icon: 'icon/favicon.ico',
					name: 'Paradise Pi',
				},
			},
		},
		{
			name: '@electron-forge/maker-dmg',
			config: {
				icon: 'icon/favicon.ico',
				name: 'Paradise Pi',
			},
		},
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'Jbithell',
					name: 'ParadisePi',
				},
				draft: true,
			},
		},
	],
	plugins: [
		[
			'@electron-forge/plugin-webpack',
			{
				mainConfig: './webpack.main.config.js',
				port: 9001, // When developing locally, you can grab the bundled app from port 9001 and use it in the browser
				loggerPort: 9000, // See the logs from the buildpack job
				renderer: {
					config: './webpack.renderer.config.js',
					entryPoints: [
						{
							html: './src/app/index.html',
							js: './src/renderer.ts',
							name: 'main_window',
						},
					],
				},
			},
		],
	],
}
