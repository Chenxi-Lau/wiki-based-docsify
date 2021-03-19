<!--
 * @Author: 刘晨曦
 * @Date: 2021-03-17 18:39:29
 * @LastEditTime: 2021-03-19 10:31:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\json-web-token.md
-->

# JWT 鉴权方案

> JWT 全称 **JSON Web Token**， 是目前最流行的跨域认证解决方案。其基本的实现流程是服务端认证后，生成一个 JSON 对象，然后发回给用户，后续用户与服务端通信的时候，都要发回这个 JSON 对象。

早前，我们介绍了[前端权限控制](https://chenxi-lau.github.io/docsify-based-wiki/#/project/access-control)的三种种思路，无论是从路由层面还是视图层面、亦或者接口层面都需要基于服务端的支持。

本篇文章，我们将介绍 JWT 鉴权方案，并基于 Express.js 框架做了简单的实现。

首先，我们先了解一下 JWT 的相关概念，这里参考了阮一峰老师的文章[JSON Wen Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)，顺便再整理一下：

## 跨域认证的问题

互联网服务一般的认证流程，

1. 用户向服务器发送用户名和密码。
2. 服务器验证通过后，在当前对话（session）里面保存相关数据，比如用户角色、登录时间等等。
3. 服务器向用户返回一个 session_id，写入用户的 Cookie。
4. 用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。
5. 服务器收到 session_id，找到前期保存的数据，由此得知用户的身份。

这种模式的问题在于，假如是服务器集群，或者是跨域的服务导向架构，则要求 session 数据共享，每台服务器都能够读取 session。例如，A 网站和 B 网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，请问怎么实现？

一种解决方案是 session 数据持久化，写入数据库或别的持久层，各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败。

另一种方案是服务器索性不保存 session 数据了，所有数据都保存在客户端，每次请求都发回服务器。JWT 就是这种方案的一个代表。

而 JWT 转换了思路，将 JSON 数据返回给前端的，前端再次请求时候将数据发送到后端，后端进行验证，也就是服务器是无状态的，所以更加容易拓展。

## JWT 的原理

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。

```json
{
  "姓名": "张三",
  "角色": "管理员",
  "到期时间": "2018年7月1日0点0分"
}
```

之后用户与服务端通信的时候，都要发回这个 JSON 对象，服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会用算法进行签名。

## JWT 的数据结构

JWT 的由三个部分依次如下 Header（头部）、Payload（负载）、Signature（签名）组成

![img](https://www.wangbase.com/blogimg/asset/201807/bg2018072303.jpg)

### Header

Header 部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面的样子，

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

上面代码中，alg 属性表示签名的算法（algorithm），默认是 HMAC SHA256（写成 HS256）；typ 属性表示这个令牌（token）的类型（type），JWT 令牌统一写为 JWT。

### Payload

Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了 7 个官方字段，供选用，

1. iss (issuer)：签发人
2. exp (expiration time)：过期时间
3. sub (subject)：主题
4. aud (audience)：受众
5. nbf (Not Before)：生效时间
6. iat (Issued At)：签发时间
7. jti (JWT ID)：编号

### Signature

Signature 部分是对前两部分的签名，防止数据篡改。其签名过程是，先需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。

```javascript
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（.）分隔，就可以返回给用户。

### Base64URL

Base64URL 算法： JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成\_ 。

## Express.js 的实现

这里，我采用了 Express.js + Mysql2 + Sequelize 进行了 JWT 鉴权方案的实现。

项目地址：https://github.com/Chenxi-Lau/express-jwt-demo

## Reference

1. [JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
