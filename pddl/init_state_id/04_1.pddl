(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_12 - item
    kitchen_18 - item
    kitchen_22_1 kitchen_22_2 - item
    kitchen_25 - support
    kitchen_28 - item
    kitchen_32 - item
  )
  (:init
    (ontable kitchen_12)
    (ontable kitchen_18)
    (ontable kitchen_22_1)
    (ontable kitchen_22_2)
    (ontable kitchen_25)
    (ontable kitchen_28)
    (ontable kitchen_32)
    (clear kitchen_12)
    (clear kitchen_18)
    (clear kitchen_22_1)
    (clear kitchen_22_2)
    (clear kitchen_25)
    (clear kitchen_28)
    (clear kitchen_32)
    (handempty)
  )
  (:goal (and ))
)