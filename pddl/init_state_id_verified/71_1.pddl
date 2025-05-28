(define (problem generated)
  (:domain manip)
  (:objects
    container_03 - container
    kitchen_03 kitchen_15 kitchen_26 office_07 office_10 - item
  )
  (:init
    (clear kitchen_03)
    (clear kitchen_15)
    (clear office_07)
    (clear office_10)
    (handempty)
    (in kitchen_03 container_03)
    (on kitchen_15 kitchen_26)
    (ontable container_03)
    (ontable kitchen_26)
    (ontable office_07)
    (ontable office_10)
  )
  (:goal (and))
)
