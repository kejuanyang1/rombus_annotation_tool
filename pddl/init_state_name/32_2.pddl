(define (problem scene1)
  (:domain manip)
  (:objects
    ping pong ball - item
    apple-shaped candle - item
    duracell battery - support
    small allmax battery - support
  )
  (:init
    (ontable ping pong ball)
    (ontable apple-shaped candle)
    (ontable duracell battery)
    (ontable small allmax battery)
    (clear ping pong ball)
    (clear apple-shaped candle)
    (clear duracell battery)
    (clear small allmax battery)
    (handempty)
  )
  (:goal (and ))
)