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
    (ontable other_03)
    (ontable other_04)
    (ontable container_03)
    (ontable container_06)
    (clear other_01)
    (clear other_02)
    (clear other_03)
    (clear other_04)
    (clear container_03)
    (clear container_06)
    (handempty)
  )
  (:goal (and ))
)