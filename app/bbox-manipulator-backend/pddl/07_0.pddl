(define (problem 07_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_01 - item
    kitchen_04 - item
    kitchen_08 - item
    kitchen_10 - item
    container_06 - container
    container_10 - container
    lid_04 - lid
  )
  (:init
    (in kitchen_01 container_06)
    (in kitchen_10 container_10)
    (in kitchen_04 container_06)
    (closed container_10)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
