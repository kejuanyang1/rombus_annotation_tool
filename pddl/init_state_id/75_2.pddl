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
    (ontable kitchen_23)
    (ontable kitchen_29)
    (ontable office_08)
    (ontable container_03)
    (ontable container_05)
    (in kitchen_32 container_05)
    (clear kitchen_23)
    (clear kitchen_29)
    (clear office_08)
    (clear container_03)
    (handempty)
  )
  (:goal (and ))
)