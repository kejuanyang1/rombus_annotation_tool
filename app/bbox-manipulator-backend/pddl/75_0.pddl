(define (problem 75_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_23 - item
    kitchen_29 - item
    kitchen_32 - item
    office_08 - item
    container_03 - container
    container_05 - container
  )
  (:init
    (in office_08 container_03)
    (in kitchen_32 container_03)
    (in kitchen_29 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
