<!--
 * @Author: your name
 * @Date: 2021-07-06 20:25:49
 * @LastEditTime: 2021-07-06 20:29:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\vue\router.md
-->

# 路由传参

> 项目中很多情况下都需要进行路由之间的传值，本节介绍 vue 自带的路由传参的三种基本方式。

先有如下场景 点击当前页的某个按钮跳转到另外一个页面去，并将某个值带过去

```csharp
<div class="examine" @click="insurance(2)">查看详情</div>
```

**第一种方法：**页面刷新数据不会丢失

```javascript
methods：{
  insurance(id) {
       //直接调用$router.push 实现携带参数的跳转
        this.$router.push({
          path: `/particulars/${id}`,
     })
}
```

需要对应路由配置如下：

```css
{
     path: '/particulars/:id',
     name: 'particulars',
     component: particulars
   }
```

可以看出需要在 path 中添加/:id 来对应 \$router.push 中 path 携带的参数。在子组件中可以使用来获取传递的参数值，另外页面获取参数如下

```csharp
this.$route.params.id
```

**第二种方法：**页面刷新数据会丢失

通过路由属性中的 name 来确定匹配的路由，通过 params 来传递参数。

```javascript
methods：{
  insurance(id) {
       this.$router.push({
          name: 'particulars',
          params: {
            id: id
          }
     })
}
```

对应路由配置: 注意这里不能使用:/id 来传递参数了，因为组件中，已经使用 params 来携带参数了。

```javascript
 {
     path: '/particulars',
     name: 'particulars',
     component: particulars
   }
```

子组件中: 这样来获取参数

```javascript
this.$route.params.id;
```

**第三种方法**： 使用 path 来匹配路由，然后通过 query 来传递参数，这种情况下 query 传递的参数会显示在 url 后面?id=？

```javascript
methods：{
  insurance(id) {
        this.$router.push({
          path: '/particulars',
          query: {
            id: id
          }
     })
 }
```

对应路由配置：

```javascript
{
     path: '/particulars',
     name: 'particulars',
     component: particulars
}
```

对应子组件: 这样来获取参数

```javascript
this.$route.query.id;
```

特别注意哦，组件中 获取参数的时候是![route.params 而不是](https://math.jianshu.com/math?formula=route.params%20%E8%80%8C%E4%B8%8D%E6%98%AF)router 这很重要~~~
