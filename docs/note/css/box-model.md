# 盒模型

::: tip
CSS 的盒模型分为 IE 盒模型和 W3C 标准盒模型。
:::

html 标签都可以看做一个方块，然后这个方块又包着几个小方块，如同盒子一层层的包裹着，这就是所谓的盒模型。

## IE 盒模型

属性 width, height 包含 border 和 padding，width = content + padding + border。

```css

```

## W3C 标准盒模型

属性 width,height 只包含内容 content，不包含 border 和 padding。

在当前 W3C 标准中盒模型是可以通过 box-sizing(CSS 新增的属性) 自由的进行切换的，默认值为 content-box，即标准盒模型；如果将 box-sizing 设为 border-box 则用的是 IE 盒模型。
