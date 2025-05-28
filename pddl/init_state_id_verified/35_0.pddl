(define (problem generated)
  (:domain manip)
  (:objects
    container_02 - container
    shape_11 shape_15_1 shape_15_2 shape_21 shape_28_1 shape_28_2 - item
  )
  (:init
    (clear shape_11)
    (clear shape_15_1)
    (clear shape_15_2)
    (clear shape_21)
    (clear shape_28_1)
    (clear shape_28_2)
    (handempty)
    (ontable container_02)
    (ontable shape_11)
    (ontable shape_15_1)
    (ontable shape_15_2)
    (ontable shape_21)
    (ontable shape_28_1)
    (ontable shape_28_2)
  )
  (:goal (and))
)
