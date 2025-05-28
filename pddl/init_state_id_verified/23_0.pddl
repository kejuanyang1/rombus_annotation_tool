(define (problem generated)
  (:domain manip)
  (:objects
    container_01 container_10 - container
    kitchen_09 kitchen_17 kitchen_27 kitchen_28 kitchen_30 - item
    lid_04 - lid
  )
  (:init
    (clear kitchen_09)
    (clear kitchen_17)
    (clear kitchen_27)
    (clear kitchen_28)
    (clear kitchen_30)
    (clear lid_04)
    (closed container_10)
    (handempty)
    (in kitchen_28 container_01)
    (on lid_04 container_10)
    (ontable container_01)
    (ontable container_10)
    (ontable kitchen_09)
    (ontable kitchen_17)
    (ontable kitchen_27)
    (ontable kitchen_30)
  )
  (:goal (and))
)
