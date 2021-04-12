<!--
 * @Author: your name
 * @Date: 2021-04-10 11:43:59
 * @LastEditTime: 2021-04-10 11:57:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\component-communication.md
-->

# Vue 中组件之间的通信

> Vue 中组件的传值包括父子组件的传值（父传子、子传父、兄弟组件之间的传值）

## 基本概念

1. 在 vue 中，父子组件的关系可以总结为 **prop** 向下传递，**事件**向上传递。父组件通过 prop 给子组件下发数据，子组件通过事件给父组件发送信息。
2. 每个 Vue 实例都实现了事件接口，使用$on(eventName)监听事件；使用$emit(eventName,optionalPayload)触发事件。父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。

   ![img](https://upload-images.jianshu.io/upload_images/2891127-591b88f49fb05f19.png?imageMogr2/auto-orient/strip|imageView2/2/format/webp)

### 1. 子组件传值给父组件

1.1 常见的使用场景

```javascript
watch:{
  value(val) {
    console.log(val);
    this.visible = val;
  }
}
```

1.2 如果要一开始就执行

```javascript
...
watch: {
  firstName: {
    handler(newName, oldName) {
      this.fullName = newName + '-' + this.lastName;
    },
    immediate: true,
  }
}
...
```

**•3、深度监听(数组、对象)**

```javascript
...
watch: {
  obj: {
    handler(newName, oldName) {
    console.log('///')
  },
  immediate: true,
  deep: true,
}
...
```

### 2. 关于子组件修改父组件属性认识\*\*

在 vue2.0+ 后不再是双向绑定,如果要进行双向绑定需要特殊处理。

[Vue warn]: Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: "你修改的属性名"

**•1、通过事件发送给父组件来修改**

```javascript
**在子组件test1中**
<input type="text" v-model="book"/>
<button @click="add">添加</button>
<p v-for="(item, index) of books" :key="index">{{item}}</p>
...
methods: {
  add() {
    // 直接把数据发送给父组件
    this.$emit('update', this.book);
    this.book = '';
  },
},
**在父组件中**
<test1 :books="books" @update="addBook"></test1>
...
addBook(val) {
  this.books = new Array(val)
},
```

**•2、使用.sync 来让子组件修改父组件的值(其实是上面方法的精简版)**

```javascript
**在父组件中,直接在需要传递的属性后面加上.sync**
<test4 :word.sync="word"/>
**在子组件中**
<template>
  <div>
    <h3>{{word}}</h3>
    <input type="text" v-model="str" />
  </div>
</template>
<script>
export default {
  props: {
    word: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      str: '',
    }
  },
  watch: {
    str(newVal, oldVal) {
      // 在监听你使用update事件来更新word,而在父组件不需要调用该函数
      this.$emit('update:word', newVal);
    }
  }
}
</script>
```

**•3、在子组件中拷贝一份副本**

```javascript
**子组件中**
export default {
  props: {
    // 已经选中的
    checkModalGroup: {
      type: Array,
      default: [],
      required: false,
    }
  },
  data() {
    return{
      copyCheckModalGroup: this.checkModalGroup, // 选中的
    }
  },
  methods: {
    // 一个一个的选择
    checkAllGroupChange(data) {
      // 把当前的发送给父组件
      this.$emit('updata', data);
    },
  },
  watch: {
    checkModalGroup(newVal, oldVal) {
      this.copyCheckModalGroup = newVal;
    }
  }
}
**父组件中直接更新传递给子组件的数据就可以**
...
// 更新子组件数据
roleCheckUpdata(data) {
  this.roleGroup = data;
},
...
```
