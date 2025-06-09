(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_04 - item
    kitchen_10 - item
    kitchen_26 - support
    kitchen_27 - item
    kitchen_28 - item
  )
  (:init
    (ontable kitchen_04)
    (ontable kitchen_10)
    (ontable kitchen_26)
    (ontable kitchen_27)
    (ontable kitchen_28)
    (clear kitchen_04)
    (clear kitchen_10)
    (clear kitchen_26)
    (clear kitchen_27)
    (clear kitchen_28)
    (handempty)
  )
  (:goal (and ))
)