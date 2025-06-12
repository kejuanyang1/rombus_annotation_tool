(define (problem 09_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_04 - item
    kitchen_14 - item
    kitchen_22_1 - item
    kitchen_22_2 - item
    kitchen_32 - item
    container_08 - container
    lid_02 - lid
  )
  (:init
    (in kitchen_22_2 container_08)
    (closed container_08)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
