/**
 * ArithC represents the core language of arithmetic expressions.
 * It includes numeric literals, addition, and multiplication.
 */
type ArithC = NumC | PlusC | MultC;

/**
 * NumC represents a numeric literal in the core language.
 */
interface NumC {
  kind: 'numC';
  n: number;
}

/**
 * PlusC represents an addition operation in the core language.
 */
interface PlusC {
  kind: 'plusC';
  left: ArithC;
  right: ArithC;
}

/**
 * MultC represents a multiplication operation in the core language.
 */
interface MultC {
  kind: 'multC';
  left: ArithC;
  right: ArithC;
}


/**
 * ArithS represents the surface language of arithmetic expressions.
 * It includes numeric literals, unary minus, addition, binary minus, and multiplication.
 */
type ArithS = NumS | UminusS | PlusS | BminusS | MultS;

/**
 * NumS represents a numeric literal in the surface language.
 */
interface NumS {
  kind: 'numS';
  n: number;
}

/**
 * UminusS represents a unary minus operation in the surface language.
 */
interface UminusS {
  kind: 'uminusS';
  e: ArithS;
}

/**
 * PlusS represents an addition operation in the surface language.
 */
interface PlusS {
  kind: 'plusS';
  left: ArithS;
  right: ArithS;
}

/**
 * BminusS represents a binary minus operation in the surface language.
 */
interface BminusS {
  kind: 'bminusS';
  left: ArithS;
  right: ArithS;
}

/**
 * MultS represents a multiplication operation in the surface language.
 */
interface MultS {
  kind: 'multS';
  left: ArithS;
  right: ArithS;
}

/**
 * parse is a function that takes a string and returns an ArithC.
 * It parses the string into an abstract syntax tree (AST) of the core language.
 * @param s - The string to parse.
 * @return The parsed ArithC.
 */
// function parse(s: string): ArithC {
//   const tokens = s.match(/\(|\)|\+|\*|\-|\d+/g) || [];
//   let current = 0;

//   function peek() {
//     return tokens[current];
//   }

//   function consume(token: string) {
//     if (peek() === token) {
//       current++;
//     } else {
//       throw new Error(`Expected ${token}, got ${peek()}`);
//     }
//   }

//   function parseNumber(): NumC {
//     const num = parseInt(peek() || "0");
//     consume(peek() || "");
//     return { kind: 'numC', n: num };
//   }

//   function parseExpr(): ArithC {
//     if (peek() === '(') {
//       consume('(');
//       const operator = peek();
//       if (operator === '+') {
//         consume('+');
//         const left = parseExpr();
//         const right = parseExpr();
//         while (peek() !== ')') {
//           parseExpr();  // Ignore extra operands
//         }
//         consume(')');
//         return { kind: 'plusC', left, right };
//       } else if (operator === '*') {
//         consume('*');
//         const left = parseExpr();
//         const right = parseExpr();
//         while (peek() !== ')') {
//           parseExpr();  // Ignore extra operands
//         }
//         consume(')');
//         return { kind: 'multC', left, right };
//       } else if (operator === '-') {
//         consume('-');
//         if (peek() === '(') {
//           const arg = parseExpr();
//           while (peek() !== ')') {
//             parseExpr();  // Ignore extra operands
//           }
//           consume(')');
//           return { kind: 'plusC', left: { kind: 'numC', n: 0 }, right: { kind: 'multC', left: { kind: 'numC', n: -1 }, right: arg } };
//         } else {
//           const left = parseExpr();
//           const right = parseExpr();
//           while (peek() !== ')') {
//             parseExpr();  // Ignore extra operands
//           }
//           consume(')');
//           return { kind: 'plusC', left, right: { kind: 'multC', left: { kind: 'numC', n: -1 }, right } };
//         }
//       } else {
//         throw new Error(`Invalid operator: ${operator}`);
//       }
//     } else {
//       return parseNumber();
//     }
//   }

//   return parseExpr();
// }

/**
 * parse is a function that takes a string and returns an ArithS.
 * It parses the string into an abstract syntax tree (AST) of the surface language.
 * @param s - The string to parse.
 * @return The parsed ArithS.
 */
function parse(s: string): ArithS {
  const tokens = s.match(/\(|\)|\+|\*|\-|\d+/g) || [];
  let current = 0;

  function peek() {
    return tokens[current];
  }

  function consume(token: string) {
    if (peek() === token) {
      current++;
    } else {
      throw new Error(`Expected ${token}, got ${peek()}`);
    }
  }

  function parseNumber(): NumS {
    const num = parseInt(peek() || "0");
    consume(peek() || "");
    return { kind: 'numS', n: num };
  }

  function parseExpr(): ArithS {
    if (peek() === '(') {
      consume('(');
      const operator = peek();
      if (operator === '+') {
        consume('+');
        const left = parseExpr();
        const right = parseExpr();
        while (peek() !== ')') {
          parseExpr();  // Ignore extra operands
        }
        consume(')');
        return { kind: 'plusS', left, right };
      } else if (operator === '*') {
        consume('*');
        const left = parseExpr();
        const right = parseExpr();
        while (peek() !== ')') {
          parseExpr();  // Ignore extra operands
        }
        consume(')');
        return { kind: 'multS', left, right };
      } else if (operator === '-') {
        consume('-');
        if (peek() === '(') {
          const arg = parseExpr();
          while (peek() !== ')') {
            parseExpr();  // Ignore extra operands
          }
          consume(')');
          return { kind: 'uminusS', e: arg };
        } else {
          const left = parseExpr();
          const right = parseExpr();
          while (peek() !== ')') {
            parseExpr();  // Ignore extra operands
          }
          consume(')');
          return { kind: 'bminusS', left, right };
        }
      } else {
        throw new Error(`Invalid operator: ${operator}`);
      }
    } else {
      return parseNumber();
    }
  }
  
  return parseExpr();
}

/**
 * desugar is a function that takes an ArithS and returns an ArithC.
 * It transforms the AST of the surface language into an AST of the core language.
 * @param as - The ArithS to desugar.
 * @return The desugared ArithC.
 */
function desugar(as: ArithS): ArithC {
  switch (as.kind) {
    case 'numS':
      return { kind: 'numC', n: as.n };
    case 'plusS':
      return { kind: 'plusC', left: desugar(as.left), right: desugar(as.right) };
    case 'multS':
      return { kind: 'multC', left: desugar(as.left), right: desugar(as.right) };
    case 'bminusS':
      return { kind: 'plusC', left: desugar(as.left), right: { kind: 'multC', left: { kind: 'numC', n: -1 }, right: desugar(as.right) } };
    case 'uminusS':
      return { kind: 'plusC', left: { kind: 'numC', n: 0 }, right: { kind: 'multC', left: { kind: 'numC', n: -1 }, right: desugar(as.e) } };
  }
}

/**
 * interp is a function that takes an ArithC and returns a number.
 * It interprets the AST of the core language and computes the result of the arithmetic expression.
 * @param a - The ArithC to interpret.
 * @return The result of the arithmetic expression.
 */
function interp(a: ArithC): number {
  switch (a.kind) {
    case 'numC':
      return a.n;
    case 'plusC':
      return interp(a.left) + interp(a.right);
    case 'multC':
      return interp(a.left) * interp(a.right);
    default:
      throw new Error(`Invalid expression: ${a}`);
  }
}

// Exemplo de uso:
const expression = '(+ 1 (* 2 (+ 3 0)))';
const ast_surface = parse(expression) // AST of Surface Language
const ast_core = desugar(ast_surface) // AST of Core Language

console.log("AST:")
console.log(JSON.stringify(ast_surface, null, 2))
console.log()
console.log("Result: ", interp(ast_core))

const someAST: ArithS = {
  "kind": "bminusS",
  "left": {
    "kind": "numS",
    "n": 6
  },
  "right": {
    "kind": "numS",
    "n": 2
  }
}

console.log("Surface AST: ")
console.log(someAST)
console.log()

console.log("Core AST: ")
console.log(desugar(someAST))
console.log()

console.log("Resultado = ", interp(desugar(someAST)))
console.log()
