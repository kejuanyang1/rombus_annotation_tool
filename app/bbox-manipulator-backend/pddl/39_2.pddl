(define (problem 39_2-goal)
  (:domain gripper-strips)
  (:objects
    shape_05_1 - item
    shape_05_2 - item
    shape_06 - item
    shape_12 - item
    shape_16_1 - item
    shape_16_2 - item
    shape_23 - item
    container_05 - container
  )
  (:init
    (on shape_12 shape_05_2)
    (on shape_16_2 shape_16_1)
    (in shape_05_1 container_05)
    (in shape_23 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
