<!--
 * @Author: 刘晨曦
 * @Date: 2021-03-11 18:24:10
 * @LastEditTime: 2021-03-12 17:39:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\mobile-adaptation.md
-->

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
;(function(doc, win) {
  //  基准大小
  const baseSize = 37.5
  // 监听 resize 事件, orientationchange 事件在设备的纵横方向改变时触发，Safari浏览器中使用
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  //  设置 rem 的计算规则
  function reCalc() {
    const scale = doc.documentElement.clientWidth / 750
    if (!scale) return
    // 设置页面根节点字体大小
    doc.documentElement.style.fontSize = baseSize * scale + 'px'
  }
  if (!doc.addEventListener) return
  // 监听 resize 事件和 orientationchange 事件执行 reCalc 函数
  win.addEventListener(resizeEvt, reCalc, false)
  // 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，执行 reCalc 函数
  doc.addEventListener('DOMContentLoaded', reCalc, false)
})(document, window)
```

### postcss-pxtorem

然后，安装 [postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem), 它是 PostCSS 的一款插件，可把像素单位 px 生成 rem 单位,

```npm
npm i postcss-pxtorem --save-dev
```

接着，我们需要配置一些规则，一种方法是可以在根目录下创建 postcss.config.js

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
      exclude: /node_modules/,
    },
  },
}
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
          exclude: /node_modules/,
        }),
      ]
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
                  minPixelValue: 12, // 最小像素
                }),
              ],
            },
          },
        ],
      },
    ],
  },
}
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

1. postcss 是个什么东西？
