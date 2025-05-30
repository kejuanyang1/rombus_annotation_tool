(define (problem scene1)
  (:domain manip)
  (:objects
    shape_06 - item
    shape_07 - item
    shape_08_1 - support
    shape_08_2 - support
    shape_17 - support
    shape_21 - item
    shape_26 - item
    shape_27 - item
  )
  (:init
    (ontable shape_06)
    (ontable shape_07)
    (ontable shape_08_1)
    (ontable shape_08_2)
    (ontable shape_17)
    (ontable shape_21)
    (ontable shape_26)
    (ontable shape_27)
    (clear shape_06)
    (clear shape_07)
    (clear shape_08_1)
    (clear shape_08_2)
    (clear shape_17)
    (clear shape_21)
    (clear shape_26)
    (clear shape_27)
    (handempty)
  )
  (:goal (and))
)