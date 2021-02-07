# 每日总结

#### 1、Vue.js 相关知识梳理

###### Vue的响应式

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
this.$set(this.someObject,'b',2)
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



#### Vue.js的API

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





### 组件

#### 一、手写搜索栏

```javascript
      <!-- 顶部搜索栏 -->
      <!-- <div class="search-form">
        <el-form v-model="search"
                 label-position="top">
          <el-row>
            <el-col :span='6'>
              <el-form-item label='选择时段'
                            class="search-form-item"
                            prop="timeRange">
                <el-date-picker v-model="search.timeRange"
                                type="datetimerange"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label='选择范围'
                            style="width:50%"
                            class="search-form-item"
                            prop='usersOrGroup'>
                <el-button style="min-width:94%;">
                  <i class="h-icon-add"
                     style='font-size:16px'></i>
                  单击选择点位(默认全选)
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span='6'>
              <el-form-item class="search-form-action">
                <el-button type="primary"
                           :min-width='78'> 查询 </el-button>
                <el-button @click="handleReset"
                           :min-width='78'> 重置 </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div> -->
```



#### 二、vue路由传参

项目中很多情况下都需要进行路由之间的传值，想过很多种方式 sessionstorage/localstorage/cookie 进行离线缓存存储也可以，用vuex也可以，不过有些大材小用吧，不管怎么说因场景而异

下面我来说下vue自带的路由传参的三种基本方式

先有如下场景 点击当前页的某个按钮跳转到另外一个页面去，并将某个值带过去

```csharp
<div class="examine" @click="insurance(2)">查看详情</div>
```



**第一种方法：**页面刷新数据不会丢失

```javascript
methods：{
  insurance(id) {
       //直接调用$router.push 实现携带参数的跳转
        this.$router.push({
          path: `/particulars/${id}`,
     })
}
```

需要对应路由配置如下：

```css
{
     path: '/particulars/:id',
     name: 'particulars',
     component: particulars
   }
```

可以看出需要在path中添加/:id来对应 $router.push 中path携带的参数。在子组件中可以使用来获取传递的参数值，另外页面获取参数如下

```csharp
this.$route.params.id
```



**第二种方法：**页面刷新数据会丢失

通过路由属性中的name来确定匹配的路由，通过params来传递参数。

```javascript
methods：{
  insurance(id) {
       this.$router.push({
          name: 'particulars',
          params: {
            id: id
          }
     })
}
```

对应路由配置: 注意这里不能使用:/id来传递参数了，因为组件中，已经使用params来携带参数了。

```javascript
 {
     path: '/particulars',
     name: 'particulars',
     component: particulars
   }
```

子组件中: 这样来获取参数

```javascript
this.$route.params.id
```



**第三种方法**： 使用path来匹配路由，然后通过query来传递参数，这种情况下 query传递的参数会显示在url后面?id=？

```javascript
methods：{
  insurance(id) {
        this.$router.push({
          path: '/particulars',
          query: {
            id: id
          }
     })
 }
```

对应路由配置：

```javascript
{
     path: '/particulars',
     name: 'particulars',
     component: particulars
}
```

对应子组件: 这样来获取参数

```javascript
this.$route.query.id
```

特别注意哦，组件中 获取参数的时候是![route.params 而不是](https://math.jianshu.com/math?formula=route.params%20%E8%80%8C%E4%B8%8D%E6%98%AF)router 这很重要~~~



### 9月6日周报

#### 一、点位户籍化项目进度——平台配置页面

​	已完成内容：

​	1、上级平台、联网平台、移动端平台配置页面开发完成，配置接口、URL校验接口、穿梭框获取数据接口调试通过，数据回显无误。

​	待测试内容：

​	1、所需辖区接口在本地调用不通，暂时没有测试

​	2、表格穿梭组件所属辖区表头需要做树状表格筛选功能的特殊处理，无法直接在前端做表格筛选。目前，表头的树状筛选组件已封装好，点击筛选直接调用后端查询接口，待测试。

![image-20200906134920053](C:\Users\liuchenxi\AppData\Roaming\Typora\typora-user-images\image-20200906134920053.png)



### 9月9日

#### 一、子组件传值给父组件

这篇文章主要介绍了vue中子组件修改父组件数据的相关资料，文中介绍了vue中watch的认识，关于子组件修改父组件属性认识，本文给大家介绍的非常详细，具有一定的参考借鉴价值,需要的朋友可以参考下

**一、关于vue中watch的认识**

我们要监听一个属性的的变化就使用watch一般是父组件传递给子组件的时候

**•1、常见的使用场景**

```javascript
watch:{
  value(val) {
    console.log(val);
    this.visible = val;
  }
}
```

**•2、如果要一开始就执行**

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

**二、关于子组件修改父组件属性认识**

在vue2.0+ 后不再是双向绑定,如果要进行双向绑定需要特殊处理。

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



### 9月25日

#### 一、Vue实现文件的上传与下载

项目需求： 前端需要传入过多的参数给后端，get地址栏不行，只能接受post方式去导出数据

##### 1、get的下载方式

```javascript
通常下载方式如下：
 let url =  xxxx.action?a=xx&b=yy;
 window.location.href = url;
 // 或者
 window.open(url, '_self')
```

弊端：当请求参数较多时，get的方式无法使用，这时候需要考虑post的方式，但是直接通过ajax的post的方式无法调用浏览器的下载功能

##### 2、post的下载方式

原理： 创建一个隐藏form表单，通过form表单的提交刷新功能，实现下载。代码如下：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
    // vue项目代码
  // 导出excel
    postExcelFile(params, url) {
      //params是post请求需要的参数，url是请求url地址
      var form = document.createElement("form");
      form.style.display = "none";
      form.action = url;
      form.method = "post";
      document.body.appendChild(form);
    // 动态创建input并给value赋值
      for (var key in params) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }

      form.submit();
      form.remove();
    }

    //调用
     this.postExcelFile(
        { currentPage: 2, pageSize: 20 },
        'url/xxxxxxx/'
      );
```

注意点：传给后端的参数不是json对象的形式，而是 `currentPage=2&pageSize=20`, 因此需要后端兄弟的配合



#### 二、el-tree中simpleData数据格式转换为普通格式

```javascript
export const _transform2NormalData = function (sNodes) {
  const key = 'indexCode'
  const parentKey = 'parentIndexCode'
  const childKey = 'children'
  if (!key || key === '' || !sNodes) return []
  if (sNodes.length > 0) {
    const r = []
    const tmpMap = []
    for (let i = 0; i < sNodes.length; i++) {
      tmpMap[sNodes[i][key]] = sNodes[i]
    }
    for (let i = 0; i < sNodes.length; i++) {
      if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] !== sNodes[i][parentKey]) {
        if (!tmpMap[sNodes[i][parentKey]][childKey]) { tmpMap[sNodes[i][parentKey]][childKey] = [] }
        tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i])
      } else {
        r.push(sNodes[i])
      }
    }
    return r
  } else {
    return [sNodes]
  }
}
```





#### 三、moment.js

##### 1、获取当月的最后一天

```javascript
moment(this.search.monthRange[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss')
```





### 9月27日

一、nuxt.js [connect ECONNREFUSED 127.0.0.1:80错误解决]

由于服务是axios 请求，地址/api/use, 端口默认80

了解过nuxt的生命周期，beforeCreated 和 created 是同时运行在服务端和客户端上的，mounted以后才会运行在客户端。

之前spa项目在created生命周期里请求数据，我使用的三方axios，那么整体转为ssr，为避免大量改动，就还是使用的三方axios，接口 /api/user ，现在这个会跑在服务端，那么superagent 内部是用的node url parse 去解析你的这个 /api 参数的，然后再传给相应的如 [http request](http://nodejs.cn/api/http.html#http_http_request_options_callback)，所以默认就是80端口。

问题原因找到了，那我们就需要改下生命周期就行了，让原先spa项目里在created里请求数据，全部改成mounted里去请求。果然问题就解决了。ui的





### 11月19日

##### 1、在表格的末尾添加小计和总计

```html
    <div slot="append">
          <div class="sum-footer">
            <div class='col-title'>小计</div>
            <div class='col-content'>111</div>
            <div class='col-content'>amount1</div>
            <div class='col-content'>amount2</div>
            <div class='col-content'>amount3</div>
          </div>
          <div class="sum-footer">
            <div class='col-title'>总计</div>
            <div class='col-content'>1111</div>
            <div class='col-content'>amount1</div>
            <div class='col-content'>amount2</div>
            <div class='col-content'>amount3</div>
          </div>
        <!-- <div class='sum_footer'>
            <div class='sum_footer_unit center'>合计</div>
            <div class='sum_footer_unit'></div>
            <div class='sum_footer_unit'>amount1</div>
            <div class='sum_footer_unit'>amount2</div>
            <div class='sum_footer_unit'>amount3</div>
          </div> -->
        </div>
```



```javascript
    adjustWidth () {
      const tableWidth = this.$refs.table.bodyWidth
      const footer = document.getElementsByClassName('sum-footer')
      footer.forEach(v => {
        v.style = `width: ${tableWidth}`
      })
      const contentWidth = (tableWidth.replace('px', '') - 100) / 4 + 'px'
      console.log(tableWidth, contentWidth, 'contentWidth')
      const footerContent = document.getElementsByClassName('col-content')
      footerContent.forEach(v => {
        v.style = `width: ${contentWidth}`
      })
    }
```



##### 2、图片的URL转base64