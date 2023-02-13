function onResolved(id) {
    setTimeout(console.log, 0, id, 'resolved');
}

function onRejected(id) {
    setTimeout(console.log, 0, id, 'rejected');
}

// let p1 = new Promise((resolve, reject) => setTimeout(resolve, 6000));
// // then() 接收两个参数，第一个是 onResolved 处理程序，第二个是 onRejected 处理程序
// p1.then(
//     () => onResolved('p1'), // 进入这里
//     () => onRejected('p1')
// );    // p1 resolved
// let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000));
// p2.then(
//     () => onResolved('p2'),
//     () => onRejected('p2')  // 进入这里
// );  // p2 rejected


// let p3 = new Promise((resolve, reject) => setTimeout(resolve, 3000));
// // 非函数处理程序会被静默忽略，不推荐
// p3.then('gobbeltygook');
// let p4 = new Promise((resolve, reject) => setTimeout(reject, 3000));
// // 不传 onResolved 处理程序的规范写法
// p4.then(null, () => onRejected('p4'));


// let p5 = new Promise(() => {});
// let p6 = p5.then();                     // p6 是一个新的 Promise 对象
// setTimeout(console.log, 0, p5); // -> Promise <pending>
// setTimeout(console.log, 0, p6); // -> Promise <pending>
// setTimeout(console.log, 0, p5 === p6);    // -> false


// let p7 = Promise.resolve("foo");
// let p8 = p7.then();
// setTimeout(console.log, 0, p8); // -> Promise { "foo" }
// // // 等价于一下三种写法
// // let p8 = p7.then(() => undefined);
// // let p8 = p7.then(() => {});
// // let p8 = p7.then(() => Promise.resolve());


let p9 =  Promise.resolve('foo');
// let p10 = p9.then(() => 'bar');
// let p11 = p9.then(() => Promise.resolve('bar'));
// setTimeout(console.log, 0, p10); // -> Promise <resolved>: bar
// setTimeout(console.log, 0, p11); // -> Promise <resolved>: bar
// // // Promise.resolve()保留返回的期约
// // let p8 = p1.then(() => new Promise(() => {}));
// // let p9 = p1.then(() => Promise.reject());
// // // Uncaught (in promise): undefined
// // setTimeout(console.log, 0, p8); // Promise <pending>
// // setTimeout(console.log, 0, p9); // Promise <rejected>: undefined


// let p12 = p9.then(() => { throw 'baz'; });
// // Uncaught (in promise) baz
// setTimeout(console.log, 0, p12);
// /* 输出
// [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with
//  .catch(). The promise rejected with the reason "baz".] {
//   code: 'ERR_UNHANDLED_REJECTION'
// }
// */


// let p13 = p9.then(() => Error('qux'));
// setTimeout(console.log, 0, p13); // Promise <resolved>: Error: qux


let p14 = Promise.reject('foo')
let p15 = p14.then(null, () => Error('qux'));
setTimeout(console.log, 0, p15); // Promise <resolved>: Error: qux

