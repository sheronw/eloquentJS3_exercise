/* 14.1 the Cat's Hat
    author: SheronW
    date: 7/18/2019 */

let cat = document.querySelector("#cat");
let hat = document.querySelector("#hat");

let angle = 0;
let lastTime = null;
function animate(time) {
  if (lastTime != null) angle += (time - lastTime) * 0.001;
  lastTime = time;
  cat.style.top = (Math.sin(angle) * 40 + 40) + "px";
  cat.style.left = (Math.cos(angle) * 200 + 230) + "px";
  // To make the 2nd element opposite to the 1st element, we could add 180 degrees(PI)
  hat.style.top = (Math.sin(angle+Math.PI) * 40 + 40) + "px";
  hat.style.left = (Math.sin(angle+Math.PI)* 200 + 40) + "px";
// the position of both two element should be absolute

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
