import Vnode from './vnode';

// h函数，传入真实标签的相关数据，将其产生为虚拟DOM树
export default function h(sel, data, c) {
  // 不传参报错，且始终检查sel
  if (arguments.length < 1) throw new Error('h函数至少有一个参数');
  if (typeof sel !== 'string') { throw new Error('sel必须为字符串') }
  // 只传了一个sel
  if (arguments.length === 1) {
    return new Vnode(sel)
  }
  // 传了两个参数
  else if (arguments.length === 2) {
    // 如果data是一个字符串，则传入的其实是c
    if (typeof data === 'string') return new Vnode(sel, {}, data)
    // 如果data是一个Vnode对象，则传入的是c
    else if (Object.prototype.toString.call(data) === '[object Vnode]') return new Vnode(sel, {}, undefined, [data])
    // 如果data传入一个数组，则其实传入的是c
    else if (Array.isArray(data)) {
      let c = [];
      // 遍历检查数组中的项是否为
      data.forEach(item => {
        if (!(Object.prototype.toString.call(item) === '[object Vnode]')) {
          throw new Error('children的每一项必须是Vnode');
        }
        c.push(item);
      });
      data = {};
      return new Vnode(sel, data, undefined, c);
    }
    // 如果data是个普通对象，则是真正的data
    else if (Object.prototype.toString.call(data) === '[object Object]') {
      return new Vnode(sel, data)
    } 
    // 其余情况报错
    else throw new Error('data必须是个对象')

  }
  // 传了三个参数
  else {
    // 三参数data检查
    if (Object.prototype.toString.call(data) !== '[object Object]') throw new Error('data必须是一个普通对象');
    // c检查,如果c是数组
    if (Array.isArray(c)) {
      c.forEach(item => {
        if (!(Object.prototype.toString.call(item) === '[object Vnode]')) {
          throw new Error('children的每一项必须是Vnode');
        }
      })
      return new Vnode(sel, data, undefined, c)
    }
    // c是Vnode
    else if (Object.prototype.toString.call(c) === '[object Vnode]') {
      return new Vnode(sel, data, undefined, [c])
    }
    // c是string
    else if (typeof c === 'string') {
      return new Vnode(sel, data, c)
    }
    // 其他类型报错
    else throw new Error('c必须是数组、Vnode、string中的一种')
  }
}