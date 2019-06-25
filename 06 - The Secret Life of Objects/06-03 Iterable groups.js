/* 6.3 Iterable groups
    author: SheronW
    date: 6/25/2019 */

// from previous exercise
class Group {
constructor(){
  this.list = [];
}

add(e){
  if(!this.has(e)){
    this.list.push(e);
  }
}

delete(e){
  // remove an element from an array: filter function
  this.list = this.list.filter(v => v!== e);
}

has(e) {
  return this.list.includes(e);
}

static from(ob){
  let temp = new Group();
  for(let x of ob){
    temp.add(x);
  }
  return temp;
}

[Symbol.iterator]() {
  return new GroupIterator(this);
}

}

// this exercise's code starts here
class GroupIterator{
constructor(group){
  this.group=group;
  this.current=-1;
}

next() {
  if(this.current==this.group.list.length-1) return {done: true};
  this.current++;
  return {value: this.group.list[this.current], done: false};
}

/*
Group.prototyple[Symbol.iterator]=function(){
return new GroupIterator(this);
*/

}
