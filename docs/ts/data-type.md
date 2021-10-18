<!--
 * @Author: your name
 * @Date: 2021-10-18 19:40:33
 * @LastEditTime: 2021-10-18 20:01:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki-based-docsify\docs\ts\data-type.md
-->

## 数据类型

> TypeScript 的数据类型包括：number、string、boolean、null、undefined、symbol、void、Any。

### 原始数据类型

JavaScript 分为原始数据类型和对象类型，原始数据类型包括：`number`、`string`、`boolean`、`null`、`undefined` 和 `symbol`。 在 TypeScript 中，我们可以如下定义：

```ts
let tsNum: number = 123;
let tsStr: string = 'AAA';
let tsFlag: boolean = true;
let tsNull: null = null;
let tsUndefined: undefined = undefined;
```

### void 空值

在 JavaScript 中，是没有空值(`void`)的概念的，但在 TypeScript 中，可以使用 `void` 来表示一个没有返回值的函数：

```ts
function sayHello(): void {
  console.log('Hello, world');
}
```

也可以定义一个 `void` 类型的变量，不过这样的变量并没有什么意义，因为我们只能给这种变量赋值为 `null` 或 `undefined`。

```ts
let voidValue1: void = null;
let voidValue2: void = undefined;
```

### void、null 和 undefined

void 和 null 与 undefined 是有一定区别的。

在 TypeScript 中，`null` 和 `undefined` 是所有类型的子类型，也就是说可以把 `undefined` 或 `null` 赋值给 `number` 等类型的变量:

```ts
let tsNumber1: number = undefined;
let tsNumber2: number = null;
```

### Any

任意值 `Any` 用来表示可以接受任何类型的值。

```ts
// 以下代码是正确的，编译成功
let tsAny: any = 123;
tsAny = '123';
```

如果我们定义了一个变量，没有指定其类型，也没有初始化，那么它默认为 any 类型：

```ts
// 以下代码是正确的，编译成功
let tsValue;
tsValue = 123;
tsValue = '123';
```
