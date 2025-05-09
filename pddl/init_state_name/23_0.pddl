(define (problem scene1)
  (:domain manip)
  (:objects
    green pear - item
    red chili pepper - item
    carton of coconut water - item
    can of Pringles chip - item
    water bottle - item
    big yellow shopping basket - container
    pink bowl - container
    pink lid - lid
  )
  (:init
    (ontable green pear)
    (ontable red chili pepper)
    (ontable carton of coconut water)
    (ontable water bottle)
    (ontable big yellow shopping basket)
    (ontable pink bowl)
    (in can of Pringles chip big yellow shopping basket)
    (on pink lid pink bowl)
    (closed pink bowl)
    (clear green pear)
    (clear red chili pepper)
    (clear carton of coconut water)
    (clear water bottle)
    (clear big yellow shopping basket)
    (handempty)
  )
  (:goal (and ))
)