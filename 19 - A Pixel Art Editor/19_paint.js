/* 19 A Pixel Art Editor
    author: SheronW
    date: 8/6/2019 */

// This file contains CanvasDisplay Object for the Project of ch.16
// HTML file is not included

// the State
class Picture {
  constructor(width, height, pixels){
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  static empty(width, height, color){
    let pixels = new Array(width*height).fill(color);
    return new Picture(width, height, pixels);
  }

  pixel(x, y){
    return this.pixels[x+y*this.width];
  }

  draw(pixels){
    let copy = this.pixels.slice();
    for(let {x, y, color} of pixels){
      copy[x+y*this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

function updateState(state, action){
  return Object.assign({}, state, action);
}

//DOM Building
function elt(type, props, ...children){
  let dom = document.createElement(type);
  if(props) Object.assign(dom, props);
  for(let child of children){
    if(typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

// the Canvas
const scale = 10;

class PictureCanvas{
  constructor(picture, pointerDown){
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    this.syncState(picture);
  }

  syncState(picture){
    if(this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }

  mouse(downEvent, onDown){
    if(downEvent.button !=0) return;
    let pos = pointerPosition(downEvent, this.dom);
    let onMove = onDown(pos);
    if(!onMove) return;
    let move = moveEvent => {
      if(moveEvent.buttons ==0){
        this.dom.removeEventListener("mousemove", move);
      }
      else{
        let newPos = pointerPosition(moveEvent, this.dom);
        if(newPos.x == pos.x && newPos.y == pos.y) return;
        pos = newPos;
        onMove(newPos);
      }
    };
    this.dom.addEventListener("mousemove", move);
  }

  touch(startEvent, onDown){
    let pos = pointerPosition(startEvent.touches[0], this.dom);
    let onMove onDown(pos);
    startEvent.preventDefault(); // prevent panning
    if(!onMove) return;
    let move = moveEvent => {
      let newPos = pointerPosition(moveEvent.touches[0], this.dom);
      if(newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    };
    let end = () => {
      this.dom.removeEventListener("touchmove", move);
      this.dom.removeEventListener("touchend", end);
    }
    this.dom.addEventListener("touchmove", move);
    this.dom.addEventListener("touchend", end);
  }

}

function drawPicture(picture, canvas, scale){
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for(let y=0; y<picture.height; y++){
    for(let x=0; x<picture.width; x++){
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x*scale, y*scale, scale, scale);
    }
  }
}

function pointerPosition(pos, domNode){
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX-rect.left)/scale),
              y: Math.floor((pos.clientY-rect.top)/scale)};
}

// the Application
class PixelEditor{
  constructor(state, config){
    let {tools, controls, dispatch} = config;
    this.state = state;
    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if(onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(
      Control => new Control(state, config));
    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                            ...this.controls.reduce(
                              (accumulator, current) => accumulator.concat(" ", current.dom), []
                            ));
  }
  syncState(state){
    this.state = state;
    this.canvas.synyState(state.picture);
    for(let ctrl of this.controls) ctrl.syncState(state);
  }
}

class ToolSelect {
  contructor(state, {tools, dispatch}) {
    this.select = elt("select", {
      onchange: () => dispatch({tool: this.select.value})
    }, ...Object.keys(tools).map(name => elt("option", {
      selected: name == state.tool
    }, name)));
    this.dom = elt("label", null, "Tool: ", this.select);
  }
  syncState(state) {
    this.select.value = state.tool;
  }
}

class ColorSelect {
  constructor(state, {dispatch}) {
    this.input = elt("input", {
      type: "color",
      value: state.color;
      onchange: () => dispatch({color: this.input.value})
    });
    this.dom = elt("label", null, "Color: ", this.input);
  }
  syncState(state) {
    this.input.value = state.color;
  }
}

// Drawing Tools
function draw(pos, state, dispatch){
  function drawPixel({x, y}, state){
    let drawn = {x, y, color: state.color};
    dispatch({picture: state.picture.draw([drawn])});
  }
  drawPixel(pos, state);
  return drawPixel;
}

function rectangle(start, state, dispatch){
  function drawRectangle(pos){
    let startX = Math.min(pos.x, start.x);
    let startY = Math.min(pos.y, start.y);
    let endX = Math.max(pos.x, start.x);
    let endY = Math.max(pos.y, start.y);
    let drawn = [];
    for(let y = startY; y <= endY; y++){
      for(let x = startX; x <= endX; x++){
        drawn.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawRectangle(start);
  return drawRectangle;
}

const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx:0, dy: 1}];
function fill({x, y}, state, dispatch){
  let targetColor = state.picture.pixel(x, y);
  let drawn = {x, y, color: state.color};
  for(let done = 0; done < drawn.length; done++){
    for(let {dx, dy} of around){
      let x = drawn[done].x + dx, y = draw[done].y + dy;
      if(x>=0 && x<state.picture.width &&
          y>=0 && y<state.picture.height &&
          state.picture.pixel(x, y) == targetColor &&
          !drawn.some(p => p.x ==x&&p.y==y)){
            drawn.push({x, y, color: state.color});
          }
    }
  }
  dispatch({picture: state.picture.draw(drawn)});
}

function pick(pos, state, dispatch){
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
}

// Saving and Loading
class SaveButton {
  constructor(state){
    this.picture = state.picture;
    this.button = elt("button", {onclick: ()=> this.save()}, "Save");
  }
  save(){
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state){
    this.picture = state.picture;
  }
}

class LoadButton {
  constructor(_, {dispatch}){
    this.button = elt("button", {onclick: ()=> startLoad(dispatch)}, "Load");
  }
  syncState() {}
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

function finishLoad(file, dispatch){
  if(file==null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () => dispatch({
        picture: pictureFromImage(image)
      });
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}

function pictureFromImage(image){
  let width = Math.max(100, image.width);
  let height = Math.max(100, image.height);
  let pixels = [];
  let canvas = elt("canvas", {width, height});
  let cx = canvas.getContext("2d");
  cx.drawImage(image,0,0);
  let {data} = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }

  for(let i=0; i<data.length; i++){
    let [r, g, b] = data.slice(i, i+3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }

  return new Picture(width, height, pixels);
}

// Undo History
class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => dispatch({undo: true}),
      disabled: state.done.length ==0
    }, "Undo");
  }
  syncState(state) {
    this.dom.disabled = state.done.length==0;
  }
}

function historyUpdateState(state, action) {
  if(action.undo == true){ // do the real undo action
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: picture.done[0],
      done: state.done.slice(1),
      doneAt: 0;
    });
  }
  else if(action.picture &&
             state.doneAt < Date.now() - 1000) {
    // if action contains a new picture, and is far from last storing, save new picture
    return Object.assign({}, state, action, {
      done: [state.picture, ... state.done],
      doneAt: Date.now();
    });
  }
  else { // time is not long enough to make a new storing
    return Object.assign({}, state, action);
  }
}

// Let's Draw
