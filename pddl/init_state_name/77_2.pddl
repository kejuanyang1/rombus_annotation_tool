(define (problem scene1)
  (:domain manip)
  (:objects
    bunch of green grapes - item
    green pear - item
    potato - item
    glue stick - item
    big green shopping basket - container
    blue basket - container
  )
  (:init
    (ontable bunch of green grapes)
    (ontable green pear)
    (in potato blue basket)
    (in glue stick big green shopping basket)
    (handempty)
    (clear bunch of green grapes)
    (clear green pear)
    (clear big green shopping basket)
    (clear blue basket)
  )
  (:goal (and ))
)