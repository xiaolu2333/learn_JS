function double(value) {
    console.log(`I was given: ${value}`)

    setTimeout(() => setTimeout(console.log, 0, value * 2), 1000);
}

double(3);  // -> 6（大约 1000 毫秒之后）