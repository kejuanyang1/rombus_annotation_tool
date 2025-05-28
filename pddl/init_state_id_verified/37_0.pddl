(define (problem generated)
  (:domain manip)
  (:objects
    container_05 - container
    shape_04 shape_05_1 shape_05_2 shape_25_1 shape_25_2 shape_26 - item
  )
  (:init
    (clear shape_04)
    (clear shape_05_1)
    (clear shape_05_2)
    (clear shape_25_1)
    (clear shape_25_2)
    (clear shape_26)
    (handempty)
    (ontable container_05)
    (ontable shape_04)
    (ontable shape_05_1)
    (ontable shape_05_2)
    (ontable shape_25_1)
    (ontable shape_25_2)
    (ontable shape_26)
  )
  (:goal (and))
)
