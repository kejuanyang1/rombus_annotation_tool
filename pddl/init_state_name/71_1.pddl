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
    (ontable yellow jello box)
    (ontable stapler)
    (ontable blue marker)
    (in apple pink basket)
    (on red onion yellow jello box)
    (closed pink basket)
    (clear red onion)
    (clear stapler)
    (clear blue marker)
    (handempty)
  )
  (:goal (and ))
)