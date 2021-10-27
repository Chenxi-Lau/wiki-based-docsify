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
      'node/core.md',
    ]
  },
  {
    title: 'Webpack',
    collapsable: false,
    children: [ 
      'webpack/mechanism.md',
      'webpack/loader.md',
      'webpack/plugin.md',
    ]
  }
]

const vueSidebar =[
  {
    title: '基础模块',
    collapsable: false,
    children: [ 
      'router.md',
      'store.md',
      'components-props.md',
      'composition-api.md',
    ]
  },
  {
    title: '原理探索',
    collapsable: false,
    children: [
      'reactivity.md', 
      'virtualDom.md'
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

module.exports = {
  noteSidebar,
  vueSidebar
}