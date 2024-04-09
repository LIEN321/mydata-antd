// Change theme plugin

import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import path from 'path';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
const prodGzipList = ['js', 'css'];

export default config => {
  // pro 和 开发环境再添加这个插件
  if (process.env.APP_TYPE === 'site' || process.env.NODE_ENV !== 'production') {
    // 将所有 less 合并为一个供 themePlugin使用
    const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
    const stylesDir = path.join(__dirname, '../src/');

    config.plugin('merge-less').use(MergeLessPlugin, [
      {
        stylesDir,
        outFile,
      },
    ]);

    config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
      {
        antDir: path.join(__dirname, '../node_modules/antd'),
        stylesDir,
        varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
        mainLessFile: outFile, //     themeVariables: ['@primary-color'],
        indexFileName: 'index.html',
        generateOne: true,
        lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
      },
    ]);
  }

  // 以下为gzip配置内容
  if (process.env.NODE_ENV === 'production') {  // 生产模式开启
    config.plugin('compression-webpack-plugin').use(
        new CompressionWebpackPlugin({
            // filename: 文件名称，这里我们不设置，让它保持和未压缩的文件同一个名称
            //filename: '[path].gz[query]',
            algorithm: 'gzip', // 指定生成gzip格式
            test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
            threshold: 10240, //对超过10k的数据进行压缩
            minRatio: 0.6 // 压缩比例，值为0 ~ 1
        })
    );
  }

};
