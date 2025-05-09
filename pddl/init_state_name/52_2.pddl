(define (problem scene1)
  (:domain manip)
  (:objects
    red cylinder - item
    red half cylinder - item
    large yellow triangular prism - item
    long green block - support
    green cylinder - item
    green half cylinder - item
  )
  (:init
    (ontable red cylinder)
    (ontable red half cylinder)
    (ontable large yellow triangular prism)
    (ontable long green block)
    (ontable green cylinder)
    (ontable green half cylinder)
    (clear red cylinder)
    (clear red half cylinder)
    (clear large yellow triangular prism)
    (clear long green block)
    (clear green cylinder)
    (clear green half cylinder)
    (handempty)
  )
  (:goal (and ))
)