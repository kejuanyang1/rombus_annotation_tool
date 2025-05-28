(define (problem generated)
  (:domain manip)
  (:objects
    container_07 container_08 - container
    kitchen_10_1 kitchen_10_2 kitchen_17 kitchen_19 kitchen_27 - item
    lid_01 lid_02 - lid
  )
  (:init
    (clear kitchen_10_1)
    (clear kitchen_10_2)
    (clear kitchen_17)
    (clear kitchen_19)
    (clear kitchen_27)
    (clear lid_01)
    (clear lid_02)
    (closed container_07)
    (handempty)
    (on lid_01 container_07)
    (ontable container_07)
    (ontable container_08)
    (ontable kitchen_10_1)
    (ontable kitchen_10_2)
    (ontable kitchen_17)
    (ontable kitchen_19)
    (ontable kitchen_27)
    (ontable lid_02)
  )
  (:goal (and))
)
