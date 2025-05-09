(define (problem scene1)
  (:domain manip)
  (:objects
    bunch of green grapes - item
    carrot - item
    green romaine lettuce - item
    big corn - item
    carton of coconut water - item
    yellow corn can - item
  )
  (:init
    (ontable bunch of green grapes)
    (ontable carrot)
    (ontable green romaine lettuce)
    (ontable big corn)
    (ontable carton of coconut water)
    (ontable yellow corn can)
    (clear bunch of green grapes)
    (clear carrot)
    (clear green romaine lettuce)
    (clear big corn)
    (clear carton of coconut water)
    (clear yellow corn can)
    (handempty)
  )
  (:goal (and ))
)