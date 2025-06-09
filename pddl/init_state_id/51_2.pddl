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
    (ontable shape_10)
    (ontable shape_14)
    (ontable shape_19)
    (in shape_08 container_04)
    (in shape_13 container_04)
    (handempty)
    (clear shape_10)
    (clear shape_14)
    (clear shape_19)
  )
  (:goal (and ))
)