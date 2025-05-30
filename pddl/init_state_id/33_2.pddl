(define (problem scene)
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
    (ontable other_02)
    (in other_03 container_06)
    (in other_04 container_03)
    (handempty)
    (clear other_01)
    (clear other_02)
  )
  (:goal (and ))
)