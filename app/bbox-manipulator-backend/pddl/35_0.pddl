(define (problem 35_0-goal)
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
    (on shape_15_1 shape_15_2)
    (on shape_21 shape_15_1)
    (in shape_28_2 container_02)
    (in shape_28_1 container_02)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
