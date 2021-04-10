### 组件

#### 二、vue 路由传参

项目中很多情况下都需要进行路由之间的传值，想过很多种方式 sessionstorage/localstorage/cookie 进行离线缓存存储也可以，用 vuex 也可以，不过有些大材小用吧，不管怎么说因场景而异

下面我来说下 vue 自带的路由传参的三种基本方式

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

可以看出需要在 path 中添加/:id 来对应 \$router.push 中 path 携带的参数。在子组件中可以使用来获取传递的参数值，另外页面获取参数如下

```csharp
this.$route.params.id
```

**第二种方法：**页面刷新数据会丢失

通过路由属性中的 name 来确定匹配的路由，通过 params 来传递参数。

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

对应路由配置: 注意这里不能使用:/id 来传递参数了，因为组件中，已经使用 params 来携带参数了。

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

**第三种方法**： 使用 path 来匹配路由，然后通过 query 来传递参数，这种情况下 query 传递的参数会显示在 url 后面?id=？

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

### 9 月 6 日周报

#### 一、点位户籍化项目进度——平台配置页面

​ 已完成内容：

​ 1、上级平台、联网平台、移动端平台配置页面开发完成，配置接口、URL 校验接口、穿梭框获取数据接口调试通过，数据回显无误。

​ 待测试内容：

​ 1、所需辖区接口在本地调用不通，暂时没有测试

​ 2、表格穿梭组件所属辖区表头需要做树状表格筛选功能的特殊处理，无法直接在前端做表格筛选。目前，表头的树状筛选组件已封装好，点击筛选直接调用后端查询接口，待测试。

![image-20200906134920053](C:\Users\liuchenxi\AppData\Roaming\Typora\typora-user-images\image-20200906134920053.png)

### 9 月 9 日

#### 一、子组件传值给父组件

这篇文章主要介绍了 vue 中子组件修改父组件数据的相关资料，文中介绍了 vue 中 watch 的认识，关于子组件修改父组件属性认识，本文给大家介绍的非常详细，具有一定的参考借鉴价值,需要的朋友可以参考下

**一、关于 vue 中 watch 的认识**

我们要监听一个属性的的变化就使用 watch 一般是父组件传递给子组件的时候

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

### 9 月 25 日

#### 一、Vue 实现文件的上传与下载

项目需求： 前端需要传入过多的参数给后端，get 地址栏不行，只能接受 post 方式去导出数据

##### 1、get 的下载方式

```javascript
通常下载方式如下：
 let url =  xxxx.action?a=xx&b=yy;
 window.location.href = url;
 // 或者
 window.open(url, '_self')
```

弊端：当请求参数较多时，get 的方式无法使用，这时候需要考虑 post 的方式，但是直接通过 ajax 的 post 的方式无法调用浏览器的下载功能

##### 2、post 的下载方式

原理： 创建一个隐藏 form 表单，通过 form 表单的提交刷新功能，实现下载。代码如下：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](<javascript:void(0);>)

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

注意点：传给后端的参数不是 json 对象的形式，而是 `currentPage=2&pageSize=20`, 因此需要后端兄弟的配合

#### 二、el-tree 中 simpleData 数据格式转换为普通格式

```javascript
export const _transform2NormalData = function(sNodes) {
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
        if (!tmpMap[sNodes[i][parentKey]][childKey]) {
          tmpMap[sNodes[i][parentKey]][childKey] = []
        }
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
moment(this.search.monthRange[1])
  .endOf('month')
  .format('YYYY-MM-DD HH:mm:ss')
```

### 9 月 27 日

一、nuxt.js [connect ECONNREFUSED 127.0.0.1:80 错误解决]

由于服务是 axios 请求，地址/api/use, 端口默认 80

了解过 nuxt 的生命周期，beforeCreated 和 created 是同时运行在服务端和客户端上的，mounted 以后才会运行在客户端。

之前 spa 项目在 created 生命周期里请求数据，我使用的三方 axios，那么整体转为 ssr，为避免大量改动，就还是使用的三方 axios，接口 /api/user ，现在这个会跑在服务端，那么 superagent 内部是用的 node url parse 去解析你的这个 /api 参数的，然后再传给相应的如 [http request](http://nodejs.cn/api/http.html#http_http_request_options_callback)，所以默认就是 80 端口。

问题原因找到了，那我们就需要改下生命周期就行了，让原先 spa 项目里在 created 里请求数据，全部改成 mounted 里去请求。果然问题就解决了。ui 的

### 11 月 19 日

##### 1、在表格的末尾添加小计和总计

```html
<div slot="append">
  <div class="sum-footer">
    <div class="col-title">小计</div>
    <div class="col-content">111</div>
    <div class="col-content">amount1</div>
    <div class="col-content">amount2</div>
    <div class="col-content">amount3</div>
  </div>
  <div class="sum-footer">
    <div class="col-title">总计</div>
    <div class="col-content">1111</div>
    <div class="col-content">amount1</div>
    <div class="col-content">amount2</div>
    <div class="col-content">amount3</div>
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

##### 2、图片的 URL 转 base64
