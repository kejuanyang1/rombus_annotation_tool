(define (problem scene1)
  (:domain manip)
  (:objects
    carrot - item
    green chili pepper - item
    green lime_1 - item
    green lime_2 - item
    purple jello box - support
    can of Pringles chip - container
    steel knife - item
  )
  (:init
    (ontable carrot)
    (ontable green chili pepper)
    (ontable green lime_1)
    (ontable green lime_2)
    (ontable purple jello box)
    (ontable can of Pringles chip)
    (ontable steel knife)
    (clear carrot)
    (clear green chili pepper)
    (clear green lime_1)
    (clear green lime_2)
    (clear purple jello box)
    (clear can of Pringles chip)
    (clear steel knife)
    (handempty)
  )
  (:goal (and ))
)