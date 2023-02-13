// let p = Promise.reject();
// let onRejected = function (e) {
//     setTimeout(console.log, 0, 'rejected');
// };
//
// // 这两种添加拒绝处理程序的方式是一样的：
// p.then(null, onRejected); // rejected
// p.catch(onRejected); // rejected


// let p1 = new Promise(() => {});
// let p2 = p1.catch();
// setTimeout(console.log, 0, p1); // Promise <pending>
// setTimeout(console.log, 0, p2); // Promise <pending>
// setTimeout(console.log, 0, p1 === p2); // false


function fetchData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}


// fetchData('https://jsonplaceholder.com/posts')
fetchData('https://jsonplaceholder.typicode.com/posts')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });