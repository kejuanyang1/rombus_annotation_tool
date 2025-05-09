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
    (on red half cylinder flat blue block)
    (ontable flat blue block)
    (ontable large blue triangular prism_1)
    (ontable large blue triangular prism_2)
    (ontable blue half cylinder)
    (ontable small green cube)
    (ontable green cylinder)
    (ontable yellow basket)
    (clear red half cylinder)
    (clear large blue triangular prism_1)
    (clear large blue triangular prism_2)
    (clear blue half cylinder)
    (clear small green cube)
    (clear green cylinder)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)