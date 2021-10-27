/*
 * @Author: your name
 * @Date: 2021-10-26 16:16:09
 * @LastEditTime: 2021-10-27 09:53:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wiki\docs\.vuepress\config.js
 */
const nav = require('./utils/nav.js')
const { noteSidebar, vueSidebar } = nav

module.exports = {
  // 页面标题
  title: "Blog",
  // 网页描述
  description: '保持一颗学徒的心',
  head: [
    // 页面icon
    ['link', { rel: 'icon', href: '/icon.png' }]
  ],
  // 端口号
  port: 3000,
  markdown: {
    // 代码块行号
    lineNumbers: true
  },
  themeConfig: {
    // 最后更新时间
    lastUpdated: '最后更新时间',
    // 仓库地址
    repo: 'https://github.com/lcxcsy/blog',
    // 仓库链接label
    repoLabel: 'Github',
    // 编辑链接
    editLinks: true,
    // 编辑链接label
    editLinkText: '编辑此页',
    // 导航
    nav: [
      { text: '笔记',link: '/note/'},
      { text: '面经',link: '/interview/'},
      { text: '数据结构和算法', link: '/algorithm/'},
      { text: 'Vue.js', link: '/vue/'}
    ],
    // 侧边栏配置
    sidebar: {
      '/note/': noteSidebar,
      '/vue/': vueSidebar
    },
  },
  configureWebpack: {
    resolve: {
      // 静态资源的别名
      alias: {
        '@vuepress': '../images/vuepress',
        '@vue': '../images/vue'
      }
    }
  }
}