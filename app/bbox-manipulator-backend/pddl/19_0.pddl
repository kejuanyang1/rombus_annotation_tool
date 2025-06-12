(define (problem 19_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_03 - item
    kitchen_05 - item
    kitchen_07 - item
    kitchen_17 - item
    kitchen_25 - item
    container_07 - container
    container_10 - container
    lid_01 - lid
    lid_04 - lid
  )
  (:init
    (in kitchen_25 container_07)
    (in kitchen_17 container_10)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
