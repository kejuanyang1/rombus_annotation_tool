(define (problem scene1) (:domain manip)
  (:objects
    bunch of green grapes - item
    red onion - item
    yellow jello box - support
    water bottle - item
  )
  (:init
    (ontable bunch of green grapes)
    (ontable red onion)
    (ontable yellow jello box)
    (ontable water bottle)
    (clear bunch of green grapes)
    (clear red onion)
    (clear yellow jello box)
    (clear water bottle)
    (handempty)
  )
  (:goal (and ))
)