(define (problem scene1)
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
    (on large green triangular prism long red block_1)
    (ontable flat blue block)
    (on long red block_2 flat blue block)
    (ontable small green cube)
    (ontable small green triangular prism)
    (ontable large blue triangular prism_1)
    (ontable large blue triangular prism_2)
    (clear flat blue block)
    (clear small green cube)
    (clear small green triangular prism)
    (handempty)
  )
  (:goal (and ))
)