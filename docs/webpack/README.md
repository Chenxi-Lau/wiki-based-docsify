# 打包机制及核心

> Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。

Webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**(module bundler)，Webpack 核心思想是一切皆模块。当 Webpack 处理应用程序时，它根据各个模块之间的依赖关系，递归地构建一个依赖关系图(dependency graph)，然后将所有这些模块打包成一个或多个 bundle，经过 Webpack 的处理，最终会输出浏览器能使用的静态资源（JS，CSS、图片资源）。

![图1-2 Webpack 简介](http://webpack.wuhaolin.cn/1%E5%85%A5%E9%97%A8/img/1-2webpack.png)
