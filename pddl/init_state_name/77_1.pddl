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
    (ontable potato)
    (ontable glue stick)
    (in green pear blue basket)
    (ontable big green shopping basket)
    (ontable blue basket)
    (clear bunch of green grapes)
    (clear potato)
    (clear glue stick)
    (clear big green shopping basket)
    (clear blue basket)
    (handempty)
  )
  (:goal (and ))
)