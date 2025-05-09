(define (problem scene1)
  (:domain manip)
  (:objects
    apple - item
    green pear - item
    potato - item
    red onion - item
    red chili pepper - item
    small orange carrot - item
  )
  (:init
    (ontable apple)
    (ontable green pear)
    (ontable potato)
    (ontable red onion)
    (ontable red chili pepper)
    (ontable small orange carrot)
    (clear apple)
    (clear green pear)
    (clear potato)
    (clear red onion)
    (clear red chili pepper)
    (clear small orange carrot)
    (handempty)
  )
  (:goal (and ))
)