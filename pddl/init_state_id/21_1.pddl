(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_01 - item
    kitchen_10_1 kitchen_10_2 - item
    kitchen_19 - item
    kitchen_26 - support
    kitchen_29 - item
    kitchen_33 - container
    container_08 - container
    lid_02 - lid
  )
  (:init
    (ontable kitchen_01)
    (ontable kitchen_19)
    (ontable kitchen_26)
    (ontable kitchen_29)
    (ontable lid_02)
    (on kitchen_10_2 kitchen_33)
    (in kitchen_10_1 container_08)
    (ontable kitchen_33)
    (ontable container_08)
    (clear kitchen_01)
    (clear kitchen_10_1)
    (clear kitchen_10_2)
    (clear kitchen_19)
    (clear kitchen_26)
    (clear kitchen_29)
    (clear lid_02)
    (clear kitchen_33)
    (clear container_08)
    (handempty)
  )
  (:goal (and ))
)