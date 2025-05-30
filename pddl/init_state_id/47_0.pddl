(define (problem scene1)
  (:domain manip)
  (:objects
    shape_03_1 shape_03_2 shape_04 shape_09 shape_15_1 shape_15_2 shape_16 shape_27 - pickable
    container_02 container_06 - container
  )
  (:init
    (ontable shape_03_2)
    (ontable shape_04)
    (ontable shape_09)
    (ontable shape_15_1)
    (ontable shape_15_2)
    (ontable shape_16)
    (ontable shape_27)
    (ontable container_02)
    (ontable container_06)
    (in shape_03_1 container_02)
    (handempty)
  )
  (:goal (and ))
)