(define (problem 21_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_01 - item
    kitchen_10_1 - item
    kitchen_10_2 - item
    kitchen_19 - item
    kitchen_26 - item
    kitchen_29 - item
    kitchen_33 - item
    container_08 - container
    lid_02 - lid
  )
  (:init
    (on kitchen_26 kitchen_33)
    (on kitchen_10_2 kitchen_26)
    (in kitchen_10_1 container_08)
    (closed container_08)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
