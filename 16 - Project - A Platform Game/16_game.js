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

class Vec {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  plus(other){
    return new Vec(this.x+other.x, this.y+other.y);
  }
  times(factor){
    return new Vec(this.x*factor. this.y*factor);
  }
}

class Player{
  constructor(pos, speed){
    this.pos = pos;
    this.speed = speed;
  }

  static create(pos){
    return new Player(pos.plus(new Vec(0,-0.5)), new Vec(0,0));
  }

  get type(){
    return "player";
  }
}
Player.prototype.size = new Vec(0.8,1.5);

class Lava{
  constructor(pos, speed, reset){
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type(){
    return "lava";
  }

  static create(pos, ch){
    if(ch=="=") return new Lava(pos, new Vec(2,0));
    else if(ch=="|") return new Lava(pos, new Vec(0,2));
    else if(ch=="v") return new Lava(pos, new Vec(0.3), pos);
  }
}
Lava.prototype.size = new Vec(1,1);

class Coin{
  constructor(pos, basePos, wobble){
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type(){
    return "coin";
  }

  static create(pos){
    let basePos = pos.plus(new Vec(0.2,0.1)); // !why 0.1 here?
    return new Coin(basePos, basePos, Math.random()*Math.PI*2);
  }
}
Lava.prototype.size = new Vec(0.6,0.6);

const levelChars = {
  ".": "empty", "#": "wall", "@": Player, "o": Coin,
  "+": "lava", "=": Lava, "|": Lava, "v": Lava
};

// Drawing

// Motion and Collision

// Actor Updates

// Tracking Keys

// Running the Game
