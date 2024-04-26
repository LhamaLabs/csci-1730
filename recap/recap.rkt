#lang plai-typed

(define (double x) (* 2 x))

(define [reverse-string s]
  (list->string (reverse (string->list s))))

(define some-value "Hello, Typed Racket!")

(define greet
  (lambda (name) (display (string-append "Hello, " name))))
