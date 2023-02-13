function successCallback(x) {
    console.log(`Success: ${x}`);
}

function failureCallback(e) {
    console.log(`Failure: ${e}`);
}

function double(value, success, failure) {
    setTimeout(() => {
        try {
            if (typeof value !== 'number') {
                throw 'Must provide number as first argument';
            }
            success(2 * value);
        } catch (e) {
            failure(e);
        }
    }, 1000);
}

double(3, successCallback, failureCallback);    // -> Success: 6（大约 1000 毫秒之后）
double('b', successCallback, failureCallback);  // -> Failure: Must provide number as first argument（大约 1000 毫秒之后）
// 这种模式已经不可取了，因为必须在初始化异步操作时定义回调。异步函数的返回值只在短时间内存在，只有预备好将这个短时间内存在的值作为参数的回调才能接收到它。