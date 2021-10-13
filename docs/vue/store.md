<!--
 * @Author: 刘晨曦
 * @Date: 2021-08-26 16:28:18
 * @LastEditTime: 2021-10-13 13:51:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MyGithub\wiki-based-docsify\docs\vue\vuex.md
-->

## VUEX 数据存储

> 经常有很多数据需要存到 vuex 的 store 里，流程比较麻烦，这里记录一个完整了 store 的使用流程。

### 目录结构

store 在项目中放置的目录结构,

```sh
└── src
    └── store
      └── modules
        ├── users.js
        └── city.js
      ├── actions.js
      ├── mutations.js
      └── index.js
```

其中，index.js 为入口文件

```js
import Vue from 'vue'; // 引入vue
import Vuex from 'vuex'; // 引入vuex
import mutations from './mutations'; // 引入mutations
import actions from './actions'; // 引入actions
import users from './modules/users'; //作为模块引入
import city from './modules/city';

Vue.use(Vuex);

const state = {};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    users,
    city
  }
});
```

### modules 模板

这里选用了一个存储用户信息的 store,

```js
import { setLocalStore, getLocalStore, setSessionStore, removeSessionStore } from '@/utils/storage';

// 定义常量
const USER_INFO = 'USER_INFO';
const SET_TOKEN = 'SET_TOKEN';
const USER_JOBNO = 'USER_JOBNO';
const REMOVE_TOKEN = 'REMOVE_TOKEN';

const user = {
  // 定义存储字段
  state: {
    users: {},
    token: '',
    jobNo: getLocalStore('jobNo') || ''
  },

  // 获取
  getters: {
    users: state => state.users,
    jobNo: state => state.jobNo,
    token: state => state.token
  },

  // 定义mutations
  mutations: {
    // 保存token到Session
    SET_TOKEN: (state, token) => {
      state.token = token;
      setSessionStore('token', token);
    },

    // 删除token
    REMOVE_TOKEN: state => {
      removeSessionStore('token');
    },

    // 保存用户信息到本地
    USER_INFO: (state, { users }) => {
      state.users = users;
      setLocalStore('users', state.users);
    },

    // 保存用户账号到本地
    USER_JOBNO: (state, jobNo) => {
      state.jobNo = jobNo;
      setLocalStore('jobNo', state.jobNo);
    }
  },

  // 定义actions
  actions: {
    // 同步用户信息
    syncUsers({ commit }, users) {
      commit(USER_INFO, { users });
    },

    // 同步用户账号
    syncJobNo({ commit }, jobNo) {
      commit(USER_JOBNO, jobNo);
    },

    // 同步token
    syncToken({ commit }, token) {
      commit(SET_TOKEN, token);
    },

    // 删除token
    removeToken({ commit }) {
      commit(REMOVE_TOKEN);
    }
  }
};

export default user;
```

### 使用规则

```js
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['token', 'jobNo'])
  },
  methods: {
    ...mapActions(['syncJobNo', 'syncToken'])
  }
};
```

## 其他方法

如果涉及到的本地存储（localStorage、sessionStorage）的方法如下：

```js
// token存储到sessionStorage, 只在当前页有效
const setSessionStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};

// 本地化删除token
const removeSessionStore = name => {
  if (!name) return;
  return window.sessionStorage.removeItem(name);
};

// 账号姓名存储到localStorage中
const setLocalStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

// 本地化获取
const getLocalStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};
// 本地化删除
const removeLocalStore = name => {
  if (!name) return;
  return window.localStorage.removeItem(name);
};

export { setSessionStore, removeSessionStore, setLocalStore, getLocalStore, removeLocalStore };
```
