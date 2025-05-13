(define (problem scene1)
  (:domain manip)
  (:objects
    apple - item
    green apple - item
    red onion - item
    small orange carrot - item
    blue basket - container
  )
  (:init
    (ontable apple)
    (ontable green apple)
    (ontable red onion)
    (in small orange carrot blue basket)
    (handempty)
    (clear apple)
    (clear green apple)
    (clear red onion)
    (clear small orange carrot)
  )
  (:goal (and ))
)