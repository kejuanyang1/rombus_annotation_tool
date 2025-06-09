(define (problem scene1)
  (:domain manip)
  (:objects
    shape_01_1 shape_01_2 - support
    shape_02 - support
    shape_08_1 shape_08_2 - support
    shape_13 shape_14 - item
    shape_17 - support
    shape_22_1 shape_22_2 - support
  )
  (:init
    (ontable shape_02)
    (ontable shape_08_1)
    (ontable shape_13)
    (ontable shape_14)
    (ontable shape_17)
    (ontable shape_22_1)
    (ontable shape_22_2)
    (ontable shape_01_1)
    (on shape_08_2 shape_01_2)
    (on shape_01_2 shape_22_2)
    (clear shape_08_2)
    (clear shape_14)
    (clear shape_13)
    (clear shape_17)
    (clear shape_02)
    (clear shape_08_1)
    (handempty)
  )
  (:goal (and ))
)