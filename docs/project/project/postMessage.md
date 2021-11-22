# postMessage 跨域通信

> window.postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议，端口号，以及主机时，这两个脚本才能相互通信（同源策略）。window.postMessage() 方法提供了一种受控机制来**规避此限制**。它可用于解决以下方面的问题：

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面与嵌套的 iframe 消息传递

## 1. 使用方法

**A 页面 - 发送指令方(该页面通过 Iframe 调用第三方页面)**

```javascript
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

1. otherWindow：其他窗口的一个引用，比如 **iframe 的 contentWindow 属性**、执行 window.open 返回的窗口对象、或者是命名过或数值索引的 window.frames。
2. message: 将要发送到其他 window 的数据
3. targetOrigin：通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"\*"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。例如，当用 postMessage 传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的 origin 属性完全一致，来防止密码被恶意的第三方截获。**如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 targetOrigin，而不是。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点**。
4. transfer(可选)：是一串和 message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

**B 页面- 接收指令方（A 页面通过 Iframe 嵌入的页面，监听 A 页面发送的消息）**

```javascript
window.addEventListener('message', receiveMessage, false);
function receiveMessage(event) {
  console.log('receiveMessage | event:::', event);
  console.log('receiveMessage | event.type消息类型:::', event.type);
  console.log('receiveMessage | event.origin来自:::', event.origin);
  console.log('receiveMessage | event.data消息:::', event.data);
  console.log('receiveMessage | event.source窗口对象:::', event.source);
}
```

postMessage 方法被调用时，会在所有页面脚本执行完毕之后像目标窗口派发一个 MessageEvent 消息，该 MessageEvent 消息有四个属性需要注意

type：表示该 message 的类型
origin：表示调用 postMessage 方法窗口的源
data：为 postMessage 的第一个参数
source：记录调用 postMessage 方法的窗口对象

## 2. 实例

A 页面：http://localhost:3000/a.html
B 页面：http://localhost:4000/b.html

A 页面通过 Iframe 嵌套了 B 页面，由于 A 和 B 端口不一致，属于跨域，我们采用 postMessage 在 A 页面传递“我爱你”给 B 页面， 然后后者传回"我不爱你"。

```html
<!-- A页面：http://localhost:3000/a.html -->
<body>
  <iframe src="http://localhost:4000/b.html" frameborder="0" id="frame" onload="load()"></iframe>
  //等它加载完触发一个事件
</body>

<script>
  function load() {
    let frame = document.getElementById('frame');
    //发送数据
    frame.contentWindow.postMessage('我爱你', 'http://localhost:4000');

    //接受返回数据
    window.onmessage = function (e) {
      console.log(e.data);
    };
  }
</script>

<!-- B页面：  -->
// b.html
<script>
  window.onmessage = function (e) {
    // 接收到的消息
    console.log(e.data);
    // 发送消息给A页面
    e.source.postMessage('我不爱你', e.origin);
  };
</script>
```

## 3. References

- [https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
