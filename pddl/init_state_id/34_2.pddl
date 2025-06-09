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
    (in other_02 container_02)
    (in other_03 container_02)
    (in other_04 container_02)
    (handempty)
    (clear other_01)
  )
  (:goal (and))
)