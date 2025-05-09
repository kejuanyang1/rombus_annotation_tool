(define (problem scene1)
  (:domain manip)
  (:objects
    potato - item
    garlic - item
    white radish - item
    can of Pringles chip - item
    black spoon - item
  )
  (:init
    (ontable potato)
    (ontable garlic)
    (ontable white radish)
    (ontable can of Pringles chip)
    (ontable black spoon)
    (clear potato)
    (clear garlic)
    (clear white radish)
    (clear can of Pringles chip)
    (clear black spoon)
    (handempty)
  )
  (:goal (and ))
)