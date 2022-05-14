// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import lightCodeTheme from 'prism-react-renderer/themes/github'
import darkCodeTheme from 'prism-react-renderer/themes/dracula'

const production = process.env.CONTEXT === 'production' //Netlify/Cloudflare Pages set environment variable "CONTEXT" to "production"/"deploy-preview"

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'ParadisePi',
	tagline: 'Facility control panel for sACN & OSC, in Electron.',
	url: 'https://paradisepi.pages.dev',
	baseUrl: '/',
	noIndex: !production,
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'Paradise-Pi', // Usually your GitHub org/user name.
	projectName: 'ParadisePi', // Usually your repo name.

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					editUrl: 'https://github.com/Paradise-Pi/ParadisePi',
					editCurrentVersion: true,
					showLastUpdateTime: true,
					showLastUpdateAuthor: true,
					versions: {
						current: {
							label: 'v2',
						},
					},
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			navbar: {
				title: 'ParadisePi',
				logo: {
					alt: 'ParadisePi Logo',
					src: 'img/logo.svg',
				},
				items: [
					{
						type: 'doc',
						docId: 'user-guide/intro',
						position: 'left',
						label: 'User Guide',
					},
					{
						type: 'doc',
						docId: 'repo-docs/intro',
						position: 'left',
						label: 'Developer Guide',
					},
					{
						href: 'https://github.com/Paradise-Pi/ParadisePi/releases/latest',
						label: 'Download',
						position: 'right',
					},
					{
						href: 'https://github.com/Paradise-Pi/ParadisePi',
						label: 'GitHub',
						position: 'right',
					},
				],
			},
			footer: {
				style: 'dark',
				links: [],
				copyright: `©2020-${new Date().getFullYear()} James Bithell & John Cherry`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
			...(!production && {
				announcementBar: {
					id: 'dev_build', // Any value that will identify this message.
					content: 'This is a draft version of our website',
					backgroundColor: '#fafbfc', // Defaults to `#fff`.
					textColor: '#091E42', // Defaults to `#000`.
					isCloseable: false,
				},
			}),
		}),
}

export default config
