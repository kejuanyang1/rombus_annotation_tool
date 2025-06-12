(define (problem 37_1-goal)
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
    (on shape_05_2 shape_05_1)
    (on shape_25_2 shape_04)
    (on shape_25_1 shape_25_2)
    (in shape_26 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
