type Expr = NumC | PlusC | MultC;

interface NumC {
  kind: 'numC';
  n: number;
}

interface PlusC {
  kind: 'plusC';
  args: Expr[];
}

interface MultC {
  kind: 'multC';
  args: Expr[];
}

function parse(s: string): Expr {
  const tokens = s.match(/\(|\)|\+|\*|\d+/g) || [];
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

  function parseNumber(): NumC {
    const num = parseInt(peek() || "0");
    consume(peek() || "");
    return { kind: 'numC', n: num };
  }

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
