(define (problem 35_2-goal)
  (:domain gripper-strips)
  (:objects
    shape_11 - item
    shape_15_1 - item
    shape_15_2 - item
    shape_21 - item
    shape_28_1 - item
    shape_28_2 - item
    container_02 - container
  )
  (:init
    (on shape_28_1 shape_21)
    (in shape_15_2 container_02)
    (in shape_15_1 container_02)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
