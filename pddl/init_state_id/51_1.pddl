(define (problem scene1)
  (:domain manip)
  (:objects
    shape_08 - support
    shape_10 - support
    shape_13 - item
    shape_14 - item
    shape_19 - item
    container_02 - container
    container_04 - container
  )
  (:init
    (ontable shape_08)
    (ontable shape_13)
    (ontable shape_14)
    (in shape_19 container_02)
    (in shape_10 container_04)
    (handempty)
    (clear shape_08)
    (clear shape_13)
    (clear shape_14)
    (clear container_02)
    (clear container_04)
  )
  (:goal (and ))
)