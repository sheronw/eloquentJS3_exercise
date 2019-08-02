/* 17.3 a Bouncing Ball
    author: SheronW
    date: 7/30/2019 */

let cx = document.querySelector("canvas").getContext("2d");

let lastTime = null;
function frame(time) {
  if (lastTime != null) {
    updateAnimation(Math.min(100, time - lastTime) / 1000);
  }
  lastTime = time;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

let x = 0;
let y = 200;
let r = 10;
let speedX = 103;
let speedY = 76;
  function updateAnimation(step) {
    cx.clearRect(0,0,400,400);
    cx.strokeStyle = "blue";
    cx.strokeRect(0,0,400,400);
    x=x+speedX*step;
    y=y+speedY*step;
    if(x<10 || x>390) speedX = -speedX;
    if(y<10 || y>390) speedY = -speedY;
    cx.beginPath();
    cx.arc(x,y,r,0,7);
    cx.fillStyle = "red";
    cx.fill();
  }
