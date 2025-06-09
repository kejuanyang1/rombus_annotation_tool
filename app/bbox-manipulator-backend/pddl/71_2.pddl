(define (problem 71_2-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_03 - item
    kitchen_15 - item
    kitchen_26 - item
    office_07 - item
    office_10 - item
    container_03 - container
  )
  (:init
    (in kitchen_26 container_03)
    (in kitchen_03 container_03)
    (in kitchen_15 container_03)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
