(define (problem generated)
  (:domain manip)
  (:objects
    container_01 container_04 - container
    kitchen_17 kitchen_25 kitchen_26 office_02 - item
  )
  (:init
    (clear kitchen_17)
    (clear kitchen_25)
    (clear kitchen_26)
    (clear office_02)
    (handempty)
    (in office_02 container_01)
    (ontable container_01)
    (ontable container_04)
    (ontable kitchen_17)
    (ontable kitchen_25)
    (ontable kitchen_26)
  )
  (:goal (and))
)
