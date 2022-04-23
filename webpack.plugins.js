/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const relocateLoader = require('@vercel/webpack-asset-relocator-loader');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  { // https://github.com/electron-userland/electron-forge/issues/2412#issuecomment-1013740102
    apply(compiler) {
      compiler.hooks.compilation.tap('webpack-asset-relocator-loader', (compilation) => {
        relocateLoader.initAssetCache(compilation, 'native_modules');
      });
    },
  }
];
