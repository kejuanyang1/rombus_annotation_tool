(define (problem 36_1-goal)
  (:domain gripper-strips)
  (:objects
    shape_06 - item
    shape_07 - item
    shape_08_1 - item
    shape_08_2 - item
    shape_17 - item
    shape_21 - item
    shape_26 - item
    shape_27 - item
  )
  (:init
    (on shape_27 shape_06)
    (on shape_08_1 shape_08_2)
    (on shape_07 shape_21)
    (on shape_26 shape_08_1)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
