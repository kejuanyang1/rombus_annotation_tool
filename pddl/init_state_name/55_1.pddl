(define (problem scene1)
  (:domain manip)
  (:objects
    scissors - item
    scrapper - item
    big screw - item
    wrench - item
    tweezers - item
  )
  (:init
    (ontable scissors)
    (ontable scrapper)
    (ontable big screw)
    (ontable wrench)
    (ontable tweezers)
    (clear scissors)
    (clear scrapper)
    (clear big screw)
    (clear wrench)
    (clear tweezers)
    (handempty)
  )
  (:goal (and ))
)