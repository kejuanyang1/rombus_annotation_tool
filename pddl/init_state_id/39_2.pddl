(define (problem scene1)
  (:domain manip)
  (:objects
    shape_05_1 shape_05_2 shape_06 shape_12 shape_16_1 shape_16_2 shape_23 - item
    container_05 - container
  )
  (:init
    (ontable shape_12)
    (ontable shape_16_1)
    (ontable shape_16_2)
    (ontable shape_23)
    (in shape_05_1 container_05)
    (in shape_06 container_05)
    (clear shape_12)
    (clear shape_16_1)
    (clear shape_16_2)
    (clear shape_23)
    (handempty)
  )
  (:goal (and ))
)