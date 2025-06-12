(define (problem 17_1-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_06 - item
    kitchen_09 - item
    kitchen_12 - item
    kitchen_24 - item
    kitchen_27 - item
    container_07 - container
    lid_01 - lid
  )
  (:init
    (on kitchen_12 kitchen_24)
    (in kitchen_27 container_07)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
