/* 7.1 Robot Efficiency
    author: SheronW
    date: 7/1/2019 */

/* thoughts: always find the nearest package to pick/address to deliver */

function findRoute(graph, from, to){// i.e. BFS
  let temp = [{at: from, route: []}]; // init a work queue
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

function findNearest(graph, place, parcels){// also uses BFS
  let temp = [place];
  let mark = [];
  while(temp.length != 0){
    let u = temp[0];
    temp = temp.slice(1);
    // if it is fine to pick
    if(u != place){
      for(let x of parcels){
        if(x.place == u)  return {p: x, do:"pick"};
      }
    }
    // if it is fine to deliver
    // firt of all, check if it is already be with robot
    let haveP = [];
    for(let x of parcels){
      if(x.place == place) haveP.push(x);
    }
    // then check if it has the same address as u
      for(let x of haveP){
        if(x.address == u) return {p: x, do: "deliver"};
      }
    mark.push(u);
    for(let a of graph[u]){
      if(!mark.includes(a)){
        temp.push(a);
      }
    }
  }
  
}

  function yourRobot(state, route){
    if(route.length == 0){
      let near = findNearest(roadGraph, state.place, state.parcels); // choose the parcel to be delivered
      if(near.do == "deliver") route = findRoute(roadGraph, state.place, near.p.address);
      else route = findRoute(roadGraph, state.place, near.p.place);
    }
    return {direction: route[0], memory: route.slice(1)}; // return the direction to the result of findRoute
  }
