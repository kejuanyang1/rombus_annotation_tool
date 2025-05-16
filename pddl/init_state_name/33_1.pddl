(define (problem scene1)
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
    (ontable small allmax battery)
    (in apple-shaped candle pink basket)
    (in duracell battery green basket)
    (clear ping pong ball)
    (clear small allmax battery)
    (handempty)
  )
  (:goal (and ))
)