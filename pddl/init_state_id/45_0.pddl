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
    (in shape_01_1 container_01)
    (in shape_01_2 container_04)
    (in shape_09_1 container_01)
    (ontable shape_09_2)
    (ontable shape_14)
    (ontable shape_16)
    (ontable shape_20)
    (clear shape_09_2)
    (clear shape_14)
    (clear shape_16)
    (clear shape_20)
    (handempty)
  )
  (:goal (and))
)