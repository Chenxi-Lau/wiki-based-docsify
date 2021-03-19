<!--
 * @Author: your name
 * @Date: 2021-02-07 10:13:56
 * @LastEditTime: 2021-03-19 16:00:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\webpack\instruction.md
-->

# Webpack 学习笔记

> Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。

Webpack 官网：[https://webpack.js.org/](https://webpack.js.org/)

Webpack 中文官网：[https://webpack.docschina.org/](https://webpack.docschina.org/)

## 什么是 webpack

Webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**(module bundler)，JavaScript、CSS、SCSS、图片、模板，在 Webpack 眼中都是一个个模块，当 Webpack 处理应用程序时，它根据各个模块之间的依赖关系，递归地构建一个依赖关系图(dependency graph)，然后将所有这些模块打包成一个或多个 bundle，经过 Webpack 的处理，最终会输出浏览器能使用的静态资源（JS，CSS、图片资源）。

![图1-2 Webpack 简介](http://webpack.wuhaolin.cn/1%E5%85%A5%E9%97%A8/img/1-2webpack.png)

## Webpack 基本打包机制

打包的基本机制可以拆分为以下四个步骤：

1. 利用 babel 完成代码转换，并生成单个文件的依赖
2. 从入口开始递归分析，并生成依赖图谱
3. 将各个引用模块打包为一个立即执行函数
4. 将最终的 bundle 文件写入 bundle.js 中

Webpack 的打包流程基于上述的过程进行扩展，执行一个串行的过程：

1. 初始化参数：从配置文件（webpack.config.js）和 Shell 语句中读取与合并参数，得出最终的参数
2. 开始编译：用上述的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
3. 确定入口：根据配置中的 entry 找出所有的入口文件
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

整个流程概括为 3 个阶段，初始化、编译、输出。而在每个阶段中又会发生很多事件，Webpack 会将这些事件广播出来供 Plugin 使用。具体钩子，可以看官方文档：[https://webpack.js.org/api/compiler-hooks/#hooks](https://webpack.js.org/api/compiler-hooks/#hooks)

## Webpack 的核心概念

webpack 的核心概念包括：入口（entry）、输出（output）、loader、插件（Plugin）

### Loader

要支持非 JavaScript 类型的文件，需要使用 Webpack 的 Loader 机制，Loader 可以看作具有文件转换功能的翻译员。

一个 Loader 的职责是单一的，只需要完成一种转换
一个 Loader 其实就是一个 Node.js 模块，这个模块需要导出一个函数

1. 基本配置

配置里的 `module.rules` 数组配置了一组规则，告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换。 如上配置告诉 Webpack 在遇到以 `.css` 结尾的文件时先使用 `css-loader` 读取 CSS 文件，再交给 `style-loader` 把 CSS 内容注入到 JavaScript 里。 在配置 Loader 时需要注意的是：

- `use` 属性的值需要是一个由 Loader 名称组成的数组，Loader 的执行顺序是由后到前的；
- 每一个 Loader 都可以通过 URL querystring 的方式传入参数，例如 `css-loader?minimize` 中的 `minimize` 告诉 `css-loader` 要开启 CSS 压缩。
