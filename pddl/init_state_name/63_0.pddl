(define (problem scene1)
  (:domain manip)
  (:objects
    white tape - item
    black pen - item
    scissors - item
    scrapper - item
    pink basket - container
    blue basket - container
  )
  (:init
    (ontable white tape)
    (ontable black pen)
    (ontable scissors)
    (ontable scrapper)
    (ontable pink basket)
    (ontable blue basket)
    (clear white tape)
    (clear black pen)
    (clear scissors)
    (clear scrapper)
    (clear pink basket)
    (clear blue basket)
    (handempty)
  )
  (:goal (and))
)