# 组合式 API

:::tip
Composition-Api 是 Vue3.0 提出的，它以函数为载体，将业务相关的逻辑代码抽取到一起，整体打包对外提供相应能力。
:::

官网介绍：[什么是组合式 API？](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E5%90%88%E5%BC%8F-api)

composition-api 的优点：

1. 逻辑耦合度更高：在 options api 中如何一个功能需要用到 data + method + watch... 等更多 api，一段代码无法合并在一起，我们在阅读一段逻辑需要进行反复上下移动进行观看。而 composition api 就解决了这个问题。
2. 功能抽离：得益于函数式编程，一个功能逻辑我们可以封装到一个 hook 中，我们直接导入 hook，运行方法，即可。

缺点：从 options api 切换到 composition api 最大的问题无异于最大的问题就是没有强制的代码分区，如果书写的人没有很好的代码习惯，那么后续的人将会看的十分难受。

## Vue2 中的使用

```sh
npm i @vue/composition-api -S
```

在 Vue2 中 main.js 引入，

```js
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);
```

## 生命周期变化

- beforeCreate -> setup()
- created -> setup()
- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeDestroy -> onBeforeUnmount
- destroyed -> onUnmounted
- errorCaptured -> onErrorCaptured

## 钩子函数变化

### setup

`setup` 相当于是组件的入口了，可以调用所有组合函数。最后的 return，可以作为出口，确认要暴露给模板哪些内容。setup 接收两个参数，props 和 context。

```js
setup(props, context) {
  return {}
},
```

- props：跟 2.x 的 props 一样，接受父组件传过来的值。
- context：是一个上下文对象，包含了一些 2.x this 中的属性。如：

```
attrs: Object; // => this.$attrs
emit: f(); // => this.$emit
isServer: false; // 是否服务端渲染
listeners: Object; // => this.$listeners
parent: VueComponent; // => this.$parent
refs: Object; // => this.$refs
root: Vue; // => main.js 中的全局唯一的 vue 实例
slots: {} // => this.$slots
ssrContext: {} // => 服务端渲染
```

### reactive

对于响应式数据，我们可以通过 `reactive` 来创建。响应式转换是基于 es6 中的 `proxy` 实现的，返回的是一个代理后的对象，并不等于原始对象，避免依赖原始对象。

```js
import { reactive } from '@vue/composition-api';
export default {
  setup() {
    const state = reactive({ count: 0 });
    return { state };
  }
};
```

### toRefs

上面的例子中，我们在模板中使用的是 `state.count` 这种方式，获取响应式的数据。如果要写成写成 `count`，就需要用 `toRefs` 这个指令。

```js
import { reactive, toRefs } from '@vue/composition-api';
export default {
  setup() {
    const state = reactive({ count: 0 });
    return { ...toRefs(state) };
  }
};
```

### watch

`watch` 用来监听一个或多个数据的变化，并在回调中执行副作用。

```js
export default {
  setup() {
    const state = reactive({ count: 0, msg: 'ha' });
    // 监听一个数据的变化
    watch(
      () => state.count,
      (count, preCount) => {
        console.log(count, preCount);
      }
    );
    // 监听多个数据的变化
    watch([() => state.count, () => state.msg], ([count, msg], [preCount, preMsg]) => {
      console.log(count, msg, preCount, preMsg);
    });
    const addCount = () => {
      state.count++;
    };
    return { ...toRefs(state), addCount };
  }
};
```

使用 `watchEffect` 监听数据的变化，

```js
watchEffect(() => {
  console.log(state.count);
});
```

`watch` 与 `watchEffect` 的区别：

1. `watchEffect` 在组件初始化时，立即执行传入的一个副作用函数，并且在副作用函数中使用的属性有变化时，会重新执行。需要注意，当副作用函数中执行的函数，若该函数又改变了响应式的数据，可能会造成死循环问题。
2. `watch` 是监听指定的属性，当指定属性变化时，才会执行回调，watch 可以接收指定的一个或多个属性, watch 中可以获取状态变化前后的值。

## 组件通信

### $emit

父组件：

```vue
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
  components: { Add },
  setup() {
    const state = reactive({ count: 0 });
    const addCount = () => state.count++;
    return {
      ...toRefs(state),
      addCount
    };
  }
};
</script>
```

子组件：

```vue
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

### store

在 `context.root` 中，我们可以获取到 2.x 中的 this.$store。

```html
<template>
  <button @click="addCount">{{ count }}</button>
</template>

<script>
  import { computed, reactive, toRefs } from '@vue/composition-api';
  export default {
    setup(props, { root }) {
      const store = root.$store;
      const state = reactive({
        count: computed(() => store.state.count) // 获取 store 中的值
      });
      const addCount = () => {
        store.commit('increase'); // 改变 store 中的值
      };
      return { ...toRefs(state), addCount };
    }
  };
</script>
```

## 样式库中使用变化

### $message、$confirm

```js
export default {
  setup(props, { root }) {
    const { $store, $message, $router, $route } = ctx.root
    $message.success(message: '删除成功')
  }
}
```

### $refs

```js
import { reactive, ref } from '@vue/composition-api';
export default {
  setup() {
    const formRef = ref(null);
    const handleSave = () => {
      formRef.value.validate(valid => {
        if (valid) {
          saveConfig;()
        } else {
          storageForm.value.focusFirstField();
          return false;
        }
      });
    };
    return {
      handleSave
    };
  }
};
```

### $nextTick

```js
import Vue from 'vue';
export default {
  setup() {
    Vue.nextTick();
  }
};
```
