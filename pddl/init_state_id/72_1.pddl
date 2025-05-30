(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_01 - item
    kitchen_05 - item
    kitchen_07 - item
    kitchen_10 - item
    office_01 - item
    office_02 - item
  )
  (:init
    (ontable kitchen_01)
    (ontable kitchen_05)
    (ontable kitchen_07)
    (ontable office_01)
    (ontable office_02)
    (on kitchen_10 office_02)
    (clear kitchen_01)
    (clear kitchen_05)
    (clear kitchen_07)
    (clear kitchen_10)
    (clear office_01)
    (clear office_02)
    (handempty)
  )
  (:goal (and ))
)