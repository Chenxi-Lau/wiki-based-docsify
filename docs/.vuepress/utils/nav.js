// 前端笔记，主要包括：CSS、JS、TS、Node的相关知识
const noteSidebar = [
  {
    title: 'CSS',
    collapsable: false,
    children: [ 
      'css/pre-processor.md',
    ]
  },
  {
    title: 'JavaScript',
    collapsable: false,
    children: [ 
      'javascript/basic-knowledge.md',
      'javascript/event-loop.md',
    ]
  },
  {
    title: 'ECMAScript',
    collapsable: false,
    children: [ 
      'es6/class.md',
      'es6/map.md',
      'es6/set.md',
    ]
  },
  {
    title: 'TypeScript',
    collapsable: false,
    children: [ 
      'typescript/basic-knowledge.md',
    ]
  },
  {
    title: 'NodeJS',
    collapsable: false,
    children: [ 
      'node/core.md',
    ]
  }
]

// 面试总结
const interviewSidebar = [
  {
    title: '面试经验',
    collapsable: false,
    children: [ 
      'honer.md'
    ]
  }
]


// Vue框架相关
const vueSidebar =[
  {
    title: '基础模块',
    collapsable: false,
    children: [ 
      'router.md',
      'store.md',
      'components-props.md',
      'composition-api.md'
    ]
  },
  {
    title: '原理探索',
    collapsable: false,
    children: [
      'reactivity.md', 
      'virtual-dom.md'
    ]
  },
  {
    title: '最佳实践',
    collapsable: false,
    children: [
      'best-practice.md'
    ]
  }
]

// 项目经验案例
const projectSidebar = [
  {
    title: '方法总结',
    collapsable: false,
    children: [ 
      'project/access-control.md',
      'project/crypto-aes.md',
      'project/custom-table.md',
      'project/file-download.md',
      'project/json-web-token.md',
      'project/local-ip.md',
      'project/postMessage.md',
      'project/tree-method.md',
      'project/websocket.md'
    ]
  }, {
    title: '前端流媒体',
    collapsable: false,
    children: [ 
      'media/base-knowledge.md',
      'media/mse.md',
      'media/webRtc.md',
    ]
  }, {
    title: '移动端相关',
    collapsable: false,
    children: [ 
      'mobile/mobile-adaptation.md'
    ]
  }
]

// 前端工程化相关
const webpackSidebar = [
  {
    title: 'Webpack',
    collapsable: false,
    children: [ 
      'mechanism.md',
      'modules.md',
      'loader.md',
      'plugin.md',
    ]
  }
]

// 算法数据结构相关

module.exports = {
  noteSidebar,
  interviewSidebar,
  vueSidebar,
  webpackSidebar,
  projectSidebar
}