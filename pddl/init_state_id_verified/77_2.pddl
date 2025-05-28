(define (problem generated)
  (:domain manip)
  (:objects
    container_02 container_04 - container
    kitchen_06 kitchen_09 kitchen_11 office_06 - item
  )
  (:init
    (clear kitchen_06)
    (clear kitchen_09)
    (clear kitchen_11)
    (clear office_06)
    (handempty)
    (in kitchen_11 container_04)
    (in office_06 container_02)
    (ontable container_02)
    (ontable container_04)
    (ontable kitchen_06)
    (ontable kitchen_09)
  )
  (:goal (and))
)
