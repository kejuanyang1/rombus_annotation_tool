(define (problem scene1)
  (:domain manip)
  (:objects
    shape_02_1 shape_02_2 - support
    shape_17 - support
    shape_18_1 shape_18_2 - item
    shape_22 - support
    shape_25 - item
    shape_26 - item
  )
  (:init
    (ontable shape_02_1)
    (on shape_25 shape_02_1)
    (ontable shape_17)
    (on shape_02_2 shape_17)
    (ontable shape_22)
    (ontable shape_26)
    (ontable shape_18_1)
    (ontable shape_18_2)
    (clear shape_17)
    (clear shape_22)
    (clear shape_26)
    (handempty)
  )
  (:goal (and ))
)