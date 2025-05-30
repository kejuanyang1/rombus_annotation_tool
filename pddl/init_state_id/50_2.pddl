(define (problem scene1)
  (:domain manip)
  (:objects
    shape_06 - item
    shape_11 - item
    shape_12_1 - item
    shape_12_2 - item
    shape_20 - item
    shape_21 - item
  )
  (:init
    (ontable shape_06)
    (ontable shape_11)
    (ontable shape_12_1)
    (ontable shape_12_2)
    (ontable shape_20)
    (ontable shape_21)
    (clear shape_06)
    (clear shape_11)
    (clear shape_12_1)
    (clear shape_12_2)
    (clear shape_20)
    (clear shape_21)
    (handempty)
  )
  (:goal (and ))
)