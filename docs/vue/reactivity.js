/*
 * @Author: your name
 * @Date: 2021-04-19 16:13:15
 * @LastEditTime: 2021-04-19 19:08:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\vue\reactivity.js
 */
class Vue {
  constructor (options) {
    this._data = options.data
    observer(this._data)
  }
}

function observer (value) {
  if (!value || typeof value !== 'object') return
  Object.keys(value).forEach((key) => {
    // 定义响应式
    defineReactive(value, key, value[key])
  })
}

function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true /* 属性可枚举 */,
    configurable: true /* 属性可被修改或删除 */,
    get: function reactiveGetter () {
      console.log('监听获取', val)
      return val
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) return
      console.log('监听更新', newVal)
      val = newVal
    }
  })
}
const obj = new Vue({ data: { a: 'b', obj1: { b: 'b' } } })
obj._data.a = 'a'
console.log(obj._data.a)

class Watcher {
  // 代码经过简化
  constructor (vm, expOrFn, cb) {
    this.vm = vm // 传进来的对象 例如Vue
    this.cb = cb // 在Vue中cb是更新视图的核心，调用diff并更新视图的过程
    this.newDeps = [] // 收集Deps，用于移除监听
    this.getter = expOrFn
    Dep.target = this // 注意这里将当前的Watcher赋值给了Dep.target
    this.value = this.get() // 调用组件的更新函数
  }

  // 设置Dep.target值，用以依赖收集
  get () {
    const vm = this.vm
    let value = this.getter.call(vm, vm)
    return value
  }

  // 添加依赖
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
