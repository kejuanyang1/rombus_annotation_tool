(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_17 - item
    kitchen_25 - support
    kitchen_26 - support
    office_02 - item
    container_01 - container
    container_04 - container
  )
  (:init
    (ontable kitchen_17)
    (ontable office_02)
    (in kitchen_25 container_01)
    (in kitchen_26 container_04)
    (handempty)
    (clear kitchen_17)
    (clear office_02)
  )
  (:goal (and ))
)