(define (problem scene1)
  (:domain manip)
  (:objects
    red cylinder - item
    red half cylinder - item
    small yellow cube_1 - support
    small yellow cube_2 - support
    flat blue block - support
    blue half cylinder - item
    small green triangular prism - item
    green cylinder - item
  )
  (:init
    (ontable red cylinder)
    (ontable red half cylinder)
    (ontable small yellow cube_1)
    (ontable small yellow cube_2)
    (ontable flat blue block)
    (ontable blue half cylinder)
    (ontable small green triangular prism)
    (ontable green cylinder)
    (clear red cylinder)
    (clear red half cylinder)
    (clear small yellow cube_1)
    (clear small yellow cube_2)
    (clear flat blue block)
    (clear blue half cylinder)
    (clear small green triangular prism)
    (clear green cylinder)
    (handempty)
  )
  (:goal (and))
)