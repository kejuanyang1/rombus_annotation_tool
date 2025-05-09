(define (problem scene1)
  (:domain manip)
  (:objects
    flat red block - support
    red half cylinder - item
    flat yellow block - support
    large yellow triangular prism - item
    small yellow triangular prism - item
    yellow half cylinder - item
    blue cylinder - item
  )
  (:init
    (ontable flat red block)
    (ontable red half cylinder)
    (ontable flat yellow block)
    (ontable large yellow triangular prism)
    (ontable small yellow triangular prism)
    (ontable yellow half cylinder)
    (ontable blue cylinder)
    (clear flat red block)
    (clear red half cylinder)
    (clear flat yellow block)
    (clear large yellow triangular prism)
    (clear small yellow triangular prism)
    (clear yellow half cylinder)
    (clear blue cylinder)
    (handempty)
  )
  (:goal (and ))
)