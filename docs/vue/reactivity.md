<!--
 * @Author: 刘晨曦
 * @Date: 2021-04-19 11:52:47
 * @LastEditTime: 2021-04-19 20:28:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\vue\reactivity.md
-->

# 响应式原理

> Vue.js 是一款 MVVM 框架，数据模型（ViewModel）是普通的 JavaScript 对象，但是对这些对象进行操作时，却能影响对应视图（View），它的核心实现就是「响应式系统」。

Vue2.0 的响应式是基于 **Object.defineProperty** 的 setter 和 getter 方法的**观察者模式**来实现的。

## 观察者模式

首先，我们先说下什么是观察者模式（Observer），又称发布-订阅者模式。基本模型如下：

```javascript
class Observer {
  constructor() {}
  // 订阅信息接口
  subscribe() {}
  // 发布信息接口
  notify() {}
  // 删除信息接口
  remove() {}
}
```

## 响应式系统实现

### 1. init 阶段

在 Vue 的构造函数中，对 options 的 data 进行处理，即在初始化 vue 实例的时候，对 data、props 等对象的每一个属性都通过 **Object.defineProperty** 定义一次 setter 和 getter 方法。

```javascript
/* Vue构造类 */
class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
  }
}

function observer(value) {
  if (!value || typeof value !== 'object') return
  Object.keys(value).forEach((key) => {
    // 定义响应式
    defineReactive(value, key, value[key])
  })
}

function defineReactive(obj, key, val) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true /* 属性可枚举 */,
    configurable: true /* 属性可被修改或删除 */,
    get: function reactiveGetter() {
      console.log('监听获取', val)
      dep.depend()
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return
      console.log('监听更新', newVal)
      val = newVal
      dep.notify() // 发布
    },
  })
}
```

_注：Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。_

其中，Dep 就是一个观察者类，每一个 data 的属性都会有一个 dep 对象。当 getter 调用的时候，去 dep 里注册函数，当数据发生改变的时候，统一去通知各个地方做对应的操作。Dep 的基本模式如下：

```javascript
export default class Dep {
  static target: ?Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  // 添加订阅
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  // 删除订阅
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  // 依赖收集
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  // 发布
  notify() {
    const subs = this.subs.slice() // 拷贝
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

### 2. mount 阶段

Watcher 类的对象会在 mount 阶段调用，Watcher 实际上是连接 Vue 组件与 Dep 观察者之间的桥梁。

```javascript
mountComponent(vm: Component, el: ?Element, ...) {
  vm.$el = el
  updateComponent = () => {
    vm._update(vm._render(), ...)
  }
  new Watcher(vm, updateComponent, ...)
}

class Watcher {
  // 代码经过简化
  constructor (vm, expOrFn, cb) {
    this.vm = vm // 传进来的对象 例如Vue
    this.cb = cb // 在Vue中cb是更新视图的核心，调用diff并更新视图的过程
    this.newDeps = [] // 收集Deps，用于移除监听
    this.getter = expOrFn // 传入updateComponent函数
    this.value = this.get() // 调用组件的更新函数
  }

  // 设置Dep.target值，用以依赖收集
  get () {
    const vm = this.vm
    let value = this.getter.call(vm, vm)
    return value
  }

  // 添加依赖 dep.depend()时调用
  addDep (dep) {
    // 这里简单处理，在Vue中做了重复筛选，即依赖只收集一次，不重复收集依赖
    this.newDeps.push(dep)
    dep.addSub(this)
  }

  // 更新
  update () {
    this.run()
  }

  // 更新视图
  run () {
    // 这里只做简单的console.log 处理，在Vue中会调用diff过程从而更新视图
    console.log(`这里会去执行Vue的diff相关方法，进而更新数据`)
  }
}
```

在 new Watcher 的时候，constructor 里的 this.getter.call(vm, vm)函数会被执行。getter 就是 updateComponent。这个函数会调用组件的 render 函数来更新重新渲染。

而 render 函数里，会访问 data 的属性，比如

```javascript
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

此时会去调用 blogTitle 这个属性的 getter 函数，即：

```javascript
// 每个对象的getter函数
get: function reactiveGetter() {
  console.log('监听获取', val)
  dep.depend()
  return val
},

// dep的depend函数 收集依赖
depend () {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}
```

在 depend 的函数里，Dep.target 就是 watcher 本身，这里做的事情就是给 blogTitle 注册了 Watcher 这个对象。这样每次 render 一个 vue 组件的时候，如果这个组件用到了 blogTitle，那么这个组件相对应的 Watcher 对象都会被注册到 blogTitle 的 Dep 中。

这个过程就叫做**依赖收集**。

收集完所有依赖 blogTitle 属性的组件所对应的 Watcher 之后，当它发生改变的时候，就会去通知 Watcher 更新关联的组件。

### 3. 更新阶段

当 blogTitle 发生改变的时候，就去调用 Dep 的 notify 函数,然后通知所有的 Watcher 调用 update 函数更新。

```javascript
notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
}
```

用一张图来表示：
![img](https://pic2.zhimg.com/80/v2-cbc890983833db0a0b35841c05f4d3d1_720w.jpg)

## Watcher 的产生

在 vue 中，共有 4 种情况会产生 Watcher：

1. Vue 实例对象上的 watcher，观测根数据，发生变化时重新渲染组件 updateComponent = () => { vm.\_update(vm.\_render(), hydrating)} vm.\_watcher = new Watcher(vm, updateComponent, noop)
2. 用户在 vue 对象内用 watch 属性创建的 watcher
3. 用户在 vue 对象内创建的计算属性，本质上也是 watcher
4. 用户使用 vm.\$watch 创建的 watcher

## 总结

![img](https://pic3.zhimg.com/80/v2-abc8633ff694fe9aef01c0673dcac976_720w.jpg)

1. 第一步：组件初始化的时候，先给每一个 Data 属性都注册 getter，setter，也就是 reactive 化。mount 阶段，每个组件会 new 一个 Watcher 对象，此时 watcher 会立即调用组件的 render 函数（updateComponent）去生成虚拟 DOM。在调用 render 的时候，就会需要用到 data 的属性值，此时会触发 getter 函数，将当前的 Watcher 函数注册进 sub 里。

![img](https://pic3.zhimg.com/80/v2-f750a195dba1d0b5ab73b50edc3d8ffa_720w.jpg)

2. 第二步：当 data 属性发生改变之后，就会遍历 sub 里所有的 watcher 对象，通知它们去重新渲染组件。

## 注意事项

1. 对于对象，Vue 无法检测 property 的添加或移除

```javascript
var vm = new Vue({
  data: {
    a: 1,
  },
})

// `vm.a` 是响应式的

vm.b = 2
// `vm.b` 是非响应式的
```

因此如果想要属性是相应式的（reactive），必须写在 data 对象里面，或者使用 Vue.set(vm.someObject, 'b', 2)动态添加。

2. Vue 不能检测以下数组的变动

- 当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
- 当你修改数组的长度时，例如：vm.items.length = newLength

这是因为数组的响应式是不够完全的，Vue 只重写了有限的方法，重写逻辑如下：

```javascript
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function(method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

同样，可以使用 Vue.set(vm.items, indexOfItem, newValue)修改。

## References

1. [最简化 VUE 的响应式原理](https://zhuanlan.zhihu.com/p/88648401)
2. [VUE 源码解读之响应式系统及 Watcher 的调度实现](https://mp.weixin.qq.com/s/zDv_IQ36o_rRD25xN9uyuw)

---

更新时间 2021.04.19
