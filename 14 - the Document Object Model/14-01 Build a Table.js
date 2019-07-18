/* 14.1 Build a Table
    author: SheronW
    date: 7/17/2019 */

function buildTable(array){
  let table = document.createElement("table");
  let head = document.createElement("tr");
  Object.keys(array[0]).forEach(h => {
    let hElement = document.createElement("th");
    hElement.appendChild(document.createTextNode(h));
    head.appendChild(hElement);
  });
  table.appendChild(head);

  array.forEach(e => {
    let row = document.createElement("tr");
    Object.keys(array[0]).forEach(h => {
      let element = document.createElement("td");
      element.appendChild(document.createTextNode(e[h]));
      if(typeof e[h] == "number"){
        element.style.textAlign = "right";
      }
      row.appendChild(element);
    })
    table.appendChild(row);
  });
  return table;
}



    const MOUNTAINS = [
      {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
      {name: "Everest", height: 8848, place: "Nepal"},
      {name: "Mount Fuji", height: 3776, place: "Japan"},
      {name: "Vaalserberg", height: 323, place: "Netherlands"},
      {name: "Denali", height: 6168, place: "United States"},
      {name: "Popocatepetl", height: 5465, place: "Mexico"},
      {name: "Mont Blanc", height: 4808, place: "Italy/France"}
    ];

document.querySelector("#mountains").appendChild(buildTable(MOUNTAINS));
