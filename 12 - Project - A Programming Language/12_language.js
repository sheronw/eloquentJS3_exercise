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


/* The Environment */


/* Functions */
