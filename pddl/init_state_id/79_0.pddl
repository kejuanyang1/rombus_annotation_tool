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
    (ontable kitchen_25)
    (ontable kitchen_26)
    (ontable container_04)
    (ontable container_01)
    (in office_02 container_01)
    (clear kitchen_17)
    (clear kitchen_25)
    (clear kitchen_26)
    (clear container_04)
    (handempty)
  )
  (:goal (and ))
)