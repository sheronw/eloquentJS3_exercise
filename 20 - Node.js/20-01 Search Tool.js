/* 20.1 Search Tool
    author: SheronW
    date: 9/1/2019 */

const {sep} = require("path");
const {stat, readdir, readFile} = require("fs").promises;

let expression = new RegExp(process.argv[2]);
let files = process.slice(3);

let stats;
for(let i=0; i<files.length; i++){
  stats = await stat(files[i]);
  if(stats.isDirectory()){
    // if is a directory, then add all contents into files
    let content = await readdir(files[i]);
    for(let subfile of content){
      files.push(files[i]+sep+subfile);
    }
  }
  else {
    // print the filename
    readFile(files[i], "utf8").then(text => {
      if(expression.test(text)) console.log(files[i]);
    })
  }
}
