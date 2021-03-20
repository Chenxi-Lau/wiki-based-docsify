<!--
 * @Author: 刘晨曦
 * @Date: 2021-02-07 10:13:56
 * @LastEditTime: 2021-03-20 11:58:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\webpack\instruction.md
-->

# Webpack 学习笔记

> Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。

## 什么是 webpack

Webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**(module bundler)，Webpack 核心思想是一切皆模块。当 Webpack 处理应用程序时，它根据各个模块之间的依赖关系，递归地构建一个依赖关系图(dependency graph)，然后将所有这些模块打包成一个或多个 bundle，经过 Webpack 的处理，最终会输出浏览器能使用的静态资源（JS，CSS、图片资源）。

![图1-2 Webpack 简介](http://webpack.wuhaolin.cn/1%E5%85%A5%E9%97%A8/img/1-2webpack.png)

## Webpack 基本打包机制

打包的基本机制可以拆分为以下四个步骤：

1. 利用 babel 完成代码转换，并生成单个文件的依赖
2. 从入口开始递归分析，并生成依赖图谱
3. 将各个引用模块打包为一个立即执行函数
4. 将最终的 bundle 文件写入 bundle.js 中

Webpack 的打包流程基于上述的过程进行扩展，执行一个串行的过程：

1. **初始化参数**：从配置文件（webpack.config.js）和 Shell 语句中读取与合并参数，得出最终的参数
2. **开始编译**：用上述的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
3. **确定入口**：根据配置中的 entry 找出所有的入口文件
4. **编译模块**：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. **完成模块编译**：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. **输出资源**：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
7. **输出完成**：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

整个流程概括为 3 个阶段，初始化、编译、输出。而在每个阶段中又会发生很多事件，Webpack 会将这些事件广播出来供 Plugin 使用。

## Webpack 的核心概念

Webpack 的核心概念包括：入口（entry）、输出（output）、loader、插件（Plugin）

### Entry

Entry 是配置模块的入口，可抽象成输入，Webpack 执行构建的第一步将从入口开始搜寻及递归解析出所有入口依赖的模块。目前，有三种配置方式：

| 类型   | 例子                                                           | 含义                                 |
| ------ | -------------------------------------------------------------- | ------------------------------------ |
| String | './src/main.js'                                                | 入口模块的文件路径，可以是相对路径。 |
| Array  | ['./src/entry1.js', './src/entry2.js']                         | 入口模块的文件路径，可以是相对路径。 |
| Object | { a: './app/entry-a', b: ['./app/entry-b1', './app/entry-b2']} | 配置多个入口，每个入口生成一个 Chunk |

#### 常见场景：

1. 分离 app(应用程序) 和 vendor(第三方库) 入口，webpack.config.js

```javascript
module.exports = {
  entry: {
    main: './src/app.js',
    vendor: './src/vendor.js',
  },
}
```

vendor.js 中存入未做修改的必要 library 或文件（例如 Bootstrap, jQuery, 图片等），然后将它们打包在一起成为单独的 chunk。内容哈希保持不变，这使浏览器可以独立地缓存它们，从而减少了加载时间。

2. 多页面应用程序

```javascript
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js',
  },
}
```

在多页面应用程序中，服务端会拉取一个新的 HTML 文档给客户端，页面重新加载此新文档，并且静态资源被重新下载。由于入口起点数量的增多，多页应用能够复用多个入口起点之间的大量代码/模块，从而可以极大地从这些技术中受益。

3. 动态配置 Entry

```javascript
// 同步函数
entry: () => {
  return {
    a: './pages/a',
    b: './pages/b',
  }
}
// 异步函数
entry: () => {
  return new Promise((resolve) => {
    resolve({
      a: './pages/a',
      b: './pages/b',
    })
  })
}
```

假如项目里有多个页面需要为每个页面的入口配置一个 Entry ，但这些页面的数量可能会不断增长，则这时 Entry 的配置会受到到其他因素的影响导致不能写成静态的值，其解决方法是把 Entry 设置成一个函数去动态返回上面所说的配置。

### Output

Output 配置如何输出最终想要的代码，类型为 object，里面包含一系列配置项。基本配置如下：

```javascript
const path = require('path')
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 本地存放位置，绝对路径
    filename: 'bundle[hash].js', // 输出文件名 hash：Chunk 的唯一标识的 Hash 值 chunkhash：Chunk 内容的 Hash 值
    // publicPath: '', 配置发布到线上资源的 URL 前缀
  },
}
```

如果在编译时，不知道最终输出文件的 publicPath 是什么地址，则可以将其留空，并且在运行时通过入口起点文件中**webpack_public_path** 动态设置。

```javascript
__webpack_public_path__ = myRuntimePublicPath
```

### Loader

#### 基本概念

Webpack 的 Loader 机制可以将文件非 JavaScript 类型的文件（如 TypeScript）转换为 JavaScript，或者内联图像转换为 data URL，Loader 可以理解为具有文件转换功能的翻译员。

- 一个 Loader 的职责是单一的，只能完成一种转换
- 一个 Loader 其实就是一个 Node.js 模块，需要这个模块导出一个函数

```javascript
module.exports = function(source) {
  return source
}
```

#### 配置方法

Module 用于配置如何处理模块，通常在[module.rules](https://webpack.docschina.org/configuration/module/#modulerules) 配置 Loader 的读取和解析规则，其类型是一个数组。工作流程大致如下：

1. 条件匹配：通过 **test 、 include 、 exclude** 三个配置项来命中 Loader 要应用规则的文件
2. 应用规则：对选中后的文件通过 **use** 配置项来应用 Loader，可以只应用一个 Loader 或者按照**从后往前**的顺序应用一组 Loader，同 时还可以分别给 Loader 传入参数
3. 重置顺序：一组 Loader 的执行顺序默认是**从右到左**执行，通过 enforce 选项可以让其中一个 Loader 的执行顺序放到最前或者最后

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/, // 命中 JavaScript 文件
        // 用 babel-loader 转换 JavaScript 文件
        // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
        use: ['babel-loader?cacheDirectory'],
        include: path.resolve(__dirname, 'src'), // 只命中src目录里的js文件，加快 Webpack 搜索速度
      },
      {
        test: /\.scss$/, // 命中 SCSS 文件
        // 使用一组 Loader 去处理 SCSS 文件。
        // 处理顺序为从后到前，即先交给 sass-loader 处理，再把结果交给 css-loader 最后再给 style-loader。
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: path.resolve(__dirname, 'node_modules'), // 排除 node_modules 目录下的文件
      },
      {
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/, // 对非文本文件采用 file-loader 加载
        use: ['file-loader'],
      },
    ],
  },
}
```

### Plugin

专注处理 Webpack 在编译过程中的某个特定的任务的功能模块，可以称为插件，基本概念为：

1. 是一个独立的模块
2. 模块对外暴露一个 js 函数
3. 函数的原型 (prototype) 上定义了一个注入 compiler 对象的 apply 方法，apply 函数中需要有通过 compiler 对象挂载的 Webpack 事件钩子，钩子的回调中能拿到当前编译的 compilation 对象，如果是异步编译插件的话可以拿到回调 callback
4. 完成自定义子编译流程并处理 complition 对象的内部数据
5. 如果异步编译插件的话，数据处理完成后执行 callback 回调。

## References

1. [Webpack 中文官网](https://webpack.docschina.org/)
2. [深入浅出 Webpack](http://webpack.wuhaolin.cn/)
