<!--
 * @Author: your name
 * @Date: 2021-04-20 20:12:48
 * @LastEditTime: 2021-04-20 20:31:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\ECMAScript\Map.md
-->

# Map 对象

> Object 本质上是键值对的集合（Hash 结构），传统的 Object 结构提供了“字符串—值”的对应，而 Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

## 1. 基本用法

## 2. 实例方法

### 2.1 操作方法

- set(key, value)：设置键名 key 对应的键值为 value ，然后返回整个 Map 结构
- get(key)：读取 key 对应的键值，如果找不到 key ，返回 undefined
- has(key): has 方法返回一个布尔值，表示某个键是否在当前 Map 对象之中
- delete(key): 方法删除某个键，返回 true 。如果删除失败，返回 false
- clear(): clear 方法清除所有成员，没有返回值

### 2.2 遍历方法
