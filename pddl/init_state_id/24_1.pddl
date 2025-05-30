(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_11 - item
    kitchen_13 - item
    kitchen_16 - item
    kitchen_28 - item
    kitchen_24 - item
  )
  (:init
    (ontable kitchen_11)
    (ontable kitchen_13)
    (ontable kitchen_16)
    (ontable kitchen_28)
    (ontable kitchen_24)
    (clear kitchen_11)
    (clear kitchen_13)
    (clear kitchen_16)
    (clear kitchen_28)
    (clear kitchen_24)
    (handempty)
  )
  (:goal (and ))
)