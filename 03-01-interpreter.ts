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

/**
 * Interprets an expression.
 * @param a - The expression to interpret.
 * @returns The result of the interpretation.
 */
function interp(a: Expr): number {
  switch (a.kind) {
    case 'numC':
      return a.n;
    case 'plusC':
      return a.args.reduce((sum, expr) => sum + interp(expr), 0);
    case 'multC':
      return a.args.reduce((product, expr) => product * interp(expr), 1);
    default:
      throw new Error(`Invalid expression: ${a}`);
  }
}

// Example usage:
const expression = '(+ 1 1 1 (* 2 2 (+ 3 0)))';
console.log(interp(parse(expression)))
