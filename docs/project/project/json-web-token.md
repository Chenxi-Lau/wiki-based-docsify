# JWT 鉴权方案

> JWT 全称 **JSON Web Token**， 是目前最流行的跨域认证解决方案。其基本的实现流程是服务端认证后，生成一个 JSON 对象，然后发回给用户，后续用户与服务端通信的时候，都要发回这个 JSON 对象。

之前，介绍了[前端权限控制](https://lcxcsy.github.io/docsify-based-wiki/#/project/access-control)的三种种思路，无论是从路由层面还是视图层面、亦或者接口层面都需要基于服务端的支持。JWT 鉴权方案是目前最流行的跨域解决认证方案。

首先，我们先了解一下 JWT 的相关概念，这里参考了阮一峰老师的文章[JSON Wen Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)。

## 跨域认证的问题

互联网服务一般的认证流程，

1. 用户向服务器发送用户名和密码。
2. 服务器验证通过后，在当前对话（session）里面保存相关数据，比如用户角色、登录时间等等。
3. 服务器向用户返回一个 session_id，写入用户的 Cookie。
4. 用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。
5. 服务器收到 session_id，找到前期保存的数据，由此得知用户的身份。

上述这种模式是采用 session 认证的方式，这种模式的问题在于：假如是服务器集群，或者是跨域的服务导向架构，则要求 session 数据共享，每台服务器都能够读取 session。例如，A 网站和 B 网站是同一家公司的关联服务。如果要求用户只要在其中一个网站登录，再访问另一个网站就会自动登录，一种解决方案是 session 数据持久化，写入数据库或别的持久层，各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，如果持久层挂掉，就会导致单点登录失败。

而 JWT 转换了思路，将 JSON 数据返回给前端的，前端再次请求时候将数据发送到后端，后端进行验证，也就是服务器是无状态的，所以更加容易拓展。

## JWT 的原理

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。

```json
{
  "name": "张三",
  "roleName": "管理员",
  "expireTime": "2018年7月1日0点0分"
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

Signature 部分是对前两部分的签名，防止数据篡改。其签名过程是，先需要指定一个密钥（secretKey）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。

```javascript
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secretKey);
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（.）分隔，就可以返回给用户。

#### Base64URL 算法

Base64URL 算法： JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成\_ 。

## Express 具体实现

### 建立数据库连接

```sh
# 启动 mysql
net start mysql

# 登录数据库
mysql -u root -p

# 执行 SQL 文件
source C:\Desktop\jwt_demo.sql （你的sql文件的路径）
```

数据库会生成一个名为 jwt_demo 的用户表，表中存储了一条测试数据，如下：

| userId            | userName | password                 |
| ----------------- | -------- | ------------------------ |
| 99170219708121088 | admin    | Ul0jhI3RRDvWkINjSckhtw== |

表中数据 password 字段是 AES/ECB/PKCS5Padding 加密后存储的密码，未加密之前的密码为 **123456**。

接着，采用中间件 [sequelize](https://www.npmjs.com/package/sequelize) 与 [mysql2](https://www.npmjs.com/package/mysql2)与数据库建立连接，并将关系数据库的表结构映射到对象上。

安装数据库的相关依赖，

```sh
npm install sequelize mysql2
```

然后，在主目录下新建 db.config.js 用于配置数据库的相关信息，

```js
import Sequelize from 'sequelize';

const config = {
  host: 'localhost',
  username: 'root',
  password: 'liuchenxi0428',
  database: 'jwt_demo'
};

// Object-Relational Mapping，把关系数据库的表结构映射到对象上。
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  }
});

export default sequelize;
```

在 src 目录下新建 dbs/users.js，通过 define()函数将数据库的表结构映射到对象上，

```js
import db from '../db.config';
import Sequelize from 'sequelize';

// Object-Relational Mapping，把关系数据库的表结构映射到对象上。
const usersModel = db.define(
  'users', // 数据库对应的表
  {
    userId: {
      type: Sequelize.STRING(32),
      primaryKey: true // 主键
    },
    userName: Sequelize.STRING(32),
    password: Sequelize.STRING(50)
  },
  {
    timestamps: false // 关闭Sequelize的自动添加timestamp的功能
  }
);

export default usersModel;
```

### 定义路由接口

在 routes/users.js 中新增一个登陆的接口（/login）和一个根据 Token 获取用户信息的接口（/auth）:

```js
import express from 'express';
import usersModel from '../dbs/users';
import Response from '../controller/response';
import { TokenUtil, AesCrypto } from '../utils';

const router = express.Router();
const response = new Response();
const tokenInstance = new TokenUtil();
const aesCrypto = new AesCrypto();

/* GET users listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');
});

/* POST User Login */
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  if (!(userName && password)) {
    return res.json(response.createCustomResponse('-1', 'Params are not valid'));
  }
  const result = await usersModel.findAll({
    where: {
      userName: userName,
      password: aesCrypto.encrypt(userName, password)
    }
  });
  if (result.length) {
    const token = await tokenInstance.sign(result[0].userName, result[0].userId);
    return res.json(response.createItemResponse({ userInfo: result[0], token }));
  } else {
    return res.json(response.createCustomResponse('-1', 'The user name or password is incorrect'));
  }
});

/* POST User Auth */
router.post('/auth', (req, res) => {
  if (req.data) {
    const { name, _id } = req.data;
    return res.json(response.createItemResponse({ userName: name, userId: _id }));
  } else {
    return res.json(response.createCustomResponse('-1', 'No user information is obtained.'));
  }
});

export default router;
```

其中，utils/index 是我们采用 jsonwebtoken 中间件封装的方法，具体为，

```js
import jsonwebtoken from 'jsonwebtoken';
import { SIGN_KEY } from '../constant';

export class TokenUtil {
  /**
   * @description: jsonwebtoken 签名
   * @param {*} username
   * @param {*} userId
   * @return {*}
   */
  sign(username, userId) {
    return new Promise(resolve => {
      const token = jsonwebtoken.sign(
        {
          name: username,
          _id: userId
        },
        SIGN_KEY,
        {
          expiresIn: '1h'
        }
      );
      resolve(`Bearer ${token}`);
    });
  }

  /**
   * @description: jsonwebtoken 认证
   * @param {*} token
   * @return {*}
   */
  verify(token) {
    return new Promise(resolve => {
      const info = jsonwebtoken.verify(token.split(' ')[1], SIGN_KEY);
      resolve(info);
    });
  }
}
```

POST 请求 /api/users/login，参数放置在 body 里面，此时是可以登录成功的，接口返回的 token 将存储在本地缓存（sessionStorage 或者 localStorage）中，在下次请求时放在 headers 中 authorization 字段，服务端要对携带的 token 进行解析，解析成功会返回被加密的信息。但是，还没有做 jsonWebToken 校验的相关处理，/users/auth 接口是拿不到用户数据的。

### Token 的解析与校验

如何对请求携带的 token 进行校验？这里可以采用[express-jwt](https://www.npmjs.com/package/express-jwt)中间件进行校验，以及对异常的错误信息（401 错误等）进行捕获。

app.js

```js
import expressJwt from 'express-jwt';
import { SIGN_KEY } from './src/constant';
import { TokenUtil } from './src/utils/index';
import Response from './src/controller/response';

const app = express();
const response = new Response();
const tokenUtil = new TokenUtil();

// parse token
app.use(function (req, res, next) {
  console.log(req.headers);
  const token = req.headers['authorization'];
  if (token == undefined) {
    return next();
  } else {
    tokenUtil
      .verify(token)
      .then(data => {
        req.data = data;
        return next();
      })
      .catch(() => {
        return next();
      });
  }
});

// authentication token
app.use(
  expressJwt({
    secret: SIGN_KEY,
    algorithms: ['HS256']
  }).unless({
    path: ['/', '/api/user/', '/api/user/login']
  })
);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // catch 401 error
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json(response.createCustomResponse('-1', err.message));
    return;
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
```

## 方案验证

暂时没有提供客户端的实现，这里直接采用 postman 测试一下功能。

### 登录成功

登录验证：POST /users/login，请求参数：{userName: 'admin', password: '123456'}，返回结果:

```json
{
  "code": "0",
  "msg": "SUCCESS",
  "data": {
    "userInfo": {
      "userId": "99170219708121088",
      "userName": "admin",
      "password": "Ul0jhI3RRDvWkINjSckhtw== "
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJfaWQiOiI5OTE3MDIxOTcwODEyMTA4OCIsImlhdCI6MTYxNjA0ODQzOCwiZXhwIjoxNjE2MDUyMDM4fQ.BMDsbu2-qPCJOyRJhGfgUsnCfLBuGRragFJSREtTDRk"
  }
}
```

### 未携带 Token

验证 POST /users/auth 接口，在未携带 Token 的情况下：

```json
{
  "code": "-1",
  "msg": "No authorization token was found",
  "data": null
}
```

### Token 不正确

验证 POST /users/auth 接口，携带不正确 Token 情况下：

```json
{
  "code": "-1",
  "msg": "invalid token",
  "data": null
}
```

### 正常携带 Token

验证 POST /users/auth 接口，携带正确的 Token 情况下：

```json
{
  "code": "0",
  "msg": "身份验证成功",
  "data": {
    "userName": "admin",
    "userId": "99170219708121088"
  }
}
```

项目地址：https://github.com/lcxcsy/express-collection

## Reference

1. [JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
2. [Node 中使用 Sequelize](https://www.liaoxuefeng.com/wiki/1022910821149312/1101571555324224)
