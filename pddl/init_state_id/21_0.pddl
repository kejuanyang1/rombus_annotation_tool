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
    (ontable kitchen_10_1)
    (ontable kitchen_10_2)
    (ontable kitchen_19)
    (ontable kitchen_26)
    (ontable kitchen_29)
    (ontable kitchen_33)
    (ontable lid_02)
    (ontable container_08)
    (clear kitchen_01)
    (clear kitchen_10_1)
    (clear kitchen_10_2)
    (clear kitchen_19)
    (clear kitchen_26)
    (clear kitchen_29)
    (clear kitchen_33)
    (clear lid_02)
    (handempty)
  )
  (:goal (and ))
)