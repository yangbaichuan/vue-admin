const path = require('path');
const printANSI = require('./config/printANSI');
const setting = require('./src/config/system.config.js');
const { name } = require('./package');

const resolve = dir => {
  return path.join(__dirname, dir);
};

const publicPath = process.env.NODE_ENV === 'production' ? '/advert/' : '/';

printANSI(setting);

module.exports = {
  // 打包基础路径，若非根目录部署请修改此配置
  publicPath,
  lintOnSave: true,
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  // css配置
  css: {
    loaderOptions: {
      // 为了使用最新版less
      less: {
        javascriptEnabled: true
      }
    }
  },
  // webpack配置
  chainWebpack: config => {
    // 设置别名
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'));
    // 设置title
    config
      .plugin('html')
      .tap(args => {
        args[0].title = setting.title;
        return args;
      });
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 本地调试接口建议在src/config/index.js中进行配置
  devServer: {
    proxy: process.env.VUE_APP_BASE_URL
  }
};
