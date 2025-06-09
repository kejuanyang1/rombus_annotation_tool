(define (problem 54_1-goal)
  (:domain gripper-strips)
  (:objects
    shape_06 - item
    shape_09_1 - item
    shape_09_2 - item
    shape_15 - item
    shape_17_1 - item
    shape_17_2 - item
    shape_27 - item
  )
  (:init
    (on shape_17_2 shape_17_1)
    (on shape_15 shape_09_1)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
