<!--
 * @Author: your name
 * @Date: 2021-07-30 15:34:49
 * @LastEditTime: 2021-07-30 17:19:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\css\css3.md
-->

# CSS3 新特性

> 一些常用的 CSS3 新特性

## CSS3 选择器

## CSS3 边框（Borders）

用 CSS3 ，你可以创建圆角边框，添加阴影框，并作为边界的形象而不使用设计程序

| 属性          | 说明                                            |
| ------------- | ----------------------------------------------- |
| border-image  | 设置所有边框图像的速记属性                      |
| border-radius | 一个用于设置所有四个边框- \*-半径属性的速记属性 |
| box-shadow    | 附加一个或多个下拉框的阴影                      |

```css
div {
  border: 2px solid;
  border-radius: 25px;
  box-shadow: 10px 10px 5px #888888;
  border-image: url(border.png) 30 30 round;
}
```

## CSS3 背景

CSS3 中包含几个新的背景属性，提供更大背景元素控制。

| 属性              | 说明                   | 可选项                             |
| ----------------- | ---------------------- | ---------------------------------- |
| background-clip   | 规定背景的绘制区域     | padding-box border-box content-box |
| background-origin | 规定背景图片的定位区域 | padding-box border-box content-box |
| background-size   | 规定背景图片的尺寸     |                                    |

```css
div {
  background: url(img_flwr.gif);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-origin: content-box;
}
/* 多背景 */
body {
  background-image: url(img_flwr.gif), url(img_tree.gif);
}
```

## CSS3 字体

以前 CSS3 的版本，网页设计师不得不使用用户计算机上已经安装的字体。使用 CSS3，网页设计师可以使用他/她喜欢的任何字体。当你发现您要使用的字体文件时，只需简单的将字体文件包含在网站中，它会自动下载给需要的用户。您所选择的字体在新的 CSS3 版本有关于@font-face 规则描述。您"自己的"的字体是在 CSS3 @font-face 规则中定义的。

```css
@font-face {
  font-family: myFirstFont;
  src: url(sansation_light.woff);
}
div {
  font-family: myFirstFont;
}
```

## CSS3 渐变

CSS3 定义了两种类型的渐变（gradients）：

1. 线性渐变（Linear Gradients）- 向下/向上/向左/向右/对角方向

```css
background: linear-gradient(direction, color-stop1, color-stop2, ...);

/* 从上到下，蓝色渐变到红色 */
linear-gradient(blue, red);

/* 渐变轴为45度，从蓝色渐变到红色 */
linear-gradient(45deg, blue, red);

/* 从右下到左上、从蓝色渐变到红色 */
linear-gradient(to left top, blue, red);

/* 从下到上，从蓝色开始渐变、到高度40%位置是绿色渐变开始、最后以红色结束 */
linear-gradient(0deg, blue, green 40%, red);
```

2. 径向渐变（Radial Gradients）

```css
background-image: radial-gradient(shape size position, start-color, ..., last-color);
```

| 值              | 描述                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| shape           | 确定圆的类型：ellipse (默认): 指定椭圆形的径向渐变；circle ：指定圆形的径向渐变 |
| size            | 定义渐变的大小：farthest-corner ；closest-side ；closest-corner ；farthest-side |
| background-size | 定义渐变的位置：center；top；bottom                                             |
