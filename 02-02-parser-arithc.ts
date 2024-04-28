/**
 * This parser is designed to parse mathematical expressions represented as strings into a structured format that can be evaluated or manipulated further. The expressions can include numbers and the operators '+', and '*'. The parser uses a recursive descent parsing strategy, which starts from the highest level of the grammar and works its way down, recursively parsing each component of the expression.
 *
 * Here's a high-level overview of how the parser works:
 *
 * 1. Tokenization: The input string is broken down into tokens using a regular expression. Tokens can be parentheses, operators, or numbers.
 *
 * 2. Parsing: The tokens are parsed into an abstract syntax tree (AST) using several parsing functions, each responsible for parsing a different part of the grammar. The `parseExpr` function is the main driver of the parsing process, and it delegates to `parseNumber` or itself depending on the current token.
 *
 * The grammar that this parser recognizes is as follows:
 *
 * Expr -> Number
 *      |  ( + Expr Expr* )
 *      |  ( * Expr Expr* )
 *
 * This can be visualized as follows:
 *
 * Expr
 *  |
 *  ----> Number
 *  |
 *  ----> ( + Expr Expr* )
 *  |
 *  ----> ( * Expr Expr* )
 *
 * Each node in the AST is an object that includes the kind of the node (e.g., 'numC', 'plusC', 'multC') and any additional information needed (e.g., the number for 'numC', the arguments for 'plusC' and 'multC').
 *
 * For example, the string '(+ 1 2)' would be parsed into the following AST:
 *
 * {
 *   kind: 'plusC',
 *   args: [
 *     { kind: 'numC', n: 1 },
 *     { kind: 'numC', n: 2 }
 *   ]
 * }
 *
 * This AST can then be evaluated, printed, or manipulated in other ways.
 */

// ------
// CODE

/**
 * Represents an expression which can be a number, addition, or multiplication.
 */
type Expr = NumC | PlusC | MultC;

/**
 * Represents a number.
 */
interface NumC {
  kind: 'numC';
  n: number;
}

/**
 * Represents an addition operation.
 */
interface PlusC {
  kind: 'plusC';
  args: Expr[];
}

/**
 * Represents a multiplication operation.
 */
interface MultC {
  kind: 'multC';
  args: Expr[];
}

/**
 * Parses a string into an expression.
 * @param s - The string to parse.
 * @returns The parsed expression.
 */
function parse(s: string): Expr {
  const tokens = s.match(/\(|\)|\+|\*|\d+/g) || [];
  let current = 0;

  /**
   * Peeks at the current token.
   * @returns The current token.
   */
  function peek() {
    return tokens[current];
  }

  /**
   * Consumes the current token if it matches the expected token.
   * @param token - The expected token.
   * @throws Will throw an error if the current token does not match the expected token.
   */
  function consume(token: string) {
    if (peek() === token) {
      current++;
    } else {
      throw new Error(`Expected ${token}, got ${peek()}`);
    }
  }

  /**
   * Parses a number.
   * @returns The parsed number.
   */
  function parseNumber(): NumC {
    const num = parseInt(peek() || "0");
    consume(peek() || "");
    return { kind: 'numC', n: num };
  }

  /**
   * Parses an expression.
   * @returns The parsed expression.
   */
  function parseExpr(): Expr {
    if (peek() === '(') {
      consume('(');
      const operator = peek();
      if (operator === '+') {
        consume('+');
        const args: Expr[] = [];
        while (peek() !== ')') {
          args.push(parseExpr());
        }
        consume(')');
        return { kind: 'plusC', args };
      } else if (operator === '*') {
        consume('*');
        const args: Expr[] = [];
        while (peek() !== ')') {
          args.push(parseExpr());
        }
        consume(')');
        return { kind: 'multC', args };
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
 * Prints an expression as code.
 * @param expr - The expression to print.
 * @returns The printed expression.
 */
function printExprAsCode(expr: Expr): string {
    switch (expr.kind) {
      case 'numC':
        return expr.n.toString();
      case 'plusC':
        return `(+ ${expr.args.map(printExprAsCode).join(' ')})`;
      case 'multC':
        return `(* ${expr.args.map(printExprAsCode).join(' ')})`;
      default:
        return 'Invalid expression';
    }
  }
  
  // Example usage:
  const expression = '(+ 1 1 1 (* 2 2 (+ 3 0)))';
  const parsedExpression = parse(expression);
  const printedExpression = printExprAsCode(parsedExpression);


  console.log("OUTPUT")
  console.log(printedExpression);
  console.log()
  console.log(JSON.stringify(parsedExpression, null, 2));
