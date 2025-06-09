(define (problem scene1)
  (:domain manip)
  (:objects
    shape_04 - item
    shape_05_1 - item
    shape_05_2 - item
    shape_25_1 - item
    shape_25_2 - item
    shape_26 - item
    container_05 - container
  )
  (:init
    (ontable shape_04)
    (ontable shape_05_1)
    (ontable shape_25_1)
    (ontable shape_26)
    (in shape_05_2 container_05)
    (in shape_26 container_05)
    (clear shape_04)
    (clear shape_05_1)
    (clear shape_25_1)
    (clear shape_25_2)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)