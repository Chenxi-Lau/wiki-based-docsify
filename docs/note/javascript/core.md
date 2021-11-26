# 基础知识

## 数据类型

:::tip
Javascript 中数据类型分为原始数据类型和引用数据类型
:::

6 种简单数据类型（也称为原始类型）：Undefined 、Null 、Boolean 、Number 、String 和 Symbol（ES6 新增），还有一种复杂数据类型（引用数据类型）叫 Object。所有值都可以用上述 7 种数据类型之一来表示。

### typeof 操作符

typeof 操作符会返回下列字符串之一："undefined" 表示值未定义；"boolean" 表示值为布尔值；"string" 表示值为字符串；"number" 表示值为数值；"object" 表示值为对象（而不是函数）或 null ；
"function" 表示值为函数；"symbol" 表示值为符号。

### instanceOf 运算符

`instanceof` 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

## 作用域

:::tip
作用域是可访问变量的集合，在 ES5 中只有有两种作用域类型（ 全局作用域和函数作用域），在 ES6 中引入 let 和 const 关键字，从而支持块级作用域的概念。
:::

### 全局作用域

```js
// 此处可调用 carName 变量
var carName = ' Volvo';

function myFunction() {
  // 函数内可调用 carName 变量
  console.log(carName);
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

### 局部作用域

**函数作用域**

```js
function myFunction() {
  // 函数作用域
  var carName = 'Volvo';
}
console.log(carName); // carName is not defined
```

**块级作用域**

块级作用域就是使用一对大括号包裹的一段代码，比如函数、判断语句、循环语句，甚至单独的一个`{ }`都可以被看作是一个块级作用域。

let 不存在变量提升（必须先声明，声明前不能进行赋值等相关操作）

```js
{
  carName = 'Volvo'; // Uncaught ReferenceError: carName is not defined
  let carName;
  console.log(carName);
}
```

上下文中的代码在执行的时候，会创建变量对象的一个作用域链（scope chain）。这个作用域链决定了各级上下文中的代码在访问变量和函数时的顺序。

## 原型及原型链

:::tip

:::
![scope-chain](http://www.mollypages.org/tutorials/jsobj.jpg)

## this 指向性问题

:::tip
This 指向分为四种绑定规则：默认绑定、隐式绑定、显式绑定以及关键字 new 绑定，在 ES6 之后，又有了箭头函数中的 this 规则。
:::

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

::: tip
Object 是引用数据类型，存储在堆内存中，浅拷贝只是拷贝了另一个对象的内存地址，所以在修改时会同时修改另一个对象，而深拷贝会开辟新的内存地址，所以不会影响另一个对象。
:::

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

## 闭包

:::tip
闭包就是能够读取其他函数内部变量的函数。由于在 Javascript 语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。所以，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。
:::

### 闭包的用途

1. 函数外部可以读取函数内部的变量
2. 使变量的值始终保持在内存中

对于第一个问题，通常，JavaScript 中变量的作用域分为全局变量和局部变量，函数内部可以读取到全局变量，但是函数外部无法读取函数内部的局部变量。

```js
function f1() {
  var n = 999;
}

alert(n); // error
```

闭包的出现使得函数外部读取函数内部的局部变量，例如：

```js
function f1() {
  var n = 999;
  function f2() {
    alert(n); // 999
  }
}
```

在上面的代码中，函数 f2 就被包括在函数 f1 内部，这时 f1 内部的所有局部变量，对 f2 都是可见的。但是反过来就不行，f2 内部的局部变量，对 f1 就是不可见的。这就是 Javascript 语言特有的"链式作用域"结构（chain scope），子对象会一级一级地向上寻找所有父对象的变量。所以，父对象的所有变量，对子对象都是可见的，反之则不成立。

既然 f2 可以读取 f1 中的局部变量，那么只要把 f2 作为返回值，就可以在 f1 外部读取它的内部变量了。

```js
function f1() {
  var n = 999;
  return function f2() {
    return n;
  };
}

let a = f1()();
a; // 999
```

对于第二个问题，怎么来理解？

```js
function f1() {
  var n = 999;
  toAdd = function () {
    n += 1;
  };
  return function f2() {
    alert(n);
  };
}
var result = f1();
result(); // 999
toAdd();
result(); // 1000
```

上述代码中，result 实际上就是闭包 f2 函数。它一共运行了两次，第一次的值是 999，第二次的值是 1000。这证明了，函数 f1 中的局部变量 n 一直保存在内存中，并没有在 f1 调用后被自动清除。

为什么会这样呢？原因就在于 f1 是 f2 的父函数，而 f2 被赋给了一个全局变量，这导致 f2 始终在内存中，而 f2 的存在依赖于 f1，因此 f1 也始终在内存中，不会在调用结束后，被垃圾回收机制（garbage collection）回收。

这段代码中另一个值得注意的地方，就是`toAdd=function(){n+=1}`，首先在 toAdd 前面没有使用 var 关键字，因此 toAdd 是一个全局变量，而不是局部变量。其次，toAdd 的值是一个匿名函数，而这个匿名函数本身也是一个闭包，所以 toAdd 相当于是一个 setter，可以在函数外部对函数内部的局部变量进行操作。

### 使用注意点

1. 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在 IE 中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。

2. 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象使用，把闭包当作它的公用方法，把内部变量当作它的私有属性，这时一定要小心，不要随便改变父函数内部变量的值。

### 经典面试题

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

代码分析：

1. for 循环创建了 5 个定时器，并且定时器是在循环结束后才开始执行
2. for 循环结束后，用 var i 定义的变量 i 此时等于 6
3. 依次执行五个定时器，都打印变量 i，所以结果是打印 5 次 6

**第一种改进方法**：利用 IIFE(立即执行函数表达式)当每次 for 循环时，把此时的 i 变量传递到定时器中

```js
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j);
    }, i * 1000);
  })(i);
}
```

**第二种方法**：setTimeout 函数的第三个参数，可以作为定时器执行时的变量进行使用

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j);
    },
    i * 1000,
    i
  );
}
```

**第三种方法(推荐)**：在循环中使用 let i 代替 var i

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

## 继承方式

## 垃圾回收机制
