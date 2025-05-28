(define (problem generated)
  (:domain manip)
  (:objects
    container_06 - container
    shape_02_1 shape_02_2 shape_12 shape_23 shape_24_1 shape_24_2 - item
  )
  (:init
    (clear shape_02_1)
    (clear shape_02_2)
    (clear shape_12)
    (clear shape_23)
    (clear shape_24_1)
    (clear shape_24_2)
    (handempty)
    (in shape_02_1 container_06)
    (in shape_02_2 container_06)
    (on shape_12 shape_23)
    (ontable container_06)
    (ontable shape_23)
    (ontable shape_24_1)
    (ontable shape_24_2)
  )
  (:goal (and))
)
