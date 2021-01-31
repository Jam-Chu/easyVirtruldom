// 虚拟DOM节点类

export default class Vnode {
  constructor(
    // 标签名
    sel,
    // 行内属性存储
    data = {},
    // 插槽中的文本节点
    text = undefined,
    // 插槽中的嵌套虚拟DOM子节点
    children = [],
    // 在Vnode被真实创建时，elm指向由自身创建出的真实DOM
    elm = undefined
  ) {
    this.sel = sel;
    this.data = data;
    this.text = text;
    this.children = children;
    this.elm = elm;
  }
  // 加上自定义类tag
  get [Symbol.toStringTag]() {
    return 'Vnode';
  }
}