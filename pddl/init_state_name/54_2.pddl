(define (problem scene1)
  (:domain manip)
  (:objects
    red cylinder - item
    long yellow block_1 - support
    long yellow block_2 - support
    small blue cube - support
    flat blue block_1 - support
    flat blue block_2 - support
    green cylinder - item
  )
  (:init
    (ontable red cylinder)
    (ontable long yellow block_1)
    (ontable small blue cube)
    (ontable flat blue block_1)
    (ontable flat blue block_2)
    (on green cylinder red cylinder)
    (on long yellow block_2 flat blue block_2)
    (clear long yellow block_2)
    (clear green cylinder)
    (handempty)
  )
  (:goal (and))
)