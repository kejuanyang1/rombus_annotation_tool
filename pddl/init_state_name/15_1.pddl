(define (problem scene1)
  (:domain manip)
  (:objects
    orange - item
    tomato - item
    purple jello box - support
    plastic knife - item
    blue plate - container
  )
  (:init
    (ontable orange)
    (ontable purple jello box)
    (ontable plastic knife)
    (on tomato blue plate)
    (handempty)
    (clear orange)
    (clear purple jello box)
    (clear plastic knife)
    (clear tomato)
  )
  (:goal (and ))
)