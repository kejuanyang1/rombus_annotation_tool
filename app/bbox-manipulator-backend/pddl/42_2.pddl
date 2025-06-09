(define (problem 42_2-goal)
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
    (on shape_03_2 shape_03_1)
    (on shape_24_2 shape_24_1)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
