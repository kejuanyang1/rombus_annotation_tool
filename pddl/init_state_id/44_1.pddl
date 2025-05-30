(define (problem initial-state)
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
    (ontable shape_17)
    (ontable shape_22)
    (ontable shape_25)
    (ontable shape_26)
    (ontable shape_18_1)
    (ontable shape_02_2)
    (ontable shape_18_2)
    (handempty)
  )
  (:goal (and))
)