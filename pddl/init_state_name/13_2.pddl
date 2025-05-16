(define (problem scene1)
  (:domain manip)
  (:objects
    yellow lemon_1 yellow lemon_2 red chili pepper green romaine lettuce carton of coconut water - item
    blue bowl orange bowl - container
    blue lid orange lid - lid
  )
  (:init
    (ontable yellow lemon_1)
    (ontable yellow lemon_2)
    (ontable red chili pepper)
    (ontable green romaine lettuce)
    (ontable carton of coconut water)
    (closed blue bowl)
    (closed orange bowl)
    (on blue lid blue bowl)
    (on orange lid orange bowl)
    (handempty)
    (clear yellow lemon_1)
    (clear yellow lemon_2)
    (clear red chili pepper)
    (clear green romaine lettuce)
    (clear carton of coconut water)
  )
  (:goal (and ))
)