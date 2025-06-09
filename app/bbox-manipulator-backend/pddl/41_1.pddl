(define (problem 41_1-goal)
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
    (in shape_24_2 container_02)
    (in shape_23 container_02)
    (in shape_10_1 container_05)
    (in shape_10_2 container_05)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
