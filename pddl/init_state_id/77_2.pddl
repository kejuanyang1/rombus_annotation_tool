(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_06 - item
    kitchen_09 - item
    kitchen_11 - item
    office_06 - item
    container_02 - container
    container_04 - container
  )
  (:init
    (ontable kitchen_06)
    (ontable kitchen_09)
    (in kitchen_11 container_04)
    (in office_06 container_02)
    (handempty)
    (clear kitchen_06)
    (clear kitchen_09)
    (clear container_02)
    (clear container_04)
  )
  (:goal (and ))
)