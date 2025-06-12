(define (problem 36_0-goal)
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
    (on shape_08_1 shape_08_2)
    (on shape_06 shape_17)
    (on shape_21 shape_07)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
