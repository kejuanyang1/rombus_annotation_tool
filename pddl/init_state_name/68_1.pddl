(define (problem scene1)
  (:domain manip)
  (:objects
    stapler - item
    wrench - item
    tweezers - item
    apple-shaped candle - item
    duracell battery - support
    small allmax battery - support
  )
  (:init
    (ontable stapler)
    (ontable wrench)
    (ontable tweezers)
    (ontable apple-shaped candle)
    (ontable duracell battery)
    (ontable small allmax battery)
    (clear stapler)
    (clear wrench)
    (clear tweezers)
    (clear apple-shaped candle)
    (clear duracell battery)
    (clear small allmax battery)
    (handempty)
  )
  (:goal (and ))
)