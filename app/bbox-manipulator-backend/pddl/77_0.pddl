(define (problem 77_0-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_06 - item
    kitchen_09 - item
    kitchen_11 - item
    office_06 - item
    container_02 - container
    container_04 - container
  )
  (:init
    (in office_06 container_02)
    (in kitchen_09 container_02)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
