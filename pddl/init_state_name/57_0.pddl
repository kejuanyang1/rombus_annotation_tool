(define (problem scene1)
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
    (ontable blue stripper)
    (ontable big screw)
    (ontable wrench)
    (ontable tweezers)
    (ontable pointed chisel)
    (ontable blue basket)
    (ontable yellow basket)
    (clear blue stripper)
    (clear big screw)
    (clear wrench)
    (clear tweezers)
    (clear pointed chisel)
    (clear blue basket)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)