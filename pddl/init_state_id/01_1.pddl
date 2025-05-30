(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_07 - item
    kitchen_09 - item
    kitchen_11 - item
    kitchen_19 - item
    kitchen_23 - item
    container_02 - container
    container_09 - container
    lid_03 - lid
  )
  (:init
    (ontable kitchen_07)
    (ontable kitchen_09)
    (ontable kitchen_19)
    (ontable kitchen_23)
    (ontable lid_03)
    (in kitchen_11 container_02)
    (ontable container_02)
    (ontable container_09)
    (handempty)
    (clear kitchen_07)
    (clear kitchen_09)
    (clear kitchen_19)
    (clear kitchen_23)
    (clear lid_03)
    (clear container_02)
    (clear container_09)
  )
  (:goal (and ))
)