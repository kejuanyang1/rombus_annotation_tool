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
    (ontable kitchen_14)
    (ontable kitchen_25)
    (ontable kitchen_31)
    (ontable kitchen_34)
    (clear kitchen_05)
    (clear kitchen_14)
    (clear kitchen_25)
    (clear kitchen_31)
    (clear kitchen_34)
    (handempty)
  )
  (:goal (and ))
)