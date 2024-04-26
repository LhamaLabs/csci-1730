#lang plai-typed

(define (double x) (* 2 x))

(define [reverse-string s]
  (list->string (reverse (string->list s))))

(define some-value "Hello, Typed Racket!")

(define greet
  (lambda (name) (display (string-append "Hello, " name))))

;;; macro to comment a whole s-expression such #_ in clojure
#;(define blablabla "whiskasache")
