(define (problem generated)
  (:domain manip)
  (:objects
    container_04 - container
    kitchen_01_1 kitchen_01_2 kitchen_11 kitchen_13 - item
  )
  (:init
    (clear kitchen_01_1)
    (clear kitchen_01_2)
    (clear kitchen_11)
    (clear kitchen_13)
    (handempty)
    (in kitchen_11 container_04)
    (ontable container_04)
    (ontable kitchen_01_1)
    (ontable kitchen_01_2)
    (ontable kitchen_13)
  )
  (:goal (and))
)
