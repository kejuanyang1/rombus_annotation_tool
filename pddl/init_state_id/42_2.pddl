(define (problem scene)
  (:domain manip)
  (:objects
    shape_03_1 shape_03_2 - support
    shape_04 - item
    shape_09 - support
    shape_20 - item
    shape_24_1 shape_24_2 - support
  )
  (:init
    (ontable shape_03_1)
    (ontable shape_03_2)
    (ontable shape_09)
    (ontable shape_24_1)
    (ontable shape_24_2)
    (on shape_04 shape_09)
    (on shape_20 shape_24_1)
    (clear shape_03_1)
    (clear shape_03_2)
    (clear shape_04)
    (clear shape_20)
    (clear shape_24_2)
    (handempty)
  )
  (:goal (and))
)