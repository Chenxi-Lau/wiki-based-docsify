# Router 路由传参

> 项目中很多情况下都需要进行路由之间的传值，这里介绍 vue 自带的路由传参的两种基本方式，供参考使用。

假定有如下场景，点击当前页的某个按钮跳转到另外一个页面去，需要将某个参数带过去，如

```csharp
<div class="examine" @click="insurance(2)">查看详情</div>
```

## Params 模式

```js
methods：{
  insurance(id) {
    // 直接调用$router.push 实现携带参数的跳转
    this.$router.push({
      path: '/particulars',
      params: {
        id: id
      }
    })

    // 或者直接把参数拼接至后面
    this.$router.push({
      path: `/particulars/${id}`,
    })
  }
}
```

需要对应路由配置如下：

```js
{
  path: '/particulars/:id',
  name: 'particulars',
  component: particulars
}
```

这种模式需要在 path 中添加/:id 来对应 \$router.push 中 path 携带的参数。另外页面获取参数如下

```csharp
this.$route.params.id
```

特别注意，组件中 获取参数的时候是 route.params 而不是 router 这很重要。

## Query 模式

使用 path 来匹配路由，然后通过 query 来传递参数，这种情况下 query 传递的参数会显示在 url 后面?id=？

```js
methods：{
  insurance(id) {
      this.$router.push({
        path: '/particulars',
        query: {
          id: id
        }
     })
  }
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

### 总结

1. 接收方式
   - query 传参：this.$route.query.id
   - params 传参：this.$route.params.id
2. 路由展现方式
   - query 传参：/detail?id=1&user=123&identity=1&更多参数
   - params 传参：/detail/123
