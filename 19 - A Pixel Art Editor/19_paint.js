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

// the Canvas

// the Application

// Drawing Tools

// Saving and Loading

// Undo History

// Let's Draw
