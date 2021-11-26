# Map 对象

:::tip
Object 本质上是键值对的集合（Hash 结构），传统的 Object 结构提供了 "字符串—值" 的对应，而 Map 结构提供了"值—值"的对应，是一种更完善的 Hash 结构实现。
:::

## 基本用法

Map 可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组，例如：

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
map.size; // 2
```

主要注意的是：

```js
const map = new Map();
const k1 = ['a'];
const k2 = ['a'];
map.set(k1, 111).set(k2, 222);
map.get(k1); // 111
map.get(k2); // 222
```

Map 的键实际上是跟`内存地址`绑定的，只要内存地址不一样，就视为两个键。

如果 Map 的键是一个简单类型的值，则只要两个值严格相等，Map 将其视为一个键，比如 0 和 -0 就是一个键。例如，布尔值 true 和字符串 true 则是两个不同的键。另外， undefined 和 null 也是两个不同的键。虽然 NaN 不严格相等于自身，但 Map 将其视为同一个键。

## 实例方法

### 操作方法

- set(key, value)：设置键名 key 对应的键值为 value ，然后返回整个 Map 结构
- get(key)：读取 key 对应的键值，如果找不到 key ，返回 undefined
- has(key): has 方法返回一个布尔值，表示某个键是否在当前 Map 对象之中
- delete(key): 方法删除某个键，返回 true 。如果删除失败，返回 false
- clear(): clear 方法清除所有成员，没有返回值

### 遍历方法

结构原生提供三个遍历器生成函数和一个遍历方法:

- keys() ：返回键名的遍历器
- values() ：返回键值的遍历器
- entries() ：返回所有成员的遍历器
- forEach() ：遍历 Map 的所有成员

Map 的遍历顺序就是插入顺序，举个栗子：

```javascript
const map = new Map([
  ['F', 'no'],
  ['T', 'yes']
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F" "T"

for (let value of map.values()) {
  console.log(value);
}
// "no" "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map) {
  console.log(key, value);
}
```

1. [https://es6.ruanyifeng.com/#docs/set-map](https://es6.ruanyifeng.com/#docs/set-map)
