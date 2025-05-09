(define (problem scene1)
  (:domain manip)
  (:objects
    bunch of red grapes - item
    yellow lemon - item
    yellow jello box - support
    carton of coconut water - item
    can of Pringles chip - item
  )
  (:init
    (ontable bunch of red grapes)
    (ontable yellow lemon)
    (ontable yellow jello box)
    (ontable carton of coconut water)
    (ontable can of Pringles chip)
    (clear bunch of red grapes)
    (clear yellow lemon)
    (clear yellow jello box)
    (clear carton of coconut water)
    (clear can of Pringles chip)
    (handempty)
  )
  (:goal (and ))
)