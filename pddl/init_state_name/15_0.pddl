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
    (ontable tomato)
    (ontable purple jello box)
    (ontable plastic knife)
    (ontable blue plate)
    (clear orange)
    (clear tomato)
    (clear purple jello box)
    (clear plastic knife)
    (clear blue plate)
    (handempty)
  )
  (:goal (and ))
)