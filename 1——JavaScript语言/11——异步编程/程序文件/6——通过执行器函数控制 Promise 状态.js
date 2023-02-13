// let p = new Promise(() => {});
// setTimeout(console.log, 0, p);  // -> Promise { <pending> }

// let p1 = new Promise((resolve, reject) => resolve());
// setTimeout(console.log, 0, p1); // -> Promise { undefined }
// let p2 = new Promise((resolve, reject) => reject());
// setTimeout(console.log, 0, p2); // -> Promise  <rejected>

// let p = new Promise((resolve, reject) => setTimeout(resolve, 1000));
// setTimeout(console.log, 0, p); // -> Promise <pending>


// let p = new Promise((resolve, reject) => {
// 	resolve();
// 	reject(); // 没有效果
// });
// setTimeout(console.log, 0, p); // Promise <resolved>
// function resolveExecutor() {
//     console.log("In resolveExecutor");
// }
// function rejectExecutor() {
//     console.log("In rejectExecutor");
// }
// let p = new Promise((resolveExecutor, rejectExecutor) => {
//     resolveExecutor();
//     rejectExecutor(); // 没有效果
// });
// setTimeout(console.log, 0, p); // -> Promise { undefined }


// let p1 = new Promise((resolve, reject) => resolve());
// 等价于：
// let p2 = Promise.resolve();


// resolve()
setTimeout(console.log, 0, Promise.resolve());                // Promise { undefined }
setTimeout(console.log, 0, Promise.resolve(3));         // Promise { 3 }
// 多余的参数会忽略
setTimeout(console.log, 0, Promise.resolve(4, 5, 6));         // Promise { 4 }
// reject()
let p = Promise.reject(3);
setTimeout(console.log, 0, p);                                // Promise { <rejected> 3 }

