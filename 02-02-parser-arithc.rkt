#lang plai-typed

; Top Type that represents a expression
; recursively it is type ArithC and when passed
; a number it become number
; When a expression as plus is passed it return a
; list with two ArithC until it is reduce to numbers and
; structured lists of numbers
(define-type ArithC
  [numC (n : number)]
  [plusC (l : ArithC) (r : ArithC)]
  [multC (l : ArithC) (r : ArithC)])


(define (parse [s : s-expression]) : ArithC
  (cond
    ; case a number then numC
    [(s-exp-number? s) (numC (s-exp->number s))]
    ; case a list then process the list
    [(s-exp-list? s)
     ;     the list is converted from s-exp to list
     (let ([sl (s-exp->list s)])
       ;      verify the first symbol from list sl defined in let
       (case (s-exp->symbol (first sl))
         ; case the symbol is '+ then plusC is called with
         ; second and third element from list
         [(+) (plusC (parse (second sl)) (parse (third sl)))]
         ; case is '* then multC...
         [(*) (multC (parse (second sl)) (parse (third sl)))]
         ; otherwise alert an error
         [else (error 'parse "invalid list input")]))]
    [else (error 'parse "invalid input")]))


; On REPL:
#;(parse '(+ (* 1 2) (+ 2 3)))