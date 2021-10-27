# 组件之间传值

> 在开发过程中，我们会遇到这样报错需要修改子组件 Props 中的数据，但这种是不允许的，Props 基本概念是向下传递，不允许子组件直接修改父组件的属性，这种问题如何解决？

## 问题及原因

如果在子组件直接修改父组件的值，会出现以下报错：

_Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value._

这是因为，所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解。

在 Vue 中，父子组件的关系可以总结为：

1. **Prop** 向下传递，**事件**向上传递。父组件通过 **Prop** 给子组件下发数据，子组件通过**事件**给父组件发送信息。
2. 每个 Vue 实例都实现了事件接口，使用$on(eventName)监听事件；使用$emit(eventName,optionalPayload)触发事件。父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。

## 解决办法

### 通过事件传递

```vue
// 子组件 child.vue
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

```vue
// 在父组件中
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

### 2. 使用.sync 属性

上面方法可以通过在子组件绑定值加上**.sync** 属性，来简化子组件修改父组件值的过程。

```vue
// 在父组件中,直接在需要传递的属性后面加上.sync
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

```vue
// 子组件中
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
