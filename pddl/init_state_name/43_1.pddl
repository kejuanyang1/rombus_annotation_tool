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
    (on red half cylinder green cylinder)
    (in large blue triangular prism_1 yellow basket)
    (in flat blue block yellow basket)
    (clear red half cylinder)
    (clear blue half cylinder)
    (clear small green cube)
    (clear large blue triangular prism_2)
    (clear large blue triangular prism_1)
    (clear flat blue block)
    (clear green cylinder)
    (handempty)
  )
  (:goal (and ))
)