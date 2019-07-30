/* 17.1 Shapes
    author: SheronW
    date: 7/29/2019 */

function trapezoid(x, y, top, bottom, height){
  cx.beginPath();
  cx.moveTo(x, y);
  cx.lineTo(x+top, y);
  cx.lineTo(x-(bottom-top)/2+bottom, y+height);
  cx.lineTo(x-(bottom-top)/2, y+height);
  cx.lineTo(x,y);
  cx.stroke();
}

function diamond(x, y, l){
  let sqrt = Math.sqrt(l*l/2);
  cx.beginPath();
	cx.moveTo(x, y);
	cx.lineTo(x+sqrt, y+sqrt);
  cx.lineTo(x, y+2*sqrt);
  cx.lineTo(x-sqrt,y+sqrt);
  cx.fillStyle = "red";
  cx.fill();
}

function zigzagging(x, y, l, n){
  cx.beginPath();
  cx.moveTo(x,y);
	for (let i = 10; i <= n*20; i += 20) {
  	cx.lineTo(x+l, y+i);
  	cx.lineTo(x, y+i+10);
	}
	cx.stroke();
}

// bad at math QvQ
function spiral(x, y, r) {
  cx.beginPath();
  cx.moveTo(x, y);
  for(let i=0; i<300; i++){
    let dist = r*i/300;
    let angle = Math.PI*i/30;
    cx.lineTo(x+dist*Math.cos(angle), y+dist*Math.sin(angle));
  }
  cx.stroke();
}

function star(x, y, r, n) {
  cx.beginPath();
  let angle = 2*Math.PI/n;
  for(let i=0;i<=n;i++){
    cx.quadraticCurveTo(x, y, x+r*Math.cos(angle*i), y+r*Math.sin(angle*i));
  }
  cx.fillStyle = "gold";
  cx.fill();
}

let cx = document.querySelector("canvas").getContext("2d");
trapezoid(50, 50, 70, 140, 100);
diamond(200, 50, 50);
zigzagging(250, 30, 100, 6);
spiral(420, 100, 50);
star(530, 100, 50, 8);
