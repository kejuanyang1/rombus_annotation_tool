(define (problem scene1)
  (:domain manip)
  (:objects
    shape_07 - item
    shape_17 - support
    shape_18_1 shape_18_2 - item
    shape_21 - item
    shape_22 - support
    shape_27 - item
    container_05 - container
  )
  (:init
    (ontable shape_07)
    (ontable shape_17)
    (ontable shape_18_1)
    (ontable shape_18_2)
    (ontable shape_21)
    (ontable shape_22)
    (ontable shape_27)
    (ontable container_05)
    (clear shape_07)
    (clear shape_17)
    (clear shape_18_1)
    (clear shape_18_2)
    (clear shape_21)
    (clear shape_22)
    (clear shape_27)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)