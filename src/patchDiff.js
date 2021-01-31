import createElement from './createElement';
import updateChildren from './updateChildren';

// oldVnode, newVnode是sameNode，则处理如下
export default function patchDiff(oldVnode, newVnode) {
  // ====================新节点仅有text（包括全空）======================
  if (newVnode.text !== undefined || (newVnode.text === undefined && newVnode.children.length === 0)) {
    // 新节点有text或text和children都没有
    // 不同则直接修改
    if (newVnode.text !== oldVnode.text || (newVnode.text === undefined)) {
      oldVnode.elm.innerText = newVnode.text || '';
    }
  }
  // =========================新节点没有text，仅有children=============================
  else {
    // 若老节点也有children，则要**最小量优化更新**
    if (oldVnode.children.length > 0) {
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    }
    // 若老节点没有children，老节点有没有text都没关系
    else {
      // 清空老节点的innerText
      oldVnode.elm.innerHTML = '';
      // 加入newVnode的儿子转化来的DOM，注意不是加入newVnode，而是将其儿子逐一追加
      newVnode.children.forEach(child => {
        let childDom = createElement(child)
        oldVnode.elm.appendChild(childDom);
      })
    }
  }
}