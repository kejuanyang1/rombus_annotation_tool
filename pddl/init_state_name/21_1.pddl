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
    (ontable green romaine lettuce)
    (ontable yellow jello box)
    (ontable yellow corn can)
    (ontable orange lid)
    (on yellow lemon_1 yellow plate)
    (in yellow lemon_2 orange bowl)
    (ontable yellow plate)
    (ontable orange bowl)
    (clear banana)
    (clear yellow lemon_1)
    (clear green romaine lettuce)
    (clear yellow jello box)
    (clear yellow corn can)
    (clear orange lid)
    (clear yellow plate)
    (clear orange bowl)
    (handempty)
  )
  (:goal (and ))
)