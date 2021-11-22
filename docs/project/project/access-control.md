# 前端权限控制

> 企业内部的各种平台门户 Portal 就是一个入口， 可快速整合应用入口，用来统一账号管理、统一认证登录，打破信息孤岛等，类似企业门户的后台项目，权限验证和安全性非常地重要，不同的权限对应着不同的路由权限，以及内部侧边栏内容也需要根据权限生成。

目前，前端实现权限控制主要是从以下这几个角度去实现：

1. 路由层面（Router）

   - Router.beforeEach() 拦截路由的钩子
   - Router.addRouter() 动态添加路由

2. 视图层面（View）

   - directive 指令

3. 接口层面（Axios）

   - 拦截器验证 Token

## 路由层面（导航守卫）

通常，单页面应用（SPA）结合 vue-router 和 vuex 可以实现的一套完整的路由体系，主要分为两种方式，一种是直接通过 vue-router 中的 [beforeEach](https://router.vuejs.org/zh/api/#router-beforeeach) 钩子限制路由跳转，另外一种一种是通过 vue-router 中的 [addRoute](https://router.vuejs.org/zh/api/#router-addroute) 方法注入路由实现控制。

Vue 官网中，对这一部分的描述为[导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)。

### Router.beforeEach()

router.beforeEach() 钩子函数在路由跳转前执行的，其基本形式如下：

```javascript
router.beforeEach((to, from, next) => {
  // ...
});
```

- to: Route: 即将要进入的目标路由对象
- from: Route: 当前导航正要离开的路由
- next: Function: 调用该方法来 resolve 这个钩子，执行效果依赖 next 方法的调用参数。

通过 beforeEach() 钩子函数对路由的每次跳转进行管理，如果目标路由不存在于基本路由和当前用户的用户路由中，则取消跳转，转为跳转错误页或登录页面。

```javascript
router.beforeEach(async (to, from, next) => {
  // 根据meta中的requireAuth字段，判断是够需要权限认证
  if (to.matched.length && to.matched.some(item => item.meta.requireAuth)) {
    // 如果获取到token（通常成功登录后写入到缓存中活着Vuex中），正常跳转页面
    if (window.sessionStorage.getItem('token')) {
      next();
    } else {
      // 没有获取到token，跳转至登录页面
      next({ path: '/login' });
    }
  } else {
    // 不需要权限认证，正常跳转
    next();
  }
});
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

动态路由通过只挂载当前用户拥有权限的路由来实现权限控制，如果用户直接访问未授权的路由，则会进入 404 页面。这种方法，需要用户登录后通过后端接口获取当前用户的路由权限，通过对比生成当前用户的真实路由，然后使用 router.addRoute() 进行动态挂载，下面我们看具体实现：

1. 首先，在创建 vue 实例的时候将一些登录或者不用权限的公用的页面挂载至 vue-router（ 初始路由 constantRoutes ）。

```javascript
import Vue from 'vue';
import Router from 'vue-router';

// 初始路由
export const constantRoutes = [
  { path: '/login', component: Login, meta: { requireAuth: false, name: '登录页' } },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    meta: { requiresAuth: true, name: '首页' },
    children: [{ path: 'dashboard', component: dashboard }]
  }
];

// 实例化vue的时候只挂载constantRoutes
export default new Router({
  routes: constantRoutes
});
```

2. 然后准备动态添加的动态路由（dynamicRoutes ）

```javascript
// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const dynamicRoutes = [
  {
    path: '/',
    component: Layout,
    name: 'container',
    redirect: 'home',
    meta: { requiresAuth: true, name: '首页' },
    children: [
      {
        path: 'home',
        component: Home,
        name: 'home',
        meta: {
          name: '首页'
        }
      }
    ]
  },
  { path: '/403', component: Forbidden },
  { path: '*', redirect: '/404', component: NotFound }
];
```

这里有一个需要非常注意的地方就是 404 页面一定要最后加载，如果放在 constantRoutes 一同声明了 404，后面的所以页面都会被拦截到 404。

3. 接着我们需要在 router.beforeEach()钩子函数中做一些操作

```javascript
router.beforeEach(async (to, from, next) => {
  // 判断是否需要认证
  if (to.matched.length && to.matched.some(item => item.meta.requireAuth)) {
    // 判断用户是否已经登录
    if (window.sessionStorage.getItem('token')) {
      if (to.path === '/login') {
        next(from.fullPath);
      } else {
        // 判断用户是否已经生成了动态路由
        const hasGeneratedRoutes = store.state.routes && store.state.routes.length > 0;
        if (hasGeneratedRoutes) {
          next();
        } else {
          // 没有路由，则进行动态路由的添加有权限的路由
          store.dispatch('permission/generateRoutes').then(() => {
            next({ path: to.path });
          });
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next(); // 在免登录白名单，直接进入
      } else {
        next('/login'); // 否则全部重定向到登录页
      }
    }
  } else {
    // 不需要认证直接跳转
    next();
  }
});
```

4. store.dispatch('permission/generateRoutes')做了什么？
   为了判断当前用户是否有路由权限表，需要在 vuex 的 新建一个 permission 模块

```javascript
import { dynamicRoutes, constantRoutes } from 'src/router';
const permission = {
  state: { routes: constantRoutes, addRoutes: [] },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.routes = constantRoutes.concat(routes);
      state.addRoutes = routes;
    }
  },
  actions: {
    async generateRoutes({ commit }) {
      // 获取后台给的权限数组
      const {
        data: { permissionList }
      } = await fetchPermission();
      // 根据后台返回的权限跟我们定义好的权限对比，筛选出有权限的路由并加入到path = ''的children中
      const realRoutes = recursionRouter(permissionList, dynamicRoutes);
      //  初始路由
      let initialRoutes = router.options.routes;
      // 动态的添加路由
      router.addRoute(realRoutes);
      commit('SET_ROUTES', realRoutes);
    }
  }
};
export default permission;
```

这里，await fetchPermission()获取后台给的权限数组，格式大概如下:

```json
{
  "code": 0,
  "message": "SUCCESS",
  "data": {
    "permissionList": [
      {
        "name": "订单管理",
        "children": [
          {
            "name": "订单列表"
          },
          {
            "name": "生产管理",
            "children": [
              {
                "name": "生产列表"
              }
            ]
          },
          {
            "name": "退货管理"
          }
        ]
      }
    ]
  }
}
```

然后根据我们写好的需要权限验证的路由数组（allRoutes），通过递归函数（recursionRouter）进行对比，过滤得到我们真实的路由数组，

```javascript
function recursionRouter(userRoutes = [], allRoutes = []) {
  const realRoutes = [];
  allRoutes.forEach(route => {
    userRoutes.forEach(item => {
      if (item.name === route.meta.name) {
        if (item.children && item.children.length > 0) {
          v.children = recursionRouter(item.children, route.children);
        }
        realRoutes.push(v);
      }
    });
  });
  return realRoutes;
}
```

得到过滤后的数组后，加入到 path 为''的 children 下面

```js
{
  "path": "",
  "component": Layout,
  "name": "container",
  "redirect": "home",
  "meta": {
    "requiresAuth": true,
    "name": "首页"
  },
  "children": [
    {
      "path": "home",
      "component": Home,
      "name": "home",
      "meta": {
        "name": "首页"
      }
    },
    <!-- 将上面得到的东西加入到这里 -->
    ...
  ]
}
```

路由添加完了，也就是 action 操作完毕了，即可在 action.then 里面调用 next({ path: to.path })进去路由。

这里要注意, next 里面要传参数即要进入的页面的路由信息，因为 next 传参数后，当前要进入的路由会被废止，转而进入参数对应的路由，虽然是同一个路由，这么做主要是为了确保 addRoute 生效了。

刷新页面后，根据我们 router.beforeEach 的判断，有 token 但是没 permissionList，我们是会重新触发 action 去获取路由的，所以无需担心。

**Reference：**

1. [详解基于 vue，vue-router, vuex 以及 addRoutes 进行权限控制](https://www.cnblogs.com/zhengrunlin/p/8981017.html)
2. [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://segmentfault.com/a/1190000009506097)

## 视图层面

路由层面主要用于控制菜单页面权限，某些场景下我们需要对视图层面进行一些控制，例如，我们根据后台返回的权限信息判断当前用户可以看到哪些应用的入口或者按钮操作，这些可以通过**指令控制**来实现。

### 指令控制

指令控制是结合 Vue 的[自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html#ad)实现权限控制，比如我们自定义一个权限指令 v-auth， 用于判断对应模块是否拥有某个权限，如果没有则移除当前按钮 dom 元素。具体方案：

首先，我们在 utils 文件夹下新建 authBtn.js

```javascript
import Vue from 'vue';

// 注册一个全局自定义指令 `v-auth`
Vue.directive('auth', {
  // 当被绑定的元素插入到 DOM 中时
  inserted(el, binding, vnode) {
    // 取出指令的值，例如 v-auth="['btn-1']"中的'btn-1'这个值
    const { value } = binding;
    // 从store中取出存储好的后端返回的按钮对应权限表，例如，
    // {
    //   name: 'btn-1', permission: true,
    //   name: 'btn-2', permission: false
    // }
    const buttonList = store.getters && store.getter.buttonList;
    // 判断value是否有值，类型是否正确
    if (value && value instanceof Array && value.length > 0) {
      const needAuthButtonName = value;
      // 判断是否有权限
      const hasPermission = buttonList.some(button => {
        return button.name && button.name === needAuthButtonName && button.permission;
      });
      if (!hasPermission) {
        // 如果没有权限就移除这个按钮元素
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  }
});
```

然后挂载在 main.js 中

```javascript
import '@/utils/authBtn.js';
```

然后，在 template 中就可以使用 v-auth 这个指令了

```javascript
<el-button v-auth='btn-1'></el-button>
```

因为 v-show 的话，dom 其实没有隐藏，用户可以改变 display 就看到，v-if 呢，则是删除之后会遗留备注\<!-- --> 信息。

## 接口层面

在实际项目使用中，请求库以 axios 较多，我们通常会使用 axios 的 API axios.interceptors.request.use 和 axios.interceptors.response.use 拦截器来做权限管理。

### 请求拦截器（axios.interceptors.request.use）

请求头添加 token 认证，或者也可以直接使用 cookie 中的授权信息，前提是要配置 withCredentials 为 true，也就是 axios.defaults.withCredentials = true, 开启 withCredentials 后，服务器才能拿到你的 cookie

```javascript
// 请求拦截器
axios.interceptors.request.use(
  request => {
    // 为所有的请求添加token字段
    request.headers.token = window.sessionStorage.get('token');
    return request;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
```

### 相应拦截器（axios.interceptors.response.use）

```javascript
axios.interceptors.response.use(
  response => {
    // 除了登录页，都需要验证token，验证不成功跳转至login页面
    if (location.href.indexOf('/login') === -1 && !window.sessionStorage.getItem('token')) {
      return router.push({ path: '/login' });
    }
    // 对错误进行统一处理
    if (response.data.code !== '0') {
      if (response.data.msg) {
        this.$message.error(response.data.msg);
      }
      return Promise.reject(response);
    }
    return Promise.resolve({
      code: response.data.code,
      msg: response.data.msg,
      data: response.data.data
    });
  },
  // 对错误进行统一处理
  error => {
    if (error.message.indexOf('timeout') > -1) {
      this.$message.error('请求超时，请重试！');
    }
    if (error.response.status === 401) {
      this.$alert('登录过期，请重新登录', '提示', {
        confirmButtonText: '确定',
        callback: () => {
          router.push({ path: '/login' });
        }
      });
    } else if (error.response.status === 403) {
      this.$alert('访问该应用的权限不足', '提示', {
        confirmButtonText: '确定',
        callback: () => {
          router.go(-1);
        }
      });
    }
    return Promise.reject(error);
  }
);
```

## 思考

1. 路由控制中为什么用 to.matched 来判断 ？

这是为了在嵌套路由中，只需要对等级最高的路由设备 meta.requiresAuth 字段就可以实现权限控制，访问其二级路由，to.matched 数组里面会匹配到的所有路由信息，对于页面较多应用时是非常方便的。
