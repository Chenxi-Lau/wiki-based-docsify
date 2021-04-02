<!--
 * @Author: your name
 * @Date: 2021-04-02 16:46:31
 * @LastEditTime: 2021-04-02 21:28:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\ECMAScript\class.md
-->

# Class

> 在面向对象的编程中,类是一个用于创建对象，为状态（成员变量）和行为实现（成员函数或方法）提供初始值的可扩展程序代码模板

## 1.基本的用法

基本的 class 语法如下：

```javascript
class MyClass {
  constructor() {}
  method1() {}
  method2() {}
  method3() {}
}
```

然后通过 new MyClass()来创建一个拥有以上方法的对象实例，与此同时，通过 new 操作符,构造方法(constructor)是被自动调用,的，这意味着在构造方法中我们可以做一些初始化的工作。
