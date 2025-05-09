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
    (ontable yellow cylinder)
    (ontable yellow half cylinder)
    (in small blue triangular prism big green shopping basket)
    (in flat yellow block blue basket)
    (closed big green shopping basket)
    (closed blue basket)
    (handempty)
    (clear small yellow cube)
    (clear yellow cylinder)
    (clear yellow half cylinder)
    (clear big green shopping basket)
    (clear blue basket)
  )
  (:goal (and ))
)