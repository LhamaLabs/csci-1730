#lang plai-typed

#|
We will therefore exploit a handy feature of Racket to manage the transfor-
mation of input streams into trees: read. read is tied to the parenthetical form of the
language, in that it parses fully (and hence unambiguously) parenthesized terms into
a built-in tree form. For instance, running (read) on the parenthesized form of the
above input:
|#
(+ 23 (- 5 6))

#|
I said that (read)—or equivalently, using quotation—will
produce a list, etc. That’s true in regular Racket, but in Typed PLAI, the type it returns
a distinct type called an s-expression, written in Typed PLAI as s-expression:

Type in REPL:
> (read)

Then:
> l
|#
(define l '(1 2))

; In Typed PLAI we have the s-expression type
; it's not present in Racket and is returned
; both from quote and read.



