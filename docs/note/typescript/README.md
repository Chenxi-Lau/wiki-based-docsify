# 基础知识

> TypeScript 数据类型包括：number、string、boolean、null、undefined、symbol、void、Any。

## 1.原始数据类型

JavaScript 分为原始数据类型和对象类型，原始数据类型包括：`number`、`string`、`boolean`、`null`、`undefined` 和 `symbol`。 在 TypeScript 中，我们可以如下定义：

```ts
let tsNum: number = 123;
let tsStr: string = 'AAA';
let tsFlag: boolean = true;
let tsNull: null = null;
let tsUndefined: undefined = undefined;
```

## 2.void 空值

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

## 3.void、null 和 undefined

void 和 null 与 undefined 是有一定区别的。

在 TypeScript 中，`null` 和 `undefined` 是所有类型的子类型，也就是说可以把 `undefined` 或 `null` 赋值给 `number` 等类型的变量:

```ts
let tsNumber1: number = undefined;
let tsNumber2: number = null;
```

## 4.Any

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

## 5.数组和元组

### 数组

和普通的变量一样，数组中的类型定义也有一定的规则，类型+方括号表示：

```ts
// 只允许存储number类型
let numArray: number[] = [1, 2, 3];
// 只允许存储string类型
let strArray: string[] = ['1', '2', '3'];
```

采用泛型方式的写法：

```ts
// 只允许存储number类型
let numArray: Array<number> = [1, 2, 3];
// 只允许存储string类型
let strArray: Array<string> = ['1', '2', '3'];
```

在数组中也可以使用联合类型：

```ts
// 只允许存储number和string类型的值
let tsArray: (number | string)[] = [1, '2', '3'];
```

在数组中不仅可以存储基础数据类型，还可以存储对象类型，如果需要存储对象类型，可以用如下方式进行定义：

```ts
// 只允许存储对象仅有name和age，且name为string类型，age为number类型的对象
let objArray: { name: string; age: number }[] = [{ name: 'AAA', age: 23 }];
```

### 元组

元组：一个数组如果知道它确定的长度，且每个位置的值的类型也是确定的，那么就可以把这样的数组称为元组。

```ts
// tuple数组只有2个元素，并且第一个元素类型为string，第二个元素类型为number
let tuple: [string, number] = ['AAA', 123];
```

当访问元组中已知位置的索引时，将得到其对应正确的值；当访问元组中未知位置的索引时，会报错：

```ts
let tuple: [string, number] = ['AAA', 123];
console.log(tuple[1]); // 123
console.log(tuple[2]); // 报错
```

## 6.类

### 类的继承

```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHello() {
    console.log(`hello, ${this.name}`);
  }
}
class Teacher extends Person {
  constructor(name: string) {
    // 调用父类的构造函数
    super(name);
  }
  sayTeacherHello() {
    // 调用父类的方法
    return super.sayHello();
  }
}
let teacher = new Teacher('why');
teacher.sayHello(); // hello, why
teacher.sayTeacherHello(); // hello, why
```

## 7.接口

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
