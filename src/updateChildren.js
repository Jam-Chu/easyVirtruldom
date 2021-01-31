import patch from './patch';
import createELement from './createElement';

// 判sameNode
let checkSameNode = function (a, b) {
  return a.sel === b.sel && a.data.key === b.data.key;
}

// 处理oldVnode, newVnode的children的最小量更新。
// 实际就是在通过比较oldVnode, newVnode的子节点，在oldVnode.elm这个真实DOM身上对其子节点做出相应操作
export default function updateChildren(parentElm, oldVnodeChildren, newVnodeChildren) {
  // 四指针，及其指向内容的初始化
  let
    // 旧前 -- 旧前指向
    oldTop = 0,
    oldTopVnode = oldVnodeChildren[oldTop],
    // 新前
    newTop = 0,
    newTopVnode = newVnodeChildren[newTop],
    // 旧后
    oldBottom = oldVnodeChildren.length - 1,
    oldBottomVnode = oldVnodeChildren[oldBottom],
    // 新后
    newBottom = newVnodeChildren.length - 1,
    newBottomVnode = newVnodeChildren[newBottom],
    // keyMap，建立old数组的子节点key值和下标的哈希映射，方便查找
    keyMap = null;
  // 大while
  while (oldTop <= oldBottom && newTop <= newBottom) {
    // 先避开所有undefined的项
    if (oldTopVnode === undefined) {
      oldTopVnode = oldVnodeChildren[++oldTop]
    }
    else if (oldBottomVnode === undefined) {
      oldBottomVnode = oldVnodeChildren[--oldBottom]
    }
    // 四命中判断
    else {
      // ============================新前与旧前是sameNode=============================
      if (checkSameNode(oldTopVnode, newTopVnode)) {
        console.log('新前与旧前');
        // 递归对比两个child
        patch(oldTopVnode, newTopVnode);
        // 指针变化
        oldTopVnode = oldVnodeChildren[++oldTop];
        newTopVnode = newVnodeChildren[++newTop];
      }
      // ============================新后与旧后是sameNode=============================
      else if (checkSameNode(oldBottomVnode, newBottomVnode)) {
        // 同上
        console.log('新后与旧后');
        patch(oldBottomVnode, newBottomVnode);
        oldBottomVnode = oldVnodeChildren[--oldBottom];
        newBottomVnode = newVnodeChildren[--newBottom];
      }
      // ============================新后与旧前是sameNode=============================
      else if (checkSameNode(oldTopVnode, newBottomVnode)) {
        console.log('新后与旧前');
        // 递归对比
        patch(oldTopVnode, newBottomVnode);
        // 移动：insertBefore一个已存在的节点就是移动该节点
        // 将旧前节点移到旧后的后面（头插）
        parentElm.insertBefore(oldTopVnode.elm, oldBottomVnode.elm.nextSibling);
        // 修改指针
        oldTopVnode = oldVnodeChildren[++oldTop];
        newBottomVnode = newVnodeChildren[--newBottom];
      }
      // ============================新前与旧后是sameNode=============================
      else if (checkSameNode(oldBottomVnode, newTopVnode)) {
        console.log('新前与旧后');
        // 递归对比
        patch(oldBottomVnode, newTopVnode);
        // 移动：insertBefore一个已存在的节点就是移动该节点
        // 将旧后节点移到旧前的前面（头插）
        parentElm.insertBefore(oldBottomVnode.elm, oldTopVnode.elm);
        // 修改指针
        oldBottomVnode = oldVnodeChildren[--oldBottom];
        newTopVnode = newVnodeChildren[++newTop];
      }
      // ============================均不命中=============================
      else {
        // 制作keyMap
        if (!keyMap) {
          keyMap = {};
          for (let i = oldTop; i <= oldBottom; i++) {
            let key = oldVnodeChildren[i].data.key;
            if (key) {
              keyMap[key] = i;
            }
          }
        };
        // 寻找新前节点在旧节点数组中的对应位置
        let newTopVnodeInOld = keyMap[newTopVnode.data.key];

        // 找到了，且他们是sameNode，则说明需要移动位置
        if (
          newTopVnodeInOld !== undefined && newTopVnode.sel === oldVnodeChildren[newTopVnodeInOld].sel) {

          let moveElm = oldVnodeChildren[newTopVnodeInOld];
          // console.log(moveElm.elm)
          patch(moveElm, newTopVnode);
          oldVnodeChildren[newTopVnodeInOld] = undefined;
          parentElm.insertBefore(moveElm.elm, oldTopVnode.elm);
        }
        // 找不到，说明需要新增
        else {

          parentElm.insertBefore(createELement(newTopVnode), oldTopVnode.elm)
        }
        // 修改指针
        newTopVnode = newVnodeChildren[++newTop];
      }
    }

  }
  // while完成后，检查指针情况
  // new数组没遍历完，则剩余的都要新增进去
  if (newTop <= newBottom) {
    // 寻找插入标杆
    // 如果是undefined，则在最后插入
    // 不是undefined，则在旧前的前面插入
    let before = newVnodeChildren[newBottom + 1] == undefined ? undefined : oldVnodeChildren[oldTop].elm;
    for (let i = newTop; i <= newBottom; i++) {
      parentElm.insertBefore(createELement(newVnodeChildren[i]), before);
    }
  }
  // old数组没遍历完，则剩余的都要删除
  else if (oldTop <= oldBottom) {
    // 批量删除两个指针之间的所有元素
    for (let i = oldTop; i <= oldBottom; i++) {
      if (oldVnodeChildren[i]) {
        parentElm.removeChild(oldVnodeChildren[i].elm);
      }
    }
  }
}

