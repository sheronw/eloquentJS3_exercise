/* 16.2 Pausing the Game
    author: SheronW
    date: 7/27/2019 */

function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = 1;
  let running = "yes";

  return new Promise(resolve => {
    function esc(event){
      if(event.key!="Escape") return;
      event.preventDefault();
      if(running == "yes"){
        running = "pausing";
      }
      else if(running == "no"){
        running = "yes";
        runAnimation(frame);
      }
      else{
        running = "yes";
      }
    }
    window.addEventListener("keydown", esc);
    let arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

    function frame(time) {
      if(running == "pausing"){
        running = "no";
        return false;
      }

      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        window.removeEventListener("keydown", esc);
        arrowKeys.unregister();
        resolve(state.status);
        return false;
      }
    }

  runAnimation(frame);
  });
}

function trackKeys(keys){
  let down = Object.create(null);
  function track(event){
    if(keys.includes(event.key)){
      down[event.key] = event.type=="keydown";
      event.preventDefault();
    }
  }
  down.unregister = () => {
    window.removeEventListener("keydown", track);
    window.removeEventListener("keyup", track);
  };
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

runGame(GAME_LEVELS, DOMDisplay);
