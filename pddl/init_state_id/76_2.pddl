(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_02 - item
    kitchen_16 - item
    kitchen_30 - item
    kitchen_31 - item
    office_08  - item
  )
  (:init
    (ontable kitchen_02)
    (ontable kitchen_16)
    (ontable kitchen_30)
    (ontable kitchen_31)
    (ontable office_08)
    (clear kitchen_02)
    (clear kitchen_16)
    (clear kitchen_30)
    (clear kitchen_31)
    (clear office_08)
    (handempty)
  )
  (:goal (and ))
)