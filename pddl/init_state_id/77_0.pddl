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
    (in kitchen_11 container_02)
    (in kitchen_06 container_04)
    (ontable kitchen_09)
    (ontable office_06)
    (clear kitchen_09)
    (clear office_06)
    (handempty)
  )
  (:goal (and ))
)