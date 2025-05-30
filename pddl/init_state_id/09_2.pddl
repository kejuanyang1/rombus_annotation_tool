(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_04 - item
    kitchen_14 - item
    kitchen_22_1 kitchen_22_2 - item
    kitchen_32 - item
    container_08 - container
    lid_02 - lid
  )
  (:init
    (ontable kitchen_04)
    (ontable kitchen_14)
    (ontable kitchen_22_1)
    (ontable kitchen_22_2)
    (ontable kitchen_32)
    (ontable container_08)
    (ontable lid_02)
    (handempty)
    (clear kitchen_04)
    (clear kitchen_14)
    (clear kitchen_22_1)
    (clear kitchen_22_2)
    (clear kitchen_32)
    (clear lid_02)
  )
  (:goal (and ))
)