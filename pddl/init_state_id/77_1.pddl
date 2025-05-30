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
    (ontable kitchen_11)
    (ontable office_06)
    (in kitchen_09 container_04)
    (ontable container_02)
    (ontable container_04)
    (clear kitchen_06)
    (clear kitchen_11)
    (clear office_06)
    (clear container_02)
    (clear container_04)
    (handempty)
  )
  (:goal (and ))
)