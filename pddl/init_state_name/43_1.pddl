(define (problem scene1)
  (:domain manip)
  (:objects
    red half cylinder - item
    flat blue block - support
    large blue triangular prism_1 - item
    large blue triangular prism_2 - item
    blue half cylinder - item
    small green cube - support
    green cylinder - item
    yellow basket - container
  )
  (:init
    (ontable blue half cylinder)
    (ontable small green cube)
    (ontable large blue triangular prism_2)
    (ontable green cylinder)
    (on red half cylinder green cylinder)
    (in large blue triangular prism_1 yellow basket)
    (in flat blue block yellow basket)
    (handempty)
  )
  (:goal (and ))
)