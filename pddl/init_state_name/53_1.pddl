(define (problem scene1)
  (:domain manip)
  (:objects
    small yellow triangular prism_1 small yellow triangular prism_2 yellow half cylinder long blue block small blue triangular prism_1 small blue triangular prism_2 large green triangular prism_1 large green triangular prism_2 - item
    big yellow shopping basket green basket - container
  )
  (:init
    (in small yellow triangular prism_1 green basket)
    (ontable small yellow triangular prism_2)
    (in yellow half cylinder green basket)
    (in long blue block big yellow shopping basket)
    (in small blue triangular prism_1 big yellow shopping basket)
    (ontable small blue triangular prism_2)
    (ontable large green triangular prism_1)
    (ontable large green triangular prism_2)
    (clear small yellow triangular prism_2)
    (clear small blue triangular prism_2)
    (clear large green triangular prism_1)
    (handempty)
  )
  (:goal (and ))
)