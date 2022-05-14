import { MenuItemConstructorOptions } from 'electron'

export const mainWindowTemplate: Array<MenuItemConstructorOptions> = [
	{
		label: 'Paradise',
		submenu: [
			{ role: 'hide' },
			{ role: 'unhide' },
			{ type: 'separator' },
			{ role: 'quit' },
		],
	},
]
