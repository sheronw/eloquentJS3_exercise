/* 6.4 Borrowing a method
    author: SheronW
    date: 6/25/2019 */

let map = {one: true, two: true, hasOwnProperty: true};

console.log(Object.prototype.hasOwnProperty.call(map, "one"));

// use a method from the prototype to call map(IMPORTANT)
