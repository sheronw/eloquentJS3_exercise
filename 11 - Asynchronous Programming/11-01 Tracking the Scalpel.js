/* 11.1 Tracking the Scalpel
    author: SheronW
    date: 7/14/2019 */

async function locateScalpel(nest) {
  // Your code here.
  let from = nest.name;
  let to = await storage(nest,"scalpel");
  while(from!=to){
    from = to;
  	to = await anyStorage(nest,from,"scalpel");
  }
  return from;
}

function locateScalpel2(nest) {
  // Your code here.
  function next(from){
    return anyStorage(nest,from,"scalpel").then(value =>{
      if(value==from) return value;
      else return next(value);
    })
  }
  return next(nest.name);
}

locateScalpel(bigOak).then(console.log);
// → Butcher's Shop
locateScalpel2(bigOak).then(console.log);
// → Butcher's Shop
