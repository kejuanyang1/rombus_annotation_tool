(define (problem 40_1-goal)
  (:domain gripper-strips)
  (:objects
    shape_01_1 - item
    shape_01_2 - item
    shape_02 - item
    shape_08_1 - item
    shape_08_2 - item
    shape_13 - item
    shape_14 - item
    shape_17 - item
    shape_22_1 - item
    shape_22_2 - item
  )
  (:init
    (on shape_01_2 shape_02)
    (on shape_01_1 shape_01_2)
    (on shape_08_1 shape_22_1)
    (on shape_08_2 shape_22_2)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
