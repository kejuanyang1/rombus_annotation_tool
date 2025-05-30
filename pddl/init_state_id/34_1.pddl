(define (problem scene1)
  (:domain manip)
  (:objects
    other_01 - item
    other_02 - item
    other_03 - support
    other_04 - support
    container_02 - container
  )
  (:init
    (ontable other_01)
    (ontable other_02)
    (ontable other_03)
    (ontable other_04)
    (ontable container_02)
    (clear other_01)
    (clear other_02)
    (clear other_03)
    (clear other_04)
    (clear container_02)
    (handempty)
  )
  (:goal (and ))
)