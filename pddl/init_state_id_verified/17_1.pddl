(define (problem generated)
  (:domain manip)
  (:objects
    container_07 - container
    kitchen_06 kitchen_09 kitchen_12 kitchen_24 kitchen_27 - item
    lid_01 - lid
  )
  (:init
    (clear kitchen_06)
    (clear kitchen_09)
    (clear kitchen_12)
    (clear kitchen_24)
    (clear kitchen_27)
    (clear lid_01)
    (handempty)
    (in kitchen_09 container_07)
    (ontable container_07)
    (ontable kitchen_06)
    (ontable kitchen_12)
    (ontable kitchen_24)
    (ontable kitchen_27)
    (ontable lid_01)
  )
  (:goal (and))
)
