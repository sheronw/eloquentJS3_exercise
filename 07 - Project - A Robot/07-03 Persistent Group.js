/* 7.3 Persistent Groups
    author: SheronW
    date: 7/2/2019 */

class PGroup {
  constructor(members){
    this.members = members;
  }

  add(e){
    if(!this.has(e)) return new PGroup(this.members.concat(e));
    else return this;
  }

  delete(e){
    // remove an element from an array: filter function
    return new PGroup(this.members.filter(v => v!== e));
  }

  has(e) {
    return this.members.includes(e);
  }

}

 PGroup.empty = new PGroup([]);

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
