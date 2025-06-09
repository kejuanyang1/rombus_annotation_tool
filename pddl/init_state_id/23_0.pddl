(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_09 - item
    kitchen_17 - item
    kitchen_27 - item
    kitchen_28 - item
    kitchen_30 - item
    container_01 - container
    container_10 - container
    lid_04 - lid
  )
  (:init
    (ontable kitchen_09)
    (ontable kitchen_17)
    (ontable kitchen_27)
    (ontable kitchen_30)
    (ontable container_01)
    (ontable container_10)
    (in kitchen_28 container_01)
    (on lid_04 container_10)
    (closed container_10)
    (clear kitchen_09)
    (clear kitchen_17)
    (clear kitchen_27)
    (clear kitchen_30)
    (clear container_01)
    (handempty)
  )
  (:goal (and ))
)