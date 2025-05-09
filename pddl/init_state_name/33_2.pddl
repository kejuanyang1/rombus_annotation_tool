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
    (in duracell battery green basket)
    (in small allmax battery pink basket)
    (closed pink basket)
    (closed green basket)
    (handempty)
    (clear ping pong ball)
    (clear apple-shaped candle)
  )
  (:goal (and ))
)