#lang plai-typed

; Type Arithmetic Core
(define-type ArithC 
  [numC (n : number)]
  [plusC (l : ArithC) (r : ArithC)]
  [multC (l : ArithC) (r : ArithC)])

; Parsing function
; string -> Expr
; returns an Expr tree
(define (parse [s : s-expression]) : ArithC
  (cond
    [(s-exp-number? s) (numC (s-exp->number s))]
    [(s-exp-list? s)
     (let ([sl (s-exp->list s)])
       (case (s-exp->symbol (first sl))
         [(+) (plusC (parse (second sl)) (parse (third sl)))]
         [(*) (multC (parse (second sl)) (parse (third sl)))]
         [else (error 'parse "invalid list input")]))]
    [else (error 'parse "invalid input")]))

; Interpreting function
; Expr -> integer
; interprets an s-expression and returns the result
(define (interp [a : ArithC]) : number
  (type-case ArithC a
    [numC (n) n]
    [plusC (l r) (+ (interp l) (interp r))]
    [multC (l r) (* (interp l) (interp r))]))

; Type Arythmetic Sugar
(define-type ArithS
  [numS (n : number)]
  [uminusS (e : ArithS)]
  [plusS (l : ArithS) (r : ArithS)]
  [bminusS (l : ArithS) (r : ArithS)]
  [multS (l : ArithS) (r : ArithS)])

; Desugaring function
; ArithS -> ArithC
; Recieves an ArithS AST and transforms in an ArithC AST
(define (desugar [as : ArithS]) : ArithC
  (type-case ArithS as
    [numS (n) (numC n)]
    [plusS (l r) (plusC (desugar l) (desugar r))]
    [multS (l r) (multC (desugar l) (desugar r))]
    [bminusS (l r) (plusC (desugar l) (multC (numC -1) (desugar r)))]
    [uminusS (e) (plusC (numC 0) (multC (numC -1) (desugar e)))]))

; new code

; lets define functions in our language
; for simplicity we'll consider functions with one arg.

(define-type ExprC
  [numberC (n : number)]
  [variableC (s : symbol)]
  [functionC (fun : symbol) (arg : ExprC)]
  [plusOpC (l : ExprC) (r : ExprC)]
  [multOpC (l : ExprC) (r : ExprC)])

(define-type FunDefC
  [fdC (name : symbol) (arg : symbol) (body : ExprC)])

#;(fdC 'double 'x (plusOpC (variableC 'x) (variableC 'x)))

(define (get-fundef f fds)
  (cond
    [(empty? fds) (error 'get-fundef "function not found")]
    [(equal? f (fdC-name (first fds))) (first fds)]
    [else (get-fundef f (rest fds))]))

#|
Second

Substitution is the act of replacing a name (in this case, that of the formal parameter)
in an expression (in this case, the body of the function) with another expression (in this
case, the actual parameter).
|#

(define (subst [what : ExprC] [for : symbol] [in : ExprC]) : ExprC
  (type-case ExprC in
    [numberC (n) in]
    [variableC (s) (cond
                     [(symbol=? s for) what]
                     [else in])]
    [functionC (f a) (functionC f (subst what for a))]
    [plusOpC (l r) (plusOpC (subst what for l)
                            (subst what for r))]
    [multOpC (l r) (multOpC (subst what for l)
                            (subst what for r))]))

#|
First

Now we’re ready to tackle the interpreter proper. First, let’s remind ourselves of what
it needs to consume. Previously, it consumed only an expression to evaluate. Now it
also needs to take a list of function definitions
|#
(define (interpExpr [e : ExprC] [fds : (listof FunDefC)]) : number
  (type-case ExprC e
    [numberC (n) n]
    [variableC (n) (error 'interpExpr "Unbound variable")]
    [functionC (f a) (if (empty? fds)
                         (error 'interpExpr "No function definitions provided")
                         (let ([fd (get-fundef f fds)])
                           (interpExpr (subst a
                                              (fdC-arg fd)
                                              (fdC-body fd))
                                       fds)))]
    [plusOpC (l r) (+ (interpExpr l fds) (interpExpr r fds))]
    [multOpC (l r) (* (interpExpr l fds) (interpExpr r fds))]))



