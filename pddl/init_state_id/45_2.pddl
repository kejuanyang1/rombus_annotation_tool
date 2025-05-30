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
    (ontable shape_01_2)
    (ontable shape_09_1)
    (ontable shape_09_2)
    (ontable shape_14)
    (ontable shape_16)
    (ontable shape_20)
    (ontable container_01)
    (ontable container_04)
    (clear shape_01_1)
    (clear shape_01_2)
    (clear shape_09_1)
    (clear shape_09_2)
    (clear shape_14)
    (clear shape_16)
    (clear shape_20)
    (clear container_01)
    (clear container_04)
    (handempty)
  )
  (:goal (and ))
)