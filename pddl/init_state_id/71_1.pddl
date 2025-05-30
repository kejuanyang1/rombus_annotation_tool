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
    (ontable kitchen_26)
    (ontable office_10)
    (ontable office_07)
    (in kitchen_03 container_03)
    (on kitchen_15 kitchen_26)
    (clear kitchen_15)
    (clear office_10)
    (clear office_07)
    (handempty)
  )
  (:goal (and ))
)