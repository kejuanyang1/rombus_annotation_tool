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
    (ontable shape_05_2)
    (in shape_05_1 container_05)
    (ontable shape_25_2)
    (in shape_25_1 container_05)
    (ontable shape_26)
    (clear shape_04)
    (clear shape_05_2)
    (clear shape_25_2)
    (clear shape_26)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)