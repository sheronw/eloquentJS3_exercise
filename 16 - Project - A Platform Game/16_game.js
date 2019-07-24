/* 12 A Programming Language
    author: SheronW
    date: 7/24/2019 */

// You could find the level file here:
// http://eloquentjavascript.net/code/levels.js

// Reading a level
class Level{
  constructor(plan){
    let rows = plan.trim().split("\n").map(l => [...l]); // split into chars
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];
    this.rows = rows.map((row, y) =>{
      return row.map((ch, x)=>{
        let type = levelChars[ch];
        if(typeof type =="string") return type;
        this.startActors.push(type.create(new Vec(x,y), ch));
        return "empty";
      });
    })
  }
}

class State{
  constructor(level, actor, status){
    this.level = level;
    this.actor = actor;
    this.status = status;
  }

  static start(level){
    return new State(level, level.startActors, "playing");
  }

  get player(){
    return this.actor.find(a => a.type == "player");
  }

}

// Actors

// Drawing

// Motion and Collision

// Actor Updates

// Tracking Keys

// Running the Game
