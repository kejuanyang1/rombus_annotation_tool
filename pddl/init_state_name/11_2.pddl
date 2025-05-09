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
    (ontable small orange carrot)
    (ontable blue basket)
    (clear apple)
    (clear green apple)
    (clear red onion)
    (clear small orange carrot)
    (clear blue basket)
    (handempty)
  )
  (:goal (and ))
)