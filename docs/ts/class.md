<!--
 * @Author: your name
 * @Date: 2021-10-19 13:51:36
 * @LastEditTime: 2021-10-19 14:02:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki-based-docsify\docs\ts\class.md
-->

## 类

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
