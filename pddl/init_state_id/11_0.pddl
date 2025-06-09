(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_03 - item
    kitchen_08 - item
    kitchen_15 - item
    kitchen_21 - item
    container_04 - container
  )
  (:init
    (ontable kitchen_03)
    (ontable kitchen_08)
    (ontable kitchen_15)
    (in kitchen_21 container_04)
    (handempty)
    (clear kitchen_03)
    (clear kitchen_08)
    (clear kitchen_15)
    (clear kitchen_21)
  )
  (:goal (and ))
)