(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_06 - item
    kitchen_09 - item
    kitchen_12 - item
    kitchen_27 - item
    kitchen_24 - item
    container_07 - container
    lid_01 - lid
  )
  (:init
    (ontable kitchen_06)
    (ontable kitchen_09)
    (ontable kitchen_12)
    (ontable kitchen_27)
    (ontable kitchen_24)
    (ontable lid_01)
    (ontable container_07)
    (handempty)
    (clear kitchen_06)
    (clear kitchen_09)
    (clear kitchen_12)
    (clear kitchen_27)
    (clear kitchen_24)
    (clear lid_01)
    (clear container_07)
  )
  (:goal (and ))
)