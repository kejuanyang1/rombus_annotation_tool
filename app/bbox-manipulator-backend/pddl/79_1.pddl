(define (problem 79_1-goal)
  (:domain gripper-strips)
  (:objects
    kitchen_17 - item
    kitchen_25 - item
    kitchen_26 - item
    office_02 - item
    container_01 - container
    container_04 - container
  )
  (:init
    (in kitchen_25 container_01)
    (in office_02 container_01)
    (in kitchen_26 container_01)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
