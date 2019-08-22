/* 19.3 Proper Lines
    author: SheronW
    date: 8/22/2019 */

    function draw(pos, state, dispatch) {
      function drawPixel({x, y}, state) {
        let drawn = {x, y, color: state.color};
        dispatch({picture: state.picture.draw([drawn])});
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

      function tinyLine(p1, p2){
       if(p1.x == p2.x){ // horizontal
         if(p1.y > p2.y) [p1, p2] = [p2, p1]; // make sure p1 with smaller y
         for(let y = p1.y + 1; y < p2.y; y++){
           drawn.push({x: p1.x, y, color: state.color});
         }
       }

       else if(p1.y == p2.y){ // vertical
         if(p1.x > p2.x) [p1, p2] = [p2, p1]; // make sure p1 with smaller x
         for(let x = p1.x + 1; x < p2.x; x++){
           drawn.push({x, y:p1.y, color: state.color});
         }
       }

       else{ // cut into half
         let x = Math.min(p1.x, p2.x) + Math.ceil(Math.abs(p1.x-p2.x)/2);
         let y = Math.min(p1.y, p2.y) + Math.ceil(Math.abs(p1.y-p2.y)/2);
         tinyLine(p1, {x, y});
         tinyLine(p2, {x, y});
       }
      }

      tinyLine(start, end);
      return drawn;
    }

    let dom = startPixelEditor({
      tools: {draw, line, fill, rectangle, pick}
    });
    document.querySelector("div").appendChild(dom);
