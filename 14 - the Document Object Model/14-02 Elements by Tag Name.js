/* 14.1 Elements by Tag Name
    author: SheronW
    date: 7/18/2019 */

function byTagName(node, tagName) {
  tagName = tagName.toUpperCase();
  let container = [];
  function find(node){
    if(node.nodeName == tagName){
      container.push(node);
    }
    for(let i = 0; i< node.childNodes.length; i++){
      find(node.childNodes[i]);
    }
  }
  find(node);
  return container;
}

console.log(byTagName(document.body, "h1").length);
// → 1
console.log(byTagName(document.body, "span").length);
// → 3
let para = document.querySelector("p");
console.log(byTagName(para, "span").length);
// → 2
