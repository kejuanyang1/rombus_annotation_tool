(define (problem scene1)
  (:domain manip)
  (:objects
    shape_07 - item
    shape_17 - support
    shape_18_1 - item
    shape_18_2 - item
    shape_21 - item
    shape_22 - support
    shape_27 - item
    container_05 - container
  )
  (:init
    (ontable shape_21)
    (ontable shape_22)
    (ontable shape_18_2)
    (ontable shape_27)
    (on shape_07 shape_27)
    (in shape_18_1 container_05)
    (in shape_17 container_05)
    (handempty)
  )
  (:goal (and ))
)