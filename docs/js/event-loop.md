<!--
 * @Author: your name
 * @Date: 2021-08-25 16:31:29
 * @LastEditTime: 2021-08-25 17:31:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MyGithub\wiki-based-docsify\docs\js\event-loop.md
-->

## 事件循环 （Event Loop）

> JavaScript 代码的执行过程中，除了依靠函数调用栈来搞定函数的执行顺序外，还依靠任务队列(task queue)来搞定另外一些代码的执行。整个执行过程，我们称为事件循环过程。

### JS 单线程

Javascript 是单线程的，所有的同步任务都会在主线程中执行。

单线程与之用途有关，单线程能够保证一致性，如果有两个线程，一个线程点击了一个元素，另一个删除了一个元素，浏览器就不知道以哪个为准了。因此 JS 的单线程实际上是指单个脚本只能在一个线程上运行，所有任务需要排队执行，前一个任务结束，才会执行后一个任务。

### Event Loop

一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。任务队列又分为 macro-task（宏任务）与 micro-task（微任务）。

在最新标准中，它们被分别称为 task 与 jobs。

**macro-task** 大概包括：

- script(整体代码)
- setTimeout
- setInterval
- setImmediate
- I/O
- UI render

**micro-task** 大概包括:

- process.nextTick
- Promise
- Async/Await(实际就是 promise)
- MutationObserver(html5 新特性)

**整体流程**：

主线程 (执行同步代码，异步任务 push 到一个消息队列中) ——> macro-tasks (执行内部所有 micros-tasks) ——> macro-tasks

- 首先在主线程中执行所有的同步任务
- 主线程之外，还有一个队列任务，每当一个异步任务有结果了，就往任务队列里塞一个事件。
- 当主线程中的任务，都执行完之后，系统会 “依次” 读取任务队列里的事件，与之相对应的异步任务进入主线程。
- 开始执行宏任务，然后执行该宏任务产生的微任务，若微任务在执行过程中产生了新的微任务，则继续执行微任务，微任务执行完毕后，再回到宏任务中进行下一轮循环。（有微则微，无微则宏）

### Demo

```js
console.log('script start');

async function async1() {
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2 end');
}
async1();

setTimeout(function () {
  console.log('setTimeout');
}, 0);

new Promise(resolve => {
  console.log('Promise');
  resolve();
})
  .then(function () {
    console.log('promise1');
  })
  .then(function () {
    console.log('promise2');
  });

console.log('script end');
// script start => async2 end => Promise => script end => promise1 => promise2 => async1 end => setTimeout
```

分析这段代码：

- 执行代码，输出 script start。
- 执行 async1(),会调用 async2(),然后输出 async2 end,此时将会保留 async1 函数的上下文，然后跳出 async1 函数。
- 遇到 setTimeout，产生一个宏任务
- 执行 Promise，输出 Promise。遇到 then，产生第一个微任务
- 继续执行代码，输出 script end
- 代码逻辑执行完毕(当前宏任务执行完毕)，开始执行当前宏任务产生的微任务队列，输出 promise1，该微任务遇到 then，产生一个新的微任务
- 执行产生的微任务，输出 promise2,当前微任务队列执行完毕。执行权回到 async1
- 执行 await,实际上会产生一个 promise 返回，即

执行完成，执行 await 后面的语句，输出 async1 end

```js
let promise_ = new Promise((resolve,reject){ resolve(undefined)})
```

最后，执行下一个宏任务，即执行 setTimeout，输出 setTimeout

### Reference

1. [说说 JS 的事件循环机制](https://mp.weixin.qq.com/s/G2L_9kj8ST0_HPG7yxd2lw)
