(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_03 - item
    kitchen_09 - item
    kitchen_11 - item
    kitchen_15 - item
    kitchen_17 - item
    kitchen_21 - item
  )
  (:init
    (ontable kitchen_03)
    (ontable kitchen_09)
    (ontable kitchen_11)
    (ontable kitchen_15)
    (ontable kitchen_17)
    (ontable kitchen_21)
    (clear kitchen_03)
    (clear kitchen_09)
    (clear kitchen_11)
    (clear kitchen_15)
    (clear kitchen_17)
    (clear kitchen_21)
    (handempty)
  )
  (:goal (and ))
)