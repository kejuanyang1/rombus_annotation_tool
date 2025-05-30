(define (problem scene1)
  (:domain manip)
  (:objects
    shape_11 - item
    shape_15_1 - support
    shape_15_2 - support
    shape_21 - item
    shape_28_1 - item
    shape_28_2 - item
    container_02 - container
  )
  (:init
    (ontable shape_11)
    (ontable shape_15_2)
    (in shape_15_1 container_02)
    (in shape_21 container_02)
    (ontable shape_28_1)
    (ontable shape_28_2)
    (clear shape_11)
    (clear shape_15_2)
    (clear shape_28_1)
    (clear shape_28_2)
    (clear container_02)
    (handempty)
  )
  (:goal (and ))
)