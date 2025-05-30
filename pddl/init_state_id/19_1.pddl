(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_03 - item
    kitchen_05 - item
    kitchen_07 - item
    kitchen_17 - item
    kitchen_25 - support
    container_07 - container
    container_10 - container
    lid_01 - lid
    lid_04 - lid
  )
  (:init
    (ontable kitchen_03)
    (ontable kitchen_07)
    (ontable kitchen_17)
    (ontable kitchen_25)
    (ontable lid_01)
    (ontable container_10)
    (in kitchen_05 container_07)
    (on lid_04 container_10)
    (closed container_10)
    (handempty)
    (clear kitchen_03)
    (clear kitchen_07)
    (clear kitchen_17)
    (clear kitchen_25)
    (clear lid_01)
    (clear container_07)
  )
  (:goal (and ))
)