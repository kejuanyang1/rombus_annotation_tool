(define (problem 43_2-goal)
  (:domain gripper-strips)
  (:objects
    shape_07 - item
    shape_17 - item
    shape_18_1 - item
    shape_18_2 - item
    shape_21 - item
    shape_22 - item
    shape_27 - item
    container_05 - container
  )
  (:init
    (on shape_21 shape_17)
    (in shape_18_2 container_05)
    (in shape_18_1 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
