(define (problem 19_1-goal)
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
    (on kitchen_03 kitchen_25)
    (in kitchen_05 container_07)
    (in kitchen_07 container_10)
    (closed container_10)
    (closed container_07)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
