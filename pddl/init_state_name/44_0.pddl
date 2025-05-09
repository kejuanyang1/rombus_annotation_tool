(define (problem scene1)
  (:domain manip)
  (:objects
    long red block_1 - support
    long red block_2 - support
    flat blue block - support
    large blue triangular prism_1 - item
    large blue triangular prism_2 - item
    small green cube - support
    large green triangular prism - item
    small green triangular prism - item
  )
  (:init
    (ontable long red block_1)
    (ontable long red block_2)
    (ontable flat blue block)
    (ontable large blue triangular prism_1)
    (ontable large blue triangular prism_2)
    (ontable small green cube)
    (ontable large green triangular prism)
    (ontable small green triangular prism)
    (clear long red block_1)
    (clear long red block_2)
    (clear flat blue block)
    (clear large blue triangular prism_1)
    (clear large blue triangular prism_2)
    (clear small green cube)
    (clear large green triangular prism)
    (clear small green triangular prism)
    (handempty)
  )
  (:goal (and ))
)