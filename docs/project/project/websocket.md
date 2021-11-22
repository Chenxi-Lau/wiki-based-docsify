# WebSocket 实现类

> 定义 Websocket 的类。

## 类函数

```js
/**
 * @description: 定义websocket类
 * @param {*}
 * @return {*}
 */
export default class CustomWebSocket {
  /**
   * @description: constructor
   * @param {*} url websocket地址
   * @param {*} onMessageCB 回调方法
   * @return {*}
   */
  constructor(url, onMessage) {
    this.socketUrl = this.getUrl(url);
    this.onMessage = onMessageCB;
    this.heartbeatTimer = null;
    this.socket = null;
    this.isDestroy = false;
    this.initWebSocket();
  }

  getUrl(url) {
    const protocol = window.location.protocol === 'http' ? 'ws://' : 'wss://';
    const socketUrl =
      process.env.NODE_ENV === 'development'
        ? `wss://localhost:3000/${url}`
        : `${protocol + window.location.host}/${url}`;
    return socketUrl;
  }

  // 初始化WebSocket
  initWebSocket() {
    this.socket = new WebSocket(this.socketUrl);

    this.socket.onmessage = msg => {
      const data = JSON.parse(msg.data);
      this.onMessageCB(data);
    };

    this.socket.onopen = () => {
      console.log('Web Socket opened.');
      this.heartbeatTimer = setInterval(() => {
        this.reconnection();
      }, 60 * 1000);
    };

    this.socket.onclose = e => {
      console.log('Web Socket closed.');
      this.reconnection();
    };

    this.socket.onerror = () => {
      console.log('Web Socket error.');
      this.initWebSocket();
    };
  }

  // 断开重连机制
  reconnection() {
    if (!this.isDestroy) {
      const agentData = 'HeartBeat';
      // 若是ws开启状态
      if (this.socket) {
        if (this.socket.readyState === this.socket.OPEN) {
          this.websocketSend(agentData);
        } else if (this.socket.readyState === this.socket.CONNECTING) {
          // 若是 正在开启状态，则等待300毫秒
          setTimeout(() => {
            this.websocketSend(agentData);
          }, 300);
        } else {
          // 若未开启 ，则等待500毫秒
          this.initWebSocket();
          setTimeout(() => {
            this.websocketSend(agentData);
          }, 500);
        }
      }
    } else {
      this.destroyHeart();
    }
  }

  // 发送消息
  websocketSend(agentData = 'HeartBeat') {
    if (this.socket) {
      this.socket.send(agentData);
    }
  }

  // 主动断开连接
  destroyed() {
    this.isDestroy = true;
    if (this.socket && this.socket.readyState === this.socket.OPEN) {
      this.socket.close();
    }
  }

  // 关闭重连心跳
  destroyHeart() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}
```

## 使用方式

```js
import CustomWebSocket from './utils/CustomWebSocket';
let websocketInstance = null;
export default {
  name: 'WebsocketDemo',
  create() {
    this.initSocket();
  },
  method: {
    // 初始化WebSocket
    initSocket() {
      websocketInstance = new CustomWebSocket({
        url: '/api/websocket',
        onMessageCB: this.onMessageCB
      });
      this.$once('hook:beforeDestroy', () => {
        this.websocketInstance.destroyed();
        this.websocketInstance = null;
      });
    },

    // 接收消息的回调
    onMessageCB(data) {
      console.log(data);
      // to do something
    }
  }
};
```

## Reference

1. [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
