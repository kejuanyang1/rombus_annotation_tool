(define (problem scene1)
  (:domain manip)
  (:objects
    shape_01 - support
    shape_05_1 shape_05_2 - item
    shape_10_1 shape_10_2 - support
    shape_19_1 shape_19_2 - item
    shape_23 - support
    shape_24_1 shape_24_2 - support
    container_02 container_05 - container
  )
  (:init
    (ontable shape_01)
    (ontable shape_24_1)
    (ontable shape_24_2)
    (ontable shape_19_1)
    (ontable shape_19_2)
    (in shape_10_1 container_02)
    (in shape_10_2 container_02)
    (in shape_23 container_02)
    (in shape_05_1 container_05)
    (in shape_05_2 container_05)
    (clear shape_01)
    (clear shape_23)
    (clear shape_24_1)
    (clear shape_19_1)
    (clear shape_19_2)
    (clear shape_05_2)
    (handempty)
  )
  (:goal (and ))
)