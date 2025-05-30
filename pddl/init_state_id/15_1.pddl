(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_05 - item
    kitchen_14 - item
    kitchen_25 - support
    kitchen_31 - item
    kitchen_34 - container
  )
  (:init
    (ontable kitchen_05)
    (ontable kitchen_25)
    (ontable kitchen_31)
    (on kitchen_14 kitchen_34)
    (handempty)
    (clear kitchen_05)
    (clear kitchen_25)
    (clear kitchen_31)
    (clear kitchen_14)
  )
  (:goal (and ))
)