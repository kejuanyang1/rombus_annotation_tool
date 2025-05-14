(define (problem scene1)
  (:domain manip)
  (:objects
    small yellow cube - support
    flat yellow block - support
    yellow cylinder - item
    yellow half cylinder - item
    small blue triangular prism - item
    big green shopping basket - container
    blue basket - container
  )
  (:init
    (ontable flat yellow block)
    (ontable yellow half cylinder)
    (ontable small blue triangular prism)
    (in small yellow cube blue basket)
    (in yellow cylinder blue basket)
    (handempty)
    (clear flat yellow block)
    (clear yellow half cylinder)
    (clear small blue triangular prism)
  )
  (:goal (and ))
)