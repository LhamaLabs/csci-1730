#lang plai-typed
#lang plai-typed

; Type Arithmetic Calculator
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

; new code

; We defined the 'core' of the language. Now we have the addition
; and multiplication. With that we can start defining new
; operations that are 'desugared' into core.

; Like, for subtraction we can define it as: a - b = a + -1 * b

; So we can do it with + and *. For do this we'll define a new
; type called ArithS where the ArithS operations will be
; desugared into ArithC operations.

(define-type ArithS
  [numS (n : number)]
  [plusS (l : ArithS) (r : ArithS)]
  ; bminus is the new operation
  [bminusS (l : ArithS) (r : ArithS)]
  [multS (l : ArithS) (r : ArithS)])

; and a desugar function for recieve ArithS and return
(define (desugar [as : ArithS]) : ArithC
  (type-case ArithS as
    [numS (n) (numC n)]
    [plusS (l r) (plusC (desugar l)
                        (desugar r))]
    [multS (l r) (multC (desugar l)
                        (desugar r))]
    [bminusS (l r) (plusC (desugar l)
                          (multC (numC -1) (desugar r)))]))

