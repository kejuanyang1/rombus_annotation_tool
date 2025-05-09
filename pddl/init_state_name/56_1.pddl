(define (problem scene1)
  (:domain manip)
  (:objects
    scissors - item
    screwdriver - item
    scrapper - item
    blue stripper - item
    orange stripper - item
  )
  (:init
    (ontable scissors)
    (ontable screwdriver)
    (ontable scrapper)
    (ontable blue stripper)
    (ontable orange stripper)
    (clear scissors)
    (clear screwdriver)
    (clear scrapper)
    (clear blue stripper)
    (clear orange stripper)
    (handempty)
  )
  (:goal (and ))
)