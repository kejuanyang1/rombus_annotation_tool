(define (problem generated)
  (:domain manip)
  (:objects
    container_01 - container
    kitchen_14 kitchen_15 kitchen_20 kitchen_21 kitchen_30 - item
  )
  (:init
    (clear kitchen_14)
    (clear kitchen_15)
    (clear kitchen_20)
    (clear kitchen_21)
    (clear kitchen_30)
    (handempty)
    (in kitchen_30 container_01)
    (ontable container_01)
    (ontable kitchen_14)
    (ontable kitchen_15)
    (ontable kitchen_20)
    (ontable kitchen_21)
  )
  (:goal (and))
)
