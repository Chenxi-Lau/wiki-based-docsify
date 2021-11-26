# Symbol

:::tip
Symbol 是一种新的基础数据类型（primitive type），它的功能类似于一种标识唯一性的 ID。
ES6 数据类型除了 Number、String、Boolean、Object、null 和 undefined，还新增了 Symbol。
:::

## 基本用法

Symbol 函数栈不能用 new 命令，因为 Symbol 是原始数据类型，不是对象。可以接受一个字符串作为参数，为新创建的 Symbol 提供描述，用来显示在控制台或者作为字符串的时候使用，便于区分。

```js
let name = Symbol('Alice');
console.log(name); // Symbol(Alice)
typeof name; // "symbol"

// 相同参数 Symbol() 返回的值不相等
let name1 = Symbol('Alice');
name === name1; // false
```

## 使用场景

### 使用 Symbol 来作为对象属性名

由于每一个 Symbol 的值都是不相等的，所以 Symbol 作为对象的属性名，可以保证属性不重名。

```js
const NAME = Symbol();
let obj = {
  [NAME]: 'Alice'
};
obj[NAME]; // Alice
// 注：Symbol 作为对象属性名时不能用.运算符，要用方括号
```

Symbol 值作为属性名时，该属性是公有属性不是私有属性，可以在类的外部访问。但是不会出现在 for...in 、 for...of 的循环中，也不会被 Object.keys() 、 Object.getOwnPropertyNames() 返回，当使用 JSON.stringify()将对象转换成 JSON 字符串的时候，Symbol 属性也会被排除在输出内容之外。

如果要读取到一个对象的 Symbol 属性，可以通过 Object.getOwnPropertySymbols() 和 Reflect.ownKeys() 取到。

```js
let obj = {
  [Symbol('name')]: 'Alice',
  age: 18
};
Object.keys(obj); // []
for (let p in obj) {
  console.log(p); // 无输出
}
Object.getOwnPropertyNames(obj); // []

// 使用Object的API
Object.getOwnPropertySymbols(obj); // [Symbol(name)]
// 使用新增的反射API
Reflect.ownKeys(obj); // [Symbol(name), 'age']
```

### 使用 Symbol 来替代常量

在 ES5 使用字符串表示常量。例如：

```js
const COLOR_RED = 'red';
const COLOR_YELLOW = 'yellow';
const COLOR_BLUE = 'blue';
```

但是用字符串不能保证常量是独特的，这样会引起一些问题，Symbol 定义常量，这样就可以保证这一组常量的值都不相等。

```js
const COLOR_RED = Symbol('red');
const COLOR_YELLOW = Symbol('yellow');
const COLOR_BLUE = Symbol('blue');
```

### 使用 Symbol 定义类的私有属性/方法

我们知道在 JavaScript 中，是没有如 Java 等面向对象语言的访问控制关键字 private 的，类上所有定义的属性或方法都是可公开访问的，因此这对我们进行 API 的设计时造成了一些困扰（ES2019 提出用# 规定私有便令）。

```js
const PASSWORD = Symbol();

class Login {
  constructor(username, password) {
    this.username = username;
    this[PASSWORD] = password;
  }

  checkPassword(pwd) {
    return this[PASSWORD] === pwd;
  }
}

const login = new Login('admin', '123456');

login.checkPassword('123456'); // true

login.PASSWORD; // undefined
login[PASSWORD]; // undefined
login['PASSWORD']; // undefined
```

### 注册和获取全局 Symbol

通常情况下，在一个浏览器窗口中（window），使用 Symbol()来定义 Symbol 实例就足够了。但是，如果应用涉及到多个 window（最典型的就是页面中使用了`<iframe>`），并需要这些 window 中使用的某些 Symbol 是同一个，那就不能使用 Symbol()函数了，因为用它在不同 window 中创建的 Symbol 实例总是唯一的，而需要的是在所有这些 window 环境下保持一个共享的 Symbol。这种情况下，就需要使用另一个 API 来创建或获取 Symbol，那就是 Symbol.for()，它可以注册或获取一个 window 间全局的 Symbol 实例。

```js
let gs1 = Symbol.for('global_symbol_1'); //注册一个全局Symbol
let gs2 = Symbol.for('global_symbol_1'); //获取全局Symbol

gs1 === gs2; // true
Symbol.keyFor(gs2); // global_symbol_1
```
