/* 12.4 Fixing Scope
    author: SheronW
    date: 7/17/2019 */

specialForms.set = (args, scope) => {
  if(args.length!=2 || args[0].type!="word"){
    throw new SyntaxError("Incorrect Use of set");
  }
 let outerScope = Object.getPrototypeOf(scope);
 let value = evaluate(args[1], scope);
 while(outerScope!=null){
   if(Object.prototype.hasOwnProperty.call(outerScope, args[0].name)){
     outerScope[args[0].name] = value;
     return value;
   }
   outerScope = Object.getPrototypeOf(outerScope);
 }
    throw new ReferenceError("Binding Not Defined");
};

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
// → 50
run(`set(quux, true)`);
// → Some kind of ReferenceError
