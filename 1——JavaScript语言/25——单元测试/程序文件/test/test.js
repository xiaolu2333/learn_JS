/* jshint esversion: 6 */

import sum from '../src/sum';

// Jest的test函数接受两个参数，第一个参数是字符串，表示测试的标题，第二个参数是一个函数，表示测试的内容。
test('1 + 2 = 3', () => {
  // Jest的expect函数接受一个值，配合toBe方法，判断这个值是否等于3。
  expect(sum(1, 2)).toBe(3);
});