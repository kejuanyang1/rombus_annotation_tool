(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_10_1 kitchen_10_2 kitchen_17 kitchen_19 kitchen_27 - item
    container_07 container_08 - container
    lid_01 lid_02 - lid
  )
  (:init
    (ontable kitchen_10_2)
    (ontable kitchen_17)
    (ontable kitchen_19)
    (ontable kitchen_27)
    (ontable lid_01)
    (in kitchen_10_1 container_08)
    (ontable container_08)
    (handempty)
    (clear kitchen_10_2)
    (clear kitchen_17)
    (clear kitchen_19)
    (clear kitchen_27)
    (clear lid_01)
  )
  (:goal (and ))
)