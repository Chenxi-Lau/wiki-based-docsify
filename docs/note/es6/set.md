# Set 对象

> Set 对象是 ES6 提供的新的数据结构，内部存储的任何类型都是唯一的。

## 1. 基本用法

Set 本身是一个构造函数，可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数用来初始化。

```js
const set = new Set([1, 2, 3, 4, 4])
[...set]   // [1, 2, 3, 4]
typeof set // object
set.size   // 4
```

### 1.1 判定方法

向 Set 内部加入值的时候，**不会发生类型转换**，判断两个值是否不同，Set 使用的算法叫做**Same-value equality**，它类似于精确相等运算符（ === ），主要的区别是 NaN 等于自身，而精确相等运算符认为 NaN 不等于自身。因此，

```js
let set = new Set([NaN, NaN]);
set; // Set {NaN}
```

在 Set 内部，两个对象总是不相等，例如：

```js
const set = new Set([{ a: 'b' }, { a: 'b' }]);
set.size; // 2
```

## 2. 实例方法

Set 实例的方法分为两大类：**操作方法**和**遍历方法**。

#### 2.1 操作方法

四个操作方法如下：

- add(value): 添加某个值
- delete(value): 删除某个值
- has(value): 返回一个布尔值，检测该值是否为 Set 成员
- clear(): 清除所有成员，没有返回值

#### 2.2 遍历方法

四种遍历方法如下：

- keys(): 返回键名的遍历器
- values(): 返回键值的遍历器
- entries(): 返回键值对的遍历器
- forEach(): 使用回调函数遍历每个成员

### 2.2.1 keys、values、entries

keys 方法、values 方法、entries 方法返回的都是遍历器对象，因此可以使用 for...of 进行遍历。由于 Set 结构没有键名，只有键值（或者说键名和键值
是同一个值），所以 keys 方法和 values 方法的行为完全一致。

举个栗子：

```js
let set = new Set(['red', 'green', 'blue']);
for (let item of set.keys()) {
  console.log(item);
}
// red green blue

for (let item of set.values()) {
  console.log(item);
}
// red green blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]  ["green", "green"]  ["blue", "blue"]

// 或者
for (let x of set) {
  console.log(x); // red green blue
}
```

### 2.2.2 forEach

forEach 方法用于对每个成员执行某种操作

```js
let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(value * 2));
// 2 4 6
```

同时，Set 和 Array 方法类似，支持 filter 和 map 方法。

### 2.2.3 扩展运算符

扩展运算符内部使用了 for...of，也可以用于 Set 对象遍历

```js
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']
```

## 3. 转化为数组

Array.from 方法可以将 Set 结构转为数组

```js
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);
```

因此，可以采用以下方式进行数组的去重

```js
function dedupe(array) {
  return Array.from(new Set(array));
}
dedupe([1, 1, 2, 3]); // [1, 2, 3]
```

## 4. WeakSet

几点需要注意的：

1. WeakSet 的成员只能是对象，而不能是其他类型的值
2. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中
3. WeakSet 没有 size 属性，没有办法遍历它的成员

## References

1. [https://es6.ruanyifeng.com/#docs/set-map](https://es6.ruanyifeng.com/#docs/set-map)
