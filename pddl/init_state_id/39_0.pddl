(define (problem scene1)
  (:domain manip)
  (:objects
    shape_05_1 shape_05_2 shape_06 shape_12 - item
    shape_16_1 shape_16_2 shape_23 - support
    container_05 - container
  )
  (:init
    (ontable shape_05_1)
    (ontable shape_05_2)
    (ontable shape_06)
    (ontable shape_12)
    (ontable shape_16_1)
    (ontable shape_16_2)
    (ontable shape_23)
    (ontable container_05)
    (clear shape_05_1)
    (clear shape_05_2)
    (clear shape_06)
    (clear shape_12)
    (clear shape_16_1)
    (clear shape_16_2)
    (clear shape_23)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)