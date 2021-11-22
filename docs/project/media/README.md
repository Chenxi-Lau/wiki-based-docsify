<!--
 * @Author: your name
 * @Date: 2021-08-28 10:53:31
 * @LastEditTime: 2021-10-12 16:32:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MyGithub\blog\docs\video\README.md
-->

## Front-End-Media （前端流媒体）

> 最近在开发一些音视频的相关的项目，这里记录一下。

作为前端工程师，在公司的项目中，涉及与音视频有关的内容大多以视频的取流播放为主，结合一些业务逻辑封装视频播放器（无插件播放器，WS 的取流协议，解码技术依赖于 WebAssembly 技术）。后来，项目中接触到一些音视频通信的业务（主要为 WebRtc 技术），大多数情况是结合公司特定组件的能力，根据其暴露的 APIs 完成一些音视频控制的功能，实现会议软终端、语音通话等功能。

主要项目经历：

1. XXXX 法院智能化改造项目（会议软终端、聊天室）
2. XXXX 交通管理局远程执法项目（APP 与 WEB 端音视频通话）

主要涉及技术点：

- [WebRtc](https://github.com/lcxcsy/webrtc-demo)
- [MSE](http://localhost:49922/#/media/mse)（Media Source Extensions）
- WebAssembly
