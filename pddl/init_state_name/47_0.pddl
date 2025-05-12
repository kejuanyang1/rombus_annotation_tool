(define (problem scene1)
  (:domain manip)
  (:objects
    flat red block_1 flat red block_2 large red triangular prism long yellow block small blue cube_1 small blue cube_2 long blue block green cylinder - pickable
    big green shopping basket green basket - container
  )
  (:init
    (ontable flat red block_2)
    (ontable large red triangular prism)
    (ontable long yellow block)
    (ontable small blue cube_1)
    (ontable small blue cube_2)
    (ontable long blue block)
    (ontable green cylinder)
    (ontable big green shopping basket)
    (ontable green basket)
    (in flat red block_1 big green shopping basket)
    (handempty)
  )
  (:goal (and ))
)