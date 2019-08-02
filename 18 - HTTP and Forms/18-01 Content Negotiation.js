/* 18.1 Content Negotiation
    author: SheronW
    date: 8/1/2019 */

fetch("https://eloquentjavascript.net/author", {headers: {Accept: "text/plain"}})
  .then(resp => resp.text())
  .then(console.log);

fetch("https://eloquentjavascript.net/author", {headers: {Accept: "text/html"}})
  .then(resp => resp.text())
  .then(console.log);

fetch("https://eloquentjavascript.net/author", {headers: {Accept: "application/json"}})
  .then(resp => resp.text())
  .then(console.log);

fetch("https://eloquentjavascript.net/author", {headers: {Accept: "application/rainbows+unicorns"}})
  .then(resp => {console.log(resp.status)}); // 406

// the author did in a much smarter way: by writing an async function and a for loop
