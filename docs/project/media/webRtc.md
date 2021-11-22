# WebRtc 视频通话

> WebRtc 是一种免费开源的实时通信技术，集成了音视频采集、编解码、流媒体传输、渲染等功能，并在 Native C++ 代码基础上，封装了简单的 JavaScript API，仅通过几行代码即可实现点对点通信，且具有良好的跨平台特性，目前主流的浏览器都已支持。

## Web API

WebRtc 主要分为三个 API，

- MediaStream （又称 getUserMedia）
- RTCPeerConnection
- RTCDataChannel

### getUserMedia

navigator.getUserMedia 方法目前主要用于，在浏览器中获取音频（通过麦克风）和视频（通过摄像头），将来可以用于获取任意数据流，比如光盘和传感器。

```html
<video id="webcam"></video>

<script>
  // 获取音频
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();

  function onSuccess(stream) {
    var video = document.getElementById('webcam');
    video.srcObject = stream; // Chrome
    video.autoplay = true;
    // 音频
    const audioInput = context.createMediaStreamSource(stream);
    audioInput.connect(context.destination);
  }
  /**
   * PERMISSION_DENIED：用户拒绝提供信息
   * NOT_SUPPORTED_ERROR：浏览器不支持硬件设备
   * MANDATORY_UNSATISFIED_ERROR：无法发现指定的硬件设备
   */
  function onError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true, audio: true }, onSuccess, onError);
  }
</script>
```

### RTCPeerConnection

[RTCPeerConnection](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection) API 代表一个由本地 PC 到远端 PC 的 WebRTC 连接，提供了创建，保持，监控，关闭连接的方法的实现。其作用是在浏览器之间建立数据的 “点对点” （peer to peer）通信，也就是将浏览器获取的麦克风或摄像头数据，传播给另一个浏览器。

建立 P2P 连接需要用到 RTCPeerConnection 中的几个重要类：`SDP`、`ICE`、`STUN/TURN`。

**会话描述信息 RTCSessionDescription（SDP）**

SDP (Session Description Protocol) ：一个描述 peer-to-peer 连接的标准， SDP 包含音视频的编解码(codec)、源地址、时间信息等，这些信息是建立连接是必须传递的。

SDP 描述分为两部分，分别是会话级别的描述（session level）和媒体级别的描述（media level），其具体的组成可参考 RFC4566[1]，带星号 (\*) 的是可选的。常见的内容如下：

```
Session description（会话级别描述）
    v= (protocol version)
    o= (originator and session identifier)
    s= (session name)
    c=* (connection information -- not required if included in all media) One or more Time descriptions ("t=" and "r=" lines; see below)
    a=* (zero or more session attribute lines) Zero or more Media descriptions
Time description
    t= (time the session is active)

Media description（媒体级别描述）, if present
    m= (media name and transport address)
    c=* (connection information -- optional if included at session level)
    a=* (zero or more media attribute lines)
```

**ICE 候选者 RTCIceCandidate**

ICE（Interactive Connectivity Establishment）： 交互式连接建立，是一个被 WebRTC 使用的框架，它被用在两端之间的连接，不管是何种网络类型 (通常用在视频或语音聊天)。这个协议让两端能够互相找到对方并建立一个连接，即便它们都使用了网络地址转译(NAT)去跟内网的其他设备共享了一个公网 IP 地址。

WebRTC 点对点连接最方便的方法是双方 IP 直连，但是在实际的应用中，双方会隔着 NAT（Network Address Translation，网络地址转换） 设备给获取地址造成了麻烦。WebRTC 通过 ICE 框架确定两端建立网络连接的最佳路径，为开发者者屏蔽了复杂的技术细节。

这里需要用到 RTCPeerConnection 中的两个重要 API：

- `onicecandidate`：本地代理创建 SDP Offer 并调用 setLocalDescription(offer) 后触发，在 eventHandler 中通过信令服务器将候选信息传递给远端。

- `addIceCandidate`：接收到信令服务器发送过来的候选信息后调用，为本机添加 ICE 代理。

```js
// API：pc.onicecandidate = eventHandler
pc.onicecandidate = event => {
  if (event.candidate) {
    // Send the candidate to the remote peer
  } else {
    // All ICE candidates have been sent
  }
};

// API：pc.addIceCandidate
pc.addIceCandidate(candidate)
  .then(_ => {
    // Do stuff when the candidate is successfully passed to the ICE agent
  })
  .catch(e => {
    console.log('Error: Failure during addIceCandidate()');
  });
```

**信令服务器**

WebRTC 协议没有规定与服务器的通信方式，因此可以采用各种方式，比如 WebSocket，通过服务器，两个客户端按照 Session Description Protocol（SDP 协议）交换双方的元数据。

```js
const signalingChannel = new WebSocket('ws://localhost:3000/webrtc');

signalingChannel.onopen = () => {
  // TODO
};
signalingChannel.onmessage = () => {
  // TODO
};
signalingChannel.onerror = () => {
  // TODO
};
```

WebRtc 工作的时序图：

![](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling/webrtc_-_signaling_diagram.svg)

**实战项目案例**

[WebRtc + WebSocket 实现的视频聊天室](https://github.com/lcxcsy/webrtc-demo)

### RTCDataChannel

RTCDataChannel 接口代表一个由本地计算机到远端的 WebRTC 连接， 提供了创建，保持，监控，关闭连接的方法的实现。作用是在点对点之间，传播任意数据，它的 API 与 WebSockets 的 API 相同。

```js
const peer = new webkitRTCPeerConnection(servers, { optional: [{ RtpDataChannels: true }] });

peer.ondatachannel = function (event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = function (event) {
    document.querySelector('div#receive').innerHTML = event.data;
  };
};

sendChannel = peer.createDataChannel('sendDataChannel', { reliable: false });

document.querySelector('button#send').onclick = function () {
  var data = document.querySelector('textarea#send').value;
  sendChannel.send(data);
};
```

## References

1. [https://javascript.ruanyifeng.com/htmlapi/webrtc.html](https://javascript.ruanyifeng.com/htmlapi/webrtc.html)
2. [https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API)
3. [https://github.com/shushushv/webrtc-p2p](https://github.com/shushushv/webrtc-p2p)
4. [浅聊 WebRTC 视频通话](https://mp.weixin.qq.com/s/n_oB3kw_2e4oyAff3JNZ-g)
