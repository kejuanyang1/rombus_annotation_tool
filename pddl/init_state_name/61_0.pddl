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
    (ontable black tape)
    (ontable white tape)
    (ontable orange stripper)
    (ontable pointed chisel)
    (ontable small allmax battery)
    (ontable blue basket)
    (clear black tape)
    (clear white tape)
    (clear orange stripper)
    (clear pointed chisel)
    (clear small allmax battery)
    (clear blue basket)
    (handempty)
  )
  (:goal (and ))
)