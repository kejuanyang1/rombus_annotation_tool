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
    (ontable small blue cube_1)
    (ontable small blue cube_2)
    (ontable blue half cylinder)
    (ontable green half cylinder_1)
    (ontable green half cylinder_2)
    (ontable big green shopping basket)
    (clear large yellow triangular prism)
    (clear small blue cube_1)
    (clear small blue cube_2)
    (clear blue half cylinder)
    (clear green half cylinder_1)
    (clear green half cylinder_2)
    (clear big green shopping basket)
    (not (closed big green shopping basket))
    (handempty)
  )
  (:goal (and))
)