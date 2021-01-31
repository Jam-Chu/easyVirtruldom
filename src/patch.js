import Vnode from './vnode';
import createElement from './createElement';
import patchDiff from './patchDiff'

export default function patch(oldVnode, newVnode) {
  // 如果oldVnode是真实DOM，将oldVnode包装为Vnode
  if (!oldVnode.sel) oldVnode = new Vnode(oldVnode.tagName.toLowerCase(), {}, undefined, [], oldVnode)


  // ========同一个节点，选择器相同 且（key均不存在、key均存在且相等）======================
  if (oldVnode.sel === newVnode.sel && oldVnode.data.key === newVnode.data.key) {
    // 判断是否是同一个对象
    if (oldVnode === newVnode) return;
    // 处理data行内属性
    let newAttrs = [...Object.keys(newVnode.data)].filter(item => item !== 'key');
    let oldAttrs = [...Object.keys(oldVnode.data)];
    if (newAttrs.length !== 0) {
      if (oldAttrs.length === 0) {
        newAttrs.forEach(newAttr => {
          oldVnode.elm.setAttribute(newAttr, newVnode.data[newAttr])
        })
      } else {
        // 处理修改和新增
        newAttrs.forEach(newAttr => {
          oldVnode.elm.setAttribute(newAttr, newVnode.data[newAttr])
        })
        // 处理删除
        oldAttrs.forEach(oldAttr => {
          if (!newVnode.data.hasOwnProperty(oldAttr)) {
            oldVnode.elm.removeAttribute(oldAttr)
          }
        })
      }
    } else {
      if (oldAttrs.length !== 0) {
        oldAttrs.forEach(oldAttr => {
          oldVnode.elm.removeAttribute(oldAttr)
        })
      }
    }
    // sameNode同节点比较操作，抽离为函数
    patchDiff(oldVnode, newVnode)
  }
  // ================不是同一个节点，需要暴力插入新DOM，删除旧DOM==================
  else {
    // 将newNode转化为真实DOM，并插入在旧节点（标杆）前
    let newdomNode = createElement(newVnode);
    oldVnode.elm.parentNode.insertBefore(newdomNode, oldVnode.elm);
    // 删除标杆
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}