/* 12.3 Comments
    author: SheronW
    date: 7/17/2019 */

// notice the method of string.match,
//  it uses a regular expression to find the whitespace or comment in the front, then strip it/them

// why don't use '\n'?
// Because `.` means any character except new lines.

function skipSpace(string) {
    let skip = string.match(/^(\s|#.*)*/);
    return string.slice(skip[0].length);
  }

  console.log(parse("# hello\nx"));
  // → {type: "word", name: "x"}

  console.log(parse("a # one\n   # two\n()"));
  // → {type: "apply",
  //    operator: {type: "word", name: "a"},
  //    args: []}
