const nav = require('./utils/nav.js')
const { noteSidebar, vueSidebar, webpackSidebar, projectSidebar } = nav

module.exports = {
  base: '/blog/',
  // 页面标题
  title: 'Blog',
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
    lineNumbers: false
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
      { text: 'Vue.js', link: '/vue/'},
      { text: 'Webpack', link: '/webpack/'},
      { text: '经验案例', link: '/project/'},
      { text: '数据结构和算法', link: '/algorithm/'},
    ],
    // 侧边栏配置
    sidebar: {
      '/note/': noteSidebar,
      '/vue/': vueSidebar,
      '/webpack/': webpackSidebar,
      '/project/': projectSidebar,
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