<!--
 * @Author: your name
 * @Date: 2021-04-02 16:46:31
 * @LastEditTime: 2021-04-06 20:49:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\ECMAScript\class.md
-->

# Class

> 在面向对象的编程中，类是一个用于创建对象，为状态（成员变量）和行为实现（成员函数或方法）提供初始值的可扩展程序代码模板。ES6 引入了 Class（类）这个概念，通过 class 关键字可以定义类，该关键字的出现使得其在对象写法上更加清晰，更像是一种面向对象的语言。

## 1.基本的用法

基本的 class 语法如下：

```javascript
class MyClass {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  method1() {
    // ...
  }

  method2() {
    // ...
  }
}

typeof MyClass // function
```

## 2. 什么是类

ES6 的类，完全可以看作构造函数的另一种写法，例如

```javascript
class User {
  constructor(name) {
    this.name = name
  }
  showUInfo() {
    alert(this.name)
  }
}
typeof User //function
```

构造函数的 prototype 属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的 prototype 属性上面。

注：

1. 每个函数都有一个显式原型**prototype**
2. 每个实例对象都有一个隐式原型**proto**
3. 实例对象的隐式原型的值指向其对应的构造函数的显式原型的值

### constructor 方法

constructor 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个空的 constructor 方法会被默认添加。
