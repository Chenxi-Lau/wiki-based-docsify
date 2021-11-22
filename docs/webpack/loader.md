# 常用 Loader

> 记录项目开发中一些常用的 loader。

具体可参考：[http://webpack.wuhaolin.cn/%E9%99%84%E5%BD%95/%E5%B8%B8%E7%94%A8Loaders.html](http://webpack.wuhaolin.cn/%E9%99%84%E5%BD%95/%E5%B8%B8%E7%94%A8Loaders.html)

## 主要分类

### 1. 用于加载文件

- file-loader
- image-loader
- json-loader

### 2. 用于编译模版

- markdown-loader（把 Markdown 文件转换成 HTM）

### 3. 转换脚本语言

- babel-loader（将 ES6 转换成 ES5）
- ts-loader

### 4. 转换样式文件

- style-loader （把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS）
- sass-loader
- less-loader
- stylus-loader

### 5. 检查代码

- eslint-loader （通过 ESLint 检查 JavaScript 代码）

## 使用方法

### 1. [**file-loader**](https://www.npmjs.com/package/file-loader)

可以把 JavaScript 和 CSS 中导入图片的语句替换成正确的地址，并同时把文件输出到对应的位置。

使用效果：CSS 源码

```css
#app {
  background-image: url(./imgs/a.png);
}
```

经过 file-loader 转换后的 CSS 代码

```css
#app {
  background-image: url(5556e1251a78c5afda9ee7dd06ad109b.png);
}
```
