# 动画

:::tip
常见的 css3 动画一般有补间动画（又叫“关键帧动画”）和逐帧动画两种, 关键帧动画是连续的，逐帧动画是跳跃的。
:::

## 关键帧动画

常用于实现位移、颜色（透明度）、大小、旋转、倾斜等变化，一般有 `transition` 和 `keyframes animation` 两种方法实现补间动画。

### 1. transition

CSS 的 `transition` 允许 CSS 的属性值在一定的时间区间内平滑地过渡，这种效果可以在鼠标单击、获得焦点、被点击或对元素任何改变中触发，并圆滑地以动画效果改变 CSS 的属性值。

主要 API：

```css
transition-property: height;
transition-duration: 1s;
transition-delay: 1s;
transition-timing-function: ease;
```

transition 的优点在于简单易用，但是它有几个很大的局限:

1. transition 需要事件触发，所以没法在网页加载时自动发生
2. transition 是一次性的，不能重复发生，除非一再触发
3. transition 只能定义开始状态和结束状态，不能定义中间状态，也就是说只有两个状态

Example:

```css
div{
  width:100px;
  height:100px
  transition: width 2s
}
div:hover{
  width:300px;
}
```

上述效果，div 元素的宽度将在 2s 内以 ease 方式由 100px 过渡至 300px。

### 2. animation

主要 API：

```css
animation-name: rainbow;
animation-duration: 1s;
animation-timing-function: linear;
animation-delay: 1s;
animation-fill-mode: forwards;
animation-direction: normal;
animation-iteration-count: 3;
```

Example:

```css
@keyframes rainbow {
  0% {
    background: #c00;
  }
  50% {
    background: orange;
  }
  100% {
    background: yellowgreen;
  }
}
```

## 逐步帧动画

`animation` 的 timing-function 默认值为 ease，它会在每个关键帧之间插入补间动画，所以动画效果是连贯性的。 除了 `ease`、`linear`、`cubic-bezier` 之类的过渡函数都会为其插入补间。 有些效果不需要补间，只需要关键帧之间的跳跃，这时应该使用 `steps` 过渡方式。
用法：

```css
steps(number, position)
```

`position` 关键字表示动画是从时间段的开头连续还是末尾连续，支持 start 和 end 两个关键字，含义分别如下：
`start`：表示直接开始。`end`：表示戛然而止。是默认值。

Example：

```css
animation:mymove 5s infinite steps(2, start）
@keyframes move {
    0% { left: 0; }
    50% { left: 100px; }
    100% { left: 200px; }
}
// 把0% 到50% 就看做2段3个点（0px、50px、100px）取 0px和 50px，
// 把50% 到100% 就看做2段3个点（100px、150px、200px）取 100px和 150px
// 最终动画的效果为 元素一次跳跃的出现在 0px、50px、100px、150px这些点上
```

steps 讲解：[https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/](https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/)
