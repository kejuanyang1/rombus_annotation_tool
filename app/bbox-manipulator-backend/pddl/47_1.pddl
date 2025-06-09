(define (problem 47_1-goal)
  (:domain gripper-strips)
  (:objects
    shape_03_1 - item
    shape_03_2 - item
    shape_04 - item
    shape_09 - item
    shape_15_1 - item
    shape_15_2 - item
    shape_16 - item
    shape_26 - item
    shape_27 - item
    container_02 - container
    container_06 - container
  )
  (:init
    (in shape_03_2 container_02)
    (in shape_04 container_02)
    (in shape_03_1 container_02)
    (in shape_09 container_06)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
