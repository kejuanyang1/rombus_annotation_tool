(define (problem scene1) (:domain manip)
  (:objects
    kitchen_06 - item
    kitchen_15 - item
    kitchen_26 - support
    kitchen_30 - item
  )
  (:init
    (ontable kitchen_06)
    (ontable kitchen_15)
    (ontable kitchen_26)
    (ontable kitchen_30)
    (clear kitchen_06)
    (clear kitchen_15)
    (clear kitchen_26)
    (clear kitchen_30)
    (handempty)
  )
  (:goal (and ))
)