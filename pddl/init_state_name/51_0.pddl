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
    (ontable small yellow cube)
    (ontable flat yellow block)
    (ontable yellow cylinder)
    (ontable yellow half cylinder)
    (ontable small blue triangular prism)
    (ontable big green shopping basket)
    (ontable blue basket)
    (clear small yellow cube)
    (clear flat yellow block)
    (clear yellow cylinder)
    (clear yellow half cylinder)
    (clear small blue triangular prism)
    (clear big green shopping basket)
    (clear blue basket)
    (handempty)
  )
  (:goal (and ))
)