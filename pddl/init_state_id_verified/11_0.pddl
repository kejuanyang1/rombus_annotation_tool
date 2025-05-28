(define (problem generated)
  (:domain manip)
  (:objects
    container_04 - container
    kitchen_03 kitchen_08 kitchen_15 kitchen_21 - item
  )
  (:init
    (clear kitchen_03)
    (clear kitchen_08)
    (clear kitchen_15)
    (clear kitchen_21)
    (handempty)
    (in kitchen_21 container_04)
    (ontable container_04)
    (ontable kitchen_03)
    (ontable kitchen_08)
    (ontable kitchen_15)
  )
  (:goal (and))
)
