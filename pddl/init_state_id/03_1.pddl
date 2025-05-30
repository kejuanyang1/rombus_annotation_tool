(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_01_1 kitchen_01_2 - item
    kitchen_11 - item
    kitchen_13 - item
    container_04 - container
  )
  (:init
    (ontable kitchen_01_1)
    (ontable kitchen_01_2)
    (ontable kitchen_13)
    (in kitchen_11 container_04)
    (clear kitchen_01_1)
    (clear kitchen_01_2)
    (clear kitchen_13)
    (handempty)
  )
  (:goal (and ))
)