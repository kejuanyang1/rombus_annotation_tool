(define (problem scene1)
  (:domain manip)
  (:objects
    stapler - item
    scrapper - item
    blue stripper - item
    big screw - item
  )
  (:init
    (ontable stapler)
    (ontable scrapper)
    (ontable blue stripper)
    (ontable big screw)
    (clear stapler)
    (clear scrapper)
    (clear blue stripper)
    (clear big screw)
    (handempty)
  )
  (:goal (and ))
)