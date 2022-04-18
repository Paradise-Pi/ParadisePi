module.exports = {
  'packagerConfig': {},
  'makers': [
    {
      'name': '@electron-forge/maker-squirrel',
      'config': {
        'name': 'paradisepi',
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
        },
      },
    },
    {
      'name': '@electron-forge/maker-dmg',
      'config': {},
    },
  ],
  'publishers': [
    {
      'name': '@electron-forge/publisher-github',
      'config': {
        'repository': {
          'owner': '${{ GITHUB_REPOSITORY_OWNER }}',
          'name': '${{ github.event.repository.name }}',
        },
        'draft': true,
      },
    },
  ],
};
