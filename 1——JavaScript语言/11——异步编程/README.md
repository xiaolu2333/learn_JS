ECMAScript 6 及之后的几个版本逐步加大了对异步编程机制的支持:

- ECMAScript 6 新增了正式的 Promise（期约）引用类型，支持优雅地定义和组织异步逻辑。
- 接下来几个版本增加了使用 async 和 await 关键字定义异步函数的机制。

# 一，异步编程

同步行为和异步行为的对立统一是计算机科学的一个基本概念。特别是在 JavaScript 这种单线程事 件循环模型中，同步操作与异步操作更是代码所要依赖的核心机制。

## （一）同步与异步

同步行为对应内存中顺序执行的处理器指令，这样的执行流程容易分析程序在执行到代码任意位置时的状态（比如变量的值）。

> [1——同步程序.js](1——JavaScript语言/11——异步编程/程序文件/1——同步程序.js)

异步行为类似于系统中断，即当前进程外部的实体可以触发代码执行。

- 异步操作经常是必要的，因为强制进程等待一个长时间的操作通常是不可行的（同步操作则必须要等）。
  如果代码要访问 一些高延迟的资源，那么就会出现长时间的等待。
- 比如向远程服务器发送请求并等待响应。

> [2——异步程序.js](1——JavaScript语言/11——异步编程/程序文件/2——异步程序.js)

🌰：在定时回调中执行一次简单的数学计算：

```JavaScript
let x = 3; 
setTimeout(() => x = x + 4, 1000);
```

但这一次执行线程不知道 x 值何时会改变，因为这取决于回调何时从消息队列出列并执行。

- 回调操作是由系统计时器触发的，这会生成一个入队执行的中断。到底什么时候会触发这个中断，这对 JavaScript 运行时来说是一个黑盒。

设计一个能够知道 x 什么时候可以读取的系统是非常难的。JavaScript 在实现这样一个系统的过程 中也经历了几次迭代。

## （二）以往的异步编程模式

异步行为是 JavaScript 的基础，但以前的实现不理想。

在早期的 JavaScript 中，只支持定义回调函数来表明异步操作完成。

- 串联多个异步操作是一个常见的需求，结果就是深度嵌套多层回调函数，但会造成**回调地狱**问题。

🌰：一个异步函数：使用 `setTimeout` 在一秒钟之后执行某些操作

```JavaScript
function double(value) { 
	setTimeout(
		() => setTimeout(console.log, 0, value * 2) ,
		1000
	); 
} 

double(3); // 6（大约 1000 毫秒之后）
```

**这里的代码没什么神秘的，但关键是理解为什么说它是一个异步函数！**
1，首先是`setTimeout` 可以接收一个在指定时间之后会被调度执行的回调函数。
2，然后 JavaScript 运行时会把回调函数推到自己的消息队列上去等待执行。推到队列之后，回调什么时候出列被执行对 JavaScript 代码就完全不可见了。
3，double() 函数在 `setTimeout` 成功调度异步操作之后会立即退出。

### 1，异步返回值

假设 setTimeout 操作会返回一个有用的值，有什么好办法把这个值传给需要它的地方？

广泛接受的一个策略是给异步操作提供一个回调，这个回调中包含要使用异步返回值的代码（作为回调的参数）。

> [3——以往的异步编程模式：返回异步值](1——JavaScript语言/11——异步编程/程序文件/3——以往的异步编程模式：返回异步值.js)



### 2，失败处理

异步操作的失败处理在回调模型中也要考虑，因此自然就出现了成功回调和失败回调。

> [4——以往的异步编程模式：失败处理.](1——JavaScript语言/11——异步编程/程序文件/4——以往的异步编程模式：失败处理.js)



### 3，嵌套异步回调

如果异步返值又依赖另一个异步返回值，那么回调的情况还会进一步变复杂。在实际的代码中，这就要求嵌套回调。

> [5——以往的异步编程模式：嵌套异步回调](1——JavaScript语言/11——异步编程/程序文件/5——以往的异步编程模式：嵌套异步回调.js)


# 二，Promise

一个 `Promise` 对象代表一个在这个 promise 被创建出来时不一定已知值的状态代理。
它让你能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。
这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 _promise_，以便在未来某个时候把值交给使用者。

## （一）Promise 简史

## （二）Promise 基础

ECMAScript 6 新增的引用类型 `Promise`，可以通过 `new` 操作符来实例化：

```JavaScript
let p = new Promise(() => {}); 

setTimeout(console.log, 0, p); // Promise
```

- 创建新期约时需要传入执行器（executor）函数作为参数。这里使用了一个空函数对象。
  setTimeout 接受了三个参数，这里会立即打印 Promise 实例。

1. function，在到期时间 (`delay`毫秒) 之后执行的[函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)。
2. delay，延迟的毫秒数 (一秒等于 1000 毫秒)。实际的延迟时间可能会比期待的 (delay 毫秒数) 值长，原因请查看[实际延时比设定值更久的原因：最小延迟时间](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout#%E5%AE%9E%E9%99%85%E5%BB%B6%E6%97%B6%E6%AF%94%E8%AE%BE%E5%AE%9A%E5%80%BC%E6%9B%B4%E4%B9%85%E7%9A%84%E5%8E%9F%E5%9B%A0%EF%BC%9A%E6%9C%80%E5%B0%8F%E5%BB%B6%E8%BF%9F%E6%97%B6%E9%97%B4)。
3. arg1, ..., argN，一旦定时器到期，它们会作为参数传递给 function。

### 1，状态机

期约是一个有状态的对象，可能处于如下 3 种状态之一：

1. 待定（pending）：尚未开始或者正在执行中
2. 解决（resolved）：已经成功完成，就会有一个私有的内部**解决值（value）**
3. 拒绝（rejected）：没有成功完成，就会有一个私有的内部**拒绝理由（reason）**

待定是 Promise 的最初始状态。在待定状态下，Promise 可以落定（settled）为代表成功的解决状态，或者代表失败的拒绝状态。
无论落定为哪种状态都是不可逆的。只要从待定转换为兑现或拒绝，期约的状态就不再改变。

重要的是，Promise 的状态是私有的，不能直接通过 JavaScript 检测到。这主要是为了避免根据读取到的 Promise 状态以同步方式处理期约对象。
另外，Promise 的状态也不能被外部 JavaScript 代码修改。这与不能读取该状态的原因是一样的：**Promise 故意将异步行为封装起来，从而隔离外部的同步代码。**

value 和 reason 都是包含原始值或对象的不可修改的引用。二者都是可选的，而且默认值为 `undefined`。

### 2，通过执行器函数控制 Promise 状态

控制 Promise 状态的转换是通过调用它的两个函数参数实现的：

- `resolve()` 会把状态切换为解决。
- `reject()` 会把状态切换为拒绝。

```JavaScript
let p1 = new Promise((resolve, reject) => resolve()); setTimeout(console.log, 0, p1); // Promise <resolved>

let p2 = new Promise((resolve, reject) => reject()); setTimeout(console.log, 0, p2); // Promise  <rejected>
```

- 这里为在初始化期约时，就用执行器函数已经改变了每个  Promise 的状态。
- 这里的执行器函数是同步执行的，这是因为执行器函数是 Promise 的初始化程序的一部分。

通常会使用 `setTimeout` 通过延迟调用的方式来推迟状态的切换动作：

```JavaScript
// 使用 `setTimeout` 
let p = new Promise((resolve, reject) => setTimeout(resolve, 1000));

// 在 console.log 打印期约实例的时候，还不会执行超时回调（即 resolve()） 
setTimeout(console.log, 0, p); // Promise <pending>
```

如果在调用一个执行器函数后继续修改状态会静默失败：

```JavaScript
let p = new Promise((resolve, reject) => { 
	resolve(); 
	reject(); // 没有效果 
}); 

setTimeout(console.log, 0, p); // Promise <resolved> 
```

### 3，Promise.resolve()

Promise 并非一开始就必须处于待定状态，然后通过执行器函数才能转换为落定状态。通过调用 `Promise.resolve()` 静态方法，可以实例化一个解决的期约：

```JavaScript
let p1 = new Promise((resolve, reject) => resolve()); 
等价于：
let p2 = Promise.resolve();
```

`Promise.resolve()` 会返回一个解决值，即它的第一个参数：

```JavaScript
setTimeout(console.log, 0, Promise.resolve()); // Promise : undefined 

setTimeout(console.log, 0, Promise.resolve(3)); // Promise : 3

// 多余的参数会忽略 
setTimeout(console.log, 0, Promise.resolve(4, 5, 6)); // Promise : 4
```

- 这个静态方法可以把任何值都转换为一个 Promise。

### 4，Promise.reject()

与 Promise.resolve()类似，`Promise.reject()` 会实例化一个拒绝的期约并抛出一个异步错误：

- 这个错误不能通过 `try/catch` 捕获，而只能通过拒绝处理程序捕获。

```JavaScript
let p1 = new Promise((resolve, reject) => reject()); 
等价于：
let p2 = Promise.reject();
```

`Promise.reject()` 会返回一个拒绝理由，即它的第一个参数：

```JavaScript
let p = Promise.reject(3); 
setTimeout(console.log, 0, p); // Promise : 3 
p.then(null, (e) => setTimeout(console.log, 0, e)); // 3
```


## （三）Promise 的实例方法

Promise 实例的方法是连接外部同步代码与内部异步代码之间的桥梁。这些方法可以：

1. 访问异步操作返回的数据，处理期约成功和失败的结果
2. 连续对 Promise 求值
3. 添加只有期约进入终止状态时才会执行的代码

### 1，Promise.prototype.then()

`Promise.prototype.then()`是为 Promise 实例添加处理程序的主要方法。这个方法接收最多两个可选的参数：

- onResolved 处理程序：在进入 Resolved 状态时执行。
- onRejected 处理程序：在进入 Rejected 状态时执行。

```JavaScript
function onResolved(id) {  
    setTimeout(console.log, 0, id, 'resolved');  
}  
  
function onRejected(id) {  
    setTimeout(console.log, 0, id, 'rejected');  
}  
  
let p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000));  
p1.then(  
    () => onResolved('p1'),  
    () => onRejected('p1')  
);    // p1 resolved  
  
let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000));  
p2.then(  
    () => onResolved('p2'),  
    () => onRejected('p2')  
);  // p2 rejected
```

如果想只提供 onRejected 参数，那就要在 onResolved 参数的位置上传入 `undefined`：

```JavaScript
function onResolved(id) {  
    setTimeout(console.log, 0, id, 'resolved');  
}  
  
function onRejected(id) {  
    setTimeout(console.log, 0, id, 'rejected');  
}  

let p3 = new Promise((resolve, reject) => setTimeout(resolve, 3000));  
// 非函数处理程序会被静默忽略，不推荐  
p3.then('gobbeltygook');  
let p4 = new Promise((resolve, reject) => setTimeout(reject, 3000));  
// 不传 onResolved 处理程序的规范写法  
p4.then(null, () => onRejected('p4'));
```

`Promise.prototype.then()` 方法返回一个新的 Promise 实例：

```JavaScript
let p5 = new Promise(() => {});  
let p6 = p5.then();             // p6 是一个新的 Promise 对象  
setTimeout(console.log, 0, p5); // -> Promise <pending>  
setTimeout(console.log, 0, p6); // -> Promise <pending>  
setTimeout(console.log, 0, p5 === p6);    // -> false
```

这里的新 Promise 实例 p6 基于 onResovled 处理程序的返回值构建，即该处理程序的返回值会通过 `Promise.resolve()` 包装器来生成新的 Promise。
如果没有提供这个处理程序，则 `Promise.resolve()` 的包装结果就是上一个 Promise resolved 之后的值。
若调用 `then()` 时不传 onResovled 处理程序，则原样向后传 Promise 实例：

```JavaScript
let p7 = Promise.resolve("foo");  
let p8 = p7.then();  
setTimeout(console.log, 0, p8); // -> Promise { "foo" }  
// // 等价于一下三种写法  
// let p8 = p7.then(() => undefined);  
// let p8 = p7.then(() => {});  
// let p8 = p7.then(() => Promise.resolve());
```

- 如果没有显式的返回语句，则 `Promise.resolve()` 会包装出默认的返回值 undefined。
  如果 onResovled 有显式的返回值，则 `Promise.resolve()` 会包装这个值：

```JavaScript
let p9 =  Promise.resolve('foo');  
let p10 = p9.then(() => 'bar');  
let p11 = p9.then(() => Promise.resolve('bar'));  
setTimeout(console.log, 0, p10); // -> Promise <resolved>: bar  
setTimeout(console.log, 0, p11); // -> Promise <resolved>: bar
```

如果 onResovled 抛出异常会返回 rejected Promise：

```JavaScript
let p9 =  Promise.resolve('foo'); 
let p12 = p9.then(() => { throw 'baz'; });  
// Uncaught (in promise) baz  
setTimeout(console.log, 0, p12);  
/* 输出  
[UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with  
 .catch(). The promise rejected with the reason "baz".] {  code: 'ERR_UNHANDLED_REJECTION'}  
*/
```

返回错误值不会触发上面的 reject 行为，而是同会把错误对象包装在一个 rejected Promise 中：

```JavaScript
let p13 = p9.then(() => Error('qux'));  
setTimeout(console.log, 0, p13); // Promise <resolved>: Error: qux
```

onRejected 处理程序返回的值也会被 `Promise.resolve()` 包装。因为 onRejected 处理程序的任务就是捕获异步错误，所以它在捕获错误后不抛出异常而是同样返回一个 rejected Promise：

```JavaScript
let p14 = Promise.reject('foo')  
let p15 = p14.then(null, () => Error('qux'));  
setTimeout(console.log, 0, p15); // Promise <resolved>: Error: qux
```

> [7——Promise.then方法](1——JavaScript语言/11——异步编程/程序文件/7——Promise.then方法.js)


### 2，Promise.prototype.catch()

`Promise.prototype.catch()` 方法用于给 Promise 添加拒绝处理程序。这个方法只接收一个参数：

- onRejected 处理程序。

```JavaScript
let p = Promise.reject();  
let onRejected = function (e) {  
    setTimeout(console.log, 0, 'rejected');  
};  
  
// 这两种添加拒绝处理程序的方式是一样的：  
p.then(null, onRejected); // rejected  
p.catch(onRejected); // rejected
```

`Promise.prototype.catch()` 同样返回一个新的 Promise 实例：

- 返回 Promise 实例的行为与 `Promise.prototype.then()` 的 onRejected 处理程序是一样的。

```JavaScript
let p1 = new Promise(() => {});  
let p2 = p1.catch();  
setTimeout(console.log, 0, p1); // Promise <pending>  
setTimeout(console.log, 0, p2); // Promise <pending>  
setTimeout(console.log, 0, p1 === p2); // false
```

> [8——Promise.catch()方法](1——JavaScript语言/11——异步编程/程序文件/8——Promise.catch()方法.js)


# 三，异步函数

## （一）

## （二）

## （三）

## （四）

# 四，

# 五，

# 六，

# 七，

# 八，

# 九，

# 十，

# 十一，

## （一）

## （二）

## （三）

## （四）

## （五）

## （六）

## （七）

## （八）

## （九）

## （十）

## （十一）

### 1，

### 2，

### 3，

### 4，

### 5，

### 6，

### 7，

### 8，

#### （1）

#### （2）

#### （3）

#### （4）

#### （5）

#### （6）

#### （7）

#### （8）
