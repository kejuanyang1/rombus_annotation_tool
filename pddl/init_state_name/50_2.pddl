(define (problem scene1)
  (:domain manip)
  (:objects
    red cylinder - item
    large yellow triangular prism - item
    small yellow triangular prism_1 - item
    small yellow triangular prism_2 - item
    blue cylinder - item
    blue half cylinder - item
  )
  (:init
    (ontable red cylinder)
    (ontable large yellow triangular prism)
    (ontable small yellow triangular prism_1)
    (ontable small yellow triangular prism_2)
    (ontable blue cylinder)
    (ontable blue half cylinder)
    (clear red cylinder)
    (clear large yellow triangular prism)
    (clear small yellow triangular prism_1)
    (clear small yellow triangular prism_2)
    (clear blue cylinder)
    (clear blue half cylinder)
    (handempty)
  )
  (:goal (and ))
)