(define (problem 45_2-goal)
  (:domain gripper-strips)
  (:objects
    shape_01_1 - item
    shape_01_2 - item
    shape_09_1 - item
    shape_09_2 - item
    shape_14 - item
    shape_16 - item
    shape_20 - item
    container_01 - container
    container_04 - container
  )
  (:init
    (in shape_09_2 container_01)
    (in shape_14 container_01)
    (in shape_09_1 container_01)
    (in shape_16 container_04)
    (in shape_20 container_04)
  )
  (:goal
    (and
      ;; Add goal conditions here
    )
  )
)
