# 盒模型

::: tip
CSS 的盒模型分为 IE 盒模型和 W3C 标准盒模型。
:::

CSS 盒模型本质上是一个盒子，封装周围的 HTML 元素，它包括：`外边距（margin）`、`边框（border）`、`内边距（padding）`、`实际内容（content）`四个属性。

![盒模型](https://www.runoob.com/images/box-model.gif)

## 标准盒模型与 IE 盒模型区别

W3C 定义的盒模型元素的宽度 width 等于 content 的宽度。
IE 盒模型与 W3C 盒模型的唯一区别就是元素的宽度，元素的 width=border + padding + content。

在当前 W3C 标准中盒模型是可以通过 `box-sizing`(CSS 新增的属性) 自由的进行切换的。

1. 默认值为 `content-box`，即标准盒模型
2. 如果将 `box-sizing` 设为 `border-box` 则用的是 IE 盒模型

## 获取盒模型对应的宽和高

1. `dom.style.width/height`: 只能取到行内样式的宽和高，style 标签中和 link 外链的样式取不到；
2. `dom.currentStyle.width/height`: （只有 IE 兼容）取到的是最终渲染后的宽和高；
3. `window.getComputedStyle(dom).width/height`: 同（2）但是多浏览器支持，IE9 以上支持；
4. `dom.getBoundingClientRect().width/height`: 也是得到渲染后的宽和高，大多浏览器支持，IE9 以上支持，除此外还可以取到相对于视窗的上下左右的距离；
5. `dom.offsetWidth/offsetHeight`: 包括高度（宽度）、内边距和边框，不包括外边距；

## BFC(边距重叠解决方案)

:::tip
BFC 即 Block Formatting Context，块级格式化上下文，指的是一块独立的渲染区域，是一个环境，里面的元素不会影响到外部的元素。
:::

### 创建 BFC 的方式

1. 根元素，即 HTML 元素（最大的一个 BFC）;
2. 浮动，float 的值不为 none;
3. 绝对定位元素，position 的值为 absolute 或 fixed;
4. 行内块，display 为 inline-block;
5. 表格单元，display 为 table、table-cell、table-caption、inline-block 等 HTML 表格相关的属性;
6. 弹性盒，display 为 flex 或 inline-flex;
7. overflow 的值不为 visible 的元素；

### BFC 布局规则

1. 内部的盒子会在垂直方向，一个一个地放置;
2. BFC 是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此;
3. 属于同一个 BFC 的两个相邻 Box 的上下 margin 会发生重叠;
4. 计算 BFC 的高度时，浮动元素也要参与计算;
5. BFC 元素的左边与包含的盒子的左边相接触，即使存在浮动也是如此;
6. BFC 的区域不会与 float 重叠;

### 相关情景理解

#### 1. 父元素塌陷

```html
<div style="border:1px solid #000000">
  <div style="width:100px;height:100px;background-color:gray;float:left"></div>
</div>
```

上面代码会导致父元素塌陷，外面的 div 无法包含内部的 div。但是如果我们触发外部容器的 BFC，根据 BFC 布局规则，计算 BFC 高度时，浮动元素也要参与在内，那么外部容器将会包裹着浮动元素，通过这样的方式达到阻止父元素塌陷的效果。

```html
<div style="border:1px solid #000000;overflow:hidden;">
  <div style="width:100px;height:100px;background-color:gray;float:left;"></div>
</div>
```

#### 2. 浮动元素被覆盖

```html
<div style="width:100px;height:100px;background:#000;float: left;"></div>
<div style="width:400px;height:300px;background:sandybrown;"></div>
```

上述代码中浮动元素的左边与第二个盒子的左边相接处，为了防止这种情况发生，同样我们可以通过触发一个新的 BFC 来解决，因为 BFC 区域不会与 float 重叠。

```html
<div style="width:100px;height:100px;background:#000;float: left;"></div>
<div style="width:400px;height:300px;background:sandybrown;overflow:hidden;"></div>
```
