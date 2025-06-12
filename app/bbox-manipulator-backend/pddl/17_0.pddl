(define (problem 17_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_06 - item
    kitchen_09 - item
    kitchen_12 - item
    kitchen_24 - item
    kitchen_27 - item
    container_07 - container
    lid_01 - lid
  )
  (:init
    (in kitchen_09 container_07)
    (in kitchen_12 container_07)
    (closed container_07)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
