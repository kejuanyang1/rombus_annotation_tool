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
    (ontable kitchen_21)
    (ontable container_04)
    (clear kitchen_03)
    (clear kitchen_08)
    (clear kitchen_15)
    (clear kitchen_21)
    (clear container_04)
    (handempty)
  )
  (:goal (and ))
)