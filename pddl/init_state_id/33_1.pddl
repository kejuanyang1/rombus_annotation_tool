(define (problem scene1)
  (:domain manip)
  (:objects
    other_01 - item
    other_02 - item
    other_03 - support
    other_04 - support
    container_03 - container
    container_06 - container
  )
  (:init
    (ontable other_01)
    (ontable other_04)
    (in other_02 container_03)
    (in other_03 container_06)
    (clear other_01)
    (clear other_04)
    (handempty)
  )
  (:goal (and ))
)