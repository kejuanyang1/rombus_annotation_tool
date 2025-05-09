(define (problem scene1)
  (:domain manip)
  (:objects
    scissors - item
    blue stripper - item
    orange stripper - item
    wrench - item
    tweezers - item
  )
  (:init
    (ontable scissors)
    (ontable blue stripper)
    (ontable orange stripper)
    (ontable wrench)
    (ontable tweezers)
    (clear scissors)
    (clear blue stripper)
    (clear orange stripper)
    (clear wrench)
    (clear tweezers)
    (handempty)
  )
  (:goal (and ))
)