// <!-- Whitespace
// Whitespace is an esoteric programming language that uses only three characters:

// [space] or " " (ASCII 32)
// [tab] or "\t" (ASCII 9)
// [line-feed] or "\n" (ASCII 10)
// All other characters may be used for comments. The interpreter ignores them.

// Whitespace is an imperative, stack-based programming language, including features such as subroutines.

// Each command in whitespace begins with an Instruction Modification Parameter (IMP).

// IMPs
// [space]: Stack Manipulation
// [tab][space]: Arithmetic
// [tab][tab]: Heap Access
// [tab][line-feed]: Input/Output
// [line-feed]: Flow Control
// There are two types of data a command may be passed: numbers and labels.

// Parsing Numbers
// Numbers begin with a [sign] symbol. The sign symbol is either [tab] -> negative, or [space] -> positive.

// Numbers end with a [terminal] symbol: [line-feed].

// Between the sign symbol and the terminal symbol are binary digits [space] -> binary-0, or [tab] -> binary-1.

// A number expression [sign][terminal] will be treated as zero.

// The expression of just [terminal] should throw an error. (The Haskell implementation is inconsistent about this.)

// Parsing Labels
// Labels begin with any number of [tab] and [space] characters.

// Labels end with a terminal symbol: [line-feed].

// Unlike with numbers, the expression of just [terminal] is valid.

// Labels must be unique.

// A label may be declared either before or after a command that refers to it.

// Input/Output
// As stated earlier, there commands may read data from input or write to output.

// Parsing Input
// Whitespace will accept input either characters or integers. Due to the lack of an input stream mechanism, the input will be passed as a string to the interpreter function.

// Reading a character involves simply taking a character from the input stream.

// Reading an integer involves parsing a decimal or hexadecimal number (prefixed by 0x) from the current position of the input stream, up to and terminated by a line-feed character. Octal numbers (prefixed by 0) and binary numbers (prefixed by 0b) may optionally be supported.

// The original implementation being in Haskell has stricter requirements for parsing an integer.

// The Javascript and Coffeescript implementations will accept any number that can be parsed by the parseInt function as a single parameter.

// The Python implementations will accept any number that can be parsed by the int function as a single parameter.

// The Java implementations will use an InputStream instance for input. For InputStream use readLine if the program requests a number and read if the program expects a character.

// An error should be thrown if the input ends before parsing is complete. (This is a non-issue for the Haskell implementation, as it expects user input)

// Writing Output
// For a number, append the output string with the number's string value.

// For a character, simply append the output string with the character.

// The Java implementations will support an optional OutputStream for output. If an OutputStream is provided, it should be flushed before and after code execution and filled as code is executed. The output string should be returned in any case.

// Commands
// Notation: n specifies the parameter, [number] or [label].

// Errors should be thrown for invalid numbers, labels, and heap addresses, or if there are not enough items on the stack to complete an operation (unless otherwise specified). In addition, an error should be thrown for unclean termination.

// IMP [space] - Stack Manipulation
// [space] (number): Push n onto the stack.
// [tab][space] (number): Duplicate the nth value from the top of the stack and push onto the stack.
// [tab][line-feed] (number): Discard the top n values below the top of the stack from the stack. (For n<**0** or **n**>=stack.length, remove everything but the top value.)
// [line-feed][space]: Duplicate the top value on the stack.
// [line-feed][tab]: Swap the top two value on the stack.
// [line-feed][line-feed]: Discard the top value on the stack.
// IMP [tab][space] - Arithmetic
// [space][space]: Pop a and b, then push b+a.
// [space][tab]: Pop a and b, then push b-a.
// [space][line-feed]: Pop a and b, then push b*a.
// [tab][space]: Pop a and b, then push b/a*. If a is zero, throw an error.
// *Note that the result is defined as the floor of the quotient.
// [tab][tab]: Pop a and b, then push b%a*. If a is zero, throw an error.
// *Note that the result is defined as the remainder after division and sign (+/-) of the divisor (a).
// IMP [tab][tab] - Heap Access
// [space]: Pop a and b, then store a at heap address b.
// [tab]: Pop a and then push the value at heap address a onto the stack.
// IMP [tab][line-feed] - Input/Output
// [space][space]: Pop a value off the stack and output it as a character.
// [space][tab]: Pop a value off the stack and output it as a number.
// [tab][space]: Read a character from input, a, Pop a value off the stack, b, then store the ASCII value of a at heap address b.
// [tab][tab]: Read a number from input, a, Pop a value off the stack, b, then store a at heap address b.
// IMP [line-feed] - Flow Control
// [space][space] (label): Mark a location in the program with label n.
// [space][tab] (label): Call a subroutine with the location specified by label n.
// [space][line-feed] (label): Jump unconditionally to the position specified by label n.
// [tab][space] (label): Pop a value off the stack and jump to the label specified by n if the value is zero.
// [tab][tab] (label): Pop a value off the stack and jump to the label specified by n if the value is less than zero.
// [tab][line-feed]: Exit a subroutine and return control to the location from which the subroutine was called.
// [line-feed][line-feed]: Exit the program.
// Notes
// Division and modulo
// Whitespace expects floored division and modulo

// In Javascript and Coffeescript, the modulus operator is implemented differently than it was in the original Whitespace interpreter. Whitespace was influenced by having been originally implemented in Haskell. Javascript and Coffeescript also lack integer division operations. You need to pay a little extra attention in regard to the implementation of integer division and the modulus operator (See: floored division in the Wikipedia article "Modulo operation"
// Java defines methods for floor division and modulo in Math class. The methods differ from the traditional / and % operators.
// There is no difference between Whitespace and Python in regard to the standard implementation of integer division and modulo operations. -->


// to help with debugging
function unbleach (n) {
    if (n) return n.replace(/ /g, 's').replace(/\t/g, 't').replace(/\n/g, 'n');
  }
  // solution - testing failed ! this solution is not working
  function whitespace(code, input) {
    var output = '';
    var stack = [];
    var heap = {};
    var pc = 0;
    var labels = {};
  
    // Remove comments from the code
    code = code.replace(/[^\s]/g, '');
  
    // Find label positions
    var match;
    var labelRegex = /\n\t\n/g;
    while ((match = labelRegex.exec(code)) !== null) {
      labels[match.index] = true;
    }
  
    while (pc < code.length) {
      var command = code[pc];
      var modifier = code[pc + 1];
  
      pc += 2;
  
      if (command === ' ') {
        if (modifier === ' ') {
          var number = '';
          while (code[pc] !== '\n') {
            number += code[pc];
            pc++;
          }
          stack.push(parseInt(number, 2));
          pc++;
        } else if (modifier === '\t') {
          var value = stack.pop();
          stack.push(value, value);
        } else if (modifier === '\n') {
          stack.pop();
        }
      } else if (command === '\t') {
        if (modifier === ' ') {
          var b = stack.pop();
          var a = stack.pop();
          stack.push(a + b);
        } else if (modifier === '\t') {
          var b = stack.pop();
          var a = stack.pop();
          stack.push(a - b);
        } else if (modifier === '\n') {
          var b = stack.pop();
          var a = stack.pop();
          stack.push(a * b);
        }
      } else if (command === '\n') {
        if (modifier === ' ') {
          var value = stack[stack.length - 1];
          output += String.fromCharCode(value);
        } else if (modifier === '\t') {
          var value = stack.pop();
          output += value.toString();
        } else if (modifier === '\n') {
          break; // Exit the program
        }
      }
    }
  
    if (pc < code.length) {
      throw new Error('Unclean termination');
    }
  
    return output;
  }
  