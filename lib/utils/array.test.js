const { arrayToUnique } = require('./array');

test('works in array with a single element', () => {
  const arr = ["Banana"];
  expect(arrayToUnique(arr))
    .toStrictEqual(arr);
});

test('works in array with no elements', () => {
  const arr = [];
  expect(arrayToUnique(arr))
    .toStrictEqual(arr);
});

test('works in array with two duplicates', () => {
  const arr = ["Banana", "Banana"];
  expect(arrayToUnique(arr))
    .toStrictEqual(["Banana"]);
});

test('works in array with multiple items and duplicates', () => {
  const arr = ["Banana", "Apple", "Banana"];
  expect(arrayToUnique(arr))
    .toStrictEqual(["Banana", "Apple"]);
});