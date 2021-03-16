/*
 * @Author: your name
 * @Date: 2021-03-15 15:20:45
 * @LastEditTime: 2021-03-15 16:52:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\addRoute.js
 */
router.beforeEach(async (to, from, next) => {
  // 判断用户是否已经登录
  if (window.sessionStorage.getItem('token')) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const constantRoutes = store.getters.roles && store.getters.roles.length > 0
      if (constantRoutes) {
        // 有权限，正常跳转
        next()
      } else {
        // 如果没有权限，则获取用户信息
        const { roles } = await store.dispatch('user/getRoles')
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        // dynamically add accessible routers
        router.addRoute(accessRoutes)
      }
    }
  } else {
    // 跳转至登录页面
    next({ path: '/login' })
  }
})

const actions = {
  generateRoutes ({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

// utils/filterAsyncRoutes.js
function filterAsyncRoutes (routes, roles) {
  const res = []
  routes.forEach(route => {
    const temp = { ...route }
    if (hasPermission(roles, temp)) {
      if (temp.children) {
        temp.children = filterAsyncRoutes(temp.children, roles)
      }
      res.push(temp)
    }
  })
  return res
}
