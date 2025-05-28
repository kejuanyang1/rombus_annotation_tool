(define (problem generated)
  (:domain manip)
  (:objects
    container_02 container_04 - container
    shape_08 shape_10 shape_13 shape_14 shape_19 - item
  )
  (:init
    (clear shape_08)
    (clear shape_10)
    (clear shape_13)
    (clear shape_14)
    (clear shape_19)
    (handempty)
    (in shape_10 container_04)
    (in shape_19 container_02)
    (ontable container_02)
    (ontable container_04)
    (ontable shape_08)
    (ontable shape_13)
    (ontable shape_14)
  )
  (:goal (and))
)
