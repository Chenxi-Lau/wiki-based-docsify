<!--
 * @Author: 刘晨曦
 * @Date: 2021-10-25 18:55:09
 * @LastEditTime: 2021-10-25 19:20:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki\docs\js\this.md
-->

## This 指向性问题汇总

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
