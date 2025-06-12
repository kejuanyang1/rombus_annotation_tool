(define (problem 37_0-goal)
  (:domain gripper-strips)
  (:objects
    shape_04 - item
    shape_05_1 - item
    shape_05_2 - item
    shape_25_1 - item
    shape_25_2 - item
    shape_26 - item
    container_05 - container
  )
  (:init
    (on shape_25_2 shape_25_1)
    (in shape_05_1 container_05)
    (in shape_05_2 container_05)
    (in shape_26 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
