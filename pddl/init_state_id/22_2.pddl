(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_01_1 - item
    kitchen_01_2 - item
    kitchen_12 - item
    kitchen_13 - item
    kitchen_23 - item
  )
  (:init
    (ontable kitchen_01_1)
    (ontable kitchen_01_2)
    (ontable kitchen_12)
    (ontable kitchen_13)
    (ontable kitchen_23)
    (clear kitchen_01_1)
    (clear kitchen_01_2)
    (clear kitchen_12)
    (clear kitchen_13)
    (clear kitchen_23)
    (handempty)
  )
  (:goal (and ))
)