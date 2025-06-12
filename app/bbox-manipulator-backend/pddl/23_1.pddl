(define (problem 23_1-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_09 - item
    kitchen_17 - item
    kitchen_27 - item
    kitchen_28 - item
    kitchen_30 - item
    container_01 - container
    container_10 - container
    lid_04 - lid
  )
  (:init
    (in kitchen_09 container_10)
    (in kitchen_30 container_01)
    (in kitchen_27 container_01)
    (closed container_10)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
