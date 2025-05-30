(define (problem scene1)
  (:domain manip)
  (:objects
    shape_01_1 shape_01_2 - support
    shape_09_1 shape_09_2 - support
    shape_14 - item
    shape_16 - support
    shape_20 - item
    container_01 container_04 - container
  )
  (:init
    (ontable shape_01_1)
    (ontable shape_16)
    (ontable shape_20)
    (ontable shape_09_1)
    (on shape_01_2 shape_09_1)
    (in shape_14 container_04)
    (in shape_09_2 container_01)
    (handempty)
  )
  (:goal (and ))
)