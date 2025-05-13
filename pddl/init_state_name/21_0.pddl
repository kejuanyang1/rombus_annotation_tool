(define (problem scene1)
  (:domain manip)
  (:objects
    banana - item
    yellow lemon_1 yellow lemon_2 - item
    green romaine lettuce - item
    yellow jello box - support
    yellow corn can - item
    yellow plate - container
    orange bowl - container
    orange lid - lid
  )
  (:init
    (ontable banana)
    (ontable yellow lemon_1)
    (ontable yellow lemon_2)
    (ontable green romaine lettuce)
    (ontable yellow jello box)
    (ontable yellow corn can)
    (ontable yellow plate)
    (ontable orange lid)
    (ontable orange bowl)
    (clear banana)
    (clear yellow lemon_1)
    (clear yellow lemon_2)
    (clear green romaine lettuce)
    (clear yellow jello box)
    (clear yellow corn can)
    (clear yellow plate)
    (clear orange lid)
    (handempty)
  )
  (:goal (and ))
)