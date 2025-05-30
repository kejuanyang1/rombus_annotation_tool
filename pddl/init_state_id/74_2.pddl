(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_07 - item
    kitchen_10 - item
    kitchen_14 - item
    kitchen_31 - item
    office_05 - item
  )
  (:init
    (ontable kitchen_07)
    (ontable kitchen_10)
    (ontable kitchen_14)
    (ontable office_05)
    (on kitchen_31 kitchen_14)
    (clear kitchen_31)
    (clear kitchen_07)
    (clear kitchen_10)
    (clear office_05)
    (handempty)
  )
  (:goal (and ))
)