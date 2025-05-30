(define (problem scene1)
  (:domain manip)
  (:objects
    shape_12_1 - item
    shape_12_2 - item
    shape_14 - item
    shape_16 - support
    shape_19_1 - item
    shape_19_2 - item
    shape_25_1 - item
    shape_25_2 - item
    container_01 - container
    container_06 - container
  )
  (:init
    (ontable shape_12_1)
    (ontable shape_12_2)
    (ontable shape_14)
    (ontable shape_16)
    (ontable shape_19_1)
    (ontable shape_19_2)
    (ontable shape_25_1)
    (ontable shape_25_2)
    (ontable container_01)
    (ontable container_06)
    (clear shape_12_1)
    (clear shape_12_2)
    (clear shape_14)
    (clear shape_16)
    (clear shape_19_1)
    (clear shape_19_2)
    (clear shape_25_1)
    (clear shape_25_2)
    (clear container_01)
    (clear container_06)
    (handempty)
  )
  (:goal (and ))
)