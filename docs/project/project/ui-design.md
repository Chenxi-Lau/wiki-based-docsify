# 前端组件库的开发与构建

> 项目地址：http://gitlab-g.ipd.hihonor.com/h00020023/nodemodules/-/tree/master/honor-ui

## Motivation

1. 方便工具代码的统一管理即
2. 构建统一带代码

## Development

### 目录结构

```
├─dist                    #  构建产物
├─docs                    #  组件说明文档
├─internal/build          #  构建相关
├─packages                #  源代码
│  ├─components           ## 组件
│  ├─hooks                ## 钩子函数
│  ├─locale               ## 国际化
│  ├─theme                ## 样式主题
│  └─utils                ## 布局组件
├─scripts                 #  一些脚本
└─play                    #  工具库
```

### 依赖安装

```sh
pnpm install
```

#### [PNPM](https://www.pnpm.cn/)

包管理工具采用 pnpm，
全局安装 pnpm (版本：_6.32.3_)

```sh
npm install -g pnpm
```

安装特定版本：

```sh
pnpm add -g pnpm@6.32.3
```

#### 模板生成

```sh
pnpm run gen

# 可选项
? 请选择组件所属模块 common
? 请输入新建的组件名(小写英文)：
? 请输入新建的组件名(中文)：
? 请输入组件的功能描述：
```

## 使用

```sh
# NPM
npm install @cloudservice/honor-ui
```

### 完整引入

```js
// main.js
import App from "./App.vue";
import { createApp } from "vue";
import HUI from "@cloudservice/honor-ui";
import "@cloudservice/honor-ui/theme";

const app = createApp(App);
app.use(HUI);
app.mount("#app");
```

### 按需导入

```js
// main.js
import App from "./App.vue";
import { createApp } from "vue";
import { CommonSplit } from "@cloudservice/honor-ui";
import "@cloudservice/honor-ui/theme";

const app = createApp(App);
app.use(CommonSplit);
app.mount("#app");
```

:::warning

由于 HonorUI 大部分采用 ElementPlus 样式，组件库样式暂时未做按需导入，需要全部引入。

:::

utils/hooks 的引入：

```js
// utils
import { * } from "@cloudservice/honor-ui/utils";
// hooks
import { * } from "@cloudservice/honor-ui/hooks";
```

## Development

开发流程：本地打包 -> 打包上线

```sh
pnpm run build
```

最终构建产物：

```
dist/
├─es                # bundleless 构建产物，ESM 格式
├─lib               # bundleless 构建产物，CJS 格式
├─theme             # 样式产物
└─package.json
```

### 构建流程

### 组件封装思路

基础 UI 组件 -> 业务组件 -> 区块组件 -> 页面（BusinessTemplate）

构建应用/库的流程：
![构建流程](https://mmbiz.qpic.cn/mmbiz_png/ndgH50E7pIp3RE6IPo0TlPliacOgZy8oY7MB2K5icRtib5Lgic5h0uicAb7C5AJX3Rc3mficTZ2UTxYDHuI8MQM5micfQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

Task Runner 任务运行器: 开发者设置脚本让构建工具完成开发、构建、部署中的一系列任务, 大家日常常用的是 npm/yarn 的脚本功能; 在更早一些时候, 比较流行 Gulp/Grunt 这样的工具

Package Manager 包管理器: 这个大家都不会陌生, npm/Yarn/pnmp 帮开发者下载并管理好依赖, 对于现在的前端开发来说必不可少.

Compiler/Transpiler 编译器: 在市场上很多浏览器还只支持 ES5 语法的时候, Babel 这样的 Comipler 在前端开发中必不可少; 如果你是用 TypeScript 的话, 也需要通过 tsc 或者 ts-loader 进行编译.

Bundler 打包工具: 从开发者设置的入口出发, 分析模块依赖, 加载并将各类资源最终打包成 1 个或多个文件的工具.

[ElementPlus 的构建流程](https://github.com/element-plus/element-plus/blob/2.1.4/internal/build/gulpfile.ts)：

```js
export default series(
  // 1. clean 清理产物
  withTaskName("clean", () => run("pnpm run clean")),
  // 2. 创建构建产物的目录
  withTaskName("createOutput", () => mkdir(epOutput, { recursive: true })),
  // 3. 并行执行多个任务
  parallel(
    // 3.1  构建 Bundless 产物 分为 es/lib 两个版本
    runTask("buildModules"),
    // 3.2  构建完整产物 Bundle 产物
    runTask("buildFullBundle"),
    // 3.3 生成 .d.ts 文件
    runTask("generateTypesDefinitions"),
    // 3.4 生成 IDE 支持 -> 可能以后会被移除 -> VSCode + Volar
    runTask("buildHelper"),
    // 3.5 构建样式
    series(
      withTaskName("buildThemeChalk", () => run("pnpm run --filter ./packages/ build --parallel")),
      copyFullStyle
    )
  ),

  //
  parallel(copyTypesDefinitions, copyFiles)
);
```

项目中简化为：

```js
const main = async () => {
  // 1. 清除上次的构建物
  const success = await removeDir(buildOutput);
  // 2. 构建组件库及工具库
  await buildModules();
  // 3. 构建样式库
  await buildThemes();
  // 4. 复制样式文件及package.json
  copyTheme();
  copyPackage();
};
```

### ESM 和 Bundless

打包工具分类：
1- vite,snowpack,rollup
2- webpack

![bundle vs bundless](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9NcEdRVUhpYWliNGliNmdJdzNmOVFScXVDYm1KSjlIWUVPNHYxM05qRGFoRklpYzdZOUdBbjFXQUZDWTU3b0d1QWtkeGJ1WEdCaFVOdmZjN2liUnUzVUw3dGN3LzY0MA?x-oss-process=image/format,png)

### Rollup （打包工具）

Rollup 是不能解析像 TypeScript、Vue SFC 这些非 JavaScript 的代码，所以需要借助各种插件，来帮助 Rollup 将其转换为 JavaScript 代码。Rollup 也不能解析 CommonJS 格式的代码，还需要插件来帮助 Rollup 解决这些问题。

#### Plugin

1. @vitejs/plugin-vue

   Vite 官方插件，把 Vue SFC 编译为 JavaScript 代码。

2. rollup-plugin-esbuild

   用于把 TypeScript 转换为 JavaScript，并可以用于压缩代码、转换语法。基于 ESBuild，速度极快。

3. @rollup/plugin-node-resolve

   Rollup 官方插件，让 Rollup 支持 Node.js 的解析算法，用于解析 node_modules。

#### 配置

```js
// build-info
export const buildConfig = {
  esm: {
    module: "ESNext",
    format: "esm",
    ext: "mjs",
    output: {
      name: "es",
      path: path.resolve(epOutput, "es"),
    },
    bundle: {
      path: `${EP_PKG}/es`,
    },
  },
  cjs: {
    module: "CommonJS",
    format: "cjs",
    ext: "js",
    output: {
      name: "lib",
      path: path.resolve(epOutput, "lib"),
    },
    bundle: {
      path: `${EP_PKG}/lib`,
    },
  },
};

// modules
await writeBundles(
  bundle,
  buildConfigEntries.map(([module, config]): OutputOptions => {
    return {
      format: config.format,
      dir: config.output.path,
      exports: module === "cjs" ? "named" : undefined,
      preserveModules: true,
      preserveModulesRoot: epRoot,
      sourcemap: true,
      entryFileNames: `[name].${config.ext}`,
    };
  })
);
```

### 发布

```sh
# publish
pnpm run publish

# unpublish
pnpm run unpublish
```
