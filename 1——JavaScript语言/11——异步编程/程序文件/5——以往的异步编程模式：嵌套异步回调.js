function outerFunction(callback1) {
    console.log("In outerFunction");

    function innerFunction(callback2) {
        console.log("In innerFunction");

        callback2();
    }

    callback1(innerFunction);
}

outerFunction(function (callback) {
    console.log("In anonymous function");

    callback(function () {
        console.log("In second anonymous function");
    });
});

/*
In outerFunction
In anonymous function
In innerFunction
In second anonymous function
*/