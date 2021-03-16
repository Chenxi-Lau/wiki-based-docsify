<!--
 * @Author: 刘晨曦
 * @Date: 2021-03-13 09:47:39
 * @LastEditTime: 2021-03-16 09:10:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\access-control.md
-->

# 权限控制管理

> 企业内部的各种平台门户 Portal 就是一个入口, 可快速整合应用入口，用来统一账号管理、统一认证登录，打破信息孤岛等，做统一的权限管理，也可以实现单点登录、SSO。

目前，前端实现权限控制主要是从以下这几个角度去实现：

1. 路由层面（Router）

   - Router.beforeEach() 拦截路由的钩子
   - 配置 meta 属性
   - Router.addRouters() 动态添加路由

2. 视图层面（View）

   - directive 指令

3. 接口层面（Axios）

   - 拦截器验证 Token

## 路由层面（导航守卫）

通常，单页面应用（SPA）结合 vue-router 和 vuex 可以实现的一套完整的路由体系，主要分为两种方式，一种是直接通过 vue-router 中的 [beforeEach](https://router.vuejs.org/zh/api/#router-beforeeach) 钩子限制路由跳转，另外一种一种是通过 vue-router 中的 [addRoute](https://router.vuejs.org/zh/api/#router-addroute) 方法注入路由实现控制。Vue 官网中，对这一部分的描述为[导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)。

### Router.beforeEach()

router.beforeEach() 钩子函数在路由跳转前执行的，其基本形式如下：

```javascript
router.beforeEach((to, from, next) => {
  // ...
})
```

- to: Route: 即将要进入的目标路由对象
- from: Route: 当前导航正要离开的路由
- next: Function: 调用该方法来 resolve 这个钩子，执行效果依赖 next 方法的调用参数。

通过 beforeEach() 钩子函数对路由的每次跳转进行管理，如果目标路由不存在于基本路由和当前用户的用户路由中，则取消跳转，转为跳转错误页或登录页面。

```javascript
router.beforeEach(async (to, from, next) => {
  // 根据meta中的requireAuth字段，判断是够需要权限认证
  if (to.matched.some((item) => item.meta.requireAuth)) {
    // 如果获取到token（通常成功登录后写入到缓存中），正常跳转页面
    if (window.sessionStorage.getItem('token')) {
      next()
    } else {
      // 没有获取到token，跳转至登录页面
      next({ path: '/login' })
    }
  } else {
    // 不需要权限认证，正常跳转
    next()
  }
})
```

在路由定义时，添加 meta 属性，来控制判断该页面是否需要登录权限，对应的路由配置,

```javascript
{
  path: '/XXXX',
  name: 'XXXX',
  meta: {
    requireAuth: true,  // 用于判断该路由是否需要登录
  },
  component: () => import('./XXXX.vue') // 路由异步加载
}
```

### 动态路由（DynamicRoutes）

动态路由通过只挂载当前用户拥有权限的路由来实现权限控制，如果用户直接访问未授权的路由，则会进入 404 页面。这种方法，需要用户登录后通过后端接口获取当前用户的路由权限，通过 router.addRoute() 动态挂载在 router.beforeEach 钩子中处理的，下面我们看具体实现：

首先，定义好需要动态挂载的路由，分为初始路由（constantRoutes）和根据 role 角色来动态挂载的 “动态路由”（asyncRoutes），

```javascript
router.beforeEach(async (to, from, next) => {
  // 判断用户是否已经登录
  if (window.sessionStorage.getItem('token')) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 判断用户是否已经从用户信息中获取了权限
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // 有权限，正常跳转
        next()
      } else {
        // 如果没有权限，则获取用户信息
        const { roles, asyncRoutes } = await store.dispatch('user/getRoles')
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles, asyncRoutes)
        // dynamically add accessible routers
        router.addRoute(accessRoutes)
      }
    }
  } else {
    // 跳转至登录页面
    next({ path: '/login' })
  }
})
```

其中，登录用户通过 generateRoutes 函数获取拥有权限的路由（Vuex 中定义）

```javascript
const actions = {
  generateRoutes({ commit }, roles, asyncRoutes = []) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
}

// filterAsyncRoutes 通过递归的方式去过滤去用户的路由权限
function filterAsyncRoutes(routes, roles) {
  const res = []
  const hasPermission = function(roles, temp){
    return temp.
  }

  routes.forEach((route) => {
    const temp = { ...route }
    if (hasPermission(roles, temp)) {
      if (temp.children) {
        temp.children = filterAsyncRoutes(temp.children, roles)
      }
      res.push(temp)
    }
  })
  return res
}
```

这里，

## 视图层面

路由层面主要用于控制菜单页面权限，某些场景下我们需要对视图层面进行一些控制，例如，我们根据后台返回的权限信息判断当前用户可以看到哪些应用的入口或者操作，这些可以通过**指令控制**来实现。

### 指令控制

指令控制可以结合 vue 的[自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html#ad)实现权限控制，比如实现一个权限指令 v-auth， 来判断对应模块是否拥有某个权限，如果没有则移除当前按钮 dom 元素。具体方案：

首先，我们在 utils 文件夹下新建 authBtn.js

```javascript
import Vue from 'vue'

// 注册一个全局自定义指令 `v-auth`
Vue.directive('auth', {
  // 当被绑定的元素插入到 DOM 中时
  inserted(el, binding, vnode) {
    // 取出指令的值，例如 v-auth="['btn-1']"中的'btn-1'这个值
    const { value } = binding
    // 从store中取出存储好的后端返回的按钮对应权限表，例如，
    // {
    //   name: 'btn-1', permission: true,
    //   name: 'btn-2', permission: false
    // }
    const buttonList = store.getters && store.getter.buttonList
    // 判断value是否有值，类型是否正确
    if (value && value instanceof Array && value.length > 0) {
      const needAuthButtonName = value
      // 判断是否有权限
      const hasPermission = buttonList.some((button) => {
        return button.name && button.name === needAuthButtonName && button.permission
      })
      if (!hasPermission) {
        // 如果没有权限就移除这个按钮元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  },
})
```

然后在 main.js 引入

```javascript
import '@/utils/authBtn.js'
```

使用

```javascript
<el-button v-auth='btn-1'></el-button>
```

因为 v-show 的话，dom 其实没有隐藏，用户可以改变 display 就看到，v-if 呢，则是删除之后会遗留备注 <!-- --> 信息。

## 接口层面

在实际项目使用中，请求库以 axios 较多，我们通常会使用 axios 的 API axios.interceptors.request.use 和 axios.interceptors.response.use 拦截器来做权限管理。

### 请求拦截器（axios.interceptors.request.use）

请求头添加 token 认证，或者也可以直接使用 cookie 中的授权信息，前提是要配置 withCredentials 为 true，也就是 axios.defaults.withCredentials = true, 开启 withCredentials 后，服务器才能拿到你的 cookie

```javascript
// 请求拦截器
axios.interceptors.request.use(
  (req) => {
    // 为所有的请求添加token字段
    req.headers.token = window.sessionStorage.get('token')
    return trimOnlySpace(req)
  },
  (err) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
```

### 相应拦截器（axios.interceptors.response.use）

```javascript
http.interceptors.response.use(
  (response) => {
    // 除了登录页，都需要验证token
    if (location.href.indexOf('/login') === -1 && !window.sessionStorage.getItem('token')) {
      return router.push({ path: '/login' })
    }
    // 对错误进行统一处理
    if (response.data.code !== '0') {
      if (!response.config.noMsg && response.data.msg) {
        this.$message.error(response.data.msg)
      }
      return Promise.reject(response)
    } else if (response.data.code === '0' && response.config.successNotify && response.data.msg) {
      // 弹出成功提示
      this.$message.success(response.data.msg)
    }
    return Promise.resolve({
      code: response.data.code,
      msg: response.data.msg,
      data: response.data.data,
    })
  },
  // 对错误进行统一处理
  (error) => {
    if (error.message.indexOf('timeout') > -1) {
      this.$message.error('请求超时，请重试！')
    }
    return Promise.reject(error)
  }
)
```

拦截器拦截接口返回结果，比如 401 没有登录权限。
