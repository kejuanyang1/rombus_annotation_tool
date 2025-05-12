(define (problem scene)
  (:domain manip)
  (:objects
    blue stripper - item
    big screw - item
    wrench - item
    tweezers - item
    pointed chisel - item
    blue basket - container
    yellow basket - container
  )
  (:init
    (ontable big screw)
    (ontable wrench)
    (ontable tweezers)
    (in blue stripper yellow basket)
    (in pointed chisel blue basket)
    (clear big screw)
    (clear wrench)
    (clear tweezers)
    (handempty)
  )
  (:goal (and ))
)