(define (problem scene1)
  (:domain manip)
  (:objects
    kitchen_23 - item
    kitchen_29 - item
    kitchen_32 - item
    office_08 - item
    container_03 - container
    container_05 - container
  )
  (:init
    (ontable kitchen_29)
    (ontable kitchen_32)
    (in kitchen_23 container_03)
    (in office_08 container_05)
    (handempty)
    (clear kitchen_29)
    (clear kitchen_32)
  )
  (:goal (and ))
)