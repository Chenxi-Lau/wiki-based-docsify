# 常用 Plugin

> 记录项目开发中一些常用的 Plugin。

具体可参考：[http://webpack.wuhaolin.cn/%E9%99%84%E5%BD%95/%E5%B8%B8%E7%94%A8Plugins.html](http://webpack.wuhaolin.cn/%E9%99%84%E5%BD%95/%E5%B8%B8%E7%94%A8Plugins.html)

## 主要分类

### 1. 用于修改行为

- define-plugin：定义环境变量，在 4-7 区分环境中有介绍
- context-replacement-plugin：修改 require 语句在寻找文件时的默认行为
- ignore-plugin：用于忽略部分文件

### 2. 用于优化

- commons-chunk-plugin：提取公共代码
- extract-text-webpack-plugin：提取 JavaScript 中的 CSS 代码到单独的文件中
- prepack-webpack-plugin：通过 Facebook 的 Prepack 优化输出的 JavaScript 代码性能
- uglifyjs-webpack-plugin：通过 UglifyES 压缩 ES6 代码
- webpack-parallel-uglify-plugin：多进程执行 UglifyJS 代码压缩，提升构建速度
- imagemin-webpack-plugin：压缩图片文件。
- webpack-spritesmith：用插件制作雪碧图
- ModuleConcatenationPlugin：开启 Webpack Scope Hoisting 功能
- dll-plugin：借鉴 DDL 的思想大幅度提升构建速度
- hot-module-replacement-plugin：开启模块热替换功能

### 3. 其它

- serviceworker-webpack-plugin：给网页应用增加离线缓存功能
- stylelint-webpack-plugin：集成 stylelint 到项目中，在 3-16 检查代码中有介绍。
- i18n-webpack-plugin：给你的网页支持国际化
- provide-plugin：从环境中提供的全局变量中加载模块，而不用导入对应的文件
- web-webpack-plugin：方便的为单页应用输出 HTML，比 html-webpack-plugin 好用

## 使用方法

### 1. [**compression**](https://www.npmjs.com/package/compression)

Node.js 的中间件，用于压缩 Js、Css 代码，例如在 Express 模块中使用 Compression

```javascript
var compression = require('compression');
var express = require('express');

var app = express();
// 尽量在其他中间件前使用compression
app.use(compression());
```

如果需要在对请求进行过滤的话，还要加上

```javascript
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // 这里就过滤掉了请求头包含'x-no-compression'
    return false;
  }

  return compression.filter(req, res);
}
```

在 Vue 中可以使用 [**compression-webpack-plugin**](https://www.npmjs.com/package/compression-webpack-plugin)

```javascript
// vue.config.js
const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'));
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: true
        })
      );
    }
  }
};
```
