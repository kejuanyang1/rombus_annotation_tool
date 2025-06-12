(define (problem 03_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_01_1 - item
    kitchen_01_2 - item
    kitchen_11 - item
    kitchen_13 - item
    container_04 - container
  )
  (:init
    (in kitchen_01_2 container_04)
    (in kitchen_01_1 container_04)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
