(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_04 - item
    kitchen_14 - item
    kitchen_22_1 - item
    kitchen_22_2 - item
    kitchen_32 - item
    container_08 - container
    lid_02 - lid
  )
  (:init
    (ontable kitchen_04)
    (ontable kitchen_14)
    (ontable kitchen_22_1)
    (ontable kitchen_32)
    (ontable lid_02)
    (in kitchen_22_2 container_08)
    (clear kitchen_04)
    (clear kitchen_14)
    (clear kitchen_22_1)
    (clear kitchen_22_2)
    (clear kitchen_32)
    (clear lid_02)
    (clear container_08)
    (handempty)
  )
  (:goal (and ))
)