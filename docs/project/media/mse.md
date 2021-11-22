# MSE(Media Source Extensions)

> 媒体源扩展 API（MSE） 提供了实现无插件且基于 Web 的流媒体的功能。使用 MSE，媒体串流能够通过 JavaScript 创建，并且能通过使用 <audio> 和 <video> 元素进行播放。

## 1.Video 标签

以往用户在浏览网页内容尤其是视频内容时，需要使用像 Adobe Flash 或是微软的 Silverlight 这样的插件，HTML5 标准中，定义了一系列新的元素来避免使用插件，其中就包含了<video>标签这一大名鼎鼎的元素。

目前，`<video>`支持三种视频格式：`MP4`、`WebM`、`Ogg`，可以看做拥有解封装和解码功能的浏览器自带播放器。随着视频点播、直播等视频业务的发展，视频通过流媒体传输协议从服务器端分发给客户端，媒体内容进一步包含在一层传输协议中，这样<video>就无法识别了。

## 2.MSE 标准

媒体源扩展（MSE）实现后，使我们可以把通常的单个媒体文件的 src 值替换成引用 MediaSource 对象（一个包含即将播放的媒体文件的准备状态等信息的容器），以及引用多个 SourceBuffer 对象（代表多个组成整个串流的不同媒体块）的元素。MSE 让我们能够根据内容获取的大小和频率，或是内存占用详情（例如什么时候缓存被回收），进行更加精准地控制。

主要 APIs 接口：

1. MediaSource：代表了将由 HTMLMediaElement 对象播放的媒体资源。
2. SourceBuffer：代表了一个经由 MediaSource 对象被传入 HTMLMediaElement 的媒体块。
3. SourceBufferList (en-US)： 列出多个 SourceBuffer 对象的简单的容器列表。
4. VideoPlaybackQuality： 包含了有关正被 <video> 元素播放的视频的质量信息，例如被丢弃或损坏的帧的数量。由 HTMLVideoElement.getVideoPlaybackQuality() (en-US) 方法返回。
   TrackDefault
   为在媒体块的初始化段（initialization segments）中没有包含类型、标签和语言信息的轨道，提供一个包含这些信息的 SourceBuffer。
   TrackDefaultList
   列出多个 TrackDefault 对象的简单的容器列表。

## 3.DEMO

## References

1. [Media Source Extensions API](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Source_Extensions_API)
