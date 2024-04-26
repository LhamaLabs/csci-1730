#lang plai-typed

; This is a type definition
; Animal is a new type with cases camel and yak
; each has a constructor with a number
(define-type Animal
  [camel (humps : number)]
  [yak   (height : number)])

; This is how define a var/binding of the new type
(define my-camel : Animal (camel 2))

; We can use type inference also
(define my-yak (yak 1.23))


; Function - type pattern match
(define (good? [a : Animal]) : boolean ; return
  (type-case Animal a
    ; same as:
    #;[camel (humps) (>= humps 2)]
    [camel (h) (>= h 2)]
    ; same as:
    #;[yak (height) (> height 2.1)]
    [yak (h) (> h 2.1)]))

;Without pattern match
#;(define (good? [ma : MisspelledAnimal]) : boolean
    (cond
      [(caml? ma) (>= (caml-humps ma) 2)]
      [(yacc? ma) (> (yacc-height ma) 2.1)]))

; Test cases
(test (good? my-camel) #t)
(test (good? my-yak)   #f)