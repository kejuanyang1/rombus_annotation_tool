(define (problem scene1)
  (:domain manip)
  (:objects
    ping pong ball - item
    apple-shaped candle - item
    duracell battery - support
    small allmax battery - support
    big green shopping basket - container
  )
  (:init
    (ontable ping pong ball)
    (in apple-shaped candle big green shopping basket)
    (in duracell battery big green shopping basket)
    (in small allmax battery big green shopping basket)
    (handempty)
    (clear ping pong ball)
  )
  (:goal (and))
)