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
    (ontable pointed chisel)
    (in orange stripper blue basket)
    (ontable small allmax battery)
    (closed blue basket)
    (handempty)
    (clear black tape)
    (clear white tape)
    (clear pointed chisel)
    (clear small allmax battery)
  )
  (:goal (and ))
)