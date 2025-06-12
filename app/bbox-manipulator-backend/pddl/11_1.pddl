(define (problem 11_1-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_03 - item
    kitchen_08 - item
    kitchen_15 - item
    kitchen_21 - item
    container_04 - container
  )
  (:init
    (in kitchen_08 container_04)
    (in kitchen_03 container_04)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
