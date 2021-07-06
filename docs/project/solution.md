<!--
 * @Author: your name
 * @Date: 2021-02-07 09:29:49
 * @LastEditTime: 2021-07-06 20:28:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\solution.md
-->

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

### 9 月 27 日

一、nuxt.js [connect ECONNREFUSED 127.0.0.1:80 错误解决]

由于服务是 axios 请求，地址/api/use, 端口默认 80

了解过 nuxt 的生命周期，beforeCreated 和 created 是同时运行在服务端和客户端上的，mounted 以后才会运行在客户端。

之前 spa 项目在 created 生命周期里请求数据，我使用的三方 axios，那么整体转为 ssr，为避免大量改动，就还是使用的三方 axios，接口 /api/user ，现在这个会跑在服务端，那么 superagent 内部是用的 node url parse 去解析你的这个 /api 参数的，然后再传给相应的如 [http request](http://nodejs.cn/api/http.html#http_http_request_options_callback)，所以默认就是 80 端口。

问题原因找到了，那我们就需要改下生命周期就行了，让原先 spa 项目里在 created 里请求数据，全部改成 mounted 里去请求。果然问题就解决了。ui 的
