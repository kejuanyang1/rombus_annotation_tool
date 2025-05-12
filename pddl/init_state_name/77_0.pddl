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
    (in potato big green shopping basket)
    (in bunch of green grapes blue basket)
    (ontable green pear)
    (ontable glue stick)
    (clear green pear)
    (clear glue stick)
    (handempty)
  )
  (:goal (and ))
)