/* 7.1 Measuring a Robot
    author: SheronW
    date: 7/1/2019 */

function compareRobots(robot1, memory1, robot2, memory2) {
  function countStep(state, robot, memory){
    for(let turn=0;;turn++){
      if(state.parcels.length==0){
        return turn;
      }
      else{
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
    }
    }
  }
  let sum1=0;
  let sum2=0;
  for(let t=0;t<100;t++){
    // generate task in a loop
    let state = VillageState.random();
    sum1 += countStep(state, robot1, memory1);
    sum2 += countStep(state, robot2, memory2);
  }
  console.log(`Robot 1 average: ${sum1/100} steps per task`);
  console.log(`Robot 2 average: ${sum2/100} steps per task`);
}
