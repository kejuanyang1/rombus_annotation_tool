(define (problem 04_1-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_12 - item
    kitchen_18 - item
    kitchen_22_1 - item
    kitchen_22_2 - item
    kitchen_25 - item
    kitchen_28 - item
    kitchen_32 - item
  )
  (:init
    (on kitchen_12 kitchen_25)
    (on kitchen_22_1 kitchen_28)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
