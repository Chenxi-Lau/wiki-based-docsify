# JS/Node 获取本机真实 IP

> JS/Node 获取本机真实 IP

单纯的 JS 是无法获取本机 IP 的, 即使有 `navigator` 也只能获取网络的连接类型和监听网络的变化, 而无法得知 IP 信息, 例如：

```js
window.navagator.connection;
{
  downlink: 2.95;
  downlinkMax: Infinity;
  effectiveType: '4g';
  onchange: null;
  ontypechange: null;
  rtt: 50;
  saveData: false;
  type: 'wifi';
}
```

虽然 BOM 的 API 无法获取我们可以采取其他方式。

## 浏览器环境

> [Only WebRTC (as far as I know) gives the ability to know your local IP addresses in the JavaScript code running inside the browser (Flash had that also, but it is now quite dead)](https://bloggeek.me/psa-mdns-and-local-ice-candidates-are-coming/)

在浏览器环境下似乎只有 `WebRtc` 有能力知道本地 IP，但是它也有可能泄露用户的信息，因此 Google 通过 `mDNS` 隐藏了本机 IP，多数情况下获取到的为 .local 形式的 IP，要想获取真是的 IP 还需要在 chrome://flags/#enable-webrtc-hide-local-ips-with-mdns 把 Anonymize local IPs exposed by WebRTC 设置为 Disabled。

```js
/**
 * @description: 获取本机IP地址， 由于WebRtc保护用户隐私，因此需要在浏览器端关闭 mDNS （chrome://flags/#enable-webrtc-hide-local-ips-with-mdns 设置为 DISABLED）
 * @param {*}
 * @return {*}
 */
function getLocalIp() {
  return new Promise((resolve, reject) => {
    const PeerConnection =
      window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    const peer = new PeerConnection();
    const candidateIPList = [];
    const ipReg = new RegExp(
      '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
    );
    peer.onicecandidate = e => {
      if (e.candidate) {
        if (
          e.candidate.address &&
          ipReg.test(e.candidate.address) &&
          !candidateIPList.includes(e.candidate.address)
        ) {
          candidateIPList.push(e.candidate.address);
        }
      } else {
        if (candidateIPList.length) {
          resolve(candidateIPList[0]);
        } else {
          reject('No valid IP address was collected');
        }
      }
    };
    peer.createDataChannel('');
    const createOffer = async () => {
      const offer = await peer.createOffer();
      peer.setLocalDescription(offer);
    };
    createOffer();
  });
}

getLocalIp().then(res => {
  console.log(res);
});
```

## NODE 环境

在 NODE 环境下获取到 IP 地址的方法就比较多。

### 解析 Request 请求

```js
const express = require('express');
const app = express();

app.set('trust proxy', true);
app.get('/api/local/ip/get', (req, res) => {
  const { ip } = req;
  res.send({ code: 0, data: { ip }, msg: 'success' });
});
app.listen(3002);
```

或者采用 request-ip 中间件

```js
const requestIp = require('request-ip');
app.use(requestIp.mw());

app.use(function (req, res) {
  const ip = req.clientIp;
  res.end(ip);
});
```

### OS 模块获取本机 IP

```js
let netDict = os.networkInterfaces();
for (const devName in netDict) {
  let netList = netDict[devName];
  for (var i = 0; i < netList.length; i++) {
    let { address, family, internal, mac } = netList[i],
      isvm = isVmNetwork(mac);
    if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
      return address;
    }
  }
}
```

以上方法确实获取本机 IP 但是假如你本机装了一个虚拟机获取的 ip 可能就是你虚拟机的 IP 了 或者你通过 VPN 访问网络获取到的有可能是你的 VPN 分配的 IP,所以我们需要根据 MAC 地址来判断是否是虚拟机/VPN

```js
// 增加一个判断VM虚拟机的方法
// 在上面方法的if中加上这个方法的返回判断就行了
function isVmNetwork(mac) {
  // 常见的虚拟网卡MAC地址和厂商
  let vmNetwork = [
    '00:05:69', //vmware1
    '00:0C:29', //vmware2
    '00:50:56', //vmware3
    '00:1C:42', //parallels1
    '00:03:FF', //microsoft virtual pc
    '00:0F:4B', //virtual iron 4
    '00:16:3E', //red hat xen , oracle vm , xen source, novell xen
    '08:00:27', //virtualbox
    '00:00:00' // VPN
  ];
  for (let i = 0; i < vmNetwork.length; i++) {
    let mac_per = vmNetwork[i];
    if (mac.startsWith(mac_per)) {
      return true;
    }
  }
  return false;
}
```

### 广播获取本机 IP

```js
import dgram from 'dgram';
const socket = dgram.createSocket('udp4');

const getLocalIp = () => {
  return new Promise((resolve, reject) => {
    socket.on('error', err => {
      reject(err);
      socket.close();
    });

    socket.on('message', (msg, rinfo) => {
      let { address, port } = rinfo;
      resolve(address);
    });

    socket.bind(19319, _ => {
      socket.setBroadcast(true);
    });
    const message = new Buffer.from('hello');
    socket.send(message, 0, message.length, 19319, '255.255.255.255', (err, bytes) => {
      if (err) {
        reject(err);
        return;
      }
    });
  });
};

getLocalIp().then(res => {
  console.log(res);
});
```

## References

1. [mDNS and .local ICE candidates are coming](https://bloggeek.me/psa-mdns-and-local-ice-candidates-are-coming/)
2. [JS/node 获取本机 ip 的方法](https://juejin.cn/post/6972913930226106399)
