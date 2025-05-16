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
    (ontable tweezers)
    (ontable pointed chisel)
    (clear blue stripper)
    (clear tweezers)
    (clear pointed chisel)
    (handempty)
  )
  (:goal (and ))
)