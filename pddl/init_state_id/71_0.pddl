(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_03 - item
    kitchen_15 - item
    kitchen_26 - support
    office_07 - item
    office_10 - item
    container_03 - container
  )
  (:init
    (ontable kitchen_03)
    (ontable kitchen_15)
    (ontable kitchen_26)
    (ontable office_07)
    (ontable office_10)
    (ontable container_03)
    (clear kitchen_03)
    (clear kitchen_15)
    (clear kitchen_26)
    (clear office_07)
    (clear office_10)
    (clear container_03)
    (handempty)
  )
  (:goal (and ))
)