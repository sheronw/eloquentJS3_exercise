/* 11.2 Building Promise.all
    author: SheronW
    date: 7/14/2019 */


function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Your code here.
    let work = [];
    let remain = promises.length;
    for(let i=0;i<promises.length;i++){
      promises[i].then(r => {
        work[i]=r;
         remain--;
         if(remain==0) resolve(work);
       })
       .catch(e=>reject(e));
    }
    if(promises.length==0) resolve(work);

  });
}
