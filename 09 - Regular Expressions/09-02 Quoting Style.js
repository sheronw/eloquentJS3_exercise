/* 9.2 Quoting Style
    author: SheronW
    date: 7/6/2019 */

// Groups that are not matched will be replaced by nothing.

    let text = "'I'm the cook,' he said, 'it's my job.'";
    // Change this call.
    console.log(text.replace(/(\W|^)'|(\W|$)/g, '$1"$2'));
    // → "I'm the cook," he said, "it's my job."
