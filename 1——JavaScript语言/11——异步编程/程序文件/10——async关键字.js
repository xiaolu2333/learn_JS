// // 用在函数声明
// async function foo() {
// }
// // 用在函数表达式
// let bar = async function () {
// };
// // 用在箭头函数
// let baz = async () => {
// };
// class Qux {
//     // 用在对象的方法
//     async qux() {
//     }
// }

// async function foo() {
//     console.log(1);
//     return 3;
//     // 直接返回一个期约对象也是可以的：
//     // return Promise.resolve(3);
// }
// // 给返回的期约添加一个解决处理程序
// foo().then(console.log);
// console.log(2);
// /*输出
// 1
// 2
// 3
// * */


// // 返回一个原始值
// async function foo() {
//     return 'foo';
// }
// foo().then(console.log); // -> foo
// // 返回一个没有实现 thenable 接口的对象
// async function bar() {
//     return ['bar'];
// }
// bar().then(console.log); // -> ['bar']
// // 返回一个实现了 thenable 接口的非期约对象
// async function baz() {
//     const thenable = {
//         then(callback) {
//             callback('baz');
//         }
//     };
//     return thenable;
// }
// baz().then(console.log); // -> baz
// // 返回一个期约
// async function qux() {
//     return Promise.resolve('qux');
// }
// qux().then(console.log); // -> qux


async function foo() {
    console.log(1);
    // 抛出一个错误
    throw 3;
    // 拒绝Promise的错误不会被异步函数捕获：
    // Promise.reject(3);
}
// 就要给返回的 Promise 添加一个拒绝处理程序来捕获错误并处理错去
foo().catch(console.log);
console.log(2);
// /*输出
// 1
// 2
// 3
// * */





