# 基础知识

## 作用域

> 作用域是可访问变量的集合

在 ES5 中只有有两种作用域类型：

1. 全局作用域
2. 函数作用域

在 ES6 中引入 let 和 const 关键字，从而支持块级作用域的概念。

**全局作用域：**

```js
var carName = ' Volvo'; // 此处可调用 carName 变量

function myFunction() {
  // 函数内可调用 carName 变量
}
```

如果变量在函数内没有声明（没有使用 var 关键字），该变量为全局变量。

```js
// 此处可调用 carName 变量
function myFunction() {
  carName = 'Volvo';
  // 此处可调用 carName 变量
}
```

**局部作用域：**
块级作用域就是使用一对大括号包裹的一段代码，比如函数、判断语句、循环语句，甚至单独的一个{}都可以被看作是一个块级作用域。let 不存在变量提升（必须先声明，声明前不能进行赋值等相关操作）

```js
{
  carName = 'Volvo'; // Uncaught ReferenceError: carName is not defined
  let carName;
  console.log(carName);
}
```

## this 指向性问题汇总

> This 指向分为四种绑定规则：默认绑定、隐式绑定、显式绑定以及关键字 new 绑定。在 ES6 之后，又有了箭头函数中的 this 规则

### 全解析

`this`按先级从`低`到`高`划分如下：

1. 独立函数调用（默认绑定）：例如 getUserInfo()，此时 `this` 指向全局对象 `window`
2. 对象调用（隐式绑定）：例如 stu.getStudentName()，此时 `this` 指向`调用的对象 stu`
3. `call()`、`apply()`和 `bind()`（显示绑定）：改变上下文的方法，`this` 指向取决于这些方法的第一个参数，当第一个参数为 null 时，`this` 指向全局对象 `window`
4. 箭头函数：没有 `this`，箭头函数里面的 this 只取决于包裹箭头函数的第一个普通函数的 `this`
5. new 构造函数调用：`this` 永远指向构造函数返回的`实例`上，优先级最高。

即：**new > 箭头函数 > 显式调用 > 隐式调用 > 默认调用**

![](https://wangtunan.github.io/blog/assets/img/3.4fd85c39.png)

### 面试题

```js
let len = 10;
function fn() {
  console.info(this.len);
}
fn(); // A
let Person = {
  len: 5,
  say: function () {
    fn(); // B
    arguments[0](); // C
  }
};
Person.say(fn);
// 输出都为undefined
```

- **A** 处执行结果：fn 的 this 指向为 window，let 声明的变量不挂载在 window 对象上，输出结果为：window.len = undefined;
- **B** 处的执行结果：say 函数的 this 指向为 Person，fn 的 this 指向依然为 window，输出结果依然为：window.len = undefined；
- **C** 处的执行结果：arguments[0]() 相当于 arguments.fn()，fn 的 this 指向为 arguments，输出结果为：arguments.len = undefined；

```js
function Person() {
  this.name = 'Smiley';
  this.sayName = () => {
    console.log(this);
    console.log(this.name);
  };
}

let person = new Person();
person.sayName.call({ name: 'Nicolas' });
```

因为箭头函数并没有自己的 this，被定义在哪里，this 就指向谁，且优先级比显式调用高，因此，this 仍指向 Person。

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
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 递归
var deepClone = function (obj) {
  if (typeof obj !== 'object') return;
  var newObj = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
    }
  }
  return newObj;
};

//  History API
function deepClone(obj) {
  const oldState = history.state;
  history.replaceState(obj, document.title);
  const copy = history.state;
  history.replaceState(oldState, document.title);
  return copy;
}

// lodash 中的方法
function deepClone(obj) {
  var copy;

  if (null == obj || 'object' != typeof obj) return obj;
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
    copy = function () {
      return obj.apply(this, arguments);
    };
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
