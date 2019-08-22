/* 19.3 Proper Lines
    author: SheronW
    date: 8/22/2019 */

    function draw(pos, state, dispatch) {
      function drawPixel({x, y}, state) {
        let drawn = drawLine(pos, {x, y}, state);
        pos = {x, y};
        dispatch({picture: state.picture.draw(drawn)});
      }
      drawPixel(pos, state);
      return drawPixel;
    }

    function line(start, state, dispatch) {
      return end => {
        let drawn = drawLine(start, end, state);
        dispatch({picture: state.picture.draw(drawn)});
      }
    }

    function drawLine(start, end, state){
      let drawn = [];
      if(Math.abs(start.x - end.x) > Math.abs(start.y - end.y)){ // horizontal
        if(start.x > end.x) [start, end] = [end, start]; // make sure to go from left to right
        let deltaY = (start.y - end.y) / (start.x - end.x);
        // loop coor x
        for(let {x, y} = start; x <= end.x; x++){
          drawn.push({x, y: Math.round(y), color: state.color});
          y += deltaY;
        }
      }
      else{ // vertical
        if(start.y > end.y) [start, end] = [end, start]; // make sure to go from up to bottom
        let deltaX = (start.x - end.x) / (start.y - end.y);
        // loop coor y
        for(let {x, y} = start; y <= end.y; y++){
          drawn.push({x: Math.round(x), y, color: state.color});
          x += deltaX;
        }
      }
      return drawn;
    }

    let dom = startPixelEditor({
      tools: {draw, line, fill, rectangle, pick}
    });
    document.querySelector("div").appendChild(dom);
