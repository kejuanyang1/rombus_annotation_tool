(define (problem 42_0-goal)
  (:domain gripper-strips)
  (:objects
    shape_03_1 - item
    shape_03_2 - item
    shape_04 - item
    shape_09 - item
    shape_20 - item
    shape_24_1 - item
    shape_24_2 - item
  )
  (:init
    (on shape_03_2 shape_24_2)
    (on shape_03_1 shape_09)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
