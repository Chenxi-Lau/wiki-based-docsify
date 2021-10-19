<!--
 * @Author: 刘晨曦
 * @Date: 2021-10-18 20:08:15
 * @LastEditTime: 2021-10-19 09:14:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki-based-docsify\docs\ts\interface.md
-->

## 接口

> 接口（Interface）是 TypeScript 中一个重要的概念，主要用于约束一个函数，对象，以及类的结构和类型。

### 基本形式

接口 `interface` 是一个比较重要的概念，它是对行为的抽象，而具体的行为需要由类去实现，接口 `interface` 中的任何代码都不会被最后编译到 JavaScript 中。

```ts
interface Person {
  name: string;
  age: number;
}
let person: Person = {
  name: 'why',
  age: 23
};
```

在以上代码中，person 变量它是 Person 类型的，那么此变量只能接受接口规定的属性，且属性值的类型也必须和接口中规定的一致，多一个属性或者少一个属性在 TypeScript 中都不是被允许的。

```ts
interface Person {
  name: string;
  age: number;
}
// 编译报错
let person1: Person = {
  name: 'why'
};
// 编译报错
let person2: Person = {
  name: 'why',
  age: 23,
  sex: 'man'
};
```

### 接口中的任意属性

以上一个例子为基础，假设我们接口只对 name 和 age 做规定，其它任何属性都是可以的，那么我们可以如下方式进行定义：

```ts
interface Person {
  name: string;
  age: number;
  // 任意属性
  [propName: string]: any;
}
let person: Person = {
  name: 'why',
  age: 23,
  sex: 'man'
};
```

### 接口中的可选属性

现在假设，我们有一个接口，它只对 name 做规定，但是对于是否包含 age 不做要求，那么可以如下方式进行处理：

```ts
interface Person {
  name: string;
  // age属性是可选的
  age?: number;
}
// 编译成功
let person1: Person = {
  name: 'why'
};
let person2: Person = {
  name: 'why',
  age: 23
};
```

### 接口中的只读属性

最后我们要介绍的知识点是只读属性，一旦在接口中标记了属性为只读的， 那么其不能被赋值。

```ts
interface Person {
  name: string;
  readonly age: number;
}
let person: Person = {
  name: 'why',
  age: 23
};
// 编译报错
person.age = 32;
```
