(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_14 - item
    kitchen_15 - item
    kitchen_20 - item
    kitchen_21 - item
    kitchen_30 - item
    container_01 - container
  )
  (:init
    (ontable kitchen_14)
    (ontable kitchen_15)
    (ontable kitchen_20)
    (ontable kitchen_21)
    (in kitchen_30 container_01)
    (clear kitchen_14)
    (clear kitchen_15)
    (clear kitchen_20)
    (clear kitchen_21)
    (handempty)
  )
  (:goal (and ))
)