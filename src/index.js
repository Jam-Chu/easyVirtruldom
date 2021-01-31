import h from './h';
import patch from './patch'


// const oldVnode = h('ul', [
//   h('li', {}, 'aaa'),
//   h('li', {}, 'bbb'),
//   h('li', [
//     h('div',[
//       h('p', '哈哈'),
//       h('p','hehe')
//     ])
//   ]),
//   h('li',h('p','火龙果'))
// ])
// const newVnode = h('ul', [
//   h('li', {}, 'aaa'),
//   h('li', {}, 'bbb'),
//   h('li', [
//     h('div',[
//       h('p', '哈哈'),
//       h('p','hehe')
//     ])
//   ]),
//   h('li',h('p','火龙果'))
// ])


document.querySelector('#btn').addEventListener('click', () => {
  patch(oldVnode, newVnode);
})
const container = document.getElementById('container');
const oldVnode = h('ul', { key: 'new', a: '2', c: '3' }, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E'),

]);
const newVnode = h('ul', { key: 'new', id: 'app', a: '1' }, [
  h('li', { key: 'Q' }, 'Q'),
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'K' }, 'K'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'F' }, 'F'),
  h('li', { key: 'E' }, 'E'),
  h('li', { key: 'B' }, 'B'),
]);
// 第一次比较patch：(真实DOM，虚拟DOM)
patch(container, oldVnode);













