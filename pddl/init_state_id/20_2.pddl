(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_06 - item
    kitchen_12 - item
    kitchen_19 - item
    kitchen_23 - item
    kitchen_27 - item
    kitchen_29 - item
  )
  (:init
    (ontable kitchen_06)
    (ontable kitchen_12)
    (ontable kitchen_19)
    (ontable kitchen_23)
    (ontable kitchen_27)
    (ontable kitchen_29)
    (clear kitchen_06)
    (clear kitchen_12)
    (clear kitchen_19)
    (clear kitchen_23)
    (clear kitchen_27)
    (clear kitchen_29)
    (handempty)
  )
  (:goal (and ))
)