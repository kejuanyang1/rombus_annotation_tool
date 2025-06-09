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
    (ontable shape_10)
    (ontable shape_13)
    (ontable shape_14)
    (ontable shape_19)
    (ontable container_02)
    (ontable container_04)
    (clear shape_08)
    (clear shape_10)
    (clear shape_13)
    (clear shape_14)
    (clear shape_19)
    (clear container_02)
    (clear container_04)
    (handempty)
  )
  (:goal (and ))
)