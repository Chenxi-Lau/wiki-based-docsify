# AES/ECB/PKCS5Padding 前后端加解密

> 使用 CryptoJs 对登录密码进行 AES/ECB/PKCS5Padding 加密，后台进行机密。

在数字加密算法中，通过可划分为对称加密和非对称加密。

- 对称加密：双方使用的同一个密钥，既可以加密又可以解密，这种加密方法称为对称加密，也称为单密钥加密。几种对称性加密算法：AES，DES，3DES。
- 非对称加密：有两个钥匙，及公钥（Public Key）和私钥（Private Key）。公钥和私钥是成对的存在，如果对原文使用公钥加密，则只能使用对应的私钥才能解密；因为加密和解密使用的不是同一把密钥，所以这种算法称之为非对称加密算法。几种非对称性加密算法：RSA，DSA，ECC。

## 1.前端加密/解密函数

首先，用 MD5 算法（签名算法）对用户名进行加密生成 16 位秘钥，然后用 AES/ECB/PKCS5Padding 对密码进行加密（解密）：

```js
import CryptoJS from 'crypto-js';

/**
 * @description: AES/ECB/PKCS5Padding 加密
 * @param {*} name
 * @param {*} password
 * @return {*} 加密后的密文
 */
function aesEncrypt(name = '', password = '') {
  try {
    const hash = CryptoJS.MD5(name).toString().substring(0, 16); // 产生秘钥
    const key = CryptoJS.enc.Utf8.parse(hash);
    const message = CryptoJS.enc.Utf8.parse(password);
    const encrypted = CryptoJS.AES.encrypt(message, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  } catch (err) {
    return false;
  }
}

/**
 * @description: AES/ECB/PKCS5Padding 解密
 * @param {*} name
 * @param {*} password
 * @return {*} 解密后的明文
 */
function aesDecrypt(name, password) {
  try {
    const hash = CryptoJS.MD5(name).toString().substring(0, 16); // 产生秘钥
    const key = CryptoJS.enc.Utf8.parse(hash);
    const decrypt = CryptoJS.AES.decrypt(password, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  } catch (err) {
    return false;
  }
}
```

## 2.Java 解密方式

```java
import org.springframework.util.StringUtils;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class EncryptUtil {
  /**
    * AES解密
    * @param encryptStr 密文
    * @param decryptKey 秘钥，必须为16个字符组成
    * @return 明文
    * @throws Exception
    */
  public static String aesDecrypt(String encryptStr, String decryptKey) throws Exception {
    if (StringUtils.isEmpty(encryptStr) || StringUtils.isEmpty(decryptKey)) {
        return null;
    }

    byte[] encryptByte = Base64.getDecoder().decode(encryptStr);
    Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
    cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(decryptKey.getBytes(), "AES"));
    byte[] decryptBytes = cipher.doFinal(encryptByte);
    return new String(decryptBytes);
  }

  /**
    * AES加密
    * @param content 明文
    * @param encryptKey 秘钥，必须为16个字符组成
    * @return 密文
    * @throws Exception
    */
  public static String aesEncrypt(String content, String encryptKey) throws Exception {
    if (StringUtils.isEmpty(content) || StringUtils.isEmpty(encryptKey)) {
        return null;
    }

    Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
    cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(encryptKey.getBytes(), "AES"));

    byte[] encryptStr = cipher.doFinal(content.getBytes(StandardCharsets.UTF_8));
    return Base64.getEncoder().encodeToString(encryptStr);
  }
}
```
