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
    (ontable carton of coconut water)
    (ontable can of Pringles chip)
    (ontable water bottle)
    (in red chili pepper big yellow shopping basket)
    (in green pear pink bowl)
    (ontable pink lid)
    (handempty)
    (clear carton of coconut water)
    (clear can of Pringles chip)
    (clear water bottle)
    (clear pink lid)
    (not (closed pink bowl))
  )
  (:goal (and ))
)