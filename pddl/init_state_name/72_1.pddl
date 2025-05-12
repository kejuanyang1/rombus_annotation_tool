(define (problem scene1)
  (:domain manip)
  (:objects
    banana - item
    orange - item
    mango - item
    yellow lemon - item
    black tape - item
    white tape - item
  )
  (:init
    (ontable banana)
    (ontable orange)
    (ontable mango)
    (ontable black tape)
    (ontable white tape)
    (on yellow lemon white tape)
    (clear banana)
    (clear orange)
    (clear mango)
    (clear yellow lemon)
    (clear black tape)
    (clear white tape)
    (handempty)
  )
  (:goal (and ))
)