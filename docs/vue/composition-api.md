<!--
 * @Author: your name
 * @Date: 2021-09-13 17:01:17
 * @LastEditTime: 2021-09-13 17:10:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki-based-docsify\docs\vue\composition-api.md
-->

## Composition-api

> Composition-api 是 Vue3.0 提出了，以函数为载体，将业务相关的逻辑代码抽取到一起，整体打包对外提供相应能力

官网介绍：[什么是组合式 API？](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E5%90%88%E5%BC%8F-api)

### 在 Vue 2.0 中的使用

```sh
npm i @vue/composition-api -S
```

使用，

```js
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);
```

### 生命周期变化
