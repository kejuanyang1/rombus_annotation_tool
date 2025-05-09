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
    (in wrench blue basket)
    (in big screw yellow basket)
    (closed blue basket)
    (closed yellow basket)
    (clear blue stripper)
    (clear tweezers)
    (clear pointed chisel)
    (handempty)
  )
  (:goal (and ))
)