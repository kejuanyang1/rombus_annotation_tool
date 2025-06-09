(define (problem 71_1-goal)
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
    (in office_10 container_03)
    (in office_07 container_03)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
