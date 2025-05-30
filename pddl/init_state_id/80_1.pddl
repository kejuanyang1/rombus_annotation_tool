(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_03 - item
    kitchen_19 - item
    kitchen_22 - item
    kitchen_23 - item
  )
  (:init
    (ontable kitchen_03)
    (ontable kitchen_19)
    (ontable kitchen_22)
    (ontable kitchen_23)
    (clear kitchen_03)
    (clear kitchen_19)
    (clear kitchen_22)
    (clear kitchen_23)
    (handempty)
  )
  (:goal (and ))
)