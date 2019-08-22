/* 19.3 Circles
    author: SheronW
    date: 8/21/2019 */

function circle(start, state, dispatch) {
  function drawCircle(pos){
    let drawn = [];
    let radius = Math.ceil(Math.sqrt(Math.pow(pos.x-start.x, 2)+Math.pow(pos.y-start.y, 2)));

    let startX = Math.max(0, start.x - radius);
    let startY = Math.max(0, start.y - radius);
    let endX = Math.min(state.picture.width, start.x + radius);
    let endY = Math.min(state.picture.height, start.y + radius);

    for(let y = startY; y <= endY; y++){
      for(let x = startX; x <= endX; x++){
        if(radius >= Math.sqrt(Math.pow(x-start.x, 2)+Math.pow(y-start.y, 2))){
          drawn.push({x, y, color: state.color});
        }
      }
    }

    dispatch({picture: state.picture.draw(drawn)});
  }
  drawCircle(start);
  return drawCircle;
}

let dom = startPixelEditor({
  tools: Object.assign({}, baseTools, {circle})
});
document.querySelector("div").appendChild(dom);
