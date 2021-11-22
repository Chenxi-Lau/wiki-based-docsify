# 移动端适配

> 移动端 web 页面的开发，由于手机屏幕尺寸、分辨率不同，或者需要考虑横竖屏问题，为了使得 web 页面在不同移动设备上具有相适应的展示效果，需要在开发过程中使用合理的适配方案来解决这个问题。

主要适配方案有：

- [x] rem 方案
- [ ] vh/vw 方案
- [ ] 基于@media（媒体查询）的响应式布局

## rem 方案

rem 是相对于 **根元素 font-size** 值的相对长度单位。rem 方案的实现过程是根据屏幕宽度设置 HTML 标签的 font-size (通过 **document.documentElement.style.fontSize** 获取)，在布局时使用 rem 单位进行样式布局，达到自适应的目的，是**弹性布局**的一种实现方式。

### rem.js

首先，在根目录 src 中新建 util 目录下新建 rem.js 等比适配文件(去掉开始的 ; )

```javascript
(function (doc, win) {
  //  基准大小
  const baseSize = 37.5;
  // 监听 resize 事件, orientationchange 事件在设备的纵横方向改变时触发，Safari浏览器中使用
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  //  设置 rem 的计算规则
  function reCalc() {
    const scale = doc.documentElement.clientWidth / 750;
    if (!scale) return;
    // 设置页面根节点字体大小
    doc.documentElement.style.fontSize = baseSize * scale + 'px';
  }
  if (!doc.addEventListener) return;
  // 监听 resize 事件和 orientationchange 事件执行 reCalc 函数
  win.addEventListener(resizeEvt, reCalc, false);
  // 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，执行 reCalc 函数
  doc.addEventListener('DOMContentLoaded', reCalc, false);
})(document, window);
```

### postcss-pxtorem

然后，安装 [postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem), 它是 PostCSS 的一款插件，可把像素单位 px 生成 rem 单位,

```npm
npm i postcss-pxtorem --save-dev
```

接着，我们需要配置一些规则，一种方法是可以在根目录下创建 postcss.config.js (或者.postcssrc)

```javascript
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // HTML根元素的字体大小, 例如，VantUI 官方根字体大小是 37.5
      rootValue: 37.5,
      // 这里设置为['*']全部，例如，仅对边框进行设置，可以写['*', '!border*']
      propList: ['*'],
      // 过滤掉.norem-开头的class，不进行rem转换
      selectorBlackList: ['.norem'],
      exclude: /node_modules/
    }
  }
};
```

或者，我们可以选择在 [vue.config.js](https://cli.vuejs.org/zh/config/#css-loaderoptions) 中直接配置,

```javascript
css: {
  loaderOptions: {
    postcss: {
      // 这里的选项会传递给 postcss-loader
      plugins: [
        require('postcss-pxtorem')({
          // HTML根元素的字体大小, 例如，VantUI 官方根字体大小是 37.5
          rootValue: 37.5,
          // 这里设置为['*']全部，例如，仅对边框进行设置，可以写['*', '!border*']
          propList: ['*'],
          // 过滤掉.norem-开头的class，不进行rem转换
          selectorBlackList: ['norem'],
          exclude: /node_modules/
        })
      ];
    }
  }
}
```

如果是使用 React 构建，也可以通过 [webpack.config.js](https://webpack.docschina.org/concepts/loaders/) 配置相关规则,

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          // [postcss-loader]
          {
            // Options for PostCSS as we reference these options twice
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-pxtorem')({
                  rootValue: 37.5,
                  unitPrecision: 5, // 精度
                  propList: ['*'],
                  selectorBlackList: [],
                  replace: true,
                  mediaQuery: false, // 是否允许媒体查询
                  minPixelValue: 12 // 最小像素
                })
              ]
            }
          }
        ]
      }
    ]
  }
};
```

具体地，我们可以根据实际项目需求去修改 rem.js 和 postcss-pxtorem 的相关规则，这里整个配置就完成了。

### 踩坑（2021.03.12）

在执行 npm i postcss-pxtorem --save-dev 时默认安装最新版本，3 月 12 日安装的时候 postcss-pxtorem 为 V6.0.0 版本（Last 7 Days），装上之后运行项目报错

```error
Error: PostCSS plugin postcss-pxtorem requires PostCSS 8.
```

这是应该是插件版本兼容的问题，因此降低一下 postcss-pxtorem 的版本，

```npm
npm i postcss-pxtorem@5.1.1
```

### 思考

不过这里还有一个疑问：

1. PostCss 本质上是个什么东西？
2. PostCss 与 SASS、LESS、STYLUS 有什么不同？

#### PostCSS 是什么东西？

按 [PostCss 官网](https://www.postcss.com.cn/)介绍，PostCSS 是一个用 JavaScript 工具和插件转化 CSS 代码的工具。换句话说，PostCSS 相当于一个平台，它能够将 CSS 代码解析成抽象语法树（Abstract Syntax Tree，AST），可以理解为下面这样一个模型：

- CSS FILE（CSS 文件）
- CSS PARSE（经过 CSS 解析）
- PLUGIN SYSTEM（然后通过 PostCSS 中的插件）
- STRINGIFIER（序列化操作）
- FINNAL CSS（最终的 CSS 文件）

它能够为 CSS 提供额外的功能，通过在 PostCSS 这个平台上，我们能够开发一些插件，来处理 CSS 样式。 在 VUE CLI 中就使用了 PostCSS，且默认开启了 autoprefixer, 其他一些比较热门的 PostCSS 插件包括：

##### 1. [Autoprefixer](https://github.com/postcss/autoprefixer)

其作用是为 CSS 中的属性添加浏览器特定的前缀

```css
#content {
  display: flex;
}
```

转换后

```css
#content {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
```

##### 2. [cssnano](https://www.npmjs.com/package/cssnano)

cssnano 会压缩你的 CSS 文件来确保在开发环境中下载量尽可能的小，这个插件通过移除注释、空白、重复规则、过时的浏览器前缀以及做出其他的优化来工作，一般能减少至少 50% 的大小。

##### 3. [Postcss-sprites](https://www.npmjs.com/package/postcss-sprites)

Postcss-sprites 将扫描你 CSS 中使用的所有图像，自动生成优化的 Sprites 图像和 CSS Sprites 代码

```css
.rss {
  background: url(../img/icons/social-rss.png);
}

.twitter {
  background: url(../img/icons/social-twitter.png);
}
```

转换后

```css
.rss {
  background-image: url(../img/sprite.png);
  background-position: 0 0;
  width: 30px;
  height: 30px;
}

.twitter {
  background-image: url(../img/sprite.png);
  background-position: -30px 0;
  width: 30px;
  height: 30px;s
}
```

#### PostCss 与 SASS、LESS、STYLUS 有什么不同？

SASS、LESS、STYLUS 相当于预处理器（pre-processor），简单来说，预处理器（pre-processor）是你把一些长得很像 CSS 但不是 CSS 的东西丢给它，处理过后会给你编译过后的 CSS，而 CSS 再经过后处理器（ post-processor），透过一些规则帮它加上一些东西，最后产出完整的 CSS 文件。

例如，在写 CSS 的时候，经常会碰到这样的问题，比如说“变量” ：

```css
h1 {
  color: red;
}
.title {
  color: red;
}
.classA {
  color: red;
}
```

但是对于大型应用来说，想要修改全部的颜色是相当繁琐地，而且还有更多的问题，比如代码复用，嵌套，Mixins（混入）等等。

Sass / Less 预处理器（pre-processor）就可以很好地解决这些问题，例如上述例子可以：

```css
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

这里用了变量功能，以后想要修改 CSS 直接改变量内容就好，不用在每一个地方都改了。
