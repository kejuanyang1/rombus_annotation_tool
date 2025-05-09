(define (problem scene1)
  (:domain manip)
  (:objects
    apple - item
    green romaine lettuce - item
    green lime - item
    big corn - item
  )
  (:init
    (ontable apple)
    (ontable green romaine lettuce)
    (ontable green lime)
    (ontable big corn)
    (clear apple)
    (clear green romaine lettuce)
    (clear green lime)
    (clear big corn)
    (handempty)
  )
  (:goal (and ))
)