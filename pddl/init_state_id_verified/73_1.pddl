(define (problem generated)
  (:domain manip)
  (:objects
    container_05 - container
    kitchen_09 kitchen_21 kitchen_27 kitchen_28 - item
  )
  (:init
    (clear kitchen_09)
    (clear kitchen_21)
    (clear kitchen_27)
    (clear kitchen_28)
    (handempty)
    (in kitchen_21 container_05)
    (ontable container_05)
    (ontable kitchen_09)
    (ontable kitchen_27)
    (ontable kitchen_28)
  )
  (:goal (and))
)
