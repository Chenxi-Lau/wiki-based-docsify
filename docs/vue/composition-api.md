<!--
 * @Author: your name
 * @Date: 2021-09-13 17:01:17
 * @LastEditTime: 2021-09-14 20:52:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki-based-docsify\docs\vue\composition-api.md
-->

## Composition-api

> Composition-api 是 Vue3.0 提出了，以函数为载体，将业务相关的逻辑代码抽取到一起，整体打包对外提供相应能力

官网介绍：[什么是组合式 API？](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E5%90%88%E5%BC%8F-api)

### 在 Vue 2.0 中的使用

```sh
npm i @vue/composition-api -S
```

在 Vue2 中 main.js 引入，

```js
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);
```

### 生命周期变化

- beforeCreate -> setup()
- created -> setup()
- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeDestroy -> onBeforeUnmount
- destroyed -> onUnmounted
- errorCaptured -> onErrorCaptured

### 钩子函数的作用

#### setup

setup 相当于是组件的入口了，可以调用所有组合函数。最后的 return，可以作为出口，确认要暴露给模板哪些内容。setup 接收两个参数，props 和 context。

```js
setup(props, context) {
  //
  return {}
},
```

props：跟 2.x 的 props 一样，接受父组件传过来的值。
context：是一个上下文对象，包含了一些 2.x this 中的属性。如：

```js
attrs: Object; // => this.$attrs
emit: f(); // => this.$emit
isServer: false; // 是否服务端渲染
listeners: Object; // => this.$listeners
parent: VueComponent; // => this.$parent
refs: Object; // => this.$refs
root: Vue; // => main.js 中的全局唯一的 vue 实例
slots: {
} // => this.$slots
ssrContext: {
} // => 服务端渲染
```

#### reactive

对于响应式数据，我们可以通过 reactive 来创建。响应式转换是基于 es6 中的 proxy 实现的，返回的是一个代理后的对象，并不等于原始对象。

```html
<template>
  <div class="hello">
    <h1>{{ state.count }}</h1>
    <button @click="addCount">加</button>
  </div>
</template>

<script>
  import { reactive } from '@vue/composition-api';
  export default {
    setup() {
      const state = reactive({
        count: 0
      });
      const addCount = () => {
        state.count++;
      };
      return { state, addCount };
    }
  };
</script>
```

#### toRefs

上面的栗子中，我们在模板中使用的是 state.count 这种方式，获取响应式的数据。如果要把{{ state.count }}写成{{ count }}，就需要用 toRefs 了。

```js
import { reactive, toRefs } from '@vue/composition-api';
export default {
  setup() {
    const state = reactive({
      count: 0
    });
    return { ...toRefs(state) };
  }
};
```

#### watch

watch 用来监听一个或多个数据的变化，并在回调中执行副作用。

```js
  setup() {
    const state = reactive({
      count: 0,
      msg: 'ha'
    })
    // 监听一个数据的变化
    watch(
      () => state.count,
      (count, preCount) => {
        console.log(count, preCount)
      }
    )
	// 监听多个数据的变化
    watch([() => state.count, () => state.msg], ([count, msg], [preCount, preMsg]) => {
      console.log(count, msg, preCount, preMsg)
    })

    const addCount = () => {
      state.count++
    }

    return { ...toRefs(state), addCount }
  }
```

使用 watchEffect 监听数据的变化，

```js
watchEffect(() => {
  console.log(state.count);
});
```

watch 与 watchEffect 的区别：

1. watchEffect 在组件初始化时，立即执行传入的一个副作用函数。并且在副作用函数中使用的属性有变化时，会重新执行。需要注意，当副作用函数中执行的函数，若该函数又改变了响应式的数据，可能会造成死循环问题。
2. watch 是监听指定的属性，当指定属性变化时，才会执行回调。watch 可以接收指定的一个或多个属性。 watch 中可以获取状态变化前后的值。

### 组件通信

#### emit

```html
// 父组件
<template>
  <div class="hello">
    <h1>{{ count }}</h1>
    <Add @addCount="addCount" />
  </div>
</template>

<script>
  import { reactive, toRefs } from '@vue/composition-api';
  import Add from './Add';
  export default {
    setup() {
      const state = reactive({
        count: 0
      });

      const addCount = () => {
        state.count++;
      };

      return { ...toRefs(state), addCount };
    },
    components: { Add }
  };
</script>
------------------------------------------- // 子组件 add.vue
<template>
  <button @click="addCount">加</button>
</template>

<script>
  export default {
    setup(props, { emit }) {
      const addCount = () => {
        emit('addCount');
      };
      return { addCount };
    }
  };
</script>
```

#### store

在 context.root 中，我们可以获取到 2.x 中的 this.$store。

```html
<template>
  <button @click="addCount">+{{ count }}</button>
</template>

<script>
  import { computed, reactive, toRefs } from '@vue/composition-api';

  export default {
    setup(props, { root }) {
      const store = root.$store;
      const state = reactive({
        // 获取 store 中的值
        count: computed(() => store.state.count)
      });
      const addCount = () => {
        // 改变 store 中的值
        store.commit('increase');
      };
      return { ...toRefs(state), addCount };
    }
  };
</script>
```

在 store.js 中

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  count: 1
};

const mutations = {
  increase(state) {
    state.count++;
  }
};

export default new Vuex.Store({
  state,
  mutations
});
```
