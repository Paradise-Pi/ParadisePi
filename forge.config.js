module.exports = {
  'packagerConfig': {},
  'makers': [
    {
      'name': '@electron-forge/maker-squirrel',
      'config': {
        'icon': 'assets/icon/favicon.ico',
        'title': 'Paradise Pi',
      },
    },
    {
      'name': '@electron-forge/maker-zip',
    },
    {
      'name': '@electron-forge/maker-deb',
      'config': {
        'options': {
          'maintainer': 'James Bithell',
          'homepage': 'https://github.com/Jbithell/ParadisePi',
          'icon': 'assets/icon/favicon.ico',
          'name': 'Paradise Pi',
        },
      },
    },
    {
      'name': '@electron-forge/maker-dmg',
      'config': {
        'icon': 'assets/icon/favicon.ico',
        'name': 'Paradise Pi',
      },
    },
  ],
  'publishers': [
    {
      'name': '@electron-forge/publisher-github',
      'config': {
        'repository': {
          'owner': 'Jbithell',
          'name': 'ParadisePi',
        },
        'draft': true,
      },
    },
  ],
  'plugins': [
    [
      '@electron-forge/plugin-webpack',
      {
        'mainConfig': './webpack.main.config.js',
        'renderer': {
          'config': './webpack.renderer.config.js',
          'entryPoints': [
            {
              'html': './src/app/index.html',
              'js': './src/renderer.ts',
              'name': 'main_window',
            },
          ],
        },
      },
    ],
  ],
};
