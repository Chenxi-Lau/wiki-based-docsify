# 最佳实践方案

:::tip
整理一些非常有用的 Vue 开发技巧，规范 vue 代码，它们将使你的 Vue 代码更易于维护、可读和更专业。
:::

## 1.不要将 v-if 与 v-for 元素一起使用

想要将 v-if 与 v-for 一起使用来过滤数组元素是非常诱人的。

```js
// Bad
<div
   v-for='product in products'
   v-if='product.price < 500'
>
```

问题在于 VueJS 将 v-for 指令优先于 v-if 指令。所以在幕后，它遍历每个元素，然后检查 v-if 条件。

```js
this.products.map(function (product) {
  if (product.price < 500) {
    return product;
  }
});
```

这意味着即使我们只想渲染列表中的几个元素，我们也必须遍历整个数组。

这样做不好。一个更聪明的解决方案是迭代计算属性。

```js
// Good
<div v-for='product in cheapProducts'>

computed: {
  cheapProducts: () => {
    return this.products.filter(function (product) {
      return product.price < 100
    })
  }
}
```

这有几个原因:

- 渲染效率更高，因为我们不会遍历每个项目
- 过滤列表只会在依赖项更改时重新评估
- 它有助于将我们的组件逻辑与模板分离，使我们的组件更具可读性

## 2.用好的定义验证你的 props

这可以说是最重要的最佳实践。它为什么如此重要？它基本上可以从现在的你中拯救未来的你。在设计大型项目时，很容易忘记你用于道具的确切格式、类型和其他约定。

如果你在一个更大的开发团队中，你的同事不会读心术，所以让他们清楚如何使用你的组件，有些难度。因此，让每个人都不必费力地使用你的组件以确定 props 的格式，并且只需编写 props 验证即可。

```js
props: {
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```

数据类型为 Array、Function、Object 时的 default 写法:

```js
{
  type: Array,
  default: () => {
    return []
  }
}

{
  type: Function,
  default: () => () => {}
}

{
  type: Object,
  default: () => ({}) //这里是注意是括弧，必须是括弧
}
```

## 3.模板表达式应该只有基本的 Javascript 表达式

想要在模板中添加尽可能多的内联功能是很自然的事情。但这使我们的模板声明性更少且更复杂。这意味着我们的模板变得非常混乱。为此，让我们查看 Vue 样式指南中的另一个示例。看看有多混乱。

```js
// Bad
{
  {
    fullName
      .split(' ')
      .map(function (word) {
        return word[0].toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
}
```

基本上，我们希望模板中的所有内容都对显示的内容具有直观性。为了保持这一点，我们应该将复杂的表达式重构为适当命名的组件选项。

分离复杂表达式的另一个好处是这意味着可以重用这些值。

```js
// Good
{{ normalizedFullName }}

// The complex expression has been moved to a computed property
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```
