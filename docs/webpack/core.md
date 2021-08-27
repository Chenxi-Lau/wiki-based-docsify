<!--
 * @Author: 刘晨曦
 * @Date: 2021-02-07 10:13:56
 * @LastEditTime: 2021-08-27 10:26:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\webpack\instruction.md
-->

## Webpack 的核心概念

> Webpack 的核心概念包括：入口（entry）、输出（output）、loader、插件（Plugin）

### Entry

Entry 是配置模块的入口，可抽象成输入，Webpack 执行构建的第一步将从入口开始搜寻及递归解析出所有入口依赖的模块。目前，有三种配置方式：

| 类型   | 例子                                                           | 含义                                 |
| ------ | -------------------------------------------------------------- | ------------------------------------ |
| String | './src/main.js'                                                | 入口模块的文件路径，可以是相对路径。 |
| Array  | ['./src/entry1.js', './src/entry2.js']                         | 入口模块的文件路径，可以是相对路径。 |
| Object | { a: './app/entry-a', b: ['./app/entry-b1', './app/entry-b2']} | 配置多个入口，每个入口生成一个 Chunk |

#### 常见场景

1. 分离 app(应用程序) 和 vendor(第三方库) 入口，webpack.config.js

```js
module.exports = {
  entry: {
    main: './src/app.js',
    vendor: './src/vendor.js'
  }
};
```

vendor.js 中存入未做修改的必要 library 或文件（例如 Bootstrap, jQuery, 图片等），然后将它们打包在一起成为单独的 chunk。内容哈希保持不变，这使浏览器可以独立地缓存它们，从而减少了加载时间。

2. 多页面应用程序

```javascript
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

在多页面应用程序中，服务端会拉取一个新的 HTML 文档给客户端，页面重新加载此新文档，并且静态资源被重新下载。由于入口起点数量的增多，多页应用能够复用多个入口起点之间的大量代码/模块，从而可以极大地从这些技术中受益。

3. 动态配置 Entry

```js
// 同步函数
entry: () => {
  return {
    a: './pages/a',
    b: './pages/b'
  };
};
// 异步函数
entry: () => {
  return new Promise(resolve => {
    resolve({
      a: './pages/a',
      b: './pages/b'
    });
  });
};
```

假如项目里有多个页面需要为每个页面的入口配置一个 Entry ，但这些页面的数量可能会不断增长，则这时 Entry 的配置会受到到其他因素的影响导致不能写成静态的值，其解决方法是把 Entry 设置成一个函数去动态返回上面所说的配置。

### Output

Output 配置如何输出最终想要的代码，类型为 object，里面包含一系列配置项。基本配置如下：

```js
const path = require('path');
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 本地存放位置，绝对路径
    filename: 'bundle[hash].js' // 输出文件名 hash：Chunk 的唯一标识的 Hash 值 chunkhash：Chunk 内容的 Hash 值
    // publicPath: '', 配置发布到线上资源的 URL 前缀
  }
};
```

如果在编译时，不知道最终输出文件的 publicPath 是什么地址，则可以将其留空，并且在运行时通过入口起点文件中**webpack_public_path** 动态设置。

```js
__webpack_public_path__ = myRuntimePublicPath;
```

### Loader

#### 基本概念

Webpack 的 Loader 机制可以将文件非 JavaScript 类型的文件（如 TypeScript）转换为 JavaScript，或者内联图像转换为 data URL，Loader 可以理解为具有文件转换功能的翻译员。

- 一个 Loader 的职责是单一的，只能完成一种转换
- 一个 Loader 其实就是一个 Node.js 模块，需要这个模块导出一个函数

一个基础的 Loader 代码是这样子的，

```js
module.exports = function (source) {
  return source;
};
```

#### 配置方法

Module 用于配置如何处理模块，通常在[module.rules](https://webpack.docschina.org/configuration/module/#modulerules) 配置 Loader 的读取和解析规则，其类型是一个数组。工作流程大致如下：

1. 条件匹配：通过 **test 、 include 、 exclude** 三个配置项来命中 Loader 要应用规则的文件
2. 应用规则：对选中后的文件通过 **use** 配置项来应用 Loader，可以只应用一个 Loader 或者按照**从后往前**的顺序应用一组 Loader，同 时还可以分别给 Loader 传入参数
3. 重置顺序：一组 Loader 的执行顺序默认是**从右到左**执行，通过 enforce 选项可以让其中一个 Loader 的执行顺序放到最前或者最后

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/, // 命中 JavaScript 文件
        // 用 babel-loader 转换 JavaScript 文件
        // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
        use: ['babel-loader?cacheDirectory'],
        include: path.resolve(__dirname, 'src') // 只命中src目录里的js文件，加快 Webpack 搜索速度
      },
      {
        test: /\.scss$/, // 命中 SCSS 文件
        // 使用一组 Loader 去处理 SCSS 文件。
        // 处理顺序为从后到前，即先交给 sass-loader 处理，再把结果交给 css-loader 最后再给 style-loader。
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: path.resolve(__dirname, 'node_modules') // 排除 node_modules 目录下的文件
      },
      {
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/, // 对非文本文件采用 file-loader 加载
        use: ['file-loader']
      }
    ]
  }
};
```

### Plugin

#### 基本概念

在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。专注处理 Webpack 在编译过程中的某个特定的任务的功能模块，可以称为插件，基本概念为：

1. 是一个独立的模块
2. 模块对外暴露一个 js 函数
3. 函数的原型 (prototype) 上定义了一个注入 compiler 对象的 apply 方法，apply 函数中需要有通过 compiler 对象挂载的 Webpack 事件钩子，钩子的回调中能拿到当前编译的 compilation 对象，如果是异步编译插件的话可以拿到回调 callback
4. 完成自定义子编译流程并处理 complition 对象的内部数据
5. 如果异步编译插件的话，数据处理完成后执行 callback 回调。

一个基础的 Plugin 代码是这样子的，

```js
class BasicPlugin {
  constructor(options) {} // 在构造函数中获取用户给该插件传入的配置
  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    compiler.plugin('compilation', function (compilation) {});
  }
}
module.exports = BasicPlugin; // 导出 Plugin
```

在使用这个 Plugin 时，相关配置代码如下：

```js
const BasicPlugin = require('./BasicPlugin.js');
module.export = {
  plugins: [new BasicPlugin(options)]
};
```

#### 配置方法

Plugin 的配置很简单，plugins 配置项接受一个数组，数组里每一项都是一个要使用的 Plugin 的实例，Plugin 需要的参数通过构造函数传入。

```js
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
  plugins: [
    // 所有页面都会用到的公共代码提取到 common 代码块中
    new CommonsChunkPlugin({
      name: 'common',
      chunks: ['a', 'b']
    })
  ]
};
```

### 在 vue.config.js 中配置 loader 和 plugin

调整 webpack 配置最简单的方式最在 configWebpack 选项中提供一个对象，

```js
module.exports = {
  configureWebpack: {
    plugins: [new MyAwesomeWebpackPlugin()]
  }
};
```

如果要基于环境进行配置行为，或者想要直接修改配置，那就换成一个函数 (该函数会在环境变量被设置之后懒执行)，

```js
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  }
};
```

更高级的配置可以通过链式操作[webpack-chain](https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7) 来维护。这个库提供了一个 webpack 原始配置的上层抽象，使其可以定义具名的 loader 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    // loader
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        // 修改它的选项...
        return options
      })
    config.plugin('compressionPlugin').use(
      // 实例化，需要先引入plugin
      new CompressionPlugin({
        ...
      })
    )
  },
}
```

### References

1. [Webpack 中文官网](https://webpack.docschina.org/)
2. [深入浅出 Webpack](http://webpack.wuhaolin.cn/)
