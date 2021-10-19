<!--
 * @Author: your name
 * @Date: 2021-10-19 09:26:01
 * @LastEditTime: 2021-10-19 10:20:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki-based-docsify\docs\ts\tuple.md
-->

## 数组和元组

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
