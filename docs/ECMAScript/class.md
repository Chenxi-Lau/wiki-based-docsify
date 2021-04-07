<!--
 * @Author: 刘晨曦
 * @Date: 2021-04-02 16:46:31
 * @LastEditTime: 2021-04-07 11:22:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\ECMAScript\class.md
-->

# Class 类

> 在面向对象的编程中，类是一个用于创建对象，为状态（成员变量）和行为实现（成员函数或方法）提供初始值的可扩展程序代码模板。ES6 引入了 Class（类）这个概念，通过 class 关键字可以定义类，该关键字的出现使得其在对象写法上更加清晰，更像是一种面向对象的语言。

## 1.基本的用法

传统的 JavaScript 语言通过构造函数定义并生成新对象，例如：

```javascript
function Point(x, y) {
  this.x = x
  this.y = y
}

Point.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')'
}

const p = new Point(1, 2)
```

改为 ES6 中 Class 的写法如下：

```javascript
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }
}

const p = new Point(1, 2)
```

## 2. 什么是类

类可以看做是构造函数的另一种写法，例如

```javascript
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```

从上述代码可以看出，类实质上就是一个函数，类自身指向的就是构造函数。构造函数的 prototype 属性，在 ES6 的 Class 上面继续存在，类的所有方法都定义在类的 prototype 属性上面。

可以通过 Object.assign 方法向类添加多个方法:

```javascript
class Point {
  constructor() {
    // ...
  }
}

Object.assign(Point.prototype, {
  toString() {},
  toValue() {},
})
```

类的内部所有定义的方法，都是不可枚举的（non-enumerable）。

### 2.1 constructor 方法

constructor 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个空的 constructor 方法会被默认添加。

constructor 方法默认返回实例对象（即 this），完全可以指定返回另外一个对象。

```javascript
class Foo {
  constructor() {
    return Object.create(null)
  }
}

new Foo() instanceof Foo // false
```

### 2.2 this 的指向问题

## 3. 类的继承

Class 之间可以通过 extends 关键字实现继承，

```javascript
class ColorPoint extends Point {}
```

上面代码定义了一个 ColorPoint 类，该类通过 extends 关键字，继承了 Point 类的所有属性和方法。然后，在 ColorPoint 内部加上代码，

```javascript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y) // 调用父类的constructor(x, y)
    this.color = color
  }

  toString() {
    return this.color + ' ' + super.toString() // 调用父类的toString()
  }
}
```

ColorPoint 类的 constructor 方法和 toString 方法，都出现了 super 关键字，它在这里表示父类的构造函数，用来新建父类的 this 对象。如果不调用 super 方法，子类就得不到 this 对象。

如果子类没有定义 constructor 方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有 constructor 方法。

```javascript
constructor(...args) {
  super(...args);
}
```

ES6 的继承机制实质是先创造父类的实例对象 this（所以必须先调用 super 方法），然后再用子类的构造函数修改 this，子类实例的构建，是基于对父类实例加工，只有 super 方法才能返回父类实例。

```javascript
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color // ReferenceError
    super(x, y)
    this.color = color // 正确
  }
}
```

## 4. 类的 prototype 属性和**proto**属性

ES5 的实现中每一个对象都有**_proto_**属性，指向对应的构造函数的 prototype 属性。Class 作为构造函数的语法糖，同时有 prototype 属性和**_proto_**属性，因此同时存在两条继承链。

（1）子类的**_proto_**属性，表示构造函数的继承，总是指向父类。

（2）子类 prototype 属性的**_proto_**属性，表示方法的继承，总是指向父类的 prototype 属性。

例如，

```javascript
class A {}

class B extends A {}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

注：

1. 每个函数都有一个显式原型 **prototype**
2. 每个实例对象都有一个隐式原型 **_proto_**
3. 实例对象的隐式原型的值指向其对应的构造函数的显式原型的值

## 5. this 的指向问题

类的方法内部如果含有 this，它默认指向类的实例

```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`)
  }

  print(text) {
    console.log(text)
  }
}

const logger = new Logger()
const { printName } = logger
printName() // TypeError: Cannot read property 'print' of undefined
```

上面代码中，printName 方法中的 this，默认指向 Logger 类的实例。但是，如果将这个方法提取出来单独使用，this 会指向该方法运行时所在的环境，因为找不到 print 方法而导致报错。
解决办法：

1.  在构造方法中绑定 this

```javascript
class Logger {
  constructor() {
    this.printName = this.printName.bind(this)
  }
  // ...
}
```

2. 使用箭头函数

```javascript
class Logger {
  constructor() {
    this.printName = (name = 'there') => {
      this.print(`Hello ${name}`)
    }
  }
  // ...
}
```
