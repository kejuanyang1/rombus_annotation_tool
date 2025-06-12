(define (problem 38_1-goal)
  (:domain gripper-strips)
  (:objects
    shape_03 - item
    shape_07 - item
    shape_10 - item
    shape_11 - item
    shape_12 - item
    shape_14 - item
    shape_20 - item
  )
  (:init
    (on shape_07 shape_14)
    (on shape_03 shape_10)
    (on shape_12 shape_11)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
