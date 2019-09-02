/* 20.2 Directory Creation
    author: SheronW
    date: 9/1/2019 */

const {mkdir} = require("fs").promises;

methods.MKCOL = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  }
  catch (error) {
    if (error.code != "ENOENT") throw error;
    await mkdir(path);
    return {status: 204};
  }
  if(stats.isDirectory()) return {status: 204};
  else return {status: 400, body: "Not A Directory"};
}
