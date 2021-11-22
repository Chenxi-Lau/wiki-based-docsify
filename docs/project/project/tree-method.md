# 树结构的一些操作方法

> 在业务开发中，我们经常遇到树型结构的展示，这里总结一些常用的操作树结构的方法。

## 1.将 SimpleData 的树结构转为普通树结构

将 SimpleData 的树结构转换为普通的树结构

```js
/**
 * @description: 将树组件的simpleData格式转换为树结构
 * @param {*} sNodes 带转换的数据
 * @param {*} key 当前节点的key值
 * @param {*} parentKey 父节点的key值
 * @param {*} childKey 子节点的key值
 * @return {*} 嵌套形式的树结构
 */
function getTree(sNodes = [], key, parentKey, childKey) {
  if (!key || !sNodes || !sNodes.length) return [];
  const res = [];
  const hashMap = new Map();
  // 以key为键值，将sNode的每一项内容存储下来
  for (let i = 0; i < sNodes.length; i++) {
    hashMap.set(sNodes[i][key], sNodes[i]);
  }
  for (let i = 0; i < sNodes.length; i++) {
    // 如果存在父节点且当前节点不等于父节点，那么将当前节点加入到
    const currentParentKey = hashMap.get(sNodes[i][parentKey]);
    if (currentParentKey && sNodes[i][key] !== sNodes[i][parentKey]) {
      // 如果父节点没有childKey这个键值，要先赋值一个空数组
      if (!currentParentKey[childKey]) {
        currentParentKey[childKey] = [];
        hashMap.set(sNodes[i][parentKey], currentParentKey);
      }
      // 将当前节点加入到父节点的childKey里面
      currentParentKey[childKey].push(sNodes[i]);
    } else {
      sNodes[i].depth = 0;
      res.push(sNodes[i]);
    }
  }
  return res;
}
```

## 2.将普通树结构转化为 SimpleData 的树结构

通过递归方法，将普通树结构转化为 SimpleData 的树结构

```js
/**
 * @description: 获取树结构的simpleData的形式
 * @param {*} treeData 嵌套形式的树结构
 * @return {*} simpleData形式的树结构
 */
function getSimpleData(treeData = []) {
  const result = [];
  const depthFun = data => {
    if (data.children) {
      const tempData = Object.assign({}, data);
      delete tempData.children;
      result.push(tempData);
      data.children.forEach(child => depthFun(child));
    } else {
      result.push(data);
    }
  };
  if (Array.isArray(treeData) && treeData.length) {
    treeData.forEach(item => {
      depthFun(item);
    });
  }
  return result;
}
```

## 3.获取树结构每一层的深度

通过递归方法，获取树结构的每一层深度，前提条件是树的形式不是 SimpleData 的形式，

```js
/**
 * @description: 获取树节点每一层的深度
 * @param {*} treeData
 * @return {*} 含有当前节点层级的的treeData
 */
const getDepth = function (treeData) {
  const depthFun = (data, depth) => {
    if (!data.depth) {
      data.depth = depth + 1;
    }
    data.children && data.children.forEach(child => depthFun(child, data.depth));
  };
  treeData.forEach(item => {
    if (!item.depth) {
      item.depth = 1;
    }
    depthFun(item, item.depth);
  });
  return treeData;
};
```

## References

1. [https://element.eleme.cn/#/zh-CN/component/tree](https://element.eleme.cn/#/zh-CN/component/tree)
