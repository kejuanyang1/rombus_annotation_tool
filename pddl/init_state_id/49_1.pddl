(define (problem scene1)
  (:domain manip)
  (:objects
    shape_02_1 - support
    shape_02_2 - support
    shape_12 - item
    shape_23 - support
    shape_24_1 - support
    shape_24_2 - support
    container_06 - container
  )
  (:init
    (ontable shape_24_1)
    (ontable shape_24_2)
    (in shape_02_1 container_06)
    (in shape_02_2 container_06)
    (on shape_12 shape_23)
    (ontable shape_23)
    (clear shape_12)
    (clear shape_24_1)
    (clear shape_24_2)
    (clear shape_23)
    (handempty)
  )
  (:goal (and ))
)