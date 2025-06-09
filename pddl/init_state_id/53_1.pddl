(define (problem scene1)
  (:domain manip)
  (:objects
    shape_12_1 shape_12_2 shape_14 shape_16 shape_19_1 shape_19_2 shape_25_1 shape_25_2 - item
    container_01 container_06 - container
  )
  (:init
    (in shape_12_1 container_06)
    (ontable shape_12_2)
    (in shape_14 container_06)
    (in shape_16 container_01)
    (in shape_19_1 container_01)
    (ontable shape_19_2)
    (ontable shape_25_1)
    (ontable shape_25_2)
    (clear shape_12_2)
    (clear shape_19_2)
    (clear shape_25_1)
    (handempty)
  )
  (:goal (and ))
)