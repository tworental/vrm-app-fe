/* eslint-disable no-param-reassign */
const packageJson = require('./package.json');

module.exports = {
  productionSourceMap: false,

  configureWebpack: {
    devtool: 'source-map',
  },

  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = process.env.VUE_APP_TITLE;
      return args;
    });

    config.plugin('define').tap((args) => {
      args[0]['process.env'].APP_VERSION = JSON.stringify(packageJson.version);
      return args;
    });
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/assets/scss/_variables.scss";@import "@/assets/scss/_mixins.scss";',
      },
    },
  },

  pwa: {
    name: process.env.VUE_APP_TITLE,
    themeColor: '#2E3192',
    msTileColor: '#F84D5B',
    manifestOptions: {
      background_color: '#F84D5B',
    },
  },
};
