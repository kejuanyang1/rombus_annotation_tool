(define (problem 05_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_14 - item
    kitchen_15 - item
    kitchen_20 - item
    kitchen_21 - item
    kitchen_30 - item
    container_01 - container
  )
  (:init
    (in kitchen_20 container_01)
    (in kitchen_21 container_01)
    (in kitchen_14 container_01)
    (in kitchen_15 container_01)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
