(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_01 - item
    kitchen_04 - item
    kitchen_08 - item
    kitchen_10 - item
    container_06 - container
    container_10 - container
    lid_04 - lid
  )
  (:init
    (ontable kitchen_01)
    (ontable kitchen_04)
    (ontable kitchen_08)
    (ontable kitchen_10)
    (ontable container_06)
    (ontable container_10)
    (ontable lid_04)
    (handempty)
    (clear kitchen_01)
    (clear kitchen_04)
    (clear kitchen_08)
    (clear kitchen_10)
    (clear container_06)
    (clear lid_04)
  )
  (:goal (and ))
)