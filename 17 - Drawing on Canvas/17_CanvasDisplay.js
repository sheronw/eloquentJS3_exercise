/* 17 Drawing on Canvas
    author: SheronW
    date: 7/29/2019 */

// This file contains CanvasDisplay Object for the Project of ch.16
// CSS & HTML & Picture files are not included in this repo

class CanvasDisplay{
  constructor(parent, level){
    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.min(600, scale * level.width);
    this.canvas.height = Math.min(450, scale * level.height);
    parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext("2d");
    this.flipPlayer = false;
    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / scale,
      height: this.canvas.height / scale
    };
    }

  clear(){
    this.canvas.remove();
  }

  syncState(state){
    this.updateViewport(state);
    this.clearDisplay(state.status);
    this.drawBackground(state.level);
    this.drawActors(state.actors);
  }

  updateViewport(state){
    let view = this.viewport;
    let margin = view.width / 3;
    let center = state.player.pos.plus(state.player.size.times(0.5));

    if(center.x < view.left + margin){
      view.left = Math.max(center.x - margin, 0);
    }
    else if(center.x > view.left + view.width - margin){
      view.left = Math.min(center.x + margin - view.width, state.level.width - view.width);
    }
    if(center.y < view.top + margin){
      view.top = Math.max(center.y - margin, 0);
    }
    else if(center.y > view.top + view.height - margin){
      view.top = Math.min(center.y + margin - view.height, state.level.height - view.height);
    }
  }

  clearDisplay(status){
    if(status=="won"){
      this.cx.fillStyle="rgb(68,191,255)";
    }
    else if(status=="lost"){
      this.cx.fillStyle="rgb(44,136,214)";
    }
    else{
      this.cx.fillStyle="rgb(52,166,251)";
    }
    this.cx.fillRect(0,0,this.canvas.width,this.canvas.height);
  }

  drawBackground(level){
    let {left, top, width, height} = this.viewport;
    let startX = Math.floor(left);
    let endX = Math.ceil(left+width);
    let startY = Math.floor(top);
    let endY = Math.ceil(top+height);

    for(let y = startY; y<endY; y++){
      for(let x = startX; x<endX; x++){
        let ele = level.rows[y][x];
        if(ele=="empty") continue;
        let screenX = (x-left)*scale;
        let screenY = (y-top)*scale;
        let tile = ele=="lava" ? scale : 0;
        this.cx.drawImage(otherSprites, tile, 0, scale, scale, screenX, screenY, scale, scale);
      }
    }
  }

  drawPlayer(player, x, y, width, height){
    width += playerXoverlap*2;
    x -= playerXoverlap;
    if(player.speed.x!=0) this.flipPlayer = player.speed.x<0;

    let tile = 8;
    if(player.speed.y!=0) tile = 9;
    else if(player.speed.x!=0) tile = Math.floor(Date.now()/60)%8;

    this.cx.save();
    if(this.flipPlayer){
      flipHorizontally(this.cx, x+width/2);
    }
    this.cx.drawImage(playerSprites, tile*width, 0, width, height, x, y, width, height);
    this.cx.restore();
  }

  drawActors(actors){
    for(let actor of actors){
      let width = actor.size.x * scale;
      let height = actor.size.y * scale;
      let x = (actor.pos.x - this.viewport.left) * scale;
      let y = (actor.pos.y - this.viewport.top) * scale;

      if(actor.type == "player") drawPlayer(actor, x, y, width, height);
      else{
        let tileX = (actor.type=="coin"?2:1) * scale;
        this.cx.drawImage(otherSprites, tileX, 0, width, height, x, y, width, height);
      }
    }
  }

}

let otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";
let playerSprites = document.createElement("img");
playerSprites.src = "img/player.png";
const playerXoverlap = 4;

function flipHorizontally(context, around){
  context.translate(around, 0);
  context.scale(-1,1);
  context.translate(-around, 0);
}
