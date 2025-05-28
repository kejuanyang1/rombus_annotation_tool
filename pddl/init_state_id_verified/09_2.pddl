(define (problem generated)
  (:domain manip)
  (:objects
    container_08 - container
    kitchen_04 kitchen_14 kitchen_22_1 kitchen_22_2 kitchen_32 - item
    lid_02 - lid
  )
  (:init
    (clear kitchen_04)
    (clear kitchen_14)
    (clear kitchen_22_1)
    (clear kitchen_22_2)
    (clear kitchen_32)
    (clear lid_02)
    (handempty)
    (ontable container_08)
    (ontable kitchen_04)
    (ontable kitchen_14)
    (ontable kitchen_22_1)
    (ontable kitchen_22_2)
    (ontable kitchen_32)
    (ontable lid_02)
  )
  (:goal (and))
)
