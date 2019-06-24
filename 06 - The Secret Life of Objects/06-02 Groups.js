/* 6.2 Groups
    author: SheronW
    date: 6/24/2019 */

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

}


let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
