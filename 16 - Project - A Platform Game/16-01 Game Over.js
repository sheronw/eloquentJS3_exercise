/* 16.1 Game Over
    author: SheronW
    date: 7/27/2019 */

async function runGame(plans, Display) {
  let lives = 3;
  for (let level = 0; level < plans.length;) {
    console.log(`Current number of lives: ${lives}`);
    let status = await runLevel(new Level(plans[level]),
                                Display);
    if (status == "won") level++;
    else lives--;

    if(lives==0){
      console.log("Game Over");
      level = 0;
      lives = 0;
    }
  }
  console.log("You've won!");
}
runGame(GAME_LEVELS, DOMDisplay);
