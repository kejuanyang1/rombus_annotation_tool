(define (problem 01_1-goal)
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
    (in kitchen_11 container_02)
    (in kitchen_07 container_09)
    (in kitchen_19 container_02)
    (closed container_09)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
