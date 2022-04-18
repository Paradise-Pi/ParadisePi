module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'rules': {
    'require-jsdoc': ['off'],
    'valid-jsdoc': ['off'],
    'max-len': ['off'],
    'linebreak-style': ['off'],
  },
  'ignorePatterns': ['node_modules/', '.vscode/', 'assets/'],
};
