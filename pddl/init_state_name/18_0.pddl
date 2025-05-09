(define (problem scene1)
  (:domain manip)
  (:objects
    apple - item
    green pear - item
    white radish - item
    green chili pepper - item
    purple eggplant - item
    big corn - item
  )
  (:init
    (ontable apple)
    (ontable green pear)
    (ontable white radish)
    (ontable green chili pepper)
    (ontable purple eggplant)
    (ontable big corn)
    (clear apple)
    (clear green pear)
    (clear white radish)
    (clear green chili pepper)
    (clear purple eggplant)
    (clear big corn)
    (handempty)
  )
  (:goal (and ))
)