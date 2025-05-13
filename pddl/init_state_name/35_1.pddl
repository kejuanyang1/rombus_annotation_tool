(define (problem scene1)
  (:domain manip)
  (:objects
    large yellow triangular prism - item
    small blue cube_1 - support
    small blue cube_2 - support
    blue half cylinder - item
    green half cylinder_1 - item
    green half cylinder_2 - item
    big green shopping basket - container
  )
  (:init
    (ontable large yellow triangular prism)
    (ontable small blue cube_2)
    (in small blue cube_1 big green shopping basket)
    (in blue half cylinder big green shopping basket)
    (ontable green half cylinder_1)
    (ontable green half cylinder_2)
    (clear large yellow triangular prism)
    (clear small blue cube_2)
    (clear green half cylinder_1)
    (clear green half cylinder_2)
    (clear big green shopping basket)
    (handempty)
  )
  (:goal (and ))
)