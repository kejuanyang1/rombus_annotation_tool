(define (problem generated)
  (:domain manip)
  (:objects
    container_03 container_05 - container
    kitchen_23 kitchen_29 kitchen_32 office_08 - item
  )
  (:init
    (clear kitchen_23)
    (clear kitchen_29)
    (clear kitchen_32)
    (clear office_08)
    (handempty)
    (in kitchen_23 container_03)
    (in office_08 container_05)
    (ontable container_03)
    (ontable container_05)
    (ontable kitchen_29)
    (ontable kitchen_32)
  )
  (:goal (and))
)
