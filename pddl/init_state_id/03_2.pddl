(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_01_1 kitchen_01_2 kitchen_11 kitchen_13 - item
    container_04 - container
  )
  (:init
    (ontable kitchen_01_1)
    (ontable kitchen_01_2)
    (ontable kitchen_11)
    (ontable kitchen_13)
    (ontable container_04)
    (clear kitchen_01_1)
    (clear kitchen_01_2)
    (clear kitchen_11)
    (clear kitchen_13)
    (clear container_04)
    (handempty)
  )
  (:goal (and ))
)