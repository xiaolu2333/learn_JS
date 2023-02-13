function requestPosts() {

    setTimeout(() => {
        // 定义请求的 URL
        const url = 'https://jsonplaceholder.typicode.com/posts';

        // 使用 fetch API 发起异步请求
        fetch(url)
            .then(response => response.json())          // 解析返回的 JSON 数据
            .then(data => console.log(data))            // 将获取的数据打印到控制台
            .catch(error => console.error(error));      // 处理错误

    }, 3000);
}

// 调用 requestPosts 函数
requestPosts();