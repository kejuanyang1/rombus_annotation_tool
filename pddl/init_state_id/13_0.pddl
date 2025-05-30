(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_10_1 kitchen_10_2 kitchen_17 kitchen_19 kitchen_27 - item
    container_07 container_08 - container
    lid_01 lid_02 - lid
  )
  (:init
    (ontable kitchen_10_1)
    (ontable kitchen_10_2)
    (ontable kitchen_17)
    (ontable kitchen_19)
    (ontable kitchen_27)
    (ontable container_07)
    (ontable container_08)
    (ontable lid_02)
    (on lid_01 container_07)
    (closed container_07)
    (clear kitchen_10_1)
    (clear kitchen_10_2)
    (clear kitchen_17)
    (clear kitchen_19)
    (clear kitchen_27)
    (clear lid_02)
    (handempty)
  )
  (:goal (and ))
)