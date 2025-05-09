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
    (ontable apple-shaped candle)
    (ontable duracell battery)
    (ontable small allmax battery)
    (ontable big green shopping basket)
    (clear ping pong ball)
    (clear apple-shaped candle)
    (clear duracell battery)
    (clear small allmax battery)
    (clear big green shopping basket)
    (handempty)
  )
  (:goal (and ))
)