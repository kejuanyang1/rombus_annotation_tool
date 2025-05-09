(define (problem scene1)
  (:domain manip)
  (:objects
    apple - item
    red onion - item
    yellow jello box - support
    blue marker - item
    stapler - item
    pink basket - container
  )
  (:init
    (ontable apple)
    (ontable red onion)
    (ontable yellow jello box)
    (ontable blue marker)
    (ontable stapler)
    (ontable pink basket)
    (clear apple)
    (clear red onion)
    (clear yellow jello box)
    (clear blue marker)
    (clear stapler)
    (clear pink basket)
    (handempty)
  )
  (:goal (and ))
)