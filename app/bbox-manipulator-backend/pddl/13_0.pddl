(define (problem 13_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_10_1 - item
    kitchen_10_2 - item
    kitchen_17 - item
    kitchen_19 - item
    kitchen_27 - item
    container_07 - container
    container_08 - container
    lid_01 - lid
    lid_02 - lid
  )
  (:init
    (in kitchen_10_2 container_08)
    (in kitchen_10_1 container_07)
    (closed container_08)
    (closed container_07)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
