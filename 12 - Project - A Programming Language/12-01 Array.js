/* 12.1 Array
    author: SheronW
    date: 7/14/2019 */

    // According to author's solution, there's no need to write complicated code
    // for example, instead of wraping it into a new array, you could just return the input array

    topScope.array = (...array) => {
      let arrayList=[];
      for(let i of array){
        arrayList.push(i);
      }
      return {type: "array", items: arrayList };
    };

    topScope.length = array => {
      if(array.type!="array") throw new TypeError("Invalid Array Type");
      return array.items.length;
    };

    topScope.element = (array, n) => {
      if(array.type!="array") throw new TypeError("Invalid Array Type");
      if(n<0 || n>= array.items.length) throw new SyntaxError("Invalid Index");
      return array.items[n];
    };
