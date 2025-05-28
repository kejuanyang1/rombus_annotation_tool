(define (problem 01_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_07 - item
    kitchen_09 - item
    kitchen_11 - item
    kitchen_19 - item
    kitchen_23 - item
    container_02 - container
    container_09 - container
    lid_03 - lid
  )
  (:init
    (on kitchen_23 kitchen_07)
    (in kitchen_09 container_02)
    (closed container_09)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
