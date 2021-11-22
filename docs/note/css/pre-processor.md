# 预处理器

> CSS 预处理器定义了一种新的语言，其基本思想是，用一种专门的编程语言，为 CSS 增加了一些编程的特性，将 CSS 作为目标生成文件，然后开发者就只要使用这种语言进行编码工作。通俗的说，CSS 预处理器用一种专门的编程语言，进行 Web 页面样式设计，然后再编译成正常的 CSS 文件，以供项目使用。

目前，目前 CSS 预处理器主要包括以下三种：

- Sass/Scss
- Less
- Stylus

## 1.局部样式

一般都是使用 scoped 方案：

```scss
<style lang="scss" scoped>
  ...
</style>
```

携带有 scoped 标签的样式都带带有类似 [data-v-23d425f8]的属性，保证当前样式是私有的。 如果需要修改第三方组件的样式，需要采用深度选择器。
less 语言：

```scss
.van-tabs ::v-deep .van-ellipsis {
  color: blue;
}
```

stylus 和 Sass 语言为 >>>，less 语言为/deep/。

## 2.全局样式

在大型项目开发中，全局样式管理非常重要，通常，全局样式放置目录：@/styles。以 SCSS 样式为例，
variable.scss 管理全局变量，例如：

```scss
// 主题色
$theme-color: #3a0ce3;
$theme-hover-color: #613ce8;
$theme-press-color: #340acb;
$theme-disabled-color: #b09ef4;
```

mixins.scss 管理全局混入，例如：

```scss
// 居中
@mixin center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// 背景图居中
@mixin backgroundImage($image) {
  background-image: $image;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

// 文字省略
@mixin utils-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

global.scss 管理全局样式，例如：

```scss
// 设置消失过渡
.expandPack-enter-active,
.expandPack-leave-active {
  transition: opacity 0.3s;
}

.expandPack-enter,
.expandPack-leave-to {
  opacity: 0;
}

// 设置折叠过渡
.fold-enter-active,
.fold-leave-active {
  transition: height 2s;
}

.fold-enter,
.fold-leave-to {
  height: 0;
}
```

function.scss 管理全局函数，例如：

```scss
// 是否包含伪元素
@function contain-pseudo-class($selector) {
  $selector: selector-to-string($selector);
  @if str-index($selector, ':') {
    @return true;
  } @else {
    @return false;
  }
}
```

然后，在定义出口文件 index.scss 中引入各个模块：

```scss
@import './mixins/variable.scss';
@import './mixins/mixins.scss';
@import './mixins/global.scss';
@import './mixins/function.scss';
```

最后，在 vue.config.js 配置：

```javascript
module.exports = {
  css: {
    // 预处理器loader传递自定义选项
    loaderOptions: {
      scss: {
        prependData: `@import '@/styles/index.scss';`
      }
      // stylus
      // stylus: {
      //   import: ['~@/assets/styles/index.styl']
      // }
    }
  }
};
```

需要注意的是，less/sass 语言需要额外的插件[sass-resources-loader](https://www.npmjs.com/package/sass-resources-loader)定义全局样式，以 less 为例，vue-cli@3 配置如下：

```javascript
module.exports = {
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          resources: './path/to/resources.scss',

          // Or array of paths
          resources: ['./path/to/vars.scss', './path/to/mixins.scss', './path/to/functions.scss']
        })
        .end();
    });
  }
};
```
