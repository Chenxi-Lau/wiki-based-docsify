<!--
 * @Author: 刘晨曦
 * @Date: 2021-03-13 09:47:39
 * @LastEditTime: 2021-03-13 12:06:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\access-control.md
-->

# 权限控制管理

> 企业内部的各种平台门户 Portal 就是一个入口, 可快速整合应用入口，用来统一账号管理、统一认证登录，打破信息孤岛等，做统一的权限管理，也可以实现单点登录、SSO。

目前，前端实现权限控制主要是从以下这几个角度去实现：

1. 路由层面（Router）

   - router.beforeEach() 拦截路由的钩子
   - 配置 meta 属性
   - router.addRouters() 动态添加路由

2. 视图层面（View）

   - directive 指令

3. 接口层面（Axios）

   - 拦截器验证 token

## 路由层面

## 视图层面

## 接口层面
