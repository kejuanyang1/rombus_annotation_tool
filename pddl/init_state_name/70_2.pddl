(define (problem scene1)
  (:domain manip)
  (:objects
    blue marker - item
    green marker - item
    scrapper - item
    orange stripper - item
    apple-shaped candle - item
  )
  (:init
    (ontable blue marker)
    (ontable green marker)
    (ontable scrapper)
    (ontable orange stripper)
    (ontable apple-shaped candle)
    (clear blue marker)
    (clear green marker)
    (clear scrapper)
    (clear orange stripper)
    (clear apple-shaped candle)
    (handempty)
  )
  (:goal (and ))
)