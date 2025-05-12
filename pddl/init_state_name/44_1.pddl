(define (problem initial-state)
  (:domain manip)
  (:objects
    long red block_1 long red block_2 - support
    flat blue block - support
    large blue triangular prism_1 large blue triangular prism_2 - item
    small green cube - support
    large green triangular prism - item
    small green triangular prism - item
  )
  (:init
    (ontable long red block_1)
    (ontable flat blue block)
    (ontable small green cube)
    (ontable large green triangular prism)
    (ontable small green triangular prism)
    (ontable large blue triangular prism_1)
    (ontable long red block_2)
    (ontable large blue triangular prism_2)
    (handempty)
  )
  (:goal (and))
)