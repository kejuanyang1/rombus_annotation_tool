(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_03 - item
    kitchen_09 - item
    kitchen_16 - item
    kitchen_18 - item
    kitchen_20 - item
    kitchen_23 - item
  )
  (:init
    (ontable kitchen_03)
    (ontable kitchen_09)
    (ontable kitchen_16)
    (ontable kitchen_18)
    (ontable kitchen_20)
    (ontable kitchen_23)
    (clear kitchen_03)
    (clear kitchen_09)
    (clear kitchen_16)
    (clear kitchen_18)
    (clear kitchen_20)
    (clear kitchen_23)
    (handempty)
  )
  (:goal (and ))
)