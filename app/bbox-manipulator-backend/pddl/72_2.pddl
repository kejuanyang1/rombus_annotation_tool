(define (problem 72_2-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_01 - item
    kitchen_05 - item
    kitchen_07 - item
    kitchen_10 - item
    office_01 - item
    office_02 - item
  )
  (:init
    (on kitchen_05 office_02)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
