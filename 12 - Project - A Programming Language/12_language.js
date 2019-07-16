/* 12 A Programming Language
    author: SheronW
    date: 7/16/2019 */

/* Parsing */
function parse(program){
  // wrap everything
  let {expr, rest} = parseExpression(program);
  if(rest.length>0){
    throw new SyntaxError("Unexpected Text After Program");
  }
  return expr;
}

function parseExpression(program){
  program = skipSpace(program);
  let expr, match;
  if(match = /^"([^"]*)"/.exec(program)){
    expr = {type: "value", value: match[1]};
  }
  else if(match=/^\d+\b/.exec(program)){
    expr = {type: "value", value: Number(match[0])};
  }
  else if(match=/^[^\s(),#]+/.exec(program)){
    expr = {type: "word", name: match[0] };
  }
  else{
    throw new SyntaxError("Unexpected Syntax: "+ program);
  }
  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string){
  let first = string.search(/\S/); // find 1st nonwhite
  if(first==-1) return "";
  return string.slice(first);
}

function parseApply(expr, program){
  program = skipSpace(program);
  if(program[0]!="("){
    return {expr: expr, rest: program};
  }
  // delete "("
  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args:[]};
  while(program[0] != ")"){
    let arg = parseExpression(program);
    expr.args.push(arg.expr);
    if(arg.rest[0]==","){
      program = skipSpace(program.slice(1));
    }
    else if(arg.rest[0]!=")"){
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  // an application expression can itself be applied,
  // so we need to check whether another pair of parentheses follows
  return parseApply(expr, program.slice(1));
}


/* The Evaluator */
const specialForms = Object.create(null);

function evaluate(expr, scope){
  if(expr.type == "value") return expr.value;
  if(expr.type == "word"){
    if(expr.name in scope) return scope[expr.name];
    throw new ReferenceError(`Undefined binding: ${expr.name}`);
  }
  if(expr.type == "apply"){
    let {operator, args} = expr;
    if(operator.type == "word" && operator.name in specialForms){
      // predefined
      return specialForms[operator.name](args, scope);
    }
    else{
      // function
      let op = evaluate(operator, scope);
      if(typeof op == "Function") return op(...args.map(arg => evaluate(arg, scope)));
      else throw new TypeError("Applying a Non-function");
    }
  }
}


/* Special Forms */
specialForms.if = (args, scope) => {
  if(args.length!=3) throw new SyntaxError("Wrong Number of Arguments to if");
  else if(evaluate(args[0], scope) !== false) return evaluate(args[1], scope);
  else return evaluate(args[2], scope);
};

specialForms.while = (args, scope) =>{
  if(args.length!=2) throw new SyntaxError("Wrong Number of Arguments to while");
  while(evaluate(args[0],scope) !== false){
    evaluate(args[1], scope);
  }
  return false;
};

specialForms.do = (args, scope) => {
  let value = false;
  for(let arg of args){
    value = evaluate(arg, scope);
  }
  return value;
};

specialForms.define = (args, scope) => {
  if(args.length!=2 || args[0].type!="word"){
    throw new SyntaxError("Incorrect Use of define");
  }
  let value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
};


/* The Environment */
const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;

for(let op of ["+", "-", "*", "/", "==", "<", ">"]){
  topScope[op] =  Function("a, b", `return a ${op} b;`);
}

topScope.print = value =>{
  console.log(value);
  return value;
};

function run(program){
  return evaluate(parse(program), Object.create(topScope));
}

/* Functions */
specialForms.fun = (args, scope) => {
  if(!args.length) throw new SyntaxError("Function Need a Body");
  let body  = args[args.length-1];

  let params = args.slice(0, args.length-1).map(param => {
    if(param.type!="word") throw new SyntaxError("Parameters' Names Must Be Words");
    return param.name;
  })

  return function(){
    // You can refer to a function's arguments within the function by using the arguments object.
    if(arguments.length!=params.length) throw new SyntaxError("Wrong Number of Arguments");
    let localScope = Object.create(scope);
    for(let i = 0; i<arguments.length;i++){
      localScope[params[i]] = arguments[i];
    }
    return evaluate(body, localScope);
  };
};
