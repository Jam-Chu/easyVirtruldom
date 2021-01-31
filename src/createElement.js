// createElement(newVnode) 将Vnode变为真实DOM，返回这个真实DOM
export default function createElement(newVnode) {
  // 生成真实DOM
  let newDomNode = document.createElement(newVnode.sel);
  // 挂载行内属性
  [...Object.keys(newVnode.data)].forEach(item => {
    if (item !== 'key') {
      newDomNode.setAttribute(item, newVnode.data[item])
    }
  })
  newVnode.elm = newDomNode;
  // ========做化简处理：插槽中仅可能有文本或嵌套数组中的一个============
  // 新节点插槽中是文本，或是个空节点
  if (newVnode.text !== undefined || (newVnode.text === undefined && newVnode.children.length === 0)) {
    newDomNode.innerText = newVnode.text;
  }
  // 有嵌套子节点，递归生成真实DOM，挂载到前一级父元素中
  else if (newVnode.children.length > 0) {
    newVnode.children.forEach(child => {
      // 遍历，逐项将child（虚拟DOM）生成为真实DOM，并挂载在**它的父节点**中
      let childDomNode = createElement(child);
      newVnode.elm.appendChild(childDomNode);
    })
  }
  return newVnode.elm
}