(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_10 - item
    kitchen_18 - item
    kitchen_20 - item
    office_04  - item
  )
  (:init
    (ontable kitchen_10)
    (ontable kitchen_18)
    (ontable kitchen_20)
    (ontable office_04)
    (clear kitchen_10)
    (clear kitchen_18)
    (clear kitchen_20)
    (clear office_04)
    (handempty)
  )
  (:goal (and ))
)