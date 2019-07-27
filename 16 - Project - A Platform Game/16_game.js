/* 12 A Programming Language
    author: SheronW
    date: 7/24/2019 */

// CSS & HTML files are not included in this repo
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
  constructor(level, actors, status){
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level){
    return new State(level, level.startActors, "playing");
  }

  get player(){
    return this.actors.find(a => a.type == "player");
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
Coin.prototype.size = new Vec(0.6,0.6);

const levelChars = {
  ".": "empty", "#": "wall", "@": Player, "o": Coin,
  "+": "lava", "=": Lava, "|": Lava, "v": Lava
};

// Drawing
// A helper function to create new node
function elt(name, attrs, ...children){
  let dom = document.createElement(name);
  for(let arr of Object.keys(attrs)){
    dom.setAttribute(attr, attrs[attr]);
  }
  for(let child of children){
    dom.appendChild(child);
  }
  return dom;
}

class DOMDisplay{
  constructor(parent, level){
    this.dom = elt("div", {class: "game"}, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }
  clear(){
    this.dom.remove();
  }
}

const scale = 20;
function drawGrid(level){
  return elt("table", {class: "background",
                                 style: `width: ${scale*level.width}px`},
                               ...level.rows.map(row => elt("tr", {style: `height: ${scale}px`},
                                                                             ...row.map(ele => elt("td", {class: ele})))
                                                          ));
}

function drawActors(actors){
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${scale*actor.size.x}px`;
    rect.style.height = `${scale*actor.size.y}px`;
    rect.style.left = `${scale*actor.pos.x}px`;
    rect.style.top = `${scale*actor.pos.y}px`;
    return rect;
  }));
}

DOMDisplay.prototype.syncState = function(state) {
  if(this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // compute the coor of the client
  let left = this.dom.scrollLeft;
  let right = left + width;
  let top = this.dom.scrollTop;
  let bottom = top + height;

  let center = state.player.pos.plus(state.player.size.times(0.5)).times(scale);

  if(center.x < left + margin){
    this.dom.scrollLeft = center.x - margin;
  }
  else if(center.x > right - margin){
    this.dom.scrollLeft = center.x + margin - width;
  }
  if(center.y < top + margin){
    this.dom.scrollTop = center.y - margin;
  }
  else if(center.y > bottom - margin){
    this.dom.scrollTop = center.y + margin - height;
  }
};

// Motion and Collision
Level.prototype.touches = function(pos, size, type){
  let startX = Math.floor(pos.x);
  let endX = Math.ceil(pos.x + size.x);
  let startY = Math.floor(pos.y);
  let endY = Math.ceil(pos.y + size.y);

  for(let y=startY; y<endY; y++){
    for(let x=startX; x<endX; x++){
      let out = x<0 || y<0 || x>=this.width || y>=this.height;
      let loc = out ? "wall" : this.row[y][x];
      if(loc == type) return true;
    }
  }
  return false;
};

State.prototype.update = function(time, keys){
  let actors = this.actors.map(actor => actor.updata(time,this,keys));
  let newState = new State(this.level, actors, this.status);

  if(this.status != "playing") return newState;

  let newPlayer = newState.player;
  if(this.level.touches(newPlayer.pos, newPlayer.size, "lava")) return new State(this.level, actors, "lost");

  for(let actor of actors){
    if(actor != newPlayer && overlap(newPlayer, actor)){
      return actor.collide(newState);
    }
  }
  return newState;
};

function overlap(a1, a2){
  return a1.pos.x + al.size.x > a2.pos.x &&
            a1.pos.x < a2.pos.x + a2.size.x &&
            a1.pos.y + al.size.y > a2.pos.y &&
            a1.pos.y < a2.pos.y + a2.size.y;
}

Lava.prototype.collide = function(state){
  return new State(state.level, state.actors, "lost");
}

Coin.prototype.collide = function(state){
  let except = state.actors.filter(a => a!=this);
  let status = state.status;
  if(!except.some(a => a.type=="coin")) status = "won";
  return new State(state.level, except, status);
}

// Actor Updates
Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if(!state.level.touches(newPos, this.size, "wall")){
    return new Lava(newPos, this.speed, this.reset);
  }
  else if(this.reset){
    return new Lava(this.reset, this.speed, this.reset);
  }
  else{
    return new Lava(this.pos, this.speed.times(-1));
  }
};

const wobbleSpeed  = 8, wobbleDist = 0.07;
Coin.prototype.update = function(time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),this.basePos,wobble);
};

const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys){
  let xSpeed = 0;
  if(keys.ArrowLeft) xSpeed += playerXSpeed;
  if(keys.ArrowRight) xSpeed -= playerXSpeed;
  let pos = this.pos;
  let movedX = pos.plus(new Vec(time*xSpeed,0));
  if(!state.level.touches(movedX, this.size, "wall")){
    pos = movedX;
  }

  let ySpeed = this.speed.y + time*gravity;
  let movedY = pos.plus(new Vec(0,time*ySpeed));
  if(!state.level.touches(movedY, this.size, "wall")){
    pos = movedY;
  }
  else if(keys.ArrowUp && ySpeed>0){
    ySpeed = -jumpSpeed;
  }
  else{
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};

// Tracking Keys
function trackKeys(keys){
  let down = Object.create(null);
  function track(event){
    if(keys.includes(event.key)){
      down[event.key] = event.type=="keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const arrowKeys = trackKeys(["ArrowLeft","ArrowRight","ArrowUp"]);

// Running the Game
function runAnimation(frameFunc){
  let lastTime = null;
  function frame(time){
    if(lastTime != null){
      let timeStep = Math.min(100,time-lastTime)/1000;
      if(frameFunc(timeStep)===false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display){
  let display = new Display(document.body,level);
  let state = State.start(level);
  let ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if(state.status=="playing") return true;
      else if(ending>0){
         ending -= time;
         return true;
      }
      else{
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}

async function runGame(plans, Display) {
  for(let level = 0; level<plans.length){
    let status = await runLevel(new Level(plans[level]), Display);
    if(status == "won") level++;
  }
  console.log("You've won!");
}
