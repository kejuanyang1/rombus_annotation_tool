(define (problem scene1)
  (:domain manip)
  (:objects
    blue stripper - item
    orange stripper - item
    big screw - item
    wrench - item
    pointed chisel - item
  )
  (:init
    (ontable blue stripper)
    (ontable orange stripper)
    (ontable big screw)
    (ontable wrench)
    (ontable pointed chisel)
    (clear blue stripper)
    (clear orange stripper)
    (clear big screw)
    (clear wrench)
    (clear pointed chisel)
    (handempty)
  )
  (:goal (and ))
)