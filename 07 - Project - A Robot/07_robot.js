/* 7 A Robot
    author: SheronW
    date: 07/01/2019 */

    /* The animation version, made by the book's auther:
        http://eloquentjavascript.net/code/animatevillage.js */

/* MEADOWFIELD */
const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

function buildGraph(edges){
  let graph = Object.create(null);
  function addEdge(from, to){
    if(graph[from]==null){
      graph[from]=[to];
    }
    else{
      graph[from].push(to);
    }
  }
  for(let [from, to] of roads.map(x => x.split('-'))){
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

/* THE TASK */
class VillageState {
  constructor(place, parcels){
    this.place = place;
    this.parcels = parcels;
  }

  move(dest){
    if(!roadGraph[this.place].includes(dest)){
      // If no road to dest, then return the original VillageState
      return this;
    }
    let updatedParcel=this.parcels.map(p => {
      if(p.place != this.place) return p; // leave alone unpicked parcels
      return {place: dest, address: p.address} // move all parcels here to dest
    }).filter(p => p.place != p.address); // remove all delivered parcels
    return new VillageState(dest, updatedParcel);
   }
}

/* SIMULATION */
function runRobot(state, robot, memory){
  for(let turn=0;;turn++){
    if(state.parcels.length==0){
      console.log(`Done in ${turn} turns`);
      break;
    }
    else{
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
  }
}

function randomPick(array){
  // generate the random index of an array
  let index = Math.floor(Math.random() * array.length);
  return array[index];
}

function randomRobot(state){
  return {direction: randomPick(roadGraph[state.place])};
}

VillageState.random = function(count = 5){
  let parcels = [];
  for(let i=0;i<count;i++){
    // assign a random address for this parcel
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do{// if address and location are the same then choose a new location
      place = randomPick(Object.keys(roadGraph));
    }while (place == address)
    parcels.push({place, address});
  }
  return new VillageState("Post Office", parcels);
}

/* THE MAIL TRUCK'S ROUTE */
var mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];

function routeRobot(state, memory){
  if(memory.length==0){
    memory = mailRoute;
  }
  return {direction: memory[0], memory: memory.slice(1)};
}

/* PATHFINDING */

function findRoute(graph, from, to){// i.e. BFS
  let temp = [{at: from, route:[]}]; // init a work queue
  for(let i=0;i<temp.length;i++){// temp could be updated each time, interesting
    let {at, route} = temp[i]; // in fact, dequeue(ignore the elements in the front one by one)
    for(let p of graph[at]){
      if(p == to) return route.concat(p);
      if(!temp.some(a => a.at == p)){// mark as visited
        temp.push({at: p, route: route.concat(p)});
      }
    }
  }
}

function goalOrientedRobot(state, route){
  let {place, parcels} = state;
  if(route.length == 0){
    let parcel = parcels[0]; // choose the parcel to be delivered
    if(parcel.place == place){
      route = findRoute(roadGraph, place, parcel.address);
    }
    else{
      route = findRoute(roadGraph, place, parcel.place);
    }
  }
  return {direction: route[0], memory: route.slice(1)}; // return the direction to the result of findRoute
}
