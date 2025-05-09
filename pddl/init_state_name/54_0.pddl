(define (problem scene1)
  (:domain manip)
  (:objects
    red cylinder - item
    long yellow block_1 long yellow block_2 - support
    small blue cube - support
    flat blue block_1 flat blue block_2 - support
    green cylinder - item
  )
  (:init
    (ontable red cylinder)
    (ontable long yellow block_1)
    (ontable long yellow block_2)
    (ontable small blue cube)
    (ontable flat blue block_1)
    (ontable flat blue block_2)
    (ontable green cylinder)
    (clear red cylinder)
    (clear long yellow block_1)
    (clear long yellow block_2)
    (clear small blue cube)
    (clear flat blue block_1)
    (clear flat blue block_2)
    (clear green cylinder)
    (handempty)
  )
  (:goal (and ))
)