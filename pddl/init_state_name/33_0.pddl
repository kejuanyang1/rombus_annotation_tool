(define (problem scene)
  (:domain manip)
  (:objects
    ping pong ball - item
    apple-shaped candle - item
    duracell battery - support
    small allmax battery - support
    pink basket - container
    green basket - container
  )
  (:init
    (ontable ping pong ball)
    (ontable apple-shaped candle)
    (ontable duracell battery)
    (ontable small allmax battery)
    (ontable pink basket)
    (ontable green basket)
    (clear ping pong ball)
    (clear apple-shaped candle)
    (clear duracell battery)
    (clear small allmax battery)
    (clear pink basket)
    (clear green basket)
    (handempty)
  )
  (:goal (and ))
)