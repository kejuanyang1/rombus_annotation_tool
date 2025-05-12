(define (problem scene1)
  (:domain manip)
  (:objects
    black tape - item
    white tape - item
    orange stripper - item
    pointed chisel - item
    small allmax battery - support
    blue basket - container
  )
  (:init
    (ontable white tape)
    (ontable orange stripper)
    (ontable pointed chisel)
    (in black tape blue basket)
    (in small allmax battery blue basket)
    (ontable blue basket)
    (handempty)
    (clear white tape)
    (clear orange stripper)
    (clear pointed chisel)
  )
  (:goal (and ))
)