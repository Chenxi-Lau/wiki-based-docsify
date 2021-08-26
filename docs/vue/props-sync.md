<!--
 * @Author: 刘晨曦
 * @Date: 2021-04-10 11:43:59
 * @LastEditTime: 2021-08-26 15:15:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\component-communication.md
-->

## .sync 属性

> 在开发过程中，我们会遇到这样报错 _Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value._ 这种问题如何解决？

### 基本概念

首先，说一下 Vue 中组件传值的基本概念，

1. 在 vue 中，父子组件的关系可以总结为： **prop** 向下传递，**事件**向上传递。父组件通过 **prop** 给子组件下发数据，子组件通过**事件**给父组件发送信息。
2. 每个 Vue 实例都实现了事件接口，使用$on(eventName)监听事件；使用$emit(eventName,optionalPayload)触发事件。父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。

Vue 中子组件不能直接修改父组件的属性，不然出现 Warning 错误，不过可以通过以下方法来解决。

### 子组件修改父组件属性

#### 1. 通过事件传递

子组件 child.vue 中

```vue
<template>
  <div>
    <h3>{{ word }}</h3>
    <el-input type="text" v-model="str" @change="handleChange" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      str: ''
    };
  },
  props: {
    word: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleChange() {
      // 直接把数据发送给父组件
      this.$emit('update', this.str);
    }
  }
};
</script>
```

在父组件中

```vue
<template>
  <child :word="word" @update="update"></child>
</template>
<script>
import child from './child.vue';
export default {
  component: { child },
  method: {
    update(val) {
      this.word = val;
    }
  }
};
</script>
```

#### 2. 使用.sync 属性

上面方法可以通过在子组件绑定值加上**.sync** 属性，来简化子组件修改父组件值的过程。

在父组件中,直接在需要传递的属性后面加上.sync

```vue
<template>
  <child :word.sync="word" />
</template>
<script>
import child from './child.vue';
export default {
  component: { child }
};
</script>
```

子组件中

```vue
<template>
  <div>
    <h3>{{ word }}</h3>
    <input type="text" v-model="str" @change="handleChange" />
  </div>
</template>
<script>
export default {
  props: {
    word: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      str: ''
    };
  },
  method: {
    handleChange() {
      this.$emit('update:word', this.str);
    }
  }
};
</script>
```
