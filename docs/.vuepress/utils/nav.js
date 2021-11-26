// 前端笔记，主要包括：CSS、JS、TS、Node的相关知识
const noteSidebar = [
  {
    title: 'CSS',
    collapsable: true,
    children: [ 
      'css/box-model.md',
      'css/transition.md',
      'css/pre-processor.md',
    ]
  },
  {
    title: 'JavaScript',
    collapsable: true,
    children: [ 
      'javascript/core.md',
      'javascript/event-loop.md',
    ]
  },
  {
    title: 'ECMAScript',
    collapsable: true,
    children: [ 
      'es6/class.md',
      'es6/map.md',
      'es6/set.md',
      'es6/symbol.md',
    ]
  },
  {
    title: 'TypeScript',
    collapsable: true,
    children: [ 
      'typescript/',
    ]
  },
  {
    title: 'NodeJs',
    collapsable: true,
    children: [ 
      'node/core.md',
    ]
  },
  {
    title: 'Linux',
    collapsable: true,
    children: [ 
      'linux/commands.md',
    ]
  },
  {
    title: '计算机网络',
    collapsable: true,
    children: [ 
      'network/main',
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

// 算法数据结构相关

module.exports = {
  noteSidebar,
  interviewSidebar,
  vueSidebar,
  projectSidebar
}