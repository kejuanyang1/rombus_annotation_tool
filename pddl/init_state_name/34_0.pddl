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
    (ontable duracell battery)
    (in apple-shaped candle big green shopping basket)
    (in small allmax battery big green shopping basket)
    (closed big green shopping basket)
    (handempty)
    (clear ping pong ball)
    (clear duracell battery)
  )
  (:goal (and ))
)