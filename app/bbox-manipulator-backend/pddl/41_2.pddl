(define (problem 41_2-goal)
  (:domain gripper-strips)
  (:objects
    shape_01 - item
    shape_05_1 - item
    shape_05_2 - item
    shape_10_1 - item
    shape_10_2 - item
    shape_19_1 - item
    shape_19_2 - item
    shape_23 - item
    shape_24_1 - item
    shape_24_2 - item
    container_02 - container
    container_05 - container
  )
  (:init
    (on shape_19_2 shape_10_1)
    (in shape_24_2 container_02)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
