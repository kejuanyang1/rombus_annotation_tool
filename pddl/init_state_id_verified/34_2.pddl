(define (problem generated)
  (:domain manip)
  (:objects
    container_02 - container
    other_01 other_02 other_03 other_04 - item
  )
  (:init
    (clear other_01)
    (clear other_02)
    (clear other_03)
    (clear other_04)
    (handempty)
    (in other_02 container_02)
    (in other_03 container_02)
    (in other_04 container_02)
    (ontable container_02)
    (ontable other_01)
  )
  (:goal (and))
)
