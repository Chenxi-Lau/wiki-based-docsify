## Vue.js 相关知识梳理

### Vue 的响应式

由于 JavaScript 的限制，Vue **不能检测**数组和对象的变化。尽管如此我们还是有一些办法来回避这些限制并保证它们的响应性。

**对于对象**

Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 get

ter/setter 转化，所以 property 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的。

对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 `Vue.set(object, propertyName, value)` 方法向嵌套对象添加响应式 property。例如，对于：

```javascript
Vue.set(vm.someObject, 'b', 2)
```

您还可以使用 `vm.$set` 实例方法，这也是全局 `Vue.set` 方法的别名：

```javascript
this.$set(this.someObject, 'b', 2)
```

**对于数组**

Vue 不能检测以下数组的变动：

1. 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`

```javascript
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
// equal to vm.$set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

### Vue.js 的 API

###### [Vue.set( target, propertyName/index, value )](https://cn.vuejs.org/v2/api/#Vue-set)

- **参数**：
  - `{Object | Array} target`
  - `{string | number} propertyName/index`
  - `{any} value`

Vue.use()向响应式对象中添加一个 **property**，并确保这个新 property 同样是**响应式**的，且触发视图更新。

###### [Vue.use( plugin )](https://cn.vuejs.org/v2/api/#Vue-use)

- **参数**：
  - `{Object | Function} plugin`

安装 Vue.js 插件。如果插件是一个对象，必须提供 `install` 方法。如果插件是一个函数，它会被作为 install 方法。

###### [Vue.mixin( mixin )](https://cn.vuejs.org/v2/api/#Vue-mixin)

- **参数**：

  - `{Object} mixin`

- **用法**：

  全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项

  **数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。**

  **同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子**之前**调用。**

###### Vue.component( id, [definition\] )](https://cn.vuejs.org/v2/api/#Vue-component)

- **参数**：

  - `{string} id`
  - `{Function | Object} [definition]`

- **用法**：

  注册或获取全局组件。注册还会自动使用给定的 `id` 设置组件的名称
