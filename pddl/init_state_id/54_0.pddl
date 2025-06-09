(define (problem scene1)
  (:domain manip)
  (:objects
    shape_06 - item
    shape_09_1 shape_09_2 - support
    shape_15 - support
    shape_17_1 shape_17_2 - support
    shape_27 - item
  )
  (:init
    (ontable shape_06)
    (ontable shape_09_1)
    (ontable shape_09_2)
    (ontable shape_15)
    (ontable shape_17_1)
    (ontable shape_17_2)
    (ontable shape_27)
    (clear shape_06)
    (clear shape_09_1)
    (clear shape_09_2)
    (clear shape_15)
    (clear shape_17_1)
    (clear shape_17_2)
    (clear shape_27)
    (handempty)
  )
  (:goal (and ))
)