/* eslint-disable no-useless-escape */
const { version } = require('../package.json');
/**
 * banner
 */
const banner = `
__     _____ _______        __     _    ____  __  __ ___ _   _
\\ \\   / /_ _| ____\\ \\      / /    / \\  |  _ \\|  \\/  |_ _| \\ | |
 \\ \\ / / | ||  _|  \\ \\ /\\ / /    / _ \\ | | | | |\\/| || ||  \\| |
  \\ V /  | || |___  \\ V  V /    / ___ \\| |_| | |  | || || |\\  |
   \\_/  |___|_____|  \\_/\\_/    /_/   \\_\\____/|_|  |_|___|_| \\_|
`;

/**
 * 获取操作信息
 */
const getOperation = () => {
  if (process.env.NODE_ENV === 'development') return '本地环境项目开发';
  else if (process.env.VUE_APP_CURRENTMODE === 'dev') return '开发环境项目构建';
  else if (process.env.VUE_APP_CURRENTMODE === 'test') return '测试环境项目构建';
  else if (process.env.VUE_APP_CURRENTMODE === 'pre') return '预生产环境项目构建';
  else if (process.env.VUE_APP_CURRENTMODE === 'prod') return '生产环境项目构建';
  else return '未知环境，请注意!!!';
};
module.exports = ({ title }) => {
  console.log('\x1B[34m%s\x1b[0m', banner);
  console.log('      ');
  console.log('      ');
  console.log('\x1B[34m%s\x1b[0m', '系统名称：' + title);
  console.log('      ');
  console.log('\x1B[34m%s\x1b[0m', '版本信息：' + version);
  console.log('      ');
  console.log('\x1B[34m%s\x1b[0m', '启动摘要：' + getOperation());
  console.log('      ');
  console.log('\x1B[34m%s\x1b[0m', `正在${process.env.NODE_ENV === 'development' ? '启动' : '构建'}项目，请稍后...`);
  console.log('      ');
};
