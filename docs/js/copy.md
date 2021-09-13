<!--
 * @Author: your name
 * @Date: 2021-08-26 15:18:57
 * @LastEditTime: 2021-08-30 10:51:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MyGithub\wiki-based-docsify\docs\js\copy.md
-->

## 深拷贝 & 浅拷贝

> Object 是引用数据类型，存储在堆内存中，浅拷贝只是拷贝了另一个对象的内存地址，所以在修改时会同时修改另一个对象，而深拷贝会开辟新的内存地址，所以不会影响另一个对象。

### 浅拷贝

```js
let obj1 = { a: '1', b: { c: 1 } };
// 直接赋值
let obj2 = obj1;
// Object.assign() 拷贝的是属性值。假如源对象的属性值是一个指向对象的引用，它也只拷贝那个引用值
let obj3 = Object.assign({}, obj1);
```

扩展运算符（...）在多层级的情况下也是浅拷贝。简易版扩展运算符的实现：

```js
// 简单版实现
function _spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(arguments[i]);
  }
  return ar;
}
```

### 深拷贝

```javascript
//  JSON.parse && JSON.stringify 性能最高，速度最快，但是只能拷贝纯json
function deepClone(obj){
  return JSON.parse(JSON.stringify(obj))
}

// 递归
var deepClone = function (obj) {
  if (typeof obj !== 'object') return
    var newObj = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
      newObj[key] =
      typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return newObj
}

//  History API
function deepClone(obj) {
  const oldState = history.state
  history.replaceState(obj, document.title)
  const copy = history.state
  history.replaceState(oldState, document.title)
  return copy
}

//MessageChannel 异步方法
const obj = ...
const clone = await deepClone(obj)
function deepClone(obj) {
  return new Promise(resolve => {
    const {port1, port2} = new MessageChannel()
    port2.onmessage = ev => resolve(ev.data)
    port1.postMessage(obj)
  });
}

// lodash 中的方法
function deepClone(obj) {
  var copy;

  if (null == obj || "object" != typeof obj) return obj;
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = deepClone(obj[i]);
    }
    return copy;
  }
  if (obj instanceof Function) {
    copy = function() {
      return obj.apply(this, arguments);
    }
    return copy;
  }
  if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
      }
      return copy;
  }
  throw new Error("Unable to copy obj as type isn't supported " + obj.constructor.name);
}
```
