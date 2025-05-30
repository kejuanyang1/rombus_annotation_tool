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
    (ontable kitchen_27)
    (ontable kitchen_28)
    (ontable kitchen_30)
    (in kitchen_17 container_01)
    (in kitchen_09 container_10)
    (ontable lid_04)
    (handempty)
    (clear kitchen_27)
    (clear kitchen_28)
    (clear kitchen_30)
    (clear lid_04)
  )
  (:goal (and ))
)