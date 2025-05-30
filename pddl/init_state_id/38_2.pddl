(define (problem scene1)
  (:domain manip)
  (:objects
    shape_03 - support
    shape_07 - item
    shape_10 - support
    shape_11 - item
    shape_12 - item
    shape_14 - item
    shape_20 - item
  )
  (:init
    (ontable shape_03)
    (ontable shape_07)
    (ontable shape_10)
    (ontable shape_11)
    (ontable shape_12)
    (ontable shape_14)
    (ontable shape_20)
    (clear shape_03)
    (clear shape_07)
    (clear shape_10)
    (clear shape_11)
    (clear shape_12)
    (clear shape_14)
    (clear shape_20)
    (handempty)
  )
  (:goal (and ))
)