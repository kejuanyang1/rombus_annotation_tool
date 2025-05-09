(define (problem scene1)
  (:domain manip)
  (:objects
    small yellow triangular prism_1 - item
    small yellow triangular prism_2 - item
    yellow half cylinder - item
    long blue block - support
    small blue triangular prism_1 - item
    small blue triangular prism_2 - item
    large green triangular prism_1 - item
    large green triangular prism_2 - item
    big yellow shopping basket - container
    green basket - container
  )
  (:init
    (ontable small yellow triangular prism_1)
    (ontable small yellow triangular prism_2)
    (ontable yellow half cylinder)
    (ontable long blue block)
    (ontable small blue triangular prism_1)
    (ontable small blue triangular prism_2)
    (ontable large green triangular prism_1)
    (ontable large green triangular prism_2)
    (ontable big yellow shopping basket)
    (ontable green basket)
    (clear small yellow triangular prism_1)
    (clear small yellow triangular prism_2)
    (clear yellow half cylinder)
    (clear long blue block)
    (clear small blue triangular prism_1)
    (clear small blue triangular prism_2)
    (clear large green triangular prism_1)
    (clear large green triangular prism_2)
    (clear big yellow shopping basket)
    (clear green basket)
    (handempty)
  )
  (:goal (and ))
)